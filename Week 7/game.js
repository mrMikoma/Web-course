// Inspiration from: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Initialize_the_framework

const gameOptions = {
  ballspeed: 150,
};

window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#eee",
    scale: {
      mode: Phaser.Scale.SHOW_ALL,
      pageAlignHorizontally: true,
      pageAlignVertically: true,
    },
    physics: {
      default: "ARCADE",
    },

    scene: PlayGame,
  };

  game = new Phaser.Game(gameConfig);
  window.focus();
};

class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.score = 0;
  }

  preload() {
    this.load.image("ball", "assets/ball.png");
  }

  create() {
    

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.ball = this.add.sprite(40, 40, "ball");
    this.physics.enable(ball, Phaser.Physics.ARCADE);
    this.ball.body.velocity.set(150, 150);
  }

  update() {
    this.ball.x += 1;
    this.ball.y += 1;
  }
}
