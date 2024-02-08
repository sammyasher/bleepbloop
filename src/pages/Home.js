import React from 'react'
import Phaser from 'phaser'
import *  as Tone from 'tone'
import { GameComponent } from '../components/GameComponent'

//create a tone synth granulizer so i can turn it on and adjust parameters/grains to match particles. the code is:
const synth = new Tone.Synth().toDestination();

class Example extends Phaser.Scene {
  preload() {
    this.load.image('sam', 'assets/Samojis/Sam — Wow!.png');
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('red', 'assets/particles/red.png');
    this.load.image('blue', 'assets/particles/blue.png');
    this.load.image('green', 'assets/particles/green.png');
    this.load.image('yellow', 'assets/particles/yellow.png');
    this.load.image('sparkle', 'assets/particles/sparkle.png');
    this.load.image('smoke', 'assets/particles/smoke-puff.png');
    this.load.image('star', 'assets/particles/star.png');
    this.load.image('circle', 'assets/particles/circle.png');
    this.load.image('square', 'assets/particles/square.png');
    this.load.image('triangle', 'assets/particles/triangle.png');
   
  }

  create() {

    const particles = this.add.particles(0, 0, 'yellow',
      {
        //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
        
        speed:  500, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
        frequency: 30,
        lifespan: 1400,
        
        scale: { start: .1, end: 0 }, //try single values, growth ones (smokey), and positive to negative which shrinks then grwos
        // blendMode: 'ADD',
        // angle: { min: 0, max: 360 },
        // delay: 1000,
        // gravityX: 1000,
        // gravityY: 1000
        //moveToX: 100,  //activate both these to have particles sink into a specific point
        //moveToY: 100,  //activate both these to have particles sink into a specific point
                          //maybe have first touch emit particles, second touch sink them into it
        
        follow: this.input.activePointer, 
        emitting: false,

        emitCallback: () => synth.triggerAttackRelease("C4", "8n")
        //onParticleEmit:  
      });
       
    this.input.on('pointerdown', () => {
      particles.emitting = true; 
    })
    
    this.input.on('pointerup', () => {
      particles.emitting = false;
      //particles.explode(10, pointer.x, pointer.y);
    })


  }
}

export const Home = () => {
  //config
  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: 800,
    height: 600,
    scene: Example,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    }
  };

  //render gamecomponent
  return (

    <div>
      <GameComponent config={config} />
    </div>
  )
}

