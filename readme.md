# 🏰 Merchant's Morning

A fantasy shopkeeping Progressive Web App where you craft items from materials and serve customers to grow your medieval shop.

## 🎮 Game Features

- **Daily Loop Gameplay**: Buy supplies → Craft items → Serve customers → Earn gold
- **Progressive Difficulty**: Customers want more valuable items as days progress
- **Smart Crafting System**: Tabbed interface with rarity-based sorting
- **Expanded Crafting**: Weapons, armor, trinkets, potions, and tools
- **Strategic Selling**: Match customer requests and earn bonuses for upgrades
- **PWA Ready**: Install on mobile/desktop, works offline

## 🚀 Quick Setup

1. **Fork this repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/merchants-morning.git
   cd merchants-morning
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Update package.json**:
   ```json
   "homepage": "https://yourusername.github.io/merchants-morning"
   ```

5. **Run locally**:
   ```bash
   npm start
   ```

6. **Deploy to GitHub Pages**:
   - Push to main branch
   - GitHub Actions will automatically build and deploy
   - Enable Pages in Settings → Pages → Source: GitHub Actions

## 🎯 How to Play

### Morning Phase
- Buy supply boxes with gold
- Bronze/Silver/Gold/Platinum/Diamond/Mythic boxes give different material rarities
- Higher tier boxes cost more but give better materials

### Crafting Phase
- Use materials to craft weapons, armor, trinkets, potions, and tools
- Items sorted by rarity: Legendary → Rare → Uncommon → Common
- Craftable items highlighted in green

### Shopping Phase
- Select customers from horizontal tabs
- Auto-switches to relevant product category
- Perfect matches = full payment
- Wrong item types cannot be sold

### End of Day
- Review earnings and customer satisfaction
- Use gold to buy better boxes tomorrow

## 🛠️ PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline Play**: Works without internet connection
- **Responsive Design**: Optimized for all screen sizes
- **Touch Friendly**: Mobile-optimized interface

## 📱 Installation

### Mobile (iOS/Android)
1. Open in Safari/Chrome
2. Tap Share → Add to Home Screen
3. Game will install like a native app

### Desktop
1. Open in Chrome/Edge
2. Click install icon in address bar
3. Game will install as desktop app

## 🎨 Customization

All game data is in `src/App.js`:
- Materials: Add new materials with rarity/icons
- Recipes: Create new crafting combinations
- Box Types: Adjust costs and rarity weights
- Game Balance: Modify starting gold, customer behavior

## 📦 Deployment Notes

- Uses GitHub Actions for automatic deployment
- Tailwind CSS via CDN (no build step needed)
- Service worker caches game for offline play
- Optimized for mobile performance

Built with React 18 and modern PWA standards.