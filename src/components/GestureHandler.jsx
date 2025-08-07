import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import useGestures from '../hooks/useGestures';

// Wrapper component that wires up the gesture hook to its children
const GestureHandler = ({
  onSwipe,
  onLongPress,
  onPinch,
  onMultiTouch,
  children,
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  useGestures(ref, { onSwipe, onLongPress, onPinch, onMultiTouch });

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
};

GestureHandler.propTypes = {
  onSwipe: PropTypes.func,
  onLongPress: PropTypes.func,
  onPinch: PropTypes.func,
  onMultiTouch: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default GestureHandler;
