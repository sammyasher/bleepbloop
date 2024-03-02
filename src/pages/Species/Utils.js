import { getByPlaceholderText } from "@testing-library/react";
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

export class Dangler { 
    constructor(scene) {
        if (!this.spiders) {
            scene.spiders = [];
        }

        this.bodyRadius = .1 * Math.max(scene.scale.width, scene.scale.height); //body radius fraction of longest canvas size
        this.body = scene.matter.add.circle(Math.random() * scene.scale.width, Math.random() * scene.scale.height, this.bodyRadius * .2);//create body random place
        this.legs = [];  
        this.createLegs(scene);
        // tones for the
    }

    createLegs(scene) {   
        const foot1 = scene.matter.add.circle(this.body.position.x + this.bodyRadius * Math.cos(30), this.body.position.y + this.bodyRadius * Math.sin(30), .1 * this.bodyRadius, { isStatic: true });     
        let leg1 = scene.matter.add.constraint(this.body, foot1); //create leg at 30 degrees from center, by using the code below
        // const leg2 //create leg at 90 degrees from center

    }
}

export class Whirlygig { 
    constructor(scene, x, y) {
        if (!this.whirlies) {
            scene.whirlies = [];
        }
        this.bodyRadius = .02 * Math.max(scene.scale.width, scene.scale.height); //body radius fraction of longest canvas side

        //build components
        this.pin = scene.matter.add.circle(x, y, .05 * this.bodyRadius, { isStatic: true });  
        this.body = scene.matter.add.circle(this.pin.position.x + this.bodyRadius * 10 * Math.cos(45), this.pin.position.y + this.bodyRadius * Math.sin(45), this.bodyRadius, {friction: 0, frictionAir: 0, ignoreGravity: true });//create body random place. to make frictionless, add {friction: 0, frictionAir: 0}     
        this.stalk = scene.matter.add.constraint(this.body, this.pin, undefined, .9); //create leg at 150 degrees from center

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
    constructor(scene, config = {}) {
        const {
            name = "PoofPuff",
            arrayName = "PoofPuffs",
            number = 31,
            x = Math.random() * scene.scale.width,
            y = Math.random() * scene.scale.height,
            pinStatic = true,
            pinRadius = .1 * Math.min(scene.scale.width, scene.scale.height),
            armLength = pinRadius * 3,
            armStiffness = .3,
            ballRadius = pinRadius * .3,
            ballRadiusScaler = 1,
            friction = 0,
            frictionAir = 0,
            ignoreGravity = false
        } = config; 

        if (!scene[arrayName]) {//set arrayname to arrayName in config? how to set variable name to a string? by using bracket notation like this: scene[arrayName] = [], equivilent to 
            scene[arrayName] = [];
        }

        this.composite = scene.matter.composite.create();  

        this.pin = scene.matter.add.circle(x, y, pinRadius, {friction: friction, frictionAir: frictionAir, isStatic: pinStatic, ignoreGravity: true});  
        scene.matter.composite.add(this.composite, this.pin);

        this.poofStalks = [];
        for (let i = 0; i < number; i++) {
           
            ////create ball at random angle armLength away from pin. Reduces instantiation bugs
            // Generate a random angle in radians
            let angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2*PI
            // Convert polar coordinates (angle, armLength) to Cartesian coordinates (dx, dy)
            let dx = Math.cos(angle) * armLength;
            let dy = Math.sin(angle) * armLength;
            // Calculate the position of the ball relative to the pin
            let ballX = x + dx;
            let ballY = y + dy;

            // Create ball at the calculated position
            let ball = scene.matter.add.circle(ballX, ballY, ballRadius * ballRadiusScaler, {
                friction: 0,
                frictionAir: 0,
                ignoreGravity: true
            });

            //connect to pin
            let constraint = scene.matter.add.constraint(this.pin, ball, armLength, armStiffness);
            
            scene.matter.composite.add(this.composite, [ball, constraint]);
            this.poofStalks.push({ ball: ball, constraint: constraint });
        }

        //pointer down, everything contracts, just a little.
        scene.input.on("pointerdown", (pointer) => {
            if (scene.matter.containsPoint(this.pin, pointer.x, pointer.y)) {//
                this.Contract(scene);
            }});
 

        scene.input.on("pointerup", (pointer) => {
            if (scene.matter.containsPoint(this.pin, pointer.x, pointer.y)) {//
                this.Release(scene);
                this.Pulse(scene);
            }});
        
         

        scene.PoofPuffs.push(this.composite);
        console.log(this.composite);

       
    }
    
    Contract(scene) {
        console.log("CONTRACTING");
        scene.matter.composite.allConstraints(this.composite).forEach((constraint) => {
            constraint.length *= 8/9;
            constraint.stiffness *= 2;
        });
    }

    Release(scene) {
        console.log("RELEASING");
        scene.matter.composite.allConstraints(this.composite).forEach((constraint) => {
            constraint.length *= 9/8;
            constraint.stiffness /= 2;
        });
    }

    Pulse(scene) {
        console.log("PULSING");
        scene.matter.composite.allBodies(this.composite).forEach((body) => {
            if (body !== this.pin) {
                const direction = { 
                    x: .5 * (body.position.x - this.pin.position.x), 
                    y: .5 * (body.position.y - this.pin.position.y)
                };
                const velocity = scene.matter.body.getVelocity(body);//works better without this part but stops spin without it which feels weird. maybe do applyForce instead? hm. 
                const newVelocity = {
                    x: (velocity.x + direction.x),
                    y: (velocity.y + direction.y)
                };
                scene.matter.body.setVelocity(body, newVelocity);
            }
        });
    }

        
    //Future Ideas
    //put contract and release into one method you can just put in constructor that contains the two pointer events itself? 
    ////would be good but, what if i want to do only one? weigh options.
    /////for all these kinds of things, should the pointer be in the thing itself? hmMmm, try it with pulse, then you can just
    /////put the pulse method in the constructor and it will work, rather than having to put the pointer event in the constructor
    /////is it more resource intensive to have more methods in one pointer, or more pointers in one method?
    // poofbodies can be tapped to explode/emitter/poof (and destroy stalk/constraint)
    // sound associated with poof tap, or general velocity of whole thing. spin velocity
    // 2 layers of radius
    //make scaleable from constructor argument 

    

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
