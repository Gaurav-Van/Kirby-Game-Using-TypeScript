# Kirby Game Using TypeScript
Small and very simple Browser Based Kirby Game to explore Kaboom JS and practice typescript a little more. Consists of 2 levels only. 
<hr>

`Left` Left Arrow Key  |  `Right` Right Arrow Key  | `Up` & `Double Power Jump` Up Arrow Key |  `Let Kirby Cook` Key Z 
<hr>

## This code might not render properly on your browser 
This Code renders and works perfectly on my machine pr browser [Chrome]. But it might not render properly on your machine or browser or monitor of different size and aspect ratio. 
If you clone this repo and then the game does not render properly and all the characters keep falling then open `kaboomCtx.ts` and try different values of width and height. Thank you
<hr>

## Table of Content 
| Topics Covered | 
|----------------| 
| [Demo of the Project](#demo-of-the-project) |
| [Exploring Kaboom Js](#exploring-kaboom-js) |
| [What is Tiled](#what-is-tiled)             | 
| [Understanding Important Functions](#understanding-important-functions) |
| [How to Run this](#how-to-run-this) |

## Demo of the Project
https://github.com/Gaurav-Van/Kirby-Game-Using-TypeScript/assets/50765800/7dfde4e6-78f5-4945-b38a-f9b164ff7531
<hr>

## Exploring Kaboom Js
Kaboom.js is a JavaScript library designed to simplify the development of 2D games. It offers a range of features and components that help developers create interactive and dynamic game experiences with ease.

### **Game Objects**

Game objects are the primary entities in a Kaboom.js game, representing everything from characters to obstacles.

#### Creating Game Objects

- **`make`**: This function defines a blueprint for a game object, specifying its components and properties but not adding it to the game scene.
- **`add`**: This function creates and adds a game object to the game scene using the blueprint defined by `make`.

Example:
```javascript
const playerBlueprint = make([
    pos(100, 100),   // Initial position
    scale(2),        // Size scaling
    sprite("player"),// Sprite image
    area(),          // Collision area
    body(),          // Physics properties
    health(3)        // Health points
]);

const player = add(playerBlueprint);
```

### **Components**

Components are modular pieces of functionality that can be added to game objects to define their behavior and appearance.

- **`pos`**: Defines the position of the object in the game world.
- **`scale`**: Defines the size scaling of the object.
- **`area`**: Defines the collision area of the object.
- **`body`**: Enables physics and movement for the object.
- **`health`**: Tracks the health points of the object.

### **Additional Components**

- **`opacity`**: Sets the transparency level of the object.
- **`sprite`**: Assigns a sprite image to the object for rendering.
- **`doubleJump`**: Allows the object to perform a double jump.

Optional: As I continue to expand the Domain of my Knowledge I explored Kaboom Js. Did some more practice of TypeScript. <a href="https://www.youtube.com/watch?v=R6WvJOiX99s">This</a> video from FCC helped in completion of this Game. Learned a lot about TypeScript and Kaboom Js.

### **Component Interfaces**

These interfaces define the types and behaviors of various components:

- **`AreaComp`**: Interface for the area component.
- **`BodyComp`**: Interface for the body component.
- **`DoubleJumpComp`**: Interface for the double jump component.
- **`GameObj`**: Interface representing a game object.
- **`HealthComp`**: Interface for the health component.
- **`KaboomCtx`**: Interface representing the Kaboom context, providing access to the game engine's core functionalities.
- **`OpacityComp`**: Interface for the opacity component.
- **`PosComp`**: Interface for the position component.
- **`ScaleComp`**: Interface for the scale component.
- **`SpriteComp`**: Interface for the sprite component.

### **Arbitrary Properties**

Kaboom.js objects can have arbitrary properties to store custom data, allowing for flexible game mechanics and attributes.

Example:
```javascript
const player = add([
    pos(100, 100),
    scale(2),
    sprite("player"),
    area(),
    body(),
    health(3),
    {
        speed: 200, // Custom property for movement speed
    }
]);

player.speed = 250; // Updating the custom property
```

### **Updating Game Objects**

The `onUpdate` function allows you to define behavior that should be executed every frame, enabling dynamic interactions and game mechanics.

Example:
```javascript
const player = add([
    pos(100, 100),
    scale(2),
    sprite("player"),
    area(),
    body(),
    health(3),
    {
        speed: 200,
    }
]);

player.onUpdate(() => {
    if (keyIsDown("left")) {
        player.move(-player.speed, 0); // Move left
    } else if (keyIsDown("right")) {
        player.move(player.speed, 0); // Move right
    }
});
```

### **Waiting**

The `wait` function can be used to delay actions for a certain amount of time, useful for timing events in your game.

Example:
```javascript
wait(2, () => {
    player.move(player.speed, 0); // Move player after 2 seconds
});
```

### Summary

Kaboom.js provides a straightforward approach to game development with its modular components and flexible game object creation system. By combining different components and utilizing functions like `onUpdate` and `wait`, 
developers can easily build complex and interactive 2D games.
<hr>

## What is Tiled
**Tiled** is a powerful 2D level/map editor commonly used in game development. It allows you to create visually appealing game maps using tilesets. Here's how it works:

1. **Tilesets**: You define a set of tiles (small images) that represent different parts of your game world (e.g., terrain, objects, characters).

2. **Layers**: You organize your map into layers. Each layer can contain different types of information:
    - **Tile Layers**: These layers define the visual appearance of your map using tiles from the tileset.
    - **Object Layers**: These layers allow you to place objects (e.g., spawn points, checkpoints, triggers) on the map.

3. **Custom Properties**: You can add custom properties to tiles and objects. These properties can store additional data (e.g., health points, interaction flags).

### Tiled Map Format
Tiled can export maps as **JSON** files. When you create a map in Tiled, it generates a `.tmx` (Tiled Map XML) file, which is essentially a structured **JSON** representation of your map. Here are some key fields found in a Tiled JSON file:

- `"width"` and `"height"`: Number of tile columns and rows.
- `"tilewidth"` and `"tileheight"`: Dimensions of individual tiles.
- `"layers"`: Array of layers (tile layers and object layers).
- `"tilesets"`: Array of tilesets used in the map.
- `"objects"`: Array of objects placed on the map.

### How JSON Relates to Tiled Maps
1. **Exporting**: To export your Tiled map as JSON, select "File > Export As" and choose the JSON file type.

2. **Parsing in Your Game**:
    - Your game engine or framework reads the Tiled JSON file and extracts information about layers, tiles, and objects.
    - You can use this data to render the map, handle collisions, and manage game logic.

3. **Integration with Code**:
    - Access tile IDs to render the correct tiles.
    - Use object properties to position game entities.
    - Utilize custom properties for additional data.

### Example Tiled JSON:
```json
{
  "width": 10,
  "height": 8,
  "tilewidth": 32,
  "tileheight": 32,
  "layers": [
    // Tile layers and object layers go here
  ],
  // Other properties like tilesets, version, etc.
}
```
<hr>

## Understanding Important Functions 

### `entities.ts`

This file defines various game entities, including the player and different types of enemies. It also sets up interactions and controls for the player.

`makePlayer`

Creates and configures the player character with various components and properties.

- **Initialization**: Adds sprite, area, body, position, scale, double jump, health, and opacity components. Sets custom properties like speed, direction, isInhaling, and isFull.
  
- **Collision Handling**: 
  - On colliding with an enemy: If inhaling, destroy the enemy; otherwise, reduce health and handle death.
  - On colliding with an exit: Transition to the next scene.

- **Inhale Effect Setup**: Adds and configures inhale effect and inhale zone. Updates inhale zone and effect positions based on player direction.

- **Fall Check**: Restarts the scene if the player falls below a certain position.

`setControls`

Sets up controls for the player character.

- **Key Down**: Moves player left or right and handles inhaling action.
- **Key Press**: Handles double jump action.
- **Key Release**: Handles ending of inhaling action and shooting stars if the player is full.

`makeInhalable`

Configures an enemy to be inhalable by the player.

- **Collision Handling**: Marks the enemy as inhalable when colliding with the inhale zone and destroys both the enemy and shooting star on collision.

`makeFlameEnemy`, `makeGuyEnemy`, `makeBirdEnemy`

Creates different types of enemies with specific behaviors and states.

- **State Handling**: Defines enemy behaviors such as idle, jump, left, and right movements.

### `main.ts`
This file sets up the game, loads assets, and defines game scenes.

`gameSetup`

Initializes the game by loading assets and setting up scenes.

- **Load Assets**: Loads sprites and defines animations.
- **Scene Setup**: Defines scenes (`level-1` and `level-2`), including gravity, background, map layout, and spawning points for the player and enemies.
- **Scene Transitions**: Configures transitions between scenes based on player actions and game state.

The `gameSetup` function orchestrates the initial game setup and starts the first scene.

<hr>

## How to Run this 
`Node should be installed`
`Make a new Folder or directory and cd in it` 

Create Vite `choose vanila and typescript` 
```

npm create vite@latest .

```

Install kaboom 
```

npm install kaboom

```

Clone this Repo
```

git clone [repo_name]

```
`Compare the cloned repo with your folder then add and remove required files`




