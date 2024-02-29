import Phaser from "phaser";
import * as Tone from "tone";

export class Spider { 
    constructor(scene) {
        if (!this.spiders) {
            scene.spiders = [];
        }

        this.bodyRadius = .1 * Math.max(scene.scale.width, scene.scale.height); //body radius fraction of longest canvas size
        this.body = scene.matter.add.circle(Math.random() * scene.scale.width, Math.random() * scene.scale.height, this.bodyRadius * .2, {friction: 0, frictionAir: 0} );//create body random place. to make frictionless, add {friction: 0, frictionAir: 0}
        this.legs = [];  
        this.createLegs(scene);
        // this.walkForward();
    }

    createLegs(scene) {   
        // const foot1 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(45), this.body.position.y + this.bodyRadius * Math.sin(45), .05 * this.bodyRadius, { isStatic: true });     
        const foot2 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(45), this.body.position.y + this.bodyRadius * Math.sin(45), .05 * this.bodyRadius, { isStatic: true });  
        // const foot3 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(-30), this.body.position.y + this.bodyRadius * Math.sin(-30), .05 * this.bodyRadius, { isStatic: true });
        // const foot4 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(30), this.body.position.y + this.bodyRadius * Math.sin(30), .05 * this.bodyRadius, { isStatic: true });

        // let leg1 = scene.matter.add.constraint(this.body, foot1, 1, .01); //create leg at 30 degrees from center, by using the code below
        let leg2 = scene.matter.add.constraint(this.body, foot2); //create leg at 150 degrees from center
        // let leg3 = scene.matter.add.constraint(this.body, foot3); //create leg at 210 degrees from center
        // let leg4 = scene.matter.add.constraint(this.body, foot4); //create leg at 330 degrees from center

        // const leg2 //create leg at 90 degrees from center

    }
    

    walkForward() {
        const legToMove = this.legs.pop(); // Take the last leg
        this.scene.matter.world.remove(legToMove.leg); // Remove the leg constraint
        this.scene.matter.world.remove(legToMove.foot); // Remove the foot

        // Calculate new position for the foot
        const newFootPosition = this.calculateNewFootPosition();

        // Create new foot and leg at the front
        const newFoot = this.scene.matter.add.circle(newFootPosition.x, newFootPosition.y, .2 * this.bodyRadius, { isStatic: true });
        const newLeg = this.scene.matter.add.constraint(this.body, newFoot, this.bodyRadius * 1, 0.1);
        this.legs.unshift({ foot: newFoot, leg: newLeg }); // Add the new leg to the front
    }
}

// export class Dangler { 
//     constructor(scene) {
//         if (!this.spiders) {
//             scene.spiders = [];
//         }

//         this.bodyRadius = .1 * Math.max(scene.scale.width, scene.scale.height); //body radius fraction of longest canvas size
//         this.body = scene.matter.add.circle(Math.random() * scene.scale.width, Math.random() * scene.scale.height, this.bodyRadius * .2);//create body random place
//         this.legs = [];  
//         this.createLegs(scene);
//         // tones for the
//     }

//     createLegs(scene) {   
//         const foot1 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(30), this.body.position.y + this.bodyRadius * Math.sin(30), .1 * this.bodyRadius, { isStatic: true });     
//         let leg1 = scene.matter.add.constraint(this.body, foot1); //create leg at 30 degrees from center, by using the code below
//         // const leg2 //create leg at 90 degrees from center

//     }
// }

export class Whirlygig { 
    constructor(scene) {
        if (!this.whirlies) {
            scene.whirlies = [];
        }
        this.bodyRadius = .02 * Math.max(scene.scale.width, scene.scale.height); //body radius fraction of longest canvas side

        //build components
        this.pin = scene.matter.add.circle(Math.random() * scene.scale.width, Math.random() * scene.scale.height, .05 * this.bodyRadius, { isStatic: true });  
        this.body = scene.matter.add.circle(this.pin.position.x + this.bodyRadius * 10 * Math.cos(45), this.pin.position.y + this.bodyRadius * Math.sin(45), this.bodyRadius, {friction: 0, frictionAir: 0, ignoreGravity: true });//create body random place. to make frictionless, add {friction: 0, frictionAir: 0}     
        this.stalk = scene.matter.add.constraint(this.body, this.pin); //create leg at 150 degrees from center

        //make it move
        scene.matter.body.setVelocity(this.body, { x: (Math.random() * 10) + 5, y: (Math.random() * 10) + 5 });
    }
}

