/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { List, Image } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import './style.scss';

const TeamLeaderboard = ({
  list, prefix, image, dataKey, className, height
}) => (
  <div style={{ height: height }}>
    <List celled horizontal>
      <List.Item className="position">Pos</List.Item>
      <List.Item className="team">Team Name</List.Item>
      <List.Item className="distance">Distance</List.Item>
      <List.Item className="finish-date">Finish Date</List.Item>
    </List>
    <List animated divided className={className}>
      {list.map((item, index) => (
        <List.Item key={item.name}>
          <List.Content>
            <List celled horizontal>
              <List.Item className="position">{index + 1}.</List.Item>
              <List.Item className="team">{image ? 
                <Image avatar src={require(`images/${item.name}.png`)} />
                : ''} {item.name}</List.Item>
              <List.Item className="distance">
                <FormattedNumber value={item.distance} maximumFractionDigits={0} /> km
              </List.Item>
              <List.Item className="finish-date">???</List.Item>
            </List>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </div>
);

TeamLeaderboard.propTypes = {
  list: PropTypes.array.isRequired,
  dataKey: PropTypes.string,
  image: PropTypes.bool,
  prefix: PropTypes.string,
  className: PropTypes.string
};

export default TeamLeaderboard;
