/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import PropTypes from "prop-types";
import { List, Image } from "semantic-ui-react";
import { FormattedNumber } from "react-intl";
import "./style.scss";

const ListView = ({ list, prefix, image, dataKey, className }) => (
  <div>
    <List animated divided className={className}>
      {list.map((item) => (
        <List.Item key={item.name}>
          {image ? (
            <Image avatar src={require(`images/${item.name}.png`)} />
          ) : (
            ""
          )}
          <List.Content>
            <List.Header>{item.name}</List.Header>
            <List.Description>
              {`${prefix} `}
              <b>
                <FormattedNumber value={dataKey ? item[dataKey] : item.steps} />
              </b>
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </div>
);
export const ResizableListView = ({ className, height }) => (
    <List
      animated
      divided
      className={className}
      style={{ height: height }}
    />
);

ListView.propTypes = {
  list: PropTypes.array.isRequired,
  dataKey: PropTypes.string,
  image: PropTypes.bool,
  prefix: PropTypes.string,
  className: PropTypes.string
};

ResizableListView.propTypes = {
  className: PropTypes.string,
  height: PropTypes.number,
};

export default ListView;
