import React from "react";
import Phaser from "phaser";
import Chance from "chance";
//import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";
import yellow_circle from "../assets/particles/yellow.circular.png";
import SamWow from "../assets/Samojis/SamWow.png";
import SamAnguish from "../assets/Samojis/SamAnguish.png";
import SamAscended from "../assets/Samojis/SamAscended.png";
import SamFurious from "../assets/Samojis/SamFurious.png";
import SamOne from "../assets/Samojis/SamOne.png";
import SamOoh from "../assets/Samojis/SamOoh.png";
import SamThinking from "../assets/Samojis/SamThinking.png";


//const synth = new Tone.Synth().toDestination();
//const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

class Example extends Phaser.Scene {
  preload() {
    this.load.image("SamWow", SamWow);
    this.load.image("SamAnguish", SamAnguish);
    this.load.image("SamAscended", SamAscended);
    this.load.image("SamFurious", SamFurious);
    this.load.image("SamOne", SamOne);
    this.load.image("SamOoh", SamOoh);
    this.load.image("SamThinking", SamThinking);

    this.load.image("yellow_circle", yellow_circle); 
  }

 
  create() {
    const samojiKeys = [
      "SamWow",
      "SamAnguish",
      "SamAscended",
      "SamFurious",
      "SamOne",
      "SamOoh",
      "SamThinking"
    ];

    // Shuffle the array
    var shuffledSamojiKeys = Chance().shuffle(samojiKeys);

    const particles = this.add.particles(0, 0, "SamWow", {
      //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig

      speed: 100,  
      frequency: 1, 
      lifespan: 1600,
      scale: { start: .17, end: 0 },  

      follow: this.input.activePointer,
      emitting: false,

      // emitCallback: () => {
        //   const randomNote = notes[Math.floor(Math.random() * notes.length)];
        //   synth.triggerAttackRelease(randomNote, "8n");},

      //onParticleEmit:
    });

    this.input.on("pointerdown", () => {
      particles.emitting = true;

     
      // If the array is empty, reshuffle
      if (shuffledSamojiKeys.length === 0) {
        shuffledSamojiKeys = Chance().shuffle(samojiKeys);  
      }
       // Pick the first element from the shuffled array and remove it
      const selectedKey = shuffledSamojiKeys.pop();

      particles.setTexture(selectedKey);

      particles.startFollow(this.input.activePointer, 0, -100);
    });

    this.input.on("pointerup", () => {
      particles.emitting = false;
      //particles.explode(10, pointer.x, pointer.y);
    });
  }
}

export const Samoji = () => {
  //config
  const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 800,
    height: 600,
    scene: Example,
    scale: { 
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200 },
      },
    },
  };

  //render gamecomponent
  return (
    <div>
      <GameComponent config={config} />
    </div>
  );
};
