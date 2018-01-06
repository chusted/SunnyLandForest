import Phaser from 'phaser';

class Chest extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x * 16, y * 16, 'atlas', 'chest/chest-1');
        this.x = x * 16;
        this.y = y * 16;
        this.opened = false;
        this.animations.add('open', ["chest/chest-2"], 0, false);

        this.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this);
        this.body.setSize(19, 12, 9, 13);
        this.body.gravity.y = 500;
    }

    open() {
        this.opened = true;
        this.animations.play("open");


        // TODO This isn't going to work...
        //spawn stars
        //for (var i = 0; i <= 5; i++) {
        //    var temp = new Star(game, this.x, this.y - 15);
        //    this.game.add.existing(temp);
        //    this.loot_group.add(temp);
        //}
    }

    isOpened() {
        return this.opened;
    }
}

export default Chest;