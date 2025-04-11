import { renderLogin } from '../auth/login.js';
import { renderRegister } from '../auth/register.js';
import { renderHome } from '../home/home.js';
import { renderCardDetails } from '../home/cardDetails.js';
import { renderAddCard } from '../home/addCard.js';


export function router(path) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  switch (path) {
    case 'login':
      renderLogin();
      break;
    case 'register':
      renderRegister();
      break;
    case 'home':
      renderHome();
      break;
    case 'card-details':
      renderCardDetails();
      break;
    case 'add-card':
      renderAddCard();
      break;
    default:
      renderLogin();
  }
}
