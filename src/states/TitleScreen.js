import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
    create() {
        this.background = this.game.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, "background");
        this.middleground = this.game.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, "middleground");
        this.title = this.game.add.image(this.game.width / 2, 130, "title");
        this.title.anchor.setTo(0.5, 1);
        //
        this.pressEnter = this.game.add.image(this.game.width / 2, this.game.height - 35, "enter");
        this.pressEnter.anchor.setTo(0.5);
        //
        var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startKey.onDown.add(this.startGame, this);
        this.currentState = 1;
        //
        this.game.time.events.loop(700, this.blinkText, this);
        //
        var credits = this.game.add.image(this.game.width / 2, this.game.height - 15, "credits");
        credits.anchor.setTo(0.5);
    }

    startGame() {
        if (this.currentState === 1) {
            this.currentState = 2;
            this.title2 = this.game.add.image(this.game.width / 2, this.game.height / 2, 'instructions');
            this.title2.anchor.setTo(0.5);
            this.title.destroy();
        } else {
            this.game.state.start('PlayGame');
        }
    }

    blinkText() {
        if (this.pressEnter.alpha) {
            this.pressEnter.alpha = 0;
        } else {
            this.pressEnter.alpha = 1;
        }
    }

    update() {
        this.background.tilePosition.x -= 0.25;
        this.middleground.tilePosition.x -= 0.4;
    }
}