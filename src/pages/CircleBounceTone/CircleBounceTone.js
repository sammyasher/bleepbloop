import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../../components/GameComponent";
import * as Tone from "tone";
//import { Collision } from "matter";
import mushroom from "./assets/mushroom.png"




class Example extends Phaser.Scene {
    constructor() {
        super("Example");
        this.circle = null;
        this.sprites = [];
        this.currentChordIndex = 0;
    }
     
    
    outsideCircle = [];

    randomNote() {
        const chords = [
            ["C4", "E4", "G4", "B4", "D5", "G5", "B5", "C6"],
            ["F2", "F3", "C4", "A4"],
            ["G2", "C3", "G4", "E5", "C4",],
            ["A2", "E3", "C5", "E5", "G5", "B5"],

            //c major 7 across 3 octaves

        ];
        const chord = chords[Math.floor(Math.random() * chords.length)];
        console.log(chord);
        return chord[Math.floor(Math.random() * chord.length)];

    }

    preload() {
        this.load.image('mushroom', mushroom);

        this.synth = new Tone.PolySynth(Tone.Synth); 

        this.synth.set({
            vibratoAmount: 0.5,
            vibratoRate: 5,
        });
        //add slight phlange to synth
        this.phlanger = new Tone.Phaser({
            frequency: 2,
            octaves: 1,
            baseFrequency: 1000
        })

        this.gainNode = new Tone.Gain(.17);
        this.synth.connect(this.gainNode);//

        this.reverb = new Tone.Reverb(4);
        this.gainNode.connect(this.reverb);//to only send a certain amount of phlanger to reverb, add a gain node between the phlanger and reverb

        this.limiter = new Tone.Limiter(-1).toDestination(); //  //threshold bet
        this.reverb.connect(this.limiter);

        //make synth sound loong release, and add reverb
        this.synth.set({
            envelope: {
                attack: 0.05,
                //random release up to .5 excluding 0 
                release: Math.random() * 0.6 + 0.06
            },

        });

        this.pastbodiesInCircle = [];

    }

    create() {
        //right now tone only works after click. how do i auto-click to initiate without user interaction? by typing 

        this.width = this.scale.width;
        this.height = this.scale.height;

        this.numberOfShrooms = this.width / 30; //divided by width of mushrooms
        this.sprites = [];

        //make bouncing rectangles
        for (let i = 0; i < this.numberOfShrooms; i++) {
            const pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds); //return a random point within the canvas

            const body = this.physics.add.sprite(pos.x, pos.y, 'mushroom'); //add an image at that point
            //make sprites bounce into each other and respond to each others boundaries
           

            body.setScale(0.05);
            body.setBounce(1).setCollideWorldBounds(true);  
            // this.physics.add.collider(body, this.sprites);  //MAKE BODY COLLIDE WITH OTHER BODIES IN SPRITES ARRAY

            body.synth = this.synth; //set the synth of the block
            body.note = this.randomNote(); //set the note of the block. the index of the note is the remainder of i divided by 7
            body.notePlaying = false;// this is a flag to check if the note is playing

            Phaser.Math.RandomXY(body.body.velocity, 100); //set the velocity of the block

            this.sprites.push(body); //add sprite to block array 
        }


        //make circle
        this.circle = this.add.circle(400, 300, 50).setStrokeStyle(2, 0xffff00).setActive(false).setVisible(false);


        this.input.on('pointerdown', (pointer) => {
            this.reassignNotes();
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

    reassignNotes() {
        const chords = [
            ["C3", "C4", "E4", "G4", "B4", "D5", "G5", "B5", "C5", "C6"],
            ["F2", "F3", "C4", "A4"],
            ["A2", "E3", "C4", "E5", "G5", "B5"],
            ["G2", "D3", "G3", "B4", "D5", "F5", "A5"],
            
            // Add more chords as needed
        ];
        const chord = chords[this.currentChordIndex];
        this.sprites.forEach(sprite => {
            const newNote = chord[Math.floor(Math.random() * chord.length)];
            sprite.note = newNote;
        });
        this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;  
        console.log(this.currentChordIndex);
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
            }//sometimes this misses notes, because the body is not in the circle, but the sprite is, so t
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
