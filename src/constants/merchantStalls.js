export const MERCHANT_STALLS = {
  blacksmith: {
    id: 'blacksmith',
    name: 'Blacksmith',
    keeper: 'Thorek',
    icon: '⚒️',
    theme: 'blacksmith',
    greeting: 'Welcome to my forge, friend!',
    materialTypes: ['metal'] // maps to your existing material types
  },
  woodsman: {
    id: 'woodsman', 
    name: 'Woodsman',
    keeper: 'Elara',
    icon: '🌲',
    theme: 'woodsman',
    greeting: 'Fresh from the ancient forests!',
    materialTypes: ['wood', 'organic']
  },
  trader: {
    id: 'trader',
    name: 'Trader', 
    keeper: 'Khalil',
    icon: '🏺',
    theme: 'trader',
    greeting: 'Rare treasures from distant lands!',
    materialTypes: ['gem', 'magical']
  },
  tailor: {
    id: 'tailor',
    name: 'Tailor',
    keeper: 'Meredith', 
    icon: '🧵',
    theme: 'tailor',
    greeting: 'Quality fabrics and leatherwork!',
    materialTypes: ['fabric', 'beast', 'container', 'utility']
  }
};

export const STALL_THEMES = {
  blacksmith: {
    primary: '#34495e',
    secondary: '#2c3e50', 
    border: '#95a5a6',
    accent: '#7f8c8d'
  },
  woodsman: {
    primary: '#27ae60',
    secondary: '#1e7e34',
    border: '#2ecc71', 
    accent: '#58d68d'
  },
  trader: {
    primary: '#8e44ad',
    secondary: '#6a1b99',
    border: '#9b59b6',
    accent: '#af7ac5'
  },
  tailor: {
    primary: '#e67e22',
    secondary: '#d35400', 
    border: '#f39c12',
    accent: '#f8c471'
  }
};
