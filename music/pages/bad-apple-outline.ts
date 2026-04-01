import { layoutNextLine, prepareWithSegments, type LayoutCursor, type PreparedTextWithSegments } from '../src/layout.ts'
import { EN_TEXT, ZH_TEXT } from './bad-apple-outline-text.ts'

type Range = [start: number, end: number]

type RowContainer = {
  y: number
  ranges: Range[]
}

type FrameContainers = {
  zh: RowContainer[]
  en: RowContainer[]
  signature: string
}

type TextPlacement = {
  x: number
  y: number
  text: string
  color: 'zh' | 'en'
}

type PreparedTrack = {
  prepared: PreparedTextWithSegments
  cursor: LayoutCursor
}

type VideoRect = {
  x: number
  y: number
  width: number
  height: number
}

const ZH_FONT_SIZE = 14
const EN_FONT_SIZE = 12
const LINE_HEIGHT = 16
const FRAME_ANALYSIS_THRESHOLD = 128
const MAX_DEVICE_PIXEL_RATIO = 1.5
const ANALYSIS_SCALE = 0.5
const START_MUTED = true
const RANGE_SNAP = 2
const MIN_RANGE_WIDTH = 10
const STROKE_BLUR = 0.5
const MAX_LAYOUT_RESETS = 8
const START_CURSOR: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }

const ZH_FONT = `${ZH_FONT_SIZE}px "Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`
const EN_FONT = `600 ${EN_FONT_SIZE}px "Helvetica Neue", Helvetica, Arial, sans-serif`

const stageNode = document.getElementById('stage')
if (!(stageNode instanceof HTMLCanvasElement)) throw new Error('#stage not found')
const videoNode = document.getElementById('source')
if (!(videoNode instanceof HTMLVideoElement)) throw new Error('#source not found')

const stage = stageNode
const video = videoNode
const stageContext = stage.getContext('2d', { alpha: false })
if (stageContext === null) throw new Error('2d context unavailable')
const stageCtx: CanvasRenderingContext2D = stageContext

const analysisCanvas = document.createElement('canvas')
const analysisContext = analysisCanvas.getContext('2d', { willReadFrequently: true })
if (analysisContext === null) throw new Error('analysis 2d context unavailable')
const analysisCtx: CanvasRenderingContext2D = analysisContext

const zhTrack = createPreparedTrack(ZH_TEXT, ZH_FONT)
const enTrack = createPreparedTrack(EN_TEXT, EN_FONT)

let lastFrameSignature = ''
let lastPlacements: TextPlacement[] = []
let rafId = 0
let videoFrameCallbackId: number | null = null
let renderScheduled = false

function createPreparedTrack(text: string, font: string): PreparedTrack {
  return {
    prepared: prepareWithSegments(text.replace(/\s+/g, ' ').trim(), font),
    cursor: { ...START_CURSOR },
  }
}

function cursorsEqual(left: LayoutCursor, right: LayoutCursor): boolean {
  return left.segmentIndex === right.segmentIndex && left.graphemeIndex === right.graphemeIndex
}

function cloneCursor(cursor: LayoutCursor): LayoutCursor {
  return { segmentIndex: cursor.segmentIndex, graphemeIndex: cursor.graphemeIndex }
}

function resetTrack(track: PreparedTrack): void {
  track.cursor = { ...START_CURSOR }
}

function nextTextSlice(track: PreparedTrack, width: number): { text: string, width: number } | null {
  const safeWidth = Math.max(1, width)

  for (let attempt = 0; attempt < MAX_LAYOUT_RESETS; attempt++) {
    const line = layoutNextLine(track.prepared, track.cursor, safeWidth)
    if (line === null) {
      resetTrack(track)
      continue
    }
    if (cursorsEqual(line.end, track.cursor)) {
      resetTrack(track)
      continue
    }

    track.cursor = cloneCursor(line.end)
    return { text: line.text, width: line.width }
  }

  return null
}

