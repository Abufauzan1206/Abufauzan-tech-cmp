/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Foundation Module: FM-010
 * Component: CMPCharts
 * Version: 1.0.0
 * =====================================================
 */

import Chart from "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js";

// Chart rendering is powered by Chart.js.
// CMPCharts provides a unified interface for the platform.

export class CMPCharts {

  static charts = {};
  
  static register(id, chart) {

  this.charts[id] = chart;

}

static get(id) {

  return this.charts[id];

}

static remove(id) {

  delete this.charts[id];

}

static clear() {

  Object.values(this.charts).forEach(chart => {

  try {

    chart.destroy();

  } catch (error) {

    console.error(error);

  }

});

  this.charts = {};

}

static create(id, canvasId, config) {

  const canvas =
    document.getElementById(canvasId);

  if (!canvas) {

    throw new Error(

      `Canvas '${canvasId}' not found.`

    );

  }

  const chart =
    new Chart(canvas, config);

  this.register(id, chart);

  return chart;

}

static update(id, data) {

  const chart = this.get(id);

  if (!chart) return;

  chart.data = data;

  chart.update();

}

static destroy(id) {

  const chart = this.get(id);

  if (!chart) return;

  try {

    chart.destroy();

  } finally {

    this.remove(id);

  }

}

static createBarChart(

  id,

  canvasId,

  labels,

  data,

  label

) {

  return this.create(

    id,

    canvasId,

    {

      type: "bar",

      data: {

        labels,

        datasets: [

          {

            label,

            data

          }

        ]

      }

    }

  );

}

static createLineChart(
  id,
  canvasId,
  labels,
  data,
  label
) {

  return this.create(
    id,
    canvasId,
    {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label,
            data
          }
        ]
      }
    }
  );

}

static createPieChart(
  id,
  canvasId,
  labels,
  data
) {

  return this.create(
    id,
    canvasId,
    {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data
          }
        ]
      }
    }
  );

}

}
