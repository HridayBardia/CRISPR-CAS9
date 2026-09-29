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

  // Slide 2: R-Loop Checkpoint Simulator
  const btnRloopSeed = document.getElementById('btn-rloop-seed');
  const btnRloopMid = document.getElementById('btn-rloop-mid');
  const btnRloopFull = document.getElementById('btn-rloop-full');
  const rloopStatus = document.getElementById('rloop-sim-status');

  btnRloopSeed?.addEventListener('click', () => {
    [btnRloopSeed, btnRloopMid, btnRloopFull].forEach(b => b?.classList.remove('active'));
    btnRloopSeed.classList.add('active');
    if (rloopStatus) {
      rloopStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">Conformational State (Seed 1-8 bp):</span> Initial PAM binding and seed hybridization. HNH domain remains parked in inactive checkpoint state.`;
    }
  });

  btnRloopMid?.addEventListener('click', () => {
    [btnRloopSeed, btnRloopMid, btnRloopFull].forEach(b => b?.classList.remove('active'));
    btnRloopMid.classList.add('active');
    if (rloopStatus) {
      rloopStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">Conformational State (Mid 9-14 bp):</span> R-loop reaches 14 bp. REC3 domain senses non-target strand displacement and prepares allosteric cascade.`;
    }
  });

  btnRloopFull?.addEventListener('click', () => {
    [btnRloopSeed, btnRloopMid, btnRloopFull].forEach(b => b?.classList.remove('active'));
    btnRloopFull.classList.add('active');
    if (rloopStatus) {
      rloopStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">Conformational State (Full 20 bp):</span> ⚡ HNH rotates 32 &Aring; into minor groove! His840 docks 3.5 &Aring; from scissile bond; RuvC triad activated for blunt DSB cut.`;
    }
  });

  // Slide 3: High-Fidelity Nuclease Selector
  const hifiBtns = document.querySelectorAll('.hifi-btn');
  const hifiStatus = document.getElementById('hifi-sim-status');
  hifiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hifiBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const v = btn.getAttribute('data-variant');
      if (!hifiStatus) return;
      if (v === 'wt') {
        hifiStatus.innerHTML = `<span style="color:#FF5252; font-weight:700;">WT-SpCas9 Active:</span> High catalytic rate (kobs = 0.185 s&minus;&sup1;) with high off-target promiscuity across 142 detected genomic sites.`;
      } else if (v === 'esp') {
        hifiStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">eSpCas9(1.1) (K848A/K1003A/R1060A):</span> NTS groove neutralization weakens displaced strand binding (14 GUIDE-seq off-targets, 42.5x gain).`;
      } else if (v === 'hf1') {
        hifiStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">SpCas9-HF1 (N497A/R661A/Q695A/Q926A):</span> Direct target contact attenuation eliminates 4.5 kcal/mol excess buffer (1 off-target, 215x gain).`;
      } else if (v === 'superfi') {
        hifiStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">SuperFi-Cas9 (REC3 Loop Stabilized):</span> Restores rapid on-target rate (kobs = 0.165 s&minus;&sup1;) with <strong>0 detected GUIDE-seq off-targets (&gt;1,000x gain)</strong>.`;
      }
    });
  });

  // Slide 4: Epigenome Mode Switcher
  const epiBtns = document.querySelectorAll('.epi-btn');
  const epiStatus = document.getElementById('epi-sim-status');
  epiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      epiBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const m = btn.getAttribute('data-mode');
      if (!epiStatus) return;
      if (m === 'crispri') {
        epiStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">CRISPRi (dCas9-KRAB):</span> Recruits KAP1/SETDB1 to deposit H3K9me3 across 1.5 kb around TSS (96.4% silencing; decays in 5-8 divisions).`;
      } else if (m === 'crispra') {
        epiStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">CRISPRa (dCas9-VPR):</span> Tripartite activator recruits TFIID and p300/CBP for 10- to 500-fold endogenous transcriptional upregulation.`;
      } else if (m === 'crisproff') {
        epiStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">CRISPRoff (KRAB-DNMT3A-3L):</span> Bimodal H3K9me3 + 5mC DNA methylation establishes <strong>permanent, heritable gene silencing (&gt;100 divisions, 0% DSBs)</strong>.`;
      }
    });
  });

  // Slide 5: In Vivo LNP pH Simulator
  const lnpBtns = document.querySelectorAll('.lnp-btn');
  const lnpStatus = document.getElementById('lnp-sim-status');
  lnpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lnpBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const stage = btn.getAttribute('data-stage');
      if (!lnpStatus) return;
      if (stage === 'blood') {
        lnpStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">Bloodstream State (pH 7.4):</span> Neutral surface charge prevents serum protein fouling, non-specific toxicity, and clearance.`;
      } else if (stage === 'apoe') {
        lnpStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">ApoE-LDLR Binding:</span> Adsorbs circulating ApoE &rarr; recognizes LDLR on hepatocytes for receptor-mediated endocytosis (&gt;85% hepatic tropism).`;
      } else if (stage === 'endosome') {
        lnpStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">Endosome State (pH 5.5):</span> ⚡ Ionizable lipid protonates (+ charge) &rarr; disrupts anionic endosomal membrane, releasing Cas9 mRNA into cytosol.`;
      }
    });
  });

  // Slide 6: Base Editor Workbench
  const beBtns = document.querySelectorAll('.be-btn');
  const beStatus = document.getElementById('be-sim-status');
  beBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      beBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const be = btn.getAttribute('data-be');
      if (!beStatus) return;
      if (be === 'cbe') {
        beStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">CBE (BE4max / evoFERNY):</span> Cytidine deaminase executes C&bull;G &rarr; T&bull;A in pos 4-8 window; 2x UGI domains block UNG repair (&lt;1.5% indels).`;
      } else if (be === 'abe8e') {
        beStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">ABE8e (Hyperactive TadA-8e):</span> Catalytic deamination accelerated &gt;1,000-fold (kcat/Km = 1.8 &times; 10&sup6; M&minus;&sup1;s&minus;&sup1;); fixes A&bull;T &rarr; G&bull;C in 24h.`;
      } else if (be === 'v106w') {
        beStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">ABE8e-V106W (High-Fidelity):</span> Narrowed 4-7 window eliminates bystander edits and transcriptome-wide RNA deamination (<strong>&lt;0.1% indels</strong>).`;
      }
    });
  });

  // Slide 7: Prime Editing Flap Resolver
  const peBtns = document.querySelectorAll('.pe-btn');
  const peStatus = document.getElementById('pe-sim-status');
  peBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      peBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const step = btn.getAttribute('data-step');
      if (!peStatus) return;
      if (step === 'nick') {
        peStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">Step 1 (PAM-Strand Nick):</span> Cas9(H840A) nicks non-target strand 3 bp upstream of PAM, generating free 3'-OH flap. pegRNA PBS anneals.`;
      } else if (step === 'rt') {
        peStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">Step 2 (RT Synthesis):</span> Engineered M-MLV RT reverse-transcribes the RTT sequence, extending the 3'-ssDNA flap with programmed edit.`;
      } else if (step === 'flap') {
        peStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">Step 3 (Flap Resolution):</span> 3'-edited flap hybridizes to target DNA; flap endonuclease FEN1 excises unedited 5'-flap for permanent integration.`;
      }
    });
  });

  // Slide 8: Exa-cel Workflow Switcher
  const exaBtns = document.querySelectorAll('.exa-btn');
  const exaStatus = document.getElementById('exa-sim-status');
  exaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      exaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const phase = btn.getAttribute('data-phase');
      if (!exaStatus) return;
      if (phase === 'apheresis') {
        exaStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">Phase 1 (Mobilization & Harvest):</span> Patient CD34+ HSPCs mobilized with plerixafor/G-CSF and isolated via magnetic selection (&gt;95% purity).`;
      } else if (phase === 'rnp') {
        exaStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">Phase 2 (GMP Electroporation):</span> Cas9 RNP disrupts GATA1 binding motif in BCL11A erythroid enhancer (+58 kb), achieving &gt;75% indels.`;
      } else if (phase === 'engraft') {
        exaStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">Phase 3 (Busulfan & Engraftment):</span> Myeloablative conditioning clears marrow; re-infused cells engraft permanently, producing <strong>46% HbF and 0 VOC crises</strong>.`;
      }
    });
  });

  // Slide 9: Allogeneic CAR-T Multi-Locus Switcher
  const cartBtns = document.querySelectorAll('.cart-btn');
  const cartStatus = document.getElementById('cart-sim-status');
  cartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cartBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      if (!cartStatus) return;
      if (target === 'trac') {
        cartStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">TRAC Knockout (98.2% Ablation):</span> Disrupts TCR&alpha; constant locus (Chr 14q11.2); prevents lethal Graft-versus-Host Disease (GvHD).`;
      } else if (target === 'b2m') {
        cartStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">B2M Knockout (96.5% Ablation):</span> Disrupts &beta;2-microglobulin (Chr 15q21.1) to eliminate surface HLA-I, preventing host CD8+ T-cell allorejection.`;
      } else if (target === 'pd1') {
        cartStatus.innerHTML = `<span style="color:#FF5252; font-weight:700;">PDCD1 Knockout (91.4% Ablation):</span> Disrupts PD-1 checkpoint (Chr 2q37.3) to prevent tumor microenvironment immune exhaustion.`;
      } else if (target === 'triple') {
        cartStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">Triple-KO Allogeneic Product:</span> <strong>89.5% pure triple-negative cells</strong> with 0.26% total translocations &mdash; ready for immediate off-the-shelf infusion!`;
      }
    });
  });

  // Slide 10: Near-PAMless Targeting Explorer
  const pamBtns = document.querySelectorAll('.pam-btn');
  const pamStatus = document.getElementById('pam-sim-status');
  pamBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pamBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const pam = btn.getAttribute('data-pam');
      if (!pamStatus) return;
      if (pam === 'ngg') {
        pamStatus.innerHTML = `<span style="color:#FF5252; font-weight:700;">Canonical 5'-NGG PAM (WT-SpCas9):</span> Requires 2 direct Arg1333/Arg1335 H-bonds. Restricts targetable space to ~12.5% of human nuclear DNA.`;
      } else if (pam === 'ng') {
        pamStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">5'-NG PAM (SpG Variant):</span> 5 structural mutations expand targeting to all NG triplets (~50% of the nuclear genome).`;
      } else if (pam === 'spry') {
        pamStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">Near-PAMless 5'-NRN / NYN (SpRY):</span> 11 structural loop mutations unlock <strong>&gt;99% of all genomic nucleotides</strong> for single-base precision editing!`;
      }
    });
  });

  // Slide 11: Mitochondrial DdCBE Disease Switcher
  const mtoBtns = document.querySelectorAll('.mto-btn');
  const mtoStatus = document.getElementById('mto-sim-status');
  mtoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mtoBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dis = btn.getAttribute('data-dis');
      if (!mtoStatus) return;
      if (dis === 'merrf') {
        mtoStatus.innerHTML = `<span style="color:#00F0FF; font-weight:700;">MERRF (m.8344A&gt;G tRNA-Lys):</span> DdCBE shifts heteroplasmy from 86.5% to 12.4%, rescuing Complex I/IV assembly and restoring 92.4% respiration.`;
      } else if (dis === 'melas') {
        mtoStatus.innerHTML = `<span style="color:#FFB300; font-weight:700;">MELAS (m.3243A&gt;G tRNA-Leu):</span> DdCBE shifts heteroplasmy from 82.1% to 14.8%, restoring 88.6% of basal OCR and mitochondrial translation.`;
      } else if (dis === 'lhon') {
        mtoStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">LHON (m.11778G&gt;A ND4 Subunit):</span> DdCBE achieves 28.5% homoplasmic conversion, rescuing retinal ganglion cell bioenergetics.`;
      }
    });
  });


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