export class Whirlygig2 { 
    constructor(scene) {
        if (!this.whirlies) {
            scene.whirlies = [];
        }
        this.bodyRadius = .02 * Math.max(scene.scale.width, scene.scale.height); //body radius fraction of longest canvas side

        //build components
        this.pin = scene.matter.add.circle(Math.random() * scene.scale.width, Math.random() * scene.scale.height, .05 * this.bodyRadius, { isStatic: true });  
        this.body = scene.matter.add.circle(this.pin.position.x + this.bodyRadius * Math.cos(45), this.pin.position.y + this.bodyRadius * Math.sin(45), this.bodyRadius, {friction: 0, frictionAir: 0, ignoreGravity: true });//create body random place. to make frictionless, add {friction: 0, frictionAir: 0}     
        this.stalk = scene.matter.add.constraint(this.body, this.pin); //create leg at 150 degrees from center

        //make it move
        scene.matter.body.setVelocity(this.body, { x: (Math.random() * 10) + 5, y: (Math.random() * 10) + 5 });
    }
}

export class PoofPuff { 
    constructor(scene, number = 30, bodyRadius = .02 * Math.max(scene.scale.width, scene.scale.height), x, y) {
        if (!this.PoofPuffs) {
            scene.PoofPuffs = [];
        }

        this.pin = scene.matter.add.circle(x, y, 0, { isStatic: true });  
        this.poofStalks = [];

        for (let i = 0; i < number; i++) {
            let body = scene.matter.add.circle(this.pin.position.x + bodyRadius * 10, this.pin.position.y + bodyRadius, bodyRadius, {friction: 0, frictionAir: 0, ignoreGravity: true });//create body random place. to make frictionless, add {friction: 0, frictionAir: 0}     
            let stalk = scene.matter.add.constraint(body, this.pin, bodyRadius * 10, .05, { damping: 0.0001 }); //create leg at 150 degrees from center
            scene.matter.body.setVelocity(body, { x: (Math.random() * 10) + 5, y: (Math.random() * 10) + 5 });
            this.poofStalks.push({ body: body, stalk: stalk });
        }
    }
}

export class Orbiter { 
   
    constructor(scene) {
        if (!this.whirlies) {
            scene.whirlies = [];
        }

        this.bodyRadius = .1 * Math.max(scene.scale.width, scene.scale.height); //body radius fraction of longest canvas size
        this.body = scene.matter.add.circle(Math.random() * scene.scale.width, Math.random() * scene.scale.height, this.bodyRadius * .2, {friction: 0, frictionAir: 0, ignoreGravity: true });//create body random place. to make frictionless, add {friction: 0, frictionAir: 0} 
        this.legs = [];  
        this.createLegs(scene);
        // this.walkForward();
    }

    createLegs(scene) {   
        // const foot1 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(45), this.body.position.y + this.bodyRadius * Math.sin(45), .05 * this.bodyRadius, { isStatic: true });     
        const foot2 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(45), this.body.position.y + this.bodyRadius * Math.sin(45), .05 * this.bodyRadius, { isStatic: true });  
        // const foot3 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(-30), this.body.position.y + this.bodyRadius * Math.sin(-30), .05 * this.bodyRadius, { isStatic: true });
        // const foot4 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(30), this.body.position.y + this.bodyRadius * Math.sin(30), .05 * this.bodyRadius, { isStatic: true });

        // let leg1 = scene.matter.add.constraint(this.body, foot1, 1, .01); //create leg at 30 degrees from center, by using the code below
        let leg2 = scene.matter.add.constraint(this.body, foot2, 0, .001); //create leg at 150 degrees from center

        // let leg3 = scene.matter.add.constraint(this.body, foot3); //create leg at 210 degrees from center
        // let leg4 = scene.matter.add.constraint(this.body, foot4); //create leg at 330 degrees from center

        // const leg2 //create leg at 90 degrees from center

    }
    
}

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
      scene.matter.world.remove(tether.peg);
      scene.matter.world.remove(tether.spring);
    });
  });
};
