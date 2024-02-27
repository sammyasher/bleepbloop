import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../components/GameComponent";
import * as Tone from "tone";
import { click } from "@testing-library/user-event/dist/click";

class Scene1 extends Phaser.Scene {
  constructor() {
    super("Scene1");
  }

  createTether(pointer, tetheredObject) {
    //create tethers if not already created
    if (!this.tethers) {
      this.tethers = [];
    }
    //make peg
    const peg = this.matter.add.circle(pointer.x, pointer.y, 10, {
      isStatic: true,
    });

    //distance and direction of pointer from tethered object
    const distance = Phaser.Math.Distance.Between(
      this.tethered.position.x,
      this.tethered.position.y,
      pointer.x,
      pointer.y
    );
    let direction = new Phaser.Math.Vector2(
      pointer.x - tetheredObject.position.x,
      pointer.y - tetheredObject.position.y
    );
    direction.normalize();
    let fractionOfRadius = 0.3;
    let radius = this.radius;
    const offset = direction.scale(
      Math.min(radius, (tetheredObject.circleRadius * distance) / 1000)
    );

    //create spring
    const spring = this.matter.add.spring(
      peg,
      tetheredObject,
      distance * 0.1,
      0.0005,
      { pointB: { x: offset.x, y: offset.y } }
    );

    const synthConfig = {
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.02,
        // release: distance * 0.1,
        sustain: 0.3,
        release: 1,
        releaseCurve: "linear",
      },
      volume: -800 / distance - 5, //better way to scale volume?
    };

    //create synth
    const synth = new Tone.Synth(synthConfig).toDestination();

    const LFOdetune = new Tone.LFO(distance / 400, -50, 20).start();
    // LFOdetune.connect(synth.gain);

    synth.triggerAttack(6000 / (distance * 0.1));
    setTimeout(() => {
      synth.envelope.release = distance / 10;
      synth.triggerRelease();
    }, 10000);

    //create/bundle tether object, store in tether array
    const tether = { peg, spring, synth };
    this.tethers.push(tether);

    return tether;
  }

  removeTether(allPegs, pointer) {
    const clickedPeg = this.matter.query.point(allPegs, {
      x: pointer.x,
      y: pointer.y,
    })[0];
    const clickedTether = this.tethers.find(
      (tether) => tether.peg === clickedPeg
    );

    // Remove tether from array, then remove components from world
    this.tethers = this.tethers.filter((tether) => tether !== clickedTether);
    this.matter.world.remove(clickedTether.peg);
    this.matter.world.remove(clickedTether.spring);

    clickedTether.synth.gain = 0;
    clickedTether.synth.envelope.release = 5;
    clickedTether.synth.triggerRelease();
    // clickedTether.synth.dispose();
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

    //create tethered object
    this.tethered = this.matter.add.circle(
      width * 0.5,
      height * 0.9,
      tetheredRadius,
      { mass: 5 }
    );

    //create tether array
    // this.tethers = [];

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
        this.createTether(pointer, this.tethered || []);
      }

      //if click peg, remove tether
      if (
        this.matter.query.point(allPegs, { x: pointer.x, y: pointer.y })
          .length > 0
      ) {
        //identify clicked peg and tether
        this.removeTether(allPegs, pointer);
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
        tether.synth.detune.value = length / 2;
      });
    }
  }
}

export const Tethered = () => {
  //config
  const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: "100%",
    height: "95%", //why does 100% make it below the fold?
    scene: [Scene1],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
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
        },
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
