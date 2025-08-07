import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent } from './Card';

// Intelligent card wrapper with animations and context awareness
const SmartCard = ({
  id,
  title,
  icon,
  children,
  expanded,
  onToggle,
  gameState,
  autoExpand = false,
  priority = 0,
}) => {
  const [contentVisible, setContentVisible] = useState(expanded);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (autoExpand && !expanded) {
      onToggle(true);
    }
  }, [autoExpand, expanded, onToggle]);

  useEffect(() => {
    if (expanded) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setContentVisible(true);
        setAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [expanded]);

  const handleToggle = () => {
    onToggle(!expanded);
  };

  return (
    <div
      id={`card-${id}`}
      className={`card ${animating ? (expanded ? 'expanding' : 'collapsing') : ''}`}
      data-priority={priority}
    >
      <Card>
        <CardHeader icon={icon} title={title} expanded={expanded} onToggle={handleToggle} />
        {expanded && (
          <CardContent className={`card-content ${contentVisible ? 'visible' : ''}`}>{children}</CardContent>
        )}
      </Card>
    </div>
  );
};

SmartCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  gameState: PropTypes.object,
  autoExpand: PropTypes.bool,
  priority: PropTypes.number,
};

export default SmartCard;

