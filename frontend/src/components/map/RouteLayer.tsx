import React from 'react';
import { Polyline } from 'react-leaflet';
import { Activity } from '../../types/itinerary';

interface RouteLayerProps {
  activities: Activity[];
}

export const RouteLayer: React.FC<RouteLayerProps> = ({ activities }) => {
  const positions: [number, number][] = activities
    .filter((a) => a.latitude && a.longitude)
    .map((a) => [a.latitude!, a.longitude!]);

  if (positions.length < 2) return null;

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: '#0d9488',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.8,
      }}
    />
  );
};
