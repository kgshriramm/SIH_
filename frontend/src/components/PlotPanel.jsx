import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components Chart.js needs
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PlotPanel({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  // Prepare the data for the chart
  // We'll plot pressure on the X-axis and temperature on the Y-axis
  const chartData = {
    labels: data.map(row => row.pressure), // X-axis labels
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map(row => row.temperature), // Y-axis data points
        fill: false,
        borderColor: '#10B981', // A nice green color
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#E5E7EB', // Text color for legend
        }
      },
      title: {
        display: true,
        text: 'Temperature vs. Pressure Profile',
        color: '#FFFFFF', // Text color for title
        font: {
            size: 16
        }
      },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Pressure (dbar)',
                color: '#9CA3AF'
            },
            ticks: {
                color: '#D1D5DB'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Temperature (°C)',
                color: '#9CA3AF'
            },
            ticks: {
                color: '#D1D5DB'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg animate-fade-in">
      <div style={{ height: '400px' }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}