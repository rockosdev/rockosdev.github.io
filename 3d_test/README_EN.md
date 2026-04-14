# 3D Project Documentation

This is a frontend 3D showcase project based on **Three.js**. When the page opens, you first see a **3D album-style loading screen**. After the model finishes loading, click **Enter** to access a **3D laptop scene**.

This scene is not just a simple laptop model display. It also includes:

- A web page embedded inside the laptop screen
- Local video playback that can be toggled on the screen
- A penguin model orbiting around the scene
- Flag, particle beam, and glowing text effects
- Mouse drag to rotate and inspect the scene
- Keyboard shortcuts for interaction and debugging

If you are a beginner, you can simply think of this project as:

> A 3D interactive web page built with front-end technologies.

---

## 1. What this project does

The project currently provides the following features:

### 1) Loading screen

- A rotating 3D album is shown immediately when the page opens
- Loading progress is displayed below the album
- After the model is loaded, an **Enter** button appears
- Clicking the button fades out the loading overlay and enters the main scene

### 2) Main 3D scene

- Loads a laptop 3D model: `assets/models/laptop.glb`
- Automatically places the camera so the overall composition is visible first, including the laptop, earth-grid shell, and penguin orbit
- Supports mouse drag viewing through `OrbitControls`

### 3) Content on the laptop screen

- By default, the screen embeds this website: `https://rockosdev.github.io/`
- Press `V` to switch the screen to a local video: `assets/textures/video.mp4`
- Press `V` again to switch back to the web page

### 4) Environment and effects

- Creates a spherical sci-fi style environment similar to an earth-core / latitude-longitude grid
- Loads a penguin model: `assets/models/qq.glb`
- The penguin orbits around the scene
- Press `R` to toggle:
  - Flag effect
  - Particle beam effect
  - Floating text effect

### 5) Utility features

- Press `U` to restore the initial camera view
- Several debug hotkeys are available for adjusting the screen position, rotation, and scale

---

## 2. Project structure

```text
3d/
├── index.html                # Entry page
├── style.css                 # Reserved stylesheet (currently barely used)
├── album-loading.css         # Styles for the 3D album loading overlay
├── README.md                 # Chinese documentation
├── README_EN.md              # English documentation
├── js/
│   ├── main.js               # Main entry, scene assembly, and lifecycle flow
│   └── modules/
│       ├── albumOverlay.js   # Loading overlay and enter flow
│       ├── earthOrbitSystem.js # Earth-grid shell, penguin orbit, flag, and particle effects
│       ├── modelLoader.js    # Laptop model loading and material normalization
│       ├── screenExperience.js # Screen content, video toggle, and debug hotkeys
│       └── viewport.js       # Mobile viewport detection and responsive helpers
└── assets/
    ├── album/
    │   └── img/              # Images used by the loading album
    ├── models/
    │   ├── laptop.glb        # Laptop model
    │   └── qq.glb            # Penguin model
    └── textures/
        ├── rain.jpg          # Texture used for the flag / visuals
        └── video.mp4         # Video played on the laptop screen
```

---

## 3. What each file is for

## `index.html`

This is the project entry file. The browser loads it first.

Its main responsibilities are:

- Defining the basic HTML structure
- Importing Three.js from CDN using `importmap`
- Loading `album-loading.css`
- Creating the loading overlay DOM structure
- Loading `js/main.js`

You can think of it as:

> The stage setup file that prepares the page skeleton.

---

## `js/main.js`

This is now the main entry file of the project. Its job is primarily to wire modules together.

It includes:

- Creating the Three.js scene, camera, and renderers
- Calling the model loading module
- Creating lights
- Creating the CSS3D web screen
- Managing the loading overlay state
- Calling the earth-grid, penguin orbit, and effect modules
- Listening for keyboard events
- Running the animation loop

You can think of it as:

> The main controller file. It keeps the runtime flow, while concrete features are delegated to files inside `js/modules/`.

If you want to modify the project later, this is still a good place to start reading, but many concrete features now live in dedicated modules.

---

## `js/modules/`

This directory contains the modularized feature files.

### `albumOverlay.js`

Responsible for the loading overlay flow:

- Updating progress text
- Showing the Enter button
- Fading out and removing the overlay

### `viewport.js`

Responsible for responsive and mobile viewport logic:

