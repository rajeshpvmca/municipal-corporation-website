/**
 * ===================================================================
 * METROPOLITAN CIVIC MUNICIPAL CORPORATION - MASTER SCRIPT
 * File: assets/js/script.js
 * Theme: Municipal Corporation Website (Civic Services & Governance)
 * Features:
 *   1. Dynamic Component Loader (header.html & footer.html directly loaded)
 *   2. Fixed Header on Scroll & Navbar transitions
 *   3. Fullscreen Mobile Navigation Menu Overlay
 *   4. Scroll to Top Floating Button with Circular SVG Progress Ring
 *   5. Three.js 3D Smart City Connected Infrastructure Canvas
 *   6. GSAP Smooth Animated Counters & Floating Badges
 *   7. AOS (Animate on Scroll) Integration
 *   8. Interactive Citizen Grievance Tracker & Tax Estimator
 *   9. Active Navigation Highlighter & Copyright Year
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  'use strict';

  // -------------------------------------------------------------------
  // 1. COMPONENT LOADER: LOADS header.html & footer.html DIRECTLY
  // -------------------------------------------------------------------
  const headerContainer = document.getElementById('header-placeholder');
  const footerContainer = document.getElementById('footer-placeholder');

  async function loadComponent(element, file) {
    if (!element) return;
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}: status ${response.status}`);
      }
      const html = await response.text();
      element.innerHTML = html;
    } catch (err) {
      console.warn(`Component fetch notice: [${file}] not loaded directly via fetch. Fallback DOM in place.`, err);
    }
  }

  // -------------------------------------------------------------------
  // 1.1 DYNAMIC HEADER HEIGHT SYNCHRONIZATION
  // -------------------------------------------------------------------
  function syncHeaderHeight() {
    const siteHeader = document.getElementById('siteHeader');
    if (!siteHeader) return;
    const rect = siteHeader.getBoundingClientRect();
    const height = Math.round(rect.height);
    if (height > 0) {
      document.documentElement.style.setProperty('--site-header-height', `${height}px`);
      if (!document.body.classList.contains('error-page-body') && 
          !document.body.classList.contains('auth-page') && 
          !document.body.classList.contains('dash-shell')) {
        document.body.style.paddingTop = `${height}px`;
      }
    }
  }

  // Pre-bind if components are already rendered
  initNavigation();
  initScrollToTop();
  highlightActiveNav();
  updateCopyrightYear();
  syncHeaderHeight();

  // Load components dynamically and initialize after promise completion
  Promise.all([
    headerContainer ? loadComponent(headerContainer, 'header.html') : Promise.resolve(),
    footerContainer ? loadComponent(footerContainer, 'footer.html') : Promise.resolve()
  ]).then(() => {
    initNavigation();
    initScrollToTop();
    highlightActiveNav();
    updateCopyrightYear();
    syncHeaderHeight();
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  });

  window.addEventListener('resize', syncHeaderHeight);
  window.addEventListener('load', () => {
    syncHeaderHeight();
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderHeight);
  }

  // -------------------------------------------------------------------
  // 2. FIXED HEADER ON SCROLL
  // -------------------------------------------------------------------
  window.addEventListener('scroll', function () {
    const siteHeader = document.getElementById('siteHeader');
    if (!siteHeader) return;
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // -------------------------------------------------------------------
  // 3. FULLSCREEN MOBILE NAVIGATION MENU
  // -------------------------------------------------------------------
  function initNavigation() {
    const toggleBtn = document.getElementById('mobileMenuToggleBtn');
    const closeBtn = document.getElementById('mobileMenuCloseBtn');
    const overlay = document.getElementById('fullscreenMobileMenu');

    if (!toggleBtn || !overlay) return;

    function openMenu() {
      overlay.classList.add('active');
      toggleBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      overlay.classList.remove('active');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (overlay.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
      });
    }

    const mobileLinks = overlay.querySelectorAll('.mobile-nav-link, .btn');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // -------------------------------------------------------------------
  // 4. FLOATING SCROLL TO TOP WITH PROGRESS RING
  // -------------------------------------------------------------------
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (!scrollBtn) return;

    const progressCircle = scrollBtn.querySelector('.progress-ring-circle');
    const radius = 21;
    const circumference = 2 * Math.PI * radius;

    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      if (scrollTop > 280) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }

      if (progressCircle) {
        const offset = circumference - (scrollPercent * circumference);
        progressCircle.style.strokeDashoffset = offset;
      }
    });

    scrollBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------
  // 5. ACTIVE NAV LINK HIGHLIGHTER
  // -------------------------------------------------------------------
  function highlightActiveNav() {
    const currentPath = window.location.pathname.toLowerCase();
    const navMap = {
      'index.html': 'nav-home',
      'about.html': 'nav-about',
      'services.html': 'nav-services',
      'departments.html': 'nav-departments',
      'governance.html': 'nav-governance',
      'initiatives.html': 'nav-initiatives',
      'tenders.html': 'nav-tenders',
      'contact.html': 'nav-contact'
    };

    let activeId = 'nav-home';
    for (const [page, id] of Object.entries(navMap)) {
      if (currentPath.endsWith(page)) {
        activeId = id;
        break;
      }
    }

    const currentLink = document.getElementById(activeId);
    if (currentLink) {
      currentLink.classList.add('active');
    }
  }

  // -------------------------------------------------------------------
  // 6. UPDATE COPYRIGHT YEAR
  // -------------------------------------------------------------------
  function updateCopyrightYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // -------------------------------------------------------------------
  // 7. PRELOADER DISMISSAL
  // -------------------------------------------------------------------
  window.addEventListener('load', function () {
    const preloader = document.getElementById('global-preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 550);
      }, 350);
    }
  });

  // -------------------------------------------------------------------
  // 8. AOS ANIMATION INIT
  // -------------------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 0
    });
  }

  // -------------------------------------------------------------------
  // 9. THREE.JS 3D SMART CITY CONNECTED INFRASTRUCTURE CANVAS
  // -------------------------------------------------------------------
  const heroCanvas = document.getElementById('threejs-hero-canvas');
  if (heroCanvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 32);

    const renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Civic lighting: Soft ambient & sapphire/gold directional
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0a365c, 1.5);
    dirLight1.position.set(15, 20, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd97706, 0.9);
    dirLight2.position.set(-15, -10, 15);
    scene.add(dirLight2);

    // Group for rotating city grid nodes
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Create 3D Smart City Nodes (Cubes & Cylinders representing buildings and hubs)
    const nodeCount = 36;
    const nodes = [];
    const nodeColors = [0x38bdf8, 0xf59e0b, 0x10b981, 0x818cf8, 0x0284c7];

    const boxGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cylinderGeom = new THREE.CylinderGeometry(0.7, 0.7, 2, 16);
    const octaGeom = new THREE.OctahedronGeometry(1, 0);

    for (let i = 0; i < nodeCount; i++) {
      let geom = boxGeom;
      if (i % 3 === 0) geom = cylinderGeom;
      if (i % 5 === 0) geom = octaGeom;

      const color = nodeColors[i % nodeColors.length];
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.25,
        metalness: 0.65,
        wireframe: (i % 4 === 0)
      });

      const mesh = new THREE.Mesh(geom, material);
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 10 + Math.random() * 18;

      mesh.position.x = Math.cos(angle) * radius + (Math.random() - 0.5) * 6;
      mesh.position.y = (Math.random() - 0.5) * 16;
      mesh.position.z = Math.sin(angle) * radius + (Math.random() - 0.5) * 6;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.012,
        rotSpeedY: (Math.random() - 0.5) * 0.012,
        floatOffset: Math.random() * Math.PI * 2
      };

      nodes.push(mesh);
      cityGroup.add(mesh);
    }

    // Connect some nodes with glowing lines (Smart City Data Grid)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28
    });

    for (let j = 0; j < 18; j++) {
      const idxA = Math.floor(Math.random() * nodes.length);
      const idxB = Math.floor(Math.random() * nodes.length);
      if (idxA !== idxB) {
        const points = [nodes[idxA].position, nodes[idxB].position];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        cityGroup.add(line);
      }
    }

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animateThree() {
      requestAnimationFrame(animateThree);

      cityGroup.rotation.y += 0.002;
      cityGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.08;

      nodes.forEach(node => {
        node.rotation.x += node.userData.rotSpeedX;
        node.rotation.y += node.userData.rotSpeedY;
        node.position.y += Math.sin(Date.now() * 0.0015 + node.userData.floatOffset) * 0.012;
      });

      camera.position.x += (mouseX * 5 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 4 + 10 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animateThree();

    window.addEventListener('resize', function () {
      if (!heroCanvas) return;
      const width = heroCanvas.clientWidth;
      const height = heroCanvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  // -------------------------------------------------------------------
  // 10. GSAP ANIMATIONS & STAT COUNTER TRIGGERS
  // -------------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length > 0 && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-count')) || 0;
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const isFloat = (target % 1 !== 0);

        gsap.to(counter, {
          innerText: target,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            once: true
          },
          onUpdate: function () {
            const val = isFloat
              ? parseFloat(counter.innerText).toFixed(1)
              : Math.floor(counter.innerText).toLocaleString();
            counter.innerHTML = prefix + val + (suffix ? `<span class="stat-unit">${suffix}</span>` : '');
          }
        });
      });
    }

    gsap.to('.hero-float-badge', {
      y: '-=12',
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.4
    });
  }

  // -------------------------------------------------------------------
  // 11. INTERACTIVE CITIZEN GRIEVANCE TRACKER
  // -------------------------------------------------------------------
  const grievanceForm = document.getElementById('grievanceTrackerForm');
  const grievanceResult = document.getElementById('grievanceResultBox');

  if (grievanceForm && grievanceResult) {
    grievanceForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const ticketId = document.getElementById('grievanceTicketId').value.trim();

      const sampleGrievances = {
        'MCC-2026-8842': {
          service: 'Road Pothole Repair (Ward 4, High Street)',
          status: 'Resolved',
          statusClass: 'resolved',
          dateFiled: '04 Nov 2026',
          resolvedDate: '09 Nov 2026',
          officer: 'Eng. Marcus Vance (Public Works)',
          note: 'Asphalt patching and surface leveling completed.'
        },
        'MCC-2026-9014': {
          service: 'Streetlight Replacement (Victoria Crescent)',
          status: 'In Progress',
          statusClass: 'in-progress',
          dateFiled: '08 Nov 2026',
          resolvedDate: 'Expected 14 Nov 2026',
          officer: 'Elec. Team Ward 2 (Energy Div.)',
          note: 'Smart LED fixture dispatched for field technician installation.'
        }
      };

      const record = sampleGrievances[ticketId.toUpperCase()] || {
        service: 'Sanitation & Solid Waste Clearance',
        status: 'In Progress',
        statusClass: 'in-progress',
        dateFiled: '10 Nov 2026',
        resolvedDate: 'Within 48 Working Hours',
        officer: 'Sanitation Inspector Ward Officer',
        note: `Citizen grievance reference ${ticketId || 'TKT-LIVE'} has been officially logged in the Integrated Municipal Redressal System.`
      };

      grievanceResult.innerHTML = `
        <div class="p-4 rounded-4 bg-white border border-primary border-opacity-25 shadow-sm mt-3" data-aos="fade-up">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary text-white fw-bold">Ref: ${ticketId.toUpperCase() || 'MCC-2026-LIVE'}</span>
            <span class="grievance-status-pill ${record.statusClass}">
              <i class="fa-solid fa-circle-check"></i> ${record.status}
            </span>
          </div>
          <h5 class="fw-bold text-dark mb-1">${record.service}</h5>
          <p class="text-muted small mb-2">Filed: <strong>${record.dateFiled}</strong> &bull; Assigned: <strong>${record.officer}</strong></p>
          <div class="p-3 bg-light rounded-3 small text-dark mb-3">${record.note}</div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="small text-muted">Estimated Resolution: <strong>${record.resolvedDate}</strong></span>
            <a href="contact.html" class="btn btn-sm btn-outline-primary">Escalate / Query</a>
          </div>
        </div>
      `;
      grievanceResult.classList.remove('d-none');
    });
  }

  // -------------------------------------------------------------------
  // 12. INTERACTIVE PROPERTY TAX ESTIMATOR
  // -------------------------------------------------------------------
  const taxForm = document.getElementById('taxEstimatorForm');
  const taxResult = document.getElementById('taxEstimatorResult');

  if (taxForm && taxResult) {
    taxForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const propType = document.getElementById('taxPropType').value;
      const areaSqFt = parseFloat(document.getElementById('taxAreaSqFt').value) || 1200;
      const wardZone = document.getElementById('taxWardZone').value;

      let baseRate = 2.50; // ₹ per sq ft equivalent base
      if (propType === 'commercial') baseRate = 5.50;
      if (propType === 'industrial') baseRate = 7.00;

      let zoneMultiplier = 1.0;
      if (wardZone === 'zone-a') zoneMultiplier = 1.25;
      if (wardZone === 'zone-c') zoneMultiplier = 0.85;

      const estimatedAnnualTax = Math.round(areaSqFt * baseRate * zoneMultiplier);
      const earlyRebate = Math.round(estimatedAnnualTax * 0.05);

      taxResult.innerHTML = `
        <div class="p-4 rounded-4 bg-light border border-warning border-opacity-50 mt-3" data-aos="zoom-in">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-warning text-dark fw-bold">Assessment Estimate (FY 2026-27)</span>
            <span class="badge bg-success text-white">5% Rebate Eligible</span>
          </div>
          <div class="stat-number text-primary mb-1">₹${estimatedAnnualTax.toLocaleString()} <span class="small fs-6 text-muted">/ year</span></div>
          <p class="text-muted small mb-3">Early digital payment saves you <strong>₹${earlyRebate.toLocaleString()}</strong> if settled before 31 December 2026.</p>
          <a href="dashboard.html" class="btn btn-civic-gold btn-sm w-100">
            Pay Property Tax Online <i class="fa-solid fa-arrow-right ms-1"></i>
          </a>
        </div>
      `;
      taxResult.classList.remove('d-none');
    });
  }

});
