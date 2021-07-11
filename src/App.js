import React, { useEffect, useState } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
//import "mapbox-gl/dist/mapbox-gl.css";
import "leaflet/dist/leaflet.css";
import "./InfoBox.css";
//import styled from "styled-components";
//import { DarkMode } from "@styled-icons/material-twotone";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isLoading, setLoading] = useState(false);
  const [theme, setTheme] = useState(true);
  const [imageLink,setImageLink]=useState("https://static.thenounproject.com/png/765894-200.png");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    setLoading(true);
    const countryCode = event.target.value;

    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[countryCode]

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setLoading(false);
        // console.log([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide"
          ? setMapCenter([34.0479, 100.6197])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      });

    console.log(countryInfo);
  };
  /*function onInfoboxClick(caseType) {
    if (casesType === "cases") {
      setCasesType("cases");
    } else if (casesType === "recovered") {
      setCasesType("recovered");
    } else if (casesType === "active") {
      setCasesType("active");
      return;
    } else {
      setCasesType("deaths");
    }
  }*/
  function theme_setter() {
    if (theme === true) {
      setTheme(false);
      setImageLink("https://cdn1.iconfinder.com/data/icons/mix-ui/24/Sun_Brightness_Day_Light_Weather_Mode-512.png")
    } else {
      setTheme(true);
      setImageLink("https://static.thenounproject.com/png/765894-200.png");
    }
    console.log(theme);
  }
  return (
    <div className={`app ${!theme && "app__dark"}`}>
      <div className="app__left">
        <div className="app__header">
          <h1 className={`app__heading ${!theme && "heading__dark"}`}>Covid-19 Tracker</h1>
          {/* Heading*/}
          <img
            onClick={theme_setter}
            className="app__icon"
            alt=""
            src={imageLink}
          ></img>
          <FormControl className={`app__dropdown ${!theme && "app__dropdownDark"}`}>
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* navbar , and dropdown of countries*/}
        </div>

        <div className="app__stats">
          {/*Infobox about cases, recovered and deaths  */}
          <InfoBox
            theme={theme}
            isRed
            active={casesType === "cases"}
            className="infoBox__cases"
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            isloading={isLoading}
          />
          <InfoBox
          theme={theme}
            isBlue
            active={casesType === "active"}
            className="infoBox__active"
            onClick={(e) => setCasesType("active")}
            title="Active"
            total={prettyPrintStat(
              countryInfo.cases - countryInfo.recovered - countryInfo.deaths
            )}
            cases={prettyPrintStat(
              countryInfo.todayCases -
                countryInfo.todayRecovered -
                countryInfo.todayDeaths
            )}
            isloading={isLoading}
          />
          <InfoBox
            isGreen
            theme={theme}
            active={casesType === "recovered"}
            className="infoBox__recovered"
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            isloading={isLoading}
          />
          <InfoBox
          theme={theme} 
            isGrey
            active={casesType === "deaths"}
            className="infoBox__deaths"
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            isloading={isLoading}
          />
        </div>
        {/* Map */}
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
          casesType={casesType}
        />
      </div>
      <Card className={`app__right ${!theme && "app_rightDark"}`}>
        <CardContent>
          <h3 className={`${!theme &&"app__tableHeadingDark"}`}>Live Cases by Country</h3>
          <Table countries={tableData} theme={theme} />
          {/* ascending order of no. of cases of all the countries  */}
          <h3 className={`app__graphTitle ${!theme &&"app__tableHeadingDark"}`}>WorldWide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>

        {/* Graph */}
      </Card>
    </div>
  );
}

export default App;
