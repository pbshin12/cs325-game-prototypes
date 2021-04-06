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
let timeElapsed = 0;

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
        
        this.bossMusic = this.sound.add('bossMusic', { volume: 0.15 });

        this.screenText = this.add.text(this.cameras.main.centerX, 500, 'Press Space to Play', this.style2).setOrigin(0.5);
        TweenHelper.flashElement(this, this.screenText);
        this.text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 255, "Tutorial", this.style1).setOrigin(0.5,0.5);

        this.wizard = this.add.image(this.cameras.main.centerX + 250, 450, 'wizard').setOrigin(0.5).setScale(0.15);
        this.necromancer = this.add.image(100, 450, 'necromancer').setOrigin(0.5).setScale(0.35);

        this.tutorial = "\n\n\n\n\n\nYou are a wizard fighting a formidable villian: the Necromancer!\nTo defeat him, you must harness the power of the magic stations located around the map.\nBut you must charge them with your own magic.\nHowever, the Necromancer has heard of the sacred magic stations\nand is coming to capture you before you could charge them!\n\n\n\n\nArrow keys to move\n\nStand on top of any station to charge it\n\nDo not let him touch you!\n\nBy the way, I heard the necromancer had\n trained the fiercest animal on earth.\nBe careful!";
        

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
                this.time.delayedCall(1500, () => this.scene.start('mainScene'));
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
    total_Charge = 0;

    constructor()
    {
        super('mainScene');
    }

    preload()
    {
        this.load.image('wizard', 'assets/Wizard.png');
        this.load.image('necromancer', 'assets/skeletonSoldier.png');
        this.load.image('bg', 'assets/forestBackground.jpg');
        this.load.image('station', 'assets/WhiteCircle.png');

        this.load.audio("bossMusic2", 'assets/Part2.mp3');
        this.load.audio("magicSoundFX", 'assets/Magic Sound Effects.mp3');
    }

    create()
    {
        this.finalPhase = false;
        this.game.sound.stopAll();
        this.cameras.main.fadeIn(200, 0, 0, 0);
        this.createControls();
        this.bossMusic = this.sound.add('bossMusic2', {volume: 0.15});
        this.bossMusic.play();
        this.bossMusic.repeat = true;
        this.magicActivation = this.sound.add('magicSoundFX');
        // Stations
        this.stationArray = [];
        this.numberOfStations = 5;

        /* https://labs.phaser.io/edit.html?src=src/camera/follow%20user%20controlled%20sprite.js&v=3.54.0 */
        this.cameras.main.setBounds(0, 0, 474 * 2, 474 * 2);
        this.physics.world.setBounds(0, 0, 474 * 2, 474 * 2);

        // Mashing 4 images together to create one big background
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(474, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 474, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(474, 474, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

        this.projectile = this.physics.add.group();
        this.EnemyProjectile = this.time.addEvent({
            delay: 350,
            callback: this.fire,
            callbackScope: this,
            loop: true
        });

        this.timer = this.time.addEvent(
            {
                delay: 1000,
                callback: this.incrementTimer,
                callbackScope: this,
                loop: true
            }
        );

        
        // Creating station objects. This is where advanced stuff happens
        for (var i = 0; i < 5; i++)
        {
            let station = {
                station: i+1, 
                percent: 0,
                entity: null, 
                filled: false,
                placeStation: function(self, x, y, player) {
                    this.entity = self.physics.add.image(x, y, 'station').setOrigin(0.5).setScale(0.15);
                }
            };
            this.stationArray.push(station);
        }
        // Place stations
        this.stationArray[0].placeStation(this, 175, 474);
        this.station1_Text = this.add.text(this.stationArray[0].entity.x, this.stationArray[0].entity.y, `${this.stationArray[0].percent.toFixed(1)}%` ,{font: "15px Comic Sans MS", fill: '#000000'}).setOrigin(0.5);
        this.stationArray[1].placeStation(this, 474, 75);
        this.station2_Text = this.add.text(this.stationArray[1].entity.x, this.stationArray[1].entity.y, `${this.stationArray[1].percent.toFixed(1)}%` ,{font: "15px Comic Sans MS", fill: '#000000'}).setOrigin(0.5);
        this.stationArray[2].placeStation(this, 775, 474);
        this.station3_Text = this.add.text(this.stationArray[2].entity.x, this.stationArray[2].entity.y, `${this.stationArray[2].percent.toFixed(1)}%` ,{font: "15px Comic Sans MS", fill: '#000000'}).setOrigin(0.5);
        this.stationArray[3].placeStation(this, 474, 875);
        this.station4_Text = this.add.text(this.stationArray[3].entity.x, this.stationArray[3].entity.y, `${this.stationArray[3].percent.toFixed(1)}%` ,{font: "15px Comic Sans MS", fill: '#000000'}).setOrigin(0.5);
        this.stationArray[4].placeStation(this, 474, 474);
        this.station5_Text = this.add.text(this.stationArray[4].entity.x, this.stationArray[4].entity.y, `${this.stationArray[4].percent.toFixed(1)}%` ,{font: "15px Comic Sans MS", fill: '#000000'}).setOrigin(0.5);
        
        this.player = this.physics.add.image(100, 200, 'wizard').setOrigin(0.5);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.05);

        // Probably my worst code yet
        this.physics.add.overlap(this.player, this.stationArray[0].entity, this.chargeStation_1, null, this);
        this.physics.add.overlap(this.player, this.stationArray[1].entity, this.chargeStation_2, null, this);        
        this.physics.add.overlap(this.player, this.stationArray[2].entity, this.chargeStation_3, null, this);        
        this.physics.add.overlap(this.player, this.stationArray[3].entity, this.chargeStation_4, null, this);        
        this.physics.add.overlap(this.player, this.stationArray[4].entity, this.chargeStation_5, null, this);        

        this.style1 = {font: "65px Comic Sans MS", fill: '#0066ff', align: "center"};
        this.style2 = {font: "25px Comic Sans MS", fill: '#ffcc00', align: "center"};

        this.station1Sound = false;
        this.station2Sound = false;
        this.station3Sound = false;
        this.station4Sound = false;
        this.station5Sound = false;

        this.stationCheck_Counter = 0;

        this.necromancer = this.physics.add.image(950, 950, 'necromancer').setOrigin(0.5).setScale(0.5);
        this.necromancerSpeed = 35; // Starts off slow, but progressively becomes faster
        
        

        this.physics.add.overlap(this.player, this.necromancer, this.killPlayer, null, this);
        this.time.delayedCall(1000, () => this.necromancer.setSize(150, 500, true));
        this.time.delayedCall(1000, () => this.player.setSize(300, 450, true));
        this.cameras.main.startFollow(this.necromancer, true, 0.50, 0.50);
        this.cameras.main.setZoom(1.25);

        this.time.delayedCall(2000, () => this.cameras.main.startFollow(this.player, true, 0.50, 0.50));


        this.physics.add.overlap(this.player, this.projectile, this.killPlayer, null, this);
        
        this.timerText = this.add.text( (this.cameras.main.width / 2) , 100).setScrollFactor(0).setFontSize(30).setColor('#ffffff').setOrigin(0.5);
        
    }

    incrementTimer()
    {
        timeElapsed += 1;
        //console.log(`Time elapsed: ${timeElapsed} seconds`);
        this.timerText.setText(`Time Elapsed: ${timeElapsed} seconds`);
    }

    fire()
    {
        let spawnLocation = [1, 2, 3, 4];
        let projectile = null;
        if (this.finalPhase === true)
        {
            let randInt = Phaser.Math.Between(1, 4);
            switch(spawnLocation[randInt])
            {
                case 1:
                    projectile = this.projectile.create(0, 0, 'dog').setOrigin(0.5).setScale(0.3);
                    this.physics.moveToObject(projectile, this.player, Phaser.Math.Between(100, 350) );
                    projectile.setSize(100, 100, true);
                    break;
                case 2:
                    projectile = this.projectile.create(950, 0, 'dog').setOrigin(0.5).setScale(0.3);
                    this.physics.moveToObject(projectile, this.player, Phaser.Math.Between(100, 350));
                    projectile.setSize(100, 100, true);
                    break;
                case 3:
                    projectile = this.projectile.create(0, 950, 'dog').setOrigin(0.5).setScale(0.3);
                    this.physics.moveToObject(projectile, this.player, Phaser.Math.Between(100, 350));
                    projectile.setSize(100, 100, true);
                    break;
                case 4:
                    projectile = this.projectile.create(950, 950, 'dog').setOrigin(0.5).setScale(0.3);
                    this.physics.moveToObject(projectile, this.player, Phaser.Math.Between(100, 350));
                    projectile.setSize(100, 100, true);
                    break;
            }
            this.projectile.children.iterate(function(projectile)
            {
                if (projectile.x < -100 || projectile.x > 1000)
                {
                    projectile.disableBody(true, true);
                    console.log("Dog destroyed");
                }

                if (projectile.y < -100 || projectile.y > 1000)
                {
                    projectile.disableBody(true, true);
                    console.log("Dog destroyed");
                }
            });
            console.log("Final phase activated, firing projectiles");

        }
        else
        {
            console.log("Final phase not activated")
        }
    }

    killPlayer()
    {
        this.playerAlive = false;
        console.log("Player is dead");
        this.scene.start('lose');
    }

    chargeStation_1(player, entity)
    {

        if (this.stationArray[0].filled === false) {
            this.stationArray[0].percent += 0.20;
        }
        if (this.stationArray[0].percent >= 100) {
            this.stationArray[0].percent = 100;
            this.stationArray[0].filled = true;
            if (!this.station1Sound) 
            {
                this.magicActivation.play();
                this.station1Sound = true;
                //this.necromancerSpeed += 50;
                this.stationCheck_Counter++;
            }
        }

        this.station1_Text.setText(`${this.stationArray[0].percent.toFixed(1)}%`);
    }

    chargeStation_2(player, entity)
    {

        if (this.stationArray[1].filled === false) {
            this.stationArray[1].percent += 0.20;
        }
        if (this.stationArray[1].percent >= 100) {
            this.stationArray[1].percent = 100;
            this.stationArray[1].filled = true;
            if (!this.station2Sound) 
            {
                this.magicActivation.play();
                this.station2Sound = true;
                //this.necromancerSpeed += 50;
                this.stationCheck_Counter++;
            }
        }
        this.station2_Text.setText(`${this.stationArray[1].percent.toFixed(1)}%`);
    }

    chargeStation_3(player, entity)
    {
        if (this.stationArray[2].filled === false) {
            this.stationArray[2].percent += 0.20;
        }
        if (this.stationArray[2].percent >= 100) {
            this.stationArray[2].percent = 100;
            this.stationArray[2].filled = true;
            if (!this.station3Sound) 
            {
                this.magicActivation.play();
                this.station3Sound = true;
                //this.necromancerSpeed += 50;
                this.stationCheck_Counter++;
            }
        }
        this.station3_Text.setText(`${this.stationArray[2].percent.toFixed(1)}%`);
    }

    chargeStation_4(player, entity)
    {
        if (this.stationArray[3].filled === false) {
            this.stationArray[3].percent += 0.20;
        }
        if (this.stationArray[3].percent >= 100) {
            this.stationArray[3].percent = 100;
            this.stationArray[3].filled = true;
            if (!this.station4Sound) 
            {
                this.magicActivation.play();
                this.station4Sound = true;
                //this.necromancerSpeed += 50;
                this.stationCheck_Counter++;
                
            }
        }
        this.station4_Text.setText(`${this.stationArray[3].percent.toFixed(1)}%`);
    }

    chargeStation_5(player, entity)
    {
        if (this.stationArray[4].filled === false) {
            this.stationArray[4].percent += 0.20;
        }
        if (this.stationArray[4].percent >= 100) {
            this.stationArray[4].percent = 100;
            this.stationArray[4].filled = true;
            if (!this.station5Sound) 
            {
                this.magicActivation.play();
                this.station5Sound = true;
                //this.necromancerSpeed += 50;
                this.stationCheck_Counter++;
            }
        }
        this.station5_Text.setText(`${this.stationArray[4].percent.toFixed(1)}%`);
    }


    update()
    {

        if (this.stationCheck_Counter === 5)
        {
            this.enemyAlive = false;
            this.scene.start('victory');
        }

        currentScene = this;
        this.player.setVelocity(0);
        this.physics.moveToObject(this.necromancer, this.player, this.necromancerSpeed);

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

        if (this.player.x < this.necromancer.x)
        {
            this.necromancer.flipX = true;
        }
        else
        {
            this.necromancer.flipX = false;
        }

        let total_Sum = 0;
        for (let i = 0; i < 5; i++)
        {
            total_Sum += this.stationArray[i].percent
        }
        this.total_Charge = (total_Sum / 500) * 100;

        if (this.total_Charge >= 15.0 && this.total_Charge < 39)
        {
            this.necromancerSpeed = 50;
        }
        if (this.total_Charge >= 40.0 && this.total_Charge < 59)
        {
            this.necromancerSpeed = 100;
            this.finalPhase = true;
        }
        if (this.total_Charge >= 60.0 && this.total_Charge < 69)
        {
            this.necromancerSpeed = 175;
        }
        if (this.total_Charge >= 70.0 && this.total_Charge < 99)
        {
            this.necromancerSpeed = 200;
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

class Lose extends Phaser.Scene
{
    spaceCounter = 0;

    constructor()
    {
        super('lose');
    }

    preload()
    {
        this.load.image('wizard', 'assets/Wizard.png');
        this.load.image('necromancer', 'assets/skeletonSoldier.png');
        this.load.image('dog', 'assets/annoyingDog.png')

        this.load.audio('bossMusic', ["assets/8-Bit RPG Music - Boss Battle Original Composition.mp3"]);
        this.space = this.input.keyboard.addKey('SPACE');
    }

    create()
    {
        this.gameStart = false;
        this.style1 = {font: "65px Comic Sans MS", fill: '#FF0000', align: "center"};
        this.style2 = {font: "25px Comic Sans MS", fill: '#ffcc00', align: "center"};
        this.style3 = {font: "20px Comic Sans MS", fill: '#ffffff', align: "center"};
        this.cameras.main.setBackgroundColor('#000000');
        
        this.bossMusic = this.sound.add('bossMusic', { volume: 0.15 });

        TweenHelper.flashElement(this, this.screenText);
        this.text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "YOU LOSE", this.style1).setOrigin(0.5,0.5);

        this.wizard = this.add.image(this.cameras.main.centerX + 250, 450, 'wizard').setOrigin(0.5).setScale(0.15);
        this.necromancer = this.add.image(100, 450, 'necromancer').setOrigin(0.5).setScale(0.35);
        this.necromancer.setSize(10, 10, true);      

        this.screenText = this.add.text(this.cameras.main.centerX, 500, 'Press Space to Return to Title Screen', this.style2).setOrigin(0.5);
        TweenHelper.flashElement(this, this.screenText);

        this.minutes = Math.trunc(timeElapsed / 60);
        this.seconds = timeElapsed % 60;
        this.timerText = this.add.text(this.cameras.main.centerX, 400, `Time elapsed: ${this.minutes} minute(s) ${this.seconds} second(s)`, this.style3).setOrigin(0.5);
        

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
                timeElapsed = 0;
                this.scene.start('title');
                
            }
            
            
        }

        if (this.gameStart === true)
        {
            this.wizard.x += 2;
            
            if (this.wizard.x >= 1100)
            {
                this.necromancer.x += 3;
                this.time.delayedCall(1500, () => this.scene.start('mainScene'));
            }
        }
    }

}

