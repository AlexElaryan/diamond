// Doughnut chart setup
const chartData = {
    labels: ["Мои вклады", "Реинвест", "Бонусы за рефералов", "Другое"],
    values: [1000, 100, 300, 50],
    colors: ['#000', 'rgba(8, 103, 255, 1)', 'rgba(139, 92, 246, 1)', 'rgba(154, 193, 255, 1)'],
};

const doughnutCtx = document.getElementById("doughnutChart").getContext("2d");
const doughnutChart = new Chart(doughnutCtx, {
    type: "doughnut",
    data: {
        labels: chartData.labels,
        datasets: [{
            data: chartData.values,
            backgroundColor: chartData.colors,
            borderColor: chartData.colors,
            borderWidth: 1,
            borderRadius: 6.5,
            offset: function (context) {
                const index = context.dataIndex;
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                const value = context.dataset.data[index];
                const percent = value / total;
                if (percent < 0.05) return 6;
                if (percent < 0.1) return 10;
                return 25;
            }
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Custom legend for doughnut
const legendContainer = document.getElementById("custom-legend");
legendContainer.innerHTML = chartData.labels.map((label, i) => `
  <p class="label text-16">
    <span>${label}</span>
    <span style="color: ${chartData.colors[i]}">$ ${chartData.values[i]}</span>
  </p>
`).join('');

// Line chart setup
const chartLabels = {
    today: ["00:00", "06:00", "12:00", "18:00", "24:00"],
    week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    year: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

const chartDataSets = {
    today: [500, 1200, 900, 1100, 1300],
    week: [2000, 1800, 2200, 2400, 2600, 2500, 2700],
    year: [1000, 1100, 1300, 1500, 1600, 1700, 1400, 1300, 1800, 2000, 1900, 2100]
};

const lineCtx = document.getElementById("lineChart").getContext("2d");

let lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: chartLabels.today,
        datasets: [{
            label: 'Series 1',
            data: chartDataSets.today,
            fill: false,
            borderColor: '#2196f3',
            backgroundColor: '#2196f3',
            borderWidth: 2,
            tension: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Handle tab switching for line chart
document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const range = button.getAttribute("data-range");
        lineChart.data.labels = chartLabels[range];
        lineChart.data.datasets[0].data = chartDataSets[range];
        lineChart.update();
    });
});

const ctx = document.getElementById('barChart').getContext('2d');

const labels = ["Jan", "Feb", "Mrch", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
const totalHeights = [60, 80, 75, 40, 60, 80, 75, 40, 60, 80, 75, 40,];
const blueHeights = [20, 30, 37, 18, 20, 30, 37, 18, 20, 30, 37, 18,];

const img = new Image();
img.src = '../img/bar.svg'; // double-check this path!

img.onload = () => {

    const pattern = ctx.createPattern(img, 'repeat'); // 'repeat' or 'no-repeat' — test both

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Background',
                    data: totalHeights,
                    backgroundColor: 'rgba(240, 240, 240, 1)',
                    barThickness: 40,
                    borderRadius: 12
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, max: 100, display: false, grid: { display: false } }
            },
            
            plugins: { legend: { display: false } }
        },
        plugins: [{
            id: 'drawFrontBars',
            afterDatasetsDraw(chart) {
                const { ctx, scales: { y } } = chart;
                const meta = chart.getDatasetMeta(0);

                meta.data.forEach((bar, i) => {
                    const barWidth = bar.width;
                    const barX = bar.x - barWidth / 2;
                    const frontHeight = blueHeights[i];
                    const barTop = y.getPixelForValue(frontHeight);
                    const barBottom = bar.base;
                    const height = barBottom - barTop;
                    const radius = 12;

                    ctx.save();

                    // Create rounded rectangle path for clipping
                    ctx.beginPath();
                    ctx.moveTo(barX, barTop + radius);
                    ctx.quadraticCurveTo(barX, barTop, barX + radius, barTop);
                    ctx.lineTo(barX + barWidth - radius, barTop);
                    ctx.quadraticCurveTo(barX + barWidth, barTop, barX + barWidth, barTop + radius);
                    ctx.lineTo(barX + barWidth, barBottom);
                    ctx.lineTo(barX, barBottom);
                    ctx.closePath();

                    ctx.clip();

                    // Calculate scale to cover the bar area
                    const imgAspect = img.width / img.height;
                    const barAspect = barWidth / height;

                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (imgAspect > barAspect) {
                        // Image is wider relative to bar
                        drawHeight = height;
                        drawWidth = imgAspect * drawHeight;
                        offsetX = barX - (drawWidth - barWidth) / 2;
                        offsetY = barTop;
                    } else {
                        // Image is taller relative to bar
                        drawWidth = barWidth;
                        drawHeight = drawWidth / imgAspect;
                        offsetX = barX;
                        offsetY = barTop - (drawHeight - height) / 2;
                    }

                    // Draw scaled image covering entire bar area
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                    ctx.restore();
                });
            }
        }]
    });
};
