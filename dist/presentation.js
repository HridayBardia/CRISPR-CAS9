// ===================================================================
// CRISPR-Cas9 Master Slide Deck Controller
// Executive Presentation Navigation & Interactive Simulators
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
  // Interactive Slide Simulators
  // ===================================================================

  // Slide 1: Hero Start Button
  document.getElementById('btn-hero-start')?.addEventListener('click', () => {
    goToSlide(1);
  });

  // Slide 2: Cleavage Simulator
  const btnStepGRNA = document.getElementById('sim-step-grna');
  const btnStepPAM = document.getElementById('sim-step-pam');
  const btnStepCut = document.getElementById('sim-step-cut');
  const simStatus = document.getElementById('sim-status-text');

  btnStepGRNA?.addEventListener('click', () => {
    btnStepGRNA.classList.add('active');
    if (simStatus) {
      simStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">Step 1:</span> Guide RNA (20nt) hybridized to target sequence. Scanning for PAM...`;
    }
  });

  btnStepPAM?.addEventListener('click', () => {
    btnStepPAM.classList.add('active');
    if (simStatus) {
      simStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">Step 2:</span> PAM (5'-NGG) verified! Cas9 conformational lock engaged 3nt upstream.`;
    }
  });

  btnStepCut?.addEventListener('click', () => {
    btnStepCut.classList.add('active');
    if (simStatus) {
      simStatus.innerHTML = `<span style="color:#FF5252; font-weight:700;">Step 3: ✂️ Cut Executed!</span> HNH & RuvC blades cleaved both strands (blunt double-strand break).`;
    }
  });

  // Slide 3: Cellular Repair Pathway Switcher
  const btnNHEJ = document.getElementById('btn-pathway-nhej');
  const btnHDR = document.getElementById('btn-pathway-hdr');
  const repairOutcomeBox = document.getElementById('repair-outcome-display');

  btnNHEJ?.addEventListener('click', () => {
    btnNHEJ.classList.add('active');
    btnHDR?.classList.remove('active');
    if (repairOutcomeBox) {
      repairOutcomeBox.innerHTML = `
        <span style="color: var(--cyan-accent); font-weight: 700;">🩹 NHEJ Mode Active:</span>
        Blunt end rejoining creates +1/-2bp frameshift indels → permanently turns OFF toxic disease genes.
      `;
    }
  });

  btnHDR?.addEventListener('click', () => {
    btnHDR.classList.add('active');
    btnNHEJ?.classList.remove('active');
    if (repairOutcomeBox) {
      repairOutcomeBox.innerHTML = `
        <span style="color: var(--emerald-accent); font-weight: 700;">📐 HDR Mode Active:</span>
        Supplied with synthetic donor template → cell enzymes copy healthy sequence with 100% precision.
      `;
    }
  });

  // Slide 4: Base Editor Workbench Switcher
  const editorBtns = document.querySelectorAll('.editor-tool-btn');
  const editorPreview = document.getElementById('editor-preview-text');
  editorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      editorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tool = btn.getAttribute('data-tool');
      if (!editorPreview) return;
      if (tool === 'crispri') {
        editorPreview.innerHTML = `<strong>CRISPRi / CRISPRa:</strong> dCas9 acts as a volume knob. Zero DNA cuts. Reversibly silences or boosts transcription.`;
      } else if (tool === 'cbe') {
        editorPreview.innerHTML = `<strong>Cytosine Base Editor:</strong> Deaminase converts <span style="color:#00F0FF; font-weight:800;">C • G</span> into <span style="color:#10B981; font-weight:800;">T • A</span> cleanly without double-strand breaks!`;
      } else if (tool === 'abe') {
        editorPreview.innerHTML = `<strong>Adenine Base Editor:</strong> TadA deaminase converts <span style="color:#00F0FF; font-weight:800;">A • T</span> into <span style="color:#10B981; font-weight:800;">G • C</span>. Fixes ~50% of human point mutations.`;
      } else if (tool === 'prime') {
        editorPreview.innerHTML = `<strong>Prime Editing (pegRNA):</strong> Search-and-replace word processor! Performs all 12 base swaps and insertions up to 80bp.`;
      }
    });
  });

  // Slide 7: Optogenetic Laser Switch
  const btnLaserToggle = document.getElementById('btn-laser-trigger');
  const laserStatus = document.getElementById('laser-status-indicator');
  let laserState = false;

  btnLaserToggle?.addEventListener('click', () => {
    laserState = !laserState;
    btnLaserToggle.classList.toggle('active', laserState);
    if (laserStatus) {
      if (laserState) {
        laserStatus.innerHTML = `<span style="color: #00F0FF; font-weight: 700;">⚡ 470nm BLUE LASER ON:</span> Split Cas9 halves (p-Mag + n-Mag) snap together! Active cutting underway.`;
      } else {
        laserStatus.innerHTML = `<span style="color: var(--text-soft);">🌑 DARKNESS / LASER OFF:</span> Split Cas9 separates in ~15 mins. Off-target risk reduced by >80%.`;
      }
    }
  });

  // Slide 9: Rapid Diagnostic Strip Simulator
  const btnRunTest = document.getElementById('btn-run-diagnostic');
  const testResultText = document.getElementById('diagnostic-result-text');

  btnRunTest?.addEventListener('click', () => {
    if (testResultText) testResultText.innerHTML = `⏳ Analyzing saliva sample via Cas13 collateral RNA cleavage...`;
    setTimeout(() => {
      if (testResultText) {
        testResultText.innerHTML = `<span style="color: #00F0FF; font-weight: 700;">✓ POSITIVE TARGET DETECTED (100% Specificity, <20 min).</span>`;
      }
    }, 800);
  });

  // Slide 10: Cellular Logic Gate Simulator
  const checkInputA = document.getElementById('logic-input-a');
  const checkInputB = document.getElementById('logic-input-b');
  const logicOutputText = document.getElementById('logic-gate-output');

  function updateLogicGate() {
    const a = checkInputA?.checked || false;
    const b = checkInputB?.checked || false;
    if (logicOutputText) {
      if (a && b) {
        logicOutputText.innerHTML = `<span style="color: #10B981; font-weight: 700;">🔥 AND GATE ACTIVE (1, 1):</span> Tumor Antigens Confirmed → Killer Toxin Activated!`;
      } else if (a || b) {
        logicOutputText.innerHTML = `<span style="color: #FFB300; font-weight: 700;">⚠️ PARTIAL SIGNAL (${a ? 1 : 0}, ${b ? 1 : 0}):</span> Gate Inactive. Safety brake prevents accidental attack on normal tissue.`;
      } else {
        logicOutputText.innerHTML = `<span style="color: var(--text-soft);">💤 NO SIGNAL (0, 0):</span> Cell in baseline surveillance state.`;
      }
    }
  }

  checkInputA?.addEventListener('change', updateLogicGate);
  checkInputB?.addEventListener('change', updateLogicGate);

  // Global Button Event Listeners
  btnPrev?.addEventListener('click', prevSlide);
  btnNext?.addEventListener('click', nextSlide);
  btnOverview?.addEventListener('click', toggleOverview);
  btnCloseOverview?.addEventListener('click', closeOverview);
  btnFullscreen?.addEventListener('click', toggleFullscreen);
  btnPrint?.addEventListener('click', () => window.print());

  overviewModal?.addEventListener('click', (e) => {
    if (e.target === overviewModal) closeOverview();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (overviewModal?.classList.contains('open') && e.key === 'Escape') {
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
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
  }, { passive: true });

  // Initialize
  updateSlide(0);
});
