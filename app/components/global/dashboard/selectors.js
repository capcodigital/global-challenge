import { cloneDeep, keyBy } from "lodash";
import { createSelector } from "reselect";
import { allCities, levelMap } from "./constants";
const getState = (state) => state;

const activitiesSelector = createSelector(getState, (state) =>
  state.get("dashboard").get("activities")
);

const loadingStateSelector = createSelector(getState, (state) =>
  state.get("dashboard").get("isLoading")
);

const filteredActivitiesSelector = createSelector(getState, (state) =>
  state.get("dashboard").get("filteredActivities")
);

// Team selectors
const teamsListSelector = createSelector(getState, (state) =>
  state.get("dashboard").get("teamsList")
);

// Locations selectors

const locationsListSelector = createSelector(getState, (state) =>
  state.get("dashboard").get("locations")
);

// Levels selectors

const levelsListSelector = createSelector(getState, (state) =>
  state.get("dashboard").get("levels")
);

const getPositionByActivity = (teamData, activity) =>
  teamData
    .sort((a, b) => b.activities[activity] - a.activities[activity])
    .map((team, idx) => ({
      ...team,
      activities: {
        ...team.activities,
        [`${activity.charAt(0).toLowerCase() + activity.slice(1)}Position`]:
          idx + 1,
      },
    }));

const teamsSelector = createSelector([teamsListSelector], (teamsList) => {
  if (teamsList) {
    let teamsData = teamsList.toJS();

    ["Run", "Swim", "Walk", "Rowing", "CyclingConverted"].map(
      (activity) => (teamsData = getPositionByActivity(teamsData, activity))
    );

    return teamsData
      .sort((a, b) => b.totalDistanceConverted - a.totalDistanceConverted)
      .map((team, idx) => ({ ...team, position: idx + 1 }));
  } else [];
});

const locationsSelector = createSelector([locationsListSelector], (locations) => {
  if (locations) {
    let locationsData = locations.toJS();

    ["Run", "Swim", "Walk", "Rowing", "CyclingConverted"].map(
      (activity) => (locationsData = getPositionByActivity(locationsData, activity))
    );

    return locationsData
      .sort((a, b) => b.totalDistanceConverted - a.totalDistanceConverted)
      .map((location, idx) => ({ ...location, position: idx + 1 }));
  } else [];
});

const levelsSelector = createSelector([levelsListSelector], (levels) => {
  if (levels) {
    let levelsData = levels.toJS();

    ["Run", "Swim", "Walk", "Rowing", "CyclingConverted"].map(
      (activity) => (levelsData = getPositionByActivity(levelsData, activity))
    );

    return levelsData
      .sort((a, b) => b.totalDistanceConverted - a.totalDistanceConverted)
      .map((location, idx) => ({ ...location, position: idx + 1 }));
  } else [];
});

const totalStepSelector = createSelector(
  [filteredActivitiesSelector],
  (activities) => {
    if (activities) {
      const steps = activities.toJS();
      return steps.reduce((sum, n) => sum + n.totalSteps, 0);
    }
    return 0;
  }
);

const totalDistanceSelector = createSelector(
  [filteredActivitiesSelector],
  (activities) => {
    if (activities) {
      const distance = activities.toJS();
      // Display totals in metres rather than km
      return distance.reduce((sum, n) => sum + n.totalDistance, 0);
    }
    return 0;
  }
);

const averageSelector = createSelector(
  [totalDistanceSelector, filteredActivitiesSelector],
  (total, employees) =>
    !total || total === 0 ? 0 : Math.floor(total / employees.count())
);

const sort = (array, property) =>
  array.sort((a, b) => parseFloat(b[property]) - parseFloat(a[property]));

// utility function for udating the stats for both level and location.
const updateStatics = (obj, key, distance, steps) => {
  if (obj[key]) {
    obj[key].employee += 1;
    obj[key].steps += steps;
    obj[key].distance += distance;
  } else {
    obj[key] = {
      steps,
      distance,
      employee: 1,
      name: key,
    };
  }
};

const leaderboardSelector = createSelector(
  [filteredActivitiesSelector],
  (activities) => {
    if (activities) {
      const leaderboard = sort(activities.toJS(), "totalDistance");

      return leaderboard.slice(0, 6).map((leader) => ({
        steps: leader.totalSteps,
        distance: leader.totalDistance,
        name: leader.name,
        title: leader.name,
        description: `No. of km ${leader.totalDistance}`,
      }));
    }

    return [];
  }
);

const breakdownSelector = createSelector(
  [filteredActivitiesSelector],
  (activities) => {
    const levels = {};
    const offices = {};
    if (activities) {
      const officeByCity = keyBy(allCities, "name");

      activities.forEach((element) => {
        const steps = element.get("totalSteps");
        const distance = element.get("totalDistance");
        const level = levelMap[element.get("level")] || "Other";
        let location = element.get("location") || "Other";

        if (!officeByCity[location]) {
          location = "Other";
        }

        // update the stats for offices
        updateStatics(offices, location, distance, steps);
        // update the stats for levels
        updateStatics(levels, level, distance, steps);
      });
    }

    const temp = Object.keys(offices).map((i) => {
      const office = offices[i];
      const { distance } = office;
      office.average = distance / office.employee;
      return office;
    });

    return {
      offices: sort(cloneDeep(temp), "employee"),
      levels: sort(
        Object.keys(levels).map((i) => levels[i]),
        "km"
      ),
      averages: sort(cloneDeep(temp), "average"),
    };
  }
);

export {
  activitiesSelector,
  teamsListSelector,
  teamsSelector,
  leaderboardSelector,
  filteredActivitiesSelector,
  loadingStateSelector,
  breakdownSelector,
  totalStepSelector,
  averageSelector,
  totalDistanceSelector,
  locationsSelector,
  levelsSelector
};
