import React from "react";
import Phaser from "phaser";
import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";

//create a tone synth granulizer so i can turn it on and adjust parameters/grains to match particles. the code is:
const synth = new Tone.Synth().toDestination();

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
    const smoke = this.add.particles(0, 0, "smoke", {
      //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig

      speed: 120,
      frequency: 100,
      lifespan: 4400,

      scale: { start: 0.2, end: 0.8 },

      gravityX: 200,

      follow: this.input.activePointer,
      emitting: false,
    });
    const smokeEnd = this.add.particles(0, 0, "smoke", {
      speed: 0,
      frequency: 100,
      lifespan: 4400,

      scale: { start: 0.1, end: 2 },
      gravityX: 100,
      gravityY: -200,

      follow: this.input.activePointer,
      emitting: false,
    });
    const ember = this.add.particles(0, 0, "yellow", {
      speed: 400,
      frequency: 12,
      lifespan: 150,
      moveToX: this.activePointer,
      moveToY: this.activePointer,
      scale: { start: 0.8, end: 0 },

      follow: this.input.activePointer,
      emitting: false,
    });
    const downSpark = this.add.particles(0, 0, "yellow", {
      speed: 400,
      frequency: 1700,
      lifespan: 450,

      scale: { start: 0.8, end: 0 },
      angle: { min: 40, max: 140 },

      gravityY: 800,

      follow: this.input.activePointer,
      emitting: false,
    });
    const downSpark2 = this.add.particles(0, 0, "yellow", {
      speed: 400,
      frequency: 3000,
      lifespan: 800,

      scale: { start: 0.8, end: 0 },
      angle: { min: 30, max: 150 },
      gravityX: 150,
      gravityY: 1000,

      follow: this.input.activePointer,
      emitting: false,
    });
    const downSpark3 = this.add.particles(0, 0, "yellow", {
      speed: 400,
      frequency: 3100,
      lifespan: 800,

      scale: { start: 0.8, end: 0 },

      angle: { min: 30, max: 150 },

      gravityX: 150,
      gravityY: 1000,

      follow: this.input.activePointer,
      emitting: false,
    });
    const spark2 = this.add.particles(0, 0, "yellow", {
      speed: 1600,
      frequency: 1100,
      lifespan: 70,

      scale: { start: 0.8, end: 2 },

      follow: this.input.activePointer,
      emitting: false,
    });
    const spark3 = this.add.particles(0, 0, "yellow", {
      speed: 1600,
      frequency: 1300,
      lifespan: 50,

      scale: { start: 0.2, end: 0.8 },

      follow: this.input.activePointer,
      emitting: false,
    });

    this.input.on("pointerdown", () => {
      ember.emitting = true;
      ember.startFollow(this.input.activePointer);
      downSpark.emitting = true;
      downSpark.startFollow(this.input.activePointer);
      downSpark2.emitting = true;
      downSpark2.startFollow(this.input.activePointer);
      downSpark3.emitting = true;
      spark2.emitting = true;
      spark2.startFollow(this.input.activePointer);
      spark3.emitting = true;
      spark3.startFollow(this.input.activePointer);
    });

    this.input.on("pointerup", () => {
      smoke.emitting = false;

      smoke.stopFollow();
      smokeEnd.explode(
        1,
        this.input.activePointer.x,
        this.input.activePointer.y
      );
      smokeEnd.startFollow(this.input.activePointer);
      ember.emitting = false;
      ember.stopFollow();
      downSpark.emitting = false;
      downSpark.stopFollow();
      downSpark2.emitting = false;
      downSpark.explode(
        1,
        this.input.activePointer.x,
        this.input.activePointer.y
      );
      downSpark2.stopFollow();
      spark2.emitting = false;
      spark2.stopFollow();
      spark3.emitting = false;
      spark3.stopFollow();
    });
  }
}

export const Sparkler = () => {
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
