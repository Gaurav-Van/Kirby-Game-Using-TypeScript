/**
 * Global game state object for managing scenes and transitions.
 */
export const globalGameState: {
    scenes: string[];
    nextScene: string;
    currentScene: string;
    setNextScene: (sceneName: string) => void;
    setCurrentScene: (sceneName: string) => void;
  } = {
      // List of available scenes (level names)
    scenes: ["level-1", "level-2", "end"],
     // Next scene to transition to (initially empty)
    nextScene: "",
    // Current active scene (initially set to "level-1")
    currentScene: "level-1",
      /**
   * Set the current active scene.
   * @param {string} sceneName - The name of the scene to set.
   */
    setCurrentScene(sceneName: string) {
      if (this.scenes.includes(sceneName)) {
        this.currentScene = sceneName;
      }
    },
      /**
   * Set the next scene for transition.
   * @param {string} sceneName - The name of the next scene.
   */
    setNextScene(sceneName: string) {
      if (this.scenes.includes(sceneName)) {
        this.nextScene = sceneName;
      }
    },
  };