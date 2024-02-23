import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../components/GameComponent";
import Faucet from "../assets/BeanBoy/Faucet.png";
import Drips from "../assets/BeanBoy/Drips.png";

import Woosh from "../assets/BeanBoy/Sounds/woosh.mp3";
import WaterDrop from "../assets/BeanBoy/Sounds/WaterDrop.mp3";
import SpriteMissile from "../assets/particles/red.circular.png";
import Splat from "../assets/Glorp/Splat1.mp3";
import CharacterSprite from "../assets/HyperStimulus/robotpng.parspng.com-5.png";
import YellowParticle from "../assets/particles/yellow.circular.png";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, hitpoints = 10, score = 0) {
    super(scene, scene.scale.width / 2, scene.scale.height - 100, "Player");
    scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.scene.physics.world.setBounds(
      0,
      0,
      this.scene.scale.width,
      this.scene.scale.height
    );
    this.setCollideWorldBounds(true);
    this.setBounce(0.5);

    this.setScale(0.3);

    // this.forrestSprite = this.scene.physics.add.sprite(this.scene.scale.width/2, this.scene.scale.height-228, "ForrestSprite").setScale(.4); //how to setscale based on ratio of screen, no matter the sprite size?

    this.hitpoints = hitpoints; //default 10
    this.score = score;

    this.missiles = this.scene.physics.add.group({
      immovable: false,
    });
    this.scene.input.on("pointerdown", () => {
      this.setAccelerationY(-800);
    });

    this.scene.input.on("pointerup", () => {
      this.setAccelerationY(1100);
    });

    this.spaceBar = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.spaceBar.on("down", () => {
      this.Attack();
    });

    this.eKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.eKey.on("down", () => {
      this.upAttack();
    });

    this.scene.input.on("pointermove", (pointer) => {
      this.x = pointer.x;
      // this.y = pointer.y;
    });

    this.deathExplosion = this.scene.add.particles("Red", {
      x: this.x,
      y: this.y,
      speed: 200,
      lifespan: 2000,
      blendMode: "ADD",
      explode: true,
    });
  }

  Attack() {
    this.scene.sound.play("Woosh", { volume: 0.2 });

    let missile = new Missile(this.scene, this.x, this.y - 30);
    this.missiles.add(missile); // Assuming missiles is a physics group
    missile.body.setVelocityX(100);
    missile.body.setAccelerationX(200);
    missile.body.setVelocityY(-100);
    missile.body.setAccelerationY(100);
    missile.damage = 5;
  }

  upAttack() {
    this.scene.sound.play("Woosh", { volume: 0.2 });

    const numberOfParticles = 8;

    // Loop to create multiple particles
    for (let i = 0; i < numberOfParticles; i++) {
      let missile = this.missiles
        .create(
          this.x - 10 + Phaser.Math.Between(-10, 10), // Slight variation in x position
          this.y - 30,
          "YellowParticle"
        )
        .setVelocityY(-400 + Phaser.Math.Between(-100, 100))
        .setVelocityX(Phaser.Math.Between(-100, 100))
        .setAccelerationY(300)
        .setScale(0.3);

      missile.damage = 1;
    }
  }
  TakeDamage(damage) {
    this.setTint(0x00ff00); //alt, tintfill?
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    this.hitpoints -= damage;
    if (this.hitpoints <= 0) {
      this.scene.scene.start("GameOver");
    } else {
      this.scene.updateHitPointsText();
    }
  }
}

class Missile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "SpriteMissile");
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setVelocity(200, -200);
    this.setScale(0.5);
    this.startEmitting(scene);
  }

  startEmitting(scene) {
    this.emitTimer = scene.time.addEvent({
      delay: 100,
      callback: () => {
        let particle = scene.physics.add.sprite(
          this.x,
          this.y,
          "SpriteMissile"
        );
        scene.physics.world.enable(particle);
        particle.setScale(0.15);
        particle.setVelocity(-25, Phaser.Math.Between(80, 100));

        scene.time.delayedCall(1000, () => particle.destroy());
      },
      callbackScope: this,
      loop: true,
    });
  }

  preDestroy() {
    // Clean up
    if (this.emitTimer) {
      this.emitTimer.remove();
    }
  }
}

