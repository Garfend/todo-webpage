import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { router } from '../utils/router.js';
import { TodoCard } from '../models/TodoCard.js';
import { Validator } from '../utils/validator.js';
import { getUser } from '../utils/authService.js';

export function renderAddCard() {
  const user = getUser();
  if (!user) {
    router('login');
    return;
  }

  const app = document.getElementById('app');
  app.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container';

  const heading = document.createElement('h2');
  heading.textContent = 'Add New Task';

  const form = document.createElement('form');
  form.id = 'addCardForm';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'title';
  titleInput.placeholder = 'Task Title';
  titleInput.required = true;

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'category';
  categoryInput.placeholder = 'Category (e.g. Work, Personal)';
  categoryInput.required = true;

  const descriptionInput = document.createElement('textarea');
  descriptionInput.id = 'textarea';
  descriptionInput.placeholder = 'Description (optional)';
  descriptionInput.rows = 4;

  const label = document.createElement('label');
  label.htmlFor = 'dueDateInput';
  label.textContent = 'Due Date:';

  const dueDateInput = document.createElement('input');
  dueDateInput.type = 'date';
  dueDateInput.id = 'dueDateInput';
  dueDateInput.required = true;

  const createButton = document.createElement('button');
  createButton.type = 'submit';
  createButton.textContent = 'Create Task';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.id = 'cancelBtn';
  cancelButton.textContent = 'Cancel';

  form.appendChild(titleInput);
  form.appendChild(categoryInput);
  form.appendChild(descriptionInput);
  form.appendChild(label);
  form.appendChild(dueDateInput);
  form.appendChild(createButton);
  form.appendChild(cancelButton);

  container.appendChild(heading);
  container.appendChild(form);
  app.appendChild(container);

  form.onsubmit = e => {
    e.preventDefault();
    const title = titleInput.value;
    const category = categoryInput.value;
    const description = descriptionInput.value;
    const dueDate = dueDateInput.value;

    if (Validator.isEmpty(title) || Validator.isEmpty(category) || Validator.isEmpty(dueDate)) {
      return alert('Title and category are required!');
    }

    const key = `todo_cards_${user.id}`;
    const todoCards = getFromStorage(key) || [];
    const newCard = new TodoCard({ title, category, subtasks: [], dueDate, description });
    todoCards.push(newCard.toJSON());
    saveToStorage(key, todoCards);
    router('home');
  };

  cancelButton.onclick = () => router('home');
}
