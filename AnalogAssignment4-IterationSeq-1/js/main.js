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

let currentScene;

class Title extends Phaser.Scene
{
    constructor()
    {
        super('title');
    }

    preload()
    {
        this.load.image('wizard', 'assets/Wizard.png');
        this.load.image('necromancer', 'assets/skeletonSoldier.png');
        this.load.image('dog', 'assets/annoyingDog.png');
        this.load.audio('theme', ["assets/8-Bit RPG Music - The Heroine's Theme Original Composition.mp3"]);
        this.load.audio('confirmation', ['assets/UIConfirmation.mp3']);

        this.space = this.input.keyboard.addKey('SPACE');
    }

    create()
    {
        this.style1 = {font: "65px Comic Sans MS", fill: '#0066ff', align: "center"};
        this.style2 = {font: "80px Comic Sans MS", fill: '#ffcc00', align: "center"};
        this.cameras.main.setBackgroundColor('#000000');
        this.themeMusic = this.sound.add('theme', {volume: 0.15});
        this.themeMusic.play();
        this.themeMusic.loop = true;
        this.confirmation = this.sound.add('confirmation');

        this.screenText = this.add.text(425, 400, 'Press Space to Play', this.style2).setOrigin(0.5);
        TweenHelper.flashElement(this, this.screenText);
        this.text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, "Yutnori for Wizards... Kinda", this.style1).setOrigin(0.5,0.5);

        this.add.image(this.cameras.main.centerX, 250, 'wizard').setOrigin(0.5).setScale(0.15);
        this.necromancer = this.add.image(100, 575, 'necromancer').setOrigin(0.5).setScale(0.35);
        this.necromancer.angle -= 30;
    }

    update()
    {
        currentScene = this;

        if (this.space.isDown)
        {
            this.confirmation.play();
            currentScene.scene.start('tutorial');
        }
    }

}

class Tutorial extends Phaser.Scene
{
    spaceCounter = 0;

    constructor()
    {
        super('tutorial');
    }

    preload()
    {
        this.load.image('wizard', 'assets/Wizard.png');
        this.load.image('necromancer', 'assets/skeletonSoldier.png');

        this.load.audio('bossMusic', ["assets/8-Bit RPG Music - Boss Battle Original Composition.mp3"]);
        this.space = this.input.keyboard.addKey('SPACE');
    }

    create()
    {
        this.gameStart = false;
        this.style1 = {font: "65px Comic Sans MS", fill: '#0066ff', align: "center"};
        this.style2 = {font: "25px Comic Sans MS", fill: '#ffcc00', align: "center"};
        this.style3 = {font: "20px Comic Sans MS", fill: '#ffffff', align: "center"};
        this.cameras.main.setBackgroundColor('#000000');
        
        this.bossMusic = this.sound.add('bossMusic', { volume: 0.35 });

        this.screenText = this.add.text(this.cameras.main.centerX, 500, 'Press Space to Play', this.style2).setOrigin(0.5);
        TweenHelper.flashElement(this, this.screenText);
        this.text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 255, "Tutorial", this.style1).setOrigin(0.5,0.5);

        this.wizard = this.add.image(this.cameras.main.centerX + 250, 450, 'wizard').setOrigin(0.5).setScale(0.15);
        this.necromancer = this.add.image(100, 450, 'necromancer').setOrigin(0.5).setScale(0.35);

        this.tutorial = "\n\n\n\nYou are a wizard fighting a formidable villian: the Necromancer!\nTo defeat him, you must harness the power of the magic stations located around the map.\nBut you must charge them with your own magic.\nHowever, the Necromancer has heard of the sacred magic stations\nand is coming to capture you before you could charge them!\n\n\n\n\nArrow keys to move\n\nStand on top of any station to charge it\n\nDo not let him touch you!";
        

        this.screenText = this.add.text(this.cameras.main.centerX, 500, 'Press Space to Play', this.style2).setOrigin(0.5);
        TweenHelper.flashElement(this, this.screenText);
        this.text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 255, "Tutorial", this.style1).setOrigin(0.5,0.5);

        this.tutorialText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, this.tutorial, this.style3).setOrigin(0.5);
        this.musicPlayed = false;
    }

    update()
    {
        currentScene = this;
        

        if (this.space.isDown)
        {
            this.gameStart = true;

            if (this.musicPlayed === false)
            {
                this.game.sound.stopAll();
                this.bossMusic.play();
                this.bossMusic.repeat = true;
                this.musicPlayed = true;
            }
            
            
        }

        if (this.gameStart === true)
        {
            this.wizard.x += 2;
            
            if (this.wizard.x >= 1100)
            {
                this.necromancer.x += 3;
                this.time.delayedCall(1200, () => this.scene.start('mainScene'));
            }
        }
    }

}

class MainScene extends Phaser.Scene
{
    playerDirection = 1; // 1 is right, 0 is left
    playerAlive = true;
    enemyAlive = true;
    enemyHealth = 100;
    enemyDirection = 1;
    playerHealth = 3; // Can take 3 hits, or one hit?

    constructor()
    {
        super('mainScene');
    }

    preload()
    {
        this.load.image('wizard', 'assets/Wizard.png');
        this.load.image('necromancer', 'assets/skeletonSoldier.png');
        this.load.image('bg', 'assets/forestBackground.jpg');
    }

    create()
    {
        /* https://labs.phaser.io/edit.html?src=src/camera/follow%20user%20controlled%20sprite.js&v=3.54.0 */
        this.cameras.main.setBounds(0, 0, 474 * 2, 474 * 2);
        this.physics.world.setBounds(0, 0, 474 * 2, 474 * 2);

        // Mashing 4 images together to create one big background
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(474, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 474, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(474, 474, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);


        this.cameras.main.fadeIn(200, 0, 0, 0);
        this.style1 = {font: "65px Comic Sans MS", fill: '#0066ff', align: "center"};
        this.style2 = {font: "25px Comic Sans MS", fill: '#ffcc00', align: "center"};
        
        this.createControls();

        this.player = this.physics.add.image(100, 200, 'wizard').setOrigin(0.5);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.05);

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(1.25);
    }

    update()
    {

        this.player.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-250);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(250);
            this.player.flipX = false;
        }

        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-250);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(250);
        }
    }

    // Creates the controls
    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.W = this.input.keyboard.addKey('W');
        this.A = this.input.keyboard.addKey('A');
        this.S = this.input.keyboard.addKey('S');
        this.D = this.input.keyboard.addKey('D');
    }

}

/* This code is taken from this source: https://www.stephengarside.co.uk/blog/phaser-3-flashing-text-easy-example/ */
export default class TweenHelper {
    static flashElement(scene, element, repeat = true, easing = 'Linear', overallDuration = 500, visiblePauseDuration = 500) {
        if (scene && element) {
            let flashDuration = overallDuration - visiblePauseDuration / 2;

            scene.tweens.timeline({
                tweens: [
                    {
                        targets: element,
                        duration: 0,
                        alpha: 0,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: visiblePauseDuration,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 0,
                        ease: easing,
                        onComplete: () => {
                            if (repeat === true) {
                                this.flashElement(scene, element);
                            }
                        }
                    }
                ]
            });
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [Title, Tutorial, MainScene],
    physics: { default: 'arcade' },
    });
