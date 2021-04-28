import React from "react";
import PropTypes from "prop-types";
import { Table, Popup } from "semantic-ui-react";
import Avatar from "./Avatar.component";
import "./style.scss";

const svgBarWidth = 100;
const popupStyle = {
  marginBottom:'-1rem',
  borderRadius: '8px',
  opacity: 0.9,
  padding: "1em",
};
const TeamSportsLeaderboardTable = ({ teams, height }) => {
  let sortedTeams = teams.sort((a, b) => b.distance - a.distance);
  let maxDistance = Math.max(...teams.map((team) => team.distance));

  return (
    <div className={"leaderboard sports"} style={{ height: height }}>
      <Table basic="very" collapsing>
        <Table.Body>
          {sortedTeams.map((team, idx) => (
            <Popup
              content={team.name}
              position="top center"
              style={popupStyle}
              trigger={
                <Table.Row key={team.name}>
                  <Table.Cell>{idx + 1}. </Table.Cell>
                  <Table.Cell>
                    <Avatar teamName={team.name} color={"#a7a7a7"} size={30} />
                  </Table.Cell>
                  <Table.Cell className="distance">
                    {team.distance}km
                  </Table.Cell>
                  <Table.Cell>
                    <svg width={svgBarWidth + 10} height="16">
                      <rect
                        width={(svgBarWidth * team.distance) / maxDistance + 10} // 10px minimum width
                        height="16"
                        fill={"lightgrey"}
                        rx={8}
                      />
                    </svg>
                  </Table.Cell>
                </Table.Row>
              }
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

TeamSportsLeaderboardTable.propTypes = {
  teams: PropTypes.array.isRequired,
  height: PropTypes.number,
};

export default TeamSportsLeaderboardTable;
