import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import {
  Marker,
  GoogleMap,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import { getInitials } from "./Avatar.component";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 54.2511,
  lng: -4.4632,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const MapUK = ({ teams }) => {
  const London = new window.google.maps.LatLng(51.509865, -0.118092);
  const Edinburgh = new window.google.maps.LatLng(55.953251, -3.188267);

  const [selected, setSelected] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [setError] = useState(null);

  useEffect(() => {
    const google = window.google;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: London,
        destination: Edinburgh,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          let tempMarkers = [];
          teams.map((team) => {
            let distanceSum = 0;
            for (let path of result.routes[0].overview_path) {
              let nextPath =
                result.routes[0].overview_path[
                  result.routes[0].overview_path.indexOf(path) + 1
                ];
            
              let distanceInMeters =
                google.maps.geometry.spherical.computeDistanceBetween(
                  path,
                  nextPath
                ) / 1000.0;
              distanceSum += distanceInMeters;
              if (team.totalDistance <= distanceSum) {
                tempMarkers.push({ ...team, lat: path.lat(), lng: path.lng() });
                break;
              }
            }
          });
          setMarkers(tempMarkers);
        } else {
          setError(result);
        }
      }
    );
  }, [teams]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={6}
      center={center}
      options={options}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            preserveViewport: true,
            polylineOptions: { strokeColor: "orange" },
          }}
        />
      )}
      <Marker
        className="marker"
        position={{ lat: 55.953251, lng: -3.188267 }}
        icon={{
          scaledSize: new window.google.maps.Size(100, 100),
          url:
            "https://findicons.com/files/icons/2061/f1/128/checkered_flag.png",
          anchor: new window.google.maps.Point(2, 95),
        }}
      />

      {markers.map((marker) => (
        <Marker
          className="marker"
          key={marker.name}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelected(marker);
          }}
          onMouseLeave={() => {
            setSelected(null);
          }}
          icon={{
            url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><circle fill='rgb(255,69,27)' cx='15' cy='15' r='15'/><text text-anchor='middle' x='15' y='20' fill='white' font-size='15' font-family='Helvetica'>${getInitials(
              marker.name
            )}</text></svg>`,
            anchor: new window.google.maps.Point(15, 30),
          }}
        />
      ))}

      {selected ? (
        <InfoWindow
          className="info"
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => {
            setSelected(null);
          }}
        >
          <div>
            <h2>{selected.name}</h2>
          </div>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
};

MapUK.propTypes = {
  teams: PropTypes.array.isRequired,
};

export default MapUK;
