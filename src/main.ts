import { k } from "./kaboomCtx";
import { makeMap } from "./utils";
import {
  makeBirdEnemy,
  makeFlameEnemy,
  makeGuyEnemy,
  makePlayer,
  setControls,
} from "./entities";
import { globalGameState } from "./state";


/*loads the assets once and when the player dies we don't need to refetch the map data and assets. To avoid refetching.
use of await to wait for the map layout to be extracted before moving on*/
/**
 * Sets up the game by loading sprites, creating maps, adding player and enemy entities,
 * setting controls, and defining scenes for the game levels.
 * @returns None
 */
async function gameSetup() {
    k.loadSprite("assets", "../public/kirby-like.png", {
        sliceX: 9, /*x axis division on the kirby like png*/
        sliceY: 10, /*y axis division on the kirby like png*/
        anims: {
            kirbIdle: 0, /*initial image of kirby*/
            kirbInhaling: 1, /*image of kirby inhaling the enemies*/
            kirbFull: 2, /*image of kirby after its war crime*/
            kirbInhaleEffect: {from: 3, to:8, speed:15, loop:true}, /* inhaling effects looped over in order to give it a smooth flow*/
            /* Similar Logic for rest of the entities*/
            shootingStar: 9,
            flame: {from:36, to:37, speed:4, loop:true},
            guyIdle: 18,
            guyWalk: {from: 18, to: 19, speed: 4, loop: true},
            bird: {from: 27, to: 28, speed: 4, loop: true},
        },
    });

    /**
     * Loads a sprite with the given key and image URL.
     * @param {string} key - The key to identify the sprite.
     * @param {string} imageUrl - The URL of the image to use for the sprite.
     * @returns None
     */
    k.loadSprite("level-1", "../public/level-1.png");
    k.loadSprite("level-2", "../public/level-2.png");

    k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0), k.fixed()]);

    const { map: level1Layout, spawnPoints: level1SpawnPoints } = await makeMap(
        k,
        "level-1"
    );

    const { map: level2Layout, spawnPoints: level2SpawnPoints } = await makeMap(
        k,
        "level-2"
    );

    /**
     * Sets up and initializes the game scene for level 1.
     * This function creates the game elements, sets the gravity, adds the player character,
     * sets up the camera, and spawns enemies for level 1.
     * @returns None
     */
    k.scene("level-1", async () => {
        globalGameState.setCurrentScene("level-1");
        globalGameState.setNextScene("level-2");
        k.setGravity(2100);
        k.add([
        k.rect(k.width(), k.height()),
        k.color(k.Color.fromHex("#f7d7db")),
        k.fixed(),
        ]);

        k.add(level1Layout);

        const kirb = makePlayer(
        k,
        level1SpawnPoints.player[0].x,
        level1SpawnPoints.player[0].y
        );

        setControls(k, kirb);
        k.add(kirb);
        k.camScale(k.vec2(0.7));
        k.onUpdate(() => {
        if (kirb.pos.x < level1Layout.pos.x + 432)
            k.camPos(kirb.pos.x + 500, 800);
        });

        for (const flame of level1SpawnPoints.flame) {
        makeFlameEnemy(k, flame.x, flame.y);
        }

        for (const guy of level1SpawnPoints.guy) {
        makeGuyEnemy(k, guy.x, guy.y);
        }

        for (const bird of level1SpawnPoints.bird) {
        const possibleSpeeds = [100, 200, 300];
        k.loop(10, () => {
            makeBirdEnemy(
            k,
            bird.x,
            bird.y,
            possibleSpeeds[Math.floor(Math.random() * possibleSpeeds.length)]
            );
        });
        }
    });

    /**
     * Sets up the "level-2" scene in the game, including adding player, enemies, controls, and camera settings.
     * @returns None
     */
    k.scene("level-2", () => {
        globalGameState.setCurrentScene("level-2");
        globalGameState.setNextScene("level-1");
        k.setGravity(2100);
        k.add([
        k.rect(k.width(), k.height()),
        k.color(k.Color.fromHex("#f7d7db")),
        k.fixed(),
        ]);

        k.add(level2Layout);
        const kirb = makePlayer(
        k,
        level2SpawnPoints.player[0].x,
        level2SpawnPoints.player[0].y
        );

        setControls(k, kirb);
        k.add(kirb);
        k.camScale(k.vec2(0.7));
        k.onUpdate(() => {
        if (kirb.pos.x < level2Layout.pos.x + 2100)
            k.camPos(kirb.pos.x + 500, 800);
        });

        for (const flame of level2SpawnPoints.flame) {
        makeFlameEnemy(k, flame.x, flame.y);
        }

        for (const guy of level2SpawnPoints.guy) {
        makeGuyEnemy(k, guy.x, guy.y);
        }

        for (const bird of level2SpawnPoints.bird) {
        const possibleSpeeds = [100, 200, 300];
        k.loop(10, () => {
            makeBirdEnemy(
            k,
            bird.x,
            bird.y,
            possibleSpeeds[Math.floor(Math.random() * possibleSpeeds.length)]
            );
        });
        }
    });

    k.scene("end", () => {});

    k.go("level-1");


}

gameSetup()