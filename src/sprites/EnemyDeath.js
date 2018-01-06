import Phaser from 'phaser';

class EnemyDeath extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, "atlas", "enemy-death/enemy-death-1");
        this.anchor.setTo(0.5);
        var animation = this.animations.add("death", Phaser.Animation.generateFrameNames("enemy-death/enemy-death-", 1, 6, '', 0), 18, false);
        this.animations.play("death");
        animation.onComplete.add(function () {
            this.kill();
        }, this);
    }
}

export default EnemyDeath;