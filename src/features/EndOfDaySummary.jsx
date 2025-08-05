import React from 'react';
import PropTypes from 'prop-types';
import { Star } from 'lucide-react';

const EndOfDaySummary = ({ gameState }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Star className="w-5 h-5" />
      Day {gameState.day} Complete!
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg text-center">
        <h3 className="font-bold text-green-800 dark:text-green-200 text-sm">Today's Earnings</h3>
        <p className="text-lg font-bold text-green-600 dark:text-green-200">
          {gameState.customers.reduce((total, c) => total + (c.payment || 0), 0)} Gold
        </p>
      </div>

      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-center">
        <h3 className="font-bold text-blue-800 dark:text-blue-200 text-sm">Customers Served</h3>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-200">
          {gameState.customers.filter(c => c.satisfied).length} / {gameState.customers.length}
        </p>
      </div>
    </div>

  </div>
);

EndOfDaySummary.propTypes = {
  gameState: PropTypes.shape({
    day: PropTypes.number.isRequired,
    customers: PropTypes.arrayOf(
      PropTypes.shape({
        payment: PropTypes.number,
        satisfied: PropTypes.bool,
      })
    ).isRequired,
  }).isRequired,
};

export default EndOfDaySummary;
