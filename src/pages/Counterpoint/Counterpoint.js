import React, { useEffect } from "react";
import Phaser from "phaser";
import { GameComponent } from "../../components/GameComponent";
import * as Tone from "tone";
import { click } from "@testing-library/user-event/dist/click";
import {
  createCounterpointTether,
  removeTether,
  removeTethersOnSpace,
} from "./Utils";



class Scene1 extends Phaser.Scene {
  constructor(scene) {
    super("Scene1");
  }

  create() {
    ////PREPARE WORLD
    //set world bounds, turn on pointer interactivity
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
    this.isCounterpoint = true;

    //store canvas dimensions
    const width = this.scale.width;
    const height = this.scale.height;

    //set tethered object radius based on largest side of canvas
    const largerSide = Math.max(width, height);
    const tetheredRadius = largerSide * 0.075;
    this.radius = tetheredRadius;

    // create tethered object
    this.anchor = this.matter.add.circle(
      width * 0.5,
      height * 0.9,
      tetheredRadius,
      { density: 10, restitution: 0.7, friction: 0.01, frictionAir: 0.0 }
    );

    //create initial tether
    createCounterpointTether(this, width / 2, height / 4);

    //KEYBOARD EVENTS

    removeTethersOnSpace(this);

    ////ON CLICK EVENTS
    this.input.on("pointerdown", (pointer) => {
      const allPegs = this.tethers
        ? this.tethers.map((tether) => tether.peg)
        : [];

      //if click empty space, create tether
      if (
        this.matter.query.point([this.anchor, ...allPegs], {
          x: pointer.x,
          y: pointer.y,
        }).length === 0
      ) {
        // pass this.anchor
        createCounterpointTether(this, pointer.x, pointer.y, pointer);
      }

      //if click peg, remove tether
      if (
        this.matter.query.point(allPegs, { x: pointer.x, y: pointer.y })
          .length > 0
      ) {
        //identify clicked peg and tether
        const clickedPeg = this.matter.query.point(allPegs, {
          x: pointer.x,
          y: pointer.y,
        })[0];
        const clickedTether = this.tethers.find(
          (tether) => tether.peg === clickedPeg
        );
        removeTether(this, clickedTether);
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
      });
    }
  }
}

export const Counterpoint = () => {
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

  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleRightClick);
    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);
  //render gamecomponent
  return (
    <div>
      <GameComponent config={config} />
    </div>
  );
};
