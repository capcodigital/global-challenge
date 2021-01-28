/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { List, Image } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import './style.scss';

const ListView = ({
  list, suffix, image, dataKey, className
}) => (
  <div>
    <List animated divided className={className}>
      {list.map((item) => (
        <List.Item key={item.name}>
          {image
            ? <Image avatar src={require(`images/${item.name}.png`)} />
            : ''}
          <List.Content>
            <List.Header>{item.name}</List.Header>
            <List.Description>
              <b><FormattedNumber value={dataKey ? item[dataKey] : item.distance} /></b>
              {`${suffix} `}
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </div>
);

ListView.propTypes = {
  list: PropTypes.array.isRequired,
  dataKey: PropTypes.string,
  image: PropTypes.bool,
  suffix: PropTypes.string,
  className: PropTypes.string
};

export default ListView;