class DrippingFaucet extends Phaser.Physics.Arcade.Image {
  constructor(scene, dripDelay = 750, faucetSpeed = 3000, hitpoints = 10) {
    super(scene, 0, 60, "Faucet");
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setScale(0.5);
    this.dripDelay = dripDelay;
    this.faucetSpeed = faucetSpeed;
    this.dripTimer = null;
    this.drips = this.scene.physics.add.group();

    this.MoveFaucet();
    this.hitpoints = 30;

    this.DripsOn();
  }

  MoveFaucet = () => {
    this.scene.tweens.add({
      targets: this,
      y: { from: 0, to: this.scene.scale.height - 100 },
      x: {
        from: this.scene.scale.width - 100,
        to: this.scene.scale.width - 100,
      },
      ease: "Sine.easeInOut",
      duration: this.faucetSpeed,
      yoyo: true,
      repeat: -1,
    });
  };

  MakeDrip = () => {
    this.drip = this.drips
      .create(this.x + 30, this.y + 50, "Drips")
      .setScale(0.05)
      .setGravityY(200)
      .setVelocityY(-this.y)
      .setVelocityX(-300)
      .setDepth(-1)
      .setTint(0x00ff00);
    this.drip.damage = 1;
  };

  DripsOn = () => {
    this.dripTimer = this.scene.time.addEvent({
      delay: this.dripDelay,
      callback: this.MakeDrip,
      callbackScope: this, //to make htis refer to the instance of DrippingFaucet,
      loop: true,
    });
  };

  TakeDamage(damage) {
    this.setTint(0xc0c0c0); //tint light silver would be 0xc0c0c0
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });
    this.hitpoints -= damage;
    console.log("faucet hp: " + this.hitpoints);
    if (this.hitpoints <= 0) {
      this.scene.scene.start("Win");
      this.destroy();
      this.dripTimer.destroy();
    } else {
      this.scene.updateHitPointsText();
    }
  }
}

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    let startButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Start", {
        font: "64px Arial",
        fill: "#ffffff",
      })
      .setInteractive()
      .setOrigin(0.5);

    startButton.on("pointerdown", () => {
      this.scene.start("Scene1");
    });
  }
}

class Win extends Phaser.Scene {
  constructor() {
    super("Win");
  }

  create() {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Win!", {
        font: "64px Arial",
        fill: "#0000ff",
      })
      .setOrigin(0.5);

    let restartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 100, "Restart", {
        font: "40px Arial",
        fill: "#ffffff",
      })
      .setInteractive()
      .setOrigin(0.5);

    restartButton.on("pointerdown", () => {
      this.scene.start("Scene1");
    });
  }
}

class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Over", {
        font: "64px Arial",
        fill: "#ff0000",
      })
      .setOrigin(0.5);

    let restartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 100, "Restart", {
        font: "40px Arial",
        fill: "#ffffff",
      })
      .setInteractive()
      .setOrigin(0.5);

    restartButton.on("pointerdown", () => {
      this.scene.start("Scene1");
    });
  }
}

class Scene1 extends Phaser.Scene {
  constructor() {
    super("Scene1");
    this.playerHitpointsText = null;
    this.faucetHitpointsText = null;
  }

  preload() {
    this.load.image("Faucet", Faucet);
    this.load.image("Drips", Drips);
    this.load.image("Player", CharacterSprite);
    this.load.audio("Woosh", Woosh);
    this.load.audio("WaterDrop", WaterDrop);
    this.load.audio("Splat", Splat);
    this.load.image("YellowParticle", YellowParticle);
    this.load.spritesheet("SpriteMissile", SpriteMissile, {
      frameWidth: 411,
      frameHeight: 607,
    });
  }

