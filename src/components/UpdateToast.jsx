import React, { useEffect, useState } from 'react';

const UpdateToast = () => {
  const [reg, setReg] = useState(null);

  useEffect(() => {
    function onUpdate(e) {
      setReg(e.detail.reg);
    }
    window.addEventListener('pwa-update-available', onUpdate);
    return () => window.removeEventListener('pwa-update-available', onUpdate);
  }, []);

  const applyUpdate = () => {
    if (reg && reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  if (!reg) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center space-x-2 z-50">
      <span>Update available</span>
      <button
        onClick={applyUpdate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
      >
        Update
      </button>
    </div>
  );
};

export default UpdateToast;