- Detecting mobile layout
- Collecting mobile viewport debug snapshots
- Adjusting `OrbitControls` behavior

### `screenExperience.js`

Responsible for the laptop screen behavior:

- Creating the embedded web page and video container
- Handling the `V` key video toggle
- Handling screen debug hotkeys

### `modelLoader.js`

Responsible for laptop model loading:

- Loading `laptop.glb`
- Normalizing model materials

### `earthOrbitSystem.js`

Responsible for the most visible environmental effects in the scene:

- Earth-grid shell
- Penguin orbit
- Penguin animation
- Flag, particle beam, and floating text effects
- `R` key effect toggling

---

## `album-loading.css`

This file is dedicated to the 3D album loading animation.

Features:

- Styles are scoped under `#album-loading`
- It avoids affecting the rest of the page
- Supports hover expansion of the album images
- Includes button, progress display, and fade-out transition styles

---

## `style.css`

This file exists, but based on the current code, the project does **not rely heavily on it**.

That means:

- It is not the main stylesheet right now
- You can use it later for shared/global styles

---

## 4. Technologies used

### 1) HTML

Used for page structure.

### 2) CSS

Used for styles, loading animation, buttons, and layout.

### 3) JavaScript

Used for all interactive and rendering logic.

### 4) Three.js

This is the core 3D library used to create:

- Scene
- Camera
- Renderer
- Lights
- Model loading with `GLTFLoader`
- Mouse interaction with `OrbitControls`
- 3D objects and animations

### 5) CSS3DRenderer

This is a Three.js addon that allows HTML elements to be placed in 3D space.

So the content displayed on the laptop screen is not a traditional texture. It is an actual HTML element rendered in 3D.

---

## 5. How the project works

You can understand the runtime flow like this:

### Step 1: Open `index.html`

The browser reads the page structure and starts loading `main.js`.

### Step 2: Show the loading overlay

The 3D album appears first, so users do not see a blank page.

### Step 3: Load 3D resources

`main.js` uses `GLTFLoader` and other resource loaders to load:

- The laptop model
- Penguin-related resources
- Texture assets

During loading, the page shows percentage progress and file sizes.

### Step 4: Model finished loading

After the model is loaded successfully:

- The camera first switches to the overall view of the laptop, earth-grid shell, and penguin orbit
- The laptop screen is created
- Environment effects are initialized
- The **Enter** button is shown

### Step 5: Enter the main scene

The user clicks the button, the overlay disappears, and interaction begins.

### Step 6: Continuous rendering

Using `requestAnimationFrame()`, the app keeps updating:

- Orbit controls
- Panel/effect animations
- Penguin orbit motion
- Final rendering output

---

## 6. Core feature details

## 6.1 Three.js basics

In `main.js`, the fundamental objects are:

- `scene`: the 3D world
- `camera`: the viewing camera
- `renderer`: the WebGL renderer
- `cssRenderer`: the CSS3D renderer
- `controls`: the orbit controller

Simple analogy:

- `scene` = stage
- `camera` = cameraman
- `renderer` = draws the stage into the browser
- `controls` = lets you drag and inspect the scene

---

## 6.2 Loading the laptop model

The code uses:

```js
const loader = new GLTFLoader();
loader.load('./assets/models/laptop.glb', ...)
```

Explanation:

- `GLTFLoader` loads `.glb` / `.gltf` 3D model files
- The current model is a laptop
- Once loaded, the model is added into the scene

The code also applies some material fixes:

- Replaces materials with `MeshStandardMaterial`
- Adjusts texture color space

This is usually done to make the final rendering more stable and visually consistent.

---

## 6.3 Automatically fitting the camera

The project includes an `autoFitCamera()` function.

Its purpose is:

> To place the camera at a position where the whole model can be viewed clearly.

This prevents you from having to manually adjust the first camera position every time.

---

## 6.4 Loading overlay logic

Important DOM elements include:

- `#album-loading`
- `#loading-text`
- `#progress`
- `#enter-btn`

Main behavior:

- During loading: show “loading model...” and progress
- After loading: call `__markAlbumReadyToEnter()`
- On button click: call `__dismissAlbumOverlay()`

This makes the transition feel smoother and more polished.

---

## 6.5 Earth-core / latitude-longitude environment

The project has a function called `createEarthCoreEnvironment(model)`.

