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

        this.grannyAlive = true; // Checks if grandma is alive
        this.grandmaMoving = false; // Moves grandma to the end
        this.win = false;

        this.createBackground();
        this.addAudio();
        this.bgMusic.play();
        this.bgMusic.loop = true;

        this.addLasers();
        this.addImage();
        this.createButtons();

        this.physics.add.overlap(this.grandma, this.redLaser1, this.detonate, null, this);
        this.physics.add.overlap(this.grandma, this.purpleLaser, this.detonate, null, this);
        this.physics.add.overlap(this.grandma, this.yellowLaser, this.detonate, null, this);
        this.physics.add.overlap(this.grandma, this.flag, this.goalTouched, null, this);
        
        this.announcementStyle = { font: "30px Verdana", fill: "#FFFFFF", align: "center" };

        //this.explosion.play();
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        // let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        // let text = this.add.text( this.cameras.main.centerX, 15, "If you're seeing this,\nthat means I have decided to drop this assignment", style );
        // text.setOrigin( 0.5, 0.0 );
    }
    
    update() {
        if (this.grandmaMoving && this.grannyAlive && this.grandma.x < 800) {
            this.grandma.x += 0.5;
        }
        
        this.grandmaPosX = this.grandma.x;
        this.grandmaPosY = this.grandma.y;

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

    // Creates buttons
    createButtons() {
        // RED BUTTON, BUT IT'S WRITTEN AS YELLOW, BUT IT'S ACTUALLY FOR RED LASER
        this.redButton = this.add.text(50, 550, 'Yellow', {fill: '#ff0000'});
        this.redButton.setInteractive();
        this.redButton.on('pointerdown', () => {
            this.beep.play();
            if (this.grannyAlive) {
                if (this.yellowClickCounter == 2) {
                    this.disableRedLaser();
                }
                else if (this.win) {} // Do nothing (prevents grandma from detonating after winning)
                else {
                    this.detonate();
                }
                
                console.log('Red button is pressed'); 
            }
        });

        // YELLOW BUTTON
        this.yellowClickCounter = 0;
        this.yellowButton = this.add.text(250, 550, 'Yellow', {fill: '#ffff00'});
        this.yellowButton.setInteractive();
        this.yellowButton.on('pointerdown', () => {
            this.beep.play();
            if (this.grannyAlive) {
                this.yellowButton.setColor('Green');
                this.updateYellowClick();

                if (this.yellowClickCounter == 2) {
                    this.click.play();
                }

                if (this.yellowClickCounter == 3) {
                    this.disableYellowLaser();
                }
                console.log(`Yellow Button Pressed. Click count: ${this.yellowClickCounter}`); 
            }
        });

        // PURPLE BUTTON
        this.yellowDisabled = false;
        this.purpleButton = this.add.text(450, 550, 'Purple', {fill: '#fc03f4'});
        this.purpleButton.setInteractive();
        this.physics.add.overlap(this.purpleLaser, this.yellowLaser); // Ensures that the player must disable yellow button first before disabling purple
        this.purpleButton.on('pointerdown', () => {
            this.beep.play();
            if (this.grannyAlive) {
                if (!(this.yellowDisabled)) {
                    this.detonate(); // grandma will explode
                }
                else {
                    this.disablePurpleLaser();
                }
            }
        });

        // MOVE GRANDMA BUTTON
        this.moveGrandma = this.add.text(570, 540, 'Move\nGrandma').setOrigin(0);
        this.moveGrandma.setInteractive();
        this.moveGrandma.on('pointerdown', () => {
            this.grandmaMoving = true;
            console.log("Grandma is moving");
        });

        // Restart Button
        this.restart = this.add.text(700, 550, 'Restart').setOrigin(0);
        this.restart.setInteractive();
        this.restart.on('pointerdown', () => {
            this.bgMusic.stop();
            this.scene.restart();
            console.log("Scene restart");
        });
    }

    goalTouched() {
        console.log("YOU WIN!");
        this.announcementText = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY - 25, 
            "YOU WIN!", this.announcementStyle );
        this.announcementText.setOrigin(0.5, 0);
        this.win = true;
    }

    detonate() {
        console.log("BOOOOOM GRANNY DEAD, YOU FAILED");
        if (this.grannyAlive) {
            this.explosion.play();
        }
        this.grannyAlive = false;
        this.grandma.disableBody(true, true);

        this.explosionAnim = this.add.sprite(this.grandmaPosX - 100, this.grandmaPosY - 100, 'explosion').setOrigin(0);
        this.explosionAnim.setScale(3);
        this.anims.create({
            key: 'explosion_anim',
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 10,
            repeat: 0, // No repeats
            hideOnComplete: true
        });
        this.explosionAnim.play('explosion_anim');

        this.bgMusic.stop();

        this.announcementText = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY - 25, 
            "Grandma exploded and it's all your fault\nGAME OVER", this.announcementStyle );
        this.announcementText.setOrigin(0.5, 0);
    }

    // Records click counter for yellow button
    updateYellowClick() {
        this.yellowClickCounter += 1;
    }

    // Disables red laser (only the first one though, but that's okay because that is intended!)
    disableRedLaser() {
        this.redLaser1.disableBody(true, true);
    }

    // Disables yellow laser
    disableYellowLaser() {
        this.yellowLaser.disableBody(true, true);
        this.yellowDisabled = true;
    }

    // Disables purple laser
    disablePurpleLaser() {
        this.purpleLaser.disableBody(true, true);
    }

    // Adds image to a variable
    addImage() {
        this.box = this.add.image(0, 500, 'black');
        this.box.setOrigin(0);

        this.grandma = this.physics.add.image(-10, 375, 'oldLady').setOrigin(0);
        this.grandma.setScale(0.5);
        this.grandma.flipX = true;

        this.flag = this.physics.add.image(685, 375, 'flag').setOrigin(0);
        this.flag.setScale(0.25);
    }

    // Adds lasers to the scene
    addLasers() {
        this.redLaser1 = this.physics.add.image(500, 0, 'redLaser').setOrigin(0.5, 0);
        this.redLaser1.setScale(0.01, 0.70);
        this.redLaser2 = this.physics.add.image(550, 0, 'redLaser').setOrigin(0.5, 0);
        this.redLaser2.setScale(0.01, 0.70);

        this.yellowLaser = this.physics.add.image(300, 0, 'yellowLaser').setOrigin(0, 0);
        this.yellowLaser.setScale(0.07, 2.22);

        this.purpleLaser = this.physics.add.image(450, 0, 'purpleLaser').setOrigin(0.5, 0);
        this.purpleLaser.setScale(0.01, 0.5);
        this.purpleLaser.angle += 15;

    }

        // Preloads the Image
    preloadImage() {
        this.load.image('background', 'assets/forestBG.jpg');
        this.load.image('black', 'assets/black.jpg');
        this.load.image('oldLady', 'assets/oldLady.png');
        this.load.image('redLaser', 'assets/red.jpg');
        this.load.image('yellowLaser', 'assets/yellow.jpeg');
        this.load.image('purpleLaser', 'assets/purple.png');
        this.load.image('flag', 'assets/redFlag.png');

        this.load.spritesheet('explosion', 'assets/explosion3.png', {
            frameWidth: 128,
            frameHeight: 128
        });
    }

    // Preloads the Audio
    preloadAudio() {
        this.load.audio('bgMusic', ['assets/hitman-by-kevin-macleod-from-filmmusic-io.mp3']);
        this.load.audio('explosion', ['assets/explosion.mp3']);
        this.load.audio('beep', ['assets/beep.mp3']);
        this.load.audio('click', ['assets/bigClick.mp3']);

    }

    // Adds audio to a variable
    addAudio() {
        this.bgMusic = this.sound.add('bgMusic', {volume: 0.15});
        this.explosion = this.sound.add('explosion', {volume: 0.75});
        this.beep = this.sound.add('beep', {volume: 0.75});
        this.click = this.sound.add('click', {volume: 0.75});
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
