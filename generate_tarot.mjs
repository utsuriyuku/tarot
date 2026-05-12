import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const majorArcana = [
  { id: '0', title: 'The Fool', name: '愚者', url: '9/90/RWS_Tarot_00_Fool.jpg' },
  { id: '1', title: 'The Magician', name: '魔术师', url: 'd/de/RWS_Tarot_01_Magician.jpg' },
  { id: '2', title: 'The High Priestess', name: '女祭司', url: '8/88/RWS_Tarot_02_High_Priestess.jpg' },
  { id: '3', title: 'The Empress', name: '皇后', url: 'd/d2/RWS_Tarot_03_Empress.jpg' },
  { id: '4', title: 'The Emperor', name: '皇帝', url: 'c/c3/RWS_Tarot_04_Emperor.jpg' },
  { id: '5', title: 'The Hierophant', name: '教皇', url: '8/8d/RWS_Tarot_05_Hierophant.jpg' },
  { id: '6', title: 'The Lovers', name: '恋人', url: '3/3a/RWS_Tarot_06_Lovers.jpg' },
  { id: '7', title: 'The Chariot', name: '战车', url: '9/9b/RWS_Tarot_07_Chariot.jpg' },
  { id: '8', title: 'Strength', name: '力量', url: 'f/f5/RWS_Tarot_08_Strength.jpg' },
  { id: '9', title: 'The Hermit', name: '隐者', url: '4/4d/RWS_Tarot_09_Hermit.jpg' },
  { id: '10', title: 'Wheel of Fortune', name: '命运之轮', url: '3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg' },
  { id: '11', title: 'Justice', name: '正义', url: 'e/e0/RWS_Tarot_11_Justice.jpg' },
  { id: '12', title: 'The Hanged Man', name: '倒吊人', url: '2/2b/RWS_Tarot_12_Hanged_Man.jpg' },
  { id: '13', title: 'Death', name: '死神', url: 'd/d7/RWS_Tarot_13_Death.jpg' },
  { id: '14', title: 'Temperance', name: '节制', url: 'f/f8/RWS_Tarot_14_Temperance.jpg' },
  { id: '15', title: 'The Devil', name: '恶魔', url: '5/55/RWS_Tarot_15_Devil.jpg' },
  { id: '16', title: 'The Tower', name: '高塔', url: '5/53/RWS_Tarot_16_Tower.jpg' },
  { id: '17', title: 'The Star', name: '星星', url: 'd/db/RWS_Tarot_17_Star.jpg' },
  { id: '18', title: 'The Moon', name: '月亮', url: '7/7f/RWS_Tarot_18_Moon.jpg' },
  { id: '19', title: 'The Sun', name: '太阳', url: '1/17/RWS_Tarot_19_Sun.jpg' },
  { id: '20', title: 'Judgement', name: '审判', url: 'd/dd/RWS_Tarot_20_Judgment.jpg' },
  { id: '21', title: 'The World', name: '世界', url: 'f/ff/RWS_Tarot_21_World.jpg' }
];

const suits = [
  { suit: 'Wands', name: '权杖', elements: '火/能量' },
  { suit: 'Cups', name: '圣杯', elements: '水/情感' },
  { suit: 'Swords', name: '宝剑', elements: '风/心智' },
  { suit: 'Pentacles', name: '星币', elements: '土/物质' }
];

const ranks = [
  { rank: 'Ace', name: '王牌' }, { rank: 'Two', name: '二' }, { rank: 'Three', name: '三' },
  { rank: 'Four', name: '四' }, { rank: 'Five', name: '五' }, { rank: 'Six', name: '六' },
  { rank: 'Seven', name: '七' }, { rank: 'Eight', name: '八' }, { rank: 'Nine', name: '九' },
  { rank: 'Ten', name: '十' }, { rank: 'Page', name: '侍从' }, { rank: 'Knight', name: '骑士' },
  { rank: 'Queen', name: '王后' }, { rank: 'King', name: '国王' }
];

let tarotDeck = [];

majorArcana.forEach(card => {
  tarotDeck.push({
    id: `major_${card.id}`,
    title: card.title,
    name: card.name,
    meaning: `【大阿卡纳】代表宏观的量子波函数状态与宇宙维度法则。`,
    img: `https://upload.wikimedia.org/wikipedia/en/${card.url}?download`
  });
});

suits.forEach(suit => {
  ranks.forEach((rank, index) => {
    tarotDeck.push({
      id: `${suit.suit}_${index + 1}`,
      title: `${rank.rank} of ${suit.suit}`,
      name: `${suit.name}${rank.name}`,
      meaning: `【小阿卡纳 / ${suit.elements}】微观粒子的干涉与局部坍缩现象。`,
      img: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/RWS_Tarot_placeholder.jpg/800px-RWS_Tarot_placeholder.jpg` // Placeholder for minor arcana limits
    });
  });
});

const tsContent = `// Automatically generated 78 tarot cards
export const TAROT_DECK = ${JSON.stringify(tarotDeck, null, 2)};

export function getRandomCard() {
  const randomIndex = Math.floor(Math.random() * TAROT_DECK.length);
  const isReversed = Math.random() > 0.5;
  return {
    ...TAROT_DECK[randomIndex],
    reversed: isReversed
  };
}
`;

fs.writeFileSync(path.join(__dirname, 'web-app/src/data/tarotData.ts'), tsContent, 'utf-8');
console.log('Successfully generated 78 Tarot Cards into tarotData.ts');
