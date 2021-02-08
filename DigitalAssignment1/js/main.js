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

var point2;
var text;

var angle = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa } });

    point = new Phaser.Math.Vector2(250, 0);
    point2 = new Phaser.Math.Vector2(250, 0);

    text = this.add.text(30, 30, '');

    this.input.on('pointermove', function (pointer) {
        point2.copy(pointer);

        point2.x -= 400;
        point2.y -= 300;
    });
}

function update ()
{
    graphics.clear();

    angle += 0.005;

    // vector starting at 0/0
    point.setTo(Math.cos(angle) * 250, Math.sin(angle) * 250);

    // drawn from the center (as if center was 0/0)
    graphics.lineBetween(400, 300, 400 + point.x, 300 + point.y);

    graphics.lineStyle(2, 0x00aa00);
    graphics.lineBetween(400, 300, 400 + point2.x, 300 + point2.y);

    var cross = point.cross(point2);

    var area = point.length() * point2.length();

    var angleBetween = Math.asin(cross / area);

    text.setText([
        'Cross product: ' + cross,
        'Normalized cross product: ' + cross / area,
        'Sinus of the angle between vectors: '+ Phaser.Math.RadToDeg(angleBetween),
        'Green vector is on the ' + (cross > 0 ? 'right' : 'left')
    ].join('\n'));
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
