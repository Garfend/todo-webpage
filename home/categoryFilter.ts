import { TodoCard } from "../models/TodoCard.js";

export function initCategoryFilter(
  sidebar: HTMLElement,
  onCategoryChange: (selected: string[]) => void,
  todoCards: TodoCard[]
): void {
  const section = document.createElement("div");
  section.className = "sidebar-section";

  const headerWrapper = document.createElement("div");
  headerWrapper.className = "sidebar-section cat-filter";

  const header = document.createElement("h3");
  header.textContent = "Categories";

  const dropdown = document.createElement("select");
  dropdown.id = "addCategoryDropdown";
  dropdown.className = "add-category-dropdown";

  const placeholderOption = document.createElement("option");
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  placeholderOption.hidden = true;
  placeholderOption.textContent = "+";

  dropdown.appendChild(placeholderOption);

  const uniqueCategories = Array.from(
    new Set(todoCards.map(card => card.category).filter(Boolean))
  );

  uniqueCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    dropdown.appendChild(opt);
  });

  headerWrapper.appendChild(header);
  headerWrapper.appendChild(dropdown);

  const selected = document.createElement("div");
  selected.id = "selectedCategories";
  selected.className = "tag-list vertical-tags";

  section.appendChild(headerWrapper);
  section.appendChild(selected);
  sidebar.appendChild(section);

  const selectedSet = new Set<string>();

  dropdown.onchange = () => {
    const cat = dropdown.value;
    if (!selectedSet.has(cat)) {
      selectedSet.add(cat);
      renderSelected();
    }
    dropdown.selectedIndex = 0;
  };

  function renderSelected() {
    selected.innerHTML = "";
    selectedSet.forEach(cat => {
      const tag = document.createElement("span");
      tag.className = "tag sidebar-tag";
      tag.textContent = cat;

      const x = document.createElement("span");
      x.textContent = " ×";
      x.className = "remove-tag";
      x.onclick = () => {
        selectedSet.delete(cat);
        renderSelected();
      };

      tag.appendChild(x);
      selected.appendChild(tag);
    });

    onCategoryChange([...selectedSet]);
  }
}
