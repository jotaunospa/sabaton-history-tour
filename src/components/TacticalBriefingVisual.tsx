import React from "react";
import { ShieldAlert, Compass, Target, Navigation, Eye, Zap, Anchor } from "lucide-react";

interface TacticalBriefingVisualProps {
  song: string;
  year: number;
  title: string;
}

export const TacticalBriefingVisual: React.FC<TacticalBriefingVisualProps> = ({
  song,
  year,
  title,
}) => {
  // Normalize song name to select specific visual layout
  const s = song.toLowerCase();

  // Helper to generate dynamic coordinates / grid ticks
  const randomCoords = React.useMemo(() => {
    return {
      lat: (45 + Math.random() * 15).toFixed(4),
      lng: (15 + Math.random() * 15).toFixed(4),
      sector: ["ALPHA", "BRAVO", "CHARLIE", "DELTA", "ECHO"][Math.floor(Math.random() * 5)] + "-" + Math.floor(Math.random() * 100),
      frequency: (100 + Math.random() * 800).toFixed(1) + " MHz",
    };
  }, [song]);

  // Render different SVG combat designs based on the song name
  const renderTacticalDesign = () => {
    if (s.includes("baron")) {
      // Fokker Dr.I Triplane schematic
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full text-red-500 fill-current opacity-90">
          {/* Radar circle grids */}
          <circle cx="80" cy="55" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="animate-pulse" />
          <circle cx="80" cy="55" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          
          {/* Target Reticles */}
          <line x1="80" y1="2" x2="80" y2="108" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="25" y1="55" x2="135" y2="55" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          
          {/* Fokker Dr.1 schematic silhouette */}
          <g transform="translate(80, 50) scale(0.85)">
            {/* Upper wing */}
            <rect x="-42" y="-24" width="84" height="6" rx="1.5" className="animate-pulse" />
            {/* Mid wing */}
            <rect x="-36" y="-14" width="72" height="5" rx="1" />
            {/* Lower wing */}
            <rect x="-30" y="-4" width="60" height="4.5" rx="1" />
            {/* Fuselage body */}
            <path d="M-6 -14 L6 -14 L4 20 L-4 20 Z" />
            {/* Tail wing */}
            <path d="M-14 20 L14 20 L10 24 L-10 24 Z" />
            {/* Rudder */}
            <path d="M0 24 L0 32 L-4 30 Z" />
            {/* Double Propeller spinner */}
            <line x1="-15" y1="-28" x2="15" y2="-28" stroke="currentColor" strokeWidth="2" className="origin-center animate-[spin_1.5s_linear_infinite]" />
            <circle cx="0" cy="-28" r="3" fill="currentColor" />
            {/* Wheels & struts */}
            <line x1="-14" y1="-4" x2="-18" y2="4" stroke="currentColor" strokeWidth="1.5" />
            <line x1="14" y1="-4" x2="18" y2="4" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="-18" cy="4" r="3.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="18" cy="4" r="3.5" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>

          {/* Tactical Overlay tags */}
          <text x="84" y="20" className="text-[6px] font-mono fill-red-400 font-bold tracking-widest uppercase">FOKKER DR.I</text>
          <text x="84" y="27" className="text-[5px] font-mono fill-slate-400">ALT: 3,500m</text>
        </svg>
      );
    }

    if (s.includes("dreadnought") || s.includes("bismarck") || s.includes("wolfpack")) {
      // Battleship / Marine Submarine target crosshairs schematic
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full text-red-500 fill-current opacity-90">
          {/* Sea Grid lines */}
          <line x1="10" y1="85" x2="150" y2="85" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="92" x2="150" y2="92" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 1" />

          {/* Sonar sweep line */}
          <g className="origin-[80px_50px] animate-[spin_8s_linear_infinite]">
            <path d="M80 50 L135 25 A 60 60 0 0 0 80 -10 Z" fill="rgba(220, 38, 38, 0.08)" stroke="none" />
            <line x1="80" y1="50" x2="135" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          </g>
          
          {/* Sonar grid rings */}
          <circle cx="80" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="80" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="80" cy="50" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />

          {/* Warship silhouette */}
          <g transform="translate(80, 52) scale(0.9)">
            {/* Hull profile */}
            <path d="M-45 -2 L-35 -7 L35 -7 L45 -2 L38 2 L-38 2 Z" />
            {/* Superstructure decks */}
            <rect x="-24" y="-15" width="48" height="8" />
            <rect x="-16" y="-22" width="28" height="7" fill="currentColor" />
            {/* Control bridges */}
            <rect x="-6" y="-28" width="10" height="6" />
            {/* Gun turrets front and back */}
            <path d="M-30 -7 L-23 -7 L-24 -11 L-32 -11 Z" />
            <line x1="-30" y1="-11" x2="-43" y2="-15" stroke="currentColor" strokeWidth="2" />
            
            <path d="M30 -7 L23 -7 L24 -11 L32 -11 Z" />
            <line x1="30" y1="-11" x2="43" y2="-15" stroke="currentColor" strokeWidth="2" />

            {/* Masts & Antennas */}
            <line x1="-12" y1="-22" x2="-12" y2="-36" stroke="currentColor" strokeWidth="1" />
            <line x1="8" y1="-15" x2="8" y2="-30" stroke="currentColor" strokeWidth="1" />
          </g>

          {/* Radar target frame */}
          <path d="M25 25 L25 15 L35 15" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M135 25 L135 15 L125 15" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M25 75 L25 85 L35 85" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M135 75 L135 85 L125 85" fill="none" stroke="currentColor" strokeWidth="1" />

          {/* Heading overlay */}
          <text x="30" y="24" className="text-[5.5px] font-mono fill-red-400 font-bold uppercase tracking-wider">TACTICAL NAVAL</text>
          <text x="30" y="31" className="text-[5px] font-mono fill-slate-400">BRG: 142° / RANGE: 12.4 nmi</text>
        </svg>
      );
    }

    if (s.includes("paratrooper") || s.includes("eagle") || s.includes("witches") || s.includes("exile")) {
      // Airborne Parachute / Air Defense sweep map
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full text-red-500 fill-current opacity-90">
          {/* Tactical coordinate grid background */}
          <path d="M10 20 L150 20 M10 40 L150 40 M10 60 L150 60 M10 80 L150 80 M10 100 L150 100" stroke="currentColor" strokeWidth="0.2" opacity="0.15" />
          <path d="M30 10 L30 110 M60 10 L60 110 M90 10 L90 110 M120 10 L120 110" stroke="currentColor" strokeWidth="0.2" opacity="0.15" />

          {/* Compass Rose layout */}
          <circle cx="80" cy="55" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
          <polygon points="80,12 83,20 77,20" fill="currentColor" />
          <text x="78" y="10" className="text-[6px] font-mono font-bold fill-red-400">N</text>

          {/* Searchlights sweeping (especially for Night Witches / Air fights) */}
          <g className="origin-[80px_110px] animate-[pulse_4s_ease-in-out_infinite]">
            <polygon points="80,110 35,20 50,20" fill="rgba(239, 68, 68, 0.08)" stroke="none" />
            <polygon points="80,110 125,20 110,20" fill="rgba(239, 68, 68, 0.05)" stroke="none" />
          </g>

          {/* Airborne parachute/planes icons */}
          <g transform="translate(80, 50)" className="animate-bounce">
            {/* Fighter plane outline */}
            <path d="M-15 -6 L15 -6 L2 -8 L0 -16 L-2 -8 Z" fill="currentColor" />
            <path d="M0 -16 L0 10 L-1 12 L1 12 Z" stroke="currentColor" strokeWidth="1" />
            
            {/* Wing details */}
            <rect x="-18" y="-4" width="36" height="2" />
            {/* Tail stabilizers */}
            <rect x="-6" y="8" width="12" height="1.5" />
          </g>

          {/* Air drop targets */}
          <g transform="translate(45, 75)" className="animate-pulse">
            <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="currentColor" strokeWidth="0.5" />
            <text x="10" y="3" className="text-[5px] font-mono fill-red-400 font-bold">DZ-B</text>
          </g>

          {/* Tactical flight track */}
          <path d="M15 95 Q 50 40, 80 50 T 145 25" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
          
          <text x="14" y="105" className="text-[5.5px] font-mono fill-slate-400 tracking-wider font-bold">AIRSPACE SECTOR INTERCEPT</text>
        </svg>
      );
    }

    if (s.includes("truce") || s.includes("christmas")) {
      // Christmas Truce peace / hands tactical layout
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full text-red-500 fill-current opacity-90">
          {/* Radar circle grids */}
          <circle cx="80" cy="55" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
          
          {/* Trench cross-sections in abstract art */}
          <path d="M10 85 L45 85 L55 105 L105 105 L115 85 L150 85" fill="none" stroke="currentColor" strokeWidth="1" />
          <text x="15" y="80" className="text-[5px] font-mono fill-slate-400 uppercase">Trench UK</text>
          <text x="118" y="80" className="text-[5px] font-mono fill-slate-400 uppercase">Trench DE</text>

          {/* Centered star of peace / hand outline */}
          <g transform="translate(80, 52) scale(0.95)" className="animate-pulse">
            {/* Candle/Flame visual of peace */}
            <path d="M-6 4 L6 4 L6 22 L-6 22 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0 -15 C3 -8, 5 -4, 0 1 C-5 -4, -3 -8, 0 -15 Z" fill="currentColor" />
            {/* Halo ring */}
            <circle cx="0" cy="-6" r="14" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            
            {/* Barbed wire abstract lines crossed */}
            <path d="-25 -2 Q -15 6, -5 -2 T 15 -2" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          </g>

          <text x="35" y="24" className="text-[6px] font-mono fill-red-400 font-bold uppercase tracking-widest text-center w-full">CEASEFIRE DETECTED</text>
          <text x="44" y="31" className="text-[5px] font-mono fill-slate-400">NO SHOOTING SECTOR / 0.0 Hz</text>
        </svg>
      );
    }

    if (s.includes("hell") || s.includes("death") || s.includes("soldier") || s.includes("screaming") || s.includes("panzer") || s.includes("battle") || s.includes("stalingrad") || s.includes("berlin") || s.includes("verdun") || s.includes("price")) {
      // Trench / Combat Land Battle Sector Tactical Grid
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full text-red-500 fill-current opacity-90">
          {/* Concentric scan circles */}
          <circle cx="80" cy="55" r="48" fill="none" stroke="currentColor" strokeWidth="0.5 animate-pulse" />
          <circle cx="80" cy="55" r="32" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 3" />
          
          {/* Vertical and horizontal coordinates */}
          <line x1="80" y1="5" x2="80" y2="105" stroke="currentColor" strokeWidth="0.25" />
          <line x1="30" y1="55" x2="130" y2="55" stroke="currentColor" strokeWidth="0.25" />

          {/* Hexagonal sector markers */}
          <polygon points="80,15 115,35 115,75 80,95 45,75 45,35" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

          {/* Tactical Tank / Infantry combat advance vectors */}
          <g transform="translate(80, 55)">
            {/* Combat defense outpost box */}
            <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="-15" y1="-15" x2="15" y2="15" stroke="currentColor" strokeWidth="0.5" />
            <line x1="-15" y1="15" x2="15" y2="-15" stroke="currentColor" strokeWidth="0.5" />

            {/* Advance arrow pointers */}
            <path d="-35 -25 L-25 -25 L-25 -35 Z" fill="currentColor" />
            <path d="-38 -28 L-30 -20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />

            <path d="35 25 L25 25 L25 35 Z" fill="currentColor" className="animate-pulse" />
            <line x1="38" y1="28" x2="30" y2="20" stroke="currentColor" strokeWidth="1" />
          </g>

          {/* Danger zone overlay stripes */}
          <pattern id="stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(220, 38, 38, 0.15)" strokeWidth="3" />
          </pattern>
          <polygon points="10,12 55,12 40,45 10,45" fill="url(#stripes)" />

          <text x="84" y="24" className="text-[5.5px] font-mono fill-red-400 font-bold uppercase tracking-wider">DEFENSE LINE SECURE</text>
          <text x="84" y="31" className="text-[5px] font-mono fill-slate-400">MILITARY GRID: {randomCoords.sector}</text>
        </svg>
      );
    }

    // Default: Generic high-tech tactical radar scope targeting display
    return (
      <svg viewBox="0 0 160 120" className="w-full h-full text-red-500 fill-current opacity-90">
        <circle cx="80" cy="55" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="80" cy="55" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        <circle cx="80" cy="55" r="20" fill="none" stroke="currentColor" strokeWidth="0.25" />
        <circle cx="80" cy="55" r="6" fill="currentColor" className="animate-pulse opacity-40" />

        {/* Crosshair lines with ticks */}
        <line x1="15" y1="55" x2="145" y2="55" stroke="currentColor" strokeWidth="0.5" />
        <line x1="80" y1="2" x2="80" y2="108" stroke="currentColor" strokeWidth="0.5" />

        {/* Target ticks */}
        <line x1="60" y1="53" x2="60" y2="57" stroke="currentColor" strokeWidth="0.5" />
        <line x1="100" y1="53" x2="100" y2="57" stroke="currentColor" strokeWidth="0.5" />
        <line x1="78" y1="35" x2="82" y2="35" stroke="currentColor" strokeWidth="0.5" />
        <line x1="78" y1="75" x2="82" y2="75" stroke="currentColor" strokeWidth="0.5" />

        {/* Spinning sweep line */}
        <line x1="80" y1="55" x2="125" y2="20" stroke="currentColor" strokeWidth="1" className="origin-[80px_55px] animate-[spin_6s_linear_infinite]" />

        {/* Pulsing signal markers mimicking troop placements */}
        <circle cx="115" cy="40" r="2.5" fill="currentColor" className="animate-ping" />
        <circle cx="115" cy="40" r="2" fill="currentColor" />
        <text x="120" y="42" className="text-[5px] font-mono fill-red-400 font-bold font-mono">TGT-01</text>

        <circle cx="50" cy="75" r="2" fill="currentColor" opacity="0.6" />
        <text x="34" y="78" className="text-[5px] font-mono fill-slate-400 font-mono">FRIENDLY-08</text>

        {/* Border corner markings */}
        <path d="M5 5 L15 5 M5 5 L5 15" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M155 5 L145 5 M155 5 L155 15" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M5 115 L15 115 M5 115 L5 105" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M155 115 L145 115 M155 115 L155 105" fill="none" stroke="currentColor" strokeWidth="0.5" />

        <text x="8" y="14" className="text-[5.5px] font-mono fill-red-400 font-bold tracking-wider">RADAR ENGAGED</text>
        <text x="8" y="21" className="text-[5px] font-mono fill-slate-400">FREQ: {randomCoords.frequency}</text>
      </svg>
    );
  };

  return (
    <div className="w-full h-full bg-[#050507] border border-red-900/30 font-mono relative flex items-center justify-center overflow-hidden [box-shadow:inset_0_0_20px_rgba(220,38,38,0.15)] group-hover:border-red-500/40 transition-colors">
      
      {/* Visual content based on context */}
      <div className="absolute inset-0 p-3 select-none">
        {renderTacticalDesign()}
      </div>

      {/* Cybernetic HUD scanning line */}
      <div className="absolute inset-x-0 h-[1.5px] bg-red-500/60 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-[scan_3s_ease-in-out_infinite] top-0 pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

      {/* Status bottom ribbon */}
      <div className="absolute bottom-1 right-2 left-2 flex justify-between text-[4.8px] text-slate-500 tracking-widest font-bold uppercase pointer-events-none">
        <span>SYS: ONLINE</span>
        <span>LAT:{randomCoords.lat} / LNG:{randomCoords.lng}</span>
      </div>
    </div>
  );
};
