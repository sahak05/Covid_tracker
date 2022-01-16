import React, {useState, useEffect} from 'react'
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core'
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map'

function App() {

const [countries, setCountries] = useState([]);
const [country, setCountry] = useState("worlwide")

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

      setCountries(countries)
    })
  }

  getCountriesData()
}, [])

  const onCountryChange = async (event)=>{
    setCountry(event.target.value)
  }
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
          <InfoBox title='Corona Cases'  cases={1234} total={53000} />
          <InfoBox title='Recovered'  cases={1234} total={4000} />
          <InfoBox title='Deaths'  cases={1234} total={4000000} />
        </div>
        {/*Map*/}
        <Map />

      </div>
      
      <Card className='app__right'>
        {/* Table*/}
        {/* Graph*/}
        <CardContent>
           <h3>Live cases by Country</h3>
           <h3>Worldwide new cases</h3>   
        </CardContent>
      </Card>
    
    </div>
  );
}

export default App;
