import React from "react";
import Phaser, { Create } from "phaser";
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
import ForrestCouch from "../assets/BeanBoy/ForrestCouch.png";
import WaterDrop from "../assets/BeanBoy/Sounds/WaterDrop.mp3";
import BeanSound1 from "../assets/BeanBoy/Sounds/bean.1.mp3";
import BeanSound2 from "../assets/BeanBoy/Sounds/bean.2.mp3";
import Crunch from "../assets/BeanBoy/Sounds/Crunch.mp3";


class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        let startButton = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Start', {
            font: '64px Arial',
            fill: '#ffffff'
        }).setInteractive().setOrigin(0.5);

        startButton.on('pointerdown', () => {
            this.scene.start('Example');
        });
    }
}


class Example extends Phaser.Scene {
    constructor() {
        super('Example');
        this.dripCount = 13;
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
        this.load.image("ForrestCouch", ForrestCouch);

        this.load.audio("WaterDrop", WaterDrop);
        this.load.audio("BeanSound1", BeanSound1);
        this.load.audio("BeanSound2", BeanSound2);
        this.load.audio("Crunch", Crunch);

    }

    DestroyDrips = () => {
        if (this.drips) {
            this.dripTimer.destroy(); // Destroy the drip timer.
        }
        if (this.faucet) {
            this.faucet.destroy(); // Destroy the faucet object.
            // Clear the reference.
        }
        this.dripCount = 13; // Reset the drip count.
    }

    create() {

        //create hearts emitter
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

        //create faucet and drips
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
            const crunchAmount = 12;
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

        //create Forrest1
        const Forrest1 = () => {
            this.forrest1 = this.physics.add.sprite(this.scale.width * .9, this.scale.height + 50, "Forrest1").setScale(.8);
            // popup from bottom right tween and stay there
            this.tweens.add({
                targets: this.forrest1,
                x: this.scale.width * .8,
                y: this.scale.height - 100,
                ease: "Power1",
                duration: 3000,
                yoyo: false,
                repeat: 0,
            });
        }

        Forrest1();

        //create Forrest2
        const Forrest2 = () => {
            this.forrest2 = this.physics.add.sprite(this.scale.width + 100, this.scale.height / 2, "ForrestCouch").setScale(.5);
            // popup from bottom right tween and stay there
            this.tweens.add({
                targets: this.forrest2,
                x: this.scale.width - 100,
                y: this.scale.height / 2,
                ease: "Power2",
                duration: 2000,
                repeat: 0,
            });
        }

        //create list of beanboys
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

        //create and move bean with pointer
        this.input.on("pointerdown", (pointer) => {
            const randomBean = Phaser.Math.RND.pick(BeanBoys);
            this.bean = this.physics.add.sprite(pointer.x, pointer.y - 80, randomBean).setScale(0.5);
        });

        this.input.on("pointermove", (pointer) => {
            if (this.bean) {
                this.bean.setPosition(pointer.x, pointer.y - 80);

                //overlap forrest1 to turn on drips
                this.physics.add.overlap(this.bean, this.forrest1, () => {
                    this.sound.play("BeanSound1");
                    this.forrest1.destroy();
                    CreateFaucetAndDrips();
                });

                //drink drips and activate forrest2
                this.physics.add.overlap(this.bean, this.drips, (bean, drip) => {
                    this.sound.play("WaterDrop");
                    drip.destroy();
                    this.heartsEmitter.explode(1, drip.x, drip.y);
                    this.dripCount--;
                    if (this.dripCount === 0) {
                        this.DestroyDrips();
                        Forrest2();
                    }
                });

                //overlap forrest2 to release crunchies
                this.physics.add.overlap(this.bean, this.forrest2, () => {
                    this.sound.play("BeanSound2");
                    this.forrest2.destroy();
                    CreateCrunchies();
                });

                //eat crunchies and activate forrest1
                this.physics.add.overlap(this.bean, this.crunchies, (bean, crunchy) => {
                    this.sound.play("Crunch");
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
            if (this.bean) {
                this.bean.destroy();
            }

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
        scene: [StartScene, Example],
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0 },
                //debug: true,
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