import React, { useState } from "react";
import { Menu, Container } from "semantic-ui-react";
import "./style.scss";

export default function LeaderboardTabs({ changeTab }) {
  const [activeItem, setActiveItem] = useState("personal");
  const onClickTab = (tabName) => {
    changeTab(tabName);
    setActiveItem(tabName);
  };
  return (
    <Container>
      <Menu className="leaderboard-tabs" text>
        <Menu.Item
          name="PERSONAL"
          className="leaderboard-tab"
          active={activeItem === "personal"}
          onClick={() => onClickTab("personal")}
        />
        <Menu.Item
          name="TEAM"
          className="leaderboard-tab"
          active={activeItem === "team"}
          onClick={() => onClickTab("team")}
        />
        <Menu.Item
          name="OFFICE"
          className="leaderboard-tab"
          active={activeItem === "office"}
          onClick={() => onClickTab("office")}
        />
        <Menu.Item
          name="GRADE"
          className="leaderboard-tab"
          active={activeItem === "grade"}
          onClick={() => onClickTab("grade")}
        />
      </Menu>
    </Container>
  );
}
