# 3D 项目说明文档

这是一个基于 **Three.js** 的前端 3D 展示项目。打开页面后，你会先看到一个 **3D 相册式加载页**，等模型加载完成后，点击“进入”，就可以进入一个 **3D 笔记本电脑场景**。

这个场景不只是展示一个电脑模型，还包含：

- 电脑屏幕中嵌入网页
- 可切换播放本地视频
- 环绕场景的“企鹅”模型
- 旗帜、粒子束、发光文字等特效
- 相机可拖动旋转查看
- 键盘快捷键可触发一些交互功能

如果你是小白，可以把这个项目理解成：

> 一个“用网页技术做出来的 3D 展示页面”。

---

## 1. 项目能做什么

这个项目当前主要实现了下面这些效果：

### 1）加载页

- 页面一打开，先显示一个旋转的 3D 相册
- 相册下方会显示模型加载进度
- 模型加载完成后，会出现“点击进入”按钮
- 点击后，加载层淡出，进入主场景

### 2）3D 主场景

- 加载一个笔记本电脑 3D 模型：`assets/models/laptop.glb`
- 自动把相机移动到合适的位置，优先看到“电脑 + 地心经纬网 + 企鹅轨道”的整体构图
- 支持鼠标拖动查看（OrbitControls）

### 3）电脑屏幕内容

- 屏幕里默认嵌入一个网页：`https://rockosdev.github.io/`
- 按 `V` 键后，屏幕可以切换成播放本地视频：`assets/textures/video.mp4`
- 再按一次 `V`，会切回网页

### 4）环境与特效

- 创建了一个类似“地核 / 经纬网”的球形环境氛围
- 加载了一个企鹅模型：`assets/models/qq.glb`
- 企鹅会围绕场景旋转
- 按 `R` 键可以开启/关闭：
  - 旗帜效果
  - 粒子束特效
  - 浮动文字效果

### 5）辅助功能

- 按 `U` 键恢复初始视角
- 有调试快捷键，可以微调屏幕位置、旋转、缩放
- 移动端总览基于“贴合视口固定层”思路处理，便于减少视口错位与滑动干扰

---

## 2. 项目目录结构说明

下面是这个项目的主要结构：

```text
3d/
├── index.html                # 页面入口
├── style.css                 # 预留样式文件（当前基本未使用）
├── album-loading.css         # 3D 相册加载层样式
├── README.md                 # 你现在看到的说明文档
├── README_EN.md              # 你现在看到的英文说明文档
├── js/
│   ├── main.js               # 主入口，负责场景装配与生命周期
│   └── modules/
│       ├── albumOverlay.js   # 加载页遮罩与进入流程
│       ├── earthOrbitSystem.js # 地心经纬网、企鹅轨道、旗帜与粒子特效
│       ├── modelLoader.js    # 电脑模型加载与材质处理
│       ├── screenExperience.js # 电脑屏幕、视频切换、调试快捷键
│       └── viewport.js       # 移动端视口判断与响应式辅助逻辑
└── assets/
    ├── album/
    │   └── img/              # 相册加载页使用的图片
    ├── models/
    │   ├── laptop.glb        # 电脑模型
    │   └── qq.glb            # 企鹅模型
    └── textures/
        ├── rain.jpg          # 旗帜/贴图纹理
        └── video.mp4         # 屏幕播放的视频
```

---

## 3. 每个文件是干什么的

## `index.html`

这是项目入口文件，浏览器打开后首先加载它。

它主要做了几件事：

- 定义基础 HTML 结构
- 通过 `importmap` 从 CDN 引入 Three.js
- 引入 `album-loading.css`
- 创建加载页 DOM 结构
- 引入 `js/main.js`

你可以把它理解为：

> “舞台搭建文件”，负责把页面骨架先放好。

---

## `js/main.js`

这是整个项目的主入口文件，现在主要负责把各个模块串起来。

主要包括：

- 创建 Three.js 场景、相机、渲染器
- 调用模型加载模块
- 创建灯光
- 创建 CSS3D 网页屏幕
- 管理加载页显示与隐藏
- 调用地心经纬网、企鹅轨道、特效模块
- 监听键盘事件
- 实现动画循环

你可以把它理解为：

> “总控文件”，自己保留核心流程，但把具体功能拆给 `js/modules/` 下的模块处理。

如果你以后要改功能，仍然可以先从这个文件看入口，但很多具体逻辑已经拆到模块里了。

---

## `js/modules/`

这是当前项目拆分后的功能模块目录。

### `albumOverlay.js`

负责加载页相关逻辑：

- 更新进度文字
- 显示“点击进入”
- 控制遮罩淡出

### `viewport.js`

负责响应式和移动端视口相关逻辑：

- 判断是否是移动端布局
- 采集移动端视口调试信息
- 控制 OrbitControls 在不同设备上的行为

### `screenExperience.js`

负责电脑屏幕相关逻辑：

- 创建屏幕内的网页和视频容器
- 处理 `V` 键切换视频
- 处理调试快捷键

### `modelLoader.js`

负责电脑模型加载逻辑：

- 加载 `laptop.glb`
- 统一处理模型材质

### `earthOrbitSystem.js`

负责场景里最明显的一组视觉效果：

- 地心经纬网球壳
- 企鹅轨道
- 企鹅模型运动
- 旗帜、粒子束、漂浮文字特效
- `R` 键开关特效

---

## `album-loading.css`

这个文件专门负责“加载页的 3D 相册动画样式”。

特点：

- 样式都写在 `#album-loading` 作用域下
- 不容易污染主页面其他元素
- 支持鼠标悬停展开图片
- 带进入按钮、加载进度、淡出动画

---

