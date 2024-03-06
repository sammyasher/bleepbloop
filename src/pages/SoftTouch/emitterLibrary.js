const lava = this.add.particles(0, 0, "yellow", {
    speed: 20, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
    frequency: 10,// (circles/shapes painting) // 
    lifespan: 10000,
    color: [ 0xffc200, 0xffc0cb ],  //a warm transition would be
    //make particles blurry and glowy by using a blend mode of ADD, and a color of 0xffc200, and 0xffc0cb, and a scale of { start: .4, end: 2 }
    //   color: [ 0xffc200, 0xffc0cb ],  //a warm transition would be 
    scale: { start: 2, end: 2 }, //try single values, growth ones (smokey), and positive to negative which shrinks then grwos
    blendMode: "ADD", //other options and their effects are here: https://newdocs.phaser.io/docs/3.70.0/Phaser.BlendModes
    follow: this.input.activePointer,
    emitting: false,
    });

const glowWorm = this.add.particles(0, 0, "blue", {
    speed: 30, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
    frequency: 1,// (circles/shapes painting) // 
    lifespan: 1000,
    color: [0x0000ff, 0xadd8e6, 0x0000ff],  //grey to blue would be 
    colorEase: 0,
    scale: { start: 1, end: 0 },  
    blendMode: "DARKEN", //other options and their effects are here: https://newdocs.phaser.io/docs/3.70.0/Phaser.BlendModes
    follow: this.input.activePointer,
    emitting: false,
});//attach to mouse pointer by setting follow to this.input.activePointer

const touchGlow = this.add.particles(0, 0, "blue", {
    speed: {min: 20, max: 50}, //{ min: 0, max: 1000}, //  100 (circles/shapes painting) // 1 or 0 (static shapes)
    frequency: 3,// (circles/shapes painting) // 
    scale: { start: 1, end: .5 },  
    lifespan: { min: 2000, max: 4000 },//this min and max, does it set a single random between those or does it set a random for each particle? it 
    color: [0x0000ff],  //white is 0xffffff, or alos try 0xadd8e6, 0x0000ff, 0x0000ff
    colorEase: 1,
    alpha: { start: .5, end: 0 },//how to fade out back to 0 as well? by setting the alpha to 0 in the death callback. is that gradual though? it
    blendMode: "DARKEN", //other options and their effects are here: https://newdocs.phaser.io/docs/3.70.0/Phaser.BlendModes
    follow: this.input.activePointer,// 
    emitting: false, 
});//alt to active pointer is to set follow to pointer
