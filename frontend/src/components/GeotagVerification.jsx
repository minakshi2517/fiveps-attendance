import React from 'react';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';


const GeotagVerification = ({
    registeredLat,
    registeredLon,
    currentLat,
    currentLon,
    distance,
    isMatch,
}) => {
    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Location Verification</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Registered Location */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Registered Location</h4>
                    {registeredLat && registeredLon ? (
                        <div className="space-y-1">
                            <p className="text-white font-mono text-sm">
                                Lat: {registeredLat.toFixed(6)}
                            </p>
                            <p className="text-white font-mono text-sm">
                                Lon: {registeredLon.toFixed(6)}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No geotag in registration image</p>
                    )}
                </div>

                {/* Current Location */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Current Location</h4>
                    <div className="space-y-1">
                        <p className="text-white font-mono text-sm">
                            Lat: {currentLat.toFixed(6)}
                        </p>
                        <p className="text-white font-mono text-sm">
                            Lon: {currentLon.toFixed(6)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Verification Result */}
            {distance !== undefined && (
                <div className={`flex items-center justify-between p-4 rounded-lg ${isMatch ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
                    }`}>
                    <div className="flex items-center gap-3">
                        {isMatch ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                        )}
                        <div>
                            <p className={`font-semibold ${isMatch ? 'text-green-400' : 'text-red-400'}`}>
                                {isMatch ? 'Location Match ✓' : 'Location Mismatch ✗'}
                            </p>
                            <p className="text-sm text-gray-300">
                                Distance: {distance.toFixed(0)}m {isMatch ? '(within threshold)' : '(exceeds threshold)'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeotagVerification;
