// ===================================================================
// CRISPR-Cas9 Master Slide Deck Controller
// Executive Presentation Navigation & Interactive High-Definition Lightbox
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide-wrapper');
  const totalSlides = slides.length;
  let currentSlideIndex = 0;

  // Header DOM Elements
  const currentNumEl = document.getElementById('current-slide-num');
  const totalNumEl = document.getElementById('total-slide-num');
  const themePillEl = document.getElementById('current-theme-pill');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnOverview = document.getElementById('btn-overview');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnPrint = document.getElementById('btn-print');

  // Overview Modal Elements
  const overviewModal = document.getElementById('overview-modal');
  const btnCloseOverview = document.getElementById('btn-close-overview');
  const overviewGrid = document.getElementById('overview-grid');

  // Lightbox Modal Elements
  const lightboxModal = document.getElementById('image-lightbox-modal');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const btnCloseLightbox = document.getElementById('btn-lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxFigNum = document.getElementById('lightbox-fig-num');
  const lightboxFigTitle = document.getElementById('lightbox-fig-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxTags = document.getElementById('lightbox-tags');
  const lightboxPoints = document.getElementById('lightbox-points');

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
      <div class="thumb-num">${isNavy ? '🌌 GENOMIC NAVY' : '🔬 LAB SLATE'} • SLIDE ${String(slideNum).padStart(2, '0')}</div>
      <div class="thumb-title">${headingText}</div>
    `;

    thumb.addEventListener('click', () => {
      goToSlide(index);
      closeOverview();
    });

    overviewGrid?.appendChild(thumb);
  });

  // Slide Switch Logic
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

    // Update Overview Active State
    const thumbs = overviewGrid?.querySelectorAll('.slide-thumb');
    thumbs?.forEach((t, idx) => {
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
    overviewModal?.classList.toggle('open');
  }

  function closeOverview() {
    overviewModal?.classList.remove('open');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error entering fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // ===================================================================
  // Lightbox Modal Handlers (Full Uncropped HD Inspection)
  // ===================================================================
  function openLightboxForSlide(slideWrapper) {
    if (!slideWrapper || !lightboxModal) return;

    const imgBox = slideWrapper.querySelector('.slide-image-box');
    const imgEl = slideWrapper.querySelector('.slide-visual-img');
    const explainCard = slideWrapper.querySelector('.figure-explain-card');
    const overlayTag = slideWrapper.querySelector('.img-overlay-tag');

    if (!imgEl) return;

    const imgSrc = imgEl.getAttribute('src');
    const overlayText = overlayTag ? overlayTag.textContent.replace('FIGURE', '').trim() : '';
    const figNum = slideWrapper.getAttribute('data-slide') || '1';
    
    // Set Image
    if (lightboxImg) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgEl.getAttribute('alt') || 'Scientific Figure';
    }

    // Set Header
    if (lightboxFigNum) {
      lightboxFigNum.textContent = `FIGURE ${String(figNum).padStart(2, '0')}`;
    }

    const titleEl = explainCard ? explainCard.querySelector('.figure-explain-title') : null;
    if (lightboxFigTitle) {
      lightboxFigTitle.textContent = titleEl ? titleEl.textContent.trim() : (overlayText || 'Molecular Mechanism Architecture');
    }

    // Set Description
    const descEl = explainCard ? explainCard.querySelector('.figure-explain-desc') : null;
    if (lightboxDesc) {
      lightboxDesc.textContent = descEl ? descEl.textContent.trim() : 'High-resolution cryo-EM structure and biochemical reaction mechanisms.';
    }

    // Set Tags / Key Labels
    if (lightboxTags) {
      lightboxTags.innerHTML = '';
      const tags = explainCard ? explainCard.querySelectorAll('.fig-key-pill') : [];
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'lightbox-tag-item';
        span.textContent = tag.textContent.trim();
        lightboxTags.appendChild(span);
      });
    }

    // Set Monograph Bullet Points
    if (lightboxPoints) {
      lightboxPoints.innerHTML = '';
      const points = explainCard ? explainCard.querySelectorAll('.figure-point') : [];
      points.forEach(pt => {
        const li = document.createElement('li');
        li.innerHTML = pt.innerHTML;
        lightboxPoints.appendChild(li);
      });
    }

    lightboxModal.classList.add('open');
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('open');
  }

  // Attach Lightbox click listeners to all image boxes across slides
  document.querySelectorAll('.slide-image-box').forEach(box => {
    box.addEventListener('click', (e) => {
      const slide = box.closest('.slide-wrapper');
      if (slide) {
        openLightboxForSlide(slide);
      }
    });
  });

  btnCloseLightbox?.addEventListener('click', closeLightbox);
  lightboxOverlay?.addEventListener('click', closeLightbox);

  // Hero Start Button on Slide 1
  document.getElementById('btn-hero-start')?.addEventListener('click', () => {
    goToSlide(1);
  });

  // ===================================================================
  // Global Event Listeners (Keyboard & Clicks)
  // ===================================================================
  btnPrev?.addEventListener('click', prevSlide);
  btnNext?.addEventListener('click', nextSlide);
  btnOverview?.addEventListener('click', toggleOverview);
  btnCloseOverview?.addEventListener('click', closeOverview);
  btnFullscreen?.addEventListener('click', toggleFullscreen);

  btnPrint?.addEventListener('click', () => {
    window.print();
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // If Lightbox is open, Esc closes it
    if (lightboxModal?.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeLightbox();
        return;
      }
    }

    // If Overview is open, Esc closes it
    if (overviewModal?.classList.contains('open')) {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'o' || e.key === 'Tab') {
        e.preventDefault();
        closeOverview();
        return;
      }
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ': // Spacebar
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
        e.preventDefault();
        window.print();
        break;
    }
  });

  // Initial State Setup
  updateSlide(0);
});
