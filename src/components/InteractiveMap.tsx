/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LatLng, NearestNeighborMatch, AlternativePrediction } from '../types';
import { Compass, Layers, Minimize2, ZoomIn, Eye, ShieldAlert, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
  predictedLoc: (LatLng & { label: string }) | null;
  alternatives: AlternativePrediction[];
  nearestNeighbors: NearestNeighborMatch[];
  selectedNeighborId: string | null;
  onNeighborClick: (id: string) => void;
  satelliteMode: boolean;
  setSatelliteMode: (val: boolean) => void;
  heatmapOverlay: boolean;
  setHeatmapOverlay: (val: boolean) => void;
}

export default function InteractiveMap({
  predictedLoc,
  alternatives,
  nearestNeighbors,
  selectedNeighborId,
  onNeighborClick,
  satelliteMode,
  setSatelliteMode,
  heatmapOverlay,
  setHeatmapOverlay,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const connectionsRef = useRef<L.FeatureGroup | null>(null);

  // Tile layer references to trigger dynamic changes smoothly
  const darkTilesRef = useRef<L.TileLayer | null>(null);
  const satelliteTilesRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create a vanilla Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;

    // Load Dark Matter Map Tiles (CartoDB)
    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
    });
    darkTiles.addTo(map);
    darkTilesRef.current = darkTiles;

    // Load satellite imagery (ESRI World Imagery)
    const satTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
    });
    satelliteTilesRef.current = satTiles;

    // Layer groups for markers and geodetic connections
    const markersGroup = L.layerGroup().addTo(map);
    markersRef.current = markersGroup;

    const connectionsGroup = L.featureGroup().addTo(map);
    connectionsRef.current = connectionsGroup;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Tile Layer based on Satellite Mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (satelliteMode) {
      if (darkTilesRef.current) map.removeLayer(darkTilesRef.current);
      if (satelliteTilesRef.current) {
        satelliteTilesRef.current.addTo(map);
        // Add subtle class for satellite coloring
        const container = satelliteTilesRef.current.getContainer();
        if (container) {
          container.classList.add('satellite-map-tiles');
        }
      }
    } else {
      if (satelliteTilesRef.current) map.removeLayer(satelliteTilesRef.current);
      if (darkTilesRef.current) {
        darkTilesRef.current.addTo(map);
        const container = darkTilesRef.current.getContainer();
        if (container) {
          container.classList.add('dark-map-tiles');
        }
      }
    }
  }, [satelliteMode]);

  // Sync Markers and Connections when predictions change
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersRef.current;
    const connectionsGroup = connectionsRef.current;

    if (!map || !markersGroup || !connectionsGroup) return;

    // Clear previous elements
    markersGroup.clearLayers();
    connectionsGroup.clearLayers();

    if (!predictedLoc) return;

    // 1. Plot Heatmap Overlay if requested (using geometric indicators)
    if (heatmapOverlay) {
      // Add heat ring at prediction point
      const heatRing = L.circle([predictedLoc.lat, predictedLoc.lng], {
        radius: 1200000, // 1200km radius
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        weight: 1,
        dashArray: '5, 10',
      }).addTo(connectionsGroup);

      // Add heat core at prediction point
      L.circle([predictedLoc.lat, predictedLoc.lng], {
        radius: 400000,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.35,
        weight: 1,
      }).addTo(connectionsGroup);
    }

    // 2. High-Tech Glow Core for Predicted Location
    const predIcon = L.divIcon({
      className: 'custom-pred-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full border-2 border-emerald-500 animate-ping opacity-60"></div>
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400"></div>
          <div class="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-lg shadow-emerald-500/50"></div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    L.marker([predictedLoc.lat, predictedLoc.lng], { icon: predIcon })
      .addTo(markersGroup)
      .bindPopup(`
        <div class="bg-slate-900 text-white p-2.5 rounded border border-emerald-500/30 text-xs font-sans max-w-xs">
          <div class="font-mono text-emerald-400 uppercase font-semibold text-[10px] tracking-widest">ESTIMATED TARGET</div>
          <div class="font-display text-sm font-bold mt-1 text-slate-100">${predictedLoc.label}</div>
          <div class="mt-1 font-mono text-[11px] text-slate-400">Coordinates: ${predictedLoc.lat.toFixed(5)}, ${predictedLoc.lng.toFixed(5)}</div>
        </div>
      `);

    // 3. Render Nearest Neighbors on Map
    nearestNeighbors.forEach((neighbor) => {
      const isSelected = neighbor.id === selectedNeighborId;
      const neighborIcon = L.divIcon({
        className: `custom-neighbor-marker-${neighbor.id}`,
        html: `
          <div class="relative flex items-center justify-center transition-transform hover:scale-125 cursor-pointer">
            ${isSelected ? '<div class="absolute w-8 h-8 rounded-full bg-cyan-400/30 border border-cyan-400 animate-pulse"></div>' : ''}
            <div class="w-3.5 h-3.5 rounded-full ${isSelected ? 'bg-cyan-400 ring-2 ring-white scale-110' : 'bg-slate-800 border-2 border-cyan-500'} shadow-md"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const neighborMarker = L.marker([neighbor.lat, neighbor.lng], { icon: neighborIcon })
        .addTo(markersGroup);

      neighborMarker.on('click', () => {
        onNeighborClick(neighbor.id);
      });

      // Bind simple overlay coordinates
      neighborMarker.bindPopup(`
        <div class="bg-slate-950 text-slate-100 p-2 rounded border border-cyan-500/30 text-xs font-sans max-w-xs">
          <div class="font-mono text-cyan-400 uppercase font-semibold text-[10px] tracking-widest">NEIGHBOR MATCH</div>
          <div class="font-display font-medium mt-1">${neighbor.title}</div>
          <div class="text-[10px] text-slate-400 font-mono mt-1">Spatial Distance: ${neighbor.distanceKm} km</div>
          <div class="text-[10px] text-emerald-400 font-mono">Similarity: ${(neighbor.similarityScore * 100).toFixed(1)}%</div>
        </div>
      `);

      // Draw geodesic connector line from predicted location to matched database sample
      const pathLine = L.polyline([[predictedLoc.lat, predictedLoc.lng], [neighbor.lat, neighbor.lng]], {
        color: isSelected ? '#22d3ee' : '#1e293b',
        weight: isSelected ? 2.5 : 1,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: isSelected ? '4, 4' : '6, 8',
      }).addTo(connectionsGroup);

      if (isSelected) {
        pathLine.bringToFront();
      }
    });

    // 4. Render Alternative Candidates
    alternatives.forEach((alt, idx) => {
      const altIcon = L.divIcon({
        className: `custom-alt-marker-${idx}`,
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-3 h-3 rounded-full bg-amber-500 border border-white opacity-80"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker([alt.lat, alt.lng], { icon: altIcon })
        .addTo(markersGroup)
        .bindPopup(`
          <div class="bg-slate-950 text-slate-100 p-1.5 rounded border border-amber-500/30 text-xs font-sans">
            <div class="font-mono text-amber-400 text-[9px] uppercase tracking-wider font-semibold">CANDIDATE PEAK [${idx + 1}]</div>
            <div class="font-medium text-slate-200">${alt.label}</div>
            <div class="font-mono text-[10px] text-slate-400">Var Confidence: ${Math.round(alt.confidence * 100)}%</div>
          </div>
        `);
    });

  }, [predictedLoc, alternatives, nearestNeighbors, selectedNeighborId, heatmapOverlay]);

  // Handle Dynamic Visual Earth-Fly zoom effect on analysis completion
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !predictedLoc) return;

    // Earth Zoom out first to see continents, then drop-in to the spot
    const flyDuration = 3.2; // seconds
    
    // Zoom out first if we are currently zoomed in
    if (map.getZoom() > 4) {
      map.setView([map.getCenter().lat, map.getCenter().lng], 3, { animate: true });
      setTimeout(() => {
        map.flyTo([predictedLoc.lat, predictedLoc.lng], 13, {
          duration: flyDuration - 1,
          easeLinearity: 0.25,
        });
      }, 800);
    } else {
      map.flyTo([predictedLoc.lat, predictedLoc.lng], 13, {
        duration: flyDuration,
        easeLinearity: 0.25,
      });
    }

  }, [predictedLoc]);

  // Zoom to full target bounding box including all neighbors & predictedLoc
  const zoomToFitAll = () => {
    const map = mapRef.current;
    if (!map || !predictedLoc) return;

    const bounds = L.latLngBounds([L.latLng(predictedLoc.lat, predictedLoc.lng)]);
    nearestNeighbors.forEach((n) => bounds.extend(L.latLng(n.lat, n.lng)));
    alternatives.forEach((a) => bounds.extend(L.latLng(a.lat, a.lng)));

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  };

  const zoomToPredictedSpot = () => {
    const map = mapRef.current;
    if (!map || !predictedLoc) return;
    map.flyTo([predictedLoc.lat, predictedLoc.lng], 15);
  };

  const activeFocusLoc = selectedNeighborId
    ? nearestNeighbors.find((n) => n.id === selectedNeighborId) || predictedLoc
    : predictedLoc;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#090d16]">
      {/* Target Canvas map container */}
      <div ref={mapContainerRef} className="w-full h-full" id="map-canvas" />

      {/* Cyberpunk Map UI Overlays / Controls */}
      <div className="absolute top-4 left-4 z-[999] flex flex-col gap-2">
        <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>ESTIMATOR RADAR v2.91</span>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-[999] flex flex-col gap-2">
        {/* Toggle Satellite View Mode */}
        <button
          onClick={() => setSatelliteMode(!satelliteMode)}
          id="btn-toggle-satellite"
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-lg ${
            satelliteMode
              ? 'bg-emerald-500 border-emerald-400 text-white'
              : 'bg-slate-950/85 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
          title="Satellite View Mode"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Toggle Heatmap Visual Overlay */}
        <button
          onClick={() => setHeatmapOverlay(!heatmapOverlay)}
          id="btn-toggle-heatmap"
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-lg ${
            heatmapOverlay
              ? 'bg-blue-500 border-blue-400 text-white'
              : 'bg-slate-950/85 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
          title="Heatmap Signal Overlay"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Manual Focus HUD Bar */}
      {predictedLoc && (
        <div className="absolute bottom-4 right-4 z-[999] flex gap-2">
          {activeFocusLoc && (
            <>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeFocusLoc.lat},${activeFocusLoc.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-google-maps-pin"
                className="bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-emerald-350 px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur shadow-lg hover:shadow-emerald-500/15 transition-all text-decoration-none"
                title="Drop a high-precision GPS Pin exactly on this landmark point using Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                GPS PIN
              </a>
              <a
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activeFocusLoc.lat},${activeFocusLoc.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-streetview-launch"
                className="bg-slate-950/90 hover:bg-slate-900 border border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-blue-350 px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur shadow-lg hover:shadow-blue-500/15 transition-all text-decoration-none"
                title="Launch Google Street View for this selected location point in a new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                STREET VIEW
              </a>
            </>
          )}
          <button
            onClick={zoomToPredictedSpot}
            id="btn-zoom-target"
            className="bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur shadow-lg hover:shadow-emerald-500/15 transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            FOCUS ON TARGET
          </button>
          <button
            onClick={zoomToFitAll}
            id="btn-fit-all"
            className="bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/40 text-cyan-400 px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur shadow-lg hover:shadow-cyan-500/15 transition-all"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            SHOW ALL VECTORS
          </button>
        </div>
      )}

      {/* Grid Overlay lines (Static aesthetics) */}
      <div className="absolute inset-0 pointer-events-none border border-slate-800/25 grid grid-cols-4 grid-rows-4 z-[400] opacity-40">
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-b border-slate-800/15"></div>
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-b border-slate-800/15"></div>
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-r border-b border-slate-800/15"></div>
        <div className="border-b border-slate-800/15"></div>
      </div>
    </div>
  );
}
