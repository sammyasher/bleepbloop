import React from "react";
import Phaser from "phaser";
import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";
import yellow_circle from "../assets/particles/yellow.circular.png";

//const synth = new Tone.Synth().toDestination();
//const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

class Example extends Phaser.Scene {
  preload() {
    this.load.image("yellow", yellow_circle);
  }

  create() {
    const particles = this.add.particles(0, 0, "yellow", {
      //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig

      speed: 100, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
      frequency: 1,// (circles/shapes painting) // 
      lifespan: 1100,
      scale: { start: .2, end: 0 }, //try single values, growth ones (smokey), and positive to negative which shrinks then grwos

      //blendMode: "ADD",
      // angle: { min: 0, max: 360 },
      // delay: 1000,
      // gravityX: 1000,
      // gravityY: 5000,
      //moveToX: 100,  //activate both these to have particles sink into a specific point
      //moveToY: 100,  //activate both these to have particles sink into a specific point
      //maybe have first touch emit particles, second touch sink them into it

      follow: this.input.activePointer,
      emitting: false,

      // emitCallback: () => {
        //   const randomNote = notes[Math.floor(Math.random() * notes.length)];
        //   synth.triggerAttackRelease(randomNote, "8n");},

      //onParticleEmit:
    });

    this.input.on("pointerdown", () => {
      particles.emitting = true;
      particles.startFollow(this.input.activePointer);
    });

    this.input.on("pointerup", () => {
      particles.emitting = false;
      //particles.explode(10, pointer.x, pointer.y);
    });
  }
}

export const Home = () => {
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
