import { router } from '../utils/router.js';
import { login } from '../utils/authService.js';
import { Validator } from '../utils/validator.js';

export function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container';

  const heading = document.createElement('h2');
  heading.textContent = 'Login';

  const form = document.createElement('form');
  form.id = 'loginForm';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'loginEmail';
  emailInput.placeholder = 'Email';
  emailInput.required = true;

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'loginPassword';
  passwordInput.placeholder = 'Password';
  passwordInput.required = true;

  const loginButton = document.createElement('button');
  loginButton.type = 'submit';
  loginButton.textContent = 'Login';

  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(loginButton);

  const switchToRegister = document.createElement('p');
  switchToRegister.innerHTML = `Don't have an account? <a href="#" id="toRegister">Register here</a>`;

  container.appendChild(heading);
  container.appendChild(form);
  container.appendChild(switchToRegister);
  app.appendChild(container);

  document.getElementById('toRegister').onclick = () => router('register');

  form.onsubmit = e => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!Validator.isEmail(email)) return alert('Please enter a valid email.');
    if (Validator.isEmpty(password)) return alert('Password required.');

    const result = login(email, password);

    if (result.success) {
      console.log("Login successful. Redirecting to home...");
      router('home');
    } else {
      alert(result.message || 'Invalid credentials.');
    }
  };
}
