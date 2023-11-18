import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "dat.gui";
import { BufferGeometry, DoubleSide, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import Stats from "three/examples/jsm/libs/stats.module";

/**
 * Base
 */

/**
 * Debug
 */
const gui = new dat.GUI({
  // closed: true,
  width: 400,
  theme: "dark",
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Texture
scene.background = new THREE.CubeTextureLoader()
  .setPath("/textures/binn/")
  .load([
    "arid2_ft.jpg",
    "arid2_bk.jpg",
    "arid2_up.jpg",
    "arid2_dn.jpg",
    "arid2_rt.jpg",
    "arid2_lf.jpg",
  ]);
/***
 * parameters
 */
const parameters = {
  mass: 70,
  gravity: 10,
  radius: 2,
  windX: 0,
  windY: 0,
  windZ: 0,
};

const worker = new Worker(new URL("./workers/worker.js", import.meta.url));

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("/textures/binn/arid2_dn.jpg");

var leftArrow = false;
var rightArrow = false;
var Drop = false;
var cameraProject = 1;

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowLeft":
      leftArrow = true;
      break;
    case "ArrowRight":
      rightArrow = true;
      break;
  }
});

document.addEventListener("keyup", function (event) {
  switch (event.key) {
    case "ArrowLeft":
      leftArrow = false;
      break;
    case "ArrowRight":
      rightArrow = false;
      break;
  }
});

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "Enter":
      Drop = true;
      break;
  }
});

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "2":
      cameraProject = 2;
      break;
    case "1":
      cameraProject = 1;
      break;
    case "3":
      cameraProject = 3;
      break;
  }
});

/***
 * the plain
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100000000, 100000000, 10),
  new THREE.MeshBasicMaterial()
);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -200010;

scene.add(plane);
plane.material.map = texture;
//lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const poinyLight = new THREE.PointLight(0xffffff, 0.5);
poinyLight.position.x = 2;
poinyLight.position.y = 3;
poinyLight.position.z = 4;
scene.add(ambient, poinyLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera1.aspect = sizes.width / sizes.height;
  camera1.updateProjectionMatrix();

  camera2.aspect = sizes.width / sizes.height;
  camera2.updateProjectionMatrix();

  camera3.aspect = sizes.width / sizes.height;
  camera3.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera1 = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  30000
);

camera1.position.z = 0;
camera1.position.y = 0;
camera1.position.x = 0;
scene.add(camera1);

const camera2 = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  30000
);
camera2.position.z = 0;
camera2.position.y = 10;
camera2.position.x = 0;
scene.add(camera2);

const camera3 = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  30000
);

const speed = 1000;
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "w": // up arrow
      // camera2.translateY(speed);
      camera2.position.y += 1000;
      break;
    case "a": // left arrow
      camera2.position.x -= 1000;

      // camera2.translateX(-speed);
      break;
    case "s": // down arrow
      camera2.position.y -= 1000;

      // camera2.translateY(-speed);
      break;
    case "d": // right arrow
      camera2.position.x += 1000;

      // camera2.translateX(speed);
      break;
    case "q": // right arrow
      camera2.translateX(-speed);
      break;
    case "e": // right arrow
      camera2.translateX(speed);
      break;
  }
});

// Controls
// if (cameraProject == 1) {
const controls1 = new OrbitControls(camera1, canvas);
controls1.enableDamping = true;
// }

// if (cameraProject == 2) {
const controls2 = new OrbitControls(camera2, canvas);
controls2.enableDamping = true;

const controls3 = new OrbitControls(camera3, canvas);
controls2.enableDamping = true;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// gui.hide()
gui.add(parameters, "radius").min(2).max(100).step(1);
gui.add(parameters, "mass").min(2).max(1000).step(1);
gui.add(parameters, "gravity").min(0).max(20).step(1);
gui.add(parameters, "windX").min(-200).max(200).step(1);
gui.add(parameters, "windY").min(-200).max(200).step(1);
gui.add(parameters, "windZ").min(-200).max(200).step(1);
//the turn
// const radialClock = new THREE.Clock();

// Models
const dracoLoader = new DRACOLoader();
dracoLoader.setPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const group = new THREE.Group();

const modelContainer1 = new THREE.Object3D();
loader.load("/models/airplane1/scene.gltf", (gltf) => {
  gltf.scene.scale.x = 50;
  gltf.scene.scale.y = 50;
  gltf.scene.scale.z = 50;
  gltf.scene.position.set(500, 0, 0);
  modelContainer1.add(gltf.scene);
});
scene.add(modelContainer1);

const modelContainer = new THREE.Object3D();
loader.load("/models/army_man/scene.gltf", (gltf) => {
  gltf.scene.scale.x = 10;
  gltf.scene.scale.y = 10;
  gltf.scene.scale.z = 10;
  gltf.scene.position.setX(-1000);
  modelContainer.add(gltf.scene);
});
// scene.add(modelContainer);
// modelContainer.add(camera1);
const modelContainer2 = new THREE.Object3D();
loader.load("/models/parachute/scene.gltf", (gltf) => {
  gltf.scene.scale.x = 10;
  gltf.scene.scale.y = 10;
  gltf.scene.scale.z = 10;
  gltf.scene.position.setX(-1000);
  gltf.scene.position.setY(-75);
  modelContainer2.add(gltf.scene);
});
// scene.add(modelContainer2);
modelContainer2.visible = false;

group.add(modelContainer);
group.add(modelContainer2);

scene.add(group);

const velocityX = document.querySelector("#velocityX");
const velocityY = document.querySelector("#velocityY");
const velocityZ = document.querySelector("#velocityZ");

const LocationX = document.querySelector("#LocationX");
const LocationY = document.querySelector("#LocationY");
const LocationZ = document.querySelector("#LocationZ");

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "Tab":
      // console.log("sdoanbsuidbsiudv");
      modelContainer2.visible = true;
      parameters.radius = 7;
      break;
  }
});
/**
 * Animate
 */
