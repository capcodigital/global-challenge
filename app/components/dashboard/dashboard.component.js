import React from 'react';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      worldData: [],
      cities: [
        {
          name: 'Bangalore', country: 'India', region: 'Asia', coordinates: [77.5667, 12.9667],
        },
        {
          name: 'Hong Kong', country: 'Hong Kong', region: 'Asia', coordinates: [114.1589, 22.2783]
        },
        {
          name: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', coordinates: [101.6869, 3.1390]
        },
        {
          name: 'Pune', country: 'India', region: 'Asia', coordinates: [73.8567, 18.5204]
        },
        {
          name: 'Singapore', country: 'Singapore', region: 'Asia', coordinates: [103.8000, 1.3000]
        },
        {
          name: 'Bratislava', country: 'Slovakia', region: 'Europe', coordinates: [17.1097, 48.1439]
        },
        {
          name: 'Brussels', country: 'Belgium', region: 'Europe', coordinates: [4.3517, 50.8503]
        },
        {
          name: 'Dusseldorf', country: 'Germany', region: 'Europe', coordinates: [6.7833, 51.2333]
        },
        {
          name: 'Edinburgh', country: 'United Kingdom', region: 'Europe', coordinates: [-3.1883, 55.9533]
        },
        {
          name: 'Frankfurt', country: 'Germany', region: 'Europe', coordinates: [8.6858, 50.1117]
        },
        {
          name: 'Geneva', country: 'Switzerland', region: 'Europe', coordinates: [6.15, 46.2000]
        },
        {
          name: 'London', country: 'United Kingdom', region: 'Europe', coordinates: [0.1275, 51.5072]
        },
        {
          name: 'Paris', country: 'France', region: 'Europe', coordinates: [2.3508, 48.8567]
        },
        {
          name: 'Stockholm', country: 'Sweden', region: 'Europe', coordinates: [18.0686, 59.3293]
        },
        {
          name: 'Vienna', country: 'Austria', region: 'Europe', coordinates: [16.3738, 48.2082]
        },
        {
          name: 'Warsaw', country: 'Poland', region: 'Europe', coordinates: [21.0122, 52.2297]
        },
        {
          name: 'Zurich', country: 'Switzerland', region: 'Europe', coordinates: [8.5500, 47.3667]
        },
        {
          name: 'Charlotte', country: 'USA', region: 'North America', coordinates: [-80.8433, 35.2269]
        },
        {
          name: 'Chicago', country: 'USA', region: 'North America', coordinates: [-87.6278, 41.8819]
        },
        {
          name: 'Dallas', country: 'USA', region: 'North America', coordinates: [-96.7970, 32.7767]
        },
        {
          name: 'Houston', country: 'USA', region: 'North America', coordinates: [-95.3698, 29.7604]
        },
        {
          name: 'New York', country: 'USA', region: 'North America', coordinates: [-73.94, 40.67]
        },
        {
          name: 'Orlando', country: 'USA', region: 'North America', coordinates: [-81.2989, 28.4158]
        },
        {
          name: 'Toronto', country: 'Canada', region: 'North America', coordinates: [-79.4000, 43.7000]
        },
        {
          name: 'Washington D.C', country: 'USA', region: 'North America', coordinates: [-77.0367, 38.8951]
        },
        {
          name: 'Sao Paulo', country: 'Brazil', region: 'South America', coordinates: [-46.6333, -23.5505]
        }
      ]
    };
  }

  componentDidMount() {
  }

  render() {
    const { cities, worldData } = this.state;
    return (
      <div>
      </div>
    );
  }
}

export default Dashboard;
