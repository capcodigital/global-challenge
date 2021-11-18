import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Segment, Grid, Header, Icon } from "semantic-ui-react";
import {
  TeamLeaderboardTable,
  TeamSportsLeaderboardTable,
  TeamPageHeader,
} from "../common";
import MapGlobalTeams from "../map/MapGlobalTeams";
import { LoadScript } from "@react-google-maps/api";
import { runIcon, cycleIcon, rowIcon, swimIcon, walkIcon } from "./images";
import "./style.scss";

const libraries = ["geometry"];

const TeamsDashboardGlobal = ({ getTeamsList, teams }) => {
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

  return team ? (
    <div className="dashboard">
      <Segment className="secondary">
        <Grid container stackable columns={1}>
          <Grid.Row>
            <Link to="/" className="back-link">
              <Icon name="angle left" />
              BACK
            </Link>
            <TeamPageHeader
              teamName={team.name}
              totalDistance={team.totalDistanceConverted}
            />
            <LoadScript
              googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
              libraries={libraries}
            >
              <MapGlobalTeams teams={teams} team={team} />
            </LoadScript>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment className="secondary">
        <Grid container stackable columns={2} verticalAlign="middle">
          <Grid.Row>
            <Grid.Column>
              <Header size="large" className="global-header">
                LEADERBOARDS
              </Header>
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
                        distance: member.totalRun,
                      }))}
                   />
                  </div>
                </Grid.Row>
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
                        distance: member.totalWalk,
                      }))}
                    />
                  </div>
                </Grid.Row>
                <Grid.Row>
                  <div className="content-container-dashboard">
                    <Header size="medium" className="container-header">
                      <img src={cycleIcon} alt="Walk Logo" />
                      Bike
                    </Header>
                    <TeamSportsLeaderboardTable
                      height={170}
                      data={team.members.map((member) => ({
                        name: member.name,
                        distance: member.totalCyclingConverted,
                        actualDistance: member.totalCycling,
                      }))}
                      showActualDistance={true}
                    />
                  </div>
                </Grid.Row>
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
                        distance: member.totalSwim,
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
                        distance: member.totalRowing,
                      }))}
                    />
                  </div>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  ) : null;
};

TeamsDashboardGlobal.propTypes = {
  teams: PropTypes.array.isRequired,
};

export default TeamsDashboardGlobal;
