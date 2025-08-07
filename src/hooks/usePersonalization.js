import { useEffect, useState } from 'react';

// Hook responsible for analysing behaviour and producing personalised UI data
const usePersonalization = (userId, behaviorData = []) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!behaviorData) return;
    // Very light-weight placeholder analysis
    const commonActions = behaviorData.slice(-20).map((a) => a.action);
    setProfile({
      cardDefaults: {},
      quickShortcuts: commonActions.slice(0, 3),
      informationDensity: 'medium',
      cardPriority: [],
      advancedFeatures: true,
      workflowSuggestions: [],
      userId,
    });
  }, [userId, behaviorData]);

  const reset = () => setProfile(null);

  return { profile, reset };
};

export default usePersonalization;
