import Phaser from 'phaser';

class Player extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x * 16, y * 16, 'atlas', 'player-idle/player-idle-1');
        this.x = x * 16;
        this.y = y * 16;

        this.initX = this.x;
        this.initY = this.y;
        this.health = 3;
        this.onLadder = false;

        this.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this);
        this.body.gravity.y = 300;
        this.body.setSize(12, 26, 10, 6);
        //add animations
        var animVel = 12;
        this.animations.add('idle', Phaser.Animation.generateFrameNames('player-idle/player-idle-', 1, 9, '', 0), animVel, true);
        this.animations.add('skip', Phaser.Animation.generateFrameNames('player-skip/player-skip-', 1, 8, '', 0), animVel, true);
        this.animations.add('jump', Phaser.Animation.generateFrameNames('player-jump/player-jump-', 1, 4, '', 0), animVel, true);
        this.animations.add('fall', Phaser.Animation.generateFrameNames('player-fall/player-fall-', 1, 4, '', 0), animVel, true);
        this.animations.add('duck', Phaser.Animation.generateFrameNames('player-duck/player-duck-', 1, 4, '', 0), animVel, true);
        this.animations.add('hurt', Phaser.Animation.generateFrameNames('player-hurt/player-hurt-', 1, 2, '', 0), animVel, true);
        this.animations.add('climb', Phaser.Animation.generateFrameNames('player-climb/player-climb-', 1, 4, '', 0), animVel, true);
        this.animations.play("idle");
    }

    update() {
        if (this.onLadder) {
            this.body.gravity.y = 0;
        } else {
            this.body.gravity.y = 300;
        }
        this.onLadder = false;
    }

    reset() {
        this.x = this.initX;
        this.y = this.initY;
        this.health = 3;
        this.body.velocity.y = 0;
        this.alive = true;
        this.animations.play('idle');
        this.hurtFlag = false;
    }

    death() {
        this.alive = false;
        this.body.velocity.x = 0;
        this.body.velocity.y = -400;
    }


}

export default Player;