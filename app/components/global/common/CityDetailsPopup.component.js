import React from 'react';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './style.scss';

function CityDetailsPopup({
  coordinates,
  colorFill,
  projection,
  circleRadius = 4,
  circleOpacity = 0.8,
  shouldDisplay = false,
  city = {},
  cityData = {},
  cityRanking,
}) {
  const trigger = () => (
    <g>
      <circle
        cx={projection()(coordinates)?.[0]}
        cy={projection()(coordinates)?.[1]}
        r={circleRadius}
        fill={colorFill}
        opacity={circleOpacity}
        pointerEvents="none"
      />
      <circle
        cx={projection()(coordinates)?.[0]}
        cy={projection()(coordinates)?.[1]}
        r={circleRadius * 1.5}
        pointerEvents="all"
        fill="transparent"
      />
    </g>
  );

  const content = () => (
    <div className="city-popup-content">
      <img
        src={city?.img || ''}
        alt={`${city.name} location`}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <section>
        <h3>{city.name || ''}</h3>
        <ul>
          <li>Office ranking: {cityRanking || 'N/A'}</li>
          <li>Top scorer: {cityData.memberTopScorer?.name || 'N/A'}</li>
          <li>Registered users: {cityData.members?.length || 0}</li>
        </ul>
      </section>
    </div>
  );

  return (
    <Popup
      trigger={trigger()}
      content={content()}
      basic
      disabled={!shouldDisplay}
      className="city-popup-content"
    />
  );
}

export default CityDetailsPopup;

CityDetailsPopup.propTypes = {
  coordinates: PropTypes.array,
  colorFill: PropTypes.string,
  projection: PropTypes.func,
  circleRadius: PropTypes.number,
  circleOpacity: PropTypes.number,
  shouldDisplay: PropTypes.bool,
  city: PropTypes.object,
  cityData: PropTypes.object,
  cityRanking: PropTypes.number,
};
