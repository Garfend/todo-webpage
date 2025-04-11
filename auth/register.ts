import { router } from '../utils/router.js';
import { register } from '../utils/authService.js';
import { Validator } from '../utils/validator.js';

export function renderRegister() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container';

  const heading = document.createElement('h2');
  heading.textContent = 'Register';

  const form = document.createElement('form');
  form.id = 'registerForm';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'name';
  nameInput.placeholder = 'Full Name';
  nameInput.required = true;

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'email';
  emailInput.placeholder = 'Email';
  emailInput.required = true;

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password';
  passwordInput.placeholder = 'Password';
  passwordInput.required = true;

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Register';

  const switchToLogin = document.createElement('p');
  switchToLogin.innerHTML = `Already have an account? <a href="#" id="toLogin">Login here</a>`;

  form.appendChild(nameInput);
  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(submitBtn);

  container.appendChild(heading);
  container.appendChild(form);
  container.appendChild(switchToLogin);
  app.appendChild(container);

  document.getElementById('toLogin').onclick = () => router('login');

  form.onsubmit = e => {
    e.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (Validator.isEmpty(name)) return alert('Name required.');
    if (!Validator.isEmail(email)) return alert('Valid email required.');
    if (Validator.isEmpty(password)) return alert('Password required.');

    const result = register({ name, email, password });

    if (result.success) {
      console.log("Registration successful. Redirecting to home...");
      router('home');
    } else {
      alert(result.message || 'Could not register user.');
    }
  };
}
