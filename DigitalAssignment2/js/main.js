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

        // this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
        // this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);

        // Audio
        this.gunShot = this.sound.add('gunShot');
        this.squeak = this.sound.add('squeak');
        
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

        this.squirrels = this.physics.add.group();
        this.squirrels.create(100, 100, 'squirrel');
        this.done = false;

        // Both the player and the weapon sprite are now grouped
        /* https://phaser.io/examples/v3/view/game-objects/container/arcade-physics-body-test */
        // Container will group sprites together
        this.bullet = this.physics.add.image(0, 0, 'bullet');
        this.container = this.add.container(400, 300, [this.playerSprite, this.weaponSprite]);
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
        this.mouse = this.input;
        this.leftClick = this.input.mousePointer;
        
        // Adding in crosshair after mouse is added
        this.crossHair = this.add.image(this.mouse.x, this.mouse.y, 'crosshair').setOrigin(0.5, 0.5);
        this.crossHair.setScale(0.25);
        this.crossHair.setScrollFactor(0);


        /* https://codepen.io/samme/pen/JjPzaVb?editors=0010 */
        this.angleUpdate;
        this.text = this.add.text(20, 40, '', { font: '16px monospace', fill: 'violet' }).setScrollFactor(0);
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
            // Debugging
            this.text.setText([
              `angle:      ${angle.toFixed(2)} rad  ${Phaser.Math.RadToDeg(angle).toFixed(2)} deg`,
              `mouse: x --> ${this.mouse.mousePointer.worldX} y --> ${this.mouse.mousePointer.worldY}`,
              `reload timer: ${this.control}`
            ]);
          }, this);
  
        this.cameras.main.startFollow(this.container, true, 0.9, 0.9);

        this.control = 0; // Controlling the rate of fire on the gun
        this.firedOnce = false;
        this.worldBounds = this.physics.world.bounds;

        let tutorialStyle = { font: "30px Verdana", fill: "#000000", align: "center" };
		let text = this.add.text( this.cameras.main.centerX, 500, "\"WASD\" to Move\t\"Left-Click\" to fire\t\"R\" to reset", tutorialStyle );
		text.setOrigin( 0.5, 0.0 );
    }
    
    update() {
        let i = 0;
        while (i <= 7) {
            if (this.done === true) {break;}
            let randX = Phaser.Math.Between(50, 700);
            let randY = Phaser.Math.Between(50, 500);
            this.squirrels.create(randX, randY, 'squirrel');
            i++;
        }
        this.done = true;
        

        this.container.body.setVelocity(0, 0);
        // Player movement --> Moves in all 8 directions
        if (this.A.isDown) {
            this.container.body.setVelocity(-300, 0);
            if (this.S.isDown) {
                this.container.body.setVelocity(-300, 300);
            }
            else if (this.W.isDown) {
                this.container.body.setVelocity(-300, -300);
            }
        }
        else if (this.D.isDown) {
            this.container.body.setVelocity(300, 0);
            if (this.S.isDown) {
                this.container.body.setVelocity(300, 300);
            }
            else if (this.W.isDown) {
                this.container.body.setVelocity(300, -300);
            }
        }
        else if (this.S.isDown) {
            this.container.body.setVelocity(0, 300);
        }
        else if (this.W.isDown) {
            this.container.body.setVelocity(0, -300);
        }
        else {
            this.container.body.setVelocity(0, 0);
        }

        if(this.W.isUp && this.A.isUp && this.S.isUp && this.D.isUp) {
            this.container.body.setVelocity(0, 0);
        }

        if (!(this.firedOnce) && this.leftClick.isDown) {
            this.fire(this.angleUpdate);
            this.firedOnce = true;
        }

        if (this.leftClick.isDown && this.control >= 50) {
            this.fire(this.angleUpdate);
        }
        this.physics.add.overlap(this.bullet, this.squirrels, this.destroy, null, this);
        this.control++;
        

        if (this.R.isDown) {
            this.reset();
        }
        

    }

    fire(angle) {
        console.log("Firing");
        //let localPoint = this.getLocalPoint()
        //this.bullet = this.physics.add.sprite(this.weaponSprite.x, this.weaponSprite.y, 'bullet');
        this.gunShot.play();
        this.bullet = this.physics.add.sprite(this.container.x, this.container.y, 'bullet').copyPosition(this.container).setScale(0.05);
        this.bullet.rotation = angle;


        this.physics.moveToObject(this.bullet, this.crossHair, 800);
        this.control = 0;
        

    }

    destroy(bullet, squirrel) {
        if (this.bullet === null) {
            return;
        }
        this.squeak.play();
        squirrel.disableBody(true, true);
        bullet.disableBody(true, true);
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
                    debug: true
                } 
            },
    });
