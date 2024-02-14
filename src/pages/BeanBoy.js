import React from "react";
import Phaser, { Create } from "phaser";
//import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";
import Bean1 from "../assets/BeanBoy/Bean1.png";
import Bean2 from "../assets/BeanBoy/Bean2.png";
import Bean3 from "../assets/BeanBoy/Bean3.png";
import Bean4 from "../assets/BeanBoy/Bean4.png";
import Bean5 from "../assets/BeanBoy/Bean5.png";
import Bean6 from "../assets/BeanBoy/Bean6.png";
import Bean7 from "../assets/BeanBoy/Bean7.png";
import Bean8 from "../assets/BeanBoy/Bean8.png";
import Heart from "../assets/BeanBoy/Heart.png";
import Crunchy from "../assets/BeanBoy/Crunchy.png";
import Drips from "../assets/BeanBoy/Drips.png";
import Faucet from "../assets/BeanBoy/Faucet.png";
import Forrest1 from "../assets/BeanBoy/Forrest1.png";
import Forrest2 from "../assets/BeanBoy/Forrest2.png";

//once all crunchies are collected, Forrest pops out and if you click her, bean screams and crunches are released, rinse repeat


//const synth = new Tone.Synth().toDestination();
//const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

class Example extends Phaser.Scene {
    constructor() {
        super();
        this.dripCount = 10;
        this.drips = null;
        this.faucet = null;
        this.dripTimer = null;
    }

    preload() {
        this.load.image("Bean1", Bean1);
        this.load.image("Bean2", Bean2);
        this.load.image("Bean3", Bean3);
        this.load.image("Bean4", Bean4);
        this.load.image("Bean5", Bean5);
        this.load.image("Bean6", Bean6);
        this.load.image("Bean7", Bean7);
        this.load.image("Bean8", Bean8);
        this.load.image("Heart", Heart);
        this.load.image("Crunchy", Crunchy);
        this.load.image("Drips", Drips);
        this.load.image("Faucet", Faucet);
        this.load.image("Forrest1", Forrest1);
        this.load.image("Forrest2", Forrest2);

    }
    DestroyDrips = () => {
        if (this.drips) {
            this.dripTimer.destroy(); // Destroy the drip timer.
        }
        if (this.faucet) {
            this.faucet.destroy(); // Destroy the faucet object.
             // Clear the reference.
        }
        this.dripCount = 10; // Reset the drip count.
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
 
        const CreateFaucetAndDrips = () => {
            this.faucet = this.physics.add.image(0, 60, "Faucet").setScale(.5);
            this.drips = this.physics.add.group();
            this.tweens.add({
                targets: this.faucet,
                x: this.scale.width - 100,
                ease: "Sine.easeInOut",
                duration: 3000,
                yoyo: true,
                repeat: -1,
            });
            
            const CreateDrips = () => {
                const drip = this.drips.create(this.faucet.x + 30, this.faucet.y + 50, 'Drips').setScale(.05);
                drip.setGravityY(200); // Adjust gravity as needed
                drip.setVelocityY(100); // Adjust velocity as needed
                drip.setDepth(-1);
            }

            this.dripTimer = this.time.addEvent({ 
                delay: 400,
                callback: CreateDrips,
                callbackScope: this,
                loop: true,
                //turn off loop when dripCount === 0 by using the event's return value, liek this: 
      
            });
        };

        //create crunchies
        this.crunchies = this.physics.add.group();
        var crunchCount;

        const CreateCrunchies = () => {
            const crunchAmount = 8;
            crunchCount = crunchAmount;
            for (let i = 0; i < crunchAmount; i++) {
                const crunchy = this.crunchies.create(Phaser.Math.Between(0, this.scale.width), 0, "Crunchy").setScale(.2);
                crunchy.setBounce(1);
                crunchy.setCollideWorldBounds(true);
                crunchy.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
                crunchy.setAngularVelocity(Phaser.Math.Between(-200, 200));
                crunchy.setGravityY(Phaser.Math.Between(50, 150));
            }
        }

        //create Forrest
        const Forrest1 = () => {
            this.forrest1 = this.physics.add.sprite(this.scale.width * .2, this.scale.height + 100, "Forrest1").setScale(.8);
            // popup from bottom right tween and stay there
            this.tweens.add({
                targets: this.forrest1,
                x: this.scale.width * .4,
                y: this.scale.height - 100,
                ease: "Power1",  
                duration: 3000,
                yoyo: false,
                repeat: 0,
            });
        }

        Forrest1();

        const Forrest2 = () => {
            this.forrest2 = this.physics.add.sprite(this.scale.width +100, this.scale.height / 2, "Forrest2").setScale(.5);
            // popup from bottom right tween and stay there
            this.tweens.add({
                targets: this.forrest2,
                x: this.scale.width -100,
                y: this.scale.height / 2,
                ease: "Power1",
                duration: 4000,
                repeat: 0,
            });
        }

        //Bean
        const BeanBoys = [
            "Bean1",
            "Bean2",
            "Bean3",
            // "Bean4",
            "Bean5",
            "Bean6",
            "Bean7",
            "Bean8",
        ];

        this.input.on("pointerdown", (pointer) => {
            const randomBean = Phaser.Math.RND.pick(BeanBoys);
            this.bean = this.physics.add.sprite(pointer.x, pointer.y, randomBean).setScale(0.5);

            

        });

        this.input.on("pointermove", (pointer) => {
            if (this.bean) {
                this.bean.setPosition(pointer.x, pointer.y);
                this.physics.add.overlap(this.bean, this.forrest1, () => {
                    this.forrest1.destroy();    
                    CreateFaucetAndDrips();
                });
    
                this.physics.add.overlap(this.bean, this.drips, (bean, drip) => {
                    drip.destroy();
                    this.heartsEmitter.explode(1, drip.x, drip.y);
                    this.dripCount--;
                    if (this.dripCount === 0) {
                        this.DestroyDrips();
                        Forrest2();       
                    }
                });
    
                this.physics.add.overlap(this.bean, this.forrest2, () => {
                    this.forrest2.destroy();
                    CreateCrunchies();
                });
    
                this.physics.add.overlap(this.bean, this.crunchies, (bean, crunchy) => {
                    crunchy.destroy();
                    this.heartsEmitter.explode(1, crunchy.x, crunchy.y)
                    crunchCount--;
                    if (crunchCount === 0) {
                        Forrest1();
                    }
                });
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
                    debug: true,
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


//TO DO
//scale beans
//crop some
//test both fancy beans

//add Forrest to activate crunchies. maybe that and water

//start screen?

//