## `style.css`

当前项目里这个文件存在，但从现有代码来看，**主要样式并没有依赖它**。

也就是说：

- 它现在不是主要样式来源
- 以后你可以把公共样式整理进来

---

## 4. 这个项目用了哪些技术

### 1）HTML

负责页面结构。

### 2）CSS

负责页面样式、加载页动画、按钮样式等。

### 3）JavaScript

负责整个项目逻辑。

### 4）Three.js

这是最核心的 3D 库，用来实现：

- 场景（Scene）
- 相机（Camera）
- 渲染器（Renderer）
- 灯光（Light）
- 模型加载（GLTFLoader）
- 控制器（OrbitControls）
- 3D 对象和动画

### 5）CSS3DRenderer

这个功能来自 Three.js 扩展，作用是：

> 把 HTML 元素（比如 iframe）当成 3D 对象放进场景。

所以电脑屏幕里的网页，实际上不是直接贴到纹理上的，而是通过 CSS3D 的方式放进去的。

---

## 5. 项目运行原理（小白版）

你可以把页面运行过程理解为下面几步：

### 第一步：打开 `index.html`

浏览器先读取页面结构，并开始加载 `main.js`。

### 第二步：显示加载页

这时 3D 相册会先出现，避免用户看到空白页面。

### 第三步：加载 3D 模型

`main.js` 会使用 `GLTFLoader` 去加载：

- 电脑模型
- 企鹅相关资源
- 纹理资源

加载过程中，页面会显示百分比和资源大小。

### 第四步：模型加载完成

模型加载成功后：

- 相机会先切到“电脑 + 地心经纬网 + 企鹅轨道”的整体视角
- 创建电脑屏幕
- 创建环境特效
- 显示“点击进入”按钮

### 第五步：进入主场景

点击按钮后，加载层消失，用户开始与 3D 场景交互。

### 第六步：持续动画渲染

通过 `requestAnimationFrame()` 不断循环：

- 更新控制器
- 更新面板/特效动画
- 更新企鹅轨道运动
- 重新渲染场景

---

## 6. 核心功能详细说明

## 6.1 Three.js 基础部分

在 `main.js` 中，最基础的几项内容是：

- `scene`：3D 场景
- `camera`：透视相机
- `renderer`：WebGL 渲染器
- `cssRenderer`：CSS3D 渲染器
- `controls`：轨道控制器

简单理解：

- `scene` = 舞台
- `camera` = 摄像机
- `renderer` = 把舞台画到浏览器上
- `controls` = 让你能拖动画面

---

## 6.2 加载电脑模型

代码中使用：

```js
const loader = new GLTFLoader();
loader.load('./assets/models/laptop.glb', ...)
```

说明：

- `GLTFLoader` 用来读取 `.glb` / `.gltf` 3D 模型
- 当前加载的是一个电脑模型
- 加载完成后会把模型加入场景

另外，代码还对模型材质做了一些“修复”：

- 统一替换成 `MeshStandardMaterial`
- 处理贴图颜色空间

这样做通常是为了让模型显示更稳定。

---

## 6.3 自动对焦相机

项目中有一个 `autoFitCamera()` 函数。

它的作用是：

> 根据模型尺寸，自动把相机放到一个“能看清整个模型”的位置。

这样就不用你每次手动调相机了。

---

## 6.4 加载页逻辑

加载页相关元素有：

- `#album-loading`
- `#loading-text`
- `#progress`
- `#enter-btn`

主要逻辑：

- 加载中：显示“加载模型中...”和进度
- 加载完成：调用 `__markAlbumReadyToEnter()`
- 点击按钮：调用 `__dismissAlbumOverlay()`

这样用户体验会更自然，不会突然从空白页面跳到 3D 场景。

---

## 6.5 地心 / 经纬网环境

项目里有一个 `createEarthCoreEnvironment(model)` 函数。

它会根据电脑模型的位置和大小，在周围生成一个球形氛围层，包括：

- 球壳
- 经纬线
- 发光点光源
- 环形轨道

目的主要是增强视觉效果，让场景不只是一个单独的电脑模型，而更像一个“科幻展示空间”。

---

## 6.6 企鹅模型与轨道动画

项目会加载：

```text
assets/models/qq.glb
```

这个模型会沿着轨道不断旋转。

相关功能包括：

- 自动缩放到合适大小
- 计算轨道半径
- 设置朝向，让企鹅看起来沿前进方向飞行/移动
- 上下轻微浮动，增强动态感

---

## 6.7 旗帜、粒子束、悬浮文字

当你按下 `R` 键时，会触发 `togglePenguinFollowEffect()`。

开启后会显示：

- 旗帜贴图
- 粒子束
- 一段悬浮发光文字

这些效果本质上是：

- 用平面几何体做旗帜
- 动态修改顶点位置，模拟飘动
- 用粒子系统模拟尾迹
- 用 Canvas 生成文字贴图，再贴到平面或精灵上

如果你是小白，不需要一开始就完全看懂，只要知道：

> 这些炫酷效果本质上还是“几何体 + 贴图 + 动画”。

---

## 6.8 电脑屏幕中的网页和视频

项目没有直接把网页内容贴到模型材质上，而是用了 `CSS3DObject`。

逻辑大致是：

1. 创建一个 HTML 容器 `screenWrap`
2. 容器里放：
   - `iframe`
   - `video`
   - loading 提示
3. 再把这个容器包装成 `CSS3DObject`
4. 放到 3D 场景对应的屏幕位置

这样做的好处是：

- 网页是真实 HTML，可交互
- 视频也是真实视频标签
- 不需要把网页渲染成贴图

按 `V` 键后：

