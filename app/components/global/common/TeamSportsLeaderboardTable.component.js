import React from "react";
import PropTypes from "prop-types";
import { Table, Popup, List } from "semantic-ui-react";
import Avatar from "../../common/Avatar.component";
import "./style.scss";

const grey = "#a7a7a7";

const svgBarWidth = 200;

const popupStyle = {
  marginBottom: "-1rem",
  borderRadius: "4px",
  opacity: 0.9,
  padding: "1em",
};

const TeamSportsLeaderboardTable = ({
  data,
  height,
  showActualDistance = false,
}) => {
  let sortedData = data.sort((a, b) => {
    if (b.position) {
      return a.position - b.position;
    } else {
      return b.distance - a.distance;
    }
  });
  let maxDistance = Math.max(...data.map((item) => item.distance));

  const challenge_name = process.env.CHALLENGE_NAME
    ? `${process.env.CHALLENGE_NAME}`
    : "global";

  return (
    <>
      <div className="sports-desktop">
        <div
          className={"leaderboard-desktop-global sports sports-desktop"}
          style={{ height: height }}
        >
          <Table basic="very" collapsing>
            <Table.Body>
              {sortedData.map((item, idx) => (
                <Popup
                  key={item.name}
                  content={
                    <div>
                      <div>{item.name}</div>
                      {showActualDistance && (
                        <div>Actual distance: {item.actualDistance ? item.actualDistance.toFixed(2) : item.actualDistance}km</div>
                      )}
                    </div>
                  }
                  position="top center"
                  style={popupStyle}
                  trigger={
                    <Table.Row>
                      <Table.Cell className="sports-position">
                        {item.position ? item.position : idx + 1}
                      </Table.Cell>
                      <Table.Cell>
                        <Avatar name={item.name} color={'#FDC437'} size={30} />
                      </Table.Cell>
                      <Table.Cell className="distance">
                        {item.distance ? item.distance.toFixed(2) : item.distance}km
                      </Table.Cell>
                      <Table.Cell>
                        <svg
                          width={svgBarWidth + 10}
                          height="16"
                          viewBox="0 0 210 16"
                          fill="#00AABB"
                        >
                          <rect
                            width={
                              (svgBarWidth * (item.distance ? item.distance : 0)) / maxDistance + 10
                            } // 10px minimum width
                            height="16"
                            fill={"#00AABB"}
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
      </div>
      <List className="sports-mobile" style={{ height: height }}>
        {sortedData.map((item, idx) => (
          <Popup
            key={item.name}
            content={
              <div>
                <div>{item.name}</div>
                {showActualDistance && (
                  <div>Actual distance: {item.actualDistance ? item.actualDistance.toFixed(2) : item.actualDistance}km</div>
                )}
              </div>
            }
            position="top center"
            style={popupStyle}
            trigger={
              <List.Item>
                <span className="sports-position">
                  {item.position ? item.position : idx + 1}
                </span>
                <span>
                  <Avatar name={item.name} color={'#FDC437'} size={30} />
                </span>
                <span className="distance">{item.distance ? item.distance.toFixed(2) : item.distance}km</span>
                <span>
                  <svg width={180} height="16" viewBox="0 0 210 16">
                    <rect
                      width={(svgBarWidth * (item.distance ? item.distance : 0)) / maxDistance + 10} // 10px minimum width
                      height="16"
                      fill={"#00AABB"}
                      rx={8}
                    />
                  </svg>
                </span>
              </List.Item>
            }
          />
        ))}
      </List>
    </>
  );
};

TeamSportsLeaderboardTable.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number,
  showActualDistance: PropTypes.bool,
};

export default TeamSportsLeaderboardTable;
