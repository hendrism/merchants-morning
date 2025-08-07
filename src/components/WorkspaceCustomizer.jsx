import React from 'react';
import PropTypes from 'prop-types';

// Interface for customizing layout and preferences
const WorkspaceCustomizer = ({
  currentLayout,
  availablePresets = {},
  onLayoutChange,
  onPresetSelect,
  className = '',
}) => {
  const handlePreset = (key) => {
    if (onPresetSelect) onPresetSelect(key);
  };

  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-2">Workspace</h2>
      <div className="mb-4">
        <h3 className="font-medium mb-1">Presets</h3>
        <ul className="space-y-1">
          {Object.entries(availablePresets).map(([key, preset]) => (
            <li key={key}>
              <button
                type="button"
                className="px-2 py-1 bg-gray-100 rounded w-full text-left hover:bg-gray-200"
                onClick={() => handlePreset(key)}
              >
                {key} - {preset.description || ''}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {onLayoutChange && (
        <div>
          <h3 className="font-medium mb-1">Layout JSON</h3>
          <textarea
            className="w-full border p-2 rounded"
            rows={6}
            defaultValue={JSON.stringify(currentLayout || {}, null, 2)}
            onBlur={(e) => {
              try {
                const val = JSON.parse(e.target.value || '{}');
                onLayoutChange(val);
              } catch {
                // ignore parse errors
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

WorkspaceCustomizer.propTypes = {
  currentLayout: PropTypes.object,
  availablePresets: PropTypes.object,
  onLayoutChange: PropTypes.func,
  onPresetSelect: PropTypes.func,
  className: PropTypes.string,
};

export default WorkspaceCustomizer;
