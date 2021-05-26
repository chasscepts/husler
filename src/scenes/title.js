import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';
import mixin from '../lib/mixin';
import assets, { htmls } from '../lib/assets';
import grid from '../lib/grid';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: TitleScene.key });
    this.eventRelay = mixin({}, eventEmitter());
  }

  preload = () => {
    // this.load.html('form', html.playerNameForm);
  }

  create = () => {
    this.add.image(400, 300, assets.titleFrame.key).setScale(2);
    const text = this.add.text(140, 40, 'Please enter your name', { color: '#340079', fontSize: '38px ' });

    // const element = this.add.dom(400, 0).createFromCache('playerNameForm');
    const nameForm = this.add.dom(
      grid.valueOf(12.5), grid.valueOf(10.5),
    ).createFromCache(htmls.playerNameForm.key);
    this.add.image(grid.valueOf(7.5), grid.valueOf(14), assets.playBtn.key)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const nameInput = nameForm.getChildByName('name');
        const name = nameInput.value;
        if (!name) {
          this.tweens.add({
            targets: text,
            alpha: 0.2,
            duration: 250,
            ease: 'Power3',
            yoyo: true,
            repeat: 3,
          });
          return;
        }
        this.eventRelay.emit('start game', { name });
      });
    this.add.image(grid.valueOf(17), grid.valueOf(14), assets.leaderboardBtn.key)
      .setInteractive({ useHandCursor: true })
      .on('', () => {
        this.eventRelay.emit('show leaderboard');
      });
    // this.add.image(400, 300, assets.grid.key);
  }

  update = () => {

  }
}

TitleScene.key = 'title';
