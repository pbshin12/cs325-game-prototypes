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
        super({ key: 'MyScene' })
        this.mouse;
    }
    
    preload() {
        // preloading files
        this.load.image('player', 'assets/Front_0.png' );
        this.load.image('weapon', 'assets/M1_Garand.png');
        this.load.image('background', 'assets/Test.png');
        this.load.image('bullet', 'assets/large.jpg');
        this.load.image('crosshair', 'assets/crosshair.png');
        this.load.image('squirrel', 'assets/EvilSquirrel.png');

        // Audio
        this.load.audio('gunShot', ['assets/GunshotSoundEffect.mp3']);
        this.load.audio('squeak', ['assets/Squeak.mp3']);
    }
    
    create() {

        this.text = this.add.text(20, 40, '', { font: '16px monospace', fill: 'violet' });

        this.cameras.main.setBounds(0, 0, 800, 600);
        this.physics.world.setBounds(0, 0, 800, 600);

        // Audio
        this.gunShot = this.sound.add('gunShot', {volume: 0.15});
        this.squeak = this.sound.add('squeak', {volume: 0.25});
        
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.physics.world.setBounds(0, 0, 800, 600);

        // Mashing 4 images together to create background
        /* https://phaser.io/examples/v3/view/camera/follow-user-controlled-sprite */
        this.add.image(0, 0, 'background').setOrigin(0);
        this.add.image(1920, 0, 'background').setOrigin(0).setFlipX(true);
        this.add.image(0, 1080, 'background').setOrigin(0).setFlipY(true);
        this.add.image(1920, 1080, 'background').setOrigin(0).setFlipX(true).setFlipY(true);
        
        
        // Create a sprite
        this.playerSprite = this.physics.add.image(0, 0,'player').setOrigin(0.5, 0.5);
        this.playerSprite.setScale(3);
        this.weaponSprite = this.add.image(0, 0, 'weapon').setOrigin(0, 0.5);
        this.weaponSprite.setScale(0.05);

        //this.squirrels = this.physics.add.group();
        this.squirrels = this.physics.add.image(-10, -50, 'squirrel');
        this.all_squirrels = [];
        this.all_squirrels.push(this.squirrels);
        this.done = false;

        // Both the player and the weapon sprite are now grouped
        /* https://phaser.io/examples/v3/view/game-objects/container/arcade-physics-body-test */
        // Container will group sprites together
        this.bullet = this.physics.add.image(800, 800, 'bullet');
        this.allBullets = [];
        this.allBullets.push(this.bullet);
        this.container = this.add.container(400, 500, [this.playerSprite, this.weaponSprite]);
        this.container.setSize(64, 64);
        this.container.setScrollFactor(0);
        this.physics.world.enable(this.container);
        

        // Add collider for world perimeter
        /* https://labs.phaser.io/view.html?src=src%5Cgame%20objects%5Ccontainer%5Carcade%20physics%20body%20test.js */
        this.container.body.setCollideWorldBounds(true);

        // Keyboard events
        this.W = this.input.keyboard.addKey('W');
        this.A = this.input.keyboard.addKey('A');
        this.S = this.input.keyboard.addKey('S');
        this.D = this.input.keyboard.addKey('D');
        this.R = this.input.keyboard.addKey('R');
        this.SPACE = this.input.keyboard.addKey('SPACE');
        this.mouse = this.input;
        this.leftClick = this.input.mousePointer;
        
        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none';

        // Adding in crosshair after mouse is added
        this.crossHair = this.add.image(this.mouse.x, this.mouse.y, 'crosshair').setOrigin(0.5, 0.5);
        this.crossHair.setScale(0.25);
        this.crossHair.setScrollFactor(0);


        /* https://codepen.io/samme/pen/JjPzaVb?editors=0010 */
        this.angleUpdate;
        this.text = this.add.text(20, 30, '', { font: '16px monospace', fill: 'violet' }).setScrollFactor(0);
        this.input.on('pointermove', function (pointer) {
            let angle = Phaser.Math.Angle.Between(this.container.x, this.container.y, pointer.worldX, pointer.worldY);
            this.angleUpdate = angle;
            this.weaponSprite.rotation = angle;

            this.crossHair.setPosition(pointer.x, pointer.y);

            /* How to flip: https://phasergames.com/how-to-flip-a-sprite-in-phaser-3/ */
            if (Phaser.Math.RadToDeg(angle) < -90 ||  Phaser.Math.RadToDeg(angle) > 90) {
                this.weaponSprite.flipY = true;
            }
            else {
                this.weaponSprite.flipY = false;
            }
            
          }, this);
  
        this.cameras.main.startFollow(this.container, true, 0.9, 0.9);

        this.control = 0; // Controlling the rate of fire on the gun
        this.spawnRate = 250; // Controls the spawn rate of the squirres (the code's looking really messy, I'll do better next time)
        this.spawnRateCounter = 0;
        this.spawnCounter = 0;
        this.squirrelSpeed = 100;
        this.squirrelsKilled = 0;
        this.difficultyTimer = 0;
        this.playerAlive = true;
        this.start = false;

        this.fired = false;
        this.worldBounds = this.physics.world.bounds;

        let tutorialStyle = { font: "15px Verdana", fill: "#000000", align: "center" };
        this.announcementStyle = { font: "30px Verdana", fill: "#FFFFFF", align: "center" };
        this.deathStyle = { font: "20px Verdana", fill: "#FFFFFF", align: "center" };
		let text = this.add.text( this.cameras.main.centerX + 270, 550, "\"A or D\" to Move\n\"Left-Click\" to fire\t\"R\" to reset", tutorialStyle );
        text.setOrigin(0.5, 0);
        this.announcementText = null;
        
        this.announcementText = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "Presss \"SPACE\" to Start\nDon't get run over by them squirrels", this.announcementStyle );
        this.announcementText.setOrigin(0.5, 0);


        
        
    }
    
    update() {
        let i = 0;
        let randX = Phaser.Math.Between(-10, 780);
        let randXOffSet = Phaser.Math.Between(200, 500);

        if (!this.playerAlive) {
            this.announcementText = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY - 25, 
                `You got ran over and died a miserable death\nThe squirrels took over the world\nand became the dominant species on Earth\n\nSquirrels Killed: ${this.squirrelsKilled}`, this.deathStyle );
            this.announcementText.setOrigin(0.5, 0);
        }

        if (this.SPACE.isDown && this.playerAlive) {
            this.start = true;
            this.announcementText.destroy();
        }


        if (this.playerAlive && this.start) {

            if (this.spawnRateCounter >= this.spawnRate) {
                this.squirrels = this.physics.add.image(randX + randXOffSet, 0, 'squirrel');
                this.all_squirrels.push(this.squirrels);
                this.squirrels = this.physics.add.image(randX, 0, 'squirrel');
                this.all_squirrels.push(this.squirrels);
                this.spawnRateCounter = 0;
            }
            else {
                this.spawnRateCounter++;
            }

            this.difficultyTimer++;

            // Increase difficulty every 500 ticks
            if (this.difficultyTimer >= 500) {
                console.log("Difficulty increased");
                this.squirrelSpeed += 30;
                this.spawnRate -= 25

                // Lowest spawnRate cap
                if (this.spawnRate < 50) {
                    this.spawnRate = 40;
                }

                this.difficultyTimer = 0;

            }

            // This is an expensive operation, but this'll do
            for (i = 0; i < this.all_squirrels.length; i++) {

                this.physics.moveToObject(this.all_squirrels[i], this.container, this.squirrelSpeed);
                this.physics.add.overlap(this.all_squirrels[i], this.container, this.killPlayer, null, this);
                this.physics.add.overlap(this.bullet, this.all_squirrels[i], this.destroy, null, this);            
            }


            for (i = 0; i < this.allBullets.length; i++) {
                if (this.allBullets[i].x <= 0 || this.allBullets[i].x >= 800 || this.allBullets[i].y <= 0 || this.allBullets[i] >= 600) {
                    this.allBullets[i].disableBody(true, true);
                    this.allBullets.splice(i, 1);
                    break;
                }
            }
            
            
            

            //this.container.body.setVelocity(0, 0);
            // Player movement --> Moves in all 8 directions --> Update: Now moves in 2 directions: left and right
            if (this.A.isDown) {
                this.container.x -= 3;
  
            }
            else if (this.D.isDown) {
                this.container.x += 3;
            }

            if (this.leftClick.isDown && !(this.fired)) {
                this.fire(this.angleUpdate);
                this.fired = true;
            }
            if (this.fired && !(this.leftClick.isDown)) {
                this.fired = false;
            }
        }

        if (this.R.isDown) {
            this.reset();
        }
        
        // Debugging
        this.text.setText([
            `spawnrate counter: ${this.spawnRateCounter}`,
            `Squirrel Speed: ${this.squirrelSpeed}`,
            `Squirrel SpawnRate: ${this.spawnRate}`,
            `Difficulty timer: ${this.difficultyTimer}`
          ]);
    }

    fire(angle) {
        this.gunShot.play();
        this.bullet = this.physics.add.sprite(this.container.x, this.container.y, 'bullet').copyPosition(this.container).setScale(0.05);
        this.bullet.rotation = angle;
        this.allBullets.push(this.bullet);
        this.physics.moveToObject(this.bullet, this.crossHair, 1000);
        this.control = 0;

    }

    destroy(bullet, squirrel) {
        if (this.bullet === null) {
            return;
        }
        this.squeak.play();
        squirrel.disableBody(true, true);
        bullet.disableBody(true, true);

        let s_Index = this.all_squirrels.indexOf(squirrel);
        let b_Index = this.allBullets.indexOf(bullet);

        this.all_squirrels.splice(s_Index, 1);
        this.allBullets.splice(b_Index, 1);

        this.squirrelsKilled++;
    }

    killPlayer(squirrel, container) {
        this.playerAlive = false;
    }

    reset() {
        this.scene.restart();
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    pixelArt: true, // Documentation states that setting this in the configs will make pixel art look clear (and it works!)
    physics: { default: 'arcade',
                arcade: {
                    debug: false
                } 
            },
    });
