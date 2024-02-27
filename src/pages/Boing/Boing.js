import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../../components/GameComponent";
import * as Tone from "tone";
import { click } from "@testing-library/user-event/dist/click";
import { createBoingTether, removeBoingTether } from "./Utils";

class Scene1 extends Phaser.Scene {
  constructor(scene) {
    super("Scene1");
  }

  create() {
    ////PREPARE WORLD
    //set world bounds, turn on pointer interactivity
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    //store canvas dimensions
    const width = this.scale.width;
    const height = this.scale.height;

    //set tethered object radius based on largest side of canvas
    const largerSide = Math.max(width, height);
    const tetheredRadius = largerSide * 0.075;
    this.radius = tetheredRadius;

    // create tethered object
    this.tethered = this.matter.add.circle(
      width * 0.5,
      height * 0.9,
      tetheredRadius,
      { density: 10, restitution: 0.7, friction: 0.01, frictionAir: 0.0 }
    );

    //create tether array
    // this.tethers = [];

    //KEYBOARD EVENTS
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.spaceBar.on("down", () => {
      this.tethers.forEach((tether) => {
        tether.synth.envelope.release = 5;
        tether.synth.envelope.releaseCurve = "exponential";
        tether.synth.triggerRelease();
        tether.boingSynth.triggerRelease();
        this.matter.world.remove(tether.peg);
        this.matter.world.remove(tether.spring);
      });
    });
    ////ON CLICK EVENTS
    this.input.on("pointerdown", (pointer) => {
      const allPegs = this.tethers
        ? this.tethers.map((tether) => tether.peg)
        : [];

      //if click empty space, create tether
      if (
        this.matter.query.point([this.tethered, ...allPegs], {
          x: pointer.x,
          y: pointer.y,
        }).length === 0
      ) {
        // pass this.tethered
        createBoingTether(this, pointer, this.tethered, this);
      }

      //if click peg, remove tether
      if (
        this.matter.query.point(allPegs, { x: pointer.x, y: pointer.y })
          .length > 0
      ) {
        //identify clicked peg and tether
        removeBoingTether(this, allPegs, pointer);
      }
    });
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
        tether.synth.detune.value = -length / 2;

        if (length <= this.radius * 1.4) {
          tether.synth.envelope.release = 6;
          tether.synth.envelope.releaseCurve = "exponential";
          tether.synth.triggerRelease();
          tether.boingSynth.triggerRelease();
          this.matter.world.remove(tether.peg);
          this.matter.world.remove(tether.spring);
          this.tethers = this.tethers.filter((t) => t !== tether);
        }
      });
    }
  }
}

export const BOING = () => {
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
