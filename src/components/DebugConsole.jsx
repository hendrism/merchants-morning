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
    <div className="fixed bottom-32 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72 z-50 text-sm space-y-3">
      <h2 className="font-bold mb-2">Debug Console</h2>
      <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded p-1" onClick={resetGame}>
        Reset Game
      </button>
      <button className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded p-1" onClick={toggleDarkMode}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          className="border p-1 flex-1"
          placeholder="Gold"
          value={goldAmount}
          onChange={e => setGoldAmount(e.target.value)}
        />
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded" onClick={addGold}>
          Add
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <select
          className="border p-1 flex-1"
          value={materialId}
          onChange={e => setMaterialId(e.target.value)}
        >
          {Object.entries(MATERIALS).map(([id, m]) => (
            <option key={id} value={id}>
              {m.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="border p-1 w-16"
          value={materialAmount}
          onChange={e => setMaterialAmount(e.target.value)}
        />
        <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded" onClick={addMaterial}>
          Add
        </button>
      </div>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded p-1" onClick={openShop}>
        Open Shop
      </button>
      <button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded p-1" onClick={simulateSale}>
        Simulate Sale
      </button>
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
