import { cacheData, getCachedData, getCachedDataAll, expireCachedData } from "./cache-module.js";

// Cache some data
cacheData("session1", "data1", { value: 1 }, 60); // cache for 1 minute
cacheData("session1", "data2", { value: 2 }, 120); // cache for 2 minutes
cacheData("session2", "data1", { value: 3 }, 180); // cache for 3 minutes
/*
// Wait for 30 seconds
setTimeout(() => {
    const fromTimestamp = Date.now() - 30000; // 3 seconds ago
    const toTimestamp = Date.now() - 25000; // 50 seconds ago

    // Retrieve all cached data for session1 and data1 between 5 and 30 seconds ago
    const cachedData = getCachedData("session1", "data1", fromTimestamp, toTimestamp);

    console.log(cachedData); // [{ value: 1 }]
}, 30000); // 30 seconds in milliseconds
*/
// Retrieve all cached data for session1 and data1
const cachedData = getCachedDataAll("session1", "data1");
console.log(cachedData); // [{ value: 1 }]

