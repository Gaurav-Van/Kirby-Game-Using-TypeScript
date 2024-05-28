import {
  // Import components from the kaboom library
    AreaComp,
    BodyComp,
    DoubleJumpComp,
    GameObj,
    HealthComp,
    KaboomCtx,
    OpacityComp,
    PosComp,
    ScaleComp,
    SpriteComp,
  } from "kaboom";
  import { scale } from "./constants";
  import { globalGameState } from "./state";
  
  // Define a new type for the player game object with additional properties
  type PlayerGameObj = GameObj<
    SpriteComp &
      AreaComp &
      BodyComp &
      PosComp &
      ScaleComp &
      DoubleJumpComp &
      HealthComp &
      OpacityComp & {
        speed: number;
        direction: string;
        isInhaling: boolean;
        isFull: boolean;
      }
  >;

  /**
 * Creates a player game object
 * @param {KaboomCtx} k - The kaboom context
 * @param {number} posX - The initial x position of the player
 * @param {number} posY - The initial y position of the player
 * @returns {PlayerGameObj} - The created player game object
 */
  export function makePlayer(k: KaboomCtx, posX: number, posY: number) {
    const player = k.make([
      // Add sprite component with animation set to "kirbIdle"
      k.sprite("assets", { anim: "kirbIdle" }),
      // Add area component with a rectangular hitbox
      k.area({ shape: new k.Rect(k.vec2(4, 5.9), 8, 10) }),
      // Add body component for physics simulation
      k.body(),
      // Set the initial position of the player
      k.pos(posX * scale, posY * scale),
      // Set the scale of the player
      k.scale(scale),
      // Add double jump component
      k.doubleJump(10),
      // Add health component with initial health set to 3
      k.health(3),
      // Set initial opacity to 1 (fully opaque)
      k.opacity(1),
      {
        speed: 300, // Player movement speed
        direction: "right", // Initial direction the player is facing
        isInhaling: false, // Whether the player is inhaling
        isFull: false, // Whether the player is full after inhaling an enemy
      },
      // Assign a name to the game object for easier reference
      "player",
    ]);

    // Handle player collision with enemies
    player.onCollide("enemy", async (enemy: GameObj) => {
      if (player.isInhaling && enemy.isInhalable) {
        player.isInhaling = false;
        k.destroy(enemy); // Destroy the enemy on collision
        player.isFull = true;
        return;
      }
  
      if (player.hp() === 0) {
        k.destroy(player); // Destroy the player if health reaches 0
        k.go(globalGameState.currentScene); // Transition to the current scene
        return;
      }
  
      player.hurt(); // Damage the player on collision

      await k.tween(
        player.opacity,
        0,
        0.05,
        (val) => (player.opacity = val),
        k.easings.linear
      );
      await k.tween(
        player.opacity,
        1,
        0.05,
        (val) => (player.opacity = val),
        k.easings.linear
      );
    });
  
    player.onCollide("exit", () => {
      k.go(globalGameState.nextScene);
    });
  
    /**
     * Creates an inhale effect and zone for the player character.
     * @param {number} scale - The scale of the inhale effect.
     * @param {k} k - The kaboom context for creating sprites and areas.
     * @param {Player} player - The player character to add the inhale effect and zone to.
     * @returns The player character with the inhale effect and zone added.
     */
    const inhaleEffect = k.add([
      k.sprite("assets", { anim: "kirbInhaleEffect" }),
      k.pos(),
      k.scale(scale),
      k.opacity(0),
      "inhaleEffect",
    ]);
  
    const inhaleZone = player.add([
      k.area({ shape: new k.Rect(k.vec2(0), 20, 4) }),
      k.pos(),
      "inhaleZone",
    ]);
  
    inhaleZone.onUpdate(() => {
      if (player.direction === "left") {
        inhaleZone.pos = k.vec2(-14, 8);
        inhaleEffect.pos = k.vec2(player.pos.x - 60, player.pos.y + 0);
        inhaleEffect.flipX = true;
        return;
      }
      inhaleZone.pos = k.vec2(14, 8);
      inhaleEffect.pos = k.vec2(player.pos.x + 60, player.pos.y + 0);
      inhaleEffect.flipX = false;
    });
  
    player.onUpdate(() => {
      if (player.pos.y > 2000) {
        k.go(globalGameState.currentScene);
      }
    });
  
    return player;
  }
  
  /**
   * Sets the controls for the player character in the game.
   * @param {KaboomCtx} k - The Kaboom context object.
   * @param {PlayerGameObj} player - The player game object.
   * @returns None
   */
  export function setControls(k: KaboomCtx, player: PlayerGameObj) {
    const inhaleEffectRef = k.get("inhaleEffect")[0];
  
    k.onKeyDown((key) => {
      switch (key) {
        case "left":
          player.direction = "left"; //
          player.flipX = true;
          player.move(-player.speed, 0);
          break;
        case "right":
          player.direction = "right";
          player.flipX = false;
          player.move(player.speed, 0);
          break;
        case "z":
          if (player.isFull) {
            player.play("kirbFull");
            inhaleEffectRef.opacity = 0;
            break;
          }
  
          player.isInhaling = true;
          player.play("kirbInhaling");
          inhaleEffectRef.opacity = 1;
          break;
        default:
      }
    });
    k.onKeyPress((key) => {
      switch (key) {
        case "up":
          player.doubleJump();
          break;
        default:
      }
    });
    k.onKeyRelease((key) => {
      switch (key) {
        case "z":
          if (player.isFull) {
            player.play("kirbInhaling");
            const shootingStar = k.add([
              k.sprite("assets", {
                anim: "shootingStar",
                flipX: player.direction === "right",
              }),
              k.area({ shape: new k.Rect(k.vec2(5, 4), 6, 6) }),
              k.pos(
                player.direction === "left"
                  ? player.pos.x - 80
                  : player.pos.x + 80,
                player.pos.y + 5
              ),
              k.scale(scale),
              player.direction === "left"
                ? k.move(k.LEFT, 800)
                : k.move(k.RIGHT, 800),
              "shootingStar",
            ]);
            shootingStar.onCollide("platform", () => k.destroy(shootingStar));
  
            player.isFull = false;
            k.wait(1, () => player.play("kirbIdle"));
            break;
          }
  
          inhaleEffectRef.opacity = 0;
          player.isInhaling = false;
          player.play("kirbIdle");
          break;
        default:
      }
    });
  }
  
  /**
   * Makes the enemy object inhalable by the player.
   * @param {KaboomCtx} k - The Kaboom context object.
   * @param {GameObj} enemy - The enemy object to make inhalable.
   * @returns None
   */
  export function makeInhalable(k: KaboomCtx, enemy: GameObj) {
    enemy.onCollide("inhaleZone", () => {
      enemy.isInhalable = true;
    });
  
    enemy.onCollideEnd("inhaleZone", () => {
      enemy.isInhalable = false;
    });
  
    enemy.onCollide("shootingStar", (shootingStar: GameObj) => {
      k.destroy(enemy);
      k.destroy(shootingStar);
    });
  
    const playerRef = k.get("player")[0];
    enemy.onUpdate(() => {
      if (playerRef.isInhaling && enemy.isInhalable) {
        if (playerRef.direction === "right") {
          enemy.move(-800, 0);
          return;
        }
        enemy.move(800, 0);
      }
    });
  }
  
  /**
   * Creates a flame enemy at the specified position on the Kaboom game canvas.
   * @param {KaboomCtx} k - The Kaboom context object.
   * @param {number} posX - The x-coordinate position of the flame enemy.
   * @param {number} posY - The y-coordinate position of the flame enemy.
   * @returns The flame enemy object that was created.
   */
  export function makeFlameEnemy(k: KaboomCtx, posX: number, posY: number) {
    const flame = k.add([
      k.sprite("assets", { anim: "flame" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(4, 6), 8, 10),
        collisionIgnore: ["enemy"],
      }),
      k.body(),
      k.state("idle", ["idle", "jump"]),
      "enemy",
    ]);
  
    makeInhalable(k, flame);
  
    flame.onStateEnter("idle", async () => {
      await k.wait(1);
      flame.enterState("jump");
    });
  
    flame.onStateEnter("jump", async () => {
      flame.jump(1000);
    });
  
    flame.onStateUpdate("jump", async () => {
      if (flame.isGrounded()) {
        flame.enterState("idle");
      }
    });
  
    return flame;
  }
  
  /**
   * Creates an enemy character in the game with specified position and behavior.
   * @param {KaboomCtx} k - The Kaboom context object.
   * @param {number} posX - The x-coordinate position of the enemy.
   * @param {number} posY - The y-coordinate position of the enemy.
   * @returns The enemy character object.
   */
  export function makeGuyEnemy(k: KaboomCtx, posX: number, posY: number) {
    const guy = k.add([
      k.sprite("assets", { anim: "guyWalk" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(2, 3.9), 12, 12),
        collisionIgnore: ["enemy"],
      }),
      k.body(),
      k.state("idle", ["idle", "left", "right", "jump"]),
      { isInhalable: false, speed: 100 },
      "enemy",
    ]);
  
    makeInhalable(k, guy);
  
    guy.onStateEnter("idle", async () => {
      await k.wait(1);
      guy.enterState("left");
    });
  
    guy.onStateEnter("left", async () => {
      guy.flipX = false;
      await k.wait(2);
      guy.enterState("right");
    });
  
    guy.onStateUpdate("left", () => {
      guy.move(-guy.speed, 0);
    });
  
    guy.onStateEnter("right", async () => {
      guy.flipX = true;
      await k.wait(2);
      guy.enterState("left");
    });
  
    guy.onStateUpdate("right", () => {
      guy.move(guy.speed, 0);
    });
  
    return guy;
  }
  
  /**
   * Creates a bird enemy in the game with the specified parameters.
   * @param {KaboomCtx} k - The Kaboom context to create the bird enemy in.
   * @param {number} posX - The initial x position of the bird enemy.
   * @param {number} posY - The initial y position of the bird enemy.
   * @param {number} speed - The speed at which the bird enemy moves.
   * @returns The bird enemy object that was created.
   */
  export function makeBirdEnemy(
    k: KaboomCtx,
    posX: number,
    posY: number,
    speed: number
  ) {
    const bird = k.add([
      k.sprite("assets", { anim: "bird" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(4, 6), 8, 10),
        collisionIgnore: ["enemy"],
      }),
      k.body({ isStatic: true }),
      k.move(k.LEFT, speed),
      k.offscreen({ destroy: true, distance: 400 }),
      "enemy",
    ]);
  
    makeInhalable(k, bird);
  
    return bird;
  }