import { createSelector } from "reselect";
import { keyBy, cloneDeep } from "lodash";
import { levelMap, allCities } from "./constants";

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

const filteredTeamsSelector = createSelector(getState, (state) =>
  state.get("dashboard").get("filteredTeams")
);

const teamsSelector = createSelector([filteredTeamsSelector], (teamsList) =>
  teamsList
    ? teamsList.toJS().sort((a, b) => b.totalDistance - a.totalDistance)
    : []
);

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
  [filteredTeamsSelector],
  (teams) => {
    if (teams) {
      return teams.toJS().map((team) => ({
        distance: team.totalDistance,
        name: team.name,
        title: team.name,
        description: `No. of km ${team.totalDistance}`,
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
  filteredTeamsSelector,
  loadingStateSelector,
  breakdownSelector,
  totalStepSelector,
  averageSelector,
  totalDistanceSelector,
};
