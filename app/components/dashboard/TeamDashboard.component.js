import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Icon } from "semantic-ui-react";
import {
  MapUK,
  TeamLeaderboardTable,
  TeamSportsLeaderboardTable,
} from "components/common";
import { LoadScript } from "@react-google-maps/api";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import "./style.scss";

const libraries = ["geometry"];

const TeamDashboard = ({ getTeamsList, teams }) => {
  const [teamName, setTeamName] = useState("");
  const [team, setTeam] = useState(null);

  useEffect(() => {
    getTeamsList();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTeamName(window.location.pathname.split("/team/")[1].replace(/-/g, " "));
  }, []);

  useEffect(() => {
    let selectedTeam = teams
      .filter((team) => team.name.toLowerCase() === teamName)
      .sort((a, b) => b.totalDistance - a.totalDistance);
    setTeam(selectedTeam[0]);
  });

  let total = teams
    .map((team) => team.totalDistance)
    .reduce((a, b) => a + b, 0);
    console.log(team)
  return team ? (
    <div className="dashboard">
      <Segment className="secondary">
        <div className="heading">
          <div className="counter-uk">
            <div className="wrapper">
              <span className="text">Overal Distance: </span>
              <span className="total">{total}km</span>
            </div>
          </div>
        </div>
        <LoadScript
          googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <MapUK teams={teams} team={team} />
        </LoadScript>
      </Segment>
      <Segment className="primary">
        <Grid container stackable columns={2} verticalAlign="middle">
          <Grid.Row>
            <Grid.Column>
              <Link to="/" className="back-link">
                <Icon name="angle left" />
                Back to leaderboard
              </Link>
              <Header size="large">{team.name}</Header>
              <div className="team-distance">
                Team Distance: {team.totalDistanceConverted}km
              </div>
              <TeamLeaderboardTable
                data={team.members.sort(
                  (a, b) => b.totalDistanceConverted - a.totalDistanceConverted
                )}
                isMainDashboard={false}
              />
            </Grid.Column>
            <Grid.Column>
              <Header size="large">Sports Total</Header>
              <Grid container stackable columns={2} verticalAlign="middle">
                <Grid.Row>
                  <Grid.Column width={8}>
                    <div className="content-container-dashboard">
                      <Header size="medium" className="container-header">
                        <img src={runIcon} alt="Run Logo" />
                        Run
                      </Header>
                      <TeamSportsLeaderboardTable
                        height={290}
                        data={team.members.map((member) => ({
                          name: member.name,
                          distance: member.totalRun,
                        }))}
                      />
                    </div>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <div className="content-container-dashboard">
                      <Header size="medium" className="container-header">
                        <img src={cycleIcon} alt="Walk Logo" />
                        Bike
                      </Header>
                      <TeamSportsLeaderboardTable
                        height={290}
                        data={team.members.map((member) => ({
                          name: member.name,
                          distance: member.totalCyclingConverted,
                          actualDistance: member.totalCycling,
                        }))}
                        showActualDistance={true}
                      />
                    </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <div className="content-container-dashboard">
                      <Grid.Row>
                        <Header size="medium" className="container-header">
                          <img src={walkIcon} alt="Walk Logo" />
                          Walk
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={250}
                          data={team.members.map((member) => ({
                            name: member.name,
                            distance: member.totalWalk,
                          }))}
                        />
                      </Grid.Row>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <div className="content-container-dashboard">
                      <Grid.Row style={{ paddingBottom: 20 }}>
                        <Header size="medium" className="container-header">
                          <img src={swimIcon} alt="Swim Logo" />
                          Swim
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={90}
                          data={team.members.map((member) => ({
                            name: member.name,
                            distance: member.totalSwim,
                          }))}
                        />
                      </Grid.Row>
                      <Grid.Row>
                        <Header size="medium" className="container-header">
                          <img src={rowIcon} alt="Row Logo" />
                          Row
                        </Header>
                        <TeamSportsLeaderboardTable
                          height={90}
                          data={team.members.map((member) => ({
                            name: member.name,
                            distance: member.totalRowing,
                          }))}
                        />
                      </Grid.Row>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  ) : null;
};

TeamDashboard.propTypes = {
  teams: PropTypes.array.isRequired,
};

export default TeamDashboard;
