import Phaser from "phaser";
import * as Tone from "tone";
import { removeTether } from "../../Utils/TetherUtils";

export const createBoingTether = (scene, pointer, tetheredObject) => {
  if (scene.tethers) {
    scene.tethers.forEach((tether) => {
      tether.synth.envelope.release = 5;
      tether.synth.envelope.releaseCurve = "exponential";
      tether.synth.triggerRelease();
      scene.matter.world.remove(tether.peg);
      scene.matter.world.remove(tether.spring);
    });
  }
  // Ensure tethers array exists
  //requires scene.tethered to be defined
  if (!scene.tethers) {
    scene.tethers = [];
  }

  // Create a static peg
  const peg = scene.matter.add.circle(pointer.x, pointer.y, 10, {
    isStatic: true,
  });

  // Calculate distance and direction
  if (!scene.tethered || typeof scene.radius === "undefined") {
    console.error("scene.tethered or scene.radius is not defined");
    return;
  }

  const distance = Phaser.Math.Distance.Between(
    scene.tethered.position.x,
    scene.tethered.position.y,
    pointer.x,
    pointer.y
  );

  let direction = new Phaser.Math.Vector2(
    pointer.x - tetheredObject.position.x,
    pointer.y - tetheredObject.position.y
  ).normalize();

  const offsetDistance = Math.min(
    scene.radius,
    (tetheredObject.circleRadius * distance) / 1000
  );
  const offset = direction.scale(offsetDistance);

  // Create a spring
  const spring = scene.matter.add.spring(
    peg,
    tetheredObject,
    distance * 0.2,
    0.0006
    // { pointB: { x: offset.x, y: offset.y } }
  );

  // Synth configuration
  const synthConfig = {
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.03,
      sustain: 0.3,
      release: 1,
      releaseCurve: "linear",
    },
    volume: -800 / distance - 1, // Adjust volume calculation as needed
  };

  const boingSynthConfig = {
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.1,
      sustain: 0.3,
      release: 6,
      releaseCurve: "exponential",
    },
    volume: -800 / distance - 13, // Adjust volume calculation as needed
  };

  // Create synth and connect it
  const synth = new Tone.Synth(synthConfig).toDestination();
  const boingSynth = new Tone.Synth(boingSynthConfig).toDestination();
  synth.triggerAttack(12000 / (distance * 0.1));
  boingSynth.triggerAttack(12000 / (distance * 0.1));
  setTimeout(() => {
    synth.triggerRelease();
    boingSynth.triggerRelease();
  }, 3000);

  // Store the tether
  const tether = { peg, spring, synth, boingSynth, distance };
  scene.tethers.push(tether);

  return tether;
};

// export const removeTether = (scene, tether) => {
//   scene.tethers = scene.tethers.filter((t) => t !== tether);
//   scene.matter.world.remove(tether.peg);
//   scene.matter.world.remove(tether.spring);
// };

export const clickRemoveBoingTether = (scene, allPegs, pointer) => {
  const clickedPeg = scene.matter.query.point(allPegs, {
    x: pointer.x,
    y: pointer.y,
  })[0];
  const clickedTether = scene.tethers.find(
    (tether) => tether.peg === clickedPeg
  );

  // Remove tether from array, then remove components from world
  // scene.tethers = scene.tethers.filter((tether) => tether !== clickedTether);
  // scene.matter.world.remove(clickedTether.peg);
  // scene.matter.world.remove(clickedTether.spring);
  removeTether(scene, clickedTether);

  clickedTether.synth.gain = 0;
  clickedTether.synth.envelope.release = 5;
  clickedTether.synth.envelope.releaseCurve = "exponential";
  clickedTether.synth.triggerRelease();
  clickedTether.boingSynth.triggerRelease();
  // clickedTether.synth.dispose();
};
