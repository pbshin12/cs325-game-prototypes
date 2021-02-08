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
        
        this.bg = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'bg', 'assets/8bit_Desert.png' );
		
		// Loading audio
		/* https://phaser.io/examples/v3/view/audio/web-audio/play-sound-on-keypress */
		this.load.audio('gunShot', ['assets/Audio/GunShotSoundEffect.ogg', 'assets/Audio/GunshotSoundEffect.mp3']);
		this.load.audio('reload', ['assets/Audio/pickUp.ogg', 'assets/Audio/pickUp.mp3']);
		this.load.audio('wind', ['assets/Audio/DesertWindSound.ogg', 'assets/Audio/DesertWindSound.mp3']);
		this.load.audio('fart', ['assets/Audio/dry-fart.ogg', 'assets/Audio/dry-fart.mp3']);
		this.load.audio('wrong', ['assets/Audio/wrong.ogg', 'assets/Audio/wrong.mp3']);
		
    }
    
	
    create() {
        
		// Adds image to the center of the screen
		// Below is a link to how to correctly scale the image to the screen
		/* https://phaser.discourse.group/t/how-to-stretch-background-image-on-full-screen/1839 */
		this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
		let scaleX = this.cameras.main.width / this.bg.width;
		let scaleY = this.cameras.main.height / this.bg.height;
		let scale = Math.max(scaleX, scaleY);
		this.bg.setScale(scale).setScrollFactor(0);
		
		// Listens to keyboard events
		/* https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/ */
		this.spaceBar = this.input.keyboard.addKey('SPACE');
		this.rButton = this.input.keyboard.addKey('R');
		this.shotFired = false; // Ensures that only 1 shot is fired
		
		// Sound
		/* https://www.youtube.com/watch?v=COncYQLGJS8 */
		this.gunShot = this.sound.add('gunShot');
		this.reload = this.sound.add('reload');
		this.wind = this.sound.add('wind');
		this.fart = this.sound.add('fart');
		this.wrong = this.sound.add('wrong');
		
		// Should play when the game starts
		this.reload.play();
		this.wind.play();
		
		// Obtain random integer
		this.randomInt = this.getRandomInt(5);
		console.log("Random number: " + this.randomInt);
		
		// Timer starting from now
		/* https://phasergames.com/how-to-get-delta-time-in-phaser-3/ */
		this.start = this.getTime();
		
		// Checks if someone farted
		this.farted = false;
		
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        let text = this.add.text( this.cameras.main.centerX, 15, "Digital Assignment 1 Reflex Prototype", style );
        text.setOrigin( 0.5, 0.0 );
    }
    
    update() {
		
		// If the delta time is greater than a random time (after a minimum of 5 seconds). Call fart method
		if (this.showDelta() >= ((this.randomInt * 1000) + 5000) && !(this.farted)) {
			this.fartCall();
			this.farted = true;
		}
		
		// Shooting if someone farted
		if (this.spaceBar.isDown && !(this.shotFired) && this.farted) {
			this.gunShot.play();
			this.shotFired = true;
			this.wind.stop();
		}
		
		// Shooting (attempt) if someone did not fart
		if (this.spaceBar.isDown && !(this.shotFired) && !(this.farted)) {
			this.wrong.play();
			this.shotFired = true; // Player can no longer shoot if they shoot early
		}
		
		// Restart
		if (this.rButton.isDown) {
			this.reset();
		}
		
    }
	
	// Resets the game
	reset() {
		this.shotsFired = false;
		this.start = this.getTime();
		this.farted = false;
		this.wind.stop();
		console.log("Restarted");
		this.scene.restart();
	}
	
	// Obtains a random integer between a range from 0 to a max value (inclusive)
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}
	
	// Alerts the player to react (yes... it's a fart sound effect)
	fartCall() {
		this.fart.play();
		console.log("fart method called");
	}
	
	// Return the number of milliseconds since now
	/* https://phasergames.com/how-to-get-delta-time-in-phaser-3/ */
	getTime() {
		let d = new Date();
		return d.getTime();
	}
	
	// Obtain delta time between time of opening and time right now
	/* https://phasergames.com/how-to-get-delta-time-in-phaser-3/ */
	showDelta() {
		let elapsed = this.getTime() - this.start;
		
		// Debug
		//console.log("deltatime = " + elapsed);
		return elapsed;
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
