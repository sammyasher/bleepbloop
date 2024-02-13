import React from "react";
import Phaser from "phaser";
import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";

const synth = new Tone.Synth().toDestination();
console.log("synth created");
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

class Example extends Phaser.Scene {
  preload() {
    this.load.image("sam", "assets/Samojis/Sam — Wow!.png");
    this.load.setBaseURL("https://labs.phaser.io");
    this.load.image("red", "assets/particles/red.png");
    this.load.image("blue", "assets/particles/blue.png");
    this.load.image("green", "assets/particles/green.png");
    this.load.image("yellow", "assets/particles/yellow.png");
    this.load.image("sparkle", "assets/particles/sparkle.png");
    this.load.image("smoke", "assets/particles/smoke-puff.png");
    this.load.image("star", "assets/particles/star.png");
    this.load.image("circle", "assets/particles/circle.png");
    this.load.image("square", "assets/particles/square.png");
    this.load.image("triangle", "assets/particles/triangle.png");
  }

  create() {
    const groundToAir = this.add.particles(0, 0, "blue", {
      //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig

      speed: 320, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
      frequency: 200, // also try really fast speeds like 50, but reload over and over til it works. has to do with initialization problems. investigating.
      lifespan: 2000,
      scale: { start: 0.3, end: 0 }, //try single values, growth ones (smokey), and positive to negative which shrinks then grwos
      //blendMode: "ADD",
      angle: { min: -100, max: -80 },
      // delay: 1000,
      // gravityX: 1000,
      gravityY: 150,
      //moveToX: 100,  //activate both these to have particles sink into a specific point
      //moveToY: 100,  //activate both these to have particles sink into a specific point
      //maybe have first touch emit particles, second touch sink them into it

      follow: this.input.activePointer,
      emitting: false,

      deathCallback: (particle) => {
        secondaryFirework.explode(20, particle.x, particle.y);
      },
    });

    this.input.on("pointerdown", () => {
      groundToAir.emitting = true;
      groundToAir.startFollow(this.input.activePointer);
    });

    this.input.on("pointerup", () => {
      groundToAir.emitting = false;
    });
    const secondaryFirework = this.add.particles(0, 0, "red", {
      speed: 50, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
      frequency: 150, // also try really fast speeds like 50, but reload over and over til it works. has to do with initialization problems. investigating.
      lifespan: 2000,
      scale: { start: 0.3, end: 0 }, //try single values, growth ones (smokey), and positive to negative which shrinks then grwos

      gravityY: 30,

      emitting: false,

      deathCallback: (particle) => {
        tertiaryFirework.explode(6, particle.x, particle.y);
      },
    });
    const tertiaryFirework = this.add.particles(0, 0, "green", {
      speed: 50, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
      frequency: 400, // also try really fast speeds like 50, but reload over and over til it works. has to do with initialization problems. investigating.
      lifespan: 3000,
      scale: { start: 0.1, end: 0 }, //try single values, growth ones (smokey), and positive to negative which shrinks then grwos

      gravityY: 30,

      emitting: false,

      deathCallback: (particle) => {
        console.log("death callback");
      },
    });
  }
}

export const MultiFireWork = () => {
  //config
  const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 800,
    height: 600,
    scene: Example,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
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
