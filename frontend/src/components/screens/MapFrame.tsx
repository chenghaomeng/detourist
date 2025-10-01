// MapFrame.tsx (Leaflet / OSM, container-height aware)
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  className?: string;
  waypoints?: any[];
  showRoute?: boolean;
  showAvoidArea?: boolean;
};

function AutoResize() {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    return () => ro.disconnect();
  }, [map]);
  return null;
}

export function MapFrame({ className }: Props) {
  return (
    <div className={className}>
      <div className="h-full w-full">
        <MapContainer
          center={[37.7749, -122.4194]}
          zoom={11}
          style={{ height: '100%', width: '100%' }} // critical: fill parent
          preferCanvas
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <AutoResize />
        </MapContainer>
      </div>
    </div>
  );
}