/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  RefreshCw,
  Sliders,
  Database,
  Cpu,
  History,
  Globe,
  Share2,
  Camera,
  Layers,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';

import UploadZone from './components/UploadZone';
import InteractiveMap from './components/InteractiveMap';
import DatasetViewer from './components/DatasetViewer';
import AiChat from './components/AiChat';
import { AnalysisResult, ChatMessage, GeotaggedSample } from './types';

export default function App() {
  // Application Workflows
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [predefinedDataset, setPredefinedDataset] = useState<GeotaggedSample[]>([]);

  // Selected points matching state
  const [selectedNeighborId, setSelectedNeighborId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'clues' | 'alternatives' | 'exif'>('clues');
  const [activeFeatureView, setActiveFeatureView] = useState<'profile' | 'dataset'>('profile');

  // Interactive map options
  const [satelliteMode, setSatelliteMode] = useState<boolean>(false);
  const [heatmapOverlay, setHeatmapOverlay] = useState<boolean>(false);

  // Chat conversation logs state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Saved Session History Log (Allows swapping back and forth)
  const [sessionHistory, setSessionHistory] = useState<AnalysisResult[]>([]);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState<boolean>(false);

  // Live Timer ticker for telemetry feel
  const [liveTime, setLiveTime] = useState<string>(new Date().toISOString());

  // Dynamic system startup triggers
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toISOString());
    }, 1000);

    // Load initial reference geotagged dataset nodes from server
    fetch('/api/dataset')
      .then((res) => res.json())
      .then((data) => setPredefinedDataset(data))
      .catch((err) => console.error('Failed to trigger database synchronization:', err));

    return () => clearInterval(timer);
  }, []);

  // Safe file uploaded success
  const handleUploadSuccess = async (id: string, base64Url: string, exifData: any) => {
    setCurrentImageId(id);
    setIsAnalyzing(true);
    setActiveNeighborId(null);

    try {
      // Direct call to analysis engine endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId: id }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed on server side.');
      }

      const result: AnalysisResult = await response.json();
      
      // Inject sanitized camera parameters from upload payload
      result.exifData = exifData;

      setActiveResult(result);
      setSessionHistory((prev) => {
        // Enforce uniqueness in history list
        if (prev.some((h) => h.id === result.id)) return prev;
        return [...prev, result];
      });

      // Synchronize associated AI Chat threads from server
      await fetchChatHistory(id);
    } catch (err) {
      console.error('Critical Profiling Fault:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchChatHistory = async (id: string) => {
    try {
      const response = await fetch(`/api/chat/${id}`);
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages);
      }
    } catch (err) {
      console.error('Chat thread pull failed:', err);
    }
  };

  const handleSendChatMessage = async (text: string) => {
    if (!currentImageId) return;
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: currentImageId,
          message: text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages);
      }
    } catch (err) {
      console.error('Coms delivery fault:', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Safe state restoration from History index
  const restoreHistoryProfile = (result: AnalysisResult) => {
    setActiveResult(result);
    setCurrentImageId(result.id);
    setActiveNeighboreSelection(null);
    fetchChatHistory(result.id);
    setShowHistoryDropdown(false);
  };

  const clearSession = () => {
    setActiveResult(null);
    setCurrentImageId(null);
    setSelectedNeighborId(null);
    setChatMessages([]);
  };

  const setActiveNeighborId = (id: string | null) => {
    setSelectedNeighborId(id);
  };

  const setActiveNeighboreSelection = (id: string) => {
    setSelectedNeighborId(id);
    // Find the neighbor coordinate profile and popup
    const neighbor = activeResult?.nearestNeighbors.find((n) => n.id === id);
    if (neighbor) {
      // Toggle Leaflet popup on the Map
      const mapEl = document.getElementById('map-canvas');
      if (mapEl) {
        // Safe panning event is triggered automatically inside leaflet on selectedNeighborId update.
      }
    }
  };

  const forceFocusOnCoordinates = (lat: number, lng: number, label: string) => {
    // Simply update current active result with simulated map coordinates if user manual selects dataset entry
    setActiveTab('clues');
  };

  const copyResultShareLink = () => {
    if (!activeResult) return;
    const shareUrl = `${window.location.origin}/api/results/${activeResult.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('SECURE SHARING: Shareable API results link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* 1. Futuristic Header Control HUD Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-[1000]">
        
        {/* Core display tags */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/10">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-light text-base tracking-widest text-slate-100 font-semibold uppercase leading-none">
                GEOSPY <span className="text-cyan-400 font-extrabold font-sans">PROXIMITY</span>
              </h1>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-800/30 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                v3.25
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider mt-1">
              ORBITAL PATTERN & EMBEDMENT CORRELATION WORKSTATION
            </p>
          </div>
        </div>

        {/* Action Controls & Dynamic UTC Clock */}
        <div className="flex items-center gap-4">
          
          {/* Dynamic Telemetry timer ticker */}
          <div className="hidden lg:flex flex-col text-right font-mono text-[10px] text-slate-400 leading-normal bg-slate-900/40 px-3.5 py-2 rounded-xl border border-slate-850">
            <span className="text-slate-500 uppercase tracking-widest font-semibold">COMS SAT-LINE SYSTEM TIMER</span>
            <span className="text-cyan-400 font-medium tracking-wider mt-0.5">{liveTime} UTC</span>
          </div>

          {/* User History selector */}
          <div className="relative">
            <button
              onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
              id="btn-history-dropdown"
              className="bg-slate-900/80 hover:bg-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-slate-820 font-mono text-slate-200 uppercase tracking-wider flex items-center gap-1.5 transition-all shadow"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>History ({sessionHistory.length})</span>
            </button>

            {showHistoryDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-950/95 border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-[1100] backdrop-blur-xl">
                <div className="p-3 border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider bg-slate-900/30">
                  ESTIMATION RESULTS REGISTRY
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-900">
                  {sessionHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => restoreHistoryProfile(item)}
                      className="p-3.5 hover:bg-slate-900/60 cursor-pointer transition-all flex items-center gap-3.5"
                    >
                      <img
                        src={item.imageUrl}
                        alt="past estimation run"
                        className="w-11 h-11 object-cover rounded-lg border border-slate-800 bg-slate-900"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate font-display">
                          {item.predictedLoc.label}
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400/80 mt-0.5 flex items-center gap-2">
                          <span>Conf: {Math.round(item.confidence * 100)}%</span>
                          <span>•</span>
                          <span>{item.predictedLoc.lat.toFixed(3)}, {item.predictedLoc.lng.toFixed(3)}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                  {sessionHistory.length === 0 && (
                    <div className="p-6 text-center text-xs font-mono text-slate-500">
                      NO GEO PROFILES RESUME LOGGED YET.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {activeResult && (
            <button
              onClick={clearSession}
              id="btn-new-run"
              className="bg-cyan-600 hover:bg-cyan-500 text-xs text-white px-4 py-2.5 rounded-xl border border-cyan-400/30 font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow"
            >
              <Plus className="w-4 h-4" />
              <span>NEW SCAN</span>
            </button>
          )}

        </div>
      </header>

      {/* 2. Main Dashboard Panel Grid layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Frame uploads and profile analysis */}
        <section className="col-span-1 lg:col-span-5 flex flex-col gap-6">

          {/* Navigation Control Tabs for Left workspace */}
          <div className="flex bg-slate-950/40 p-1.5 border border-slate-850 rounded-xl font-mono text-[10px] uppercase font-bold tracking-widest">
            <button
              onClick={() => setActiveFeatureView('profile')}
              id="btn-view-profile"
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                activeFeatureView === 'profile'
                  ? 'bg-cyan-500/25 border border-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PROJECTION UNIT
            </button>
            <button
              onClick={() => setActiveFeatureView('dataset')}
              id="btn-view-dataset"
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                activeFeatureView === 'dataset'
                  ? 'bg-cyan-500/25 border border-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TRAINING REPOSITORIES
            </button>
          </div>

          {activeFeatureView === 'dataset' ? (
            <div className="flex-1 min-h-[500px]">
              <DatasetViewer
                datasetLength={predefinedDataset.length}
                dataset={predefinedDataset}
                selectedId={selectedNeighborId}
                onSelect={(id) => setActiveNeighboreSelection(id)}
                onFocusLoc={forceFocusOnCoordinates}
              />
            </div>
          ) : (
            <>
              {/* No active target currently profiled */}
              {!activeResult && !isAnalyzing ? (
                <div className="flex-1 flex flex-col justify-center min-h-[480px]">
                  <UploadZone onUploadSuccess={handleUploadSuccess} isLoading={isAnalyzing} />
                  
                  {/* Decorative terminal telemetry quotes */}
                  <div className="mt-6 border border-slate-850 rounded-2xl bg-slate-950/20 p-4 font-mono text-[10px] leading-relaxed text-slate-500">
                    <div className="text-cyan-400/80 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      COGNITIVE RADAR GEOMAP RULES
                    </div>
                    Uploaded photographs are automatically processed via multi-modal AI embeddings down to the regional ecosystem index. Estimated landscape factors analyze structural roof angles, regional vegetational biomes, sand erosion density, and climate lighting parameters.
                  </div>
                </div>
              ) : isAnalyzing ? (
                /* Cinematic Scanning overlay */
                <div className="flex-1 flex flex-col items-center justify-center border border-sky-500/35 bg-sky-950/5 relative rounded-3xl p-8 min-h-[480px] overflow-hidden">
                  <div className="absolute inset-0 bg-[#070a13]/80 backdrop-blur-sm z-0"></div>
                  
                  {/* High tech Radar scanner sweeping lines */}
                  <div className="absolute left-0 w-full h-[3px] bg-cyan-400/80 shadow-lg shadow-cyan-400/80 z-20 scanning-bar opacity-80"></div>
                  
                  <div className="z-10 flex flex-col items-center text-center max-w-sm">
                    <Compass className="w-14 h-14 text-cyan-400 animate-spin mb-6" style={{ animationDuration: '4s' }} />
                    <h3 className="font-display font-light text-slate-100 uppercase tracking-widest text-base font-bold scale-102">
                      ESTIMATING SPACE VECTOR
                    </h3>
                    <p className="font-mono text-[11px] text-cyan-400 uppercase tracking-widest mt-2 px-3 py-1 rounded bg-cyan-950/40 border border-cyan-800/40 font-semibold">
                      QUERYING GEMINI NEURAL NETWORKS
                    </p>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      Calculating terrain matches, architectural patterns, solar angles, and estimating world geodesic coordinates with vector closest points...
                    </p>
                  </div>
                </div>
              ) : (
                /* Primary Geolocation Results Profile Display */
                <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
                  
                  {/* Image Display Card with Scanning Sweeps */}
                  <div className="relative w-full h-[240px] bg-slate-950 overflow-hidden group">
                    <img
                      src={activeResult.imageUrl}
                      alt="target geolocation file"
                      className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                    />

                    {/* HUD Overlay details for cyberpunk aesthetic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>
                    
                    {/* Floating confidence percentage pill */}
                    <div className="absolute top-4 left-4 bg-emerald-500 border border-emerald-400/40 text-black px-3 py-1 rounded-xl font-mono text-[11px] font-bold shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{Math.round(activeResult.confidence * 100)}% CONFIDENCE</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest font-semibold block">
                          DETECTION OUTCOME
                        </span>
                        <h2 className="font-display text-base font-bold text-slate-100 mt-1 flex items-center gap-1.5 leading-none">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          {activeResult.predictedLoc.label}
                        </h2>
                      </div>

                      <button
                        onClick={copyResultShareLink}
                        id="btn-share-link"
                        className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all shadow"
                        title="Copy share results API"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tabs Selector list (Terrain / Alternatives / EXIF) */}
                  <div className="flex border-b border-slate-800 bg-slate-950/30 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <button
                      onClick={() => setActiveTab('clues')}
                      id="tab-btn-clues"
                      className={`flex-1 py-3 text-center transition-all border-b-2 ${
                        activeTab === 'clues'
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Landscaping
                    </button>
                    <button
                      onClick={() => setActiveTab('alternatives')}
                      id="tab-btn-alts"
                      className={`flex-1 py-3 text-center transition-all border-b-2 ${
                        activeTab === 'alternatives'
                          ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Alternatives ({activeResult.alternatives.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('exif')}
                      id="tab-btn-exif"
                      className={`flex-1 py-3 text-center transition-all border-b-2 ${
                        activeTab === 'exif'
                          ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      EXIF data
                    </button>
                  </div>

                  {/* Tab Contents Frame */}
                  <div className="flex-1 p-4 overflow-y-auto max-h-[380px] space-y-4">
                    
                    {activeTab === 'clues' && (
                      <div className="space-y-3.5">
                        <div className="p-3 bg-slate-950/30 border border-slate-850 rounded-xl leading-normal text-xs text-slate-300">
                          <span className="font-mono text-emerald-400 uppercase tracking-widest font-semibold block mb-1 text-[10px]">
                            GEOGRAPHICAL ANALYSIS
                          </span>
                          {activeResult.reasoning.explanation}
                        </div>

                        {/* Bento Grid layout of reasoning values */}
                        <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                          <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-xl flex flex-col gap-1 leading-normal">
                            <span className="text-cyan-400 font-semibold uppercase tracking-wider">Terrain & Elevation</span>
                            <p className="text-slate-300 leading-normal font-sans text-xs">{activeResult.reasoning.terrain}</p>
                          </div>
                          
                          <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-xl flex flex-col gap-1 leading-normal">
                            <span className="text-emerald-400 font-semibold uppercase tracking-wider">Vegetation & Biome</span>
                            <p className="text-slate-300 leading-normal font-sans text-xs">{activeResult.reasoning.vegetation}</p>
                          </div>

                          <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-xl flex flex-col gap-1 leading-normal">
                            <span className="text-indigo-400 font-semibold uppercase tracking-wider">Architecture Style</span>
                            <p className="text-slate-300 leading-normal font-sans text-xs">{activeResult.reasoning.architecture}</p>
                          </div>

                          <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-xl flex flex-col gap-1 leading-normal">
                            <span className="text-amber-400 font-semibold uppercase tracking-wider">Climate & Atmosphere</span>
                            <p className="text-slate-300 leading-normal font-sans text-xs">{activeResult.reasoning.climate}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'alternatives' && (
                      <div className="space-y-3">
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                          Secondary possible location coordinates:
                        </p>
                        
                        {activeResult.alternatives.map((alt, index) => (
                          <div
                            key={index}
                            className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between font-sans transition-all hover:bg-slate-950/70"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                <h4 className="font-display font-semibold text-xs text-slate-200">
                                  {alt.label}
                                </h4>
                              </div>
                              <span className="font-mono text-[10px] text-slate-400 block mt-1">
                                Latitude: {alt.lat.toFixed(4)}, Longitude: {alt.lng.toFixed(4)}
                              </span>
                            </div>

                            <div className="text-right font-mono">
                              <span className="text-[11px] text-amber-400 font-bold block">
                                {Math.round(alt.confidence * 100)}% Match
                              </span>
                              <span className="text-[9px] text-slate-500 block mt-0.5">
                                {alt.distanceKm} km away
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'exif' && (
                      <div className="space-y-3 font-mono text-[11px]">
                        <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl divide-y divide-slate-800">
                          <div className="py-2.5 flex items-center justify-between">
                            <span className="text-slate-400 uppercase tracking-wide">CAMERA SENSOR</span>
                            <span className="text-slate-200 font-medium font-sans text-xs">
                              {activeResult.exifData?.cameraModel || 'Generic Recipient Sensor'}
                            </span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between">
                            <span className="text-slate-400 uppercase tracking-wide">LENS METRICS</span>
                            <span className="text-slate-200 font-sans text-xs">
                              {activeResult.exifData?.lens || 'Adjustable Wide Angle'}
                            </span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between">
                            <span className="text-slate-400 uppercase tracking-wide">FOCAL FACTOR</span>
                            <span className="text-slate-200 font-sans text-xs">
                              {activeResult.exifData?.focalLength || 'Fitted Range'}
                            </span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between">
                            <span className="text-slate-400 uppercase tracking-wide">EXPOSURE RATIO</span>
                            <span className="text-slate-200">
                              {activeResult.exifData?.exposure || 'Auto Shutter'}
                            </span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between">
                            <span className="text-slate-400 uppercase tracking-wide">ISO RATING</span>
                            <span className="text-slate-200">
                              {activeResult.exifData?.iso || '120'}
                            </span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between">
                            <span className="text-slate-400 uppercase tracking-wide">METADATA GPS</span>
                            <span className="text-emerald-400 font-semibold text-[10px] break-all leading-normal text-right">
                              {activeResult.exifData?.gpsStatus || 'Wiped for Privacy Assurance'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </>
          )}

        </section>

        {/* Right Side: Map Canvas frame & Vector matching neighbors */}
        <section className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          
          {/* Interactive Map view panel */}
          <div className="h-[440px] w-full shrink-0">
            <InteractiveMap
              predictedLoc={activeResult ? activeResult.predictedLoc : null}
              alternatives={activeResult ? activeResult.alternatives : []}
              nearestNeighbors={activeResult ? activeResult.nearestNeighbors : []}
              selectedNeighborId={selectedNeighborId}
              onNeighborClick={setActiveNeighborId}
              satelliteMode={satelliteMode}
              setSatelliteMode={setSatelliteMode}
              heatmapOverlay={heatmapOverlay}
              setHeatmapOverlay={setHeatmapOverlay}
            />
          </div>

          {/* Under Map: Nearest-Neighbor Vector search query results */}
          {activeResult && (
            <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                    Vector Nearest-Neighbor Coordinates Points Match
                  </h3>
                </div>
                <span className="font-mono text-[9px] text-cyan-400 uppercase px-2 py-0.5 rounded bg-cyan-950/20 border border-cyan-900/20 font-bold tracking-widest leading-none">
                  K-N-N METRIC ENABLED
                </span>
              </div>

              {/* Nearest Vectors Slider Card list */}
              <div className="p-4 overflow-x-auto select-none">
                <div className="flex gap-4 min-w-[500px]">
                  {activeResult.nearestNeighbors.map((neighbor) => {
                    const isSelected = neighbor.id === selectedNeighborId;
                    return (
                      <div
                        key={neighbor.id}
                        onClick={() => setActiveNeighboreSelection(neighbor.id)}
                        className={`p-3 rounded-xl border flex-1 min-w-[190px] max-w-[210px] transition-all cursor-pointer select-none leading-normal ${
                          isSelected
                            ? 'bg-slate-950/90 border-cyan-400 shadow-xl shadow-cyan-500/5'
                            : 'bg-slate-950/30 border-slate-850 hover:bg-slate-950/50 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800/80 uppercase font-semibold">
                            {neighbor.source}
                          </span>
                          
                          <span className="font-mono text-[10px] text-cyan-400 font-bold">
                            {(neighbor.similarityScore * 100).toFixed(1)}% match
                          </span>
                        </div>

                        <h4 className="font-display font-semibold text-xs text-slate-200 mt-2 truncate">
                          {neighbor.title}
                        </h4>

                        <div className="mt-2.5 flex items-center justify-between border-t border-slate-900 pt-2 font-mono text-[10px] text-slate-400 leading-none">
                          <span>{neighbor.distanceKm} km offset</span>
                          <span className="text-cyan-400 flex items-center font-bold">
                            SELECT <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* AI Chat conversational box assistant synced situationally */}
          {activeResult && (
            <div className="shrink-0">
              <AiChat
                imageId={activeResult.id}
                messages={chatMessages}
                onSendMessage={handleSendChatMessage}
                isSending={isSendingChat}
              />
            </div>
          )}

        </section>

      </main>

      {/* Control room background design hints */}
      <footer className="border-t border-slate-900/60 p-4 bg-slate-950/50 text-center font-mono text-[9px] text-slate-500 uppercase tracking-widest">
        <span>SECURITY VERIFIED • DATA TRANSMISSION CLEANSED • CLOUD RUN CONTAINED</span>
      </footer>
    </div>
  );
}