It generates a spherical sci-fi environment around the laptop model, including:

- A shell sphere
- Latitude/longitude lines
- Glowing point lights
- A circular orbit track

The main purpose is to enhance the visual atmosphere so the scene feels more like a futuristic showcase rather than just a single laptop floating in space.

---

## 6.6 Penguin model and orbit animation

The project loads:

```text
assets/models/qq.glb
```

This model continuously moves along an orbital path.

Related logic includes:

- Auto scaling the penguin to a suitable size
- Calculating the orbit radius
- Rotating the penguin to face the direction of movement
- Adding slight floating motion for a more lively animation

---

## 6.7 Flag, particle beam, and floating text

When you press `R`, the project calls `togglePenguinFollowEffect()`.

Once enabled, it displays:

- A flag texture
- A particle beam trail
- A glowing floating text element

Technically, these effects are built with:

- A plane geometry for the flag
- Vertex updates to simulate waving motion
- A particle system for the trail
- Canvas-generated text textures for glowing labels

If you are a beginner, you do not need to fully understand every line yet. Just remember:

> Most fancy effects still come from geometry + textures + animation.

---

## 6.8 Web page and video on the laptop screen

The project does not directly bake the screen content into a model texture. Instead, it uses `CSS3DObject`.

The rough flow is:

1. Create an HTML container called `screenWrap`
2. Put these inside it:
   - `iframe`
   - `video`
   - loading hint text
3. Wrap the container as a `CSS3DObject`
4. Place it at the laptop screen position in 3D space

Advantages of this approach:

- The web page is real HTML and can be interactive
- The video is a real video element
- No need to convert everything into textures

When you press `V`:

- The iframe is hidden
- The video is shown
- The video source is assigned only on first use

This is called **lazy loading**.

Benefit:

> Faster first load, because the video is not loaded immediately when the page opens.

---

## 6.9 Restoring the initial camera view

The code stores the camera state after the model has been correctly fitted.

When you press `U`, it restores:

- `camera.position`
- `controls.target`
- `camera.zoom`

This is useful because users may get lost after dragging the view around too much.

---

## 7. Keyboard shortcuts

Here are the important shortcuts in the current project:

| Key | Function |
|---|---|
| `R` | Toggle penguin flag + particle beam + floating text effects |
| `V` | Switch the laptop screen between web page and video |
| `U` | Restore the initial camera view |
| `↑ ↓ ← →` | Move the screen position |
| `W / S` | Move the screen forward/backward |
| `Q / E` | Rotate screen on X axis |
| `A / D` | Rotate screen on Y axis |
| `Z / X` | Rotate screen on Z axis |
| `+ / -` | Scale the screen |
| `P` | Print current screen transform in the console |

Notes:

- Most of these keys are mainly for development/debugging
- End users do not necessarily need all of them
- They are especially useful when fine-tuning the screen position

---

## 8. How to run the project

## Recommended: run with a local static server

Do **not** just double-click `index.html` directly.

Why?

- ES module loading (`type="module"`)
- Model loading
- Video loading
- Browser security restrictions

These can all cause problems when using the `file://` protocol.

### Run command

Inside `/home/rock/Workspaces/3d`, run:

```bash
python -m http.server 5173
```

Then open this in your browser:

```text
http://localhost:5173/
```

---

## 9. How to modify the project

## 9.1 Replace loading album images

Replace the images in:

```text
assets/album/img/1.jpg
assets/album/img/2.jpg
assets/album/img/3.jpg
assets/album/img/4.jpg
assets/album/img/5.jpg
assets/album/img/6.jpg
```

It is best to keep the same file names so you do not have to edit the CSS.

---

## 9.2 Replace the laptop model

Replace:

```text
assets/models/laptop.glb
```

But note:

- A new model may have a different size
- The screen alignment may no longer match
- The estimation logic in `calculateLaptopGeometry()` may need adjustment

---

## 9.3 Replace the penguin model

Replace:

```text
assets/models/qq.glb
```

If its size looks wrong afterward, adjust the scaling logic inside `createOrbitRingAndPenguin()`.

---

## 9.4 Change the website shown on the laptop screen

In `main.js`, find:

```js
iframe.src = 'https://rockosdev.github.io/';
```

Replace it with your own URL.

Note:

