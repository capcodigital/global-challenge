import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Icon } from "semantic-ui-react";
import {
  MapUK,
  TeamLeaderboardTable,
  TeamSportsLeaderboardTable,
} from "../common";
import { LoadScript } from "@react-google-maps/api";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import "./style.scss";

const libraries = ["geometry"];

const TeamDashboardUK = ({ getTeamsList, teams }) => {
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

  return team ? (
    <div className="dashboard">
      <Segment className="secondary">
        <LoadScript
          googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <MapUK teams={teams} team={team} />
        </LoadScript>
      </Segment>
      <Segment className="secondary">
        <Grid container stackable columns={2} verticalAlign="middle">
          <Grid.Row>
            <Grid.Column>
              <Link to="/" className="back-link">
                <Icon name="angle left" />
                Back to leaderboard
              </Link>
              <Header size="large">{team.name}</Header>
              <div className="team-distance">
                Team Distance: {team.totalDistanceConverted.toFixed(2)}km
              </div>
              <TeamLeaderboardTable
                data={team.members.sort(
                  (a, b) => b.totalDistanceConverted - a.totalDistanceConverted
                )}
                isMainDashboard={false}
              />
            </Grid.Column>
            <Grid.Column>
              <Header size="large">SPORTS TOTAL</Header>
              <Grid container verticalAlign="middle">
                <Grid.Row>
                  <div className="content-container-dashboard">
                    <Header size="medium" className="container-header">
                      <img src={runIcon} alt="Run Logo" />
                      Run
                    </Header>
                    <TeamSportsLeaderboardTable
                      height={170}
                      data={team.members.map((member) => ({
                        name: member.name,
                        distance: member.totalRun.toFixed(2),
                      }))}
                    />
                  </div>
                </Grid.Row>
                {/* <Grid.Row>
                  <div className="content-container-dashboard">
                    <Header size="medium" className="container-header">
                      <img src={cycleIcon} alt="Walk Logo" />
                      Bike
                    </Header>
                    <TeamSportsLeaderboardTable
                      height={170}
                      data={team.members.map((member) => ({
                        name: member.name,
                        distance: member.totalCyclingConverted.toFixed(2),
                        actualDistance: member.totalCycling.toFixed(2),
                      }))}
                      showActualDistance={true}
                    />
                  </div>
                </Grid.Row> */}

                <Grid.Row>
                  <div className="content-container-dashboard">
                    <Header size="medium" className="container-header">
                      <img src={walkIcon} alt="Walk Logo" />
                      Walk
                    </Header>
                    <TeamSportsLeaderboardTable
                      height={170}
                      data={team.members.map((member) => ({
                        name: member.name,
                        distance: member.totalWalk.toFixed(2),
                      }))}
                    />
                  </div>
                </Grid.Row>
                {/* <Grid.Row>
                  <div className="content-container-dashboard">
                    <Header size="medium" className="container-header">
                      <img src={walkIcon} alt="Walk Logo" />
                      Yoga
                    </Header>
                    <TeamSportsLeaderboardTable
                      height={170}
                      data={team.members.map((member) => ({
                        name: member.name,
                        distance: member.totalYoga.toFixed(2),
                      }))}
                    />
                  </div>
                </Grid.Row> */}
                {/*
                <Grid.Row style={{ paddingBottom: 20 }}>
                  <div className="content-container-dashboard">
                    <Header size="medium" className="container-header">
                      <img src={swimIcon} alt="Swim Logo" />
                      Swim
                    </Header>
                    <TeamSportsLeaderboardTable
                      height={90}
                      data={team.members.map((member) => ({
                        name: member.name,
                        distance: member.totalSwim.toFixed(2),
                      }))}
                    />
                  </div>
                </Grid.Row>
                
                <Grid.Row>
                  <div className="content-container-dashboard">
                    <Header size="medium" className="container-header">
                      <img src={rowIcon} alt="Row Logo" />
                      Row
                    </Header>
                    <TeamSportsLeaderboardTable
                      height={90}
                      data={team.members.map((member) => ({
                        name: member.name,
                        distance: member.totalRowing.toFixed(2),
                      }))}
                    />
                  </div>
                </Grid.Row>
                    */}
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  ) : null;
};

TeamDashboardUK.propTypes = {
  teams: PropTypes.array.isRequired,
};

export default TeamDashboardUK;
