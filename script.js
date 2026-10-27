/**
 * ============================================================================
 * TRISHLACOZY - LUXURY BLANKET BRAND WEBSITE
 * ============================================================================
 *
 * Enquiries are emailed to info@rasr.co.in through Brevo.
 * ============================================================================
 */

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
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

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

  // 5. COLLECTION MARQUEE + FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const collectionMarqueeEl = document.getElementById('collectionMarquee');

  const COLLECTION_CATALOG = [
    { category: 'winter', title: 'Royal Arctic Heavyweight', img: 'images/collection-winter.webp', badge: 'Best Seller', desc: 'Ultra-dense dual layer fleece engineered for deep winter comfort.', gsm: '650 GSM Ultra-Dense', fabric: 'Dual Micro-Fleece', sizes: 'Double & King Bedding', spec: 'Non-shedding, 100% Hypoallergenic' },
    { category: 'winter', title: 'Terracotta Hearth Winter', img: 'images/soft-05.webp', badge: 'Winter Colour', desc: 'A rich rust winter kambal with dense GSM and a classic hearth-side look.', gsm: '640 GSM Heavyweight', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Deep winter warmth' },
    { category: 'winter', title: 'Navy Arctic Quilt', img: 'images/cat-winter-navy.webp', badge: 'Classic Navy', desc: 'Heavyweight navy fleece for classic cold-night bedrooms.', gsm: '650 GSM Ultra-Dense', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Rich navy colour' },
    { category: 'winter', title: 'Burgundy Hearth', img: 'images/cat-winter-burgundy.webp', badge: 'Wine Red', desc: 'Deep burgundy winter kambal with a royal heritage colour.', gsm: '640 GSM Heavyweight', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Classic wine tone' },
    { category: 'winter', title: 'Forest Winter Cloak', img: 'images/cat-winter-forest.webp', badge: 'Forest Green', desc: 'Deep forest green heavyweight for cabin-warm winter nights.', gsm: '650 GSM Ultra-Dense', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Dense green pile' },
    { category: 'winter', title: 'Royal Plum Winter', img: 'images/cat-winter-plum.webp', badge: 'Plum', desc: 'Royal plum heavyweight with a classic palace colour.', gsm: '640 GSM Heavyweight', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Jewel plum tone' },
    { category: 'winter', title: 'Teal Glacier', img: 'images/cat-winter-teal.webp', badge: 'Teal', desc: 'Deep teal winter fleece with a cool classic colour.', gsm: '650 GSM Ultra-Dense', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Cool teal finish' },
    { category: 'winter', title: 'Chocolate Lodge', img: 'images/cat-winter-chocolate.webp', badge: 'Chocolate', desc: 'Rich chocolate winter kambal for lodge-style bedrooms.', gsm: '640 GSM Heavyweight', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Warm brown pile' },
    { category: 'winter', title: 'Crimson Ember', img: 'images/cat-winter-crimson.webp', badge: 'Crimson', desc: 'Classic crimson heavyweight that glows like an ember.', gsm: '650 GSM Ultra-Dense', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Bold winter red' },
    { category: 'winter', title: 'Ochre Harvest', img: 'images/cat-winter-ochre.webp', badge: 'Ochre', desc: 'Mustard-ochre winter kambal with a classic harvest colour.', gsm: '640 GSM Heavyweight', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Gold-ochre warmth' },
    { category: 'winter', title: 'Studio Blanket Roll', img: 'images/brand-blankets-broll.webp', badge: 'Workshop', desc: 'A full roll of winter blankets from the TRISHLACOZY studio floor.', gsm: '650 GSM Ultra-Dense', fabric: 'Dual Micro-Fleece', sizes: 'Double & King', spec: 'Studio-finished pile' },

    { category: 'mink', title: 'Silken Velvet Mink', img: 'images/collection-mink.webp', badge: 'Velvet Finish', desc: 'High-lustre plush mink weave with silky smooth touch and rich sheen.', gsm: '550 GSM Silk-Touch', fabric: '100% Micro-Plush Mink', sizes: 'Single, Double & Wholesale Rolls', spec: 'Rich colour depth & luster' },
    { category: 'mink', title: 'Blush Rose Mink', img: 'images/soft-02.webp', badge: 'Blush', desc: 'A pure rose mink weave with a quiet sheen and cloud-soft handfeel.', gsm: '540 GSM Silk-Mink', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Classic blush finish' },
    { category: 'mink', title: 'Mint Floral Mink', img: 'images/soft-10.webp', badge: 'Mint Floral', desc: 'Mint and cream embossed floral mink with a silky plush pile.', gsm: '540 GSM Silk-Mink', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Embossed floral sheen' },
    { category: 'mink', title: 'Lavender Silk Mink', img: 'images/soft-06.webp', badge: 'Lavender', desc: 'Light lilac mink with a velvety pile and classic colourful finish.', gsm: '530 GSM Silk-Mink', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Soft lilac sheen' },
    { category: 'mink', title: 'Champagne Mink', img: 'images/cat-mink-champagne.webp', badge: 'Champagne', desc: 'Glossy champagne mink with a golden silk-touch sheen.', gsm: '550 GSM Silk-Touch', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Gold champagne glow' },
    { category: 'mink', title: 'Wine Velvet Mink', img: 'images/cat-mink-wine.webp', badge: 'Wine', desc: 'Deep wine mink with a high-lustre classic colour.', gsm: '550 GSM Silk-Touch', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Rich wine sheen' },
    { category: 'mink', title: 'Caramel Mink', img: 'images/cat-mink-caramel.webp', badge: 'Caramel', desc: 'Warm caramel mink with a silky classic brown finish.', gsm: '540 GSM Silk-Mink', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Caramel silk pile' },
    { category: 'mink', title: 'Mauve Mink', img: 'images/cat-mink-mauve.webp', badge: 'Mauve', desc: 'Dusty mauve mink with a quiet jewel sheen.', gsm: '540 GSM Silk-Mink', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Mauve velvet finish' },
    { category: 'mink', title: 'Emerald Mink', img: 'images/cat-mink-emerald.webp', badge: 'Emerald', desc: 'Jewel emerald mink with a glossy classic colour.', gsm: '550 GSM Silk-Touch', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Emerald luster' },
    { category: 'mink', title: 'Sapphire Mink', img: 'images/cat-mink-sapphire.webp', badge: 'Sapphire', desc: 'Royal sapphire mink with a deep silk-blue sheen.', gsm: '550 GSM Silk-Touch', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Sapphire sheen' },
    { category: 'mink', title: 'Fibre Close Weave', img: 'images/about-fabric.webp', badge: 'Weave', desc: 'A close look at the plush mink pile that stays soft after washing.', gsm: '550 GSM Silk-Touch', fabric: 'Micro-Plush Mink', sizes: 'Single, Double & King', spec: 'Dense mink pile' },

    { category: 'luxury', title: 'Imperial Cashmere Touch', img: 'images/collection-cashmere.webp', badge: 'Luxury Signature', desc: 'Flagship high-GSM blanket crafted for opulent warmth and royal aesthetics.', gsm: '700 GSM Sovereign', fabric: 'Cashmere Blend Micro-Weave', sizes: 'King & Super King', spec: 'Hand-finished satin border' },
    { category: 'luxury', title: 'Mustard Gold Sovereign', img: 'images/soft-08.webp', badge: 'Royal Gold', desc: 'A colourful classic gold kambal with a sovereign-grade pile.', gsm: '680 GSM Sovereign', fabric: 'Silk-Mink Blend', sizes: 'King & Super King', spec: 'Gold satin glow' },
    { category: 'luxury', title: 'Ivory Cashmere Cloud', img: 'images/soft-01.webp', badge: 'Ivory', desc: 'Cream ivory cashmere-touch folded for a quiet luxury bedroom.', gsm: '690 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Ivory satin pile' },
    { category: 'luxury', title: 'Camel Sovereign', img: 'images/soft-11.webp', badge: 'Camel', desc: 'Warm camel cashmere-touch draped across a classic master bed.', gsm: '680 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Camel heritage tone' },
    { category: 'luxury', title: 'Ivory Satin Border', img: 'images/cat-lux-ivory.webp', badge: 'Satin Ivory', desc: 'Ivory cashmere-touch with a refined satin border.', gsm: '700 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Satin-finished edge' },
    { category: 'luxury', title: 'Camel Palace', img: 'images/cat-lux-camel.webp', badge: 'Camel', desc: 'Classic camel cashmere-touch for palace-style bedrooms.', gsm: '690 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Warm camel satin' },
    { category: 'luxury', title: 'Royal Purple Cashmere', img: 'images/cat-lux-royal.webp', badge: 'Royal Purple', desc: 'Royal purple cashmere-touch with a gold satin border.', gsm: '700 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Jewel purple finish' },
    { category: 'luxury', title: 'Bronze Sovereign', img: 'images/cat-lux-bronze.webp', badge: 'Bronze', desc: 'Warm bronze cashmere-touch with a classic metallic glow.', gsm: '680 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Bronze satin sheen' },
    { category: 'luxury', title: 'Merlot Cashmere', img: 'images/cat-lux-merlot.webp', badge: 'Merlot', desc: 'Deep merlot cashmere-touch for a royal colourful bedroom.', gsm: '690 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Merlot satin pile' },
    { category: 'luxury', title: 'Sand Cashmere', img: 'images/cat-lux-sand.webp', badge: 'Sand', desc: 'Warm sand cashmere-touch with a quiet luxury finish.', gsm: '680 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Sand satin border' },
    { category: 'luxury', title: 'Ivory Hero Fold', img: 'images/hero-blanket.webp', badge: 'Signature', desc: 'The ivory signature fold shown across the TRISHLACOZY collection.', gsm: '690 GSM Sovereign', fabric: 'Cashmere Blend', sizes: 'King & Super King', spec: 'Signature ivory fold' },

    { category: 'hotel', title: '5-Star Hospitality Suite', img: 'images/collection-hotel.webp', badge: 'Hospitality Grade', desc: 'Crisp ivory thermal blanket optimized for luxury hotel bed setups.', gsm: '480 GSM Commercial', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes & Bulk OEM', spec: '200+ wash cycle warranty' },
    { category: 'hotel', title: 'Sky Hotel Quilt', img: 'images/soft-04.webp', badge: 'Hotel Blue', desc: 'Soft sky quilted hospitality blanket on a crisp hotel bed.', gsm: '470 GSM Hotel Grade', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Quilted hotel finish' },
    { category: 'hotel', title: 'Ivory Suite Fold', img: 'images/cat-hotel-ivory.webp', badge: 'Ivory', desc: 'Crisp ivory hotel blanket folded at the foot of a 5-star bed.', gsm: '480 GSM Commercial', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Laundry-tested ivory' },
    { category: 'hotel', title: 'Taupe Hospitality', img: 'images/cat-hotel-taupe.webp', badge: 'Taupe', desc: 'Warm taupe hotel blanket for classic suite styling.', gsm: '480 GSM Commercial', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Taupe hotel tone' },
    { category: 'hotel', title: 'Sand Suite', img: 'images/cat-hotel-sand.webp', badge: 'Sand', desc: 'Warm sand hospitality blanket for bright hotel rooms.', gsm: '470 GSM Hotel Grade', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Sand suite colour' },
    { category: 'hotel', title: 'Dove Grey Hotel', img: 'images/cat-hotel-grey.webp', badge: 'Dove Grey', desc: 'Dove grey hospitality blanket with a clean 5-star look.', gsm: '480 GSM Commercial', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Grey hotel finish' },
    { category: 'hotel', title: 'Champagne Suite', img: 'images/cat-hotel-champagne.webp', badge: 'Champagne', desc: 'Champagne gold hotel blanket for premium suites.', gsm: '480 GSM Commercial', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Champagne hospitality' },
    { category: 'hotel', title: 'Slate Hotel', img: 'images/cat-hotel-slate.webp', badge: 'Slate Blue', desc: 'Slate blue hospitality blanket for modern hotel rooms.', gsm: '470 GSM Hotel Grade', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Slate suite colour' },
    { category: 'hotel', title: 'Sage Hotel', img: 'images/cat-hotel-sage.webp', badge: 'Sage', desc: 'Soft sage hospitality blanket for calm 5-star rooms.', gsm: '470 GSM Hotel Grade', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Sage hotel tone' },
    { category: 'hotel', title: 'Rust Suite Accent', img: 'images/cat-hotel-rust.webp', badge: 'Rust', desc: 'Terracotta rust hotel blanket for colourful suite accents.', gsm: '480 GSM Commercial', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Rust hospitality colour' },
    { category: 'hotel', title: 'Suite Bedroom Layer', img: 'images/about-bedroom.webp', badge: 'Suite', desc: 'A layered hotel bedroom styled with a TRISHLACOZY hospitality blanket.', gsm: '480 GSM Commercial', fabric: 'Commercial Thermal Microfiber', sizes: 'Standard Hotel Sizes', spec: 'Layered suite styling' },

    { category: 'kids', title: 'Cloud-Soft Nursery & Kids', img: 'images/collection-kids.webp', badge: 'Sensitive Skin Safe', desc: 'Hypoallergenic breathable blanket designed for infants and gentle nursery care.', gsm: '380 GSM Soft Touch', fabric: 'Zero-Chemical Organic Micro-Fleece', sizes: 'Crib, Nursery & Single', spec: 'Hypoallergenic, gentle on skin' },
    { category: 'kids', title: 'Peach Nursery Garden', img: 'images/soft-07.webp', badge: 'Peach Print', desc: 'Peach and cream nursery fleece with a gentle classic print.', gsm: '370 GSM Featherlight', fabric: 'Organic Micro-Fleece', sizes: 'Crib & Nursery', spec: 'Soft peach nursery' },
    { category: 'kids', title: 'Sky Stripe Cloud', img: 'images/soft-12.webp', badge: 'Sky Stripe', desc: 'Sky blue and cream stripe kids fleece with a cloud-soft pile.', gsm: '380 GSM Soft Touch', fabric: 'Organic Micro-Fleece', sizes: 'Crib, Nursery & Single', spec: 'Sky-cream stripes' },
    { category: 'kids', title: 'Mint Cloud Crib', img: 'images/cat-kids-mint.webp', badge: 'Mint', desc: 'Mint green nursery blanket for a fresh classic crib.', gsm: '370 GSM Featherlight', fabric: 'Organic Micro-Fleece', sizes: 'Crib & Nursery', spec: 'Mint cloud touch' },
    { category: 'kids', title: 'Lemon Nursery', img: 'images/cat-kids-lemon.webp', badge: 'Lemon', desc: 'Soft lemon yellow kids blanket for a sunny nursery.', gsm: '370 GSM Featherlight', fabric: 'Organic Micro-Fleece', sizes: 'Crib & Nursery', spec: 'Gentle lemon colour' },
    { category: 'kids', title: 'Blush Crib Cloud', img: 'images/cat-kids-blush.webp', badge: 'Blush', desc: 'Blush pink nursery blanket, featherlight and skin-safe.', gsm: '380 GSM Soft Touch', fabric: 'Organic Micro-Fleece', sizes: 'Crib & Nursery', spec: 'Blush nursery tone' },
    { category: 'kids', title: 'Lavender Kids Cloud', img: 'images/cat-kids-lavender.webp', badge: 'Lavender', desc: 'Soft lavender kids blanket for a calm classic nursery.', gsm: '370 GSM Featherlight', fabric: 'Organic Micro-Fleece', sizes: 'Crib & Nursery', spec: 'Lavender cloud pile' },
    { category: 'kids', title: 'Sky Nursery', img: 'images/cat-kids-sky.webp', badge: 'Sky', desc: 'Sky blue kids blanket for a bright nursery crib.', gsm: '380 GSM Soft Touch', fabric: 'Organic Micro-Fleece', sizes: 'Crib & Nursery', spec: 'Sky cloud finish' },
    { category: 'kids', title: 'Peach Cloud', img: 'images/cat-kids-peach.webp', badge: 'Peach', desc: 'Warm peach kids blanket with a gentle nursery colour.', gsm: '370 GSM Featherlight', fabric: 'Organic Micro-Fleece', sizes: 'Crib & Nursery', spec: 'Peach soft-touch' },
    { category: 'kids', title: 'Coral Nursery', img: 'images/cat-kids-coral.webp', badge: 'Coral', desc: 'Coral pink kids blanket for a colourful classic crib.', gsm: '380 GSM Soft Touch', fabric: 'Organic Micro-Fleece', sizes: 'Crib & Nursery', spec: 'Coral nursery colour' },

    { category: 'throws', title: 'Living Space Knitted Throw', img: 'images/collection-throw.webp', badge: 'Interior Decor', desc: 'Chic fringe-edged accent throw that adds aesthetic warmth to a lounge.', gsm: '420 GSM Knit', fabric: 'Artisanal Acrylic-Cotton Blend', sizes: '130cm x 170cm Throw Size', spec: 'Classic living colours' },
    { category: 'throws', title: 'Sage Garden Throw', img: 'images/soft-03.webp', badge: 'Sage', desc: 'A calm sage knit throw that adds classic colour to sofas and lounges.', gsm: '410 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Soft sage tone' },
    { category: 'throws', title: 'Terracotta Popcorn Knit', img: 'images/soft-09.webp', badge: 'Terracotta', desc: 'Chunky terracotta knit throw draped on a classic living sofa.', gsm: '420 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Popcorn knit texture' },
    { category: 'throws', title: 'Mustard Living Throw', img: 'images/cat-throw-mustard.webp', badge: 'Mustard', desc: 'Mustard yellow knitted throw with fringe for colourful sofas.', gsm: '420 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Classic mustard knit' },
    { category: 'throws', title: 'Teal Lounge Throw', img: 'images/cat-throw-teal.webp', badge: 'Teal', desc: 'Teal knitted throw for a colourful living room accent.', gsm: '410 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Teal fringe knit' },
    { category: 'throws', title: 'Rust Sofa Throw', img: 'images/cat-throw-rust.webp', badge: 'Rust', desc: 'Rust terracotta knitted throw for classic sofa styling.', gsm: '420 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Rust living colour' },
    { category: 'throws', title: 'Indigo Knit Throw', img: 'images/cat-throw-indigo.webp', badge: 'Indigo', desc: 'Indigo blue knitted throw with a classic fringe edge.', gsm: '410 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Indigo lounge tone' },
    { category: 'throws', title: 'Olive Garden Throw', img: 'images/cat-throw-olive.webp', badge: 'Olive', desc: 'Olive green knitted throw for earthy living rooms.', gsm: '420 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Olive knit colour' },
    { category: 'throws', title: 'Coral Lounge Throw', img: 'images/cat-throw-coral.webp', badge: 'Coral', desc: 'Coral pink knitted throw for a colourful classic sofa.', gsm: '410 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Coral living accent' },
    { category: 'throws', title: 'Burgundy Knit Throw', img: 'images/cat-throw-burgundy.webp', badge: 'Burgundy', desc: 'Burgundy knitted throw with fringe for a rich living room.', gsm: '420 GSM Knit', fabric: 'Cotton-Acrylic Knit', sizes: '130cm x 170cm', spec: 'Burgundy knit finish' }
  ];

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function collectionDataAttrs(item) {
    return ' data-title="' + escapeAttr(item.title) + '"' +
      ' data-desc="' + escapeAttr(item.desc) + '"' +
      ' data-img="' + escapeAttr(item.img) + '"' +
      ' data-gsm="' + escapeAttr(item.gsm) + '"' +
      ' data-fabric="' + escapeAttr(item.fabric) + '"' +
      ' data-sizes="' + escapeAttr(item.sizes) + '"';
  }

  function createCollectionCard(item) {
    const wrap = document.createElement('div');
    wrap.className = 'collection-item';
    wrap.setAttribute('data-category', item.category);
    wrap.innerHTML =
      '<div class="collection-card">' +
        '<div class="collection-img-box" role="button" tabindex="0" aria-label="Open ' + escapeAttr(item.title) + '"' + collectionDataAttrs(item) + '>' +
          '<img src="' + escapeAttr(item.img) + '" alt="' + escapeAttr(item.title) + '" loading="lazy">' +
          '<div class="collection-overlay">' +
            '<button class="btn btn-luxury-primary w-100 py-2" data-bs-toggle="modal" data-bs-target="#collectionModal"' +
              collectionDataAttrs(item) + '>' +
              '<i class="bi bi-eye"></i> Quick View Specs' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="collection-body">' +
          '<div>' +
            '<div class="badge-gold mb-2">' + escapeAttr(item.badge) + '</div>' +
            '<h4 class="collection-title">' + escapeAttr(item.title) + '</h4>' +
            '<p class="collection-desc">' + escapeAttr(item.desc) + '</p>' +
          '</div>' +
          '<ul class="spec-list">' +
            '<li><i class="bi bi-sliders"></i> Weight: ' + escapeAttr(item.gsm) + '</li>' +
            '<li><i class="bi bi-palette"></i> ' + escapeAttr(item.spec) + '</li>' +
          '</ul>' +
        '</div>' +
      '</div>';
    return wrap;
  }

  function renderCollectionSlides(filterValue) {
    if (!collectionMarqueeEl) return;

    let items = COLLECTION_CATALOG.filter((item) => (
      filterValue === 'all' || item.category === filterValue
    ));
    const track = collectionMarqueeEl.querySelector('.collection-marquee-track');
    track.innerHTML = '';

    if (!items.length) {
      track.style.animation = 'none';
      track.innerHTML = '<p class="collection-marquee-empty">No pieces in this collection yet.</p>';
      return;
    }

    const source = items.slice();
    while (items.length < 16) items = items.concat(source);

    const group = document.createElement('div');
    group.className = 'collection-marquee-group';
    items.forEach((item) => group.appendChild(createCollectionCard(item)));

    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('.collection-img-box, button').forEach((el) => {
      el.setAttribute('tabindex', '-1');
    });
    track.appendChild(group);
    track.appendChild(clone);

    const cardWidth = window.matchMedia('(max-width: 576px)').matches ? 242 : 282;
    const seconds = Math.max(36, Math.round((items.length * cardWidth) / 55));
    track.style.setProperty('--marquee-duration', seconds + 's');
    track.style.animation = 'none';
    track.offsetWidth;
    track.style.removeProperty('animation');
  }

  function applyCollectionModal(source) {
    if (!source) return;
    document.getElementById('modalProductTitle').innerText = source.getAttribute('data-title') || 'Collection Detail';
    document.getElementById('modalProductDesc').innerText = source.getAttribute('data-desc') || '';
    const modalImg = document.getElementById('modalProductImg');
    modalImg.src = source.getAttribute('data-img') || '';
    modalImg.alt = source.getAttribute('data-title') || 'Product Quick View';
    document.getElementById('modalProductGSM').innerText = source.getAttribute('data-gsm') || '500 GSM Premium Heavyweight';
    document.getElementById('modalProductFabric').innerText = source.getAttribute('data-fabric') || '100% Micro-Fleece Ultra Soft';
    document.getElementById('modalProductSizes').innerText = source.getAttribute('data-sizes') || 'Single, Double, King & Custom Wholesale';
  }

  function openCollectionFrom(source) {
    applyCollectionModal(source);
    if (quickViewModal && window.bootstrap) {
      window.bootstrap.Modal.getOrCreateInstance(quickViewModal).show();
    }
  }

  if (collectionMarqueeEl) {
    collectionMarqueeEl.addEventListener('click', (event) => {
      if (event.target.closest('[data-bs-toggle="modal"]')) return;
      const opener = event.target.closest('.collection-img-box');
      if (!opener || !collectionMarqueeEl.contains(opener)) return;
      openCollectionFrom(opener);
    });
    collectionMarqueeEl.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const opener = event.target.closest('.collection-img-box');
      if (!opener || !collectionMarqueeEl.contains(opener)) return;
      event.preventDefault();
      openCollectionFrom(opener);
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderCollectionSlides(btn.getAttribute('data-filter'));
    });
  });

  renderCollectionSlides('all');

  // 6. QUICK VIEW COLLECTION MODAL DATA
  const quickViewModal = document.getElementById('collectionModal');
  if (quickViewModal) {
    quickViewModal.addEventListener('show.bs.modal', (event) => {
      if (event.relatedTarget) applyCollectionModal(event.relatedTarget);
    });
  }

  // 7. SIMPLE ENQUIRY FORM
  const contactForm = document.getElementById('trishlaContactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnText = document.getElementById('btnText');
  const phoneInput = document.getElementById('formPhone');
  const emailInput = document.getElementById('formEmail');
  const nameInput = document.getElementById('formName');
  const cityInput = document.getElementById('formCity');
  const remarkInput = document.getElementById('formRemark');
  const phoneHint = document.getElementById('phoneHint');
  const emailHint = document.getElementById('emailHint');
  const responseModalEl = document.getElementById('responseModal');
  const responseModalText = document.getElementById('responseModalText');
  const responseModalTitle = document.getElementById('responseModalTitle');
  const responseModalIcon = document.getElementById('responseModalIcon');

  const INDIAN_MOBILE = /^[6-9][0-9]{9}$/;
  const SIMPLE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let responseModalInstance = null;

  if (responseModalEl && typeof bootstrap !== 'undefined') {
    responseModalInstance = new bootstrap.Modal(responseModalEl);
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      if (!phoneInput.value) {
        phoneHint.textContent = '';
      } else if (!INDIAN_MOBILE.test(phoneInput.value)) {
        phoneHint.textContent = 'Enter a valid 10-digit Indian mobile starting with 6, 7, 8 or 9.';
      } else {
        phoneHint.textContent = '';
      }
    });
  }

  if (emailInput && emailHint) {
    emailInput.addEventListener('input', () => {
      if (!emailInput.value) {
        emailHint.textContent = '';
      } else if (!SIMPLE_EMAIL.test(emailInput.value.trim())) {
        emailHint.textContent = 'Enter a valid email ID.';
      } else {
        emailHint.textContent = '';
      }
    });
  }

  async function sendEnquiryEmail(details) {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(details)
    });

    let data = {};
    try {
      data = await response.json();
    } catch (err) {
      data = {};
    }

    if (!response.ok || !data.ok) {
      throw new Error(data.message || 'Could not deliver the enquiry email.');
    }
    return data;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = (nameInput && nameInput.value.trim()) || '';
      const email = (emailInput && emailInput.value.trim()) || '';
      const phone = (phoneInput && phoneInput.value.trim()) || '';
      const city = (cityInput && cityInput.value.trim()) || '';
      const remark = (remarkInput && remarkInput.value.trim()) || '';
      const honey = contactForm.querySelector('[name="_honey"]');

      if (honey && honey.value) {
        return;
      }
      if (name.length < 2) {
        showFormNotice('Required Fields Missing', 'Please enter your name.', 'warning');
        return;
      }
      if (!SIMPLE_EMAIL.test(email)) {
        if (emailHint) emailHint.textContent = 'Enter a valid email ID.';
        showFormNotice('Required Fields Missing', 'Please enter a valid email ID.', 'warning');
        return;
      }
      if (!INDIAN_MOBILE.test(phone)) {
        if (phoneHint) phoneHint.textContent = 'Only a 10-digit Indian mobile (starting 6-9) is allowed.';
        return;
      }
      if (city.length < 2) {
        showFormNotice('Required Fields Missing', 'Please enter the city you belong to.', 'warning');
        return;
      }
      if (!remark) {
        showFormNotice('Required Fields Missing', 'Please write a remark.', 'warning');
        return;
      }

      submitBtn.disabled = true;
      if (btnSpinner) btnSpinner.classList.remove('d-none');
      if (btnText) btnText.innerText = 'Sending...';

      const payload = {
        name: name.slice(0, 80),
        email: email.slice(0, 120),
        phone: '+91' + phone,
        city: city.slice(0, 80),
        remark: remark.slice(0, 1500)
      };

      try {
        await sendEnquiryEmail(payload);
        showFormNotice(
          'Thank You for Contacting TRISHLACOZY!',
          'Dear ' + name + ', your enquiry has been emailed to info@rasr.co.in. Our team will reach out within 24 hours.',
          'success'
        );
        contactForm.reset();
        if (phoneHint) phoneHint.textContent = '';
        if (emailHint) emailHint.textContent = '';
      } catch (err) {
        showFormNotice('Could not send enquiry', err.message || 'Please try again, or WhatsApp us.', 'error');
      } finally {
        resetSubmitButton();
      }
    });
  }

  function resetSubmitButton() {
    if (submitBtn) submitBtn.disabled = false;
    if (btnSpinner) btnSpinner.classList.add('d-none');
    if (btnText) btnText.innerText = 'Send Enquiry';
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

});
