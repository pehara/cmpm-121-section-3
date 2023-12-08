import * as Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "menu" });
  }

  create() {
    // No menu needed; transition to the play scene immediately.
    this.scene.start("play");
  }
}
