import Phaser from 'phaser';

class Slug extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x * 16, y * 16, 'atlas', 'slug/slug-1');
        this.x = x * 16;
        this.y = y * 16;

        this.animations.add('crawl', Phaser.Animation.generateFrameNames('slug/slug-', 1, 4, '', 0), 10, true);
        this.animations.play("crawl");
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this);
        this.body.setSize(20, 11, 7, 10);
        this.body.gravity.y = 500;
        this.speed = 40;
        this.body.velocity.x = this.speed;
        this.body.bounce.x = 1;
    }

    update() {
        if (this.body.velocity.x < 0) {
            this.scale.x = 1;
        } else {
            this.scale.x = -1;
        }
    }

    turnAround() {
        if (this.body.velocity.x > 0) {
            this.body.velocity.x = -this.speed;
            this.x -= 5;
        } else {
            this.body.velocity.x = this.speed;
            this.x += 5;
        }
    }
}

export default Slug;