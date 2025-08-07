// Utilities for analysing user behaviour patterns

export const behaviorAnalysis = {
  trackAction: (action, context = {}) => {
    if (typeof window === 'undefined') return;
    const history = JSON.parse(window.localStorage.getItem('actionHistory') || '[]');
    history.push({ action, context, time: Date.now() });
    window.localStorage.setItem('actionHistory', JSON.stringify(history));
  },

  identifyPatterns: (actionHistory = []) => actionHistory.reduce((acc, curr) => {
    acc[curr.action] = (acc[curr.action] || 0) + 1;
    return acc;
  }, {}),

  calculateEfficiency: (userActions = []) => {
    if (userActions.length < 2) return 0;
    const duration = userActions[userActions.length - 1].time - userActions[0].time;
    return duration > 0 ? userActions.length / duration : 0;
  },

  generateInsights: (behaviorData = []) => {
    const patterns = behaviorAnalysis.identifyPatterns(behaviorData);
    return Object.keys(patterns).map((key) => ({ action: key, count: patterns[key] }));
  },
};

export default behaviorAnalysis;
