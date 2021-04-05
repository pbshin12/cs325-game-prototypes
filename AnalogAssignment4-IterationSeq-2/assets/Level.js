
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	create() {
		
		// galaxy
		const galaxy = this.add.image(985, 298, "galaxy");
		galaxy.scaleX = 1.049821664278925;
		galaxy.scaleY = 0.4778549338731816;
		
		// wizard
		const wizard = this.add.image(69, 336, "Wizard");
		wizard.scaleX = 0.06798699689888643;
		wizard.scaleY = 0.06798699689888643;
	}
	
	/* START-USER-CODE */

	update() {
		galaxy.x -= 0.05;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
