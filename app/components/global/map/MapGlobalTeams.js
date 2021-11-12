import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Marker,
  GoogleMap,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import mapGlobalStyles from "./mapGlobalStyles";
import { getInitials } from "../../common/Avatar.component";
import GreenFlag from "./images/green-flag-icon.png"

const containerStyle = {
  width: "100%",
  height: "80vh",
  minHeight: "600px",
  maxHeight: "900px"
};

const center = {
  lat: 35.3,
  lng: 138.78,
};

const options = {
  styles: mapGlobalStyles,
  disableDefaultUI: true,
  zoomControl: true,
  minZoom: 10.2,
  maxZoom: 16,
  restriction: {
    latLngBounds: {
      north: 36.3,
      south: 34.3,
      west: 137.4,
      east: 140,
    },
    strictBounds: false,
  },
};

const waypts = [
  { location: {lat: 35.407600, lng: 138.876099}, stopover: true },
  { location: {lat: 35.491332, lng: 138.814069}, stopover: true },
  { location: {lat: 35.488204, lng: 138.626738}, stopover: true },
  { location: {lat: 35.403311, lng: 138.582331}, stopover: true },
  { location: {lat: 35.218391, lng: 138.520095}, stopover: true },
  { location: {lat: 35.174668, lng: 138.668790}, stopover: true },
  { location: {lat: 35.119774, lng: 138.897975}, stopover: true },
];

const MapGlobal = ({ teams, team }) => {
  const startWaypoint = { lat: 35.343063, lng: 138.979701 };
  const endWaypoint = { lat: 35.224776, lng: 139.025263 };
  
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
        origin: startWaypoint,
        destination: endWaypoint,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
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
      zoom={selectedTeam ? 12 : 10.2}
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
            polylineOptions: { strokeColor: "rgb(257,196,55)" },
          }}
        />
      )}
      <Marker
        className="marker"
        position={endWaypoint}
        icon={{
          scaledSize: new window.google.maps.Size(100, 100),
          url: "https://findicons.com/files/icons/2061/f1/128/checkered_flag.png",
          anchor: new window.google.maps.Point(2, 95),
        }}
      />
      <Marker
        className="marker"
        position={startWaypoint}
        icon={{
          scaledSize: new window.google.maps.Size(100, 100),
          url: "https://png2.cleanpng.com/sh/ad0dfdb2cc58c803dc30dd78090fb241/L0KzQYm3V8AzN6p0kpH0aYP2gLBuTfNwdaF6jNd7LXnmf7B6TgBmaZRqRdh1YXewg8r0gv9tNWZnS9NsMkTodLO5WcM5Nmo9UKoBN0i7QYa6UMU4P2U9TqoEN0exgLBu/kisspng-computer-icons-peace-flag-symbol-5b3ac24edb2938.9888678815305774868977.png",
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
            url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><circle fill='rgb(253,196,55)' cx='15' cy='15' r='15'/><text text-anchor='middle' x='15' y='20' fill='black' font-size='15' font-family='Helvetica'>${getInitials(
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
              <circle fill="#00AABB" cx="25" cy="25" r="25" />
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

MapGlobal.propTypes = {
  teams: PropTypes.array.isRequired,
  team: PropTypes.object,
};

export default MapGlobal;
