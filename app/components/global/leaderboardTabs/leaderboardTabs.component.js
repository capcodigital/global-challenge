import React, { useState } from "react";
import { Menu, Container } from "semantic-ui-react";
import "./style.scss";

export default function LeaderboardTabs() {
  const [activeItem, setActiveItem] = useState("personal");

  return (
    <Container>
      <Menu className="leaderboard-tabs" text>
        <Menu.Item
          name="PERSONAL"
          className="leaderboard-tab"
          active={activeItem === "personal"}
          onClick={() => setActiveItem("personal")}
        />
        <Menu.Item
          name="TEAM"
          className="leaderboard-tab"
          active={activeItem === "team"}
          onClick={() => setActiveItem("team")}
        />
        <Menu.Item
          name="OFFICE"
          className="leaderboard-tab"
          active={activeItem === "office"}
          onClick={() => setActiveItem("office")}
        />
        <Menu.Item
          name="GRADE"
          className="leaderboard-tab"
          active={activeItem === "grade"}
          onClick={() => setActiveItem("grade")}
        />
      </Menu>
    </Container>
  );
}
