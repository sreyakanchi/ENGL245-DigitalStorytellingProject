/* ============================================
   STILL ALIVE — scrollytelling essay
   script.js
   ============================================ */

// --- Scroll Reveal: Chapters ---
// Watches each .chapter section and adds .visible when it enters the viewport

const chapters = document.querySelectorAll('.chapter');

const chapterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop watching (no need to re-trigger)
        chapterObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.08, // trigger when 8% of section is visible
  }
);

chapters.forEach((chapter) => chapterObserver.observe(chapter));


// --- Scroll Reveal: Timeline Items ---
// Each timeline entry staggers in with a small delay

const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger each item by 120ms
        const index = Array.from(timelineItems).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 120);
        timelineObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

timelineItems.forEach((item) => timelineObserver.observe(item));


// --- Scroll Reveal: Stat Cards ---
// Fade in stat cards one by one when the grid enters view

const statCards = document.querySelectorAll('.stat-card');

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.stat-card');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          card.style.transition = `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`;
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        });
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

const statGrid = document.querySelector('.stat-grid');
if (statGrid) statObserver.observe(statGrid);


// --- Active Chapter Tracking (optional: for progress indicator later) ---
// Logs the current chapter to the console — useful if you add a nav/progress bar

const allSections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // console.log('Active section:', entry.target.id);
        // Uncomment the line above to debug section tracking
        // You can use this to highlight a nav item or show a progress bar
      }
    });
  },
  { threshold: 0.4 }
);

allSections.forEach((section) => sectionObserver.observe(section));

// ============================================
// D3 ATTENDANCE CHART
// ============================================

const metData = [
  { year: 2015, value: 79 },
  { year: 2016, value: 78 },
  { year: 2017, value: 77 },
  { year: 2018, value: 75 },
  { year: 2019, value: 74 },
  { year: 2022, value: 61 },
  { year: 2023, value: 72 },
  { year: 2024, value: 72 },
];

const rboData = [
  { year: 2015, value: 83 },
  { year: 2016, value: 85 },
  { year: 2017, value: 84 },
  { year: 2018, value: 86 },
  { year: 2019, value: 87 },
  { year: 2022, value: 78 },
  { year: 2023, value: 85 },
  { year: 2024, value: 88 },
];

function buildChart() {
  const svg = d3.select('#attendance-chart');
  const container = document.querySelector('.chart-container');
  if (!svg.node() || !container) return;

  const margin = { top: 20, right: 24, bottom: 36, left: 44 };
  const totalWidth = container.clientWidth - 48;
  const totalHeight = 260;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  svg.attr('width', totalWidth).attr('height', totalHeight);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const allYears = [...new Set([...metData, ...rboData].map(d => d.year))].sort();

  const x = d3.scalePoint()
    .domain(allYears)
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([50, 100])
    .range([height, 0]);

  // Gridlines
  g.append('g')
    .selectAll('line.chart-gridline')
    .data(y.ticks(5))
    .enter()
    .append('line')
    .attr('class', 'chart-gridline')
    .attr('x1', 0).attr('x2', width)
    .attr('y1', d => y(d)).attr('y2', d => y(d));

  // Axes
  g.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d => `'${String(d).slice(2)}`));

  g.append('g')
    .attr('class', 'chart-axis')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`));

  // Line generator
  const lineGen = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

  // COVID gap annotation
  const gapX = (x(2019) + x(2022)) / 2;
  g.append('line')
    .attr('x1', gapX).attr('x2', gapX)
    .attr('y1', 0).attr('y2', height)
    .attr('stroke', 'rgba(245,240,232,0.08)')
    .attr('stroke-dasharray', '4 3');

  g.append('text')
    .attr('class', 'chart-annotation')
    .attr('x', gapX)
    .attr('y', 12)
    .attr('text-anchor', 'middle')
    .text('COVID closure');

  // RBO line + dots
  g.append('path').datum(rboData).attr('class', 'chart-line-rbo').attr('d', lineGen);
  g.selectAll('.dot-rbo')
    .data(rboData).enter()
    .append('circle')
    .attr('class', 'chart-dot-rbo')
    .attr('cx', d => x(d.year))
    .attr('cy', d => y(d.value))
    .attr('r', 3.5);

  // Met line + dots
  g.append('path').datum(metData).attr('class', 'chart-line-met').attr('d', lineGen);
  g.selectAll('.dot-met')
    .data(metData).enter()
    .append('circle')
    .attr('class', 'chart-dot-met')
    .attr('cx', d => x(d.year))
    .attr('cy', d => y(d.value))
    .attr('r', 3.5);

  // Tooltip
  const tooltip = d3.select('body').append('div').attr('class', 'chart-tooltip');

  function showTip(event, d, label, color) {
    tooltip
      .style('opacity', 1)
      .style('left', `${event.pageX + 12}px`)
      .style('top', `${event.pageY - 28}px`)
      .html(`<span style="color:${color}">${label}</span><br>${d.year} — ${d.value}% occupancy`);
  }

  function hideTip() { tooltip.style('opacity', 0); }

  g.selectAll('.dot-met')
    .on('mouseover', (e, d) => showTip(e, d, 'Metropolitan Opera', '#c9a84c'))
    .on('mousemove', (e, d) => showTip(e, d, 'Metropolitan Opera', '#c9a84c'))
    .on('mouseleave', hideTip);

  g.selectAll('.dot-rbo')
    .on('mouseover', (e, d) => showTip(e, d, 'Royal Ballet & Opera', '#a78bfa'))
    .on('mousemove', (e, d) => showTip(e, d, 'Royal Ballet & Opera', '#a78bfa'))
    .on('mouseleave', hideTip);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildChart);
} else {
  buildChart();
}