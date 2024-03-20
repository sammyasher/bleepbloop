//a utility class that if imported, 
import Phaser from 'phaser';

export class TouchCircle extends Phaser {
    constructor(scene, radius = 40, visible =true){
        this.setActive(false);
        this.setVisible(false);
        this.radius = radius;
    }

    this.circle = this.add.circle(400, 300, this.radius).setStrokeStyle(2, 0xffff00).setActive(false).setVisible(false);


    this.input.on('pointerdown', (pointer) => {
        this.circle.copyPosition(pointer);
        this.circle.setActive(true);
        this.circle.setVisible(true);


    });

    this.input.on('pointermove', (pointer) => {
        this.circle.copyPosition(pointer); //circle move with pointer


    });

    this.input.on('pointerup', () => {
        this.circle.setActive(false);
        this.circle.setVisible(false);
    });
}
