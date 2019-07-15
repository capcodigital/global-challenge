import { createSelector } from 'reselect';
import { keyBy, cloneDeep } from 'lodash';
import { levelMap, allCities } from './constants';

const getState = (state) => state;

const activitiesSelector = createSelector(
  getState,
  (state) => state.get('dashboard').get('activities')
);

const loadingStateSelector = createSelector(
  getState,
  (state) => state.get('dashboard').get('isLoading')
);

const filteredActivitiesSelector = createSelector(
  getState,
  (state) => state.get('dashboard').get('filteredActivities')
);

const totalSelector = createSelector(
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
      const steps = activities.toJS();
      return steps.reduce((sum, n) => sum + n.totalDistance, 0);
    }
    return 0;
  }
);

const averageSelector = createSelector(
  [totalSelector, filteredActivitiesSelector],
  (total, employees) => (!total || total === 0 ? 0 : Math.floor(total / employees.count()))
);

const sort = (array, property) => array.sort((a, b) => parseFloat(b[property]) - parseFloat(a[property]));

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
      const leaderboard = sort(activities.toJS(), 'totalSteps');

      return leaderboard.slice(0, 6).map((leader) => ({
        steps: leader.totalSteps,
        distance: leader.totalDistance,
        name: leader.name,
        title: leader.name,
        description: `No. of steps ${leader.totalSteps}`
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
      const officeByCity = keyBy(allCities, 'name');

      activities.forEach((element) => {
        const steps = element.get('totalSteps');
        const distance = element.get('totalDistance');
        const level = levelMap[element.get('level')] || 'Other';
        let location = element.get('location') || 'Other';

        if (!officeByCity[location]) {
          location = 'Other';
        }

        // update the stats for offices
        updateStatics(offices, location, distance, steps);
        // update the stats for levels
        updateStatics(levels, level, distance, steps);
      });
    }

    const temp = Object.keys(offices).map((i) => {
      const office = offices[i];
      const { steps } = office;
      office.average = steps / office.employee;
      return office;
    });


    return {
      offices: sort(cloneDeep(temp), 'employee'),
      levels: sort(Object.keys(levels).map((i) => levels[i]), 'steps'),
      averages: sort(cloneDeep(temp), 'average')
    };
  }
);

export {
  activitiesSelector,
  leaderboardSelector,
  filteredActivitiesSelector,
  loadingStateSelector,
  breakdownSelector,
  totalSelector,
  averageSelector,
  totalDistanceSelector
};
