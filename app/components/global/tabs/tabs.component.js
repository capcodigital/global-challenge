import React, { Component } from "react";
import { Menu, Container } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import CountDown from "../common/CountDown";
import "./style.scss";

export default class TabsGlobal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: props.teams,
    };
  }

  componentDidMount() {
    this.props.getTeamsList();
  }

  componentWillReceiveProps(nextProps) {
    const { teams } = nextProps;
    this.setState({ teams: teams });
  }

  render() {
    return (
      <Container>
        <Menu className="tabs" text>
          <Menu.Item name="home" className="tab" as={NavLink} exact to="/" />
          <Menu.Item
            name="about"
            className="tab"
            as={NavLink}
            exact
            to="/about"
          />
          <Menu.Item
            name="eventRules"
            className="tab"
            as={NavLink}
            exact
            to="/event-rules"
          />
          <Menu.Item
            name="howTo"
            className="tab"
            as={NavLink}
            exact
            to="/how-to"
          >
            Setup
          </Menu.Item>
          <Menu.Item name="FAQ" className="tab" as={NavLink} exact to="/faq" />
        </Menu>
      </Container>
    );
  }
}
