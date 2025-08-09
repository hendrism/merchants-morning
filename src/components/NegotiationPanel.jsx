import React from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const NegotiationPanel = ({ customer, item, onAccept, onDecline, onBack }) => (
  <div className="negotiation-panel">
    <div className="negotiation-header">
      <h4>Trade Negotiation with {customer.name}</h4>
    </div>
    <div className="trade-offer">
      <div className="offer-section">
        <span className="offer-label">Gold Offered:</span>
        <span className="offer-amount">{customer.maxBudget}g</span>
      </div>
      <div className="materials-section">
        <span className="materials-label">Plus Materials:</span>
        <div className="materials-list">
          {customer.materials.map((m, i) => (
            <div key={i} className="material-offer">
              <span className="material-icon">{MATERIALS[m.id].icon}</span>
              <span className="material-name">{MATERIALS[m.id].name}</span>
              <span className="material-value">(~{m.value}g)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="negotiation-actions">
      <button className="accept-btn btn-primary" onClick={onAccept}>Accept Deal</button>
      <button className="decline-btn btn-danger" onClick={onDecline}>Decline</button>
      <button className="back-btn btn-secondary" onClick={onBack}>Back</button>
    </div>
  </div>
);

NegotiationPanel.propTypes = {
  customer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    maxBudget: PropTypes.number.isRequired,
    materials: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  item: PropTypes.object,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NegotiationPanel;