- Some websites do not allow iframe embedding
- In that case, the screen may be blank or show an error

That is a browser security policy issue, not necessarily a bug in this project.

---

## 9.5 Change the video file

Replace:

```text
assets/textures/video.mp4
```

Or update this line in code:

```js
video.dataset.src = './assets/textures/video.mp4';
```

---

## 9.6 Change the flag texture

The flag currently attempts to load:

```text
assets/textures/rain.jpg
```

Replacing this image will change the flag appearance.

---

## 10. Things beginners may find confusing

### 1) Why are there two renderers?

- `WebGLRenderer`: renders actual 3D models
- `CSS3DRenderer`: renders HTML content such as the iframe

Because the laptop screen contains web content, both are needed.

### 2) Why do I need to click Enter after the model is loaded?

Because the project intentionally creates a more polished loading experience.

It is not technically required, but it feels nicer.

### 3) Why not use an image directly on the screen?

Because the screen needs to display real web content and video, and HTML elements are more flexible.

### 4) Why are there so many `canvas` usages?

Because some textures and glowing text are generated dynamically instead of being prepared as static images.

### 5) Why is `style.css` barely used?

Because most styles currently live inline or in `album-loading.css`.

This can still be reorganized later.

---

## 11. Current limitations and notes

### 1) `main.js` is quite large

Right now, many responsibilities are packed into one file, which makes long-term maintenance harder.

It would be better to split it into modules such as:

- Scene setup
- Model loading
- Loading overlay logic
- Penguin/orbit effects
- Screen web/video logic
- Keyboard interaction

### 2) Resource paths are tightly coupled

For example, image counts, file names, and some paths are hardcoded.

### 3) Some functions may now be legacy or partially retained

For example, some panel-related variables and logic still exist even though the current visible interaction focuses more on the penguin effects.

### 4) External iframe content may fail

If the target site blocks iframe embedding, it will not display correctly.

---

## 12. Ideas for future improvement

### Beginner-friendly improvements

- Add screenshots to the README
- Show shortcut hints directly on the page
- Split `main.js` into smaller files
- Improve the button/loading UI
- Add mobile adaptation

### More advanced improvements

- Add real shadows
- Add post-processing effects such as Bloom or FXAA
- Optimize performance
- Move configuration into separate files
- Support multiple scene presets
- Add a GUI panel such as lil-gui

### Advanced understanding: dependency logic among the laptop, earth-grid sphere, penguin orbit, and flag/particle effects

This section explains which part depends on which other part, and which object acts as the base reference.

The short answer is:

```text
Laptop model -> model bounding box / center / size -> earth-grid sphere and orbit parameters -> penguin size and initial orbit placement -> trailing flag / particle / text effects
```

So the deepest base reference in this visual system is:

> **the laptop model's bounding box size and center point.**

Everything else is derived layer by layer from that.

---

#### 1) First base layer: the laptop model defines the center and the base size

File: `js/main.js`

Core code:

```js
function createEarthCoreEnvironment(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const baseRadius = Math.max(size.x, size.y, size.z) * 1.7;
```

Three important things happen here:

- `box`: builds a bounding box around the laptop model;
- `center`: gets the model center;
- `baseRadius`: takes the maximum dimension and multiplies it by `1.7` to create a base radius for the rest of the environment.

You can think of it like this:

- `center` decides **where the whole visual system is centered**;
- `baseRadius` decides **how large the whole derived system should be**.

If the laptop model becomes larger, then:

- the earth-grid sphere becomes larger,
- the orbit becomes larger,
- the penguin target size becomes larger,
- and the flag / particle trail scales up as well.

So the laptop model is not only something to look at. It is also the size reference for the whole derived effect system.

---

#### 2) Second base layer: the earth-grid sphere and orbit are built from the laptop model

File: `js/main.js`

Core code:

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

The dependency is very explicit here:

- `earthCoreGroup.position.copy(center)` means the earth-grid sphere is centered around the laptop model center;
- `shellRadius = baseRadius * 3.1` means the shell size comes from the laptop size;
- `orbitTrackWidth` also comes from `baseRadius`;
- `orbitRadius` is then derived from the shell radius and track width;
- `orbitCenter.set(center.x, 0, center.z)` means the orbit inherits the model center in `x/z`, but forces `y` onto the world horizontal plane.

This point is important:

