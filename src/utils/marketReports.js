import { random } from './random';

const REPORTS = [
  {
    text: 'Goblin raids reported - adventurers need weapons',
    bias: { weapon: 0.3 },
  },
  {
    text: 'Royal ball announced - nobles want trinkets',
    bias: { trinket: 0.3, rare: 0.15 },
  },
  {
    text: 'Iron shortage at mines - prices rising',
    bias: { armor: 0.2, weapon: 0.1 },
  },
];

export const generateMarketReports = () => {
  const reportCount = Math.floor(random() * 3); // 0-2 reports
  const pool = [...REPORTS];
  const reports = [];
  const bias = { weapon: 0, armor: 0, trinket: 0, rare: 0 };

  for (let i = 0; i < reportCount; i++) {
    if (pool.length === 0) break;
    const index = Math.floor(random() * pool.length);
    const [chosen] = pool.splice(index, 1);
    reports.push(chosen.text);
    Object.entries(chosen.bias).forEach(([key, value]) => {
      bias[key] = (bias[key] || 0) + value;
    });
  }

  return { reports, bias };
};

export default generateMarketReports;
