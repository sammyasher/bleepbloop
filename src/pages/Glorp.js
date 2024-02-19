import React from "react";
import Phaser from "phaser";
import { GameComponent } from "../components/GameComponent";
import Faucet from "../assets/BeanBoy/Faucet.png";
import Drips from "../assets/BeanBoy/Drips.png";
import CharacterSprite from "../assets/Glorp/Glorpo.png";
import Woosh from "../assets/BeanBoy/Sounds/woosh.mp3";
import WaterDrop from "../assets/BeanBoy/Sounds/WaterDrop.mp3";
import GlorpSmallEyesSpritesheet from "../assets/Glorp/GlorpSmallEyesSpritesheet.png";
import Splat from "../assets/Glorp/Splat1.mp3";

//refactor (replace word: pen) with (word: projectile) or (word: eyes), maybe better to make agnostic for future use

class GlorpSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, hitpoints = 10){
        super(scene, scene.scale.width/2, scene.scale.height-100, "GlorpSprite"); 
        scene.add.existing(this);
        scene.physics.world.enable(this); 
        this.setScale(.4);

        // this.forrestSprite = this.scene.physics.add.sprite(this.scene.scale.width/2, this.scene.scale.height-228, "ForrestSprite").setScale(.4); //how to setscale based on ratio of screen, no matter the sprite size?  
       
        this.hitpoints = hitpoints; //default 10
   
        this.eyelets = this.scene.physics.add.group();
        this.scene.input.on("pointerdown", () => {  
            this.Attack();
        });

        this.scene.input.on("pointermove", (pointer) => {
            this.x = pointer.x;
        });

        this.deathExplosion = this.scene.add.particles("Red",{ 
            x: this.x,
            y: this.y,
            speed: 200,
            lifespan: 2000,
            blendMode: "ADD",
            explode: true,
        });
    }
    
    Attack() {
        this.scene.sound.play("Woosh", {volume: 0.2});
        this.eyelet = this.eyelets.create(this.x - 10, this.y - 30, "GlorpSmallEyesSpritesheet").setVelocityY(-600).setScale(.1);
        this.eyelet.play("wiggle");
        this.eyelet.damage = 1;
    }

    TakeDamage(damage) {
        this.setTint(0x00ff00); //alt, tintfill?
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });

        this.hitpoints -= damage;
        if (this.hitpoints <= 0) {
            this.scene.scene.start('GameOver');  
        }
    }
}

class DrippingFaucet extends Phaser.Physics.Arcade.Image {
    constructor(scene, dripDelay = 400, faucetSpeed = 3000, hitpoints = 10) {
        super(scene, 0, 60, "Faucet");
        scene.add.existing(this);
        scene.physics.world.enable(this); 

        this.setScale(.5);
        this.dripDelay = dripDelay;
        this.faucetSpeed = faucetSpeed;
        this.dripTimer = null;
        this.drips = this.scene.physics.add.group();

        this.MoveFaucet();
        this.hitpoints = 10;

        this.DripsOn();
    }

    MoveFaucet = () => {
        this.scene.tweens.add({
            targets: this, 
            x: this.scene.scale.width - 100,
            ease: "Sine.easeInOut",
            duration: this.faucetSpeed,
            yoyo: true,
            repeat: -1,
        });
    }
    
    MakeDrip = () => {
        this.drip = this.drips.create(this.x + 30, this.y + 50, 'Drips')
            .setScale(.05)
            .setGravityY(200)
            .setVelocityY(100)
            .setDepth(-1)
            .setTint(0x00ff00); 
        this.drip.damage = 1;  
    }

    DripsOn = () => {  
        this.dripTimer = this.scene.time.addEvent({
            delay: this.dripDelay,
            callback: this.MakeDrip,
            callbackScope: this,//to make htis refer to the instance of DrippingFaucet,  
            loop: true,
        });
    }
    
    TakeDamage(damage) {
        this.setTint(0xc0c0c0); //tint light silver would be 0xc0c0c0
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
        this.hitpoints -= damage;
        console.log("faucet hp: " + this.hitpoints);
        if (this.hitpoints <= 0) {
            this.scene.scene.start('Win');  
            this.destroy();
            this.dripTimer.destroy();
        }
    };
}

class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        let startButton = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Start', {
            font: '64px Arial',
            fill: '#ffffff'
        }).setInteractive().setOrigin(0.5);

        startButton.on('pointerdown', () => {
            this.scene.start('Scene1');
        });
    }
}

class Win extends Phaser.Scene{
    constructor() {
        super('Win');
    }

