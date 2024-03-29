import React from "react";
import Phaser from "phaser";

import { GameComponent } from "../components/GameComponent";

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

    const makeRectangles = (
      rows,
      columns,
      xDimension = width / 10,
      yDimension = height / 18,
      xPosition = width * 0.5,
      yPosition = height * 0.5
    ) => {
      rows = rows <= 0 ? 1 : rows;
      columns = columns <= 0 ? 1 : columns;

      xDimension = xDimension <= 0 ? 1 : xDimension;
      yDimension = yDimension <= 0 ? 1 : yDimension;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          this.matter.add.rectangle(
            xPosition - j * xDimension - j,
            yPosition - i * yDimension,
            xDimension,
            yDimension,
            { restitution: 1, friction: 1 }
          );
        }
      }
    };
    const rectangleHeight = height * 0.02;
    const rectangleWidth = rectangleHeight * 3;
    const rows = Math.floor((height * 0.7) / rectangleHeight);
    const columns = Math.floor((width * 0.3) / rectangleWidth);

    makeRectangles(
      rows,
      columns,
      rectangleWidth,
      rectangleHeight,
      width * 0.75,
      height * 0.8
    );

    this.input.on("pointerdown", () => {
      const x = this.input.x;
      const y = this.input.y;
      const demoWidth = Math.min(width / 10, 65);

      const demoBall = this.matter.add.circle(x - 60, y + 80, demoWidth);
      const inputTether = this.matter.add.circle(x, y, 15);
      this.demoSpring = this.matter.add.spring(
        inputTether,
        demoBall,
        100,
        0.075
      );
    });
    this.input.on("pointerup", () => {});
  }

  update() {}
}

export const Demolition = () => {
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
