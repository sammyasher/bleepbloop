import React from "react";
import Phaser from "phaser";
//import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";
import yellow_circle from "../assets/particles/yellow.circular.png";
import blue_circle from "../assets/particles/red.circular.png";

//const synth = new Tone.Synth().toDestination();
//const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

class Example extends Phaser.Scene {
  preload() {
    this.load.image("yellow", yellow_circle);
    this.load.image("blue", blue_circle);
  }

  create() {
    // const particles = this.add.particles(0, 0, "yellow", {
    //   //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
    //   speed: 7, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
    //   frequency: 10,// (circles/shapes painting) // 
    //   lifespan: 10000,
    //   color: [ 0xffc200, 0xffc0cb ],  //a warm transition would be
    //   //make particles blurry and glowy by using a blend mode of ADD, and a color of 0xffc200, and 0xffc0cb, and a scale of { start: .4, end: 2 }
    // //   color: [ 0xffc200, 0xffc0cb ],  //a warm transition would be 
    //   scale: { start: 2, end: 2 }, //try single values, growth ones (smokey), and positive to negative which shrinks then grwos
    //   blendMode: "ADD", //other options and their effects are here: https://newdocs.phaser.io/docs/3.70.0/Phaser.BlendModes
    //   follow: this.input.activePointer,
    //   emitting: false,
    // });

    const particles2 = this.add.particles(0, 0, "blue", {
        //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
        speed: 30, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
        frequency: 1,// (circles/shapes painting) // 
        lifespan: 1000,
        color: [ 0xffc200, 0xffc0cb ],  //a warm transition would be 
        scale: { start: 0, end: 1 },  
        blendMode: "DARKEN", //other options and their effects are here: https://newdocs.phaser.io/docs/3.70.0/Phaser.BlendModes
        follow: this.input.activePointer,
        emitting: false,
      });

    this.input.on("pointerdown", () => {
    //   particles.emitting = true;
      particles2.emitting = true;
    });

    this.input.on("pointerup", () => {
    //   particles.emitting = false;
        particles2.emitting = false;
      //particles.explode(10, pointer.x, pointer.y);
    });
  }
}

export const GlowTone = () => {
    //config
    const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: "100%",
        height: "100%",
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