import { useMemo } from 'react';
import { MERCHANT_STALLS, MATERIALS } from '../constants';

const useMaterialStalls = (gameStateMaterials) => {
  const materialsByStall = useMemo(() => {
    const stalls = {};
    
    // Initialize each stall
    Object.keys(MERCHANT_STALLS).forEach(stallId => {
      stalls[stallId] = [];
    });

    // Group materials by stall
    Object.entries(gameStateMaterials).forEach(([materialId, count]) => {
      if (count <= 0) return;
      
      const material = MATERIALS[materialId];
      if (!material) return;

      // Find which stall this material belongs to
      const stallEntry = Object.entries(MERCHANT_STALLS).find(([_, stall]) => 
        stall.materialTypes.includes(material.type)
      );

      if (stallEntry) {
        const [stallId] = stallEntry;
        stalls[stallId].push({
          id: materialId,
          ...material,
          count
        });
      }
    });

    // Sort materials within each stall by rarity then name
    Object.keys(stalls).forEach(stallId => {
      stalls[stallId].sort((a, b) => {
        const rarityOrder = { rare: 3, uncommon: 2, common: 1 };
        const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name);
      });
    });

    return stalls;
  }, [gameStateMaterials]);

  const getStallMaterialCount = (stallId) => {
    return materialsByStall[stallId]?.reduce((sum, material) => sum + material.count, 0) || 0;
  };

  const getActiveStalls = () => {
    return Object.keys(MERCHANT_STALLS).filter(stallId => 
      materialsByStall[stallId]?.length > 0
    );
  };

  return {
    materialsByStall,
    getStallMaterialCount,
    getActiveStalls
  };
};

export default useMaterialStalls;
