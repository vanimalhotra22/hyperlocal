import { GoogleMap, Marker } from "@react-google-maps/api";

const LocationMap = ({ center, zoom = 14, markers = [], onMarkerClick, className = "h-[400px] w-full" }) => {
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  return (
    <div className={className}>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={center} zoom={zoom} options={mapOptions}>
        {markers.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} title={marker.title} onClick={() => onMarkerClick?.(marker)} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default LocationMap;
