
import React, { useMemo, useEffect } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { Continent, Hotspot } from '../types';

interface GlobeProps {
    continents: Continent[];
    selectedContinent: Continent | null;
    onSelectContinent: (continent: Continent | null) => void;
    onSelectHotspot: (hotspotName: string) => void;
}

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

const project = (lat: number, lon: number) => {
    const x = (lon + 180) * (MAP_WIDTH / 360);
    const latRad = lat * Math.PI / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const y = (MAP_HEIGHT / 2) - (MAP_WIDTH * mercN / (2 * Math.PI));
    return { x, y };
};

// Recalibrated positions to match the purple world map image
const continentFocus: { [key: string]: { x: number, y: number, scale: number } } = {
    "North America": { x: 200, y: 160, scale: 2.2 },
    "South America": { x: 300, y: 340, scale: 2.5 },
    "Europe": { x: 500, y: 120, scale: 4 },
    "Africa": { x: 510, y: 260, scale: 2.5 },
    "Asia": { x: 680, y: 150, scale: 2 },
    "Oceania": { x: 820, y: 350, scale: 3 }
};

const Controls = ({ onSelectContinent }: { onSelectContinent: (continent: Continent | null) => void }) => {
    const { resetTransform } = useControls();

    return (
        <button
            onClick={() => {
                onSelectContinent(null);
                resetTransform();
            }}
            className="absolute top-4 left-4 z-20 px-4 py-2 bg-waypoint-primary text-white rounded-full shadow-lg hover:bg-opacity-80 transition-opacity"
        >
            <i className="fas fa-globe-americas mr-2"></i> Reset View
        </button>
    );
};

const GlobeInternal: React.FC<GlobeProps> = ({ continents, selectedContinent, onSelectContinent, onSelectHotspot }) => {
    const { setTransform, resetTransform } = useControls();

    useEffect(() => {
        if (selectedContinent) {
            const focus = continentFocus[selectedContinent.name];
            if (focus) {
                setTransform(
                    -focus.x * focus.scale + MAP_WIDTH / 2,
                    -focus.y * focus.scale + MAP_HEIGHT / 2,
                    focus.scale,
                    400,
                    'easeOut'
                );
            }
        } else {
            resetTransform();
        }
    }, [selectedContinent, setTransform, resetTransform]);

    const allHotspots = useMemo(() =>
        continents.flatMap(c => c.categories.flatMap(cat => cat.hotspots))
            .filter(h => h.lat && h.lon),
        [continents]
    );

    return (
        <>
            <Controls onSelectContinent={onSelectContinent} />
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
                <svg id="map-container" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} preserveAspectRatio="xMidYMid slice" className="w-full h-full">
                    <image href={"/world-map.png"} x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} preserveAspectRatio="xMidYMid slice" />

                    {Object.entries(continentFocus).map(([name, { x, y }]) => (
                        <g key={name} transform={`translate(${x} ${y})`} className="cursor-pointer group" onClick={() => {
                            const continent = continents.find(c => c.name === name);
                            if (continent) onSelectContinent(continent);
                        }}>
                            <circle r="50" fill="transparent" />
                            <text
                                className="text-[18px] fill-white font-bold pointer-events-none"
                                style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.7)", strokeWidth: "5px", strokeLinejoin: "round", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                                textAnchor="middle"
                                dy=".3em"
                            >
                                {name}
                            </text>
                        </g>
                    ))}

                    {selectedContinent && allHotspots
                        .filter(h => selectedContinent.categories.some(cat => cat.hotspots.some(sh => sh.name === h.name)))
                        .map(hotspot => {
                            if (!hotspot.lat || !hotspot.lon) return null;
                            const pos = project(hotspot.lat, hotspot.lon);
                            return (
                                <g key={hotspot.name} transform={`translate(${pos.x} ${pos.y})`} className="cursor-pointer group" onClick={() => onSelectHotspot(hotspot.name)}>
                                    <circle
                                        r="10"
                                        fill="rgba(255,255,255,0.0)"
                                        className="transition-all duration-300"
                                    />
                                    <circle
                                        r="4"
                                        fill="#E5B4E2"
                                        stroke="#FFFFFF"
                                        strokeWidth="2"
                                        className="transition-all duration-300 group-hover:r-6"
                                        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
                                    />
                                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ transform: 'translateY(-25px)' }}>
                                        <rect x="-55" y="-24" width="110" height="22" rx="6" fill="rgba(0,0,0,0.85)" />
                                        <text
                                            className="text-[11px] fill-white font-medium"
                                            textAnchor="middle"
                                            y="-13"
                                        >
                                            {hotspot.name}
                                        </text>
                                    </g>
                                </g>
                            );
                        })}
                </svg>
            </TransformComponent>
        </>
    );
}

const Globe: React.FC<GlobeProps> = (props) => {
    return (
        <div className="relative w-full max-w-6xl mx-auto aspect-[2/1] bg-transparent rounded-xl shadow-2xl overflow-hidden border-2 border-waypoint-primary/30">
            <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={8}
                centerOnInit
                wheel={{ step: 0.15 }}
                doubleClick={{ disabled: true }}
            >
                <GlobeInternal {...props} />
            </TransformWrapper>
        </div>
    );
};

export default Globe;