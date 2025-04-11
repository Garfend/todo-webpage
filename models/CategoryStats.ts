export class CategoryStats {
  constructor(todoCards = []) {
    this.todoCards = todoCards;
  }

  getCategoryDistribution() {
    const counts = {};
    this.todoCards.forEach(card => {
      counts[card.category] = (counts[card.category] || 0) + 1;
    });

    const total = this.todoCards.length;
    return Object.entries(counts).map(([category, count]) => ({
      category,
      percentage: Math.round((count / total) * 100),
    }));
  }
}
