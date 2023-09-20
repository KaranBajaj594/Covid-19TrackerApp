import React from "react";
import { FormControl,Select,MenuItem,Card, CardContent } from '@material-ui/core';
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./util";
import {prettyPrintStat} from "./util";
import LineGraph from "./LineGraph";
import { useState,useEffect } from 'react';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("worldwide");
  const [countryInfo, setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter, setMapCenter]=useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType, setCasesType]=useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  },[]);
  //State=How to write a variable in React

  //https://disease.sh/v3/covid-19/countries
  //useeffect = runs a piece of code based on given condition

  useEffect(()=>{
    //async ->send a request, wait for it, do something with it
    console.log("fired")
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=>{
        // console.log(data);
        const countries=data.map((country)=>(
          {
            name:country.country, //India
            value:country.countryInfo.iso2
          }
        ));

        const sortedData=sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    }

    getCountriesData()
  },[])

  const onCountryChange = async (event)=>{
     const countryCode=event.target.value;
     const url= countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${countryCode}`;

     await fetch(url)
     .then((response) => response.json())
     .then((data) =>{
      console.log(data);
        setCountry(countryCode);
        setCountryInfo(data)
        // console.log(data.countryInfo.lat, data.countryInfo.long);
        countryCode === "worldwide" ? setMapCenter({ lat: 34.80746, lng: -40.4796 }):setMapCenter({lat:data.countryInfo.lat, lng:data.countryInfo.long});
        // setMapCenter({lat:data.countryInfo.lat, lng:data.countryInfo.long});
        // setMapCenter([22, 77]);
        countryCode === "worldwide"?setMapZoom(3):setMapZoom(4);
     });
  }
  // console.log("CountryInfo>",countryInfo);
  return (
          // {/* Header Title + Select input dropdown field */}
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
          <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
            {/* InfoBoxes title="Coronavirus cases" */}
            <InfoBox isRed active={casesType === "cases"} onClick={e => setCasesType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
            {/* InfoBoxes title="Coronavirus recoveries"*/}
            <InfoBox active={casesType === "recovered"} onClick={e => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
            {/* InfoBoxes */}
            <InfoBox isRed active={casesType === "deaths"} onClick={e => setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

        {/* Map */}
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app_right">
        <CardContent>
           <h3>Live Cases by Country</h3>
           <Table countries={tableData}/>
           <h3 className="app_graphTitle">Worldwide new {casesType}</h3>
           <LineGraph className="app__graph" casesType={casesType} />
           {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
