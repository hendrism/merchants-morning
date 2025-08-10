import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, RECIPES } from '../constants';

const Workshop = ({ gameState, canCraft, craftItem }) => {
  const [tab, setTab] = useState('weapon');
  const recipes = RECIPES.filter(r => r.type === tab);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {ITEM_TYPES.map(t => (
          <button
            key={t}
            className={`px-3 py-2 rounded-full flex items-center gap-1 min-w-[44px] ${tab === t ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab(t)}
          >
            <span>{ITEM_TYPE_ICONS[t]}</span>
            <span className="text-sm capitalize">{t}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {recipes.map(r => (
          <div key={r.id} className={`p-3 border rounded ${canCraft(r) ? 'bg-green-50 border-green-300' : 'bg-gray-100 border-gray-200 opacity-75'}`}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-medium text-sm">{r.name}</div>
                <div className="text-xs text-gray-500">{r.rarity}</div>
              </div>
              <button
                disabled={!canCraft(r)}
                onClick={() => craftItem(r.id)}
                className={`px-3 py-1 rounded text-sm min-h-[44px] ${canCraft(r) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
              >
                Craft
              </button>
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              {Object.entries(r.ingredients).map(([mat, cnt]) => (
                <span key={mat} className="px-1">{mat} x{cnt}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Workshop.propTypes = {
  gameState: PropTypes.object.isRequired,
  canCraft: PropTypes.func.isRequired,
  craftItem: PropTypes.func.isRequired,
};

export default Workshop;