- 隐藏 iframe
- 显示 video
- 首次进入时才设置 `video.src`

这叫做：**懒加载**。

好处是：

> 首屏更快，不会一开始就去加载视频资源。

---

## 6.9 恢复初始视角

代码里记录了“模型刚加载完成时”的相机位置。

按下 `U` 键后，会执行恢复：

- `camera.position`
- `controls.target`
- `camera.zoom`

这个功能很实用，因为用户拖动场景后可能会迷路。

---

## 7. 键盘快捷键说明

这是当前项目里比较重要的快捷键：

| 按键 | 功能 |
|---|---|
| `R` | 开关企鹅旗帜 + 粒子束 + 文字特效 |
| `V` | 屏幕在网页 / 视频之间切换 |
| `U` | 恢复初始视角 |
| `↑ ↓ ← →` | 调整屏幕位置 |
| `W / S` | 前后移动屏幕 |
| `Q / E` | 旋转屏幕 X 轴 |
| `A / D` | 旋转屏幕 Y 轴 |
| `Z / X` | 旋转屏幕 Z 轴 |
| `+ / -` | 缩放屏幕 |
| `P` | 在控制台打印屏幕当前坐标 |

说明：

- 这些键多数是给开发调试用的
- 普通用户不一定需要全部会用
- 如果你后续要调屏幕位置，这些键非常有帮助

---

## 8. 如何运行这个项目

## 方法一：推荐，本地静态服务器运行

不要直接双击 `index.html` 打开。

原因是：

- `type="module"` 的 JS 文件
- 模型加载
- 视频资源
- 某些浏览器安全策略

都可能导致本地文件方式运行异常。

### 运行命令

在项目目录 `/home/rock/Workspaces/3d` 下运行：

```bash
python -m http.server 5173
```

然后浏览器打开：

```text
http://localhost:5173/
```

---

## 9. 如何修改项目内容

## 9.1 修改加载页图片

替换下面目录中的图片即可：

```text
assets/album/img/1.jpg
assets/album/img/2.jpg
assets/album/img/3.jpg
assets/album/img/4.jpg
assets/album/img/5.jpg
assets/album/img/6.jpg
```

最好保持文件名不变，这样就不用改 CSS。

---

## 9.2 修改电脑模型

替换：

```text
assets/models/laptop.glb
```

但是要注意：

- 新模型大小可能不同
- 屏幕位置可能不匹配
- `calculateLaptopGeometry()` 的估算逻辑可能要重新调

---

## 9.3 修改企鹅模型

替换：

```text
assets/models/qq.glb
```

如果替换后大小不对，可以去 `createOrbitRingAndPenguin()` 中调整缩放逻辑。

---

## 9.4 修改电脑屏幕显示的网址

在 `main.js` 里找到：

```js
iframe.src = 'https://rockosdev.github.io/';
```

把它改成你想展示的网址即可。

注意：

- 某些网站不允许被 iframe 嵌入
- 如果被拒绝，会显示空白或报错

这是浏览器安全策略，不一定是代码问题。

---

## 9.5 修改视频文件

替换：

```text
assets/textures/video.mp4
```

或者修改代码中的：

```js
video.dataset.src = './assets/textures/video.mp4';
```

---

## 9.6 修改旗帜贴图

当前旗帜会尝试读取：

```text
assets/textures/rain.jpg
```

如果你替换成别的图片，就能改变旗帜外观。

---

## 9.7 修改移动端总览相机参数

如果你想调整**手机端进入场景时的总览构图**，可以在 `js/main.js` 里找到这段核心配置：

```js
const MOBILE_OVERVIEW_CAMERA_COMPOSITION = {
    direction: new THREE.Vector3(0, 0.08, 1),
    padding: 1.72,
    targetNdc: new THREE.Vector2(0, 0),
    enableScreenSpaceCompensation: true
};
```

这 4 个参数就是移动端总览视角的主要调节入口。

### 1）核心代码是怎么生效的

上面的配置最终会在移动端总览逻辑里被使用：

```js
function applyResponsiveCameraFit() {
    if (__sceneFitRadius <= 0) return;

    const targetCenter = isMobileLayout()
        ? __mobileSceneFocusTarget.clone()
        : __sceneFocusTarget.clone();
    const fitRadius = isMobileLayout() && __mobileSceneFitRadius > 0
        ? __mobileSceneFitRadius
        : __sceneFitRadius;

    if (isMobileLayout()) {
        const direction = MOBILE_OVERVIEW_CAMERA_COMPOSITION.direction.clone().normalize();
        const fitDistance = getCameraFitDistance(fitRadius, MOBILE_OVERVIEW_CAMERA_COMPOSITION.padding);

        camera.position.copy(targetCenter).add(direction.multiplyScalar(fitDistance));
        controls.target.copy(targetCenter);
        camera.updateProjectionMatrix();
        controls.update();

        if (MOBILE_OVERVIEW_CAMERA_COMPOSITION.enableScreenSpaceCompensation) {
            applyMobileScreenSpaceCompensation();
        }
        return;
    }

    moveCameraBackToFitRadius(targetCenter, __sceneFitRadius, 1.2);
}
```

你可以把它理解成：

- `direction` 决定相机从哪个方向看过去
- `padding` 决定相机需要退多远才能把内容装下
- `targetCenter` 决定相机在看哪一个总览目标
- `enableScreenSpaceCompensation` 决定是否还要做一次屏幕空间上的“居中拉齐”

### 2）`direction` 是什么

`direction` 表示：

> 相机从哪个方向看向移动端总览目标。

它更像是“机位方向”，而不是直接把画面平移多少。

```js
direction: new THREE.Vector3(x, y, z)
```

三个值分别表示：

