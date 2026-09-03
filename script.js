/**
 * ============================================================================
 * TRISHLACOZY - LUXURY BLANKET BRAND WEBSITE
 * Master JavaScript File (Interactions, Animations & Google Sheets Integration)
 * ============================================================================
 */

/* ============================================================================
   GOOGLE APPS SCRIPT CONFIGURATION FOR GOOGLE SHEETS
   ============================================================================
   INSTRUCTIONS TO CONNECT FORM TO GOOGLE SHEETS:
   1. Open Google Sheets -> Extensions -> Apps Script.
   2. Paste the following Apps Script snippet:
      
      function doPost(e) {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = JSON.parse(e.postData.contents);
        sheet.appendRow([
          new Date(),
          data.name,
          data.phone,
          data.email,
          data.city,
          data.business,
          data.message
        ]);
        return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
                             .setMimeType(ContentService.MimeType.JSON);
      }

   3. Click "Deploy" -> "New deployment" -> Select "Web app".
   4. Set "Execute as": "Me", and "Who has access": "Anyone".
   5. Copy the Web App URL and paste it into the variable below!
   ============================================================================ */

const GOOGLE_APPS_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {

  // 1. PRELOADER & INITIALIZATION
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1200);
  }

  // 2. SCROLL PROGRESS BAR & STICKY NAVBAR
  const progressBar = document.getElementById('progressBar');
  const navbar = document.querySelector('.navbar-trishla');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }

    if (navbar) {
      if (scrollTop > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. INTERSECTION OBSERVER FOR SCROLL REVEALS
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. ANIMATED STATISTICAL COUNTERS
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  const statsSection = document.querySelector('.stats-card-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000; // ms
          const increment = Math.ceil(target / (duration / 16));

          let current = 0;
          const updateCount = () => {
            current += increment;
            if (current < target) {
              counter.innerText = current.toLocaleString() + '+';
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target.toLocaleString() + '+';
            }
          };
          updateCount();
        });
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // 5. COLLECTION FILTERING SYSTEM
  const filterBtns = document.querySelectorAll('.filter-btn');
  const collectionItems = document.querySelectorAll('.collection-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      collectionItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 6. QUICK VIEW COLLECTION MODAL DATA
  const quickViewModal = document.getElementById('collectionModal');
  if (quickViewModal) {
    quickViewModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      const title = button.getAttribute('data-title');
      const desc = button.getAttribute('data-desc');
      const image = button.getAttribute('data-img');
      const gsm = button.getAttribute('data-gsm');
      const fabric = button.getAttribute('data-fabric');
      const sizes = button.getAttribute('data-sizes');

      document.getElementById('modalProductTitle').innerText = title || 'Collection Detail';
      document.getElementById('modalProductDesc').innerText = desc || '';
      document.getElementById('modalProductImg').src = image || '';
      document.getElementById('modalProductGSM').innerText = gsm || '500 GSM Premium Heavyweight';
      document.getElementById('modalProductFabric').innerText = fabric || '100% Micro-Fleece Ultra Soft';
      document.getElementById('modalProductSizes').innerText = sizes || 'Single, Double, King & Custom Wholesale';
    });
  }

  // 7. GOOGLE SHEETS CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('trishlaContactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnText = document.getElementById('btnText');
  const responseModalEl = document.getElementById('responseModal');
  const responseModalText = document.getElementById('responseModalText');
  const responseModalTitle = document.getElementById('responseModalTitle');
  const responseModalIcon = document.getElementById('responseModalIcon');

  let responseModalInstance = null;
  if (responseModalEl && typeof bootstrap !== 'undefined') {
    responseModalInstance = new bootstrap.Modal(responseModalEl);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic client-side validation
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const city = document.getElementById('formCity').value.trim();
      const business = document.getElementById('formBusiness').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !phone || !email || !message) {
        showFormNotice("Required Fields Missing", "Please fill in all mandatory contact fields before submitting.", "warning");
        return;
      }

      // UI Loading State (Prevent double clicks)
      submitBtn.disabled = true;
      if (btnSpinner) btnSpinner.classList.remove('d-none');
      if (btnText) btnText.innerText = "Submitting Lead...";

      const payload = {
        name: name,
        phone: phone,
        email: email,
        city: city,
        business: business,
        message: message,
        timestamp: new Date().toISOString()
      };

      try {
        // If user configured a valid Apps Script URL, perform fetch
        if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
          await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        }

        // Simulating immediate responsive UX feedback for demonstration
        setTimeout(() => {
          showFormNotice("Thank You for Contacting TRISHLACOZY!", 
            `Dear ${name}, your enquiry has been received. Our luxury collection team will reach out to you within 24 hours.`, 
            "success");
          
          contactForm.reset();
          resetSubmitButton();
        }, 1000);

      } catch (error) {
        console.error("Submission Error: ", error);
        showFormNotice("Submission Error", "An error occurred while submitting your message. Please try again or contact us directly.", "error");
        resetSubmitButton();
      }
    });
  }

  function resetSubmitButton() {
    if (submitBtn) submitBtn.disabled = false;
    if (btnSpinner) btnSpinner.classList.add('d-none');
    if (btnText) btnText.innerText = "Send Wholesale Enquiry";
  }

  function showFormNotice(title, message, type) {
    if (responseModalTitle) responseModalTitle.innerText = title;
    if (responseModalText) responseModalText.innerText = message;
    
    if (responseModalIcon) {
      if (type === 'success') {
        responseModalIcon.className = "bi bi-check-circle-fill text-success display-4 mb-3";
      } else if (type === 'warning') {
        responseModalIcon.className = "bi bi-exclamation-triangle-fill text-warning display-4 mb-3";
      } else {
        responseModalIcon.className = "bi bi-x-circle-fill text-danger display-4 mb-3";
      }
    }

    if (responseModalInstance) {
      responseModalInstance.show();
    } else {
      alert(`${title}\n\n${message}`);
    }
  }

  // 8. MOUSE PARALLAX TILT EFFECT ON HERO IMAGE
  const heroImgWrapper = document.querySelector('.hero-img-wrapper');
  if (heroImgWrapper && window.innerWidth > 992) {
    document.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth) - 0.5;
      const mouseY = (e.clientY / window.innerHeight) - 0.5;
      heroImgWrapper.style.transform = `perspective(1000px) rotateY(${mouseX * 6}deg) rotateX(${-mouseY * 6}deg)`;
    });
  }

});