function updateCanvasSize(): { width: number, height: number, dpr: number } {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO)
  const cssWidth = Math.max(1, window.innerWidth)
  const cssHeight = Math.max(1, window.innerHeight)
  const pixelWidth = Math.max(1, Math.round(cssWidth * dpr))
  const pixelHeight = Math.max(1, Math.round(cssHeight * dpr))

  if (stage.width !== pixelWidth || stage.height !== pixelHeight) {
    stage.width = pixelWidth
    stage.height = pixelHeight
  }

  stageCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { width: cssWidth, height: cssHeight, dpr }
}

function getVideoRect(viewportWidth: number, viewportHeight: number): VideoRect {
  const videoWidth = Math.max(1, video.videoWidth)
  const videoHeight = Math.max(1, video.videoHeight)
  const scale = Math.min(viewportWidth / videoWidth, viewportHeight / videoHeight)
  const width = videoWidth * scale
  const height = videoHeight * scale
  return {
    x: (viewportWidth - width) / 2,
    y: (viewportHeight - height) / 2,
    width,
    height,
  }
}

function drawVideoFrame(ctx: CanvasRenderingContext2D, rect: VideoRect): void {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, stage.width, stage.height)
  ctx.drawImage(video, rect.x, rect.y, rect.width, rect.height)
}

function ensureAnalysisCanvas(width: number, height: number): void {
  if (analysisCanvas.width !== width) analysisCanvas.width = width
  if (analysisCanvas.height !== height) analysisCanvas.height = height
}

function luminanceFromPixel(data: Uint8ClampedArray, offset: number): number {
  return data[offset]! * 0.299 + data[offset + 1]! * 0.587 + data[offset + 2]! * 0.114
}

function snapRange(value: number): number {
  return Math.round(value / RANGE_SNAP) * RANGE_SNAP
}

function buildSignature(rows: RowContainer[]): string {
  let signature = ''
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]!
    signature += `${snapRange(row.y)}:`
    for (let rangeIndex = 0; rangeIndex < row.ranges.length; rangeIndex++) {
      const [start, end] = row.ranges[rangeIndex]!
      signature += `${snapRange(start)}-${snapRange(end)},`
    }
    signature += ';'
  }
  return signature
}

function scanFrame(rect: VideoRect): FrameContainers {
  const analysisWidth = Math.max(1, Math.round(rect.width * ANALYSIS_SCALE))
  const analysisHeight = Math.max(1, Math.round(rect.height * ANALYSIS_SCALE))
  const scaleX = rect.width / analysisWidth
  const scaleY = rect.height / analysisHeight
  const scaledLineHeight = Math.max(1, Math.round(LINE_HEIGHT * ANALYSIS_SCALE))

  ensureAnalysisCanvas(analysisWidth, analysisHeight)
  analysisCtx.clearRect(0, 0, analysisWidth, analysisHeight)
  analysisCtx.drawImage(video, 0, 0, analysisWidth, analysisHeight)

  const image = analysisCtx.getImageData(0, 0, analysisWidth, analysisHeight)
  const { data } = image
  const zh: RowContainer[] = []
  const en: RowContainer[] = []

  for (let y = Math.floor(scaledLineHeight / 2); y < analysisHeight; y += scaledLineHeight) {
    const zhRanges: Range[] = []
    const enRanges: Range[] = []
    let currentStart = 0
    let currentWhite = false
    let active = false

    for (let x = 0; x < analysisWidth; x++) {
      const offset = (y * analysisWidth + x) * 4
      const isWhite = luminanceFromPixel(data, offset) >= FRAME_ANALYSIS_THRESHOLD

      if (!active) {
        active = true
        currentStart = x
        currentWhite = isWhite
        continue
      }

      if (isWhite === currentWhite) continue
      pushRange(currentWhite ? zhRanges : enRanges, rect.x + currentStart * scaleX, rect.x + x * scaleX)
      currentStart = x
      currentWhite = isWhite
    }

    if (active) {
      pushRange(
        currentWhite ? zhRanges : enRanges,
        rect.x + currentStart * scaleX,
        rect.x + analysisWidth * scaleX,
      )
    }

    if (zhRanges.length > 0) zh.push({ y: rect.y + y * scaleY, ranges: zhRanges })
    if (enRanges.length > 0) en.push({ y: rect.y + y * scaleY, ranges: enRanges })
  }

  return {
    zh,
    en,
    signature: `${buildSignature(zh)}|${buildSignature(en)}`,
  }
}

