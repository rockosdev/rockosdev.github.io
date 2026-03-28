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
- Automatically places the camera at a good viewing position
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
│   ├── main.js               # Main logic file
│   └── main.js.bak           # Backup file
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

This is the core file of the entire project. Almost all major logic is implemented here.

It includes:

- Creating the Three.js scene, camera, and renderers
- Loading the laptop and penguin models
- Creating lights
- Creating the CSS3D web screen
- Managing the loading overlay state
- Building the earth-grid-like environment
- Handling particles, flags, glowing text, and animation effects
- Listening for keyboard events
- Running the animation loop

If you want to modify the project later, this is the file you will most likely edit first.

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

## `ALBUM_LOADING.md`

This is a supplemental document focused on the album loading feature. It explains:

- The goal of the loading overlay
- Which files are involved
- How to replace album images
- How to run the project locally

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