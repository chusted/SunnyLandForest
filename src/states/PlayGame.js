import Phaser from 'phaser';
import config from '../config';
import Player from '../sprites/Player';
import Slug from '../sprites/Slug';
import Bee from '../sprites/Bee';
import Plant from '../sprites/Plant';
import Chest from '../sprites/Chest';
import EnemyDeath from '../sprites/EnemyDeath';

export default class extends Phaser.State {
    create() {
        this.audioFlag = false;
        this.createBg();

        this.createTileMap(1);
        this.decorWorld();

        this.createPlayer(2, 9);

        this.createGroups();
        this.populate();
        this.decorWorldFront();
        this.createCarrots();
        this.camFollow();
        this.bindKeys();
        this.createStars();
        this.startMusic();
        this.addAudios();
        this.createHud();
    }

    createBg() {
        this.background = game.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, "background");
        this.middleground = game.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, "middleground");
        this.background.fixedToCamera = true;
        this.middleground.fixedToCamera = true;
    }

    createTileMap(levelNumber) {
        if (levelNumber == 1) {
            levelNumber = "";
        }
        //tilemap
        this.globalMap = this.game.add.tilemap("map" + levelNumber);
        this.globalMap.addTilesetImage("collisions");
        this.globalMap.addTilesetImage("tileset");

        this.layer_collisions = this.globalMap.createLayer("Collisions Layer");
        console.log(this.layer_collisions);
        //this.layer_collisions.visible = true;

        this.layer = this.globalMap.createLayer("Main Layer");

        // collisions
        this.globalMap.setCollision([1]);
        this.setTopCollisionTiles(2);

        // specific tiles for enemies
        this.globalMap.setTileIndexCallback(3, this.enemyCollide, this);
        this.globalMap.setTileIndexCallback(4, this.triggerLadder, this);
        this.globalMap.setTileIndexCallback(5, this.killZone, this);
        this.globalMap.setTileIndexCallback(8, this.exitZone, this);

        this.layer.resizeWorld();
        this.layer_collisions.resizeWorld();
        this.layer_collisions.visible = true;
        this.layer_collisions.debug = true;
    }

    setTopCollisionTiles(tileIndex) {
        let x, y, tile;
        for (x = 0; x < this.globalMap.width; x++) {
            for (y = 1; y < this.globalMap.height; y++) {
                tile = this.globalMap.getTile(x, y);
                if (tile !== null) {
                    if (tile.index == tileIndex) {
                        tile.setCollision(false, false, true, false);
                    }
                }
            }
        }
    }

    enemyCollide(obj) {
        if (obj.kind == "slug") {
            obj.turnAround();
        }
    }

    triggerLadder(obj) {
        if (obj.kind == "player" && this.wasd.up.isDown) {
            obj.onLadder = true;
        }
    }

    killZone(obj) {
        if (obj.kind == "player") {
            obj.death();
        }
    }

    exitZone(obj) {
        if (obj.kind == "player") {
            this.music.stop();
            this.game.state.start("GameOver");
        }
    }

    decorWorld() {
        this.addProp(1, 0.2, 'tree');
        this.addProp(11, 10.3, 'mushroom-red');
        this.addProp(3, 0, 'vine');
        this.addProp(25, 0, 'vine');
        this.addProp(17, 11, 'mushroom-brown');
        this.addProp(120, 0.2, 'tree');
        this.addProp(146, 2.7, 'house');

        this.addProp(130, 0, 'vine');
        this.addProp(136, 0, 'vine');

        this.addProp(144, 11.3, 'mushroom-red');

        this.addProp(140, 11.3, 'mushroom-brown');
    }

    addProp(x, y, item) {
        this.game.add.image(x * 16, y * 16, 'atlas-props', item);
    }

    createPlayer(x, y) {
        this.player = new Player(this.game, x, y);
        this.game.add.existing(this.player);
    }

    update() {
        // physics
        this.game.physics.arcade.collide(this.enemies_group, this.layer_collisions);
        this.game.physics.arcade.collide(this.chests_group, this.layer_collisions);
        this.game.physics.arcade.collide(this.loot_group, this.layer_collisions);

        if (this.player.alive) {
            //physics
            this.game.physics.arcade.collide(this.player, this.layer_collisions);
            //overlaps
            this.game.physics.arcade.overlap(this.player, this.enemies_group, this.checkAgainstEnemies, null, this);
            this.game.physics.arcade.overlap(this.player, this.carrots_group, this.collectCarrot, null, this);
            this.game.physics.arcade.overlap(this.player, this.stars_group, this.collectStar, null, this);
            this.game.physics.arcade.overlap(this.player, this.chests_group, this.checkAgainstChests, null, this);
            this.game.physics.arcade.overlap(this.player, this.loot_group, this.collectLoot, null, this);
        }

        //
        this.movePlayer();
        this.parallaxBg();
        this.hurtManager();
        this.deathReset();

        this.updateHealthHud();
        //this.debugGame();
    }

    updateHealthHud() {
        switch (this.player.health) {
            case 3:
                this.hud.frameName = "hud/hud-4";
                break;
            case 2:
                this.hud.frameName = "hud/hud-3";
                break;
            case 1:
                this.hud.frameName = "hud/hud-2";
                break;
            case 0:
                this.hud.frameName = "hud/hud-1";
                break;
        }
    }

    parallaxBg() {
        this.background.tilePosition.x = this.layer.x * -0.2;
        this.middleground.tilePosition.x = this.layer.x * -0.5;
    }

    hurtManager() {
        if (this.hurtFlag && this.game.time.totalElapsedSeconds() > 0.3) {
            this.hurtFlag = false;
        }
    }

    deathReset() {
        if (this.player.y > 16 * 60) {
            // player.reset();
            this.music.stop();
            this.game.state.start("GameOver");
        }
    }

    collectCarrot(player, item) {
        item.kill();
        this.audioCarrot.play();
        player.health++;
        if (player.health > 3) {
            player.health = 3;
        }
    }

    collectStar(player, item) {
        this.increaseScore();
        item.kill();
        this.audioStar.play();
    }

    increaseScore() {
        this.score++;
        this.scoreLabel.text = this.score;
    }

    checkAgainstChests(player, chest) {
        if ((player.y + player.body.height * 0.5 < chest.y) && player.body.velocity.y > 0 && !chest.opened) {
            player.body.velocity.y = -100;
            chest.open();
            this.audioChest.play();
        }
    }

    collectLoot(player, item) {
        if (item.able) {
            item.kill();
            this.audioStar.play();
            this.increaseScore();
        }
    }

    createGroups() {
        this.enemies_group = this.game.add.group();
        this.enemies_group.enableBody = true;
        //
        this.chests_group = this.game.add.group();
        this.chests_group.enableBody = true;
        //
        this.loot_group = this.game.add.group();
        this.loot_group.enableBody = true;
    }

    populate() {
        this.spawnSlug(12, 10);
        this.spawnSlug(18, 12);
        this.spawnSlug(31, 2);
        this.spawnBee(33, 10, 20);
        this.spawnPlant(42, 10);
        this.spawnBee(48, 10, 30, true);
        this.spawnBee(60, 10, 30);
        this.spawnPlant(64, 5);

        this.spawnChest(71, 10);
        this.spawnChest(32, 21);

        this.spawnSlug(93, 21);
        this.spawnPlant(101, 20);
        this.spawnBee(111, 9, 30, true);
        this.spawnPlant(100, 7);

        this.spawnSlug(73, 21);
        this.spawnSlug(83, 21);

        this.spawnSlug(129, 11);
        this.spawnSlug(132, 11);

        this.spawnBee(142, 9, 30, false);
    }

    spawnSlug(x, y) {
        var temp = new Slug(game, x, y);
        this.game.add.existing(temp);
        this.enemies_group.add(temp);
    }

    spawnBee(x, y, distance, horizontal) {
        var temp = new Bee(game, x, y, distance, horizontal);
        this.game.add.existing(temp);
        this.enemies_group.add(temp);
    }

    spawnPlant(x, y) {
        var temp = new Plant(game, x, y);
        this.game.add.existing(temp);
        this.enemies_group.add(temp);
    }

    spawnChest(x, y) {
        var temp = new Chest(game, x, y);
        this.game.add.existing(temp);
        this.chests_group.add(temp);
    }

    decorWorldFront() {
        this.addProp(16, 12.7, 'rock');
        this.addProp(2, 12, 'plant');
        this.addProp(23, 12, 'plant');
        this.addProp(53, 11.7, 'rock');

        this.addProp(150, 12, 'plant');
        this.addProp(152, 12, 'plant');
        this.addProp(143, 12, 'plant');
        this.addProp(119, 12, 'plant');
        this.addProp(122, 12.5, 'rock');
    }

    createCarrots() {
        // create groups
        this.carrots_group = this.game.add.group();
        this.carrots_group.enableBody = true;

        this.globalMap.createFromObjects("Object Layer", 6, "atlas", 0, true, false, this.carrots_group);

        // add animation to all items
        this.carrots_group.callAll('animations.add', 'animations', 'spin', ['carrot/carrot-1', 'carrot/carrot-2', 'carrot/carrot-3', 'carrot/carrot-4'], 7, true);
        this.carrots_group.callAll('animations.play', 'animations', 'spin');
    }

    camFollow() {
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    }

    bindKeys() {
        this.wasd = {
            jump: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            duck: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
        };

        this.game.input.keyboard.addKeyCapture(
            [Phaser.Keyboard.SPACEBAR,
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.UP]
        );
    }

    createStars() {
        // create groups
        this.stars_group = this.game.add.group();
        this.stars_group.enableBody = true;

        this.globalMap.createFromObjects("Object Layer", 7, "atlas", 0, true, false, this.stars_group);
        // add animations
        this.stars_group.callAll("animations.add", "animations", "spin-star", ["star/star-1", "star/star-2", "star/star-3", "star/star-4", "star/star-5", "star/star-6"], 10, true);
        this.stars_group.callAll("animations.play", "animations", "spin-star");
    }

    startMusic() {
        if (!this.audioFlag) {
            return
        }

        this.music = this.game.add.audio("music");
        this.music.loop = true;

        this.music.play();
    }

    addAudios() {
        this.audioCarrot = this.game.add.audio("carrot");
        this.audioEnemyDeath = this.game.add.audio("enemy-death");
        this.audioHurt = this.game.add.audio("hurt");
        this.audioJump = this.game.add.audio("jump");
        this.audioStar = this.game.add.audio("star");
        this.audioChest = this.game.add.audio("chest");
    }

    createHud() {
        this.hud = this.game.add.sprite(10, 10, "atlas", "hud/hud-4");
        this.hud.fixedToCamera = true;

        this.scoreLabel = this.game.add.text(10 + 47, 11, "0", {font: "8px VT323", fill: "#ffffff"});
        this.scoreLabel.fixedToCamera = true;
        this.score = 0;
    }

    checkAgainstEnemies(player, enemy) {
        if ((player.y + player.body.height * 0.5 < enemy.y) && player.body.velocity.y > 0) {

            enemy.kill();
            enemy.destroy();
            this.audioEnemyDeath.play();
            this.spawnEnemyDeath(enemy.x, enemy.y);
            player.body.velocity.y = -300;
        } else {
            this.hurtPlayer();
        }
    }

    spawnEnemyDeath(x, y) {
        var temp = new EnemyDeath(this.game, x, y);
        this.game.add.existing(temp);
    }

    hurtPlayer() {
        if (this.hurtFlag) {
            return;
        }
        this.hurtFlag = true;
        this.game.time.reset();

        this.player.animations.play("hurt");
        this.player.y -= 5;

        this.player.body.velocity.y = -150;
        this.player.body.velocity.x = (this.player.scale.x == 1) ? -22 : 22;
        this.player.health--;

        this.audioHurt.play();
        if (this.player.health < 1) {
            this.player.death();

        }
    }

    movePlayer() {
        var vel = 0;

        if (!this.player.alive) {
            this.player.animations.play("hurt");
            return;
        }

        if (this.hurtFlag) {
            this.player.animations.play("hurt");
            return;
        }

        if (this.player.onLadder) {
            this.player.animations.play("climb");

            vel = 30;
            if (this.wasd.duck.isDown) {
                this.player.body.velocity.y = vel;
            } else if (this.wasd.up.isDown) {
                this.player.body.velocity.y = -vel;
            }

            //horizontal

            if (this.wasd.left.isDown) {
                this.player.body.velocity.x = -vel;

                this.player.scale.x = -1;
            } else if (this.wasd.right.isDown) {
                this.player.body.velocity.x = vel;

                this.player.scale.x = 1;
            } else {
                this.player.body.velocity.x = 0;
            }

            return;
        }

        if (this.wasd.jump.isDown && this.player.body.onFloor()) {
            this.player.body.velocity.y = -200;
            this.audioJump.play();
        }

        vel = 80;
        if (this.wasd.left.isDown) {
            this.player.body.velocity.x = -vel;
            this.moveAnimation();
            this.player.scale.x = -1;
        } else if (this.wasd.right.isDown) {
            this.player.body.velocity.x = vel;
            this.moveAnimation();
            this.player.scale.x = 1;
        } else {
            this.player.body.velocity.x = 0;
            this.stillAnimation();
        }
    }

    moveAnimation() {
        if (this.player.body.velocity.y < 0) {
            this.player.animations.play("jump");
        } else if (this.player.body.velocity.y > 0) {
            this.player.animations.play("fall");
        } else {
            this.player.animations.play("skip");
        }
    }

    stillAnimation() {
        if (this.player.body.velocity.y < 0) {
            this.player.animations.play("jump");
        } else if (this.player.body.velocity.y > 0) {
            this.player.animations.play("fall");
        } else if (this.wasd.duck.isDown) {
            this.player.animations.play("duck");
        } else {
            this.player.animations.play("idle");
        }
    }
}