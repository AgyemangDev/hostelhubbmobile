// utils/viewTracker.js
// Each accommodation gets its own independent view tracking

const globalViewCounts = {};
const globalTimeouts = {};
const subscribers = {};

const viewTexts = [
  "other students viewed",
  "students checked this accommodation",
  "others showed interest",
  "students viewed this already",
  "fellow students explored this",
  "others liked this place",
  "students recently visited",
  "colleagues showed curiosity",
  "from your shool viewed this",
];

// Get consistent random text based on accommodation ID (not name, to avoid duplicates)
function getRandomText(accommodationId) {
  const key = accommodationId || "default";
  const idSeed = typeof key === 'string'
    ? key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : key;
  const index = idSeed % viewTexts.length;
  return viewTexts[index];
}

function getRandomIncrement() {
  return Math.floor(Math.random() * 2) + 1; // 1 or 2
}

function getRandomInterval() {
  return (Math.floor(Math.random() * 7) + 4) * 1000; // 4-10 seconds
}

// Start tracking for a specific accommodation by ID
function startTracking(accommodationId, initialViews = 0) {
  // Use accommodation ID as the key
  const key = String(accommodationId);
  
  // Initialize view count if not exists
  if (globalViewCounts[key] === undefined) {
    globalViewCounts[key] = initialViews;
  }

  // Only start interval if not already running
  if (!globalTimeouts[key]) {
    const updateViews = () => {
      globalViewCounts[key] += getRandomIncrement();
      notifySubscribers(key);
      
      // Schedule next update
      globalTimeouts[key] = setTimeout(updateViews, getRandomInterval());
    };

    // Use accommodation ID for initial delay to stagger updates
    const idNumber = typeof accommodationId === 'number' 
      ? accommodationId 
      : accommodationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const initialDelay = ((idNumber % 7) + 4) * 1000; // 4-10 seconds
    
    globalTimeouts[key] = setTimeout(updateViews, initialDelay);
  }
}

// Stop tracking for a specific accommodation
function stopTracking(accommodationId) {
  const key = String(accommodationId);
  
  if (globalTimeouts[key]) {
    clearTimeout(globalTimeouts[key]);
    delete globalTimeouts[key];
  }
}

// Get current view count for an accommodation
function getViewCount(accommodationId) {
  const key = String(accommodationId);
  return globalViewCounts[key] || 0;
}

// Subscribe to updates for a specific accommodation
function subscribe(accommodationId, callback) {
  const key = String(accommodationId);
  
  if (!subscribers[key]) {
    subscribers[key] = [];
  }
  
  subscribers[key].push(callback);
  
  // Return unsubscribe function
  return () => unsubscribe(accommodationId, callback);
}

// Unsubscribe from updates
function unsubscribe(accommodationId, callback) {
  const key = String(accommodationId);
  
  if (subscribers[key]) {
    subscribers[key] = subscribers[key].filter(cb => cb !== callback);
    
    // Clean up if no more subscribers
    if (subscribers[key].length === 0) {
      delete subscribers[key];
      stopTracking(accommodationId);
    }
  }
}

// Notify all subscribers for a specific accommodation
function notifySubscribers(accommodationId) {
  const key = String(accommodationId);
  
  if (subscribers[key]) {
    const count = globalViewCounts[key];
    subscribers[key].forEach(cb => cb(count));
  }
}

// Clean up all tracking (useful for app cleanup)
function cleanupAll() {
  Object.keys(globalTimeouts).forEach(key => {
    clearTimeout(globalTimeouts[key]);
  });
  
  Object.keys(globalTimeouts).forEach(key => {
    delete globalTimeouts[key];
  });
}

export { 
  getRandomText, 
  startTracking, 
  stopTracking,
  getViewCount, 
  subscribe, 
  unsubscribe,
  cleanupAll
};