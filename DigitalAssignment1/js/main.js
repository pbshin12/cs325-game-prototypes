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
        // Loading image
        this.load.image( 'bg', 'assets/8bit_Desert.png' );
		this.load.image('blueSprite', 'assets/blue.png');
		this.load.image('redSprite', 'assets/red.png');
		
		// Loading audio
		/* https://phaser.io/examples/v3/view/audio/web-audio/play-sound-on-keypress */
		this.load.audio('gunShot', ['assets/Audio/GunshotSoundEffect.mp3']);
		this.load.audio('reload', ['assets/Audio/pickUp.mp3']);
		this.load.audio('wind', ['assets/Audio/DesertWindSound.mp3']);
		this.load.audio('fart', ['assets/Audio/dry-fart.mp3']);
		this.load.audio('wrong', ['assets/Audio/wrong.mp3']);
		
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
		
		// Adding the characters to the screen
		this.player = this.add.sprite(120, 480, 'blueSprite');
		this.enemy = this.add.sprite(680, 480, 'redSprite');
		
		// Setting and scaling the sprites, tried to match them as close as possible
		/* https://phasergames.com/scaling-in-phaser-3/ */
		this.player.setScale(0.1, 0.45);
		this.enemy.setScale(0.1, 0.28);
		
		this.player.setOrigin(0.5, 1);
		this.enemy.setOrigin(0.5, 1);
		
		
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
		this.randomInt = this.getRandomInt(10);
		console.log("Random number: " + this.randomInt);
		
		// Timer starting from now
		/* https://phasergames.com/how-to-get-delta-time-in-phaser-3/ */
		this.start = this.getTime();
		
		// Enemy reflex time
		this.enemyReflex = Phaser.Math.Between(260, 400);
		
		// Checks if someone farted
		this.farted = false;
		
		// Checks the status of the two characters on screen
		this.player_isAlive = true;
		this.player_canShoot = true;
		this.enemy_isAlive = true;
		
        // Add some text using a CSS style.
		let tutorialStyle = { font: "20px Verdana", fill: "#000000", align: "center" };
		let text = this.add.text( this.cameras.main.centerX, 550, "\"SPACE\" to fire         \"R\" to reset", tutorialStyle );
		text.setOrigin( 0.5, 0.0 );
    }
    
    update() {
		
		// If the delta time is greater than a random time (after a minimum of 5 seconds). Call fart method
		if (this.showDelta(this.start) >= ((this.randomInt * 1000) + 5000) && !(this.farted)) {
			this.fartCall();
			this.farted = true;
			
		}
		
		// Simulate enemy reflex
		if (this.farted && this.enemy_isAlive && !(this.shotFired)) {
			
			// Enemy fires their gun, their reflex timing varies between 300ms and 500ms
			if (this.showDelta(this.enemy_time) >= this.enemyReflex) {
				console.log("Enemy reflex time: " + this.enemyReflex + "ms");
				this.gunShot.play();
				this.wind.stop();
				this.player_isAlive = false;
				this.shotFired = true;
				console.log("Player is dead");
			}
			
		}
		
		// If the player is alive and no shots are fired, the following options are open
		if (this.player_isAlive && !(this.shotFired) && this.player_canShoot) {
			// Shooting if someone farted
			if (this.spaceBar.isDown && this.farted) {
				this.gunShot.play();
				this.shotFired = true;
				this.enemy_isAlive = false; // Dead enemy
				this.wind.stop();
				console.log("Enemy is dead");
			}
				
			// Shooting (attempt) if someone did not fart
			if (this.spaceBar.isDown && !(this.farted)) {
				this.wrong.play();
				this.player_canShoot = false; // Player can no longer shoot if they shoot early
			}
		}
		// If player is dead
		// TODO: YOU LOSE screen
		if (!(this.player_isAlive) && this.player.angle > -90) {
			this.player.angle -= 5;
			// Add some text using a CSS style.
			let style = { font: "30px Verdana", fill: "#000000", align: "center" };
			let text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU LOSE\nPress R to reset", style );
			text.setOrigin( 0.5, 0.0 );
		}
		
		// If enemy is dead
		// TODO: YOU WIN screen
		if (!(this.enemy_isAlive) && this.enemy.angle < 90) {
			this.enemy.angle += 5;
			
			// Add some text using a CSS style.
			let style = { font: "30px Verdana", fill: "##000000", align: "center" };
			let text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU WIN\nPress R to reset", style );
			text.setOrigin( 0.5, 0.0 );
		}
		
		// Restart
		if (this.rButton.isDown) {
			this.wind.stop();
			this.reset();
		}
		
    }
	
	// Resets the game, I do not know if scene reset actually resets all variables in a scene Class
	reset() {
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
		this.enemy_time = this.getTime(); // Start the timer for enemy reflex
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
	showDelta(time) {
		let elapsed = this.getTime() - time;
		
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
