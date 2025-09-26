import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Navigation, Phone, Clock, Compass } from 'lucide-react';

const EmergencyComponent = ({ routeInfoUrl }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [emergencyDestination, setEmergencyDestination] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');

  // Emergency destinations (you can expand this list)
  const emergencyDestinations = {
    'nearest_hospital': { lat: 40.7589, lon: -73.9851, name: 'Nearest Hospital' },
    'coast_guard': { lat: 40.7505, lon: -74.0164, name: 'Coast Guard Station' },
    'port_authority': { lat: 40.7580, lon: -74.0020, name: 'Port Authority' },
    'emergency_services': { lat: 40.7500, lon: -73.9900, name: 'Emergency Services' },
  };

  // Get current location using browser's geolocation
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to retrieve location';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const calculateEmergencyRoute = async () => {
    if (!currentLocation) {
      setError('Current location is required. Please get your location first.');
      return;
    }

    let destinationLat, destinationLon;

    if (emergencyDestination === 'custom') {
      // Use the same validation pattern as MapComponent
      const trimmedCustomLat = customLat.trim();
      const trimmedCustomLon = customLon.trim();

      const parsedCustomLat = parseFloat(trimmedCustomLat);
      const parsedCustomLon = parseFloat(trimmedCustomLon);

      // Enhanced validation matching MapComponent
      if (!trimmedCustomLat || !trimmedCustomLon) {
        setError("Please enter both latitude and longitude coordinates");
        return;
      }
      if (isNaN(parsedCustomLat) || isNaN(parsedCustomLon)) {
        setError("Please enter valid numeric coordinates");
        return;
      }
      if (parsedCustomLat < -90 || parsedCustomLat > 90) {
        setError("Latitude must be between -90 and 90");
        return;
      }
      if (parsedCustomLon < -180 || parsedCustomLon > 180) {
        setError("Longitude must be between -180 and 180");
        return;
      }
      
      destinationLat = parsedCustomLat;
      destinationLon = parsedCustomLon;
    } else if (emergencyDestination && emergencyDestinations[emergencyDestination]) {
      const dest = emergencyDestinations[emergencyDestination];
      destinationLat = dest.lat;
      destinationLon = dest.lon;
    } else {
      setError('Please select an emergency destination');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Use the same payload structure as MapComponent
      const payload = {
        start_lat: currentLocation.lat,
        start_lon: currentLocation.lon,
        end_lat: destinationLat,
        end_lon: destinationLon,
      };

      // Final validation before sending (matching MapComponent pattern)
      if ([currentLocation.lat, currentLocation.lon, destinationLat, destinationLon].some((v) => v === null || v === undefined || isNaN(v))) {
        setError("Invalid coordinates detected before request");
        return;
      }

      console.log("Sending payload:", payload);
      console.log("JSON body:", JSON.stringify(payload));

      const response = await fetch(routeInfoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      setResult({
        ...data,
        destinationName: emergencyDestination === 'custom' 
          ? `Custom Location (${destinationLat.toFixed(4)}, ${destinationLon.toFixed(4)})` 
          : emergencyDestinations[emergencyDestination]?.name || 'Unknown Destination'
      });
    } catch (err) {
      setError(`Error calculating route: ${err.message}`);
      console.error("Route calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const formatCoordinate = (value) => {
    return typeof value === 'number' ? value.toFixed(6) : value;
  };

  return (
    <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Emergency Header */}
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="text-red-400" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-white">Emergency Navigation</h1>
            <p className="text-red-300 text-sm">Quick route calculation for emergency situations</p>
          </div>
        </div>

        {/* Emergency Contact Info */}
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="text-red-400" size={20} />
            <h2 className="text-red-400 font-semibold">Emergency Contacts</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-red-300 font-medium mb-2">General Emergency</p>
              <p className="text-white mb-3">112</p>
              <button
                onClick={() => window.open('tel:112')}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                Call 112
              </button>
            </div>
            <div className="text-center">
              <p className="text-red-300 font-medium mb-2">Coast Guard</p>
              <p className="text-white mb-3">Channel 16 VHF</p>
              <button
                onClick={() => alert('Use VHF Radio Channel 16 for Coast Guard emergency communication')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                VHF Ch 16
              </button>
            </div>
            <div className="text-center">
              <p className="text-red-300 font-medium mb-2">Marine Emergency</p>
              <p className="text-white mb-3">+91 9398181513</p>
              <button
                onClick={() => window.open('tel:+91 9398181513')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                Call Marine
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Location & Destination */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Location & Destination
            </h2>

            {/* Current Location */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Current Location
                </label>
                <button
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
                >
                  {locationLoading ? 'Getting...' : 'Refresh'}
                </button>
              </div>
              {currentLocation ? (
                <div className="bg-gray-700 p-3 rounded-md text-sm">
                  <p className="text-green-400">✓ Location acquired</p>
                  <p className="text-gray-300">
                    {formatCoordinate(currentLocation.lat)}, {formatCoordinate(currentLocation.lon)}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-700 p-3 rounded-md text-sm text-gray-400">
                  {locationLoading ? 'Getting current location...' : 'Location not available'}
                </div>
              )}
            </div>

            {/* Emergency Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emergency Destination
              </label>
              <select
                value={emergencyDestination}
                onChange={(e) => setEmergencyDestination(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
              >
                <option value="">Select emergency destination...</option>
                {Object.entries(emergencyDestinations).map(([key, dest]) => (
                  <option key={key} value={key}>
                    {dest.name}
                  </option>
                ))}
                <option value="custom">Custom Coordinates</option>
              </select>

              {emergencyDestination === 'custom' && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 mb-2">
                    Enter coordinates as decimal degrees (e.g., 40.7128 or -74.0060)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                      <input
                        type="text"
                        placeholder="40.7128"
                        value={customLat}
                        onChange={(e) => setCustomLat(e.target.value.trim())}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <div className="text-xs text-gray-500 mt-1">-90 to 90</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Longitude</label>
                      <input
                        type="text"
                        placeholder="-74.0060"
                        value={customLon}
                        onChange={(e) => setCustomLon(e.target.value.trim())}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <div className="text-xs text-gray-500 mt-1">-180 to 180</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={calculateEmergencyRoute}
              disabled={loading || !currentLocation}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Calculating Emergency Route...
                </>
              ) : (
                <>
                  <Navigation size={16} />
                  Calculate Emergency Route
                </>
              )}
            </button>
          </div>

          {/* Route Results */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Compass size={20} />
              Emergency Route
            </h2>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4 flex items-start gap-3">
                <AlertTriangle className="text-red-400 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                  <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                    <Clock size={16} />
                    IMMEDIATE ROUTE INFORMATION
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="text-lg">
                      <span className="font-bold text-white">Distance:</span> {result.distance_km} km
                    </div>
                    <div className="text-lg">
                      <span className="font-bold text-white">Direction:</span> {result.direction}
                    </div>
                    <div className="bg-gray-800 p-3 rounded-md">
                      <p className="font-medium text-red-300 mb-1">Emergency Instructions:</p>
                      <p className="text-white font-mono">{result.instruction}</p>
                    </div>
                    <div className="text-sm">
                      <p><strong>Destination:</strong> {result.destinationName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Safety Reminder</h4>
                  <ul className="text-yellow-300 text-sm space-y-1">
                    <li>• This is straight-line distance, not actual travel route</li>
                    <li>• Consider obstacles, weather, and sea conditions</li>
                    <li>• Contact emergency services immediately if needed</li>
                    <li>• Share your location with others if possible</li>
                  </ul>
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="text-center text-gray-400 py-8">
                <Compass size={48} className="mx-auto mb-3 opacity-50" />
                <p>Set your destination and calculate emergency route</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Emergency Info */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle size={20} />
            Emergency Guidelines
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">Before You Move:</h4>
              <ul className="space-y-1">
                <li>• Assess immediate dangers</li>
                <li>• Contact emergency services if possible</li>
                <li>• Inform others of your location and plans</li>
                <li>• Check weather and sea conditions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">During Navigation:</h4>
              <ul className="space-y-1">
                <li>• Follow calculated bearing consistently</li>
                <li>• Regularly check your position</li>
                <li>• Watch for obstacles and hazards</li>
                <li>• Maintain communication if possible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyComponent;