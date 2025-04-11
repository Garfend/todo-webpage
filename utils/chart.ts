import { getPastelColor } from './colorMap.js';

export function renderCategoryChart(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<canvas id="categoryChart" width="300" height="300"></canvas>';
  const canvas = document.getElementById('categoryChart');
  const ctx = canvas.getContext('2d');

  const total = data.reduce((sum, item) => sum + item.percentage, 0);
  let startAngle = 0;

  data.forEach((item) => {
    const sliceAngle = (item.percentage / total) * 2 * Math.PI;
    ctx.fillStyle = getPastelColor(item.category); // ✅ consistent with sticky cards
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 100, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    startAngle += sliceAngle;
  });

  // Build legend with same consistent colors
  let legend = '<ul>';
  data.forEach((item) => {
    const color = getPastelColor(item.category);
    legend += `<li><span style="background:${color}"></span>${item.category} (${item.percentage}%)</li>`;
  });
  legend += '</ul>';

  if (container) {
    const legendDiv = document.createElement('div');
    legendDiv.className = 'chart-legend';
    legendDiv.innerHTML = legend;
    container.appendChild(legendDiv);
  }
}
