import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { router } from '../utils/router.js';
import { TodoCard } from '../models/TodoCard.js';
import { Validator } from '../utils/validator.js';
import { getUser } from '../utils/authService.js';

export function renderCardDetails() {
  const user = getUser();
  if (!user) {
    router('login');
    return;
  }

  const cardId = localStorage.getItem('active_card_id');
  const cards = (getFromStorage(`todo_cards_${user.id}`) || []).map(TodoCard.fromJSON);
  const card = cards.find(c => c.id === cardId);

  const app = document.getElementById('app');
  app.innerHTML = '';

  if (!card) {
    const msg = document.createElement('p');
    msg.textContent = 'Task not found.';
    app.appendChild(msg);
    return;
  }

  const container = document.createElement('div');
  container.className = 'container';
  container.style.maxWidth = '600px';
  container.style.margin = '40px auto';
  container.style.textAlign = 'center';

  const heading = document.createElement('h2');
  heading.textContent = 'Edit Task';

  // ✅ Complete Task Toggle
  const completeTaskToggle = document.createElement('label');
  completeTaskToggle.style.float = 'left';
  completeTaskToggle.style.display = 'flex';
  completeTaskToggle.style.alignItems = 'center';
  completeTaskToggle.style.marginBottom = '10px';
  completeTaskToggle.style.gap = '6px';
  const completeCheckbox = document.createElement('input');
  completeCheckbox.type = 'checkbox';
  completeCheckbox.checked = card.complete;
  completeTaskToggle.appendChild(completeCheckbox);
  completeTaskToggle.appendChild(document.createTextNode('Complete Task'));

  const form = document.createElement('form');
  form.id = 'editTaskForm';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'titleInput';
  titleInput.value = card.title;
  titleInput.placeholder = 'Title';
  titleInput.required = true;

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'categoryInput';
  categoryInput.value = card.category;
  categoryInput.placeholder = 'Category';
  categoryInput.required = true;

  const descriptionInput = document.createElement('textarea');
  descriptionInput.id = 'textarea';
  descriptionInput.placeholder = 'Description (optional)';
  descriptionInput.rows = 4;
  descriptionInput.value = card.description || '';

  const dueDateLabel = document.createElement('label');
  dueDateLabel.htmlFor = 'dueDateInput';
  dueDateLabel.textContent = 'Due Date:';

  const dueDateInput = document.createElement('input');
  dueDateInput.type = 'date';
  dueDateInput.id = 'dueDateInput';
  dueDateInput.required = true;
  dueDateInput.value = card.dueDate
    ? new Date(card.dueDate).toISOString().split('T')[0]
    : '';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.id = 'cancelBtn';
  cancelBtn.textContent = 'Cancel';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.id = 'deleteBtn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.backgroundColor = 'red';
  deleteBtn.style.color = 'white';

  const subtaskInputRow = document.createElement('div');
  subtaskInputRow.className = 'subtask-input';
  
  const subtaskInput = document.createElement('input');
  subtaskInput.placeholder = 'Add subtask...';
  subtaskInput.style.flex = '1';
  
  const subtaskAddBtn = document.createElement('button');
  subtaskAddBtn.textContent = '+';
  subtaskAddBtn.type = 'button';
  subtaskAddBtn.className = 'add-subtask-btn';

  
  subtaskInputRow.append(subtaskInput, subtaskAddBtn);
  


  const subtaskList = document.createElement('div');
  subtaskList.className = 'subtask-item input';
  const renderSubtasks = () => {
    subtaskList.innerHTML = '';
    card.subtasks.forEach((subtask, i) => {
      const row = document.createElement('div');
      row.className = 'subtask-item';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = subtask.completed;
      const lbl = document.createElement('span');
      lbl.textContent = subtask.text;

      cb.onchange = () => {
        card.subtasks[i].completed = cb.checked;
        if (card.subtasks.every(s => s.completed)) {
          card.complete = true;
          completeCheckbox.checked = true;
        } else {
          card.complete = false;
          completeCheckbox.checked = false;
        }
        saveToStorage(`todo_cards_${user.id}`, cards.map(c => c.toJSON()));
      };

      row.append(cb, lbl);
      subtaskList.appendChild(row);
    });
  };

  subtaskAddBtn.onclick = () => {
    const text = subtaskInput.value.trim();
    if (!text) return;
    card.subtasks.push({ text, completed: false });
    subtaskInput.value = '';
    renderSubtasks();
    saveToStorage(`todo_cards_${user.id}`, cards.map(c => c.toJSON()));
  };

  completeCheckbox.onchange = () => {
    card.complete = completeCheckbox.checked;
    card.subtasks.forEach(s => (s.completed = card.complete));
    renderSubtasks();
    saveToStorage(`todo_cards_${user.id}`, cards.map(c => c.toJSON()));
  };

  form.appendChild(titleInput);
  form.appendChild(categoryInput);
  form.appendChild(descriptionInput);
  form.appendChild(dueDateLabel);
  form.appendChild(dueDateInput);
  form.appendChild(subtaskInputRow);
  form.appendChild(subtaskList);
  form.appendChild(saveBtn);
  form.appendChild(cancelBtn);
  form.appendChild(deleteBtn);

  container.appendChild(heading);
  container.appendChild(completeTaskToggle); // ✅ added toggle
  container.appendChild(form);
  app.appendChild(container);

  renderSubtasks(); // render on load

  form.onsubmit = e => {
    e.preventDefault();
    const title = titleInput.value;
    const category = categoryInput.value;
    const description = descriptionInput.value;
    const dueDate = dueDateInput.value;

    if (Validator.isEmpty(title) || Validator.isEmpty(category) || Validator.isEmpty(dueDate)) {
      return alert('Title, Category, and Due Date are required.');
    }

    card.title = title;
    card.category = category;
    card.description = description;
    card.dueDate = new Date(dueDate);

    const index = cards.findIndex(c => c.id === card.id);
    cards[index] = card;

    saveToStorage(`todo_cards_${user.id}`, cards.map(c => c.toJSON()));
    router('home');
  };

  cancelBtn.onclick = () => router('home');

  deleteBtn.onclick = () => {
    const updatedCards = cards.filter(c => c.id !== card.id);
    saveToStorage(`todo_cards_${user.id}`, updatedCards.map(c => c.toJSON()));
    router('home');
  };
}
