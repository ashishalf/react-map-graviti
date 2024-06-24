import React, { useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Header from './components/Header';

const App = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

  const calculateDistance = async () => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.rows[0].elements[0].status === 'OK') {
        const distance = data.rows[0].elements[0].distance.text;
        setDistance(distance);

        // Fetch coordinates for origin and destination
        const originResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${origin}&key=${apiKey}`
        );
        const destinationResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${apiKey}`
        );

        const originLocation = originResponse.data.results[0].geometry.location;
        const destinationLocation = destinationResponse.data.results[0].geometry.location;

        setOriginCoords(originLocation);
        setDestinationCoords(destinationLocation);
      } else {
        setDistance('Unable to calculate distance');
      }
    } catch (error) {
      console.error('Error fetching distance:', error);
      setDistance('Error fetching distance');
    }
  };

  return (
    <>
      <Header />
      <p className="text-center mt-5 text-blue-800">
        Let's calculate <span className="font-bold">distance</span> from Google Map
      </p>

<div className="flex flex-col items-center justify-center min-h-screen">

      <div className="flex flex-row items-start mt-5 w-full justify-center space-x-10">
        {/* Input Area */}
        <div className="flex flex-col">
          <label htmlFor="origin" className="text-xs">
            Origin
          </label>
          <input
            type="text"
            className="border-2 p-2 rounded-md w-80"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <label htmlFor="destination" className="mt-5 text-xs">
            Destination
          </label>
          <input
            type="text"
            className="border-2 p-2 rounded-md w-80"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button
            type="submit"
            className="border-2 p-2 rounded-full w-80 bg-blue-800 text-white mt-5"
            onClick={calculateDistance}
          >
            Calculate
          </button>
          <div className="bg-white w-80 flex flex-row justify-between p-4 rounded-md mt-20">
            <h1 className="font-bold">Distance</h1>
            <h1 className="text-xl font-bold text-blue-600">{distance} kms</h1>
          </div>
          <p className="text-xxs w-80 mt-1">
            {distance
              ? `The distance between ${origin} and ${destination} via the selected route is ${distance} kms.`
              : ''}
          </p>
        </div>

        {/* Map */}
        <div className="flex items-center justify-center">
          {originCoords && destinationCoords && (
            <LoadScript googleMapsApiKey={apiKey}>
              <GoogleMap
                mapContainerStyle={{ width: '600px', height: '500px' }}
                center={{
                  lat: (originCoords.lat + destinationCoords.lat) / 2,
                  lng: (originCoords.lng + destinationCoords.lng) / 2,
                }}
                zoom={8}
              >
                <Marker position={originCoords} />
                <Marker position={destinationCoords} />
              </GoogleMap>
            </LoadScript>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default App;
