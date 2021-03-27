
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
		
		// dino
		this.add.image(400, 300, "dino");
		
		// text_1
		const text_1 = this.add.text(400, 450, "", {});
		text_1.setOrigin(0.5, 0);
		text_1.text = "Welcome to Phaser Editor 2D!";
		text_1.setStyle({"fontSize":"30px","fontStyle":"bold"});
		
		// redCircle
		const redCircle = this.add.image(56, 222, "RedCircle");
		redCircle.scaleX = 0.08174692141333628;
		redCircle.scaleY = 0.08174692141333628;
		
		// redCircle_1
		const redCircle_1 = this.add.image(55, 337, "RedCircle");
		redCircle_1.scaleX = 0.08174692141333628;
		redCircle_1.scaleY = 0.08174692141333628;
		
		// redCircle_2
		const redCircle_2 = this.add.image(55, 281, "RedCircle");
		redCircle_2.scaleX = 0.08174692141333628;
		redCircle_2.scaleY = 0.08174692141333628;
		
		// blueCircle
		const blueCircle = this.add.image(673, 280, "BlueCircle");
		blueCircle.scaleX = 0.06233342674867835;
		blueCircle.scaleY = 0.06233342674867835;
		
		// blueCircle_1
		const blueCircle_1 = this.add.image(676, 335, "BlueCircle");
		blueCircle_1.scaleX = 0.06233342674867835;
		blueCircle_1.scaleY = 0.06233342674867835;
		
		// blueCircle_2
		const blueCircle_2 = this.add.image(672, 224, "BlueCircle");
		blueCircle_2.scaleX = 0.06233342674867835;
		blueCircle_2.scaleY = 0.06233342674867835;
	}
	
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
