import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import Avatar from "./Avatar.component";
import "./style.scss";

const orange = "#fa451b";
const blue = "#11A9B2";

const TeamLeaderboardTable = ({ height, data, mainDashboard }) => (
  <div style={{ height: height }} className={"leaderboard"}>
    <Table collapsing basic="very" className="main">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>
            {mainDashboard ? "Team Name" : "Member Name"}
          </Table.HeaderCell>
          <Table.HeaderCell>Distance</Table.HeaderCell>
          {mainDashboard && <Table.HeaderCell>Finish Date</Table.HeaderCell>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((item, index) => {
          let dateCompletion = item.completionDate ? "finish" : "pending";
          return (
            <Table.Row key={item.name}>
              <Table.Cell className={`main position ${dateCompletion}`}>
                {index + 1}.
              </Table.Cell>
              <Table.Cell className={`main avatar ${dateCompletion}`}>
                <Avatar
                  teamName={item.name}
                  color={mainDashboard ? orange : blue}
                  size={40}
                />
              </Table.Cell>
              <Table.Cell className={`main team-name ${dateCompletion} ${!mainDashboard && 'team'}`}>
                {item.name}
              </Table.Cell>
              <Table.Cell className={`main distance ${dateCompletion}`}>
                {item.totalDistance}
                km
              </Table.Cell>
              {mainDashboard && (
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
    </Table>
  </div>
);

TeamLeaderboardTable.propTypes = {
  height: PropTypes.number,
  data: PropTypes.array.isRequired,
  mainDashboard: PropTypes.bool.isRequired,
};

export default TeamLeaderboardTable;
