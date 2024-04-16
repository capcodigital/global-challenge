import React, { useEffect, useState } from "react";
import { Dropdown, Grid } from "semantic-ui-react";
import { allCities } from "../dashboard/constants";
import "./style.scss";


const countryOptions = [...new Map(allCities.map(item => ([item.country, { key: item.country, value: item.country, text: item.country }]))).values()];
const cityOptions = (cities) => [...new Map(cities.map(item => ([item.name, { key: item.name, value: item.name, text: item.name }]))).values()];
const sortedOptions = (options) => options.sort((a, b) => (a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1));
const findCityByCountry = (countries) => {
  const filteredByCountryData = countries.reduce((flatten, country) => flatten.concat(...allCities.filter(item => item.country === country)), []);
  return cityOptions(filteredByCountryData);
};

// to do: design filter

const LeaderboardFilter = ({ filterByCountry, filterByCity }) => {
  const [countryValue, setCountryValue] = useState([]);
  const [cityValue, setCityValue] = useState([]);
  const [citySelections, setCitySelections] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    filterByCountry(countryValue);
    if (countryValue.length) {
      setCitySelections(findCityByCountry(countryValue));
    } else {
      setCitySelections(cityOptions(allCities));
    }
  }, [countryValue]);

  useEffect(() => {
    if (!cityValue.length && countryValue.length) {
      filterByCountry(countryValue);
    } else {
      filterByCity(cityValue);
    }
  }, [cityValue]);

  useEffect(() => {
    if (cityValue.length) {
      const cities = cityValue.reduce((arr, item) => {
        const findCity = citySelections.find((city) => city.key === item);

        if (findCity?.key) { arr.push(findCity.key); }
        return arr;
      }, []);
      setCityValue(cities);
    }
  }, [citySelections]);

  const handleCityChange = (e, { value }) => {
    setCityValue(value);
  };

  const handleCountryChange = (e, { value }) => {
    setCountryValue(value);
  };

  const handleFilterButton = (e) => {
    e.preventDefault();
    setShowFilter(!showFilter);
  };


  return (
    <Grid container className="leaderboard-filter">
      <Grid.Row className="filter-button-container">
        <button
          type="button"
          className={showFilter ? 'filter-button' : 'filter-button-empty'}
          onClick={handleFilterButton}
        >
          MORE FILTERS
          {showFilter ? <span> &#9660;</span> : <span> &#9650;</span> }
        </button>
      </Grid.Row>
      { showFilter && (
        <>
          <Grid.Row>
            <Dropdown
              clearable
              fluid
              multiple
              search
              selection
              options={sortedOptions(countryOptions)}
              placeholder="Select Country"
              value={countryValue}
              onChange={handleCountryChange}
            />
          </Grid.Row>
          <Grid.Row>
            <Dropdown
              clearable
              fluid
              multiple
              search
              selection
              options={citySelections}
              placeholder="Select City"
              value={cityValue}
              onChange={handleCityChange}
            />
          </Grid.Row>
        </>)
      }
    </Grid>
  );
};

export default LeaderboardFilter;
