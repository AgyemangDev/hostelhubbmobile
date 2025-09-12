// This module handles global view counts and timeouts per hostel
const globalViewCounts = {};
const globalTimeouts = {};
const subscribers = {};

const viewTexts = [
  "other students viewed",
  "students checked this hostel",
  "others showed interest",
  "students viewed this already",
];

// Generate consistent random text based on hostelName
function getRandomText(hostelName) {
  const nameSeed = hostelName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = nameSeed % viewTexts.length;
  return viewTexts[index];
}

function getRandomIncrement() {
  return Math.floor(Math.random() * 2) + 1;
}

function getRandomInterval() {
  return (Math.floor(Math.random() * 7) + 4) * 1000;
}

function startTracking(hostelName, initialViews = 0) {
  if (!globalViewCounts[hostelName]) {
    globalViewCounts[hostelName] = initialViews;
  }

  if (!globalTimeouts[hostelName]) {
    const updateViews = () => {
      globalViewCounts[hostelName] += getRandomIncrement();
      notifySubscribers(hostelName);
      globalTimeouts[hostelName] = setTimeout(updateViews, getRandomInterval());
    };

    const initialDelay = (hostelName.charCodeAt(0) % 7 + 4) * 1000;
    globalTimeouts[hostelName] = setTimeout(updateViews, initialDelay);
  }
}

function getViewCount(hostelName) {
  return globalViewCounts[hostelName] || 0;
}

function subscribe(hostelName, callback) {
  if (!subscribers[hostelName]) {
    subscribers[hostelName] = [];
  }
  subscribers[hostelName].push(callback);
}

function unsubscribe(hostelName, callback) {
  if (subscribers[hostelName]) {
    subscribers[hostelName] = subscribers[hostelName].filter(cb => cb !== callback);
  }
}

function notifySubscribers(hostelName) {
  if (subscribers[hostelName]) {
    subscribers[hostelName].forEach(cb => cb(globalViewCounts[hostelName]));
  }
}

export {
  getRandomText,
  startTracking,
  getViewCount,
  subscribe,
  unsubscribe,
};
