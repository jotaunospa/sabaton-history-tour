import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { HistoricalEvent } from "../types";

interface MapContainerProps {
  events: HistoricalEvent[];
  selectedEvent: HistoricalEvent;
  onSelectEvent: (event: HistoricalEvent) => void;
  apiKey?: string;
  theme?: "dark" | "daylight";
}

export default function MapContainer({
  events,
  selectedEvent,
  onSelectEvent,
  theme = "dark"
}: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const isFirstRender = useRef(true);
  const [mapType, setMapType] = useState<"dark" | "satellite">("dark");

  const darkUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const satelliteUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const vintageUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  
  const darkAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  const satelliteAttr = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
  const vintageAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Leaflet instance
    const initialMap = L.map(mapContainerRef.current, {
      center: [selectedEvent.lat, selectedEvent.lng],
      zoom: 5,
      zoomControl: false,
      attributionControl: false // keep it clean
    });

    // Add Attribution manually at bottom-right for full copyright compliance
    L.control.attribution({ position: "bottomright" }).addTo(initialMap);

    // Default Tile Layer
    const activeUrl = theme === "daylight" ? vintageUrl : darkUrl;
    const activeAttr = theme === "daylight" ? vintageAttr : darkAttr;
    const activeLayer = L.tileLayer(mapType === "dark" ? activeUrl : satelliteUrl, {
      attribution: mapType === "dark" ? activeAttr : satelliteAttr,
      maxZoom: 18
    }).addTo(initialMap);

    tileLayerRef.current = activeLayer;
    mapRef.current = initialMap;

    // Add Zoom Control in tactical location
    L.control.zoom({ position: "bottomleft" }).addTo(initialMap);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Invalidate map size on container resize (using ResizeObserver for bulletproof container tracking)
  useEffect(() => {
    if (!mapRef.current || !mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Sync / Toggle Map Type and Theme
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const activeUrl = theme === "daylight" ? vintageUrl : darkUrl;
    const activeAttr = theme === "daylight" ? vintageAttr : darkAttr;

    const url = mapType === "dark" ? activeUrl : satelliteUrl;
    const attr = mapType === "dark" ? activeAttr : satelliteAttr;

    const newLayer = L.tileLayer(url, {
      attribution: attr,
      maxZoom: 18
    }).addTo(mapRef.current);

    tileLayerRef.current = newLayer;

    // Force map to recalculate sizes at various stages of the 300ms transition
    // to ensure bulletproof rendering regardless of container size updates
    const intervals = [0, 150, 350, 600];
    intervals.forEach(delay => {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, delay);
    });
  }, [mapType, theme]);

  // Sync Camera Coordinates Flight when selected event changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Alternate camera perspective zoom levels based on event types for dynamic pacing
    const zoom = selectedEvent.id === 5 ? 11 : (selectedEvent.id % 2 === 0 ? 8 : 7);

    mapRef.current.flyTo([selectedEvent.lat, selectedEvent.lng], zoom, {
      animate: true,
      duration: 1.8,
      easeLinearity: 0.25
    });
  }, [selectedEvent]);

  // Create and sync custom markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    for (const key in markersRef.current) {
      const marker = markersRef.current[key];
      if (marker) {
        marker.remove();
      }
    }
    markersRef.current = {};

    // Generate neat tactical indicators for each milestone
    events.forEach((ev) => {
      const isSelected = ev.id === selectedEvent.id;

      // Custom DOM elements for beautiful high-fidelity designs
      const markerHtml = isSelected
        ? (theme === "daylight"
          ? `
            <div class="relative flex items-center justify-center" style="width: 60px; height: 60px; margin-left: -15px; margin-top: -15px;">
              <span class="absolute inline-flex h-12 w-12 rounded-full bg-red-700/25 animate-[ping_1.5s_infinite]"></span>
              <div class="w-9 h-9 rounded-full flex items-center justify-center border-2 border-red-700/60 shadow-[0_0_10px_rgba(185,28,28,0.4)] text-red-700 font-bold text-xs" style="background-color: #f7eed7; font-family: 'Special Elite', Courier, monospace;">
                ${ev.year}
              </div>
              <div class="absolute top-[42px] bg-[#f7eed7] text-red-700 font-bold text-[9px] px-1.5 py-0.5 rounded border border-red-700/30 uppercase tracking-widest whitespace-nowrap shadow-md" style="font-family: 'Special Elite', Courier, monospace;">
                ${ev.song}
              </div>
            </div>
          `
          : `
            <div class="relative flex items-center justify-center" style="width: 60px; height: 60px; margin-left: -15px; margin-top: -15px;">
              <span class="absolute inline-flex h-12 w-12 rounded-full bg-red-600/30 animate-[ping_1.5s_infinite]"></span>
              <div class="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center border-2 border-white/60 shadow-[0_0_15px_rgba(220,38,38,0.9)] text-white font-mono font-bold text-xs" style="background-color: #dc2626;">
                ${ev.year}
              </div>
              <div class="absolute top-[42px] bg-black/90 text-red-500 font-sans font-black text-[9px] px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest whitespace-nowrap shadow-xl">
                ${ev.song}
              </div>
            </div>
          `)
        : (theme === "daylight"
          ? `
            <div class="relative flex flex-col items-center justify-center group" style="width: 40px; height: 40px;">
              <div class="w-6.5 h-6.5 bg-[#f7eed7] border border-amber-900/30 rounded-full flex items-center justify-center text-neutral-800 font-bold text-[9px] shadow-sm" style="font-family: 'Special Elite', Courier, monospace;">
                ${ev.id}
              </div>
            </div>
          `
          : `
            <div class="relative flex flex-col items-center justify-center group" style="width: 40px; height: 40px;">
              <div class="w-6.5 h-6.5 bg-[#0d0d0f] border border-white/10 rounded-full flex items-center justify-center text-slate-400 font-mono text-[9px] font-bold shadow-black/80 shadow-md">
                ${ev.id}
              </div>
            </div>
          `);

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-leaflet-marker",
        iconSize: isSelected ? [30, 30] : [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([ev.lat, ev.lng], { icon: customIcon })
        .addTo(map)
        .on("click", () => {
          onSelectEvent(ev);
        });

      markersRef.current[ev.id] = marker;
    });

  }, [events, selectedEvent, onSelectEvent, theme]);

  return (
    <div className={`w-full h-full relative rounded-2xl overflow-hidden border ${
      theme === "daylight"
        ? "border-amber-900/20 shadow-[0_15px_35px_rgba(139,92,26,0.15)]"
        : "border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
    }`}>
      
      {/* Map layers toggles */}
      <div className={`absolute top-3 left-3 z-[1000] flex gap-1 backdrop-blur border p-1 rounded-xl ${
        theme === "daylight"
          ? "bg-[#f5ebd6]/95 border-amber-900/20 text-neutral-800"
          : "bg-black/85 border-white/10 text-slate-200"
      }`}>
        <button
          onClick={() => setMapType("dark")}
          className={`px-3 py-1 text-[10px] font-serif uppercase tracking-wider rounded-lg transition-colors cursor-pointer outline-none border-none ${
            mapType === "dark"
              ? "bg-red-600 text-white font-bold animate-pulse"
              : (theme === "daylight" ? "text-amber-900/80 hover:text-amber-950 font-bold font-typewriter" : "text-slate-400 hover:text-white")
          }`}
        >
          Mapa Táctico
        </button>
        <button
          onClick={() => setMapType("satellite")}
          className={`px-3 py-1 text-[10px] font-serif uppercase tracking-wider rounded-lg transition-colors cursor-pointer outline-none border-none ${
            mapType === "satellite"
              ? "bg-red-600 text-white font-bold animate-pulse"
              : (theme === "daylight" ? "text-amber-900/80 hover:text-amber-950 font-bold font-typewriter" : "text-slate-400 hover:text-white")
          }`}
        >
          Satélite Real
        </button>
      </div>

      {/* Actual Map Target container */}
      <div ref={mapContainerRef} className={`w-full h-full ${theme === "daylight" ? "bg-[#efe6ce]" : "bg-[#0a0a0b]"}`} />

    </div>
  );
}
