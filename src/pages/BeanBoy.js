import React from "react";
import Phaser from "phaser";
//import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";
import Bean1 from "../assets/BeanBoy/Bean1.png";
import Bean2 from "../assets/BeanBoy/Bean2.png";
import Bean3 from "../assets/BeanBoy/Bean3.png";    
import Bean4 from "../assets/BeanBoy/Bean4.png";
import Bean5 from "../assets/BeanBoy/Bean5.png";
import Bean6 from "../assets/BeanBoy/Bean6.png";
import Bean7 from "../assets/BeanBoy/Bean7.png";
import Heart from "../assets/BeanBoy/Heart.png";
import Crunchy from "../assets/BeanBoy/Crunchy.png";
import Drips from "../assets/BeanBoy/Drips.png";
import Faucet from "../assets/BeanBoy/Faucet.png";


//once all crunchies are collected, Forrest pops out and if you click her, bean screams and crunches are released, rinse repeat


//const synth = new Tone.Synth().toDestination();
//const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

class Example extends Phaser.Scene {

  preload() {
    this.load.image("Bean1", Bean1);
    this.load.image("Bean2", Bean2);
    this.load.image("Bean3", Bean3);
    this.load.image("Bean4", Bean4);
    this.load.image("Bean5", Bean5);
    this.load.image("Bean6", Bean6);
    this.load.image("Bean7", Bean7);
    this.load.image("Heart", Heart);
    this.load.image("Crunchy", Crunchy);
    this.load.image("Drips", Drips);
    this.load.image("Faucet", Faucet);
  }

  create() {

    this.heartsEmitter = this.add.particles(0, 0, "Heart", {
        //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
        speed: 100,  
        frequency: -1, 
        explode: true,
        lifespan: 1000,
        scale: { start: .02, end: 0 },  
        follow: this.input.activePointer,
        emitting: true,
        Depth: 3,
      }).setDepth(3);

    //add faucet image that goes back and forth on the top and emits drips
    const faucet = this.add.image(0, 60, "Faucet").setScale(.5);
    this.tweens.add({
      targets: faucet,
      x: this.scale.width - 100 ,
      ease: "Sine.easeInOut",
      duration: 3000,
      yoyo: true,
      repeat: -1,

    });
    
    //create drips
    this.drips = this.physics.add.group();

    this.createDrip = () => {
        // Create a drip at the faucet's position
        const drip = this.drips.create(faucet.x+30, faucet.y+50, 'Drips').setScale(.05);
        drip.setGravityY(200); // Adjust gravity as needed
        drip.setVelocityY(100); // Adjust velocity as needed
        drip.setDepth(-1);
    };

    this.time.addEvent({
        delay: 400,  
        callback: this.createDrip,
        callbackScope: this,
        loop: true
    });
    
    //create crunchies
    this.crunchies = this.physics.add.group();

    for (let i = 0; i < 8; i++) {
      const crunchy = this.crunchies.create(Phaser.Math.Between(0, this.scale.width), 0, "Crunchy").setScale(.2);
      crunchy.setBounce(1);
      crunchy.setCollideWorldBounds(true);
      crunchy.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
      crunchy.setGravityY(100);
    }

    //Load Beans and BeanSounds
    const BeanBoys = [
        "Bean1",
        "Bean2",
        "Bean3",
        "Bean4",
        "Bean5",
        "Bean6",
        "Bean7",
      ]; 

      

    // const BeanSounds = [
    //     "BeanSound1",
    //     "BeanSound2",
    //     "BeanSound3",
    //     "BeanSound4",
    //     "BeanSound5",
    //     "BeanSound6",
    //   ];

 
    this.input.on("pointerdown", (pointer) => {
        const randomBean = Phaser.Math.RND.pick(BeanBoys);
        this.bean = this.physics.add.sprite(pointer.x, pointer.y, randomBean).setScale(0.5);
        
        this.physics.add.overlap(this.bean, this.drips, (bean, drip) => {
        drip.destroy();
        this.heartsEmitter.explode(1, bean.x, bean.y);});
    });

    this.input.on("pointermove", (pointer) => {
        if (this.bean) {
            this.bean.setPosition(pointer.x, pointer.y);
        }
    });

    this.input.on("pointerup", () => {
        this.bean.destroy();
    });
    
   
 
  
  }

}

export const BeanBoy = () => {
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
        gravity: { y: 0 },
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