class Victory extends Phaser.Scene
{
    spaceCounter = 0;

    constructor()
    {
        super('victory');
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
        this.style1 = {font: "65px Comic Sans MS", fill: '#ffff00', align: "center"};
        this.style2 = {font: "25px Comic Sans MS", fill: '#ffff00', align: "center"};
        this.style3 = {font: "20px Comic Sans MS", fill: '#ffffff', align: "center"};
        this.cameras.main.setBackgroundColor('#000000');
        
        this.text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "YOU WIN!!", this.style1).setOrigin(0.5,0.5);

        this.wizard = this.add.image(this.cameras.main.centerX + 250, 450, 'wizard').setOrigin(0.5).setScale(0.15);
        this.necromancer = this.add.image(100, 450, 'necromancer').setOrigin(0.5).setScale(0.35);
        this.necromancer.setSize(10, 10, true);      

        this.screenText = this.add.text(this.cameras.main.centerX, 500, 'Press Space to Return to Title Screen', this.style2).setOrigin(0.5);
        TweenHelper.flashElement(this, this.screenText);
        

        this.minutes = Math.trunc(timeElapsed / 60);
        this.seconds = timeElapsed % 60;
        this.timerText = this.add.text(this.cameras.main.centerX, 400, `Time elapsed: ${this.minutes} minute(s) ${this.seconds} second(s)`, this.style3).setOrigin(0.5);

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
                timeElapsed = 0;
                this.scene.start('title');
                
            }
            
            
        }

        if (this.gameStart === true)
        {
            this.wizard.x += 2;
            
            if (this.wizard.x >= 1100)
            {
                this.necromancer.x += 3;
                this.time.delayedCall(1500, () => this.scene.start('mainScene'));
            }
        }
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
    scene: [Title, Tutorial, MainScene, Lose, Victory],
    physics: { default: 'arcade',
                arcade: {debug: false} },
    });