- 第 1 个值 `x`：左右方向
- 第 2 个值 `y`：上下方向
- 第 3 个值 `z`：前后方向

一般可以这样理解：

- `x > 0`：更偏右
- `x < 0`：更偏左
- `y > 0`：更偏上
- `y < 0`：更偏下
- `z > 0`：主要朝前方拉开距离

例如：

```js
new THREE.Vector3(-0.02, 0.14, 1)
```

表示的是：

> 相机主要朝 `z` 正方向拉开，同时略微向左、略微向上。

注意：`direction` 改的是**相机取景方向**，不是严格意义上的屏幕像素平移。

### 3）`padding` 是什么

`padding` 可以理解成：

> 为了让整个总览内容完整装进屏幕，相机要额外后退多少。

它本质上是一个“留白系数 / 安全系数”。

在代码里它会参与这个距离计算：

```js
function getCameraFitDistance(fitRadius, padding = 1) {
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    const limitingFov = Math.min(verticalFov, horizontalFov);
    return (fitRadius / Math.tan(limitingFov / 2)) * padding;
}
```

所以：

- `padding` 越大：相机越远，整体看起来越小，留白越多
- `padding` 越小：相机越近，整体看起来越大，画面更满

你可以简单理解成：

- `padding = 1`：接近“刚刚好装下”
- `padding = 1.2`：比刚好再远一点
- `padding = 1.72`：更保守，留白更多

### 4）`targetNdc` 是什么

`targetNdc` 表示：

> 希望总览内容最终落在屏幕的哪个位置。

它使用的是标准化设备坐标（NDC），不是像素坐标。

```js
targetNdc: new THREE.Vector2(x, y)
```

常见理解：

- `(0, 0)`：屏幕正中心
- `(-0.1, 0)`：比中心更偏左
- `(0, 0.1)`：比中心更偏上
- `(-0.1, 0.1)`：偏左上

真正让它生效的是下面这段补偿代码：

```js
function applyMobileScreenSpaceCompensation() {
    if (!isMobileLayout() || __mobileOverviewSamplePoints.length === 0) return;

    const desiredNdc = MOBILE_OVERVIEW_CAMERA_COMPOSITION.targetNdc;

    for (let i = 0; i < 2; i++) {
        let sumX = 0;
        let sumY = 0;
        let count = 0;

        __mobileOverviewSamplePoints.forEach((point) => {
            const projected = point.clone().project(camera);
            if (Number.isFinite(projected.x) && Number.isFinite(projected.y) && Number.isFinite(projected.z)) {
                sumX += projected.x;
                sumY += projected.y;
                count += 1;
            }
        });

        if (!count) return;

        const currentNdcX = sumX / count;
        const currentNdcY = sumY / count;
        const deltaX = desiredNdc.x - currentNdcX;
        const deltaY = desiredNdc.y - currentNdcY;

        if (Math.abs(deltaX) < 0.01 && Math.abs(deltaY) < 0.01) return;

        const distanceToTarget = camera.position.distanceTo(controls.target);
        const visibleHeight = 2 * distanceToTarget * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
        const visibleWidth = visibleHeight * camera.aspect;

        const forward = camera.getWorldDirection(new THREE.Vector3()).normalize();
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
        const up = new THREE.Vector3().crossVectors(right, forward).normalize();

        const offset = new THREE.Vector3()
            .add(right.multiplyScalar(-deltaX * visibleWidth * 0.5))
            .add(up.multiplyScalar(-deltaY * visibleHeight * 0.5));

        camera.position.add(offset);
        controls.target.add(offset);
        camera.updateProjectionMatrix();
        controls.update();
    }
}
```

你不用一开始就看懂每一行，只要先理解：

- 它会把一组“总览采样点”投影到屏幕上
- 算出它们当前平均落点
- 再往 `targetNdc` 指定的位置做补偿

所以：

- 如果整体中心偏右：可以把 `targetNdc.x` 调负一点
- 如果整体中心偏下：可以把 `targetNdc.y` 调正一点

---

## 9.8 移动端贴合视口固定层说明（附核心代码）

这一部分不只是“概念说明”，而是把当前项目里和移动端贴口逻辑直接相关的核心代码片段贴出来，方便你后续对照源码查问题。

这个思路的核心目标是：

> 在移动端，把页面主容器、3D canvas 容器、加载遮罩理解为同一个稳定的视口层，尽量避免浏览器地址栏、滚动回弹、页面可滑动等因素把场景“拖偏”。

### 1）`index.html`：移动端视口容器的核心样式

文件路径：`index.html`

核心代码：

```html
<style>
    html,
    body {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    body {
        background: #1a1a1a;
        position: fixed;
        inset: 0;
        overscroll-behavior: none;
        touch-action: manipulation;
    }

    #canvas-container {
        width: 100vw;
        height: 100vh;
        min-height: 100vh;
        position: relative;
        overflow: hidden;
    }

    @supports (height: 100dvh) {
        #canvas-container {
            height: 100dvh;
            min-height: 100dvh;
        }
    }

    @media (max-width: 768px) {
        #canvas-container {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            min-height: 100vh;
        }
    }
</style>
```

这段代码的作用：

- `body` 固定到视口，避免页面整体还能继续上下滑动；
- `#canvas-container` 作为 Three.js 的承载层，在移动端被固定到整个屏幕；
- `100dvh` 用来尽量规避手机浏览器地址栏导致的 `100vh` 高度偏差；
- 这一步属于“容器层修正”，不是相机参数修正。

### 2）`album-loading.css`：加载遮罩也跟随同一视口层

文件路径：`album-loading.css`

核心代码：

