import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

function getMagnitudeColor(mag) {
  if (mag >= 5.0) return "#ef4444";
  if (mag >= 3.0) return "#f59e0b";
  return "#10b981";
}

function getMagnitudeRadius(mag) {
  return Math.max(4, mag * 4);
}

function EarthquakeMap({ quakes }) {
  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {quakes.map((quake) => {
          const [lng, lat] = quake.geometry.coordinates;
          const mag = quake.properties.mag;
          const place = quake.properties.place;
          const time = new Date(quake.properties.time).toLocaleString();

          if (!lat || !lng || !mag) return null;

          return (
            <CircleMarker
              key={quake.id}
              center={[lat, lng]}
              radius={getMagnitudeRadius(mag)}
              fillColor={getMagnitudeColor(mag)}
              color={getMagnitudeColor(mag)}
              fillOpacity={0.7}
              weight={1}
            >
              <Popup>
                <strong>{place}</strong>
                <br />
                Magnitude: {mag?.toFixed(1)}
                <br />
                {time}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default EarthquakeMap;
