import Phaser from 'phaser'

export default class extends Phaser.State {
    preload() {
        this.load.image('loading', 'assets/sprites/loading.png');
    }

    create() {
        console.log(this);
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.renderer.renderSession.roundPixels = true; // blurring off
        this.game.state.start("Preload");
    }
}
