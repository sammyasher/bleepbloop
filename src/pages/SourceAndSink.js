import React from "react";
import Phaser from "phaser";
//import * as Tone from "tone";
import { GameComponent } from "../components/GameComponent";
import red_circle from "../assets/particles/red.circular.png";
import blackhole from "../assets/Sinks/blackhole.png";

//const synth = new Tone.Synth().toDestination();
//const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

var particles;

class Example extends Phaser.Scene {
    preload() {
        this.load.image("red", red_circle);
        this.load.image("blackhole", blackhole);
    }

    create() {

        this.input.addPointer(2);

        particles = this.add.particles(0, 0, "red", {
            //all attributes: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
            lifespan: 1400,
            frequency: 50, 
            scale: { start: .5, end: 0 },  
            moveToX: this.scale.width / 2,   
            moveToY: this.scale.height / 2,   
            follow: this.input.activePointer,
            emitting: false,
        }).setDepth(1);


        this.input.on("pointerdown", () => {
            particles.emitting = true;
            if (this.input.pointer1.isDown) {
                particles.startFollow(this.input.pointer1);
            }
        });


        this.input.on("pointerup", () => {
            if (!this.input.pointer1.isDown) {
                particles.emitting = false;
            }
        });

        this.blackhole = this.add.image(this.scale.width/2, this.scale.height/2, "blackhole").setScale(0.1);
        this.blackhole.setDepth(0);

    }

    update() {
        if (this.input.pointer2.isDown) {
            particles.moveToX = this.input.pointer2.x;
            particles.moveToY = this.input.pointer2.y;
            this.blackhole.x = this.input.pointer2.x;
            this.blackhole.y = this.input.pointer2.y;
        }

    }

}

export const SourceAndSink = () => {
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
