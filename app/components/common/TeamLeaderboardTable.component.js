/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, List} from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import './style.scss';

const TeamLeaderboardTable = ({
  className, height, teams
}) => (
  <div>
    <List style={{ height: height }} className={className}>
      <Table celled collapsing basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Team Name</Table.HeaderCell>
            <Table.HeaderCell>Distance</Table.HeaderCell>
            <Table.HeaderCell>Finish Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {teams.map((item, index) => (
            <Table.Row key={item.name}>
              <Table.Cell className="position">{index + 1}.</Table.Cell>
              <Table.Cell className="team">
                {item.name}
              </Table.Cell>
              <Table.Cell className="distance">
                <FormattedNumber value={item.totalDistance} maximumFractionDigits={0}/> km
              </Table.Cell>
              <Table.Cell className="finish-date">
                {item.completionDate ? item.completionDate: 'Still to finish'} 
                </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </List>
  </div>
);

TeamLeaderboardTable.propTypes = {
  teams: PropTypes.array.isRequired,
  dataKey: PropTypes.string,
  image: PropTypes.bool,
  prefix: PropTypes.string,
  className: PropTypes.string
};

export default TeamLeaderboardTable;