```css
#album-loading {
  position: absolute;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  background: #000;
  color: #fff;
  overflow: hidden;
}

@media (max-width: 768px) {
  #album-loading {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    overscroll-behavior: none;
    touch-action: none;
  }

  @supports (height: 100dvh) {
    #album-loading {
      height: 100dvh;
      min-height: 100dvh;
    }
  }
}
```

这段代码的作用：

- 桌面端仍然保持原有 overlay 行为；
- 移动端把 `#album-loading` 单独固定到视口上；
- 这样加载相册、进入按钮、主场景在移动端会共享同一个稳定参照系；
- `touch-action: none` 主要是减少加载层期间的触摸滑动干扰。

### 3）`js/main.js`：移动端判断与总览相机核心配置

文件路径：`js/main.js`

核心代码：

```js
const MOBILE_OVERVIEW_CAMERA_COMPOSITION = {
    direction: new THREE.Vector3(0.03, 0.2, 1),
    padding: 2.02,
    focusOffset: new THREE.Vector3(0, -120, 0),
    targetNdc: new THREE.Vector2(0, 0.16),
    enableScreenSpaceCompensation: true
};

function isMobileLayout() {
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|iPhone|iPod|Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const hasTouch = navigator.maxTouchPoints > 0;
    return isMobileUA && hasTouch;
}
```

这部分的作用：

- `isMobileLayout()` 用来判断当前是否进入移动端布局逻辑；
- `MOBILE_OVERVIEW_CAMERA_COMPOSITION` 控制手机端总览时的主要机位参数；
- 它和“贴口固定层”是两层不同概念：
  - 固定层负责视口稳定；
  - 相机参数负责构图。

### 4）`js/main.js`：移动端视口调试记录

文件路径：`js/main.js`

核心代码：

```js
function collectMobileViewportDebug(label = 'snapshot') {
    if (!isMobileLayout()) return null;

    const canvasContainer = document.getElementById('canvas-container');
    const albumLoading = document.getElementById('album-loading');
    const visualViewport = window.visualViewport;

    const snapshot = {
        label,
        timestamp: new Date().toISOString(),
        isMobileLayout: true,
        devicePixelRatio: window.devicePixelRatio,
        windowInner: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        visualViewport: visualViewport ? {
            width: visualViewport.width,
            height: visualViewport.height,
            offsetTop: visualViewport.offsetTop,
            offsetLeft: visualViewport.offsetLeft,
            scale: visualViewport.scale
        } : null,
        page: {
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            scrollHeight: document.documentElement.scrollHeight,
            clientHeight: document.documentElement.clientHeight
        },
        canvasContainerRect: canvasContainer ? canvasContainer.getBoundingClientRect().toJSON() : null,
        albumLoadingRect: albumLoading ? albumLoading.getBoundingClientRect().toJSON() : null
    };

    window.__mobileViewportDebug = snapshot;
    console.log('[mobile-viewport-debug]', snapshot);
    return snapshot;
}
```

这段记录逻辑的意义是：

- 后续如果手机端看起来“模型藏起来了”或“画面被拖偏了”；
- 可以先看 `window.__mobileViewportDebug`；
- 判断到底是：
  - 视口高度有偏差，
  - 容器 rect 不对，
  - overlay 定位不对，
  - 还是相机参数本身需要继续调。

### 5）如何理解这三类文件的分工

- `index.html`：管**页面根容器和 canvas 容器是否真正贴合视口**；
- `album-loading.css`：管**加载层是否也固定在同一视口基准上**；
- `js/main.js`：管**移动端总览构图 + 调试数据记录**。

建议后续排查顺序：

```text
先看视口容器是否固定 -> 再看 overlay 是否贴口 -> 最后再调移动端相机参数
```

这样不会把“页面定位问题”和“相机构图问题”混在一起。

### 5）`enableScreenSpaceCompensation` 是什么

这个开关表示：

> 是否启用屏幕空间补偿，让总览内容往 `targetNdc` 目标位置拉齐。

- `true`：开启补偿，`targetNdc` 会真正影响最终落点
- `false`：关闭补偿，更多依赖 `direction` 和相机距离本身

如果你希望移动端总览尽量稳定落在中心，通常建议保持：

```js
enableScreenSpaceCompensation: true
```

### 6）推荐调参顺序

为了避免越调越乱，建议按下面顺序来：

1. **先调 `padding`**
   - 先看整体是太大还是太小
2. **再调 `direction.y`**
   - 看机位是不是太低、太高
3. **再调 `direction.x`**
   - 看机位是不是要轻微偏左、偏右
4. **最后再调 `targetNdc`**
   - 用来做最终落点微调

推荐顺序：

```text
padding -> direction -> targetNdc
```

### 7）一个简单的调参思路

如果你在手机上看到：

- **整体太大，快顶到边缘**
  - 先调大 `padding`
- **整体太小，中间空很多**
  - 先调小 `padding`
- **整体视角太靠下**
  - 先调大 `direction.y`
- **整体视角太靠右**
  - 先把 `direction.x` 调负一点，必要时再配合 `targetNdc.x`
- **内容看起来已经差不多，但中心还是没落到正中**
  - 再小幅调整 `targetNdc`

---

## 10. 新手最容易看不懂的点

下面是一些小白常见困惑，我提前帮你解释一下。

### 1）为什么有两个渲染器？

- `WebGLRenderer`：用来渲染真正的 3D 模型
- `CSS3DRenderer`：用来渲染 iframe 这种 HTML 内容

因为电脑屏幕里是网页，所以要两个渲染器配合。

### 2）为什么模型加载后还要点“进入”？

因为作者做了一个更有仪式感的加载体验。

不是技术必须，但视觉体验更好。

