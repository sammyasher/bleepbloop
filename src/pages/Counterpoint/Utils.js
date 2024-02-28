import Phaser from "phaser";
import * as Tone from "tone";

//defining feature: will have up to, but not more than 2 tethers at a time

export const createCounterpointTether = (scene, x, y) => {
  const anchor = scene.anchor;
  const isCounterpoint = scene.isCounterpoint;
  if (!scene.tethers) {
    scene.tethers = [];
  }

  while (scene.tethers.length > 1) {
    const originalTether = scene.tethers[0];
    removeTether(scene, originalTether);
    // scene.tethers.shift();
    console.log(scene);
  }

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
  const spring = scene.matter.add.spring(
    peg,
    anchor,
    distance * 0.2,
    0.0006,
    {
      render: {
        type: isCounterpoint ? "line" : "spring",
      },
    }

    // { pointB: { x: offset.x, y: offset.y } }
    // { type: isCounterpoint ? "spring" : "line" }
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

    volume: -800 / distance - 3, // Adjust volume calculation as needed
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
  scene.isCounterpoint = !isCounterpoint;

  return tether;
};

export const removeTether = (scene, tether) => {
  scene.tethers = scene.tethers.filter((t) => t !== tether);
  scene.matter.world.remove(tether.peg);
  scene.matter.world.remove(tether.spring);
};

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
      tether.boingSynth.triggerRelease();
      scene.matter.world.remove(tether.peg);
      scene.matter.world.remove(tether.spring);
    });
  });
};