    create() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Win!', {
            font: '64px Arial',
            fill: '#0000ff'  
        }).setOrigin(0.5);

        let restartButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Restart', {
            font: '40px Arial',
            fill: '#ffffff'
        }).setInteractive().setOrigin(0.5);

        restartButton.on('pointerdown', () => {
            this.scene.start('Scene1');
        });
    }
}

class GameOver extends Phaser.Scene{
    constructor() {
        super('GameOver');
    }

    create() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Over', {
            font: '64px Arial',
            fill: '#ff0000'  
        }).setOrigin(0.5);

        let restartButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Restart', {
            font: '40px Arial',
            fill: '#ffffff'
        }).setInteractive().setOrigin(0.5);

        restartButton.on('pointerdown', () => {
            this.scene.start('Scene1');
        });
    }
}

class Scene1 extends Phaser.Scene {
    constructor() {
        super('Scene1');
    }

    preload() {
        this.load.image("Faucet", Faucet);
        this.load.image("Drips", Drips);
        this.load.image("GlorpSprite", CharacterSprite);
        this.load.audio("Woosh", Woosh);
        this.load.audio("WaterDrop", WaterDrop);  
        this.load.audio("Splat", Splat);
        this.load.spritesheet("GlorpSmallEyesSpritesheet", GlorpSmallEyesSpritesheet,  { frameWidth: 411, frameHeight: 607 });
    }
 
    create() {

        this.anims.create({
            key: 'wiggle',
            frames: this.anims.generateFrameNumbers('GlorpSmallEyesSpritesheet', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.faucet = new DrippingFaucet(this); //moves back n' forth shooting drips
        this.glorp = new GlorpSprite(this); //follows pointer and attacks on click

        const droplets = this.add.particles(0, 0, "Drips", {
            speed: {min: 80, max: 100},
            frequency: -1,
            lifespan: 1600,
            scale: { start: .02, end: 0 },
            rotate: { start: 0, end: 360 },
            emitting: true,
            gravityY: 600,
            tint: 0x00ff00,
            angle: { min: 180, max: 360 }
        });  
        
        const eyeletsExplode = this.add.particles(0, 0, "Drips", {
            speed: {min: 0, max: 100}, //to vary speeds, use { min: 0, max: 1000}
            frequency: -1,
            lifespan: 1600,
            scale: { start: .02, end: 0 },
            rotate: { start: 0, end: 360 },
            emitting: true,
            gravityY: 600,
            tint: 0xffffff, //white in hex is 0xffffff
            angle: { min: 0, max: 180 }

        });

        console.log("Glorp hp: " + this.glorp.hitpoints);
        console.log("Faucet hp: " + this.faucet.hitpoints);

        this.physics.add.overlap(this.faucet.drips, this.glorp, (obj1, obj2) => {
            if (obj1.texture.key === 'Drips' && obj2.texture.key === 'ForrestSprite') {
                this.sound.play("WaterDrop");
                obj2.TakeDamage(obj1.damage);
                obj1.destroy();
            } else {
                this.sound.play("WaterDrop");
                obj1.TakeDamage(obj2.damage);
                obj2.destroy();
            }
        });

        this.physics.add.overlap(this.glorp.eyelets, this.faucet.drips, (pen, drip) => {
            this.sound.play("WaterDrop");
            this.sound.play("Splat", {volume: 0.1});
            droplets.explode(10, drip.x, drip.y);  
            eyeletsExplode.explode(10, drip.x, drip.y);   
            drip.destroy();
            pen.destroy();
            
        });

        this.physics.add.overlap(this.glorp.eyelets, this.faucet, (obj1, obj2) => { 
            if (obj1.texture.key === 'Pen' && obj2.texture.key === 'Faucet') {
                eyeletsExplode.explode(10, obj1.x, obj1.y - 30);     
                this.sound.play("Splat", {volume: 0.1}); //half volume would be 0.5, using sytax like this: this.sound.play("MetalHit", {volume: 0.5}); 
                obj2.TakeDamage(obj1.damage);
                obj1.destroy();
            }
            else {
                eyeletsExplode.explode(10, obj2.x, obj2.y - 30);   
                this.sound.play("Splat", {volume: 0.1}); //to make it play volume half, add 
                obj1.TakeDamage(obj2.damage);
                obj2.destroy();
            }
        });
    }
}

export const Glorp = () => {
    //config
    const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: 800,
        height: 600,
        scene: [StartScene, Scene1, GameOver, Win],
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0 },
                //debug: true,
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