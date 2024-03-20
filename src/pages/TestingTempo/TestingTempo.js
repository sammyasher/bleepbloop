import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../../components/GameComponent";
import * as Tone from "tone";
//import { Collision } from "matter";
 




class Example extends Phaser.Scene {
    constructor() {
        super("Example");
    }
    
    preload() {
        
 
    }

    create() {
        //right now tone only works after click. how do i auto-click to initiate without user interaction? by typing 

        this.width = this.scale.width;
        this.height = this.scale.height;
 
        //create 10 bouncing random colored circles
        this.numberofCircles = 10;
        this.sprites = [];
        for (let i = 0; i < this.numberofCircles; i++) {
            const x = Phaser.Math.Between(0, this.width);
            const y = Phaser.Math.Between(0, this.height);
            const color = Phaser.Display.Color.RandomRGB(200);
            const circle = this.add.circle(x, y, 10, color.color);
            this.physics.add.existing(circle);
            circle.body.velocity.x = Phaser.Math.Between(-200, 200);
            circle.body.velocity.y = Phaser.Math.Between(-200, 200);
            circle.body.collideWorldBounds = true;
            circle.body.bounce.set(1);
            circle.note = this.getRandomNote();
            circle.notePlaying = false;
            this.sprites.push(circle);
        }




        

        this.input.on('pointerdown', (pointer) => {

        });

        this.input.on('pointermove', (pointer) => {
            this.circle.copyPosition(pointer); //circle move with pointer

        });

        this.input.on('pointerup', () => {
            this.circle.setActive(false);
            this.circle.setVisible(false);
        });


    }

    update() {
        Phaser.Actions.SetAlpha(this.sprites, .5);

        if (!this.circle.visible) {
            return;
        }
        const { x, y, radius } = this.circle;
        const bodiesInCircle = this.physics.overlapCirc(x, y, radius, true, true);


        this.sprites.forEach(sprite => {
            if (!bodiesInCircle.includes(sprite.body)) {
                this.synth.triggerRelease(sprite.note);
                sprite.notePlaying = false;
            }
        });

        // Turn on notes for sprites inside the circle
        bodiesInCircle.forEach(body => {
            const sprite = body.gameObject;
            if (this.pastbodiesInCircle.includes(sprite.body)) {
                return;
            }
            if (!sprite.notePlaying) {
                this.synth.triggerAttack(sprite.note, undefined, undefined); 
                sprite.notePlaying = true;
            }
        });


        Phaser.Actions.SetAlpha(bodiesInCircle.map(body => body.gameObject), 1);
        this.pastbodiesInCircle = bodiesInCircle;

    }
}

export const TestingTempo = () => {
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
