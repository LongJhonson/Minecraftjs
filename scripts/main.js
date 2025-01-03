import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { World } from "./world";
import { createUi } from "./ui";
import { Player } from "./player";
import { Physics } from "./physics";
import { blocks } from "./block";
import { ModelLoader } from "./modelLoader";

const stats = new Stats();
document.body.append(stats.dom);

//Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x80a0e0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//orbitCamera setup
const orbitCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
orbitCamera.position.set(-20, 2, -20);
orbitCamera.layers.enable(1);

const controls = new OrbitControls(orbitCamera, renderer.domElement);
controls.target.set(16, 0, 16);
controls.update();

//scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x80a0e0, 100, 150);
const world = new World();
world.generate();
scene.add(world);

const player = new Player(scene);

const physics = new Physics(scene);

const modelLoader = new ModelLoader();
modelLoader.loadModels((models) => {
  player.tool.setMesh(models.pickaxe);
});

const sun = new THREE.DirectionalLight();

function setupLights() {
  sun.intensity = 3;
  sun.position.set(20, 20, 20);
  sun.castShadow = true;
  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.bottom = -100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 200;
  sun.shadow.bias = 0;
  sun.shadow.normalBias = -0.0005;
  sun.shadow.mapSize = new THREE.Vector2(2048, 2048);
  scene.add(sun);
  scene.add(sun.target);

  const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
  // scene.add(shadowHelper)

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add(ambient);
}

function onMouseDown(event) {
  if (player.controls.isLocked && player.selectedCoords) {
    if (player.activeBlockId === blocks.empty.id) {
      console.log("removing block at ", player.selectedCoords);
      world.removeBlock(
        player.selectedCoords.x,
        player.selectedCoords.y,
        player.selectedCoords.z
      );
      player.tool.startAnimation();
    } else {
      console.log("adding block at ", player.selectedCoords);
      world.addBlock(
        player.selectedCoords.x,
        player.selectedCoords.y,
        player.selectedCoords.z,
        player.activeBlockId
      );
    }
  }
}

document.addEventListener("mousedown", onMouseDown);

//render loop
let previousTime = performance.now();
function animate() {
  let currentTime = performance.now();
  let dt = (currentTime - previousTime) / 1000;

  requestAnimationFrame(animate);
  if (player.controls.isLocked) {
    player.update(world);
    physics.update(dt, player, world);
    world.update(player);

    sun.position.copy(player.camera.position);
    sun.position.sub(new THREE.Vector3(-50, -50, -50));
    sun.target.position.copy(player.position);
  }
  renderer.render(
    scene,
    player.controls.isLocked ? player.camera : orbitCamera
  );
  stats.update();

  previousTime = currentTime;
}

window.addEventListener("resize", () => {
  orbitCamera.aspect = window.innerWidth / window.innerHeight;
  orbitCamera.updateProjectionMatrix();
  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setupLights();
createUi(scene, world, player);
animate();
