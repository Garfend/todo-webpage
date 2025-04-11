import { getPastelColor } from '../utils/colorMap.js';

export class TodoCard {
  id: string;
  title: string;
  category: string;
  subtasks: { text: string; completed: boolean }[];
  description?: string;
  dueDate?: string;
  color: string;
  complete: boolean;

  constructor(data: {
    id?: string;
    title: string;
    category: string;
    subtasks?: { text: string; completed: boolean }[];
    description?: string;
    dueDate?: string;
    complete?: boolean;
  }) {
    this.id = data.id ?? Date.now().toString();
    this.title = data.title;
    this.category = data.category;
    this.description = data.description;
    this.dueDate = data.dueDate;
    this.subtasks = data.subtasks || [];
    this.complete = data.complete ?? false;
    this.color = getPastelColor(data.category);

    // Auto-sync main task completeness based on subtasks
    this.autoUpdateCompletion();
  }

  static fromJSON(json: any): TodoCard {
    return new TodoCard({
      id: json.id,
      title: json.title,
      category: json.category,
      description: json.description,
      dueDate: json.dueDate,
      subtasks: json.subtasks,
      complete: json.complete,
    });
  }

  get completionPercentage(): number {
    if (!this.subtasks.length) return this.complete ? 100 : 0;
    const completed = this.subtasks.filter(t => t.completed).length;
    const percentage = Math.round((completed / this.subtasks.length) * 100);
    return this.complete ? 100 : percentage;
  }

  markComplete(): void {
    this.complete = true;
    this.subtasks.forEach(sub => (sub.completed = true));
  }

  unmarkComplete(): void {
    this.complete = false;
    this.subtasks.forEach(sub => (sub.completed = false));
  }

  autoUpdateCompletion(): void {
    if (this.subtasks.length && this.subtasks.every(sub => sub.completed)) {
      this.complete = true;
    }
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      description: this.description,
      dueDate: this.dueDate,
      subtasks: this.subtasks,
      complete: this.complete,
    };
  }
}
