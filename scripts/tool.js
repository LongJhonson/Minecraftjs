import * as THREE from "three";

export class Tool extends THREE.Group {
  //Whetr or not the tool is currently being animated
  animate = false;
  //amplitude of the tool animation
  animationAmplitude = 0.5;
  //duration of the animation
  animationDuration = 500;
  //The time at which the animation started
  animationStart = 0;
  //The speed at which the animation should play in rad/s
  animationSpeed = 0.025;
  //currently active animation
  animation = undefined;
  //The 3d mesh of the actual tool
  toolMesh = undefined;

  get animationTime() {
    return performance.now() - this.animationStart;
  }

  setMesh(mesh) {
    this.toolMesh = mesh;
    this.clear();
    this.add(mesh);
    mesh.reciveShadow = true;
    mesh.castShadow = true;

    this.position.set(0.6, -0.3, -0.5);
    this.scale.set(0.5, 0.5, 0.5);
    this.rotation.z = Math.PI / 2;
    this.rotation.y = Math.PI + 0.2;
  }

  startAnimation() {
    if (this.animate) return
    this.animate = true;
    this.animationStart = performance.now();

    clearTimeout(this.animation);

    this.animation = setTimeout(() => {
      this.animate = false;
      this.toolMesh.rotation.y = 0;
    }, this.animationDuration);
  }

  update() {
    if (this.animate && this.toolMesh) {
      this.toolMesh.rotation.y =
        this.animationAmplitude *
        Math.sin(this.animationTime * this.animationSpeed);
    }
  }
}
