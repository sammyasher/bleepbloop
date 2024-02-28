import Phaser from "phaser";
import * as Tone from "tone";
import { removeTether } from "../../Utils/TetherUtils";

//defining feature: will have up to, but not more than 2 tethers at a time

export const createCounterpointTether = (scene, x, y, pointer) => {
  const anchor = scene.anchor;
  console.log(pointer);
  let isCounterpoint = true;
  if (pointer && pointer.button === 2) {
    console.log("RIGHT CLICK");
    isCounterpoint = false;
  }

  if (!scene.tethers) {
    scene.tethers = [];
  }

  // while (scene.tethers.length > 1) {
  //   const originalTether = scene.tethers[0];
  //   removeTether(scene, originalTether);
  //   // scene.tethers.shift();
  // }
  scene.tethers.forEach((tether) => {
    if (tether.isCounterpoint === isCounterpoint) {
      removeTether(scene, tether);
    }
  });

  // Create a static peg
  const peg = scene.matter.add.circle(x, y, 10, {
    isStatic: true,
  });

  // Calculate distance and direction
  if (!anchor || typeof scene.radius === "undefined") {
    console.error("anchor or scene.radius is not defined");
    return;
  }

  const distance = Phaser.Math.Distance.Between(
    anchor.position.x,
    anchor.position.y,
    x,
    y
  );

  let direction = new Phaser.Math.Vector2(
    x - anchor.position.x,
    y - anchor.position.y
  ).normalize();

  const offsetDistance = Math.min(
    scene.radius,
    (anchor.circleRadius * distance) / 1000
  );
  const offset = direction.scale(offsetDistance);

  // Create a spring
  const spring = isCounterpoint
    ? scene.matter.add.spring(peg, anchor, distance * 0.2, 0.001, {
        render: {
          type: "line",
        },
      })
    : scene.matter.add.spring(peg, anchor, distance * 0.4, 0.0003, {
        render: {
          type: "spring",
        },
      });

  // Synth configuration
  const pointSynthConfig = {
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.03,
      sustain: 0.3,
      release: 1,
      releaseCurve: "linear",
    },

    volume: -800 / distance - 3, // Adjust volume calculation as needed
  };
  const counterpointSynthConfig = {
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.08,
      sustain: 0.3,
      release: 2,
      releaseCurve: "linear",
    },

    volume: -800 / distance - 3, // Adjust volume calculation as needed
  };

  const pointFrequency = 12000 / (distance * 0.1);
  const counterpointFrequency = 6000 / (distance * 0.1);

  // Create synth and connect it
  const synth = new Tone.Synth(
    isCounterpoint ? pointSynthConfig : counterpointSynthConfig
  ).toDestination();
  synth.triggerAttack(isCounterpoint ? pointFrequency : counterpointFrequency);
  setTimeout(() => {
    synth.triggerRelease();
  }, 3000);

  // Store the tether
  const tether = { peg, spring, synth, isCounterpoint, distance };
  scene.tethers.push(tether);

  return tether;
};

// export const removeTether = (scene, tether) => {
//   scene.tethers = scene.tethers.filter((t) => t !== tether);
//   scene.matter.world.remove(tether.peg);
//   scene.matter.world.remove(tether.spring);
// };

export const clickRemoveCounterpointTether = (scene, allPegs, pointer) => {
  const clickedPeg = scene.matter.query.point(allPegs, {
    x: pointer.x,
    y: pointer.y,
  })[0];
  const clickedTether = scene.tethers.find(
    (tether) => tether.peg === clickedPeg
  );

  removeTether(scene, clickedTether);

  clickedTether.synth.gain = 0;
  clickedTether.synth.envelope.release = 5;
  clickedTether.synth.envelope.releaseCurve = "exponential";
  clickedTether.synth.triggerRelease();
  clickedTether.boingSynth.triggerRelease();
  // clickedTether.synth.dispose();
};

export const removeTethersOnSpace = (scene) => {
  scene.spaceBar = scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  scene.spaceBar.on("down", () => {
    scene.tethers.forEach((tether) => {
      tether.synth.envelope.release = 5;
      tether.synth.envelope.releaseCurve = "exponential";
      tether.synth.triggerRelease();
      scene.matter.world.remove(tether.peg);
      scene.matter.world.remove(tether.spring);
    });
  });
};