### 3）为什么不用图片直接贴屏幕？

因为屏幕展示的是网页和视频，用 HTML 元素更灵活。

### 4）为什么有这么多 `canvas`？

因为有些文字和贴图不是现成图片，而是程序动态画出来的。

### 5）为什么 `style.css` 没怎么用？

说明样式大部分直接写在页面里，或者在 `album-loading.css` 中。

后期可以继续整理。

---

## 11. 当前项目的不足和注意点

作为说明文档，也要诚实告诉你项目现状。

### 1）代码量集中在 `main.js`

目前 `main.js` 很大，功能很多，后续维护会比较累。

建议以后拆分为：

- 场景初始化
- 模型加载
- 加载页逻辑
- 轨道与企鹅特效
- 屏幕网页/视频逻辑
- 键盘交互

### 2）部分资源路径耦合较强

比如图片数量、模型名称、视频位置都写死在代码里。

### 3）当前代码已经开始模块化

现在 `main.js` 不再像最初那样把所有逻辑都堆在一个文件里，而是已经拆出：

- 模型加载
- 加载页逻辑
- 轨道与企鹅特效
- 电脑屏幕交互
- 移动端视口辅助逻辑

这样做的好处是：

- 主流程更清楚
- 改某个功能时更容易定位文件
- 后续继续拆相机和布局逻辑也更顺手

### 4）某些函数现在可能是“保留功能”

比如信息板相关变量和部分逻辑仍在代码中，但当前主要交互已经更偏向企鹅特效，不一定都在实际展示中明显使用。

### 4）外部网页 iframe 可能受限制

如果目标网站禁止嵌入 iframe，就不能正常显示。

---

## 12. 如果你想继续优化，可以做什么

如果你后面还想继续做，可以考虑这些方向：

### 适合新手的优化

- 给 README 再加截图
- 把快捷键显示到页面上
- 把 `main.js` 拆分成多个文件
- 给按钮和 loading 区域做得更精致
- 增加手机端适配

### 适合进阶的优化

- 给模型增加阴影
- 加入后期特效（Bloom、FXAA 等）
- 优化性能
- 把配置提取到单独文件
- 支持多个场景切换
- 加入 UI 面板（如 lil-gui）

### 进阶理解：电脑模型、经纬网球、企鹅轨道、旗帜粒子的依赖逻辑

这一节专门讲这 4 个部分之间是谁依赖谁、谁以谁为基准建立。

先说结论：

```text
电脑模型 -> 电脑包围盒/中心点/尺寸 -> 经纬网球与轨道参数 -> 企鹅大小与初始轨道位置 -> 旗帜/粒子/文字尾随特效
```

也就是说，这套关系里最底层的“基准物”其实是：

> **电脑模型本身的包围盒尺寸和中心点。**

后面的球壳、轨道、企鹅、旗帜粒子，都是顺着这个基准一层层算出来的。

---

#### 1）第一层基准：电脑模型决定中心点和基础尺寸

文件：`js/main.js`

核心源码：

```js
function createEarthCoreEnvironment(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const baseRadius = Math.max(size.x, size.y, size.z) * 1.7;
```

这里做了三件最关键的事：

- `box`：先给电脑模型做包围盒；
- `center`：取出电脑模型的中心点；
- `baseRadius`：取模型最大尺寸，再乘一个系数 `1.7`，得到后续环境构建的“基础半径”。

你可以把它理解成：

- `center` 决定“整个场景围着哪里展开”；
- `baseRadius` 决定“整个场景要做多大”。

如果电脑模型变大，那么：

- 经纬网球会变大；
- 轨道会变大；
- 企鹅目标尺寸会变大；
- 旗帜、粒子尾迹长度也会一起变大。

所以电脑模型不是只是“摆在那里被看”，它实际上是整套附属效果的尺寸基准。

---

#### 2）第二层基准：经纬网球和轨道以电脑模型为基准建立

文件：`js/main.js`

核心源码：

```js
    earthCoreGroup = new THREE.Group();
    earthCoreGroup.position.copy(center);
    scene.add(earthCoreGroup);

    const shellRadius = baseRadius * 3.1;
    earthGridRadius = shellRadius;
    orbitTrackWidth = Math.max(baseRadius * 0.22 * 5, baseRadius * 0.5);
    orbitRadius = earthGridRadius + orbitTrackWidth * 1.5;
    orbitCenter.set(center.x, 0, center.z);
```

这里的依赖关系非常清楚：

- `earthCoreGroup.position.copy(center)`：说明经纬网球整体围绕电脑模型中心建立；
- `shellRadius = baseRadius * 3.1`：球壳半径来自电脑模型尺寸；
- `orbitTrackWidth` 也来自 `baseRadius`；
- `orbitRadius` 再由球壳半径和轨道宽度继续推出来；
- `orbitCenter.set(center.x, 0, center.z)`：轨道中心的 `x/z` 跟着电脑模型中心走，但 `y` 被压到世界坐标的 `0` 平面。

这一点很重要：

> **经纬网球和电脑模型同中心；轨道不是直接套在电脑模型本地坐标上，而是取模型中心的横向位置，再落到世界水平面上。**

所以它们不是完全同一个圆心定义：

- 经纬网球：更接近“围着电脑模型中心”；
- 轨道：更接近“以电脑所在区域为横向基准，在世界水平面上画圆”。

这样做的好处是轨道更稳定，不会因为模型自身高低位置让轨道也跟着悬空或倾斜。

---

#### 3）第三层基准：企鹅大小和初始位置依赖轨道参数

文件：`js/main.js`

核心源码：

