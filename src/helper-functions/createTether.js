import Phaser from "phaser";
import * as Tone from "tone";

const createTether = (scene, pointer, tetheredObject) => {
  //create tethers if not already created
  if (!scene.tethers) {
    scene.tethers = [];
  }
  //make peg
  const peg = scene.matter.add.circle(pointer.x, pointer.y, 10, {
    isStatic: true,
  });

  //distance and direction of pointer from tethered object
  const distance = Phaser.Math.Distance.Between(
    scene.tethered.position.x,
    scene.tethered.position.y,
    pointer.x,
    pointer.y
  );
  let direction = new Phaser.Math.Vector2(
    pointer.x - tetheredObject.position.x,
    pointer.y - tetheredObject.position.y
  );
  direction.normalize();
  let radius = scene.radius;
  const offset = direction.scale(
    Math.min(radius, (tetheredObject.circleRadius * distance) / 1000)
  );

  //create spring
  const spring = scene.matter.add.spring(
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

  // LFOdetune.connect(synth.gain);

  synth.triggerAttack(6000 / (distance * 0.1));
  setTimeout(() => {
    synth.envelope.release = distance / 10;
    synth.triggerRelease();
  }, 10000);

  //create/bundle tether object, store in tether array
  const tether = { peg, spring, synth };
  scene.tethers.push(tether);

  return tether;
};

export default createTether;
