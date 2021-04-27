/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import PropTypes from "prop-types";
import { Table, List } from "semantic-ui-react";
import Avatar from "./Avatar.component";
import "./style.scss";

const getInitials = (name) => {
  let temp = name
    .replace(/\bthe\b|\band\b/gi, "")
    .split(" ")
    .filter((e) => e);

  if (temp.length === 1) return temp[0].charAt(0).toUpperCase();
  else
    return `${
      temp[0].charAt(0) + temp[temp.length - 1].charAt(0)
    }`.toUpperCase();
};
const TeamLeaderboardTable = ({ height, teams }) => (
  <div>
    <List style={{ height: height }} className={"leaderboard"}>
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
                <Avatar teamName={team.name} color={"rgb(250,69,27)"} size={40}/>
              </Table.Cell>
              <Table.Cell className="main team-name ">{team.name}</Table.Cell>
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
    </List>
  </div>
);

TeamLeaderboardTable.propTypes = {
  teams: PropTypes.array.isRequired,
  height: PropTypes.number,
};

export default TeamLeaderboardTable;