```js
function createOrbitRingAndPenguin(center, baseRadius) {
    const penguinLoader = new GLTFLoader();
    penguinLoader.load(
        './assets/models/qq.glb',
        function (gltf) {
            orbitPenguin = gltf.scene;

            const penguinBox = new THREE.Box3().setFromObject(orbitPenguin);
            const penguinSize = new THREE.Vector3();
            penguinBox.getSize(penguinSize);
            const penguinMaxDim = Math.max(penguinSize.x, penguinSize.y, penguinSize.z) || 1;
            const targetSize = baseRadius * 0.22;
            const scale = targetSize / penguinMaxDim;
            orbitPenguin.scale.setScalar(scale);
```

这里能看出：

- 企鹅不是自己决定自己大小；
- 它先读取自身模型尺寸 `penguinMaxDim`；
- 再把目标尺寸设置为 `targetSize = baseRadius * 0.22`；
- 也就是**企鹅的显示尺寸最终还是由电脑模型的基础半径决定**。

再看位置：

```js
            orbitPenguinBaseY = orbitCenter.y + targetSize * 0.45;
            orbitPenguin.position.set(orbitCenter.x + orbitRadius, orbitPenguinBaseY, orbitCenter.z);
            scene.add(orbitPenguin);
```

这里表示：

- 企鹅的初始圆周位置依赖 `orbitCenter` 和 `orbitRadius`；
- 它的高度不是随便写死，而是和 `targetSize` 挂钩；
- 所以企鹅越大，基础悬浮高度也会略微变高。

总结成一句话：

> **企鹅的位置基准是轨道，企鹅的尺寸基准是电脑模型推导出的 `baseRadius`。**

---

#### 4）第四层基准：轨道可视化本身依赖 `orbitRadius` 和 `orbitCenter`

文件：`js/main.js`

核心源码：

```js
function createOrbitRingVisual() {
    if (orbitRadius <= 0 || orbitTrackWidth <= 0) return;

    const innerRadius = Math.max(orbitRadius - orbitTrackWidth * 0.5, 10);
    const outerRadius = orbitRadius + orbitTrackWidth * 0.5;

    const trackGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 180);
    ...
    orbitTrackMesh.position.set(orbitCenter.x, orbitCenter.y + 2, orbitCenter.z);
```

以及：

```js
    const ringCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0);
    const ringPoints3D = ringPoints2D.map((point) => new THREE.Vector3(
        orbitCenter.x + point.x,
        orbitCenter.y + 5,
        orbitCenter.z + point.y
    ));
```

这说明两层轨道可视化都不是独立设计出来的，而是依赖：

- `orbitRadius`：决定圆有多大；
- `orbitTrackWidth`：决定环带有多厚；
- `orbitCenter`：决定圆心在哪里。

所以真实依赖链是：

```text
电脑模型尺寸 -> baseRadius -> shellRadius / orbitTrackWidth / orbitRadius -> 轨道几何
```

---

#### 5）第五层基准：企鹅运动本身以轨道圆心和轨道半径为基准

文件：`js/main.js`

核心源码：

```js
function updateOrbitPenguin(time) {
    if (!orbitPenguin || orbitRadius <= 0) return;

    const orbitSpeed = -time * 1.8;
    const x = orbitCenter.x + Math.cos(orbitSpeed) * orbitRadius;
    const z = orbitCenter.z + Math.sin(orbitSpeed) * orbitRadius;
    const dirX = -Math.sin(orbitSpeed);
    const dirZ = Math.cos(orbitSpeed);
    const forwardDirection = new THREE.Vector3(dirX, 0, dirZ).normalize();
    const heading = Math.atan2(dirX, dirZ) + ORBIT_PENGUIN_HEADING_OFFSET;

    orbitPenguin.position.set(
        x,
        orbitPenguinBaseY + Math.sin(time * 10) * 8,
        z
    );
    orbitPenguin.rotation.set(0, heading, 0);

    updatePenguinFollowEffects(time, forwardDirection);
}
```

这段的含义是：

- `x = cx + cos(t) * r`
- `z = cz + sin(t) * r`

也就是标准的**圆周运动参数方程**。

如果把轨道中心记为 `(cx, cz)`，半径记为 `r`，角度记为 `θ`，那么：

```text
x = cx + r cos(θ)
z = cz + r sin(θ)
```

而 `dirX`、`dirZ` 则是在算切线方向，用来让企鹅朝着前进方向转头。

`heading = atan2(dirX, dirZ)` 的本质是：

> 根据当前运动方向向量，反算出应该朝向哪个 yaw 角。

这就是为什么企鹅不是“横着漂”，而是看起来沿着轨道方向在飞。

---

#### 6）第六层基准：旗帜、悬浮文字、粒子束都依赖企鹅目标尺寸

文件：`js/main.js`

核心源码：

```js
function createPenguinFollowEffects(targetSize) {
    const flagWidth = targetSize * 2.8;
    const flagHeight = targetSize * 1.55;
    ...
    penguinTrailLength = targetSize * 8.5;
    penguinFlagPoleOffset = targetSize * 0.9;
    penguinFlagHeightOffset = targetSize * 0.75;
    penguinBeamGapOffset = targetSize * 2.7;
    penguinFloatingTextHeightOffset = targetSize * 2.7;
```

这里要注意：

- `targetSize` 来自上一层，也就是企鹅的目标尺寸；
- 旗帜宽高、尾迹长度、旗杆偏移、文字高度、粒子束起点间隔，全都由 `targetSize` 再继续派生。

这意味着：

> **旗帜粒子不是直接按电脑模型尺寸算，而是通过“电脑模型 -> 企鹅目标尺寸 -> 特效尺寸”这条链条间接算出来。**

这样做的好处是：

