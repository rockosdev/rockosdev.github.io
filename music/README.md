# Dynamic Flow Controller

[中文](#中文说明) | [English](#english)

---

## 中文说明

这是一个最小可运行的黑白视频文字流动排版示例项目。

它会播放 `source/video.mp4`，逐帧分析画面中的黑白区域，然后把：

- 白色区域排布成黑色中文
- 黑色区域排布成白色英文

文字会随着视频每一帧轮廓变化动态重新布局。

### 在线访问

如果 GitHub 用户名是 `rock`，仓库名是 `dynamic_flow_controller`，启用 GitHub Pages 后访问地址就是：

```text
https://rock.github.io/dynamic_flow_controller/
```

本仓库已调整为适合 GitHub Pages 部署：

- 根入口为 `index.html`
- 构建产物输出到 `docs/`
- 页面资源使用相对路径
- 提供 GitHub Actions 自动部署工作流

### 本地开发

安装依赖：

```bash
bun install
```

启动开发服务器：

```bash
bun run start
```

浏览器访问：

```text
http://127.0.0.1:3000/pages/bad-apple-outline.html
```

### 构建 GitHub Pages 静态站点

执行：

```bash
bun run build
```

构建后会生成：

```text
docs/
├─ index.html
├─ bad-apple-outline.js
└─ source/
   ├─ video.mp4
   └─ audio.mp3
```

本地预览构建结果：

```bash
bun run preview:docs
```

默认地址：

```text
http://127.0.0.1:4173/
```

### GitHub Pages 部署

#### 方式 1：GitHub Actions 自动部署（推荐）

仓库已包含：

```text
.github/workflows/deploy-pages.yml
```

你需要在 GitHub 仓库设置中：

1. 打开 **Settings**
2. 进入 **Pages**
3. 在 **Build and deployment** 中选择 **GitHub Actions**

之后推送到 `main` 分支即可自动部署。

#### 方式 2：手动发布 `docs/`

如果不使用 Actions：

1. 运行 `bun run build`
2. 提交生成后的 `docs/` 目录
3. 在 GitHub Pages 设置中选择从 `main` 分支的 `/docs` 发布

### 项目结构

```text
dynamic_flow_controller/
├─ .github/workflows/deploy-pages.yml
├─ index.html
├─ package.json
├─ README.md
├─ tsconfig.json
├─ pages/
│  ├─ bad-apple-outline.html
│  ├─ bad-apple-outline.ts
│  └─ bad-apple-outline-text.ts
├─ source/
│  ├─ video.mp4
│  ├─ audio.mp3
│  ├─ zh.txt
│  └─ en.txt
├─ src/
│  ├─ layout.ts
│  ├─ measurement.ts
│  ├─ analysis.ts
│  ├─ line-break.ts
│  └─ bidi.ts
└─ docs/  # bun run build 后生成
```

### 常见修改

#### 替换视频

把自己的黑白视频放到 `source/`，例如：

```text
source/my-video.mp4
```

然后同步修改：

- `pages/bad-apple-outline.html`
- `index.html`

中的视频路径。

#### 替换文字

编辑：

```text
pages/bad-apple-outline-text.ts
```

修改：

```ts
export const ZH_TEXT = `...`
export const EN_TEXT = `...`
```

#### 调整默认静音

编辑 `pages/bad-apple-outline.ts`：

```ts
const START_MUTED = true
```

### 性能调优

位于 `pages/bad-apple-outline.ts`：

- `ANALYSIS_SCALE`
- `MAX_DEVICE_PIXEL_RATIO`
- `LINE_HEIGHT`
- `FRAME_ANALYSIS_THRESHOLD`
- `MIN_RANGE_WIDTH`

建议优先调小 `ANALYSIS_SCALE` 和 `MAX_DEVICE_PIXEL_RATIO` 来减少卡顿。

---

## English

This is a minimal working demo of dynamic text flow layout driven by a black-and-white video.

The app plays `source/video.mp4`, analyzes each frame, and places:

- black Chinese text inside bright regions
- white English text inside dark regions

The text layout updates dynamically as the video silhouette changes frame by frame.

### Live URL

If the GitHub username is `rock` and the repository name is `dynamic_flow_controller`, the GitHub Pages URL will be:

```text
https://rock.github.io/dynamic_flow_controller/
```

This repository is now prepared for GitHub Pages deployment with:

- a root `index.html` entry
- static output in `docs/`
- relative asset paths
- a GitHub Actions deployment workflow

### Local development

Install dependencies:

```bash
bun install
```

Start the dev server:

```bash
bun run start
```

Open:

```text
http://127.0.0.1:3000/pages/bad-apple-outline.html
```

### Build for GitHub Pages

Run:

```bash
bun run build
```

This generates:

```text
docs/
├─ index.html
├─ bad-apple-outline.js
└─ source/
   ├─ video.mp4
   └─ audio.mp3
```

Preview the built site locally:

```bash
bun run preview:docs
```

Default preview URL:

```text
http://127.0.0.1:4173/
```

### GitHub Pages deployment

#### Option 1: Automatic deployment with GitHub Actions (recommended)

The repository includes:

```text
.github/workflows/deploy-pages.yml
```

In your GitHub repository settings:

1. Open **Settings**
2. Go to **Pages**
3. Under **Build and deployment**, choose **GitHub Actions**

After that, every push to `main` will deploy the site automatically.

#### Option 2: Publish `docs/` manually

If you do not want to use Actions:

1. Run `bun run build`
2. Commit the generated `docs/` directory
3. In GitHub Pages settings, publish from `/docs` on the `main` branch

### Common customizations

#### Replace the video

Put your own black-and-white video into `source/`, for example:

```text
source/my-video.mp4
```

Then update the video path in:

- `pages/bad-apple-outline.html`
- `index.html`

#### Replace the text

Edit:

```text
pages/bad-apple-outline-text.ts
```

Update:

```ts
export const ZH_TEXT = `...`
export const EN_TEXT = `...`
```

#### Change autoplay mute behavior

Edit `pages/bad-apple-outline.ts`:

```ts
const START_MUTED = true
```

### Performance tuning

Useful parameters in `pages/bad-apple-outline.ts`:

- `ANALYSIS_SCALE`
- `MAX_DEVICE_PIXEL_RATIO`
- `LINE_HEIGHT`
- `FRAME_ANALYSIS_THRESHOLD`
- `MIN_RANGE_WIDTH`

Reducing `ANALYSIS_SCALE` and `MAX_DEVICE_PIXEL_RATIO` is usually the easiest way to improve performance.
