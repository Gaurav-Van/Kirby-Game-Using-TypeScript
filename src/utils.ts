import { KaboomCtx } from "kaboom";
import { scale } from "./constants";

/**
 * Creates a game map using Tiled data.
 * @param {KaboomCtx} k - The Kaboom context.
 * @param {string} name - The name of the map (corresponding to the Tiled JSON file).
 * @returns {Object} - An object containing the map and spawn points.
 */

export async function makeMap(k: KaboomCtx, name: string) {
    // Fetch map data from the specified JSON file
  const mapData = await (await fetch(`./${name}.json`)).json();
    // Create the map sprite with scaling and position
  const map = k.make([k.sprite(name), k.scale(scale), k.pos(0)]);
    // Initialize an object to store spawn points
  const spawnPoints: { [key: string]: { x: number; y: number }[] } = {};

  // Iterate through each layer in the map data
  for (const layer of mapData.layers) {
    if (layer.name === "colliders") {
      // Handle collision layer (e.g., walls, platforms)
      for (const collider of layer.objects) {
        map.add([
          // Create an area for collision detection
          k.area({
            shape: new k.Rect(k.vec2(0), collider.width, collider.height),
            collisionIgnore: ["platform", "exit"],
          }),
          // Create a static body for non-exit colliders
          collider.name !== "exit" ? k.body({ isStatic: true }) : null,
          k.pos(collider.x, collider.y), // Set position
          collider.name !== "exit" ? "platform" : "exit", // Tag as platform or exit
        ]);
      }
      continue;
    }
    if (layer.name === "spawnpoints") {
      // Handle spawn points layer
      for (const spawnPoint of layer.objects) {
        if (spawnPoints[spawnPoint.name]) {
          // If spawn point already exists, add to the existing array
          spawnPoints[spawnPoint.name].push({
            x: spawnPoint.x,
            y: spawnPoint.y,
          });
          continue;
        }
        // Otherwise, create a new array for the spawn point
        spawnPoints[spawnPoint.name] = [{ x: spawnPoint.x, y: spawnPoint.y }];
      }
    }
  }

  return { map, spawnPoints };
}

