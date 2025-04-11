import { router } from './utils/router.js';
import { isAuthenticated } from './utils/authService.js';

window.addEventListener('DOMContentLoaded', () => {
  const path = isAuthenticated() ? 'home' : 'login';
  router(path);
});
