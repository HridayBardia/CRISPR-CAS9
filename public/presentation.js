// CRISPR-Cas9 Slide Deck Interactive Controller
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide-wrapper');
  const totalSlides = slides.length;
  let currentSlideIndex = 0;

  // UI Elements
  const currentNumEl = document.getElementById('current-slide-num');
  const totalNumEl = document.getElementById('total-slide-num');
  const themePillEl = document.getElementById('current-theme-pill');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnOverview = document.getElementById('btn-overview');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnPrint = document.getElementById('btn-print');
  
  const overviewModal = document.getElementById('overview-modal');
  const btnCloseOverview = document.getElementById('btn-close-overview');
  const overviewGrid = document.getElementById('overview-grid');

  // Initialize total slide count
  if (totalNumEl) {
    totalNumEl.textContent = String(totalSlides).padStart(2, '0');
  }

  // Populate Overview Grid
  slides.forEach((slide, index) => {
    const slideNum = index + 1;
    let headingText = `Slide ${slideNum}`;
    const heading = slide.querySelector('.slide-heading') || slide.querySelector('.hero-main-title');
    if (heading) {
      headingText = heading.textContent.trim();
    }

    const isNavy = (index % 2 === 0);
    const thumb = document.createElement('div');
    thumb.className = `slide-thumb ${isNavy ? 'navy-thumb' : 'slate-thumb'} ${index === 0 ? 'active' : ''}`;
    thumb.setAttribute('data-index', index);
    thumb.innerHTML = `
      <div class="thumb-num">${isNavy ? '🌌 NAVY' : '🔬 SLATE'} • SLIDE ${String(slideNum).padStart(2, '0')}</div>
      <div class="thumb-title">${headingText}</div>
    `;

    thumb.addEventListener('click', () => {
      goToSlide(index);
      closeOverview();
    });

    overviewGrid.appendChild(thumb);
  });

  function updateSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentSlideIndex = index;

    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === currentSlideIndex);
    });

    // Update Counter
    if (currentNumEl) {
      currentNumEl.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }

    // Update Theme Indicator
    const currentSlide = slides[currentSlideIndex];
    const theme = currentSlide.getAttribute('data-theme') || (currentSlideIndex % 2 === 0 ? 'GENOMIC NAVY' : 'LAB SLATE');
    if (themePillEl) {
      themePillEl.textContent = theme;
      if (theme.includes('NAVY')) {
        themePillEl.className = 'theme-pill navy-pill';
      } else {
        themePillEl.className = 'theme-pill slate-pill';
      }
    }

    // Update Overview active state
    const thumbs = overviewGrid.querySelectorAll('.slide-thumb');
    thumbs.forEach((t, idx) => {
      t.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      updateSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      updateSlide(currentSlideIndex - 1);
    }
  }

  function goToSlide(index) {
    updateSlide(index);
  }

  function toggleOverview() {
    overviewModal.classList.toggle('open');
  }

  function closeOverview() {
    overviewModal.classList.remove('open');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Event Listeners for UI Buttons
  btnPrev?.addEventListener('click', prevSlide);
  btnNext?.addEventListener('click', nextSlide);
  btnOverview?.addEventListener('click', toggleOverview);
  btnCloseOverview?.addEventListener('click', closeOverview);
  btnFullscreen?.addEventListener('click', toggleFullscreen);
  btnPrint?.addEventListener('click', () => {
    window.print();
  });

  // Modal backdrop close
  overviewModal?.addEventListener('click', (e) => {
    if (e.target === overviewModal) {
      closeOverview();
    }
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (overviewModal.classList.contains('open') && e.key === 'Escape') {
      closeOverview();
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case 'o':
      case 'O':
      case 'Tab':
        e.preventDefault();
        toggleOverview();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'p':
      case 'P':
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        window.print();
        break;
      case 'Escape':
        closeOverview();
        break;
    }
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }

  // Initialize
  updateSlide(0);
});
