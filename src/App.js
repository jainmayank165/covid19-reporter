import React,{useState,useEffect} from "react"
import {MenuItem,Select,FormControl,Card,CardContent} from "@material-ui/core"
import './App.css';
import InfoBox from './InfoBox.js';
import Maps from './Maps.js'
import Table from './Table.js'
import {sortData,prettyPrintStat} from './util'
import Graph from './Graph.js'
import "leaflet/dist/leaflet.css";

function App() { 
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState('Worldwide');
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [center,setMapCenter]=useState({lat:20,lng: 77});
  const [zoomMap,setZoomMap]=useState(2);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState("cases");

  
   {/*--------------------------------------------------------------*/}
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then((data)=>
    {
      setCountryInfo(data);
    })
  },[])
   {/*--------------------------------------------------------------*/}
  useEffect(() => {
    const getData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>
      {
        const countries=data.map((country)=>(
          { 
            name:country.country,
            value:country.countryInfo.iso2
          }));
          const sortedData=sortData(data);
         setTableData(sortedData);
         setMapCountries(data);
          setCountries(countries);     
      })
    }
    getData();
  }, []);
  {/*--------------------------------------------------------------*/}
  const onCountryChange=async(e)=>{
    const countryCode=e.target.value;
    const url=countryCode==='Worldwide'?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`;
 
    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
      (countryCode==="Worldwide")?setMapCenter([34,-40]):setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      (countryCode==="Worldwide")?setZoomMap(2):setZoomMap(4);
      
    })
    
  }
   {/*--------------------------------------------------------------*/}
  
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid-19 Report</h1>
          <FormControl className="app_Dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
          <MenuItem  style={{color:'#e0e1dd',backgroundColor:"#0b132b"}}value="Worldwide">Worldwide</MenuItem>
            {countries.map((country)=>(
              <MenuItem style={{color:'#e0e1dd',backgroundColor:"#0b132b"}} value={country.value} >{country.name}</MenuItem>
            ))}

          </Select>
          </FormControl>
        </div>
        {/*--------------------------------------------------------------*/}
        <div className="app_stats">
          <InfoBox  isRed
                    className="infoBox_app"
                    active={casesType==="cases"}
                    onClick={(e)=>setCasesType("cases")} 
                    title="Carona cases" 
                    cases={prettyPrintStat(countryInfo.todayCases)} 
                    total={prettyPrintStat(countryInfo.cases)}/>         
          <InfoBox 
                    active={casesType==="recovered"}
                    onClick={(e)=>setCasesType("recovered")} 
                    title="Recoveries"
                    cases={prettyPrintStat(countryInfo.todayRecovered)} 
                    total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox  isRed
                    active={casesType==="deaths"}
                    onClick={(e)=>setCasesType("deaths")} 
                    title="Deaths"
                    cases={prettyPrintStat(countryInfo.todayDeaths)} 
                    total={prettyPrintStat(countryInfo.deaths)}/> 
        
        </div>
            
        {/*--------------------------------------------------------------*/}
       
        <div>
          <Maps countries={mapCountries} casesType={casesType} center={center} zoom={zoomMap}/>
        </div>
      </div> 
      {/*------------------------------------------------------------------------------*/}
      <Card className="app_right">
        <CardContent>
              <h2 style={{color:'#e0e1dd'}}><center>LIVE CASES</center></h2>
              <Table countries={tableData}/>
            <h2 className="app_gt" style={{color:'#e0e1dd'}}><center>Worldwide {casesType}</center></h2>
              <Graph className="app_graph"casesType={casesType} />
  
        </CardContent>
      </Card>

      
     
    </div>
  );
}

export default App;