function pushRange(ranges: Range[], start: number, end: number): void {
  if (end - start < MIN_RANGE_WIDTH) return
  ranges.push([start, end])
}

function layoutRows(rows: RowContainer[], track: PreparedTrack, color: 'zh' | 'en'): TextPlacement[] {
  const placements: TextPlacement[] = []

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]!
    for (let rangeIndex = 0; rangeIndex < row.ranges.length; rangeIndex++) {
      const [start, end] = row.ranges[rangeIndex]!
      const availableWidth = end - start - 1
      if (availableWidth < MIN_RANGE_WIDTH) continue

      const slice = nextTextSlice(track, availableWidth)
      if (slice === null || slice.text.length === 0) continue

      placements.push({
        x: start,
        y: row.y,
        text: slice.text,
        color,
      })
    }
  }

  return placements
}

function computePlacements(containers: FrameContainers): TextPlacement[] {
  resetTrack(zhTrack)
  resetTrack(enTrack)
  return [
    ...layoutRows(containers.zh, zhTrack, 'zh'),
    ...layoutRows(containers.en, enTrack, 'en'),
  ]
}

function drawPlacements(ctx: CanvasRenderingContext2D, placements: TextPlacement[]): void {
  ctx.textBaseline = 'middle'
  ctx.imageSmoothingEnabled = false

  for (let index = 0; index < placements.length; index++) {
    const placement = placements[index]!

    if (placement.color === 'zh') {
      ctx.font = ZH_FONT
      ctx.fillStyle = '#000'
      ctx.shadowColor = 'rgba(255,255,255,0.22)'
    } else {
      ctx.font = EN_FONT
      ctx.fillStyle = '#fff'
      ctx.shadowColor = 'rgba(0,0,0,0.28)'
    }

    ctx.shadowBlur = STROKE_BLUR
    ctx.fillText(placement.text, placement.x, placement.y)
  }

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
}

function renderFrame(): void {
  renderScheduled = false
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth === 0 || video.videoHeight === 0) {
    scheduleRender()
    return
  }

  const viewport = updateCanvasSize()
  const rect = getVideoRect(viewport.width, viewport.height)
  drawVideoFrame(stageCtx, rect)

  const containers = scanFrame(rect)
  if (containers.signature !== lastFrameSignature) {
    lastPlacements = computePlacements(containers)
    lastFrameSignature = containers.signature
  }

  drawPlacements(stageCtx, lastPlacements)
}

function requestAnimationRender(): void {
  if (renderScheduled) return
  renderScheduled = true
  rafId = requestAnimationFrame(() => {
    renderFrame()
  })
}

function scheduleRender(): void {
  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
    if (videoFrameCallbackId !== null) return
    videoFrameCallbackId = video.requestVideoFrameCallback(() => {
      videoFrameCallbackId = null
      requestAnimationRender()
      if (!video.paused && !video.ended) scheduleRender()
    })
    return
  }

  requestAnimationRender()
}

async function start(): Promise<void> {
  await document.fonts.ready

  if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
    await new Promise<void>(resolve => {
      video.addEventListener('loadedmetadata', () => resolve(), { once: true })
    })
  }

  video.defaultMuted = START_MUTED
  video.muted = START_MUTED
  video.loop = true

  try {
    await video.play()
  } catch {
    const resume = () => {
      void video.play()
      window.removeEventListener('pointerdown', resume)
    }
    window.addEventListener('pointerdown', resume, { once: true })
  }

  scheduleRender()
}

video.addEventListener('play', scheduleRender)
video.addEventListener('seeked', scheduleRender)
video.addEventListener('loadeddata', scheduleRender)
window.addEventListener('resize', scheduleRender)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') scheduleRender()
})
window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(rafId)
  if (videoFrameCallbackId !== null && 'cancelVideoFrameCallback' in HTMLVideoElement.prototype) {
    video.cancelVideoFrameCallback(videoFrameCallbackId)
  }
})

void start()