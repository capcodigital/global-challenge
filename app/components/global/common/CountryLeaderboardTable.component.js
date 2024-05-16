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

const formatTime = (t) => (t < 10 ? "0" + t : t);

const formatCompletionDate = (compDate) => {
  const completionDate = new Date(compDate);

  return `${formatTime(completionDate.getHours())}:${formatTime(
    completionDate.getMinutes()
  )} ${completionDate.getDate()} ${monthNames[completionDate.getMonth()]}`;
};

const CountryLeaderboardTable = ({
  data,
  isMainDashboard,
  isLoading,
  activeTab,
}) => {
  const history = useHistory();

  const handleClick = (teamName) => {
    history.push(`/team/${teamName.toLowerCase().replace(/\s/g, "-")}`);
  };

  const challenge_name = process.env.CHALLENGE_NAME
    ? `${process.env.CHALLENGE_NAME}`
    : "global";

  return (
    <>
      <div className={"leaderboard-desktop-global"}>
        <Table collapsing basic="very" className="main">
          <Table.Header>
          <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell style={{width: '177px'}}>Country</Table.HeaderCell>
          <Table.HeaderCell style={{width: '161px'}}></Table.HeaderCell>
          <Table.HeaderCell>Total Distance</Table.HeaderCell>
          <Table.HeaderCell>Avg Distance</Table.HeaderCell>
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
                const {name, members, position, totalDistanceConverted} = item;
                const location = members[0].location
                return (
                  <Table.Row
                    key={name}
                    className={dateCompletion}
                    onClick={
                      isMainDashboard ? () => handleClick(name) : undefined
                    }
                  >
                    <Table.Cell className={"main position"}>
                      {position ? position : idx + 1}
                    </Table.Cell>
                    <Table.Cell>
                      {location}
                    </Table.Cell>
                    <Table.Cell>
                      <Avatar
                        name={location}
                        location={location}
                        activeTab={'office'}
                        color="#00AABB"
                        size={40}
                      />
                    </Table.Cell>
                      <Table.Cell>
                        {totalDistanceConverted}km
                      </Table.Cell>
                      <Table.Cell>
                        {totalDistanceConverted}km
                      </Table.Cell>
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
            let completionDate = item.completionDate ? "finish" : "pending";
            const {name, members, position, totalDistanceConverted} = item;
            const location = members[0].location
          return (
            <List.Item
              key={name}
              className="leaderboard-item"
              onClick={
                isMainDashboard ? () => handleClick(name) : undefined
              }
            >
              <span className={"position"}>
                {position ? position : idx + 1}
              </span>
              <span className={"avatar"}>
                <Avatar
                  name={location}
                  location={location}
                  activeTab={activeTab}
                  color={"#00AABB"}
                  size={40}
                />
              </span>
              <span>
                <div className={"date"}>
                  {completionDate
                    ? formatCompletionDate(completionDate)
                    : "Still to finish"}
                </div>
                {name}

                {isMainDashboard && (
                  <div className="distance">
                    {totalDistanceConverted
                      ? totalDistanceConverted.toFixed(2)
                      : totalDistanceConverted}
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

CountryLeaderboardTable.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  isMainDashboard: PropTypes.bool.isRequired,
};

CountryLeaderboardTable.defaultProps = {
  isLoading: false,
};

export default CountryLeaderboardTable;