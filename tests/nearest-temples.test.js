/**
 * Unit tests for nearest-temples.js
 * Run with: npm test
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { findNearestTemples, haversineDistance } = require('../nearest-temples.js');

// ---------------------------------------------------------------------------
// haversineDistance
// ---------------------------------------------------------------------------

describe('haversineDistance', () => {

  test('returns 0 for identical coordinates', () => {
    assert.equal(haversineDistance(40.7608, -111.8910, 40.7608, -111.8910), 0);
  });

  test('SLC to London is ~7823 km', () => {
    const km = haversineDistance(40.7608, -111.8910, 51.5074, -0.1278);
    assert.ok(km > 7700 && km < 7950, `Expected ~7823, got ${km}`);
  });

  test('Sydney to Auckland is ~2160 km', () => {
    const km = haversineDistance(-33.8688, 151.2093, -36.8485, 174.7633);
    assert.ok(km > 2100 && km < 2220, `Expected ~2160, got ${km}`);
  });

  test('is symmetric (A→B equals B→A)', () => {
    const d1 = haversineDistance(51.5074, -0.1278, 48.8566, 2.3522);
    const d2 = haversineDistance(48.8566, 2.3522, 51.5074, -0.1278);
    assert.equal(d1, d2);
  });

  test('crosses the international date line correctly', () => {
    // Samoa (-13.759, -172.105) to Tonga (-21.178, -175.198) — short hop
    const km = haversineDistance(-13.759, -172.105, -21.178, -175.198);
    assert.ok(km > 800 && km < 1000, `Expected ~900, got ${km}`);
  });

  test('northern to southern hemisphere', () => {
    // London to Cape Town
    const km = haversineDistance(51.5074, -0.1278, -33.9249, 18.4241);
    assert.ok(km > 9500 && km < 10000, `Expected ~9700, got ${km}`);
  });

});

// ---------------------------------------------------------------------------
// findNearestTemples — result count and shape
// ---------------------------------------------------------------------------

describe('findNearestTemples — result count and shape', () => {

  test('returns exactly n results when enough temples exist', () => {
    const results = findNearestTemples(40.7608, -111.8910, 5, { status: 'Dedicated' });
    assert.equal(results.length, 5);
  });

  test('returns all matching temples when n exceeds available count', () => {
    // There are only ~221 dedicated temples; asking for 1000 should return all of them
    const results = findNearestTemples(40.7608, -111.8910, 1000, { status: 'Dedicated' });
    assert.ok(results.length > 200, `Expected 200+, got ${results.length}`);
    assert.ok(results.length <= 221, `Should not exceed dedicated count, got ${results.length}`);
  });

  test('returns empty array for n=0', () => {
    const results = findNearestTemples(40.7608, -111.8910, 0, { status: 'Dedicated' });
    assert.equal(results.length, 0);
  });

  test('each result has required fields', () => {
    const [temple] = findNearestTemples(40.7608, -111.8910, 1, { status: 'Dedicated' });
    assert.ok(temple.id,          'missing id');
    assert.ok(temple.name,        'missing name');
    assert.ok(temple.location,    'missing location');
    assert.ok(temple.status,      'missing status');
    assert.ok(temple.coordinates, 'missing coordinates');
    assert.ok(temple.coordinates.latitude  != null, 'missing latitude');
    assert.ok(temple.coordinates.longitude != null, 'missing longitude');
    assert.ok(temple.distance_km    != null, 'missing distance_km');
    assert.ok(temple.distance_miles != null, 'missing distance_miles');
  });

  test('distance_km and distance_miles are rounded to 1 decimal place', () => {
    const results = findNearestTemples(40.7608, -111.8910, 10, { status: 'Dedicated' });
    results.forEach(t => {
      const kmDecimals    = (t.distance_km.toString().split('.')[1] || '').length;
      const milesDecimals = (t.distance_miles.toString().split('.')[1] || '').length;
      assert.ok(kmDecimals    <= 1, `distance_km has more than 1 decimal: ${t.distance_km}`);
      assert.ok(milesDecimals <= 1, `distance_miles has more than 1 decimal: ${t.distance_miles}`);
    });
  });

  test('distance_miles is consistent with distance_km', () => {
    // distance_miles is computed from raw km before rounding, so allow ±0.1 tolerance
    // versus re-computing from the already-rounded distance_km value.
    const results = findNearestTemples(40.7608, -111.8910, 10, { status: 'Dedicated' });
    results.forEach(t => {
      const approxMiles = t.distance_km * 0.621371;
      assert.ok(
        Math.abs(t.distance_miles - approxMiles) < 0.15,
        `Mismatch for ${t.name}: ${t.distance_miles} mi vs ~${approxMiles.toFixed(1)}`
      );
    });
  });

  test('results are sorted by distance ascending', () => {
    const results = findNearestTemples(40.7608, -111.8910, 20, { status: 'Dedicated' });
    for (let i = 1; i < results.length; i++) {
      assert.ok(
        results[i].distance_km >= results[i - 1].distance_km,
        `Out of order: ${results[i-1].name} (${results[i-1].distance_km}) > ${results[i].name} (${results[i].distance_km})`
      );
    }
  });

  test('only returns temples that have valid coordinates', () => {
    const results = findNearestTemples(40.7608, -111.8910, 1000, { status: 'all' });
    results.forEach(t => {
      assert.ok(t.coordinates && t.coordinates.latitude != null && t.coordinates.longitude != null,
        `Temple ${t.name} has missing coordinates but was returned`);
    });
  });

});

// ---------------------------------------------------------------------------
// findNearestTemples — status filtering
// ---------------------------------------------------------------------------

describe('findNearestTemples — status filtering', () => {

  test('defaults to Dedicated when status is omitted', () => {
    const withDefault  = findNearestTemples(40.7608, -111.8910, 10);
    const withExplicit = findNearestTemples(40.7608, -111.8910, 10, { status: 'Dedicated' });
    assert.deepEqual(withDefault, withExplicit);
  });

  test('all results have the requested status', () => {
    const statuses = ['Dedicated', 'Announced', 'Under Construction'];
    statuses.forEach(status => {
      const results = findNearestTemples(40.7608, -111.8910, 20, { status });
      results.forEach(t => {
        assert.equal(t.status, status, `Expected status ${status}, got ${t.status} for ${t.name}`);
      });
    });
  });

  test('status=all returns temples of mixed statuses', () => {
    const results = findNearestTemples(40.7608, -111.8910, 50, { status: 'all' });
    const statusSet = new Set(results.map(t => t.status));
    assert.ok(statusSet.size > 1, 'Expected mixed statuses with status=all');
  });

  test('status=all returns more results than Dedicated alone', () => {
    const dedicated = findNearestTemples(40.7608, -111.8910, 50, { status: 'Dedicated' });
    const all       = findNearestTemples(40.7608, -111.8910, 50, { status: 'all' });
    assert.ok(all.length >= dedicated.length, 'status=all should return >= Dedicated count');
  });

});

// ---------------------------------------------------------------------------
// findNearestTemples — known nearest temples by location
// ---------------------------------------------------------------------------

describe('findNearestTemples — known nearest temples by location', () => {

  test('Salt Lake City: closest is Salt Lake Temple (~1.1 km)', () => {
    const [closest] = findNearestTemples(40.7608, -111.8910, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'salt-lake-temple');
    assert.ok(closest.distance_km < 3, `Expected < 3 km, got ${closest.distance_km}`);
  });

  test('Salt Lake City: top 3 are all Utah temples', () => {
    const results = findNearestTemples(40.7608, -111.8910, 3, { status: 'Dedicated' });
    results.forEach(t => {
      assert.match(t.location, /Utah/, `Expected Utah temple, got: ${t.name} — ${t.location}`);
    });
  });

  test('London: closest dedicated temple is London England Temple (~38.7 km)', () => {
    const [closest] = findNearestTemples(51.5074, -0.1278, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'london-england-temple');
    assert.ok(closest.distance_km > 30 && closest.distance_km < 50,
      `Expected 30–50 km, got ${closest.distance_km}`);
  });

  test('London: second closest is Preston England Temple', () => {
    const results = findNearestTemples(51.5074, -0.1278, 2, { status: 'Dedicated' });
    assert.equal(results[1].id, 'preston-england-temple');
  });

  test('Sydney: closest is Sydney Australia Temple (~18.5 km)', () => {
    const [closest] = findNearestTemples(-33.8688, 151.2093, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'sydney-australia-temple');
    assert.ok(closest.distance_km < 25, `Expected < 25 km, got ${closest.distance_km}`);
  });

  test('São Paulo: closest is São Paulo Brazil Temple (~9.9 km)', () => {
    const [closest] = findNearestTemples(-23.5505, -46.6333, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'sao-paulo-brazil-temple');
    assert.ok(closest.distance_km < 15, `Expected < 15 km, got ${closest.distance_km}`);
  });

  test('Manila: closest is Manila Philippines Temple (~9.2 km)', () => {
    const [closest] = findNearestTemples(14.5995, 120.9842, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'manila-philippines-temple');
    assert.ok(closest.distance_km < 15, `Expected < 15 km, got ${closest.distance_km}`);
  });

  test('Mexico City: closest is Mexico City Mexico Temple (~6.1 km)', () => {
    const [closest] = findNearestTemples(19.4326, -99.1332, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'mexico-city-mexico-temple');
    assert.ok(closest.distance_km < 10, `Expected < 10 km, got ${closest.distance_km}`);
  });

  test('Cape Town: closest dedicated temple is Johannesburg (~1263 km away)', () => {
    // No dedicated temple exists in Cape Town; Johannesburg is the nearest in South Africa
    const [closest] = findNearestTemples(-33.9249, 18.4241, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'johannesburg-south-africa-temple');
    assert.ok(closest.distance_km > 1200 && closest.distance_km < 1400,
      `Expected 1200–1400 km, got ${closest.distance_km}`);
  });

  test('Tokyo: closest is Tokyo Japan Temple', () => {
    const [closest] = findNearestTemples(35.6762, 139.6503, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'tokyo-japan-temple');
  });

  test('Buenos Aires: closest is Buenos Aires Argentina Temple', () => {
    const [closest] = findNearestTemples(-34.6037, -58.3816, 1, { status: 'Dedicated' });
    assert.match(closest.id, /buenos-aires/, `Got: ${closest.id}`);
  });

  test('Accra, Ghana: closest is Accra Ghana Temple', () => {
    const [closest] = findNearestTemples(5.5600, -0.2057, 1, { status: 'Dedicated' });
    assert.equal(closest.id, 'accra-ghana-temple');
  });

  test('n=1 always returns single closest, not just any temple', () => {
    const locations = [
      { lat: 40.7608, lng: -111.8910 }, // SLC
      { lat: 51.5074, lng: -0.1278  }, // London
      { lat: -33.8688, lng: 151.2093 }, // Sydney
    ];
    locations.forEach(loc => {
      const [first]  = findNearestTemples(loc.lat, loc.lng, 1,  { status: 'Dedicated' });
      const [top]    = findNearestTemples(loc.lat, loc.lng, 10, { status: 'Dedicated' });
      assert.equal(first.id, top.id,
        `n=1 and n=10 disagree on closest temple at ${loc.lat},${loc.lng}`);
    });
  });

});

// ---------------------------------------------------------------------------
// findNearestTemples — edge cases
// ---------------------------------------------------------------------------

describe('findNearestTemples — edge cases', () => {

  test('point exactly on a temple coordinate returns 0 distance', () => {
    // Salt Lake Temple is at 40.7708, -111.8922
    const [closest] = findNearestTemples(40.7708, -111.8922, 1, { status: 'Dedicated' });
    assert.equal(closest.distance_km, 0);
    assert.equal(closest.distance_miles, 0);
  });

  test('southern hemisphere coordinates work correctly', () => {
    const results = findNearestTemples(-33.8688, 151.2093, 5, { status: 'Dedicated' });
    assert.equal(results.length, 5);
    results.forEach(t => assert.ok(t.distance_km >= 0));
  });

  test('eastern hemisphere coordinates work correctly', () => {
    const results = findNearestTemples(35.6762, 139.6503, 5, { status: 'Dedicated' });
    assert.equal(results.length, 5);
    results.forEach(t => assert.ok(t.distance_km >= 0));
  });

  test('coordinates near international date line work correctly', () => {
    // Samoa area — near the date line
    const results = findNearestTemples(-13.759, -172.105, 3, { status: 'Dedicated' });
    assert.ok(results.length > 0, 'Should find temples near Samoa');
    results.forEach(t => assert.ok(t.distance_km >= 0));
  });

  test('different n values return the correct prefix of a full sorted list', () => {
    const full = findNearestTemples(40.7608, -111.8910, 20, { status: 'Dedicated' });
    [1, 3, 5, 10].forEach(n => {
      const subset = findNearestTemples(40.7608, -111.8910, n, { status: 'Dedicated' });
      assert.equal(subset.length, n);
      subset.forEach((t, i) => {
        assert.equal(t.id, full[i].id, `n=${n}: position ${i} mismatch`);
      });
    });
  });

  test('results do not mutate the original temple data', () => {
    const r1 = findNearestTemples(40.7608, -111.8910, 1, { status: 'Dedicated' })[0];
    const r2 = findNearestTemples(51.5074, -0.1278,   1, { status: 'Dedicated' })[0];
    // If the data was mutated, the second call might return wrong distances
    assert.ok(r1.distance_km < r2.distance_km || r1.id !== r2.id);
    // Calling again from SLC should give the same result
    const r3 = findNearestTemples(40.7608, -111.8910, 1, { status: 'Dedicated' })[0];
    assert.equal(r1.id, r3.id);
    assert.equal(r1.distance_km, r3.distance_km);
  });

});
