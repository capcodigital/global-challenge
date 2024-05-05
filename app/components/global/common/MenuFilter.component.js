import React, { useState } from "react";
import { Popup, Checkbox } from "semantic-ui-react";
import { allCities } from "../dashboard/constants";
import "./style.scss";

const sortedOptions = (options) => options.sort((a, b) => (a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1));
const countryOptions = [...new Map(allCities.map(item => ([item.country, { key: item.country, value: item.country, text: item.country }]))).values()];
const cityOptions = (cities) => [...new Map(cities.map(item => ([item.name, { key: item.name, value: item.name, text: item.name }]))).values()];

function MenuFilter({ filterValue, filterHandler, name }) {
  const [filterActive, setFilterActive] = useState(false);

  const popUpContentCountry = () => (
    <div className="filter-checkbox">
      {sortedOptions(countryOptions).map((item) => (
        <div key={item.key}>
          <Checkbox
            label={item.text}
            onChange={filterHandler}
            checked={filterValue.includes(item.text)}
          />
        </div>
      ))}
    </div>
  );

  const popUpContentCity = () => (
    <div className="filter-checkbox">
      {sortedOptions(cityOptions(allCities)).map((item) => (
        <div key={item.key}>
          <Checkbox
            label={item.text}
            onChange={filterHandler}
            checked={filterValue.includes(item.text)}
          />
        </div>
      ))}
    </div>
  );

  const getFilterContent = (title) => {
    switch (title) {
      case 'country':
        return popUpContentCountry();
      case 'city':
        return popUpContentCity();
      default:
        return <></>;
    }
  };

  const handleFilterButton = (e) => {
    e.preventDefault();
    setFilterActive(!filterActive);
  };

  const trigger = () => (
    <button type="button" className="direction-icon" onClick={handleFilterButton}>
      {filterActive ? <span> &#9660;</span> : <span> &#9650;</span>}
    </button>
  );

  return (
    <span className="leaderboard-filter-box">
      <Popup
        trigger={trigger()}
        content={getFilterContent(name)}
        position="top center"
        on="click"
      />
    </span>
  );
}

export default MenuFilter;
