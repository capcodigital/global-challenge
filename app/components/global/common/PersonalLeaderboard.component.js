import React from "react";
import { Table } from "semantic-ui-react";
import Avatar from "../../common/Avatar.component";

const PersonalLeaderboardTable = ({ data }) => (
  <div className={'personal-leaderboard-desktop-global'}>
    <Table collapsing basic="very" className="main">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Country</Table.HeaderCell>
          <Table.HeaderCell>City</Table.HeaderCell>
          <Table.HeaderCell>Distance</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body className="main-table">
        {data && data.map((player) => {
          const { position, location, name, totalDistance } = player;

          return (
            <Table.Row key={name}>
              <Table.Cell>{position}</Table.Cell>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>
                <Avatar
                  name={location}
                  location={location}
                  activeTab={'office'}
                  color="#00AABB"
                  size={40}
                />
              </Table.Cell>
              <Table.Cell>{location}</Table.Cell>
              <Table.Cell>{`${totalDistance} km`}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  </div>
);

export default PersonalLeaderboardTable;