const tick = () => {
  const wind = new THREE.Vector3(
    parameters.windX,
    parameters.windY,
    parameters.windZ
  );
  worker.postMessage([
    "start",
    leftArrow,
    rightArrow,
    Drop,
    parameters.mass,
    parameters.radius,
    parameters.gravity,
    wind,
  ]);

  // Update controls
  worker.onmessage = function (event) {
    // controls1.update();
    controls2.update();

    // Render
    if (cameraProject == 1) {
      renderer.render(scene, camera1);
    }
    if (cameraProject == 2) {
      renderer.render(scene, camera2);
    }
    if (cameraProject == 3) {
      renderer.render(scene, camera3);
    }
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
    gui.updateDisplay();

    const location = event.data[0];

    const constant = event.data[1];
    const angle = event.data[2];
    const velocity = event.data[3];

    group.position.x = location.x + Math.cos(angle) * constant;
    group.position.z = location.z + Math.sin(angle) * constant;
    group.position.y = location.y;

    camera1.position.x = group.position.x - 1200;
    camera1.position.z = group.position.z;
    camera1.position.y = group.position.y;

    camera3.position.x = group.position.x;
    camera3.position.z = group.position.z;
    camera3.position.y = group.position.y + 1000;

    velocityX.textContent = velocity.x.toFixed(2);
    velocityY.textContent = velocity.y.toFixed(2);
    velocityZ.textContent = velocity.z.toFixed(2);

    LocationX.textContent = location.x.toFixed(2);
    LocationY.textContent = location.y.toFixed(2);
    LocationZ.textContent = location.z.toFixed(2);

    if (Drop === false) {
      modelContainer1.position.x = location.x;
    }
    if (Drop === true) {
      modelContainer1.position.x -= 10;
    }
  };
};

tick();
