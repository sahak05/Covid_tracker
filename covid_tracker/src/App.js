import React, {useState, useEffect} from 'react'
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core'
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css'


function App() {
//useState
const [countries, setCountries] = useState([]);
const [country, setCountry] = useState("worlwide")
const [countryInfo, setCountryInfo] = useState({})
const [tableData, setTableData] = useState([])
const [mapcenter, setMapcenter] = useState({ lat: 34.80746, lng: -40.4796 })
const [mapzoom, setMapzoom] = useState(3)
const [mapCountries, setMapCountries] = useState([])
const [casesType, setCasesType] = useState("recovered");

useEffect(()=>{
  fetch('https://disease.sh/v3/covid-19/all')
  .then((response) => response.json())
  .then((data)=>{setCountryInfo(data)})
},[]) 

// https://disease.sh/v3/covid-19/countries

useEffect(() => {
  
  //async -> send a request and wait for it to use the reponse

  const  getCountriesData = async()=>{
    await fetch("https://disease.sh/v3/covid-19/countries").then((reponse)=>reponse.json())
    .then((data)=>{
      const countries = data.map((country)=>(
        {
          name:country.country, //USa,France
          value:country.countryInfo.iso2 //USA, FR
        }
      ))

      setTableData(sortData(data))
      setCountries(countries)
      setMapCountries(data)
    })
  }

  getCountriesData()
}, [])




  const onCountryChange = async (event)=>{
 
    const url = event.target.value === "worlwide" ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${event.target.value}`
    // https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/{COUNTRY_CODE}

    await fetch(url).then((response) => response.json())
    .then(data =>{
      setCountry(event.target.value)
      setCountryInfo(data) // set the country info with the data that we return
      
      setMapcenter([data.countryInfo.lat, data.countryInfo.long])
      setMapzoom(4)
    })
  }

  // console.log(countryInfo) was hepful to see the data
  return (
    <div className="App">

      <div className='app__left'>


        {/* Header*/}
        { /*Title + select input dropdown field */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange} >

              {/*Loop through all the country and display them */} 
              <MenuItem value="worlwide">Worlwide</MenuItem>
              {
                countries.map((country)=>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }           
            </Select>
          </FormControl>
        </div>
      
        {/* Infoboxs*/}
        {/* Infoboxs*/}
        {/* Infoboxs*/}
        <div className='app__stats'>
          <InfoBox 
          isRed
          active={casesType==='cases'}
          title='Corona Cases'  cases={prettyPrintStat(countryInfo.todayCases)}
          total={prettyPrintStat(countryInfo.cases)} 
          onClick={(e) => setCasesType("cases")}/>

          <InfoBox 
          active={casesType==='recovered'}
          title='Recovered'  cases={prettyPrintStat(countryInfo.todayRecovered)}
          total={prettyPrintStat(countryInfo.recovered)}
          onClick={(e) => setCasesType("recovered")} />
          <InfoBox 
          isRed
          active={casesType==='deaths'}
          title='Deaths'  cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)}
          onClick={(e) => setCasesType('deaths')} />
        </div>
        {/*Map*/}
        <Map 
        countries={mapCountries}
        casesType={casesType}
        center={mapcenter}
        zoom={mapzoom}/>

      </div>
      
      <Card className='app__right'>
        
        
        <CardContent>
           <h3>Live cases by Country</h3>
           {/* Table*/}
           <Table countries={tableData}/>
           <h3 className='app__graphT'>Worldwide new {casesType}</h3>  
           {/* Graph*/}
           <LineGraph className="app__graph" casesType={casesType}/> 
        </CardContent>
        
      </Card>
    
    </div>
  );
}

export default App;
