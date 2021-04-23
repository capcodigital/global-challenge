/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Table, List} from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import './style.scss';

const TeamLeaderboardTable = ({
  data, prefix, image, dataKey, className, height, teams
}) => (
  <div>
    <List style={{ height: height }} className={className}>
      <Table celled collapsing basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Position</Table.HeaderCell>
            <Table.HeaderCell>Team Name</Table.HeaderCell>
            <Table.HeaderCell>Distance</Table.HeaderCell>
            <Table.HeaderCell>Finish Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body divided>
          {teams.map((item, index) => (
            <Table.Row key={item.name}>
              <Table.Cell className="position">{index + 1}.</Table.Cell>
              <Table.Cell className="team">
                {/* {image ? <Image avatar src={require(`images/${item.name}.png`)} />
                : ''}  */}
                {item.name}
              </Table.Cell>
              <Table.Cell className="distance">
                <FormattedNumber value={item.totalDistance} maximumFractionDigits={0}/> km
              </Table.Cell>
              <Table.Cell className="finish-date">----</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </List>
  </div>
);

TeamLeaderboardTable.propTypes = {
  data: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  dataKey: PropTypes.string,
  image: PropTypes.bool,
  prefix: PropTypes.string,
  className: PropTypes.string
};

export default TeamLeaderboardTable;
