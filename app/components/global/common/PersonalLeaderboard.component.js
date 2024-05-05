import React, { useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
import Avatar from "../../common/Avatar.component";
import MenuFilter from "./menuFilter.component";
import { allCities } from "../dashboard/constants";

const findCityByCountry = (countries) => {
  const filteredCityData = countries.reduce((flatten, country) => flatten.concat(...allCities.filter((item) => item.country === country)), []);
  return filteredCityData.map((city) => city.name);
};

const PersonalLeaderboardTable = ({ data, filterByCountry, filterByCity }) => {
  const [countryValue, setCountryValue] = useState([]);
  const [cityValue, setCityValue] = useState([]);

  useEffect(() => {
    filterByCountry(countryValue);
    if (countryValue.length) {
      setCityValue(findCityByCountry(countryValue));
    } else {
      setCityValue([]);
    }
  }, [countryValue]);

  useEffect(() => {
    filterByCity(cityValue);
  }, [cityValue]);

  const handleCountryFilter = (e, value) => {
    const isExistingCountry = countryValue.includes(value.label);
    if (isExistingCountry) {
      const newList = countryValue.filter((item) => item !== value.label);
      setCountryValue(newList);
    } else {
      setCountryValue([...countryValue, value.label]);
    }
  };

  const handleCityFilter = (e, value) => {
    const isExistingCity = cityValue.includes(value.label);
    if (isExistingCity) {
      const newList = cityValue.filter((item) => item !== value.label);
      setCityValue(newList);
    } else {
      const cities = cityValue.concat(value.label);
      setCityValue(cities);
    }
  };

  return (
    <div className={'personal-leaderboard-desktop-global'}>
      <Table collapsing basic="very" className="main">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Country <MenuFilter filterValue={countryValue} filterHandler={handleCountryFilter} name="country" /></Table.HeaderCell>
            <Table.HeaderCell>City <MenuFilter filterValue={cityValue} filterHandler={handleCityFilter} name="city" /></Table.HeaderCell>
            <Table.HeaderCell>Distance</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body className="main-table">
          {data && data.map((player) => {
            const { position, location, name, totalDistance } = player;

            return (
              <Table.Row key={name}>
                <Table.Cell>{position}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>
                  <Avatar
                    name={location}
                    location={location}
                    activeTab={'office'}
                    color="#00AABB"
                    size={40}
                  />
                </Table.Cell>
                <Table.Cell>{location}</Table.Cell>
                <Table.Cell>{`${totalDistance} km`}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default PersonalLeaderboardTable;
