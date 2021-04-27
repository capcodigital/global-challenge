/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import PropTypes from "prop-types";
import { List, Table } from "semantic-ui-react";
import "./style.scss";

const svgBarWidth = 120;
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
const TeamSportsLeaderboardTable = ({ teams, className, height }) => {
  let data = teams.sort((a, b) => b.distance - a.distance);
  let maxDistance = Math.max(...teams.map((team) => team.distance));

  return (
    <List animated divided className={className} style={{ height: height }}>
      <Table basic="very" celled collapsing>
        <Table.Body>
          {data.map((team, idx) => (
            <Table.Row key={team.name}>
              <Table.Cell>
                {idx + 1}.
                <svg className="avatar" width={30} height={30}>
                  <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
                  <text
                    textAnchor="middle"
                    x="15"
                    y="20"
                    fill="white"
                    fontSize="15"
                    fontFamily="Helvetica"
                  >
                    {getInitials(team.name)}
                  </text>
                </svg>
              </Table.Cell>
              <Table.Cell>{team.distance}km</Table.Cell>
              <Table.Cell>
                <svg width={svgBarWidth+10} height="16">
                  <rect
                    width={(svgBarWidth * team.distance) / maxDistance + 10} // 10px minimum width
                    height="16"
                    fill={"lightgrey"}
                    rx={8}
                  />
                </svg>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </List>
  );
};

TeamSportsLeaderboardTable.propTypes = {
  teams: PropTypes.array.isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
};

export default TeamSportsLeaderboardTable;
