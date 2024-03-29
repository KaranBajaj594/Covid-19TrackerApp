import React from 'react';
import "./Map.css";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import {showDataOnMap} from "./util";

function Map({ countries,casesType,center,zoom}) {
  console.log(center);
  console.log(zoom);
  return (
    <div className="map">
       <LeafletMap center={center} zoom={zoom} scrollWheelZoom={false}>
       <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Loop through the countries and draw circles on the screen */}
        {showDataOnMap(countries,casesType)}
       </LeafletMap>
    </div>
  )
}

export default Map