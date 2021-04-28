import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import Avatar from "./Avatar.component";
import "./style.scss";

const TeamLeaderboardTable = ({ height, teams }) => (
  <div style={{ height: height }} className={"leaderboard"}>
    <Table collapsing basic="very" className="main">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>Team Name</Table.HeaderCell>
          <Table.HeaderCell>Distance</Table.HeaderCell>
          <Table.HeaderCell>Finish Date</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {teams.map((team, index) => (
          <Table.Row key={team.name}>
            <Table.Cell className="main position">{index + 1}.</Table.Cell>
            <Table.Cell className="main">
              <Avatar teamName={team.name} color={"#fa451b"} size={40} />
            </Table.Cell>
            <Table.Cell className="main team-name">{team.name}</Table.Cell>
            <Table.Cell className="main distance">
              {team.totalDistance}
              km
            </Table.Cell>
            <Table.Cell
              className={`main ${
                team.completionDate ? "finish" : "pending"
              } date`}
            >
              {team.completionDate ? team.completionDate : "Still to finish"}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);

TeamLeaderboardTable.propTypes = {
  height: PropTypes.number,
  teams: PropTypes.array.isRequired,
};

export default TeamLeaderboardTable;