  create() {
    this.faucetHitpointsText = this.add.text(10, 10, "Faucet HP: 30", {
      font: "32px Arial",
      fill: "#ffffff",
    });
    this.playerHitpointsText = this.add.text(10, 50, "Player HP: 10", {
      font: "32px Arial",
      fill: "#ffffff",
    });

    // this.anims.create({
    //   key: "wiggle",
    //   frames: this.anims.generateFrameNumbers("SpriteMissile", {
    //     start: 0,
    //     end: 1,
    //   }),
    //   frameRate: 5,
    //   repeat: -1,
    // });

    this.faucet = new DrippingFaucet(this); //moves back n' forth shooting drips
    this.player = new Player(this); //follows pointer and attacks on click

    const droplets = this.add.particles(0, 0, "Drips", {
      speed: { min: 80, max: 100 },
      frequency: -1,
      lifespan: 1600,
      scale: { start: 0.02, end: 0 },
      rotate: { start: 0, end: 360 },
      emitting: true,
      gravityY: 600,
      tint: 0x00ff00,
      angle: { min: 180, max: 360 },
    });

    const missilesExplode = this.add.particles(0, 0, "Drips", {
      speed: { min: 0, max: 100 }, //to vary speeds, use { min: 0, max: 1000}
      frequency: -1,
      lifespan: 1600,
      scale: { start: 0.02, end: 0 },
      rotate: { start: 0, end: 360 },
      emitting: true,
      gravityY: 600,
      tint: 0xffffff, //white in hex is 0xffffff
      angle: { min: 0, max: 180 },
    });

    console.log("player hp: " + this.player.hitpoints);
    console.log("Faucet hp: " + this.faucet.hitpoints);

    //COLLIDERS//

    this.physics.add.overlap(this.faucet, this.player, (obj1, obj2) => {
      if (obj1.texture.key === "Faucet" && obj2.texture.key === "Player") {
        obj2.TakeDamage(obj2.hitpoints);
      } else {
        obj1.TakeDamage(obj1.hitpoints);
      }
    });

    this.physics.add.overlap(this.faucet.drips, this.player, (obj1, obj2) => {
      if (
        obj1.texture.key === "Drips" &&
        obj2.texture.key === "ForrestSprite"
      ) {
        this.sound.play("WaterDrop");
        obj2.TakeDamage(obj1.damage);
        obj1.destroy();
      } else {
        this.sound.play("WaterDrop");
        obj1.TakeDamage(obj2.damage);
        obj2.destroy();
      }
    });

    this.physics.add.overlap(
      this.player.missiles,
      this.faucet.drips,
      (pen, drip) => {
        this.sound.play("WaterDrop");
        this.sound.play("Splat", { volume: 0.1 });
        droplets.explode(10, drip.x, drip.y);
        missilesExplode.explode(10, drip.x, drip.y);
        drip.destroy();
        pen.destroy();
      }
    );

    this.physics.add.overlap(
      this.player.missiles,
      this.faucet,
      (obj1, obj2) => {
        if (obj1.texture.key === "Pen" && obj2.texture.key === "Faucet") {
          missilesExplode.explode(10, obj1.x, obj1.y - 30);
          this.sound.play("Splat", { volume: 0.1 }); //half volume would be 0.5, using sytax like this: this.sound.play("MetalHit", {volume: 0.5});
          obj2.TakeDamage(obj1.damage);
          obj1.destroy();
        } else {
          missilesExplode.explode(10, obj2.x, obj2.y - 30);
          this.sound.play("Splat", { volume: 0.1 }); //to make it play volume half, add
          obj1.TakeDamage(obj2.damage);
          obj2.destroy();
        }
      }
    );
  }

  updateHitPointsText() {
    this.faucetHitpointsText.setText(`Faucet HP: ${this.faucet.hitpoints}`);
    this.playerHitpointsText.setText(`player HP: ${this.player.hitpoints}`);
  }
}

export const HyperStimulus = () => {
  //config
  const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 800,
    height: 600,
    scene: [StartScene, Scene1, GameOver, Win],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
  };

  //render gamecomponent
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div>Click Mouse to Fly!</div>
        <div>Press SPACE and E to attack enemy</div>
      </div>
      <GameComponent config={config} />
    </>
  );
};
