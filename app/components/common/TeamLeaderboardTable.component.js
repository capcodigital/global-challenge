/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import PropTypes from "prop-types";
import { Table, List } from "semantic-ui-react";
import { FormattedNumber } from "react-intl";
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
      <Table collapsing basic="very" className='main'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
            <Table.HeaderCell>Team Name</Table.HeaderCell>
            <Table.HeaderCell>Distance</Table.HeaderCell>
            <Table.HeaderCell>Finish Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {teams.map((team, index) => (
            <Table.Row key={team.name} >
              <Table.Cell className='main position'>
                {index + 1}.
                
              </Table.Cell>
              <Table.Cell className='main'>
                <svg className="avatar" width={40} height={40}>
                  <circle fill={"rgb(250,69,27)"} cx="20" cy="20" r="20" />
                  <text
                    textAnchor="middle"
                    x="20"
                    y="25"
                    fill="white"
                    fontSize="15"
                    fontFamily="Helvetica"
                  >
                    {getInitials(team.name)}
                  </text>
                </svg>
              </Table.Cell >
              <Table.Cell className="team-name main">{team.name}</Table.Cell>
              <Table.Cell  className='main'>
                {team.totalDistance}
                km
              </Table.Cell>
              <Table.Cell
                className={`main ${team.completionDate ? "finish" : "pending"} date`}
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
