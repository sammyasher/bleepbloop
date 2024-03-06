import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../components/GameComponent";
import * as Tone from "tone";
//import { Collision } from "matter";

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

class Example extends Phaser.Scene {

    
    circle;
    sprites = [];
    outsideCircle = [];

    randomNote() {
        return (Math.random() * 920) + 130;
    }

    preload() {
        this.load.image('mushroom', 'assets/sprites/mushroom16x16.png');
       
    }

    create() {
        //right now tone only works after click. how do i auto-click to initiate without user interaction? by typing 
        

        this.sprites = [];

        for (let i = 0; i < 60; i++) {
            const pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds); //return a random point within the canvas

            const body = this.physics.add.image(pos.x, pos.y, 'mushroom'); //add an image at that point
            
            body.setBounce(1).setCollideWorldBounds(true); //set the bounce and collision
            body.note = this.randomNote(); //set the note of the block. the index of the note is the remainder of i divided by 7
            
            body.notePlaying = false;

            Phaser.Math.RandomXY(body.body.velocity, 100); //set the velocity of the block

            this.sprites.push(body); //add sprite to block array 
        }

    
        //make circle
        this.circle = this.add.circle(400, 300, 50).setStrokeStyle(2, 0xffff00).setActive(false).setVisible(false);
        

        this.input.on('pointerdown', (pointer) => {
            this.circle.copyPosition(pointer);
            this.circle.setActive(true);
            this.circle.setVisible(true);

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
        const { x, y, radius } = this.circle;
        const bodiesInCircle = this.physics.overlapCirc(x, y, radius, true, true);

        this.sprites.forEach(sprite => {
            if (!bodiesInCircle.includes(sprite.body) && sprite.notePlaying) {
                synth.triggerRelease(sprite.note);
                sprite.notePlaying = false;
            }
        });
    
        // Turn on notes for sprites inside the circle
        bodiesInCircle.forEach(body => {
            const sprite = body.gameObject;
            if (!sprite.notePlaying) {
                synth.triggerAttack(sprite.note);
                sprite.notePlaying = true;
            }
        });
    
        Phaser.Actions.SetAlpha(this.sprites, .5);
        Phaser.Actions.SetAlpha(bodiesInCircle.map(body => body.gameObject), 1);


    }
}

export const CircleBounceTone = () => {
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