> **The earth-grid sphere shares the laptop-centered reference, while the orbit uses the laptop's horizontal center but is anchored onto the world ground plane.**

So they are related, but not defined in exactly the same way:

- earth-grid sphere: centered more directly around the laptop model;
- orbit: centered around the laptop area in `x/z`, but flattened onto the world horizontal plane.

That helps keep the orbit stable instead of making it float or tilt with the model's vertical placement.

---

#### 3) Third base layer: penguin size and initial placement depend on orbit parameters

File: `js/main.js`

Core code:

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

This shows that:

- the penguin does not decide its final display size by itself;
- the code measures its original model size first;
- then defines `targetSize = baseRadius * 0.22`;
- which means **the laptop-derived base radius still controls the penguin's final visual scale**.

Now look at the position setup:

```js
            orbitPenguinBaseY = orbitCenter.y + targetSize * 0.45;
            orbitPenguin.position.set(orbitCenter.x + orbitRadius, orbitPenguinBaseY, orbitCenter.z);
            scene.add(orbitPenguin);
```

This means:

- the penguin's circular placement depends on `orbitCenter` and `orbitRadius`;
- its height is also linked to `targetSize`;
- so a larger penguin also gets a slightly higher base floating height.

In one sentence:

> **The penguin uses the orbit as its position reference, and uses the laptop-derived `baseRadius` as its scale reference.**

---

#### 4) Fourth base layer: the orbit visuals depend on `orbitRadius` and `orbitCenter`

File: `js/main.js`

Core code:

```js
function createOrbitRingVisual() {
    if (orbitRadius <= 0 || orbitTrackWidth <= 0) return;

    const innerRadius = Math.max(orbitRadius - orbitTrackWidth * 0.5, 10);
    const outerRadius = orbitRadius + orbitTrackWidth * 0.5;

    const trackGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 180);
    ...
    orbitTrackMesh.position.set(orbitCenter.x, orbitCenter.y + 2, orbitCenter.z);
```

and:

```js
    const ringCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0);
    const ringPoints3D = ringPoints2D.map((point) => new THREE.Vector3(
        orbitCenter.x + point.x,
        orbitCenter.y + 5,
        orbitCenter.z + point.y
    ));
```

This shows that the orbit visuals are also derived objects, based on:

- `orbitRadius`: how large the circle is;
- `orbitTrackWidth`: how thick the ring band is;
- `orbitCenter`: where the orbit center is.

So the real dependency chain is:

```text
Laptop model size -> baseRadius -> shellRadius / orbitTrackWidth / orbitRadius -> orbit geometry
```

---

#### 5) Fifth base layer: the penguin motion itself uses the orbit center and orbit radius

File: `js/main.js`

Core code:

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

The meaning is:

- `x = cx + cos(t) * r`
- `z = cz + sin(t) * r`

which is the standard **parametric equation of circular motion**.

If the orbit center is `(cx, cz)`, radius is `r`, and the angular parameter is `θ`, then:

```text
x = cx + r cos(θ)
z = cz + r sin(θ)
```

`dirX` and `dirZ` are used to compute the tangent direction, so the penguin can face the direction it is moving.

`heading = atan2(dirX, dirZ)` is essentially:

> converting the current direction vector into a yaw angle.

That is why the penguin does not simply slide sideways. It appears to move along the orbit properly.

---

#### 6) Sixth base layer: the flag, floating text, and particle beam all depend on the penguin target size

File: `js/main.js`

Core code:

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

Important point:

- `targetSize` comes from the previous layer, which is the penguin target size;
- flag size, trail length, pole offset, text height, and beam start gap are all derived from it.

That means:

> **The flag and particle system are not scaled directly from the laptop. They are scaled indirectly through the chain: laptop -> penguin target size -> effect dimensions.**

This keeps the effect visually proportional to the penguin body size.

---

#### 7) Seventh base layer: at runtime, the flag and particles use the penguin's current position and direction as the direct reference

File: `js/main.js`

Core code:

```js
function updatePenguinFollowEffects(time, forwardDirection) {
    if (!orbitPenguin || !penguinFlagMesh || !penguinParticleBeam || !penguinFlagBasePositions) return;
    if (!penguinFollowEffectEnabled) return;

    const backDirection = forwardDirection.clone().multiplyScalar(-1);
    const sideDirection = new THREE.Vector3().crossVectors(backDirection, new THREE.Vector3(0, 1, 0)).normalize();
    const upDirection = new THREE.Vector3().crossVectors(sideDirection, backDirection).normalize();
    const frontDirection = forwardDirection.clone();
```

