import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Activity } from '../../types/itinerary';

// Fix for default Leaflet icon paths in Vite bundles
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationMarkerProps {
  activity: Activity;
  index: number;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({ activity, index }) => {
  if (!activity.latitude || !activity.longitude) return null;

  return (
    <Marker position={[activity.latitude, activity.longitude]} icon={defaultIcon}>
      <Popup>
        <div className="p-1 max-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block">
            Stop {index + 1} • {activity.time}
          </span>
          <h4 className="text-xs font-bold text-slate-900 mt-0.5">{activity.title}</h4>
          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{activity.description}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">{activity.location}</p>
        </div>
      </Popup>
    </Marker>
  );
};
