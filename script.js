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