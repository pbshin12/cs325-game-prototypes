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

        this.lives = 3;
        this.score = 0;
        this.captured = 0;
        this.dogSpawnRate = 15000; // 15 seconds to spawn a dog
        this.trashSpawnRate = 3000; // 3 seconds to spawn trash
        
        // Box Position
        this.boxPosition = 2;
        this.boxIsUp = false;

        this.gameStart = true;
        this.scoreText = this.add.text(16, 16, `score: ${this.score}`, {fontSize: '32px', fill: '#FFFFFF'});
        this.capturedText = this.add.text(16, 64, `captured: ${this.captured}`, {fontSize: '32px', fill: '#FFFFFF'});
        this.healthText = this.add.text(16, 120, `HEALTH: ${this.lives}`, {fontSize: '32px', fill: '#FFFFFF'});

 

        this.dogs = this.physics.add.group();
        this.garbage = this.physics.add.group(); // Trash should pass through the ground

        // timer event - https://rexrainbow.github.io/phaser3-rex-notes/docs/site/timer/
        this.dogSpawnTimer = this.time.addEvent({
            delay: this.dogSpawnRate,
            callback: this.spawnDog,
            callbackScope: this,
            loop: true
        });

        this.trashSpawnTimer = this.time.addEvent({
            delay: this.trashSpawnRate,
            callback: this.spawnTrash,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.shelter, this.returnDog, null, this);
        
        this.announcementStyle = { font: "30px Verdana", fill: "#FFFFFF", align: "center" };

        this.playerPosX = this.player.x;
        this.playerPosY = this.player.y;
    }
    
    update() {
        this.playerPosX = this.player.x;
        this.playerPosY = this.player.y;

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
                this.boxIsUp ? this.box.setPosition(this.player.x, this.player.y - 90) : this.boxUp();
                break;
            case 2:
                this.box.setPosition(this.player.x + 70, this.player.y);
                this.boxDown();
                break;
            case 3:
                this.box.setPosition(this.player.x - 70, this.player.y);
                this.boxDown();
                break;
        }

    }

    // Rotates the box if it is up
    boxUp()
    {
        this.boxIsUp = true;
        this.box.angle = 90;
    }

    // Rotates the box if it is down
    boxDown()
    {
        this.boxIsUp = false;
        this.box.angle = 0;
    }

    setDogCollider(dog)
    {
        this.physics.add.overlap(this.box, dog, this.captured_Dog, null, this);
        this.physics.add.overlap(this.player, dog, this.hitPlayer_Dog, null, this);
    }
    // Spawns Dog
    spawnDog()
    {
        console.log("Attempting to spawn dog, this.gameStart = " + this.gameStart);
        if (this.gameStart)
        {
            console.log("HOIIIIIII");
            let randInt = Phaser.Math.Between(1, 2);
            console.log("Random Int for Dog: " + randInt);
            let dog = null;
            switch (randInt)
            {
                case 1:
                    dog = this.dogs.create(0, 530, 'dog').setOrigin(0.5, 0.5).setVelocityX(200).setScale(0.45).refreshBody();
                    dog.body.setAllowGravity(false);
                    dog.flipX = true;
                    break;
                case 2:
                    dog = this.dogs.create(900, 530, 'dog').setOrigin(0.5, 0.5).setVelocityX(-200).setScale(0.45).refreshBody();
                    dog.body.setAllowGravity(false);
                    break;
            }
            this.setDogCollider(dog);
            this.dogs.children.iterate(function(dog) {
                if (dog.x < -110 || dog.x > 910)
                {
                    dog.disableBody(true, true);
                    console.log("Dog destroyed");
                }
            });
            console.log("Dog spawned HOIIIIIIIIIIIII");
        }
    }

    // Initializes colliders for trash
    setTrashCollider(trash)
    {
        this.physics.add.collider(trash, this.ground, this.destroyGarbage, null, this); // Destroys garbage that are out of bounds (literally garbage-handling the data)
        this.physics.add.overlap(this.box, trash, this.collectTrash, null, this);
        this.physics.add.overlap(this.player, this.garbage, this.hitPlayer_Trash, null, this);
    }
    // Spawns Trash
    spawnTrash()
    {
        console.log("Attempting to spawn TRASH, this.gameStart = " + this.gameStart);
        if (this.gameStart)
        {
            let randInt = Phaser.Math.Between(100, 700);
            console.log("Random Int for Trash: " + randInt);
            let trash = this.garbage.create(randInt, 50, 'trash').setOrigin(0.5, 0.5).setVelocityY(150).setScale(0.075);
            this.setTrashCollider(trash);
            this.dogs.children.iterate(function(dog) {
                if (dog.x < -110 || dog.x > 910)
                {
                    dog.disableBody(true, true);
                    console.log("Dog destroyed");
                }
            });
            console.log("Trash spawned HOIIIIIIIIIIIII");
        }
    }

    destroyGarbage(garbage, ground)
    {
        garbage.disableBody(true, true);
    }

    // Collect trash
    collectTrash(player, trash) {
        console.log("Trash collected");
        this.confirmation.play();
        trash.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);
    }

    hitPlayer_Trash(player, trash)
    {
        console.log("Player is hit by trash");
        this.oof.play();
        this.ouch.play();

        trash.disableBody(true, true);
        this.captured = Math.floor(this.captured / 2); // Player loses half of captured dogs
        this.lives--;
        this.capturedText.setText('captured: ' + this.captured);
        this.healthText.setText('HEALTH: ' + this.lives);

        if (this.lives <= 0)
        {
            this.detonate();
        }
        else
        {
            this.oof.play();
            this.ouch.play();
        }
    }

    // Capture dog
    captured_Dog(box, dog)
    {
        console.log("DOG CAPTURED");
        this.squeak.play();
        dog.disableBody(true, true);
        this.captured++;
        this.capturedText.setText('captured: ' + this.captured);
    }

    // Returning the dog to the shelter will reward players with 5 times the normal point amount
    returnDog(player, shelter)
    {
        if (this.captured > 0)
        {
            let totalPoints = 50 * this.captured;
            this.score += totalPoints;
            this.captured = 0;
            this.scoreText.setText('score: ' + this.score);
            this.capturedText.setText('captured: ' + this.captured);
            this.ding.play();
        }

        
    }

    hitPlayer_Dog(player, dog)
    {
        console.log("Player is hit by dog");
        
        dog.disableBody(true, true);
        this.captured = Math.floor(this.captured / 2); // Player loses half of captured dogs
        this.lives--;
        this.capturedText.setText('captured: ' + this.captured);
        this.healthText.setText('HEALTH: ' + this.lives);

        if (this.lives <= 0)
        {
            this.detonate();
        }
        else
        {
            this.oof.play();
            this.ouch.play();
        }
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
        //this.S = this.input.keyboard.addKey('S');
        this.D = this.input.keyboard.addKey('D');
    }

    detonate() {
        console.log("BOOOOOM YOU DIED, YOU FAILED");
        if (this.playerAlive) {
            this.explosion.play();
        }
        this.playerAlive = false;
        this.player.disableBody(true, true);
        this.box.disableBody(true, true);

        this.explosionAnim = this.add.sprite(this.playerPosX, this.playerPosY, 'explosion').setOrigin(0.5, 0.5);
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
            "You have failed\nGAME OVER", this.announcementStyle );
        this.announcementText.setOrigin(0.5, 0);
        this.gameStart = false;
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
        this.box.setScale(0.15, 0.75);
        this.box.body.setAllowGravity(false);


        this.ground = this.physics.add.staticGroup().setOrigin(0);
        this.ground.create(600, 610, 'ground').setScale(1, 0.02).refreshBody();

        // Animal shelter or somethin
        this.shelter = this.physics.add.image(700, 520, 'black').setScale(0.025, 0.05).setOrigin(0.5, 0.5);
        this.shelter.body.setAllowGravity(false);

    }



        // Preloads the Image
    preloadImage() {
        this.load.image('background', 'assets/park.jpg');
        this.load.image('black', 'assets/black.jpg');
        this.load.image('yellow', 'assets/yellow.jpeg');
        this.load.image('man', 'assets/man.png');
        this.load.image('dog', 'assets/annoyingDog.png');
        this.load.image('ground', 'assets/green.png');
        this.load.image('trash', 'assets/trash.png');

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
        this.load.audio('squeak', ['assets/Squeak.mp3']);
        this.load.audio('oof', ['assets/MinecraftOOF.mp3']);
        this.load.audio('ouch', ['assets/ouch.mp3']);
        this.load.audio('confirmation',['assets/UIConfirmation.mp3']);
        this.load.audio('ding', ['assets/Ding.mp3']);

    }

    // Adds audio to a variable
    addAudio() {
        this.bgMusic = this.sound.add('bgMusic', {volume: 0.15});
        this.explosion = this.sound.add('explosion', {volume: 0.75});
        this.beep = this.sound.add('beep', {volume: 0.75});
        this.squeak = this.sound.add('squeak', {volume: 0.75});
        this.oof = this.sound.add('oof', {volume: 1.0});
        this.ouch = this.sound.add('ouch', {volume: 0.80});
        this.confirmation = this.sound.add('confirmation', {volume: 1.15});
        this.ding = this.sound.add('ding', {volume: 0.75});
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
