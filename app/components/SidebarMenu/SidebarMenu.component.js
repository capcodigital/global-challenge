import React from "react";
import { Menu, Sidebar, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import ESTRChallengeSidebar from "./images/estr-sidebar-logo.png";
import GlobalChallengeSidebar from "./images/global_challenge_banner.png"
import "./style.scss";

const challenge_name =  process.env.CHALLENGE_NAME ? `${process.env.CHALLENGE_NAME}` : "global";

const SidebarMenu = ({ children, sidebarVisible, setSidebarVisible }) => {
  return (
    <Sidebar.Pushable className="sidebar">
      <Sidebar
        className={`sidebar-menu ${challenge_name}`}
        as={Menu}
        animation="overlay"
        onHide={() => setSidebarVisible(false)}
        vertical
        visible={sidebarVisible}
        onClick={() => setSidebarVisible(false)}
      >
        <div className="close-item">
          <Icon name="close" className="close-icon" />
        </div>
        <Menu.Item
          name="home"
          className={`menu-item ${challenge_name}`}
          as={NavLink}
          exact
          to="/"
        />
        <Menu.Item
          name="teamRegistration"
          className={`menu-item ${challenge_name}`}
          as={NavLink}
          exact
          to="/teams/register"
        />
        <Menu.Item
          name="about"
          className={`menu-item ${challenge_name}`}
          as={NavLink}
          exact
          to="/about"
        />
        <Menu.Item
          name="eventRules"
          className={`menu-item ${challenge_name}`}
          as={NavLink}
          exact
          to="/event-rules"
        />
        <Menu.Item
          name="howTo"
          className={`menu-item ${challenge_name}`}
          as={NavLink}
          exact
          to="/how-to"
        >
          Setup
        </Menu.Item>
        <Menu.Item
          name="FAQ"
          className={`menu-item ${challenge_name}`}
          as={NavLink}
          exact
          to="/faq"
        />
        <div className="menu-logo">
          {challenge_name == "global" &&
            <img src={GlobalChallengeSidebar} alt="Global Challenge Logo" />
          }
          {challenge_name == "uk" &&
            <img src={ESTRChallengeSidebar} alt="ESTR Challenge Logo" />
          }
        </div>
      </Sidebar>
      <Sidebar.Pusher dimmed={sidebarVisible} >
        <div>{children}</div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default SidebarMenu;
