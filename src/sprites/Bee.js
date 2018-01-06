import Phaser from 'phaser';

class Bee extends Phaser.Sprite {
    constructor(game, x, y, distance, horizontal) {
        super(game, x * 16, y * 16, 'atlas', 'bee/bee-1');
        this.animations.add('fly', Phaser.Animation.generateFrameNames('bee/bee-', 1, 8, '', 0), 15, true);
        this.animations.play("fly");
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this);
        this.body.setSize(15, 18, 11, 13);
        this.initX = this.x;
        this.initY = this.y;
        this.distance = distance;
        this.speed = 40;
        this.horizontal = horizontal;

        if (this.horizontal) {
            this.body.velocity.x = this.speed;
            this.body.velocity.y = 0;
        } else {
            this.body.velocity.x = 0;
            this.body.velocity.y = this.speed;
        }

    }

    update() {
        if (this.horizontal) {
            this.horizontalMove();
        } else {
            this.verticalMove();
        }
    }

    verticalMove() {
        if (this.body.velocity.y > 0 && this.y > this.initY + this.distance) {
            this.body.velocity.y = -40;
        } else if (this.body.velocity.y < 0 && this.y < this.initY - this.distance) {
            this.body.velocity.y = 40;
        }

        // TODO broken...
        //console.log(this);
        //if (this.x > this.player.x) {
        //    this.scale.x = 1;
        //} else {
        //    this.scale.x = -1;
        //}
    }

    horizontalMove() {
        if (this.body.velocity.x > 0 && this.x > this.initX + this.distance) {
            this.body.velocity.x = -40;
        } else if (this.body.velocity.x < 0 && this.x < this.initX - this.distance) {
            this.body.velocity.x = 40;
        }
        if (this.body.velocity.x < 0) {
            this.scale.x = 1;
        } else {
            this.scale.x = -1;
        }
    }
}

export default Bee;