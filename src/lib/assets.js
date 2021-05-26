import grid from '../assets/images/grid.png';
import wood from '../assets/images/wood.png';
import hero from '../assets/images/hero-sm.png';
import ladder from '../assets/images/ladder.png';
import silver from '../assets/images/gem5.png';
import bronze from '../assets/images/gem2.png';
import gold from '../assets/images/gold-coin.png';
import door from '../assets/images/door.png';
import grass from '../assets/images/grass.png';
import bg from '../assets/images/space.png';
import transparent from '../assets/images/transparent.png';
import olympic from '../assets/images/bg-olympic.png';
import pinball from '../assets/images/pinball.png';
import titleFrame from '../assets/images/title-frame.png';
import playerNameForm from '../assets/texts/name-form.html';
import playBtn from '../assets/images/gold-btn-play.png';
import leaderboardBtn from '../assets/images/gold-btn-leaderboard.png';

export const htmls = { playerNameForm: { key: 'playerNameForm', file: playerNameForm } };

export const sprites = {

};

export const bootSprites = {
  hero: {
    key: 'hero', file: hero, width: 40, height: 40,
  },
};

export const bootAssets = {
  olympic: { key: 'olympic', file: olympic },
  transparent: { key: 'transparent', file: transparent },
};

export default {
  grid: { key: 'grid', file: grid },
  wood: { key: 'wood', file: wood },
  ladder: { key: 'ladder', file: ladder },
  silver: { key: 'silver', file: silver },
  bronze: { key: 'bronze', file: bronze },
  gold: { key: 'gold', file: gold },
  door: { key: 'door', file: door },
  grass: { key: 'grass', file: grass },
  bg: { key: 'bg', file: bg },
  pinball: { key: 'pinball', file: pinball },
  titleFrame: { key: 'titleFrame', file: titleFrame },
  playBtn: { key: 'playBtn', file: playBtn },
  leaderboardBtn: { key: 'leaderboardBtn', file: leaderboardBtn },
};
