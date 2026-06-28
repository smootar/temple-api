(function (root) {
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function findNearestTemples(lat, lng, n, options) {
    const status = (options && options.status != null) ? options.status : 'Dedicated';
    const data =
      (typeof window !== 'undefined' && window.TEMPLES_DATA) ||
      (typeof require !== 'undefined' ? require('./temples-data.json') : []);

    let temples = status === 'all'
      ? data
      : data.filter(t => t.status === status);

    temples = temples.filter(
      t => t.coordinates && t.coordinates.latitude != null && t.coordinates.longitude != null
    );

    return temples
      .map(t => {
        const km = haversineDistance(lat, lng, t.coordinates.latitude, t.coordinates.longitude);
        return Object.assign({}, t, {
          distance_km: Math.round(km * 10) / 10,
          distance_miles: Math.round(km * 0.621371 * 10) / 10
        });
      })
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, n);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { findNearestTemples, haversineDistance };
  } else {
    root.TempleAPI = root.TempleAPI || {};
    root.TempleAPI.findNearestTemples = findNearestTemples;
    root.TempleAPI.haversineDistance = haversineDistance;
  }
})(typeof window !== 'undefined' ? window : global);
