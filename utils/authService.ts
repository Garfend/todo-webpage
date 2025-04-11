import { User } from '../models/User.js';
import { saveToStorage, getFromStorage } from './storage.js';

const USERS_KEY = 'todo_users';
const ACTIVE_USER_KEY = 'active_user';

/**
 * Registers a new user if the email is unique.
 */
export function register(userObj) {
  const users = getFromStorage(USERS_KEY) || [];
  const exists = users.find(u => u.email.trim().toLowerCase() === userObj.email.trim().toLowerCase());

  if (exists) {
    console.log("Register - Email already exists:", userObj.email);
    return { success: false, message: 'Email already exists' };
  }

  const user = new User({
    ...userObj,
    id: crypto.randomUUID(),
    token: generateToken()
  });

  users.push(user.toJSON());
  saveToStorage(USERS_KEY, users);
  localStorage.setItem(ACTIVE_USER_KEY, user.id);

  console.log("Register - New user created:", user);
  return { success: true, user };
}

/**
 * Attempts to log in using provided credentials.
 */
export function login(email, password) {
  const rawUsers = getFromStorage(USERS_KEY) || [];
  const users = rawUsers.map(User.fromJSON);

  console.log("Login - Checking users for:", email, users);

  const trimmedEmail = email.trim().toLowerCase();

  const user = users.find(u =>
    u.email.trim().toLowerCase() === trimmedEmail &&
    u.password === password
  );

  if (!user) {
    console.log("Login - Invalid credentials for:", email);
    return { success: false, message: 'Invalid credentials' };
  }

  localStorage.setItem(ACTIVE_USER_KEY, user.id);
  console.log("Login - Found user:", user);
  return { success: true, user };
}

/**
 * Returns the authenticated user from localStorage.
 */
export function getUser() {
  const userId = localStorage.getItem(ACTIVE_USER_KEY);
  const users = getFromStorage(USERS_KEY) || [];
  const found = users.find(u => u.id === userId);
  console.log("getUser - Searching for:", userId, "Found:", found);
  return found ? User.fromJSON(found) : null;
}

/**
 * Returns true if a user is currently authenticated.
 */
export function isAuthenticated() {
  const activeId = localStorage.getItem(ACTIVE_USER_KEY);
  console.log("isAuthenticated - active_user ID:", activeId);
  return !!activeId;
}

/**
 * Logs the user out.
 */
export function logout() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

/**
 * Generates a random token (UUID).
 */
function generateToken() {
  return crypto.randomUUID();
}
