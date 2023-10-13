// Inspiration from: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Initialize_the_framework

let game;

const gameOptions = {
    dudeGravity: 800,
    dudeSpeed: 300
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#eee",
        scale: {
            mode: Phaser.Scale.SHOW_ALL,
            pageAlignHorizontally: true,
            pageAlignVertically: true,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: PlayGame
    }

    game = new Phaser.Game(gameConfig)
    window.focus();
}


class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame")
        this.score = 0;
        this.ball;
    }
    

    preload() {
        game.load.image("ball", "img/ball.png");
    }

    create() {
        this.ball = game.add.sprite(50, 50, "ball");
    }



    
    update() {

    }

}
