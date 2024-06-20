import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import origin_icon from '../Images/Origin Icon.png';
import Desti_icon from '../Images/Destination Icon.png';
import 'leaflet/dist/leaflet.css';

const HomePage = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(null);
  const [originSuggestions, setOriginSuggestions] = useState([]) ;
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const handleOriginChange = async (event) => {
    const value = event.target.value;
    setOrigin(value);

    if (value.length > 2) {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
      setOriginSuggestions(response.data);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationChange = async (event) => {
    const value = event.target.value;
    setDestination(value);

    if (value.length > 2) {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
      setDestinationSuggestions(response.data);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleCalculate = async () => {
    if (origin && destination) {
      const originResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${origin}`);
      const destinationResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${destination}`);

      if (originResponse.data.length > 0 && destinationResponse.data.length > 0) {
        const originData = originResponse.data[0];
        const destinationData = destinationResponse.data[0];

        setOriginCoords({ lat: originData.lat, lon: originData.lon });
        setDestinationCoords({ lat: destinationData.lat, lon: destinationData.lon });

        const distanceResponse = await axios.get(`https://router.project-osrm.org/route/v1/driving/${originData.lon},${originData.lat};${destinationData.lon},${destinationData.lat}?overview=false`);
        const distanceInMeters = distanceResponse.data.routes[0].distance;
        const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

        setDistance(distanceInKilometers);
      } else {
        setDistance(null);
      }
    }
  };

  const originIcon = new L.Icon({
    iconUrl: origin_icon,
    iconSize: [15, 15],
    iconAnchor: [20, 24],   
    
  });
  
  const destinationIcon = new L.Icon({
    iconUrl: Desti_icon,
    iconSize: [20, 20],
    iconAnchor: [20, 24],
  });

  return (
    <div className="container">
      <div className="title">
        <h2>Let's calculate distance from Google Maps</h2>
      </div>
      <div className="maindiv">
        <div className="content-distance">
          <div className="content_calculate">
            <div className="content">
              <form>
                <div className="route mb-3">
                  <label htmlFor="Origin" className="form-label">
                    Origin
                  </label>
                  <div className="input-group">
                    <span className="input-group-text origin-icon">
                      <img src={origin_icon} alt="" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="Origin"
                      placeholder="Choose your Origin"
                      value={origin}
                      onChange={handleOriginChange}
                    />
                    <ul className="suggestions">
                      {originSuggestions.map((suggestion) => (
                        <li key={suggestion.place_id} onClick={() => { setOrigin(suggestion.display_name); setOriginSuggestions([]); }}>
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="route mb-3">
                  <label htmlFor="Destination" className="form-label">
                    Destination
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <img src={Desti_icon} alt="" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="Destination"
                      placeholder="Choose your Destination"
                      value={destination}
                      onChange={handleDestinationChange}
                    />
                    <ul className="suggestions">
                      {destinationSuggestions.map((suggestion) => (
                        <li key={suggestion.place_id} onClick={() => { setDestination(suggestion.display_name); setDestinationSuggestions([]); }}>
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </form>
            </div>
            <div className="calculate">
              <button onClick={handleCalculate}>Calculate</button>
            </div>
          </div>
          <div className="distancediv">
            <div className="distance">
            <span>Distance</span>
            <b>{distance ? `${distance} kms` : " "}</b>
            </div>
            <p style={{padding:"0px 20px" ,fontSize:"12px",fontFamily:"IBM Plex Sans"}}>The distance between {origin ??' '} and {destination ??' '} via the seleted route is {distance ? `${distance} kms` : " "}.</p>
          </div>
          
        </div>
        <div className="maps">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {originCoords && (
              <Marker position={[originCoords.lat, originCoords.lon]} icon={originIcon}>
              <Popup permanent>
                Origin: {origin}
              </Popup>
            </Marker>
            )}
            {destinationCoords && (
              <Marker position={[destinationCoords.lat, destinationCoords.lon]} icon={destinationIcon}>
              <Popup permanent>
                Destination: {destination}
              </Popup>
            </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
 export default HomePage