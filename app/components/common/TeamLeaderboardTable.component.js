import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import Avatar from "./Avatar.component";
import "./style.scss";

const orange = "#fa451b";
const blue = "#11A9B2";

const TeamLeaderboardTable = ({ data, isMainDashboard, isLoading }) => {
  const history = useHistory();

  const handleClick = (teamName) => {
    history.push(
      `/team/${teamName.toLowerCase().replace(/\s/g, "-")}`
    );
  };

  return (
    <div className={"leaderboard"}>
      <Table collapsing basic="very" className="main">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>
              {isMainDashboard ? "Team Name" : "Member Name"}
            </Table.HeaderCell>
            <Table.HeaderCell>Distance</Table.HeaderCell>
            {isMainDashboard && (
              <Table.HeaderCell>Finish Date</Table.HeaderCell>
            )}
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
                    {item.position ? item.position : idx + 1}.
                  </Table.Cell>
                  <Table.Cell className={"main avatar"}>
                    <Avatar
                      name={item.name}
                      color={isMainDashboard ? orange : blue}
                      size={40}
                    />
                  </Table.Cell>
                  <Table.Cell
                    className={`main team-name ${!isMainDashboard && "team"}`}
                  >
                    {item.name}
                  </Table.Cell>
                  <Table.Cell
                    className={`main distance ${
                      !isMainDashboard && "team-view"
                    }`}
                  >
                    {isMainDashboard ? item.totalDistanceConverted : item.totalDistance}
                    km
                  </Table.Cell>
                  {isMainDashboard && (
                    <Table.Cell className={`main date ${dateCompletion}`}>
                      {item.completionDate
                        ? item.completionDate
                        : "Still to finish"}
                    </Table.Cell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        )}
      </Table>
    </div>
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
