import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../components/GameComponent";
import * as Tone from "tone";
import getRandomColor from "../Utils/getRandomColor";

class Scene1 extends Phaser.Scene {
  constructor() {
    super("Scene1");
  }

  create() {
    this.freqScale = 100000;
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    const width = this.scale.width;
    const height = this.scale.height;

    const rectangleWidth = width * 0.15;
    const rectangleHeight = height * 0.15;
    const squareSide = Math.max(rectangleWidth, rectangleHeight);
    const radius = squareSide / 2;

    this.tethered = this.matter.add.circle(width * 0.5, height * 0.9, radius, {
      mass: 5,
    });

    this.input.on("pointerdown", () => {
      const inputX = this.input.x;
      const inputY = this.input.y;
      const bigX = this.tethered.position.x;
      const bigY = this.tethered.position.y;
      const xOffset = (inputX - bigX) * 0.1;
      const yOffset = (inputY - bigY) * 0.1;
      const offsetDistance = Math.sqrt(xOffset ** 2 + yOffset ** 2);
      const randomColor = getRandomColor();

      if (Math.abs(offsetDistance) > squareSide / 20) {
        const inputConnector = this.matter.add.circle(inputX, inputY, 10, {
          render: {
            fillStyle: randomColor,
          },
        });
        inputConnector.isStatic = true;
        this.demoSpring = this.matter.add.spring(
          inputConnector,
          this.tethered,
          offsetDistance * 3,
          0.02,
          {
            pointA: { x: 0, y: 0 },
            pointB: { x: xOffset * 0.7, y: yOffset * 0.7 },
          }
        );
        const springTone = new Tone.Synth({
          envelope: {
            attack: 0.02,
            release: offsetDistance,
            releaseCurve: "linear",
          },

          oscillator: {
            type: "sine",
          },
          volume: -200 / offsetDistance - 5,
          name: "springTone",
        }).toDestination();
        const LFOdetune = new Tone.LFO(offsetDistance / 400, -50, 20).start();

        LFOdetune.connect(springTone.detune);
        const pan = new Tone.Panner(1).toDestination();

        springTone.connect(pan);
        const now = Tone.now();

        springTone.triggerAttack(30000 / (offsetDistance * 5), now);

        springTone.triggerRelease(now + 10);
      }
    });
    this.input.on("pointerup", () => {
      this.matter.world.localWorld.bodies.forEach((body) => {
        if (body.gameObject === undefined) {
          return;
        }
      });
    });
  }

  update() {}
}

export const Tethered = () => {
  //config
  const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: "100%",
    height: "95%",
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
