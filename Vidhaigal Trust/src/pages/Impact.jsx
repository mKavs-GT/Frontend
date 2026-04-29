import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const statusColors = {
  Active: '#2D6A4F',
  Planning: '#F4C430',
  Completed: '#6B7280'
};

const categoryColors = {
  Environment: '#2D6A4F',
  Health: '#C62828',
  Community: '#1565C0',
  Education: '#F57F17'
};

const markers = [
  { center: [13.0827, 80.2707], district: 'Chennai', status: 'Active', name: 'Green Canopy Project', category: 'Environment', progress: 75, lead: 'Ramesh K.', beneficiaries: '2,400' },
  { center: [11.0168, 76.9558], district: 'Coimbatore', status: 'Active', name: 'Women Empowerment Skills', category: 'Community', progress: 55, lead: 'Priya M.', beneficiaries: '380' },
  { center: [9.9252, 78.1198], district: 'Madurai', status: 'Active', name: 'Clean Water Access', category: 'Health', progress: 90, lead: 'Anita R.', beneficiaries: '1,200' },
  { center: [10.7905, 78.7047], district: 'Trichy', status: 'Active', name: 'Mobile Health Clinics', category: 'Health', progress: 65, lead: 'Suresh S.', beneficiaries: '890' },
  { center: [11.6643, 78.1460], district: 'Salem', status: 'Planning', name: 'Plastic-Free Coasts', category: 'Environment', progress: 30, lead: 'Karthik B.', beneficiaries: '600' },
  { center: [12.9165, 79.1325], district: 'Vellore', status: 'Active', name: 'Rural Education Initiative', category: 'Education', progress: 40, lead: 'Meena S.', beneficiaries: '750' },
  { center: [12.5186, 78.2137], district: 'Krishnagiri', status: 'Active', name: 'City Forest Alpha', category: 'Environment', progress: 65, lead: 'Ramesh K.', beneficiaries: '1,100' },
  { center: [10.7870, 79.1378], district: 'Thanjavur', status: 'Planning', name: 'Village Solar Setup', category: 'Community', progress: 10, lead: 'Priya M.', beneficiaries: '450' }
];

const Impact = () => {
  return (
    <div className="pt-20 bg-white">
      {/* A) HERO STRIP */}
      <section className="bg-primary py-20 text-center text-white">
        <h1 className="text-5xl font-extrabold text-white mb-4">Impact Map</h1>
        <p className="text-xl text-green-200">
          Every marker is a real project. Every project is a real life changed.
        </p>
      </section>

      {/* B) STAT STRIP */}
      <section className="bg-beige py-8 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-1">🗺️</span>
              <span className="text-3xl font-bold text-primary">8</span>
              <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Districts</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-1">📋</span>
              <span className="text-3xl font-bold text-primary">350+</span>
              <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Projects</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-1">👥</span>
              <span className="text-3xl font-bold text-primary">1,500+</span>
              <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Volunteers</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-1">❤️</span>
              <span className="text-3xl font-bold text-primary">12,000+</span>
              <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Lives</span>
            </div>
          </div>
        </div>
      </section>

      {/* C) LEAFLET MAP */}
      <section className="relative">
        <MapContainer 
          center={[11.1271, 78.6569]} 
          zoom={7} 
          style={{ height: '65vh', width: '100%', zIndex: 0 }} 
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {markers.map((marker, index) => (
            <CircleMarker
              key={index}
              center={marker.center}
              radius={10}
              pathOptions={{
                fillColor: statusColors[marker.status],
                color: '#ffffff',
                weight: 2,
                fillOpacity: 0.9
              }}
            >
              <Popup>
                <div className="min-w-[200px] font-sans p-1">
                  <p className="font-bold text-sm mb-2">
                    {marker.name}
                  </p>
                  
                  <div className="flex gap-1 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{background: categoryColors[marker.category]}}>
                      {marker.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{background: statusColors[marker.status]}}>
                      {marker.status}
                    </span>
                  </div>
                  
                  <div className="mb-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span className="font-bold">
                        {marker.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: `${marker.progress}%`}}>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-600">
                    <p>👤 Lead: {marker.lead}</p>
                    <p>❤️ Beneficiaries: {marker.beneficiaries}</p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        
        {/* MAP LEGEND */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-white rounded-lg shadow-md p-3 text-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-3 h-3 rounded-full" style={{backgroundColor: statusColors.Active}}></span>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-3 h-3 rounded-full" style={{backgroundColor: statusColors.Planning}}></span>
            <span>Planning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{backgroundColor: statusColors.Completed}}></span>
            <span>Completed</span>
          </div>
        </div>
      </section>

      {/* D) PROJECT LIST */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8">All Projects</h2>
          
          <div className="flex flex-col space-y-3">
            {markers.map((marker, index) => (
              <div key={index} className="rounded-xl border border-gray-100 shadow-sm px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:w-1/3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor: statusColors[marker.status]}}></span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{marker.name}</h3>
                    <p className="text-sm text-gray-500">{marker.district}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 md:w-1/3 justify-start md:justify-center">
                  <span className="text-xs px-2.5 py-1 rounded-full text-white whitespace-nowrap" style={{background: categoryColors[marker.category]}}>
                    {marker.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2 hidden sm:block">
                      <div className="bg-primary h-2 rounded-full" style={{width: `${marker.progress}%`}}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{marker.progress}%</span>
                  </div>
                </div>
                
                <div className="md:w-1/3 text-left md:text-right">
                  <span className="text-sm font-medium text-gray-700">❤️ {marker.beneficiaries} beneficiaries</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;
