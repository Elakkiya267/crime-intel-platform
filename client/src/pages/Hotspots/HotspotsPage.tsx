import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { api, Hotspot } from '../../shared/api';
import { MapPin, ShieldAlert, Sparkles, Filter } from 'lucide-react';

export default function HotspotsPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState('All');

  // Load hotspots from backend
  useEffect(() => {
    api.getHotspots()
      .then(res => {
        setHotspots(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading hotspots:', err);
        setLoading(false);
      });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Karnataka
    const map = L.map(mapContainerRef.current, {
      center: [13.8, 76.2],
      zoom: 7,
      zoomControl: true
    });

    // Dark Premium Theme Map Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Markers when hotspots or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group || hotspots.length === 0) return;

    // Clear old markers
    group.clearLayers();

    // Filter
    const filtered = districtFilter === 'All'
      ? hotspots
      : hotspots.filter(h => h.district === districtFilter);

    filtered.forEach(h => {
      // Circle marker representing density
      const color = h.riskLevel === 'High' ? '#F43F5E' : '#F59E0B'; // rose-500 or amber-500
      
      const circle = L.circle([h.lat, h.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.35,
        radius: h.density * 130 // scale based on density
      });

      const popupContent = `
        <div style="font-family: Inter, sans-serif; padding: 4px; color: #1E293B;">
          <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0F172A;">${h.area}</h4>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748B;">District: <strong>${h.district}</strong></p>
          <div style="margin-top: 6px; padding: 4px 8px; background: ${h.riskLevel === 'High' ? '#FFF1F2' : '#FEF3C7'}; color: ${h.riskLevel === 'High' ? '#9F1239' : '#92400E'}; font-size: 10px; font-weight: 700; border-radius: 8px; display: inline-block;">
            ${h.riskLevel} Risk (${h.density}% Density)
          </div>
          <p style="margin: 8px 0 0 0; font-size: 11px; line-height: 1.4; color: #334155;">
            <strong>Primary Crime:</strong> ${h.primaryType}<br/>
            <strong>Patrol:</strong> <em>${h.recommendation}</em>
          </p>
        </div>
      `;

      circle.bindPopup(popupContent);
      group.addLayer(circle);

      // Add a smaller center pin marker
      const pin = L.circleMarker([h.lat, h.lng], {
        radius: 4,
        color: '#FFFFFF',
        fillColor: color,
        fillOpacity: 1,
        weight: 1.5
      });
      group.addLayer(pin);
    });

    // If a specific district is selected, zoom to it
    if (districtFilter !== 'All' && filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map(f => [f.lat, f.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
    } else {
      map.setView([13.8, 76.2], 7);
    }

  }, [hotspots, districtFilter]);

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar List and Socio-Demographic Context */}
      <div className="w-[380px] shrink-0 border-r border-[#E2E8F0] bg-white p-5 flex flex-col justify-between overflow-auto">
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Spatial Hotspots Map</h1>
            <p className="mt-1 text-xs text-slate-500">Geographic density index mapping for command center patrol routing</p>
          </div>

          {/* Filter Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">District Focus Area</label>
            <div className="relative">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none appearance-none"
              >
                <option value="All">All Districts</option>
                <option value="Bengaluru Urban">Bengaluru Urban</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Mangaluru">Mangaluru</option>
                <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
              </select>
            </div>
          </div>

          {/* Hotspot List */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Patrol Clusters</span>
            {loading ? (
              <div className="h-20 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
                {hotspots
                  .filter(h => districtFilter === 'All' || h.district === districtFilter)
                  .map(h => (
                    <div
                      key={h.id}
                      onClick={() => {
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.setView([h.lat, h.lng], 12);
                        }
                      }}
                      className="cursor-pointer rounded-xl border border-[#E2E8F0] p-3 hover:border-primary-200 hover:bg-slate-50/50 transition text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800">{h.area}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          h.riskLevel === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {h.density}%
                        </span>
                      </div>
                      <div className="mt-1 text-slate-400 font-semibold">{h.primaryType}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sociological Correlation Panel */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
            <Sparkles className="h-4 w-4" />
            <span>Socio-Demographic Heuristic</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Data models show high-density hotspots in Bengaluru Urban correlate directly with tech hubs and economic migration patterns. High unemployment among educated youth drives regional cyber fraud concentrations.
          </p>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 h-full relative">
        <div ref={mapContainerRef} className="h-full w-full bg-[#1E293B]" />
        {loading && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-[9999]">
            <div className="flex flex-col items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-[#E2E8F0] shadow-soft text-xs font-bold text-slate-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
              Initializing Geospatial Map layers...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
