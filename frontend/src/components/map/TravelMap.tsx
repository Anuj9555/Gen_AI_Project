import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LocationMarker } from './LocationMarker';
import { RouteLayer } from './RouteLayer';
import { Activity } from '../../types/itinerary';

interface TravelMapProps {
  activities: Activity[];
  destinationName?: string;
  className?: string;
}

export const TravelMap: React.FC<TravelMapProps> = ({
  activities,
  destinationName,
  className = 'h-[450px]',
}) => {
  const validActs = activities.filter((a) => a.latitude && a.longitude);

  // Determine center point
  const centerLat =
    validActs.length > 0
      ? validActs.reduce((acc, curr) => acc + curr.latitude!, 0) / validActs.length
      : 48.8566; // default Paris
  const centerLon =
    validActs.length > 0
      ? validActs.reduce((acc, curr) => acc + curr.longitude!, 0) / validActs.length
      : 2.3522;

  return (
    <div
      className={`w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative z-0 ${className}`}
    >
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RouteLayer activities={validActs} />
        {validActs.map((act, idx) => (
          <LocationMarker key={act.id || idx} activity={act} index={idx} />
        ))}
      </MapContainer>
    </div>
  );
};
