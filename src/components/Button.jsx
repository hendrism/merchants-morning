import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ className = '', children, ...props }) => (
  <button
    className={`transition transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
