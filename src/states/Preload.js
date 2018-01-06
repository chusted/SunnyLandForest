import Phaser from 'phaser';

export default class extends Phaser.State {
    preload() {
        var loadingBar = this.add.sprite(this.game.width / 2, this.game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loadingBar);

        this.loadTitleScreen();
        this.loadEnvironment();
        this.loadTileset();
        this.loadAtlas();
        this.loadAudio();
    }

    create() {
        this.state.start('TitleScreen');
    }

    loadAudio() {
        this.game.load.audio("music", ["assets/sound/enchanted_forest_loop.ogg", "assets/sound/enchanted_forest.mp3"]);
        this.game.load.audio("carrot", ["assets/sound/carrot.ogg", "assets/sound/carrot.mp3"]);
        this.game.load.audio("enemy-death", ["assets/sound/enemy-death.ogg", "assets/sound/enemy-death.mp3"]);
        this.game.load.audio("hurt", ["assets/sound/hurt.ogg", "assets/sound/hurt.mp3"]);
        this.game.load.audio("jump", ["assets/sound/jump.ogg", "assets/sound/jump.mp3"]);
        this.game.load.audio("star", ["assets/sound/star.ogg", "assets/sound/star.mp3"]);
        this.game.load.audio("chest", ["assets/sound/chest.ogg", "assets/sound/chest.mp3"]);
    }

    loadAtlas() {
        this.game.load.atlasJSONArray("atlas", "assets/atlas/atlas.png", "assets/atlas/atlas.json");
        this.game.load.atlasJSONArray("atlas-props", "assets/atlas/atlas-props.png", "assets/atlas/atlas-props.json");

    }

    loadTileset() {
        this.game.load.image("tileset", "assets/environment/tileset.png");
        this.game.load.image("collisions", "assets/environment/collisions.png");
        this.game.load.tilemap("map", "assets/maps/map.json", null, Phaser.Tilemap.TILED_JSON);
    }

    loadEnvironment() {
        this.game.load.image("background", "assets/environment/background.png");
        this.game.load.image("middleground", "assets/environment/middleground.png");
    }

    loadTitleScreen() {
        this.game.load.image("title", "assets/sprites/title-screen.png");
        this.game.load.image("enter", "assets/sprites/press-enter-text.png");
        this.game.load.image("credits", "assets/sprites/credits-text.png");
        this.game.load.image("instructions", "assets/sprites/instructions.png");
        this.game.load.image("gameover", "assets/sprites/game-over.png");
    }

}