/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Grid, Segment, Header, Image, Container, List, Button, Divider, Dropdown
} from 'semantic-ui-react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import RegistrationForm from '../register';
import Banner from './images/banner.png';
import ESTRBanner from './images/ESTR-banner.png'
import './style.scss';

export const SERVER_URL = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

class TeamsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      membersList: [],
      teamsList: [],
      selectedMembers: [],
      selectedTeam: '',
      createJoinResult: ''
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

  memberListChange = (event, {value}) => {

    if (value.length > 4 || value.length < 2) {
      this.setState({ allowCreate: false });
    } else {
      this.state.selectedMembers = value;
      this.setState({ allowCreate: true });
    }
  }

  joinTeamChange = (event, {value}) => {
    this.state.selectedTeam = value;
  }

  handleCreateSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    fetch(`${SERVER_URL}teams`, {
    // fetch('https://localhost/teams', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.get('name'),
        captain: data.get('createUser'),
        members: this.state.selectedMembers
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if (json.message) {
        this.setState({ 
          createJoinResult: json.message
        });
      } else {
        this.setState({ 
          createJoinResult: 'createTeamSuccess',
          selectedMembers: []
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
      this.setState({ 
        createJoinResult: 'createTeamFailed'
      });
    });
  }

  handleJoinSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    fetch(`${SERVER_URL}teams`, {
    // fetch('https://localhost/teams', {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        team: this.state.selectedTeam,
        member: data.get('joinUser')
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if (json.message) {
        this.setState({ 
          createJoinResult: json.message
        });
      } else {
        this.setState({ 
          createJoinResult: 'joinTeamSuccess',
          selectedTeam: ''
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
      this.setState({ 
        createJoinResult: 'joinTeamFailed'
      });
    });
  }

  render() {
    const { membersList, teamsList } = this.state;

    const { isLoading, users, teams } = this.props;

    return (
      <div className="homepage">
        <Container>
          <div className="banner">
            <img src={ESTRBanner} width="100%" alt="Capco banner" />
          </div>
          <Segment style={{ padding: '0' }} vertical>
            <Grid columns="equal" stackable>
              <Grid.Row textAlign="left">
                <Grid.Column style={{ paddingBottom: '2rem', paddingTop: '2rem' }} className="registration">

                  <Header as="h2" className="header">
                    <FormattedMessage id="teams.create" />
                  </Header>

                  <div className="registration-form-container">
                    <Form size="large" onSubmit={this.handleCreateSubmit}>
                      <Segment stacked>

                        <Form.Input
                          fluid
                          icon="user"
                          iconPosition="left"
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
                          icon="user"
                          iconPosition="left"
                          placeholder="Team Name"
                          name="name"
                          id="name"
                          title="Please enter a unique name for your team"
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

                        {
                          (this.state.createJoinResult == 'createTeamSuccess') ? <FormattedMessage id="teams.createSuccess" />
                          : (this.state.createJoinResult == 'createTeamFailed') ? <FormattedMessage id="teams.createFailed" />
                          : (this.state.createJoinResult == 'createTeamFailedUserNotFound') ? <FormattedMessage id="teams.userNotFound" />
                          : <div></div>
                        }

                        <Button className="fitbit" fluid size="large" type="submit" disabled={!this.state.allowCreate}>
                          <FormattedMessage id="Create Team" />
                        </Button>
                      </Segment>
                    </Form>
                  </div>

                </Grid.Column>
                <Grid.Column style={{ paddingBottom: '2rem', paddingTop: '2rem' }} className="registration">

                  <Header as="h2" className="header">
                    <FormattedMessage id="teams.join" />
                  </Header>

                  <div className="registration-form-container">
                    <Form size="large" onSubmit={this.handleJoinSubmit}>
                      <Segment stacked>

                        <Form.Input
                          fluid
                          icon="user"
                          iconPosition="left"
                          maxLength="4"
                          placeholder="Capco ID"
                          name="joinUser"
                          id="joinUser"
                          pattern="[A-Za-z]{4}"
                          title="Please enter your 4 letter Capco ID"
                          required
                        />
                        <Form.Dropdown
                          placeholder="Team"
                          name="team"
                          fluid
                          search
                          selection
                          options={teamsList}
                          className="dropdown"
                          onChange={this.joinTeamChange}
                        />

                        {
                          (this.state.createJoinResult == 'joinTeamSuccess') ? <FormattedMessage id="teams.joinSuccess" />
                          : (this.state.createJoinResult == 'joinTeamFailed') ? <FormattedMessage id="teams.joinFailed" />
                          : (this.state.createJoinResult == 'joinTeamFailedAlreadyAMember') ? <FormattedMessage id="teams.joinAlready" />
                          : (this.state.createJoinResult == 'joinTeamFailedUserNotFound') ? <FormattedMessage id="teams.userNotFound" />
                          : <div></div>
                        }

                        <Button className="fitbit" fluid size="large">
                          <FormattedMessage id="Join Team" />
                        </Button>
                      </Segment>
                    </Form>
                  </div>

                  <div className="progress-button-container">
                    <Button color="black" basic size="massive" as="a" href="/" className="progress-button">
                      <FormattedMessage id="homepage.progress" />
                    </Button>
                  </div>
                </Grid.Column>
              </Grid.Row>
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
  teams: PropTypes.array
};

export default TeamsPage;
