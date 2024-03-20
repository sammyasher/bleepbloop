import mushroom from "./assets/mushroom.png"
import Phaser from "phaser";
import * as Tone from "tone";


export class MushroomGuy extends Phaser.Scene {
  constructor(number, x, y, scene) {
    numberOfMushrooms = number;
    
  }

  preload() {
    this.load.image("mushroom", mushroom);
  }

  create() {
    const mushroomGuy = this.add.image(400, 300, "mushroom");
    mushroomGuy.setScale(0.5);
  }
}