import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { blocks, resources } from "./block";

export function createUi(scene, world, player) {
  const gui = new GUI();

  const playerFolder = gui.addFolder("Player").close();
  playerFolder.add(player, "maxSpeed", 1, 20).name("Max Speed");
  playerFolder.add(player.cameraHelper, "visible").name("Show Camera Helper");

  const sceneFolder = gui.addFolder("Scene").close();
  sceneFolder.add(scene.fog, "near", 0, 100).name("Fog Near");
  const terrainFolder = gui.addFolder("Terrain").close();
  terrainFolder.add(world, "drawDistance", 0, 5, 1).name("Draw Distance");
  terrainFolder.add(world, "asyncLoading").name("Async Loading");
  terrainFolder.add(world.params, "seed", 1, 10000).name("Seed");
  terrainFolder.add(world.params.terrain, "scale", 10, 100).name("Scale");
  terrainFolder.add(world.params.terrain, "magnitude", 0, 32, 1).name("Magnitude");
  terrainFolder.add(world.params.terrain, "offset", 0, 32, 1).name("Offset");
  terrainFolder.add(world.params.terrain, "waterOffset", 0, 32, 1).name("Water Offset");

  const biomesFolder = terrainFolder.addFolder("Biomes").close();
  biomesFolder.add(world.params.biomes, "scale", 10, 500).name("Temperature Scale");
  biomesFolder.add(world.params.biomes.variation, "amplitude", 0, 1).name("Variation Amplitude");
  biomesFolder.add(world.params.biomes.variation, "scale", 10, 500).name("Variation Scale");
  biomesFolder.add(world.params.biomes, "tundraToTemperate", 0, 1).name("Tundra -> Temperate");
  biomesFolder.add(world.params.biomes, "temperateToJungle", 0, 1).name("Temperate -> Jungle");
  biomesFolder.add(world.params.biomes, "jungleToDesert", 0, 1).name("Jungle -> Desert");

  const resourcesFolder = terrainFolder.addFolder("Resources").close();
  resources.forEach((resource) => {
    const resourceFolder = resourcesFolder.addFolder(resource.name);
    resourceFolder.add(resource, "scarcity", 0, 1).name("Scarcity");

    const scaleFolder = resourceFolder.addFolder("Scale");
    scaleFolder.add(resource.scale, "x", 10, 100).name("X Scale");
    scaleFolder.add(resource.scale, "y", 10, 100).name("Y Scale");
    scaleFolder.add(resource.scale, "z", 10, 100).name("Z Scale");
  });

  const treesFolder = terrainFolder.addFolder("Trees").close();
  treesFolder.add(world.params.trees, 'frequency', 0, 0.1).name("Frequency");
  treesFolder.add(world.params.trees.trunk, 'minHeight', 0, 10, 1).name("Min Trunk Height");
  treesFolder.add(world.params.trees.trunk, 'maxHeight', 0, 10, 1).name("Max Trunk Height");
  treesFolder.add(world.params.trees.canopy, 'minRadius', 0, 10, 1).name("Min Canopy Size");
  treesFolder.add(world.params.trees.canopy, 'maxRadius', 0, 10, 1).name("Max Canopy Size");
  treesFolder.add(world.params.trees.canopy, 'density', 0, 1).name("Canopy Density");

  const cloudsFolder = terrainFolder.addFolder("Clouds").close();
  cloudsFolder.add(world.params.clouds, 'scale', 0, 100).name("Cloud Size");
  cloudsFolder.add(world.params.clouds, 'density', 0, 1).name("Cloud Cover");

  gui.onChange(() => {
    world.generate(true);
  });
}
