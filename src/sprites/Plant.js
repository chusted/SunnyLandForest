import Phaser from 'phaser';

class Plant extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'atlas', 'piranha-plant/piranha-plant-1');

        this.x *= 16;
        this.y *= 16;

        this.animations.add('idle', Phaser.Animation.generateFrameNames('piranha-plant/piranha-plant-', 1, 5, '', 0), 10, true);
        this.animations.add('attack', Phaser.Animation.generateFrameNames('piranha-plant-attack/piranha-plant-attack-', 1, 4, '', 0), 10, true);
        this.animations.play("idle");
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this);
        this.body.gravity.y = 500;
        //this.body.setSize(18, 29, 21, 16);
        this.body.setSize(61, 29, 0, 16);
    }

    update() {
        // TODO This isn't going to work
        //if (this.x > this.player.x) {
        //    this.scale.x = 1;
        //} else {
        //    this.scale.x = -1;
        //}
        //
        //var distance = this.game.physics.arcade.distanceBetween(this, this.player);
        //
        //if (distance < 65) {
        //    this.animations.play("attack");
        //} else {
        //    this.animations.play("idle");
        //}
    }
}

export default Plant;