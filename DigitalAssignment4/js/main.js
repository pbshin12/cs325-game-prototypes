import "./phaser.js";


// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
    }
    
    preload() {
        this.preloadImage();
        this.preloadAudio();
    }
    
    create() {
        this.createBackground();
        this.addImage();
        this.addAudio();
        this.bgMusic.play();
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        // let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        // let text = this.add.text( this.cameras.main.centerX, 15, "If you're seeing this,\nthat means I have decided to drop this assignment", style );
        // text.setOrigin( 0.5, 0.0 );
    }
    
    update() {

    }

    // Preloads the Image
    preloadImage() {
        this.load.image( 'logo', 'assets/large.png' );
        this.load.image('background', 'assets/forestBG.jpg');
        this.load.image('black', 'assets/black.jpg');
    }

    // Creates the background image and scales it to the size of the screen
    createBackground() {
        // Adds image to the center of the screen
		// Below is a link to how to correctly scale the image to the screen
		/* https://phaser.discourse.group/t/how-to-stretch-background-image-on-full-screen/1839 */
		this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
		let scaleX = this.cameras.main.width / this.bg.width;
		let scaleY = this.cameras.main.height / this.bg.height;
		let scale = Math.max(scaleX, scaleY);
		this.bg.setScale(scale).setScrollFactor(0);
    }

    // Adds image to a variable
    addImage() {
        this.box = this.add.image(0, 500, 'black');
        this.box.setOrigin(0);
    }

    // Preloads the Audio
    preloadAudio() {
        this.load.audio('bgMusic', ['assets/hitman-by-kevin-macleod-from-filmmusic-io.mp3']);
    }

    // Adds audio to a variable
    addAudio() {
        this.bgMusic = this.sound.add('bgMusic', {volume: 0.50});
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
