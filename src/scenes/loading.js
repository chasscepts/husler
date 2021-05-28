import Phaser from 'phaser';

const html = `
  <div class="scene loading-scene">
    <div class="lds-ripple"><div></div><div></div></div>
  </div>
`;

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: LoadingScene.key });
  }

  create = () => {
    this.add.dom(300, 400).createFromHTML(html);
  }
}

LoadingScene.key = 'loading';
