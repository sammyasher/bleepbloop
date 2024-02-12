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

      speed: 320,
      frequency: 200,
      lifespan: 2000,
      scale: { start: 0.3, end: 0 },

      angle: { min: -100, max: -80 },

      gravityY: 150,

      follow: this.input.activePointer,
      emitting: false,

      deathCallback: (particle) => {
        const colorOptions = [
          secondaryRedFirework,
          secondaryYellowFirework,
          secondaryGreenFirework,
          secondaryBlueFirework,
        ];
        const column = Math.floor(
          (particle.x / window.innerWidth) * colorOptions.length
        );
        secondaryRedFirework.explode(20, particle.x, particle.y);

        column === 0 &&
          secondaryRedFirework.explode(20, particle.x, particle.y);
        column === 1 &&
          secondaryYellowFirework.explode(20, particle.x, particle.y);
        column === 2 &&
          secondaryGreenFirework.explode(20, particle.x, particle.y);
        column >= 3 &&
          secondaryBlueFirework.explode(20, particle.x, particle.y);
      },
    });

    this.input.on("pointerdown", () => {
      groundToAir.emitting = true;
    });

    this.input.on("pointerup", () => {
      groundToAir.emitting = false;
    });
    const secondaryRedFirework = this.add.particles(0, 0, "red", {
      speed: 50,
      frequency: 150,
      lifespan: 2000,
      scale: { start: 0.3, end: 0 },
      gravityY: 30,
      emitting: false,
      deathCallback: (particle) => {
        tertiaryRedFirework.explode(8, particle.x, particle.y);
        // tertiarySparkle.explode(6, particle.x, particle.y);
      },
    });

    const secondaryYellowFirework = this.add.particles(0, 0, "yellow", {
      speed: 50,
      frequency: 150,
      lifespan: 2000,
      scale: { start: 0.3, end: 0 },
      gravityY: 30,
      emitting: false,
      deathCallback: (particle) => {
        tertiaryYellowFirework.explode(8, particle.x, particle.y);
        // tertiarySparkle.explode(6, particle.x, particle.y);
      },
    });

    const secondaryGreenFirework = this.add.particles(0, 0, "green", {
      speed: 50,
      frequency: 150,
      lifespan: 2000,
      scale: { start: 0.3, end: 0 },
      gravityY: 30,
      emitting: false,
      deathCallback: (particle) => {
        tertiaryGreenFirework.explode(8, particle.x, particle.y);
        // tertiarySparkle.explode(6, particle.x, particle.y);
      },
    });

    const secondaryBlueFirework = this.add.particles(0, 0, "blue", {
      speed: 50,
      frequency: 150,
      lifespan: 2000,
      scale: { start: 0.3, end: 0 },
      gravityY: 30,
      emitting: false,
      deathCallback: (particle) => {
        tertiaryBlueFirework.explode(8, particle.x, particle.y);
        // tertiarySparkle.explode(6, particle.x, particle.y);
      },
    });

    const tertiaryRedFirework = this.add.particles(0, 0, "red", {
      speed: 50,
      frequency: 400,
      lifespan: 3000,
      scale: { start: 0.1, end: 0 },

      gravityY: 30,

      emitting: false,

      deathCallback: (particle) => {},
    });
    const tertiaryYellowFirework = this.add.particles(0, 0, "yellow", {
      speed: 50,
      frequency: 400,
      lifespan: 3000,
      scale: { start: 0.1, end: 0 },

      gravityY: 30,

      emitting: false,

      deathCallback: (particle) => {},
    });
    const tertiaryGreenFirework = this.add.particles(0, 0, "green", {
      speed: 50,
      frequency: 400,
      lifespan: 3000,
      scale: { start: 0.1, end: 0 },

      gravityY: 30,

      emitting: false,

      deathCallback: (particle) => {},
    });
    const tertiaryBlueFirework = this.add.particles(0, 0, "blue", {
      speed: 50,
      frequency: 400,
      lifespan: 3000,
      scale: { start: 0.1, end: 0 },

      gravityY: 30,

      emitting: false,

      deathCallback: (particle) => {},
    });
    const tertiarySparkle = this.add.particles(0, 0, "sparkle", {
      speed: 50,
      frequency: 400,
      lifespan: 3000,
      scale: { start: 0.1, end: 0 },

      gravityY: 30,

      emitting: false,

      deathCallback: (particle) => {},
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
