import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../../components/GameComponent";
import * as Tone from "tone";
import { click } from "@testing-library/user-event/dist/click";
import { createTether, removeTether, createTethered } from "../../Utils/TetherUtils";
import * as Make from "./Utils";//how to import all from Utils? by writing import 


class FerrisWheel extends Phaser.Scene {
    constructor(scene) {
        super("FerrisWheel");
    }


    create() {
        ////PREPARE WORLD
        this.matter.add.mouseSpring();

        //store canvas dimensions
        const width = this.scale.width;
        const height = this.scale.height;

        // create spider

        const armLength = .3 * Math.min(width, height);

        for (let i = 0; i < 1; i++) {

            let PoofPuff = new Make.PoofPuff(this, {x: this.scale.width / 2, y: this.scale.height, pinMoves: true});  //how to set one of the parameters to its default value? 
            let Whirlygig = new Make.Whirlygig(this, this.scale.width / 2, height - armLength - (.13 * Math.max(width, height)));  //how to set one of the parameters to its default value? 

            this.add.text(width - 50, 50, "Next", {
                color: "white",
            })
                .setInteractive()
                .on("pointerdown", () => {
                    this.scene.start("BeNotAfraid");
                });

        }//


    }
}

class BeNotAfraid extends Phaser.Scene {
    constructor(scene) {
        super("BeNotAfraid");
    }

    create() {
        ////PREPARE WORLD
        // this.matter.world.setBounds();
        this.matter.add.mouseSpring();

        //store canvas dimensions
        const width = this.scale.width;
        const height = this.scale.height;


        for (let i = 0; i < 1; i++) {
            let PoofPuff = new Make.PoofPuff(this, {number: 31, x: this.scale.width / 2, y: this.scale.height / 2});  //how to set one of the parameters to its default value? 
            // let Whirlygig = new Make.Whirlygig(this, undefined, undefined, Math.random() * this.scale.width, Math.random() * this.scale.height);  //how to set one of the parameters to its default value? 
            // let Whirlygig2 = new Make.Whirlygig(this, undefined, undefined, Math.random() * this.scale.width, Math.random() * this.scale.height);  //how to set one of the parameters to its default value? 
        }//


        this.add.text(width - 50, 50, "Next", {
            color: "white",
        })
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("FloatingFriendlies");
            });
        //create tether array
        // this.tethers = [];
    }
}

class FloatingFriendlies extends Phaser.Scene {

    constructor(scene) {
        super("FloatingFriendlies");
    }

    create() {
        ////PREPARE WORLD
        // this.matter.world.disableGravity();
        this.matter.world.setBounds();
        this.matter.add.mouseSpring();

        //store canvas dimensions
        const width = this.scale.width;
        const height = this.scale.height;

        const number = 5;
        for (let i = 0; i < number; i++) {
            let PoofPuff = new Make.PoofPuff(this, {pinStatic: false, pinRadius: .06 * Math.min(this.scale.width, this.scale.height)});  //how to set one of the parameters to its default value? 
         }//

        this.add.text(width - 50, 50, "Next", {
            color: "white",
        })
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("FloatingFriendlies");
            });
        //create tether array
        // this.tethers = [];
    }
}


export const Species = () => {
    //config
    const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: "100%",
        height: "95%", //why does 100% make it below the fold?
        scene: [FerrisWheel, BeNotAfraid, FloatingFriendlies],
        // scale: {
        //   mode: Phaser.Scale.RESIZE,
        //   autoCenter: Phaser.Scale.CENTER_BOTH,
        // },
        physics: {
            default: "matter", //matter is a physics engine that comes with Phaser
            matter: {
                enableSleeping: true,
                debug: true,
            }
        },
    };

    //render gamecomponent
    return (
        <div>
            <GameComponent config={config} />
        </div>
    );
};

