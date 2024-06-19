import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes, { number } from "prop-types";
import { Table, List } from "semantic-ui-react";
import Avatar from "../../common/Avatar.component";
import { allNewCities } from "../dashboard/constants";
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

const capitalize = (str) => str[0].toUpperCase() + str.slice(1)

const CountryLeaderboardTable = ({
  data,
  isMainDashboard,
  isLoading,
  activeTab,
  userData,
}) => {
  const history = useHistory();

  const handleClick = (teamName) => {
    history.push(`/team/${teamName.toLowerCase().replace(/\s/g, "-")}`);
  };

  const challenge_name = process.env.CHALLENGE_NAME
    ? `${process.env.CHALLENGE_NAME}`
    : "global";

  const userCountryData = userData.map((data) => {
      // check if the id in orderArray exist
      if (allNewCities.some((sort) => sort.name === data.location)) {
         data.country = allNewCities.find((sort) => sort.name === data.location).country;
         return data;
      } else {
         //if not just return the object without order
         return data;
      }
   });

  const allLocations = userCountryData.map(({country}) => country)
  const numberOfUsers = { }

  for (let ele of allLocations) {
    if (numberOfUsers[ele]) {
      numberOfUsers[ele] += 1
    } else {
      numberOfUsers[ele] = 1
    }
  }

  const usersByLocation = Object.keys(numberOfUsers).reduce((acc, key) => {
    acc.push({ country: key, number: numberOfUsers[key]})
    return acc
  }, [])

  function averageDistance(distance, arr, location) {
    let startDistance = 0
    arr.forEach(({country, number}) => {
      if (country === location) {
      const avgDistance = distance ? distance/number : 0
      const formattedDistance = Math.round(avgDistance * 100) / 100
      startDistance = formattedDistance
      }
    })
    return startDistance
  }

  return (
    <>
      <div className={"leaderboard-desktop-global"}>
        <Table collapsing basic="very" className="main">
          <Table.Header>
          <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell style={{width: '177px'}}>{capitalize(activeTab)}</Table.HeaderCell>
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
            <Table.Body className="main-table">
              {data.map((item, idx) => {
                let dateCompletion = item.completionDate ? "finish" : "pending";
                const {name, members, position, totalDistanceCovered} = item;
                const location = name;
                return (
                  <Table.Row
                    key={name}
                    className={dateCompletion}
                    // onClick={
                    //   isMainDashboard ? () => handleClick(name) : undefined
                    // }
                  >
                    <Table.Cell className={"main position"}>
                      {position ? position : idx + 1}
                    </Table.Cell>
                    <Table.Cell>{location}</Table.Cell>
                    <Table.Cell>
                      <Avatar
                        name={location}
                        location={location}
                        activeTab={"office"}
                        color="#00AABB"
                        size={40}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {totalDistanceCovered ? totalDistanceCovered : 0}km
                    </Table.Cell>
                    <Table.Cell>
                      {averageDistance(totalDistanceCovered, usersByLocation, location)}km
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
          <span>#</span> {capitalize(activeTab)}
        </List.Item>

        {data.map((item, idx) => {
            let completionDate = item.completionDate ? "finish" : "pending";
            const {name, members, position, totalDistanceCovered} = item;
            const location = name;
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
                  {totalDistanceCovered}
                </div>
                  <div className="distance">
                    {averageDistance(totalDistanceCovered, usersByLocation, location)}
                    km
                  </div>
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
  userData: PropTypes.array,
  isLoading: PropTypes.bool,
  isMainDashboard: PropTypes.bool.isRequired,
};

CountryLeaderboardTable.defaultProps = {
  isLoading: false,
};

export default CountryLeaderboardTable;