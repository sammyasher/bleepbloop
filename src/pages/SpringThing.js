import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../components/GameComponent";
import * as Tone from "tone"; 


class Scene1 extends Phaser.Scene {
    constructor() {
        super('Scene1');
    }

 

    create() {
        
        this.freqScale = 100000;
        this.matter.world.setBounds();
        this.matter.add.mouseSpring();  

        const width = this.scale.width;
        const height = this.scale.height;

        const springHolder = this.matter.add.rectangle(width/2, height/18/2, width, height/18, {isStatic: true});

        const circle1 = this.matter.add.circle(width/6, 250, width/40);
        const circle2 = this.matter.add.circle((width/6)*2, 250, width/34);
        const circle3 = this.matter.add.circle((width/6)*3, 250, width/25);
        const circle4 = this.matter.add.circle((width/6)*4, 250, width/19);
        const circle5 = this.matter.add.circle((width/6)*5, 250, width/15);


        this.spring1 = this.matter.add.spring(springHolder, circle1, height*.2, 0.001, { pointA: { x: -width/2 + width/6, y: 0 }});  
        this.spring2 = this.matter.add.spring(springHolder, circle2, height*.3, 0.001, { pointA: { x: -width/2 + width/3, y: 0 }});
        this.spring3 = this.matter.add.spring(springHolder, circle3, height*.4, 0.001, { pointA: { x: -width/2 + width/2, y: 0 }});
        this.spring4 = this.matter.add.spring(springHolder, circle4, height*.5, 0.001, { pointA: { x: -width/2 + width/1.5, y: 0 }});
        this.spring5 = this.matter.add.spring(springHolder, circle5, height*.6, 0.001, { pointA: { x: -width/2 + width/1.2, y: 0 }});

        const oscillator = "triangle"
        this.spring1.synth = new Tone.Synth({
            oscillator: {
                type: oscillator
            },
            volume: -8,
            envelope: {
                releaseCurve: "linear",
                attack: 0.1,
                decay: 3,   
                sustain: .3,
                release: 10
            }}).toDestination(); 
        this.spring2.synth = new Tone.Synth({
            oscillator: {
                type: oscillator
            },
            volume: -8, 
            envelope: {
                releaseCurve: "linear",
                attack: 0.1,
                decay: 3,
                sustain: 0.3,
                release: 10
            }}).toDestination();
        this.spring3.synth = new Tone.Synth({
            oscillator: {
                type: oscillator
            },
            volume: -8,
            envelope: {
                releaseCurve: "linear",
                attack: 0.1,
                decay: 3,
                sustain: 0.3,
                release: 10
            }}).toDestination();
        this.spring4.synth = new Tone.Synth({
            oscillator: {
                type: oscillator
            },
            volume: -8,
            envelope: {
                releaseCurve: "linear",
                attack: 0.1,
                decay: 3,
                sustain: 0.3,
                release: 10
            }}).toDestination();
        this.spring5.synth = new Tone.Synth({
            oscillator: {
                type: oscillator
            },
            volume: -8,
            envelope: {
                releaseCurve: "linear",
                attack: 0.1,
                decay: 3,
                sustain: 0.3,
                release: 10
            }}).toDestination(); 
 

        this.input.on('pointerup', (pointer) => {
            this.matter.query.point(this.matter.world.localWorld.bodies, this.input.activePointer.position).forEach((body) => {  
                if (body === circle1) {
                    this.spring1.synth.triggerAttackRelease(2)
                }; 
                if (body === circle2) {
                    this.spring2.synth.triggerAttackRelease(2); 
                };
                if (body === circle3) {
                    this.spring3.synth.triggerAttackRelease(2); 
                };
                if (body === circle4) {
                    this.spring4.synth.triggerAttackRelease(2); 
                };
                if (body === circle5) {
                    this.spring5.synth.triggerAttackRelease(2); 
                }; 
             });
        });
    }
    
    update() {
        
        const length1 = Phaser.Math.Distance.Between(this.spring1.bodyA.position.x + this.spring1.pointA.x, this.spring1.pointA.y, this.spring1.bodyB.position.x, this.spring1.bodyB.position.y);
        const length2 = Phaser.Math.Distance.Between(this.spring2.bodyA.position.x + this.spring2.pointA.x, this.spring2.pointA.y, this.spring2.bodyB.position.x, this.spring2.bodyB.position.y);
        const length3 = Phaser.Math.Distance.Between(this.spring3.bodyA.position.x + this.spring3.pointA.x, this.spring3.pointA.y, this.spring3.bodyB.position.x, this.spring3.bodyB.position.y);
        const length4 = Phaser.Math.Distance.Between(this.spring4.bodyA.position.x + this.spring4.pointA.x, this.spring4.pointA.y, this.spring4.bodyB.position.x, this.spring4.bodyB.position.y);
        const length5 = Phaser.Math.Distance.Between(this.spring5.bodyA.position.x + this.spring5.pointA.x, this.spring5.pointA.y, this.spring5.bodyB.position.x, this.spring5.bodyB.position.y);
        
        console.log(length1, length2, length3, length4, length5);

        this.spring1.synth.frequency.value = 1/length1 * this.freqScale;  
        this.spring2.synth.frequency.value = 1/length2 * this.freqScale;
        this.spring3.synth.frequency.value = 1/length3 * this.freqScale;
        this.spring4.synth.frequency.value = 1/length4 * this.freqScale;
        this.spring5.synth.frequency.value = 1/length5 * this.freqScale;
    }
}

export const SpringThing = () => {
    //config
    const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: '100%',
        height: '100%',
        scene: [Scene1],
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: "matter", //matter is a physics engine that comes with Phaser
            matter: {
                enableSleeping: true,
                debug: {
    
                    // showAxes: false,
                    // showAngleIndicator: true,
                    // angleColor: 0xe81153,
    
                    // showBroadphase: false,
                    // broadphaseColor: 0xffb400,
    
                    // showBounds: false,
                    // boundsColor: 0xffffff,
    
                    // showVelocity: true,
                    // velocityColor: 0x00aeef,
    
                    // showCollisions: true,
                    // collisionColor: 0xf5950c,
        
                    // showSeparations: false,
                    // separationColor: 0xffa500,
    
                    // showBody: true,
                    // showStaticBody: true,
                    // showInternalEdges: true,
    
                    // renderFill: false,
                    // renderLine: true,
        
                    // fillColor: 0x106909,
                    // fillOpacity: 1,
                    // lineColor: 0x28de19,
                    // lineOpacity: 1,
                    // lineThickness: 1,
        
                    // staticFillColor: 0x0d177b,
                    // staticLineColor: 0x1327e4,
    
                    // showSleeping: true,
                    // staticBodySleepOpacity: 1,
                    // sleepFillColor: 0x464646,
                    // sleepLineColor: 0x999a99,
        
                    // showSensors: true,
                    // sensorFillColor: 0x0d177b,
                    // sensorLineColor: 0x1327e4,
        
                    // showPositions: true,
                    // positionSize: 4,
                    // positionColor: 0xe042da,
        
                    // showJoint: true,
                    // jointColor: 0xe0e042,
                    // jointLineOpacity: 1,
                    // jointLineThickness: 2,
        
                    // pinSize: 4,
                    // pinColor: 0x42e0e0,
        
                    // springColor: 0xe042e0,
        
                    // anchorColor: 0xefefef,
                    // anchorSize: 4,
        
                    // showConvexHulls: true,
                    // hullColor: 0xd703d0
                }
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