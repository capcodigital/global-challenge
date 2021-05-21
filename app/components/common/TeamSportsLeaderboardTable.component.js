import React from "react";
import PropTypes from "prop-types";
import { Table, Popup } from "semantic-ui-react";
import Avatar from "./Avatar.component";
import "./style.scss";

const grey = "#a7a7a7";

const svgBarWidth = 100;

const popupStyle = {
  marginBottom: "-1rem",
  borderRadius: "8px",
  opacity: 0.9,
  padding: "1em",
};

const TeamSportsLeaderboardTable = ({ data, height }) => {
  let sortedData = data.sort((a, b) => {
    if (b.position) {
      return a.position - b.position;
    } else a.distance - b.distance;
  });
  let maxDistance = Math.max(...data.map((item) => item.distance));

  return (
    <div className={"leaderboard sports"} style={{ height: height }}>
      <Table basic="very" collapsing>
        <Table.Body>
          {sortedData.map((item, idx) => (
            <Popup
              key={item.name}
              content={item.name}
              position="top center"
              style={popupStyle}
              trigger={
                <Table.Row>
                  <Table.Cell>
                    {item.position ? item.position : idx + 1}.
                  </Table.Cell>
                  <Table.Cell>
                    <Avatar name={item.name} color={grey} size={30} />
                  </Table.Cell>
                  <Table.Cell className="distance">
                    {item.distance}km
                  </Table.Cell>
                  <Table.Cell>
                    <svg width={svgBarWidth + 10} height="16">
                      <rect
                        width={(svgBarWidth * item.distance) / maxDistance + 10} // 10px minimum width
                        height="16"
                        fill={"#e6e6eb"}
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
  data: PropTypes.array.isRequired,
  height: PropTypes.number,
};

export default TeamSportsLeaderboardTable;
