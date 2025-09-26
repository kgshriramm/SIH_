import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { Map, Navigation, Calculator, AlertCircle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapComponent = ({ routeInfoUrl = "http://127.0.0.1:5000/api/route_info" }) => {
  const [startLat, setStartLat] = useState("");
  const [startLon, setStartLon] = useState("");
  const [endLat, setEndLat] = useState("");
  const [endLon, setEndLon] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef(null);

  // Fetch current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStartLat(position.coords.latitude.toString());
          setStartLon(position.coords.longitude.toString());
        },
        (err) => {
          setError(`Geolocation error: ${err.message}`);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const calculateRoute = async () => {
    const trimmedStartLat = startLat.trim();
    const trimmedStartLon = startLon.trim();
    const trimmedEndLat = endLat.trim();
    const trimmedEndLon = endLon.trim();

    const parsedStartLat = parseFloat(trimmedStartLat);
    const parsedStartLon = parseFloat(trimmedStartLon);
    const parsedEndLat = parseFloat(trimmedEndLat);
    const parsedEndLon = parseFloat(trimmedEndLon);

    // Enhanced validation
    if (!trimmedStartLat || !trimmedStartLon || !trimmedEndLat || !trimmedEndLon) {
      setError("Please fill in all coordinate fields");
      return;
    }
    if (
      isNaN(parsedStartLat) ||
      isNaN(parsedStartLon) ||
      isNaN(parsedEndLat) ||
      isNaN(parsedEndLon)
    ) {
      setError("Please enter valid numeric coordinates");
      return;
    }
    if (parsedStartLat < -90 || parsedStartLat > 90 || parsedEndLat < -90 || parsedEndLat > 90) {
      setError("Latitude must be between -90 and 90");
      return;
    }
    if (parsedStartLon < -180 || parsedStartLon > 180 || parsedEndLon < -180 || parsedEndLon > 180) {
      setError("Longitude must be between -180 and 180");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        start_lat: parsedStartLat,
        start_lon: parsedStartLon,
        end_lat: parsedEndLat,
        end_lon: parsedEndLon,
      };
      // Final validation before sending
      if (
        [parsedStartLat, parsedStartLon, parsedEndLat, parsedEndLon].some((v) => v === null || v === undefined || isNaN(v))
      ) {
        setError("Invalid coordinates detected before request");
        return;
      }
      console.log("Sending payload:", payload);
      console.log("JSON body:", JSON.stringify(payload));

      const response = await fetch(routeInfoUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Error calculating route: ${err.message}`);
      console.error("Route calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setStartLat("");
    setStartLon("");
    setEndLat("");
    setEndLon("");
    setResult(null);
    setError("");
  };

  // Update map view when result changes
  useEffect(() => {
    if (result && mapRef.current) {
      const start = [parseFloat(startLat), parseFloat(startLon)];
      const end = [parseFloat(endLat), parseFloat(endLon)];
      mapRef.current.fitBounds([start, end]);
    }
  }, [result, startLat, startLon, endLat, endLon]);

  return (
    <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Map className="text-green-400" size={32} />
          <h1 className="text-3xl font-bold text-white">Route Calculator</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calculator size={20} />
              Enter Coordinates
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Latitude
                  </label>
                  <input
                    type="text" // Changed from "number" to "text"
                    step="any"
                    placeholder="e.g., 40.7128 or -40.7128"
                    value={startLat}
                    onChange={(e) => setStartLat(e.target.value.trim())}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Longitude
                  </label>
                  <input
                    type="text" // Changed from "number" to "text"
                    step="any"
                    placeholder="e.g., -74.0060 or 74.0060"
                    value={startLon}
                    onChange={(e) => setStartLon(e.target.value.trim())}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Latitude
                  </label>
                  <input
                    type="text" // Changed from "number" to "text"
                    step="any"
                    placeholder="e.g., 34.0522 or -34.0522"
                    value={endLat}
                    onChange={(e) => setEndLat(e.target.value.trim())}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Longitude
                  </label>
                  <input
                    type="text" // Changed from "number" to "text"
                    step="any"
                    placeholder="e.g., -118.2437 or 118.2437"
                    value={endLon}
                    onChange={(e) => setEndLon(e.target.value.trim())}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Use Current Location
                </button>
                <button
                  onClick={calculateRoute}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Navigation size={16} />
                      Calculate Route
                    </>
                  )}
                </button>
                <button
                  onClick={clearForm}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Map and Results */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Navigation size={20} />
              Route Information
            </h2>
            <div className="h-64 mb-4">
              <MapContainer
                center={[0, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {result && startLat && startLon && endLat && endLon && (
                  <>
                    <Marker position={[parseFloat(startLat), parseFloat(startLon)]}>
                      <Popup>Start</Popup>
                    </Marker>
                    <Marker position={[parseFloat(endLat), parseFloat(endLon)]}>
                      <Popup>End</Popup>
                    </Marker>
                    <Polyline
                      positions={[
                        [parseFloat(startLat), parseFloat(startLon)],
                        [parseFloat(endLat), parseFloat(endLon)],
                      ]}
                      color="blue"
                    />
                  </>
                )}
              </MapContainer>
            </div>
            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4 flex items-start gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">Route Calculated</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <span className="font-medium">Distance:</span> {result.distance_km} km
                    </p>
                    <p>
                      <span className="font-medium">Direction:</span> {result.direction}
                    </p>
                    <p className="text-sm bg-gray-700 p-3 rounded-md mt-3">
                      <span className="font-medium">Instructions:</span> {result.instruction}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Coordinate Summary</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>
                      <strong>Start:</strong> {startLat}, {startLon}
                    </p>
                    <p>
                      <strong>End:</strong> {endLat}, {endLon}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!result && !error && !loading && (
              <div className="text-center text-gray-400 py-8">
                <Map size={48} className="mx-auto mb-3 opacity-50" />
                <p>Enter coordinates above to calculate route information</p>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">How to Use</h3>
          <div className="text-gray-300 space-y-2 text-sm">
            <p>• Enter start and end coordinates in decimal degrees format</p>
            <p>• Latitude ranges from -90 to 90 (negative for south)</p>
            <p>• Longitude ranges from -180 to 180 (negative for west)</p>
            <p>• Use "Current Location" to auto-fill start coordinates</p>
            <p>• The system calculates straight-line distance and initial bearing</p>
            <p>
              <strong>Example:</strong> New York City: 40.7128, -74.0060
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;