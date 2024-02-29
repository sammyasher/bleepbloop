import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../../components/GameComponent";
import * as Tone from "tone";
import { click } from "@testing-library/user-event/dist/click";
import { createTether, removeTether, createTethered} from "../../Utils/TetherUtils";
import * as Make from "./Utils";//how to import all from Utils? by writing import 



class Scene1 extends Phaser.Scene {
    constructor(scene) {
        super("Scene1");
    }

    create() {
        ////PREPARE WORLD
        //set world bounds, turn on pointer interactivity
        // this.matter.world.setBounds();
        this.matter.add.mouseSpring();

        //store canvas dimensions
        const width = this.scale.width;
        const height = this.scale.height;

        // create spider
        
        for (let i = 0; i < 3; i++) {
            let PoofPuff = new Make.PoofPuff(this, undefined, .6, Math.random() * this.scale.width, Math.random() * this.scale.height);  //how to set one of the parameters to its default value? b
        }

       
       


        //create tether array
        // this.tethers = [];

   
         
    }

    update() {
        if (this.tethers) {
            this.tethers.forEach((tether) => {
                // Calculate the length of the spring
                let length = Phaser.Math.Distance.Between(
                    tether.spring.bodyA.position.x + tether.spring.pointA.x,
                    tether.spring.bodyA.position.y + tether.spring.pointA.y,
                    tether.spring.bodyB.position.x + tether.spring.pointB.x,
                    tether.spring.bodyB.position.y + tether.spring.pointB.y
                );

                // Update the frequency of the synth
                tether.synth.detune.value = length / 2;
            });
        }
    }
}

export const Species = () => {
    //config
    const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: "100%",
        height: "95%", //why does 100% make it below the fold?
        scene: [Scene1],
        // scale: {
        //   mode: Phaser.Scale.RESIZE,
        //   autoCenter: Phaser.Scale.CENTER_BOTH,
        // },
        physics: {
            default: "matter", //matter is a physics engine that comes with Phaser
            matter: {
                enableSleeping: true,
                debug: {},
                }
        },
    };

    //render gamecomponent
    return (
        <div>
            <div>Give Spacebar a try?</div>
            <GameComponent config={config} />
        </div>
    );
};

