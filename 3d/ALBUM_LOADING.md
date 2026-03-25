# 3D Computer - Album Loading Overlay

## 目标

访问 `3d-computer` 时：

1. 首屏立刻展示 **3D 相册** 作为加载演示
2. 模型加载过程中显示进度
3. 模型加载完成后显示 **“点击进入”**
4. 点击后相册淡出移除，进入 3D 电脑场景

## 文件结构

- `index.html`
  - 增加 overlay：`#album-loading`
  - HUD：`#loading-text`、`#progress`、`#enter-btn`
- `album-loading.css`
  - 相册的 3D 动画样式（已作用域隔离，仅在 `#album-loading` 下生效）
- `assets/album/img/*.jpg`
  - 相册图片资源（默认 1~6 共 6 张）
- `js/main.js`
  - 加载进度更新 HUD
  - 加载完成后显示“点击进入”
  - 点击按钮后淡出移除 overlay

## 如何替换相册图片

直接替换下面目录中的图片即可：

```text
3d-computer/assets/album/img/1.jpg
...
3d-computer/assets/album/img/6.jpg
```

保持文件名不变即可自动生效。

## 本地运行（推荐）

不要直接双击打开 `index.html`（可能遇到模块/跨域限制），请用静态服务器：

```bash
cd /home/rock/Workspaces/3d
python -m http.server 5173 --directory 3d-computer
```

浏览器访问：

```text
http://localhost:5173/
```
