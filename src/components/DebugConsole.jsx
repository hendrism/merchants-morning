import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MATERIALS, RECIPES } from '../constants';

const DebugConsole = ({ gameState, setGameState, resetGame, openShop, serveCustomer }) => {
  const [goldAmount, setGoldAmount] = useState('');
  const [materialId, setMaterialId] = useState(Object.keys(MATERIALS)[0]);
  const [materialAmount, setMaterialAmount] = useState('1');
  const [activeTab, setActiveTab] = useState('quick'); // quick, materials, stats
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setDarkMode(false);
    } else {
      root.classList.add('dark');
      setDarkMode(true);
    }
  };

  const addGold = () => {
    const amount = parseInt(goldAmount, 10) || 0;
    if (!amount) return;
    setGameState(prev => ({ ...prev, gold: prev.gold + amount }));
    setGoldAmount('');
  };

  const addMaterial = () => {
    const amount = parseInt(materialAmount, 10) || 0;
    if (!amount) return;
    setGameState(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        [materialId]: (prev.materials[materialId] || 0) + amount,
      },
    }));
  };

  const simulateSale = () => {
    const customer = gameState.customers.find(c => !c.satisfied);
    if (!customer) return;
    const match = Object.entries(gameState.inventory).find(([id, count]) => {
      if (count < 1) return false;
      const recipe = RECIPES.find(r => r.id === id);
      return recipe && recipe.type === customer.requestType;
    });
    if (match) {
      serveCustomer(customer.id, match[0]);
    }
  };

  const addAllMaterials = () => {
    setGameState(prev => ({
      ...prev,
      materials: Object.keys(MATERIALS).reduce((acc, matId) => {
        acc[matId] = (prev.materials[matId] || 0) + 10;
        return acc;
      }, { ...prev.materials })
    }));
  };

  const clearInventory = () => {
    setGameState(prev => ({ ...prev, inventory: {} }));
  };

  const skipToDay = (day) => {
    setGameState(prev => ({ ...prev, day, gold: prev.gold + (day - prev.day) * 100 }));
  };

  const tabs = [
    { id: 'quick', label: '⚡ Quick', icon: '⚡' },
    { id: 'materials', label: '📦 Materials', icon: '📦' },
    { id: 'stats', label: '📊 Stats', icon: '📊' }
  ];

  return (
    <div className="p-4 text-sm space-y-4 h-full">
      {/* Tab Navigation */}
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Actions Tab */}
      {activeTab === 'quick' && (
        <div className="space-y-3">
          {/* Game Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="bg-red-500 hover:bg-red-600 text-white rounded p-2 text-xs transition-colors" 
              onClick={resetGame}
            >
              🔄 Reset Game
            </button>
            <button 
              className="bg-gray-500 hover:bg-gray-600 text-white rounded p-2 text-xs transition-colors" 
              onClick={toggleDarkMode}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Quick Add Gold */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Add Gold</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="border rounded px-2 py-1 flex-1 text-xs"
                placeholder="Amount"
                value={goldAmount}
                onChange={e => setGoldAmount(e.target.value)}
              />
              <button 
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors" 
                onClick={addGold}
              >
                💰 Add
              </button>
            </div>
            <div className="flex gap-1">
              {[100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  className="bg-yellow-400 hover:bg-yellow-500 text-xs px-2 py-1 rounded transition-colors"
                  onClick={() => {
                    setGameState(prev => ({ ...prev, gold: prev.gold + amount }));
                  }}
                >
                  +{amount}g
                </button>
              ))}
            </div>
          </div>

          {/* Game Phase Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded p-2 text-xs transition-colors" 
              onClick={openShop}
            >
              🛒 Open Shop
            </button>
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white rounded p-2 text-xs transition-colors" 
              onClick={simulateSale}
            >
              🤖 Auto Sale
            </button>
          </div>

          {/* Quick Day Skip */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Skip to Day</label>
            <div className="flex gap-1">
              {[5, 10, 20].map(day => (
                <button
                  key={day}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded transition-colors"
                  onClick={() => skipToDay(day)}
                >
                  Day {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors flex-1"
              onClick={addAllMaterials}
            >
              📦 Add All Materials (+10)
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
              onClick={clearInventory}
            >
              🗑️ Clear Inventory
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Add Specific Material</label>
            <select
              className="border rounded px-2 py-1 w-full text-xs"
              value={materialId}
              onChange={e => setMaterialId(e.target.value)}
            >
              {Object.entries(MATERIALS).map(([id, m]) => (
                <option key={id} value={id}>
                  {m.icon} {m.name} ({m.rarity})
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                className="border rounded px-2 py-1 w-16 text-xs"
                value={materialAmount}
                onChange={e => setMaterialAmount(e.target.value)}
              />
              <button 
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors flex-1" 
                onClick={addMaterial}
              >
                📦 Add Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-3">
          <div className="text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Materials</div>
                <div className="text-gray-600">
                  {Object.values(gameState.materials || {}).reduce((a, b) => a + b, 0)} total
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Items</div>
                <div className="text-gray-600">
                  {Object.values(gameState.inventory || {}).reduce((a, b) => a + b, 0)} total
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Customers</div>
              <div className="text-gray-600">
                {gameState.customers?.length || 0} waiting
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Earnings</div>
              <div className="text-gray-600">
                {gameState.totalEarnings || 0}g total
              </div>
            </div>

            {gameState.marketBias && (
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-medium">Market Bias</div>
                <div className="text-xs space-y-1">
                  {Object.entries(gameState.marketBias).map(([key, value]) => (
                    <div key={key}>
                      {key}: +{(value * 100).toFixed(0)}%
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

DebugConsole.propTypes = {
  gameState: PropTypes.object.isRequired,
  setGameState: PropTypes.func.isRequired,
  resetGame: PropTypes.func.isRequired,
  openShop: PropTypes.func.isRequired,
  serveCustomer: PropTypes.func.isRequired,
};

export default DebugConsole;