- 特效总能和企鹅体型保持协调；
- 更换企鹅模型后，只要缩放逻辑还成立，尾随特效一般也能保持比例正常。

---

#### 7）第七层基准：运行时旗帜和粒子的位置以企鹅当前位置与朝向为基准

文件：`js/main.js`

核心源码：

```js
function updatePenguinFollowEffects(time, forwardDirection) {
    if (!orbitPenguin || !penguinFlagMesh || !penguinParticleBeam || !penguinFlagBasePositions) return;
    if (!penguinFollowEffectEnabled) return;

    const backDirection = forwardDirection.clone().multiplyScalar(-1);
    const sideDirection = new THREE.Vector3().crossVectors(backDirection, new THREE.Vector3(0, 1, 0)).normalize();
    const upDirection = new THREE.Vector3().crossVectors(sideDirection, backDirection).normalize();
    const frontDirection = forwardDirection.clone();
```

以及旗帜锚点：

```js
    const flagAnchor = orbitPenguin.position.clone()
        .add(frontDirection.clone().multiplyScalar(penguinFlagPoleOffset))
        .add(upDirection.clone().multiplyScalar(penguinFlagHeightOffset));
```

以及粒子束起点：

```js
    const beamStart = orbitPenguin.position.clone()
        .add(frontDirection.clone().multiplyScalar(penguinFlagPoleOffset + penguinBeamGapOffset + penguinTrailLength * 0.08))
        .add(upDirection.clone().multiplyScalar(penguinFlagHeightOffset * 0.2));
```

这一层非常关键：

- 旗帜不是固定在世界坐标某一点；
- 粒子也不是绕着轨道中心直接发射；
- 它们都先读取 `orbitPenguin.position`；
- 再按企鹅当前前进方向 `forwardDirection`、侧方向 `sideDirection`、上方向 `upDirection` 做局部偏移。

所以它们真正的直接基准是：

> **企鹅当前时刻的位置和朝向。**

这就是为什么企鹅一转头，旗帜和粒子尾迹也会跟着转；
因为它们不是“场景级特效”，而是“角色尾随特效”。

---

#### 8）把整条依赖链重新串起来

你可以把整个建模/依赖过程记成下面这条链：

```text
电脑模型包围盒
  -> center, size
  -> baseRadius
  -> shellRadius / orbitTrackWidth / orbitRadius / orbitCenter
  -> 企鹅 targetSize、scale、初始轨道位置
  -> 旗帜宽高、粒子束长度、文字高度偏移
  -> 运行时再以企鹅当前位置 + 朝向持续更新特效
```

如果再压缩成“谁以谁为准”：

```text
电脑模型 为总基准
经纬网球 以电脑模型中心与尺寸为准
企鹅轨道 以电脑模型推导出的球壳半径与轨道宽度为准
企鹅模型 以轨道参数定位，以 baseRadius 缩放
旗帜/粒子/文字 以企鹅尺寸定比例，以企鹅实时位置和朝向定姿态
```

---

#### 9）阅读这部分代码前，最好先掌握哪些知识

如果你后面想彻底看懂这一段，建议先补下面这些基础：

1. **包围盒（Bounding Box）**
   - `Box3`
   - `getSize()`
   - `getCenter()`

2. **向量（Vector3）**
   - 向量加减
   - 单位化 `normalize()`
   - 叉乘 `crossVectors()`

3. **圆周运动参数方程**
   - `x = cx + r cos(θ)`
   - `z = cz + r sin(θ)`

4. **朝向角 / 反三角函数**
   - `atan2(y, x)` 或本项目中的 `atan2(dirX, dirZ)`

5. **局部坐标基向量**
   - forward（前）
   - right / side（侧）
   - up（上）

一旦这些概念顺了，你再回来看这部分代码，就会发现它其实不是“乱写一堆 magic number”，而是很典型的：

> 先定总基准，再逐层派生尺寸，最后按角色实时姿态挂载尾随特效。

---

## 13. 一句话总结这个项目

这是一个使用 **Three.js + CSS3DRenderer** 制作的 **3D 电脑展示网页项目**，包含：

- 3D 相册加载页
- 电脑模型展示
- 屏幕网页 / 视频切换
- 企鹅轨道动画
- 旗帜和粒子特效
- 视角恢复与调试快捷键

如果你是小白，建议你按下面顺序阅读代码：

1. 先看 `index.html`
2. 再看 `album-loading.css`
3. 然后重点看 `js/main.js`
4. 遇到看不懂的函数，先理解“它是做什么”，不要一开始纠结每一行

---

## 14. 给小白的阅读建议

如果你是第一次接触这种项目，我建议这样学：

### 第一步：先跑起来

先本地运行，看看效果。

### 第二步：只看入口文件

先看 `index.html`，弄懂资源是怎么引进来的。

### 第三步：在 `main.js` 里只找这些关键词

- `Scene`
- `Camera`
- `Renderer`
- `loader.load`
- `animate`
- `addEventListener`

先理解这些主干。

### 第四步：再看特效

比如：

- 企鹅怎么动
- 粒子怎么做
- 旗帜为什么会摆动

### 第五步：自己改一个小功能

比如：

- 改网页地址
- 改视频
- 改加载页图片
- 改背景颜色

你只要能改成功一次，理解就会快很多。

---

## 15. 最后说明

这个 README 是基于当前项目文件和代码内容整理出来的“详细中文说明版”，重点是：

- 让小白能看懂
- 知道每个文件干什么
- 知道怎么运行
- 知道从哪里开始改

如果你后续还想继续升级这个项目，建议下一步先做：

> **把 `main.js` 拆分模块**。

这样项目会更清晰，也更适合继续开发。
