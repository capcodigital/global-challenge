/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import PropTypes from "prop-types";
import { List, Table } from "semantic-ui-react";
import "./style.scss";

const getInitials = (name) => {
  let temp = name.replace(/\bthe\b|\band\b/gi, "").split(" ");
  if (temp.length === 1) return temp.charAt(0).toUpperCase();
  else
    return `${
      temp[0].charAt(0) + temp[temp.length - 1].charAt(0)
    }`.toUpperCase();
};
const TeamSportsLeaderboardTable = ({ className, height }) => (
  <List animated divided className={className} style={{ height: height }}>
    <Table basic="very" celled collapsing>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            1.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>140km</Table.Cell>
          <Table.Cell>
            <svg width="120" height="16">
              <rect width="120" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            2.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>110km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="110" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            3.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>70km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="70" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            4.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>60km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="60" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            5.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>50km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="50" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            6.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="40" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            6.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="40" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            6.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="40" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            6.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="40" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            6.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="40" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            6.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="40" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            6.
            <svg
              className="avatar"
              width={30}
              height={30}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle fill={"rgb(167, 167, 167)"} cx="15" cy="15" r="15" />
              <text
                text-anchor="middle"
                x="15"
                y="20"
                fill="white"
                font-size="15"
                font-family="Helvetica"
              >
                {getInitials("Hello and Bye")}
              </text>
            </svg>
          </Table.Cell>
          <Table.Cell>40km</Table.Cell>
          <Table.Cell>
            <svg width="140" height="16">
              <rect width="40" height="16" fill={"lightgrey"} rx={8} />
            </svg>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </List>
);

TeamSportsLeaderboardTable.propTypes = {
  className: PropTypes.string,
  height: PropTypes.number,
};

export default TeamSportsLeaderboardTable;
