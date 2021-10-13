/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  Grid,
  Segment,
  Header,
  Container,
  Button,
} from "semantic-ui-react";
import { FormattedMessage } from "react-intl";
import "./style.scss";

export const SERVER_URL = process.env.SERVER_URL
  ? `https://${process.env.SERVER_URL}/`
  : "http://localhost/";


const challenge_name = process.env.CHALLENGE_NAME
? `${process.env.CHALLENGE_NAME}`
: "global";

class TeamsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      membersList: [],
      teamsList: [],
      selectedMembers: [],
      selectedTeam: "",
      createJoinResult: "",
    };

    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleJoinSubmit = this.handleJoinSubmit.bind(this);
  }

  componentDidMount() {
    const { getUsersList, getTeamsList } = this.props;

    getUsersList();
    getTeamsList();
  }

  componentWillReceiveProps(nextProps) {
    const { users } = nextProps;
    const { teams } = nextProps;

    if (users && users.length > 0) {
      const membersList = _.map(users, (member, index) => ({
        key: member.username,
        text: member.name,
        value: member.username,
      }));

      this.setState({ membersList });
    }

    if (teams && teams.length > 0) {
      const teamsList = _.map(teams, (team, index) => ({
        key: team.name,
        text: team.name,
        value: team.name,
      }));

      this.setState({ teamsList });
    }
  }

  memberListChange = (event, { value }) => {
    if (value.length > 4 || value.length < 2) {
      this.setState({ allowCreate: false });
    } else {
      this.state.selectedMembers = value;
      this.setState({ allowCreate: true });
    }
  };

  joinTeamChange = (event, { value }) => {
    this.state.selectedTeam = value;
  };

  handleCreateSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    fetch(`${SERVER_URL}teams`, {
      // fetch('https://localhost/teams', {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.get("name"),
        captain: data.get("createUser"),
        members: this.state.selectedMembers,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          this.setState({
            createJoinResult: json.message,
          });
        } else {
          this.setState({
            createJoinResult: "createTeamSuccess",
            selectedMembers: [],
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({
          createJoinResult: "createTeamFailed",
        });
      });
  }

  handleJoinSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    fetch(`${SERVER_URL}teams`, {
      // fetch('https://localhost/teams', {
      method: "PUT",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: this.state.selectedTeam,
        member: data.get("joinUser"),
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          this.setState({
            createJoinResult: json.message,
          });
        } else {
          this.setState({
            createJoinResult: "joinTeamSuccess",
            selectedTeam: "",
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({
          createJoinResult: "joinTeamFailed",
        });
      });
  }

  render() {
    const { membersList, teamsList } = this.state;

    return (
      <div className={`team-registration ${challenge_name}`}>
        <Container>
          <Segment vertical>
            <Grid columns="equal" stackable centered>
              <Grid.Column
                style={{ paddingBottom: "2rem", paddingTop: "2rem" }}
                width={6}
                className="registration"
              >
                <Header className="header">
                  <FormattedMessage id="teams.create" />
                </Header>

                <div className="registration-form-container">
                  <Form size="large" onSubmit={this.handleCreateSubmit}>
                    <Form.Input
                      fluid
                      maxLength="4"
                      placeholder="Capco ID"
                      name="createUser"
                      id="createUser"
                      pattern="[A-Za-z]{4}"
                      title="Please enter your 4 letter Capco ID"
                      required
                    />
                    <Form.Input
                      fluid
                      placeholder="Team Name"
                      name="name"
                      id="name"
                      pattern="^[A-Za-z0-9_- ]*$"
                      title="Team name can only contain letters and numbers."
                      required
                    />
                    <Form.Dropdown
                      placeholder="Members"
                      name="members"
                      fluid
                      multiple
                      search
                      selection
                      options={membersList}
                      className="dropdown"
                      onChange={this.memberListChange}
                    />

                    {this.state.createJoinResult == "createTeamSuccess" ? (
                      <FormattedMessage id="teams.createSuccess" />
                    ) : this.state.createJoinResult == "createTeamFailed" ? (
                      <FormattedMessage id="teams.createFailed" />
                    ) : this.state.createJoinResult ==
                      "createTeamFailedUserNotFound" ? (
                      <FormattedMessage id="teams.userNotFound" />
                    ) : (
                      <div></div>
                    )}

                    <Button
                      className="team-registration"
                      fluid
                      size="large"
                      type="submit"
                      disabled={!this.state.allowCreate}
                    >
                      <FormattedMessage id="Create Team" />
                    </Button>
                  </Form>
                </div>
              </Grid.Column>
              <Grid.Column className="spacer-column" width={2}></Grid.Column>
              <Grid.Column
                style={{ paddingBottom: "2rem", paddingTop: "2rem" }}
                className="registration"
                width={6}
              >
                <Header className="header select-team">
                  <FormattedMessage id="teams.join" />
                </Header>

                <div className="registration-form-container">
                  <Form size="large" onSubmit={this.handleJoinSubmit}>
                    <Form.Input
                      fluid
                      maxLength="4"
                      placeholder="Capco ID"
                      name="joinUser"
                      id="joinUser"
                      pattern="[A-Za-z]{4}"
                      title="Please enter your 4 letter Capco ID"
                      required
                    />
                    <Form.Dropdown
                      placeholder="Team Name"
                      name="team"
                      fluid
                      search
                      selection
                      options={teamsList}
                      style={{ minHeight: "114px" }}
                      className="dropdown-team-list"
                      onChange={this.joinTeamChange}
                    />

                    {this.state.createJoinResult == "joinTeamSuccess" ? (
                      <FormattedMessage id="teams.joinSuccess" />
                    ) : this.state.createJoinResult == "joinTeamFailed" ? (
                      <FormattedMessage id="teams.joinFailed" />
                    ) : this.state.createJoinResult ==
                      "joinTeamFailedAlreadyAMember" ? (
                      <FormattedMessage id="teams.joinAlready" />
                    ) : this.state.createJoinResult ==
                      "joinTeamFailedUserNotFound" ? (
                      <FormattedMessage id="teams.userNotFound" />
                    ) : (
                      <div></div>
                    )}

                    <Button className="team-registration" fluid size="large">
                      <FormattedMessage id="Join Team" />
                    </Button>
                    <Button
                      className="team-registration-light"
                      fluid
                      size="large"
                      as="a"
                      href="/"
                    >
                      <FormattedMessage id="teams.progress" />
                    </Button>
                  </Form>
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
        </Container>
      </div>
    );
  }
}

TeamsPage.propTypes = {
  getUsersList: PropTypes.func.isRequired,
  getTeamsList: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  usersList: PropTypes.object,
  teamsList: PropTypes.object,
  users: PropTypes.array,
  teams: PropTypes.array,
};

export default TeamsPage;
