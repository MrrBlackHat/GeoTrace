/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeotaggedSample } from '../types';
import { Database, MapPin, AlignLeft, Trees, Building, CloudRain, Copy } from 'lucide-react';
import { useState } from 'react';

interface DatasetViewerProps {
  datasetLength: number;
  dataset: GeotaggedSample[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onFocusLoc: (lat: number, lng: number, label: string) => void;
}

export default function DatasetViewer({
  datasetLength,
  dataset,
  selectedId,
  onSelect,
  onFocusLoc,
}: DatasetViewerProps) {
  const [filterSource, setFilterSource] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const sources = ['All', 'Flickr', 'Mapillary', 'Google Open Images', 'Custom'];

  const filteredDataset = dataset.filter((item) => {
    const matchesSource = filterSource === 'All' || item.source === filterSource;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header HUD */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display font-bold text-sm tracking-wide text-slate-100 uppercase">
            Geotagged Dataset Registry
          </h2>
        </div>
        <span className="font-mono text-[10px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded border border-slate-700/60 font-semibold uppercase">
          {filteredDataset.length} / {datasetLength} POINTS
        </span>
      </div>

      {/* Query Filter Area */}
      <div className="p-3.5 border-b border-slate-800/50 bg-slate-950/20 flex flex-col gap-2.5">
        <input
          type="text"
          placeholder="Filter description, location, or features..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="dataset-search"
          className="w-full bg-slate-950/90 border border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-100 placeholder-slate-550 focus:outline-none focus:border-cyan-500/50"
        />

        <div className="flex flex-wrap gap-1.5">
          {sources.map((src) => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              id={`filter-btn-${src.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all border ${
                filterSource === src
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {src.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[460px]">
        {filteredDataset.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`p-3.5 rounded-xl transition-all border cursor-pointer flex flex-col gap-2.5 ${
                isSelected
                  ? 'bg-slate-950/80 border-cyan-500/60 shadow-lg shadow-cyan-500/5'
                  : 'bg-slate-950/30 border-slate-800/50 hover:bg-slate-950/50 hover:border-slate-700/50'
              }`}
            >
              {/* Card Title Bar */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-semibold text-xs leading-tight text-slate-100">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded uppercase border border-slate-800/80 font-mono">
                      {item.source}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {item.locationLabel}
                    </span>
                  </div>
                </div>

                {/* Focus locator triggers flyTo Map */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFocusLoc(item.location.lat, item.location.lng, item.title);
                  }}
                  id={`focus-loc-${item.id}`}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-all"
                  title="Plot & Center location"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Collapsible/Extended details when selected */}
              {isSelected ? (
                <div className="border-t border-slate-800/50 pt-2.5 mt-1 space-y-2 text-[11px] text-slate-300">
                  <div className="flex gap-2">
                    <AlignLeft className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400">Indicators:</span>{' '}
                      {item.description}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[10px] text-slate-400">
                    <div className="bg-slate-900/55 p-1.5 rounded border border-slate-800/50">
                      <div className="text-cyan-400 font-semibold mb-0.5 flex items-center gap-0.5 uppercase tracking-wide">
                        Terrain
                      </div>
                      <p className="line-clamp-2 text-slate-300 leading-normal">{item.terrain}</p>
                    </div>

                    <div className="bg-slate-900/55 p-1.5 rounded border border-slate-800/50">
                      <div className="text-emerald-400 font-semibold mb-0.5 flex items-center gap-0.5 uppercase tracking-wide">
                        Flora
                      </div>
                      <p className="line-clamp-2 text-slate-300 leading-normal">{item.vegetation}</p>
                    </div>

                    <div className="bg-slate-900/55 p-1.5 rounded border border-slate-800/50">
                      <div className="text-indigo-400 font-semibold mb-0.5 flex items-center gap-0.5 uppercase tracking-wide">
                        Architecture
                      </div>
                      <p className="line-clamp-2 text-slate-300 leading-normal">{item.architecture}</p>
                    </div>

                    <div className="bg-slate-900/55 p-1.5 rounded border border-slate-800/50">
                      <div className="text-amber-400 font-semibold mb-0.5 flex items-center gap-0.5 uppercase tracking-wide">
                        Climate
                      </div>
                      <p className="line-clamp-2 text-slate-300 leading-normal">{item.climate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/30 pt-2 mt-1">
                    <span className="font-mono text-[9px] text-slate-400 gap-1 flex items-center">
                      COORD: {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${item.location.lat}, ${item.location.lng}`)}
                      id={`copy-coord-${item.id}`}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-0.5"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      COPY COORDS
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          );
        })}

        {filteredDataset.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500 font-mono">
            NO MATCHING POINTS REGISTERS LOCATED.
          </div>
        )}
      </div>
    </div>
  );
}
