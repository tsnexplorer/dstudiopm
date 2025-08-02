import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function ProjectStatePieChart({ data }) {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const colors = [
    '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9e9e9e', '#f44336', '#00bcd4'
  ];
  return (
    <Pie
      data={{
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
        }],
      }}
      options={{ plugins: { legend: { position: 'bottom' } } }}
    />
  );
}

export function ProjectStateStackedBarChart({ data }) {
  const labels = data.map(d => d.label);
  const stateKeys = Array.from(new Set(data.flatMap(d => Object.keys(d).filter(k => k !== 'label'))));
  const colors = [
    '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9e9e9e', '#f44336', '#00bcd4'
  ];
  const datasets = stateKeys.map((state, i) => ({
    label: state,
    data: data.map(d => d[state] || 0),
    backgroundColor: colors[i % colors.length],
    stack: 'states',
  }));
  return (
    <Bar
      data={{ labels, datasets }}
      options={{
        plugins: { legend: { position: 'bottom' } },
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      }}
    />
  );
}
