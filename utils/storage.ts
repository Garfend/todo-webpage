export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromStorage(key) {
  localStorage.removeItem(key);
}

export function getFromStorage(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch (err) {
    console.error(`Invalid JSON in localStorage for key "${key}"`, err);
    return null;
  }
}
