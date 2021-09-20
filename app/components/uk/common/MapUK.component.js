import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Marker,
  GoogleMap,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import mapUKStyles from "./mapUKStyles";
import { getInitials } from "../../common/Avatar.component";

const containerStyle = {
  width: "100%",
  height: "80vh",
  minHeight: "600px",
};

const center = {
  lat: 54.2511,
  lng: -4.4632,
};

const options = {
  styles: mapUKStyles,
  disableDefaultUI: true,
  zoomControl: true,
  minZoom: 5.5,
  maxZoom: 16,
  restriction: {
    latLngBounds: {
      north: 59,
      south: 49,
      west: -21,
      east: 14,
    },
    strictBounds: false,
  },
};

const waypts = [
  "Epping, England",
  "Caistor, England",
  "Market Weighton, England",
  "Middleton Tyas, England",
  "Alston, England",
  "Moffat, Scotland",
].map((address) => ({ location: address, stopover: true }));

const MapUK = ({ teams, team }) => {
  const londonOffice = { lat: 51.5255401, lng: -0.0827686 };
  const edinburghOffice = { lat: 55.953222, lng: -3.194448 };
  
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [setError] = useState(null);

  useEffect(() => {
    const google = window.google;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: londonOffice,
        destination: edinburghOffice,
        waypoints: waypts,
        optimizeWaypoints: true,
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
              if (!nextPath) break;

              let distanceInMeters =
                google.maps.geometry.spherical.computeDistanceBetween(
                  path,
                  nextPath
                ) / 1000.0;
              distanceSum += distanceInMeters;
              if (team.totalDistanceConverted <= distanceSum) {
                tempMarkers.push({ ...team, lat: path.lat(), lng: path.lng() });
                break;
              }
            }
          });
          setMarkers(tempMarkers);

          setSelectedTeam(
            team &&
              tempMarkers.filter((marker) => {
                return marker.name.toLowerCase() === team.name.toLowerCase();
              })[0]
          );
        } else {
          setError(result);
        }
      }
    );
  }, [teams]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={selectedTeam ? 8 : 6}
      center={
        selectedTeam
          ? {
              lat: selectedTeam.lat,
              lng: selectedTeam.lng,
            }
          : center
      }
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
        position={edinburghOffice}
        icon={{
          scaledSize: new window.google.maps.Size(100, 100),
          url: "https://findicons.com/files/icons/2061/f1/128/checkered_flag.png",
          anchor: new window.google.maps.Point(2, 95),
        }}
      />

      {markers.map((marker) => (
        <Marker
          key={marker.name}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelectedInfo(marker);
          }}
          onMouseLeave={() => {
            setSelectedInfo(null);
          }}
          icon={{
            url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><circle fill='rgb(255,69,27)' cx='15' cy='15' r='15'/><text text-anchor='middle' x='15' y='20' fill='white' font-size='15' font-family='Helvetica'>${getInitials(
              marker.name
            )}</text></svg>`,
            anchor: new window.google.maps.Point(15, 30),
          }}
        />
      ))}

      {selectedInfo ? (
        <InfoWindow
          style={{ marginTop: 10, padding: 14, borderRadius: 4 }}
          className="info"
          position={{ lat: selectedInfo.lat, lng: selectedInfo.lng }}
          onCloseClick={() => {
            setSelectedInfo(null);
          }}
        >
          <div className="map-pop-up">
            <svg width={50} height={50}>
              <circle fill="rgb(255,69,27)" cx="25" cy="25" r="25" />
              <text
                textAnchor="middle"
                x="25"
                y="32"
                fill="white"
                fontSize="22"
                fontFamily="Helvetica"
              >
                {getInitials(selectedInfo.name)}
              </text>
            </svg>
            <div className="map-pop-up-content">
              <div>
                <span className="map-team-name">{selectedInfo.name}</span>
                <span className="map-distance">
                  {selectedInfo.totalDistanceConverted}km
                </span>
              </div>
              <div className="map-position">#{selectedInfo.position}</div>
            </div>
          </div>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
};

MapUK.propTypes = {
  teams: PropTypes.array.isRequired,
  team: PropTypes.object,
};

export default MapUK;
