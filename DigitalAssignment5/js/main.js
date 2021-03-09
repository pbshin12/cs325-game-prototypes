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
        this.createButtons();
        this.addAudio();
        this.addImage();
        this.createControls();

        this.bgMusic.play();
        this.bgMusic.loop = true;

        this.physics.add.collider(this.player, this.ground);
        this.physics.world.setBounds(-30, 0, 860, 600);
        this.playerAlive = true; // Checks if player is alive

        this.score = 0;
        this.captured = 0;
        this.dogSpawnRate = 10000; // 10 seconds to spawn a dog
        
        // Box Position
        this.boxPosition = 2;
        this.boxIsUp = false;

        this.gameStart = false;
        this.scoreText = this.add.text(16, 16, `score: ${this.score}`, {fontSize: '32px', fill: '#FFFFFF'});
        this.capturedText = this.add.text(16, 64, `captured: ${this.score}`, {fontSize: '32px', fill: '#FFFFFF'});

        // timer event - https://phaser.io/examples/v3/view/time/multiple-timers
        this.spawn = this.time.addEvent({delay: this.dogSpawnRate, loop: true});

        this.dogs = this.physics.add.group();
        this.physics.add.collider(this.dogs, this.ground);

        // this.physics.add.overlap(this.grandma, this.redLaser1, this.detonate, null, this);
        // this.physics.add.overlap(this.grandma, this.purpleLaser, this.detonate, null, this);
        // this.physics.add.overlap(this.grandma, this.yellowLaser, this.detonate, null, this);
        // this.physics.add.overlap(this.grandma, this.flag, this.goalTouched, null, this);
        
        this.announcementStyle = { font: "30px Verdana", fill: "#FFFFFF", align: "center" };

        //this.explosion.play();
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        // let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        // let text = this.add.text( this.cameras.main.centerX, 15, "If you're seeing this,\nthat means I have decided to drop this assignment", style );
        // text.setOrigin( 0.5, 0.0 );
    }
    
    update() {

        //console.log("Event progress: " + this.spawn.getProgress().toString().substr(0,4));

        /* Movement control - https://phaser.io/tutorials/making-your-first-phaser-3-game/part7 */
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-300) * this.delta;
        
            this.player.flipX = false;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(300) * this.delta;
        
            this.player.flipX = true;
        }
        else
        {
            this.player.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-500);
        }

        if (this.W.isDown)
        {
            this.boxPosition = 1; // box perpendicular on top
        }
        else if (this.D.isDown)
        {
            this.boxPosition = 2; // box on the right
        }
        else if (this.A.isDown)
        {
            this.boxPosition = 3; // box on the left
        }


        switch(this.boxPosition)
        {
            case 1:
                this.boxIsUp ? this.box.setPosition(this.player.x, this.player.y - 50) : this.boxUp();
                break;
            case 2:
                this.box.setPosition(this.player.x + 45, this.player.y);
                this.boxDown();
                break;
            case 3:
                this.box.setPosition(this.player.x - 45, this.player.y);
                this.boxDown();
                break;
        }

    }

    boxUp()
    {
        this.boxIsUp = true;
        this.box.angle = 90;
    }

    boxDown()
    {
        this.boxIsUp = false;
        this.box.angle = 0;
    }

    collectTrash(player, trash) {
        trash.disableBody(true, true);
        score += 10;
        this.scoreText = this.add.text(16, 16, `score: ${this.score}`, {fontSize: '32px', fill: '#FFFFFF'});
    }

    captured(box, dog)
    {
        dog.disableBody(true, true);
        this.captured++;
        this.capturedText = this.capturedText = this.add.text(16, 64, `captured: ${this.score}`, {fontSize: '32px', fill: '#FFFFFF'});
    }

    // Creates the background image and scales it to the size of the screen
    createBackground() {
        // Adds image to the center of the screen
		// Below is a link to how to correctly scale the image to the screen
		/* https://phaser.discourse.group/t/how-to-stretch-background-image-on-full-screen/1839 */
		this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
		let scaleX = this.cameras.main.width / this.bg.width;
		let scaleY = (this.cameras.main.height / this.bg.height) + 0.5;
		let scale = Math.max(scaleX, scaleY);
		this.bg.setScale(scale).setScrollFactor(0);
    }

    // Creates buttons
    createButtons() {
        // Restart Button
        this.restart = this.add.text(690, 20, 'Restart', {font: "30px Comic Sans", fill: '#000000'}).setOrigin(0);
        this.restart.setInteractive();
        this.restart.on('pointerdown', () => {
            this.bgMusic.stop();
            this.scene.restart();
            console.log("Scene restart");
        });
    }

    // Creates the controls
    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.W = this.input.keyboard.addKey('W');
        this.A = this.input.keyboard.addKey('A');
        this.S = this.input.keyboard.addKey('S');
        this.D = this.input.keyboard.addKey('D');
    }

    detonate() {
        // console.log("BOOOOOM GRANNY DEAD, YOU FAILED");
        // if (this.grannyAlive) {
        //     this.explosion.play();
        // }
        // this.grannyAlive = false;
        // this.grandma.disableBody(true, true);

        // this.explosionAnim = this.add.sprite(this.grandmaPosX - 100, this.grandmaPosY - 100, 'explosion').setOrigin(0);
        // this.explosionAnim.setScale(3);
        // this.anims.create({
        //     key: 'explosion_anim',
        //     frames: this.anims.generateFrameNumbers("explosion"),
        //     frameRate: 10,
        //     repeat: 0, // No repeats
        //     hideOnComplete: true
        // });
        // this.explosionAnim.play('explosion_anim');

        // this.bgMusic.stop();

        // this.announcementText = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY - 25, 
        //     "Grandma exploded and it's all your fault\nGAME OVER", this.announcementStyle );
        // this.announcementText.setOrigin(0.5, 0);
    }

    // Adds image to a variable
    addImage() {
        // Player
        this.player = this.physics.add.image(20, 400, 'man').setOrigin(0.5, 0.5);
        this.player.setScale(0.10);
        this.player.setCollideWorldBounds(true);
        this.player.flipX = true;
        this.player.body.setGravityY(300);

        this.box = this.physics.add.image(this.player.x, this.player.y, 'yellow').setOrigin(0.5, 0.5);
        this.box.setScale(0.10, 0.25);
        //this.box.setCollideWorldBounds(true);
        this.box.body.setAllowGravity(false);


        this.ground = this.physics.add.staticGroup().setOrigin(0);
        this.ground.create(600, 610, 'ground').setScale(1, 0.02).refreshBody();

    }



        // Preloads the Image
    preloadImage() {
        this.load.image('background', 'assets/park.jpg');
        this.load.image('black', 'assets/black.jpg');
        this.load.image('yellow', 'assets/yellow.jpeg');
        this.load.image('man', 'assets/man.png');
        this.load.image('dog', 'assets/annoyingDog.png');
        this.load.image('ground', 'assets/green.png');

        this.load.spritesheet('explosion', 'assets/explosion3.png', {
            frameWidth: 128,
            frameHeight: 128
        });
    }

    // Preloads the Audio
    preloadAudio() {
        this.load.audio('bgMusic', ['assets/326 Chiptune Cascade by Kubbi  Royalty Free Music.mp3']);
        this.load.audio('explosion', ['assets/explosion.mp3']);
        this.load.audio('beep', ['assets/beep.mp3']);

    }

    // Adds audio to a variable
    addAudio() {
        this.bgMusic = this.sound.add('bgMusic', {volume: 0.15});
        this.explosion = this.sound.add('explosion', {volume: 0.75});
        this.beep = this.sound.add('beep', {volume: 0.75});
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { 
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    });
