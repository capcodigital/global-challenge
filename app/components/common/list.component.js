/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import PropTypes from "prop-types";
import { List, Image, Header, Table } from "semantic-ui-react";
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
  <List animated divided className={className} style={{ height: height }}>
    <Table basic="very" celled collapsing>
      <Table.Body>
        <Table.Row>
          <Table.Cell>1.</Table.Cell>
          <Table.Cell>140km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="140"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>2.</Table.Cell>
          <Table.Cell>110km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="110"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>3.</Table.Cell>
          <Table.Cell>70km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="70"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>4.</Table.Cell>
          <Table.Cell>60km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="60"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>5.</Table.Cell>
          <Table.Cell>50km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="50"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>6.</Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="40"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>6.</Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="40"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>6.</Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="40"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>6.</Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="40"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>6.</Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="40"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>6.</Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="40"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>6.</Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect
                width="40"
                height="16"
                fill={'lightgrey'}
                rx={8}
              />
            </svg>
          </Table.Cell>
        </Table.Row>
       
      </Table.Body>
    </Table>
  </List>
);

ListView.propTypes = {
  list: PropTypes.array.isRequired,
  dataKey: PropTypes.string,
  image: PropTypes.bool,
  prefix: PropTypes.string,
  className: PropTypes.string,
};

ResizableListView.propTypes = {
  className: PropTypes.string,
  height: PropTypes.number,
};

export default ListView;
