/**
 * Location map component with Google Maps-style tiles and clear labels.
 */
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, AlertCircle, CheckCircle, Crosshair, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GlassCard } from './ui';

// Fix for default marker icons in leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom user location icon - blue pulse effect like Google Maps
const userIcon = new L.DivIcon({
    className: 'custom-user-marker',
    html: `
        <div style="position: relative;">
            <div style="
                width: 22px;
                height: 22px;
                background: #4285F4;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                position: relative;
                z-index: 2;
            "></div>
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                background: rgba(66, 133, 244, 0.2);
                border-radius: 50%;
                animation: pulse 2s ease-out infinite;
                z-index: 1;
            "></div>
        </div>
        <style>
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
        </style>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

// Allowed location marker - green with checkmark
const allowedIcon = new L.DivIcon({
    className: 'custom-allowed-marker',
    html: `
        <div style="
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #34A853, #1E8E3E);
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

// Component to update map view when location changes
function MapUpdater({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || 17, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [center, map, zoom]);

    return null;
}

// Recenter button component
function RecenterButton({ userLocation }) {
    const map = useMap();

    const handleRecenter = () => {
        if (userLocation) {
            map.flyTo([userLocation.latitude, userLocation.longitude], 17, {
                duration: 1
            });
        }
    };

    return (
        <motion.button
            onClick={handleRecenter}
            className="absolute bottom-4 right-4 z-[1000] w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Center on my location"
        >
            <Crosshair className="w-5 h-5 text-gray-700" />
        </motion.button>
    );
}

// Map style options
const MAP_STYLES = {
    default: {
        name: 'Default',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    googleLike: {
        name: 'Google Style',
        url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
        attribution: '&copy; Google Maps',
    },
    satellite: {
        name: 'Satellite',
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attribution: '&copy; Google Maps',
    },
    hybrid: {
        name: 'Hybrid',
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        attribution: '&copy; Google Maps',
    },
    terrain: {
        name: 'Terrain',
        url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        attribution: '&copy; Google Maps',
    },
};

// Default allowed locations (from backend config)
const ALLOWED_LOCATIONS = [
    {
        id: 1,
        name: 'Main Campus - LPU',
        latitude: 31.2532,
        longitude: 75.7023,
        radius_meters: 200,
    },
];

export default function LocationMap({ userLocation, locationError }) {
    const [isInAllowedZone, setIsInAllowedZone] = useState(false);
    const [distanceToZone, setDistanceToZone] = useState(null);
    const [mapStyle, setMapStyle] = useState('googleLike');
    const [showStylePicker, setShowStylePicker] = useState(false);
    const mapRef = useRef(null);

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    useEffect(() => {
        if (userLocation) {
            let minDistance = Infinity;
            const inZone = ALLOWED_LOCATIONS.some(loc => {
                const distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    loc.latitude,
                    loc.longitude
                );
                minDistance = Math.min(minDistance, distance - loc.radius_meters);
                return distance <= loc.radius_meters;
            });
            setIsInAllowedZone(inZone);
            setDistanceToZone(inZone ? 0 : Math.max(0, minDistance));
        }
    }, [userLocation]);

    const defaultCenter = [31.2532, 75.7023]; // LPU coordinates
    const mapCenter = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : defaultCenter;

    const currentStyle = MAP_STYLES[mapStyle];

    return (
        <GlassCard className="h-full" hover={false}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Location</h2>
                        <p className="text-xs text-white/50">GPS verification</p>
                    </div>
                </div>

                {/* Status badge */}
                {userLocation && (
                    <motion.div
                        className={`badge ${isInAllowedZone ? 'badge-success' : 'badge-warning'}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <span className="flex items-center gap-1.5">
                            {isInAllowedZone ? (
                                <>
                                    <CheckCircle className="w-3 h-3" />
                                    In Zone
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-3 h-3" />
                                    {distanceToZone ? `${Math.round(distanceToZone)}m away` : 'Outside'}
                                </>
                            )}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Map container */}
            <div className="rounded-2xl overflow-hidden h-64 md:h-80 relative">
                {locationError ? (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-gray-800 font-semibold mb-2">Location Unavailable</p>
                            <p className="text-sm text-gray-500 max-w-xs">
                                {locationError}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <MapContainer
                            ref={mapRef}
                            center={mapCenter}
                            zoom={17}
                            zoomControl={false}
                            style={{ height: '100%', width: '100%' }}
                            className="z-10"
                        >
                            <TileLayer
                                url={currentStyle.url}
                                attribution={currentStyle.attribution}
                                maxZoom={20}
                            />

                            <ZoomControl position="bottomleft" />
                            <MapUpdater center={mapCenter} zoom={17} />
                            {userLocation && <RecenterButton userLocation={userLocation} />}

                            {/* Allowed zones */}
                            {ALLOWED_LOCATIONS.map((loc) => (
                                <div key={loc.id}>
                                    <Circle
                                        center={[loc.latitude, loc.longitude]}
                                        radius={loc.radius_meters}
                                        pathOptions={{
                                            color: '#34A853',
                                            fillColor: '#34A853',
                                            fillOpacity: 0.15,
                                            weight: 2,
                                            dashArray: '5, 5',
                                        }}
                                    />
                                    <Marker
                                        position={[loc.latitude, loc.longitude]}
                                        icon={allowedIcon}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="p-2">
                                                <p className="font-bold text-gray-800">{loc.name}</p>
                                                <p className="text-sm text-gray-600">Allowed Zone</p>
                                                <p className="text-xs text-gray-500 mt-1">Radius: {loc.radius_meters}m</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </div>
                            ))}

                            {/* User location */}
                            {userLocation && (
                                <Marker
                                    position={[userLocation.latitude, userLocation.longitude]}
                                    icon={userIcon}
                                >
                                    <Popup className="custom-popup">
                                        <div className="p-2">
                                            <p className="font-bold text-gray-800">📍 Your Location</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                                            </p>
                                            {!isInAllowedZone && distanceToZone && (
                                                <p className="text-xs text-orange-600 mt-1 font-medium">
                                                    {Math.round(distanceToZone)}m from allowed zone
                                                </p>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>

                        {/* Map style picker */}
                        <div className="absolute top-4 right-4 z-[1000]">
                            <motion.button
                                onClick={() => setShowStylePicker(!showStylePicker)}
                                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Change map style"
                            >
                                <Layers className="w-5 h-5 text-gray-700" />
                            </motion.button>

                            {showStylePicker && (
                                <motion.div
                                    className="absolute top-12 right-0 bg-white rounded-lg shadow-lg overflow-hidden min-w-[140px]"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {Object.entries(MAP_STYLES).map(([key, style]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setMapStyle(key);
                                                setShowStylePicker(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${mapStyle === key ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                                                }`}
                                        >
                                            {mapStyle === key && <CheckCircle className="w-4 h-4" />}
                                            {style.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Location info */}
            {userLocation && (
                <motion.div
                    className="mt-4 p-3 bg-white/5 rounded-xl flex items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <Navigation className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white/60">
                            {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                        </span>
                    </div>
                    <span className={`text-xs font-medium ${isInAllowedZone ? 'text-green-400' : 'text-orange-400'}`}>
                        {isInAllowedZone ? '✓ Verified' : `${Math.round(distanceToZone || 0)}m to zone`}
                    </span>
                </motion.div>
            )}
        </GlassCard>
    );
}