Flag anchor:

```js
    const flagAnchor = orbitPenguin.position.clone()
        .add(frontDirection.clone().multiplyScalar(penguinFlagPoleOffset))
        .add(upDirection.clone().multiplyScalar(penguinFlagHeightOffset));
```

Particle beam start:

```js
    const beamStart = orbitPenguin.position.clone()
        .add(frontDirection.clone().multiplyScalar(penguinFlagPoleOffset + penguinBeamGapOffset + penguinTrailLength * 0.08))
        .add(upDirection.clone().multiplyScalar(penguinFlagHeightOffset * 0.2));
```

This is a key point:

- the flag is not fixed at one world-space location;
- the particles are not emitted directly from the orbit center;
- both first read `orbitPenguin.position`;
- then apply local offsets using the penguin's current forward, side, and up directions.

So their true direct reference is:

> **the penguin's current position and orientation at that moment.**

That is why when the penguin turns, the flag and the trail turn with it.

---

#### 8) Putting the full dependency chain together

You can summarize the whole modeling / dependency process like this:

```text
Laptop model bounding box
  -> center, size
  -> baseRadius
  -> shellRadius / orbitTrackWidth / orbitRadius / orbitCenter
  -> penguin targetSize, scale, initial orbit position
  -> flag size, particle trail length, text height offset
  -> runtime updates using penguin position + orientation
```

Or, in a more direct “which part depends on which base” form:

```text
Laptop model = global base reference
Earth-grid sphere = derived from laptop center and size
Penguin orbit = derived from laptop-based shell radius and orbit width
Penguin model = positioned by orbit parameters, scaled by baseRadius
Flag / particles / text = sized by penguin scale, oriented by penguin runtime motion
```

---

#### 9) What knowledge helps you understand this part of the code

If you want to fully understand this part later, it helps to know:

1. **Bounding boxes**
   - `Box3`
   - `getSize()`
   - `getCenter()`

2. **Vectors (`Vector3`)**
   - vector addition/subtraction
   - normalization with `normalize()`
   - cross product with `crossVectors()`

3. **Parametric circular motion**
   - `x = cx + r cos(θ)`
   - `z = cz + r sin(θ)`

4. **Orientation angles / inverse trigonometry**
   - `atan2(...)`

5. **Local basis vectors**
   - forward
   - side / right
   - up

Once these ideas are clear, this part of the project stops looking like a random collection of magic numbers, and instead reads more like:

> define a global base, derive layered sizes from it, then attach runtime-following effects to a moving character.

---

## 13. One-sentence summary

This is a **3D laptop showcase web project** built with **Three.js + CSS3DRenderer**, including:

- A 3D album loading screen
- Laptop model display
- Web page / video switching on the screen
- Penguin orbit animation
- Flag and particle effects
- Camera restore and debug shortcuts

If you are a beginner, a good reading order is:

1. `index.html`
2. `album-loading.css`
3. `js/main.js`
4. For any confusing function, first understand **what it does**, not every single line immediately

---

## 14. Reading advice for beginners

If this is your first time studying a project like this, I suggest this order:

### Step 1: Run it first

See the final effect before reading too much code.

### Step 2: Read only the entry file first

Open `index.html` and understand how scripts and styles are loaded.

### Step 3: In `main.js`, search these keywords first

- `Scene`
- `Camera`
- `Renderer`
- `loader.load`
- `animate`
- `addEventListener`

Understand the main backbone first.

### Step 4: Then study the effects

For example:

- How the penguin moves
- How particles are built
- Why the flag waves

### Step 5: Try changing one small thing yourself

For example:

- Change the web URL
- Change the video
- Change the loading images
- Change the background color

Once you successfully modify one thing, your understanding will improve much faster.

---

## 15. Final note

This English README is based on the current project files and code behavior. Its goal is to help readers:

- Understand the project quickly
- Know what each file does
- Know how to run it
- Know where to start editing it

If you want to improve the project next, the best first step would be:

> **Split `main.js` into smaller modules.**

That will make the project cleaner and much easier to maintain.
