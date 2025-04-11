import { getUser } from "../utils/authService.js";
import { getFromStorage } from "../utils/storage.js";
import { TodoCard } from "../models/TodoCard.js";
import { CategoryStats } from "../models/CategoryStats.js";
import { renderCategoryChart } from "../utils/chart.js";
import { router } from "../utils/router.js";
import { initCategoryFilter } from "../home/categoryFilter.js";

export function renderHome() {
  const user = getUser();
  if (!user) return router("login");

  const todoCards = (getFromStorage(`todo_cards_${user.id}`) || []).map(
    TodoCard.fromJSON
  );
  const stats = new CategoryStats(todoCards).getCategoryDistribution();

  const app = document.getElementById("app");
  app.innerHTML = "";

  const homeContainer = document.createElement("div");
  homeContainer.className = "home-container";

  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";

  const tabList = document.createElement("div");
  tabList.className = "tab-list";
  const tabs = ['all', 'prev', 'today', 'tomorrow', 'upcoming', 'completed'];
  tabs.forEach(type => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.tab = type;
    tab.textContent = type[0].toUpperCase() + type.slice(1);
    tabList.appendChild(tab);
  });

  const searchBox = document.createElement("input");
  searchBox.type = "text";
  searchBox.id = "searchBox";
  searchBox.className = "search-box";
  searchBox.placeholder = "Search tasks...";
  sidebar.appendChild(searchBox);
  sidebar.appendChild(tabList);

  initCategoryFilter(sidebar, (selectedCategories) => {
    activeTags = selectedCategories;
    localStorage.setItem('selected_tags', JSON.stringify(activeTags)); // ✅ persist
    renderTasks(todoCards, currentTab);
  }, todoCards);

  // ✅ Restore tags visually in UI
  const storedTags = JSON.parse(localStorage.getItem('selected_tags') || '[]');
  if (storedTags.length > 0) {
    const tagContainer = sidebar.querySelector('.tag-list');
    if (tagContainer) {
      tagContainer.innerHTML = '';
      storedTags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'tag';
        tagEl.textContent = tag;

        const removeBtn = document.createElement('span');
        removeBtn.textContent = '×';
        removeBtn.className = 'remove-tag';
        removeBtn.onclick = () => {
          activeTags = activeTags.filter(t => t !== tag);
          localStorage.setItem('selected_tags', JSON.stringify(activeTags));
          renderTasks(todoCards, currentTab);
          tagEl.remove();
        };

        tagEl.appendChild(removeBtn);
        tagContainer.appendChild(tagEl);
      });
    }
    activeTags = storedTags;
  }

  const main = document.createElement("main");
  main.className = "main";

  const header = document.createElement("div");
  header.className = "header";

  const h1 = document.createElement("h1");
  h1.textContent = `Welcome, ${user.name}!`;

  const logoutBtn = document.createElement("button");
  logoutBtn.className = "sidebar-btn";
  logoutBtn.id = "logoutBtn";
  logoutBtn.textContent = "Sign out";

  header.appendChild(h1);
  header.appendChild(logoutBtn);

  const chartContainer = document.createElement("section");
  chartContainer.className = "chart-container";
  chartContainer.id = "chartContainer";

  const cardGrid = document.createElement("section");
  cardGrid.className = "cards-grid";
  cardGrid.id = "cardGrid";

  main.appendChild(header);
  main.appendChild(chartContainer);
  main.appendChild(cardGrid);

  homeContainer.appendChild(sidebar);
  homeContainer.appendChild(main);

  app.appendChild(homeContainer);

  renderCategoryChart("chartContainer", stats);
  setupFilters(todoCards);
  renderTasks(todoCards, currentTab);

  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("active_user");
    localStorage.removeItem("search_text");
    localStorage.removeItem("selected_tags");
    localStorage.removeItem("current_tab");
    router("login");
  };
}

let activeTags: string[] = [];
let searchText = "";
let currentTab = localStorage.getItem("current_tab") || "all";

function setupFilters(todoCards) {
  const searchBox = document.getElementById("searchBox");

  const storedSearch = localStorage.getItem('search_text');
  if (storedSearch) {
    searchBox.value = storedSearch;
    searchText = storedSearch.toLowerCase();
  }

  searchBox.oninput = () => {
    searchText = searchBox.value.toLowerCase();
    localStorage.setItem('search_text', searchBox.value);
    renderTasks(todoCards, currentTab);
  };

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
    if (tab.dataset.tab === currentTab) tab.classList.add("active");

    tab.onclick = () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentTab = tab.dataset.tab;
      localStorage.setItem("current_tab", currentTab); // ✅ persist tab
      renderTasks(todoCards, currentTab);
    };
  });
}

function renderTasks(cards, tabType) {
  let filtered = cards.filter((card) => {
    const matchesTag =
      activeTags.length === 0 ||
      activeTags.some(tag => card.category.toLowerCase() === tag.toLowerCase());

    const matchesSearch =
      card.title.toLowerCase().includes(searchText) ||
      (card.description || "").toLowerCase().includes(searchText);

    return matchesTag && matchesSearch;
  });

  const today = new Date();
  const format = (d) => d.toISOString().split("T")[0];
  if (tabType === "prev") {
    filtered = filtered.filter((c) => {
      const dueDate = new Date(c.dueDate);
      return dueDate < today && dueDate.toDateString() !== today.toDateString();
    });
  }
  else if (tabType === "today") {
    filtered = filtered.filter((c) => format(new Date(c.dueDate)) === format(today));
  } else if (tabType === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    filtered = filtered.filter((c) => format(new Date(c.dueDate)) === format(tomorrow));
  } else if (tabType === "upcoming") {
    filtered = filtered.filter((c) => new Date(c.dueDate) > today);
  }
  else if (tabType === "all") {
    filtered = filtered.filter((c) => true);
  }
  else if (tabType === "completed") {
    filtered = filtered.filter((c) => c.complete === true);
  }

  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "";

  filtered.forEach((card) => {
    const cardElement = renderStickyCard(card);
    cardElement.onclick = () => {
      localStorage.setItem("active_card_id", String(card.id));
      router("card-details");
    };
    grid.appendChild(cardElement);
  });

  const addCardBtn = document.createElement("div");
  addCardBtn.className = "card new-card";
  addCardBtn.id = "addCardBtn";
  addCardBtn.textContent = "+";
  addCardBtn.onclick = () => router("add-card");

  grid.appendChild(addCardBtn);
}

export function renderStickyCard(card: TodoCard): HTMLElement {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  cardDiv.setAttribute("data-id", String(card.id));
  cardDiv.style.backgroundColor = card.color;

  const title = document.createElement("h3");
  title.textContent = card.title;

  const subtasksPreview = document.createElement("p");
  subtasksPreview.textContent = card.subtasks.length
    ? `${card.subtasks.length} subtasks`
    : "No subtasks";

  const progress = document.createElement("div");
  progress.className = "progress";

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBar.style.width = `${card.completionPercentage}%`;

  progress.appendChild(progressBar);
  cardDiv.appendChild(title);
  cardDiv.appendChild(subtasksPreview);
  cardDiv.appendChild(progress);

  return cardDiv;
}
