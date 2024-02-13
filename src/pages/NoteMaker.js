import React from "react";
import Phaser from "phaser";
import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";


const synth = new Tone.Synth().toDestination();
console.log('synth created')
const notes = ["C3", "G3", "A3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"];
var particles = null;

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
    particles = this.add.particles(0, 0, "blue", {
      //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
      color: [ 0xadd8e6, 0xff0000 ],  //light pink in hex is 0xffc0cb
      speed: 600, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
      frequency: 400,// also try really fast speeds like 50, but reload over and over til it works. has to do with initialization problems. investigating.
      lifespan: 2000,
      scale: { start: .3, end: 0 }, //try single values, growth ones (smokey), and positive to negative which shrinks then grwos
      //blendMode: "ADD",
      angle: { min: 220, max: 320 },
      // delay: 1000,
      // gravityX: 1000,
      gravityY: 1340,
      //moveToX: 100,  //activate both these to have particles sink into a specific point
      //moveToY: 100,  //activate both these to have particles sink into a specific point
      //maybe have first touch emit particles, second touch sink them into it

      follow: this.input.activePointer,
      emitting: false,
      
      

      emitCallback: () => {
        console.log('callback called/particle emitted');
          const randomNote = notes[Math.floor(Math.random() * notes.length)];
        console.log('random chosen');
          synth.triggerAttackRelease(randomNote, "8n");
        console.log('synth triggered');
      },
   
      //onParticleEmit:
    });
    
    this.input.on("pointerdown", () => {
      particles.emitting = true;
      console.log('emit back to true');
      particles.startFollow(this.input.activePointer);
      
    });

    this.input.on("pointerup", () => {
      particles.emitting = false;
      //particles.explode(10, pointer.x, pointer.y);
    });
  }

  update() {
    //map frequency to pointer y: 
    var newfrequency = this.input.y - (this.scale.height * .23);  

    if (newfrequency < 10) {
      newfrequency = 10;
    }  
    
    particles.frequency = newfrequency; 
   
 
    //want color to change based on x axis position of poitner
     
  }

  
}

export const NoteMaker = () => {
  //config
  const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: '100%',
    height: '100%',
    scene: Example,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200 },
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  //render gamecomponent
  return (
    <div>
      <GameComponent config={config} />
    </div>
  );
};
