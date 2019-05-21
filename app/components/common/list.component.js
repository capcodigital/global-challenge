import React from 'react';
import PropTypes from 'prop-types';
import { List, Image } from 'semantic-ui-react';
import './style.scss';

const ListView = ({ list, prefix }) => (
  <div>
    <List animated divided>
      {
        list.map((item) => (
          <List.Item key={item.name}>
            <Image avatar src="https://react.semantic-ui.com/images/avatar/small/rachel.png" />
            <List.Content>
              <List.Header>{item.name}</List.Header>
              <List.Description>
                {`${prefix} `}
                <b>{`${item.steps} `}</b>
              </List.Description>
            </List.Content>
          </List.Item>
        ))
      }
    </List>
  </div>
);

ListView.propTypes = {
  list: PropTypes.array.isRequired,
  prefix: PropTypes.string
};

export default ListView;
