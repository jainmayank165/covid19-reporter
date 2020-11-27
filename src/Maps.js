import React from 'react';
import { MapContainer ,TileLayer,useMap} from "react-leaflet";
import "./Map.css";
import {showDataOnMap} from './util'
function ChangeMap({center,zoom}){
    const map=useMap();
    map.setView(center,zoom);
    return null ;
}
function Maps({countries,casesType,center,zoom}) {
    return (
        
     <div className="map">   
        <MapContainer >
            <ChangeMap center={center} zoom={zoom}/>
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {showDataOnMap(countries,casesType)}
            
        </MapContainer>
    </div>
    )
}

export default Maps;

        

  
