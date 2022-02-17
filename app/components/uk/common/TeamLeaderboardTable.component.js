import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Table, List } from "semantic-ui-react";
import Avatar from "../../common/Avatar.component";
import "./style.scss";

const orange = "#fa451b";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const formatCompletionDate = (compDate) => {
  const completionDate = new Date(compDate);

  return `${completionDate.getHours()}:${completionDate.getMinutes()} ${completionDate.getDate()} ${
    monthNames[completionDate.getMonth()]
  }`;
};

const TeamLeaderboardTable = ({ data, isMainDashboard, isLoading }) => {
  const history = useHistory();

  const handleClick = (teamName) => {
    history.push(`/team/${teamName.toLowerCase().replace(/\s/g, "-")}`);
  };

  return (
    <>
      <div className={"leaderboard-desktop"}>
        <Table collapsing basic="very" className="main">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>
                {isMainDashboard ? "Team" : "Member"}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {isMainDashboard ? "Finish Date" : "Distance"}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {isLoading ? (
            <Table.Body className={isMainDashboard ? "main-table loading" : ""}>
              {_.times(8, () => (
                <Table.Row>
                  <Table.Cell className={"loading"}></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          ) : (
            <Table.Body className={isMainDashboard ? "main-table" : ""}>
              {data.map((item, idx) => {
                let dateCompletion = item.completionDate ? "finish" : "pending";
                return (
                  <Table.Row
                    key={item.name}
                    className={dateCompletion}
                    onClick={
                      isMainDashboard ? () => handleClick(item.name) : undefined
                    }
                  >
                    <Table.Cell className={"main position"}>
                      {item.position ? item.position : idx + 1}
                    </Table.Cell>
                    <Table.Cell className={"main avatar"}>
                      <Avatar name={item.name} color={orange} size={40} />
                    </Table.Cell>
                    <Table.Cell
                      className={`main team-name ${!isMainDashboard && "team"}`}
                    >
                      {item.name}

                      {isMainDashboard && (
                        <div className="distance">
                          {item.totalDistanceConverted.toFixed(2)}
                          km
                        </div>
                      )}
                    </Table.Cell>
                    {isMainDashboard ? (
                      <Table.Cell className={`main date ${dateCompletion}`}>
                        {item.completionDate
                          ? formatCompletionDate(item.completionDate)
                          : "Still to finish"}
                      </Table.Cell>
                    ) : (
                      <Table.Cell className={`main distance`}>
                        {item.totalDistanceConverted.toFixed(2)}km
                      </Table.Cell>
                    )}
                  </Table.Row>
                );
              })}
            </Table.Body>
          )}
        </Table>
      </div>
      <List className="leaderboard-mobile">
        <List.Item className="leaderboard-header">
          <span>#</span> {isMainDashboard ? "TEAM" : "MEMBER"}
        </List.Item>

        {data.map((item, idx) => {
          return (
            <List.Item
              key={item.name}
              className="leaderboard-item"
              onClick={
                isMainDashboard ? () => handleClick(item.name) : undefined
              }
            >
              <span className={"position"}>
                {item.position ? item.position : idx + 1}
              </span>
              <span className={"avatar"}>
                <Avatar name={item.name} color={orange} size={40} />
              </span>
              <span>
                <div className={"date"}>
                  {item.completionDate
                    ? formatCompletionDate(item.completionDate)
                    : "Still to finish"}
                </div>
                {item.name}

                {isMainDashboard && (
                  <div className="distance">
                    {item.totalDistanceConverted.toFixed(2)}
                    km
                  </div>
                )}
              </span>
            </List.Item>
          );
        })}
      </List>
    </>
  );
};

TeamLeaderboardTable.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  isMainDashboard: PropTypes.bool.isRequired,
};

TeamLeaderboardTable.defaultProps = {
  isLoading: false,
};

export default TeamLeaderboardTable;
