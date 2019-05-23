/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { List, Image } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import './style.scss';

const ListView = ({
  list, prefix, image
}) => (
  <div>
    <List animated divided>
      {list.map((item) => (
        <List.Item key={item.name}>
          {image
            ? <Image avatar src={require(`images/${item.name}.png`)} />
            : ''}
          <List.Content>
            <List.Header>{item.name}</List.Header>
            <List.Description>
              {`${prefix} `}
              <b><FormattedNumber value={item.steps} /></b>
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </div>
);

ListView.propTypes = {
  list: PropTypes.array.isRequired,
  image: PropTypes.bool,
  prefix: PropTypes.string
};

export default ListView;
