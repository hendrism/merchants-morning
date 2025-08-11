import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MATERIALS, RECIPES } from '../constants';

const DebugConsole = ({ gameState, setGameState, resetGame, openShop, serveCustomer }) => {
  const [goldAmount, setGoldAmount] = useState('');
  const [materialId, setMaterialId] = useState(Object.keys(MATERIALS)[0]);
  const [materialAmount, setMaterialAmount] = useState('1');
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

  return (
    <div className="fixed top-24 right-4 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg shadow-xl p-4 w-80 z-50 text-sm space-y-3 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="font-bold text-gray-800">🔧 Debug Console</h2>
        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
          Day {gameState.day} • {gameState.gold}g
        </div>
      </div>
      
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

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            className="border rounded px-2 py-1 flex-1 text-xs"
            placeholder="Gold amount"
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

        <div className="flex gap-2 items-center">
          <select
            className="border rounded px-2 py-1 flex-1 text-xs"
            value={materialId}
            onChange={e => setMaterialId(e.target.value)}
          >
            {Object.entries(MATERIALS).map(([id, m]) => (
              <option key={id} value={id}>
                {m.icon} {m.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="border rounded px-2 py-1 w-12 text-xs"
            value={materialAmount}
            onChange={e => setMaterialAmount(e.target.value)}
          />
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors" 
            onClick={addMaterial}
          >
            📦 Add
          </button>
        </div>
      </div>

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

      <div className="border-t pt-2">
        <div className="text-xs text-gray-600 space-y-1">
          <div>Materials: {Object.values(gameState.materials || {}).reduce((a, b) => a + b, 0)}</div>
          <div>Items: {Object.values(gameState.inventory || {}).reduce((a, b) => a + b, 0)}</div>
          <div>Customers: {gameState.customers?.length || 0}</div>
        </div>
      </div>
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
