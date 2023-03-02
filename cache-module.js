import NodeCache from "node-cache";

const cache = new NodeCache();

// Maximum size of cached data in bytes
const MAX_CACHE_SIZE = 1024 * 1024; // 1 MB

// Maximum age of cached data in seconds
const MAX_CACHE_AGE = 3600; // 1 hour

// Function to cache data with a session key and storage key
function cacheData(sessionKey, storageKey, data, ttlInSeconds) {
  const timestamp = Date.now();
  const cacheKey = `${sessionKey}:${storageKey}`;
  const cachedData = cache.get(cacheKey) || { data: [], size: 0, age: 0 };
  cachedData.data.push({ data, timestamp });
  cachedData.size += Buffer.byteLength(JSON.stringify(data));
  cachedData.age = Math.max(cachedData.age, ttlInSeconds);
  cache.set(cacheKey, cachedData);
  checkCacheSize();
}

// Function to retrieve cached data using a session key and storage key
function getCachedData(sessionKey, storageKey, fromTimestamp, toTimestamp) {
  const cacheKey = `${sessionKey}:${storageKey}`;
  const cachedData = cache.get(cacheKey);

  if (!cachedData) {
    return [];
  }

  const dataInRange = cachedData.data.filter((entry) => {
    const timestamp = entry.timestamp;
    return timestamp >= fromTimestamp && timestamp <= toTimestamp;
  });

  return dataInRange.map((entry) => entry.data);
}

// Function to retrieve cached data using a session key and storage key
function getCachedDataAll(sessionKey, storageKey) {
  const cacheKey = `${sessionKey}:${storageKey}`;
  const cachedData = cache.get(cacheKey);

  if (!cachedData) {
    return [];
  }

  const dataInRange = cachedData.data.filter((entry) => {
    return true;
  });

  return dataInRange.map((entry) => entry.data);
}

// Function to expire a cache entry using a session key and storage key
function expireCachedData(sessionKey, storageKey) {
  const cacheKey = `${sessionKey}:${storageKey}`;
  cache.del(cacheKey);
}

// Helper function to periodically check and expire old cached data
function checkCacheSize() {
  const allKeys = cache.keys();
  let totalSize = 0;
  let oldestAge = Infinity;
  let oldestKey = null;

  for (const key of allKeys) {
    const cachedData = cache.get(key);
    totalSize += cachedData.size;
    oldestAge = Math.min(oldestAge, cachedData.age);
    if (!oldestKey || cachedData.age === oldestAge) {
      oldestKey = key;
    }
  }

  if (totalSize > MAX_CACHE_SIZE || oldestAge > MAX_CACHE_AGE) {
    expireCachedData(...oldestKey.split(":"));
  }
}

// Check and expire old cached data every 5 minutes
setInterval(checkCacheSize, 5 * 60 * 1000);

// Export the cache functions as a module
export { cacheData, getCachedData, getCachedDataAll, expireCachedData };

