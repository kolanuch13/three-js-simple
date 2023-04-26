import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const lightInput = document.querySelector("#lightForm");
const pozitionInput = document.querySelector("#pozitionForm");


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const render = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

render.setPixelRatio(window.devicePixelRatio);
render.setSize(window.innerWidth, window.innerHeight);
      camera.position.setX(0);
      camera.position.setY(12);
      camera.position.setZ(30);

pozitionInput.addEventListener("change", (e) => {
  switch (e.target.id) {
    case "position-x":
      camera.position.setX(e.target.value);
      break;
    case "position-y":
      camera.position.setY(e.target.value);
      break;
    case "position-z":
      camera.position.setZ(e.target.value);
      break;
    default:
      break;
  }

});


const geometry = new THREE.TorusGeometry(10, 3, 15, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material)

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
lightInput.addEventListener("change", (e) => {
  let lightValueX = 0;
  let lightValueY = 0;
  let lightValueZ = 0;
  switch (e.target.id) {
    case "light-x":
      lightValueX = e.target.value;
      break;
    case "light-y":
      lightValueY = e.target.value;
      break;
    case "light-z":
      lightValueZ = e.target.value;
      break;
    default:
      break;
  }

  pointLight.position.set(lightValueX, lightValueY, lightValueZ);
});

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(50, 50)
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, render.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  
  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moonBumbTexture = new THREE.TextureLoader().load('moonBump.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(5, 240, 240),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonBumbTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}

document.body.onscroll = moveCamera

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.0005;
  torus.rotation.z += 0.0001;
  controls.update();
  render.render(scene, camera);
}

animate()