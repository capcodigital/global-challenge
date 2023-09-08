import React from "react";
import PropTypes from "prop-types";
import { Table, Popup, List } from "semantic-ui-react";
import Avatar from "../../common/Avatar.component";
import "./style.scss";
import { FixedSizeList } from "react-window";

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
  activity,
  activityPosition,
}) => {
  const leaderBoardFilteredData = data.map((team) => ({
      name: team.name,
      distance: team.activities[activity],
      position: team.activities[activityPosition],
    }));

  let sortedData = leaderBoardFilteredData.sort((a, b) => {
    if (b.position) {
      return a.position - b.position;
    } else {
      return b.distance - a.distance;
    }
  });

  let maxDistance = Math.max(...leaderBoardFilteredData.map((item) => item.distance));

  const challenge_name = process.env.CHALLENGE_NAME
    ? `${process.env.CHALLENGE_NAME}`
    : "global";

  const popRowsDesktop = (data) => {
    return ({ index, style }) => {
      const item = data[index]

      return (
        <div style={style}>
          <Popup
            key={item.name}
            content={popUpContent(item)}
            position="top center"
            style={popupStyle}
            trigger={
              <Table.Row>
                <Table.Cell className="sports-position">
                  {item.position ? item.position : index + 1}
                </Table.Cell>
                <Table.Cell>
                  <Avatar name={item.name} location={item.location} color={'#FDC437'} size={30} />
                </Table.Cell>
                <Table.Cell className="distance">
                  {item.distance.toFixed(2)}km
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
        </div>
      )
    };
  };

  const popRowsMobile = (data) => {
    return ({ index, style }) => {
      const item = data[index]

      return (
        <div style={style}>
          <Popup
            key={item.name}
            content={popUpContent(item)}
            position="top center"
            style={popupStyle}
            trigger={
              <List.Item>
                <span className="sports-position">
                  {item.position ? item.position : index + 1}
                </span>
                <span>
                  <Avatar name={item.name} location={item.location} color={'#FDC437'} size={30} />
                </span>
                <span className="distance">{item.distance.toFixed(2)}km</span>
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
        </div>
      )
    };
  };

  const popUpContent = (item) => {
    return (
      <div>
        <div>{item.name}</div>
        {showActualDistance && (
          <div>Actual distance: {item.actualDistance.toFixed(2)}km</div>
        )}
      </div>
    )
  };

  return (
    <>
      <div className="sports-desktop">
        <div
          className={"leaderboard-desktop-global sports sports-desktop"}
          style={{ height: height }}
        >
          <Table basic="very" collapsing>
            <Table.Body>
              <FixedSizeList
              height={500}
              width={700}
              itemCount={sortedData.length}
              itemSize={50}
              >
                {popRowsDesktop(sortedData)}
              </FixedSizeList>
            </Table.Body>
          </Table>
        </div>
      </div>
      <FixedSizeList
        className="sports-mobile"
        height={height}
        width={500}
        itemCount={sortedData.length}
        itemSize={50}
      >
        {popRowsMobile(sortedData)}
      </FixedSizeList>
    </>
  );
};

TeamSportsLeaderboardTable.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number,
  showActualDistance: PropTypes.bool,
  activity: PropTypes.string,
  position: PropTypes.string,
};

export default TeamSportsLeaderboardTable;
