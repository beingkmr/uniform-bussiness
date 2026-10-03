(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  var minimalNav = document.querySelector('.header-minimal .nav-right');
  var mobileMenu = links || minimalNav;

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
  }

  var dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(function (dropdown) {
    var toggleBtn = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  document.addEventListener('click', function (e) {
    if (window.innerWidth > 768) return;

    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove('open');
      });
    }

    if (mobileMenu && toggle && !e.target.closest('.nav-container') && !e.target.closest('header nav')) {
      mobileMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
  });

  var year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();

  var smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          var headerOffset = 80;
          var elementPosition = targetElement.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            if (toggle) {
              toggle.setAttribute('aria-expanded', 'false');
              toggle.setAttribute('aria-label', 'Open menu');
            }
          }
        }
      }
    });
  });

  var hash = window.location.hash;
  if (hash) {
    setTimeout(function () {
      var targetElement = document.querySelector(hash);
      if (targetElement) {
        var headerOffset = 80;
        var elementPosition = targetElement.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  // Lightbox functionality
  var lightbox = null;
  var lightboxImg = null;
  var lightboxCaption = null;
  var currentGallery = [];
  var currentIndex = 0;

  function createLightbox() {
    if (lightbox) return;

    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = 
      '<div class="lightbox-content">' +
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>' +
        '<img src="" alt="">' +
        '<button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>' +
        '<div class="lightbox-caption"></div>' +
      '</div>';
    
    document.body.appendChild(lightbox);
    
    lightboxImg = lightbox.querySelector('img');
    lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', function() { navigateLightbox(-1); });
    nextBtn.addEventListener('click', function() { navigateLightbox(1); });
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    });
  }

  function openLightbox(img, gallery) {
    createLightbox();
    
    currentGallery = gallery;
    currentIndex = Array.prototype.indexOf.call(gallery, img);
    
    updateLightboxImage(img);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    
    if (gallery.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function navigateLightbox(direction) {
    if (currentGallery.length <= 1) return;
    
    currentIndex += direction;
    
    if (currentIndex < 0) {
      currentIndex = currentGallery.length - 1;
    } else if (currentIndex >= currentGallery.length) {
      currentIndex = 0;
    }
    
    updateLightboxImage(currentGallery[currentIndex]);
  }

  function updateLightboxImage(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt || '';
  }

  function initGalleries() {
    var galleries = document.querySelectorAll('.product-gallery');
    
    galleries.forEach(function(gallery) {
      var images = gallery.querySelectorAll('img');
      
      images.forEach(function(img) {
        img.style.cursor = 'pointer';
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Click to view ' + (img.alt || 'image') + ' in fullscreen');
        
        img.addEventListener('click', function() {
          openLightbox(img, images);
        });
        
        img.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(img, images);
          }
        });
      });
    });

    var productCards = document.querySelectorAll('.product-card img');
    productCards.forEach(function(img) {
      img.style.cursor = 'pointer';
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Click to view ' + (img.alt || 'image') + ' in fullscreen');
      
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        openLightbox(img, [img]);
      });
      
      img.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img, [img]);
        }
      });
    });

    var featureImages = document.querySelectorAll('.feature-split img, .hero-image img');
    featureImages.forEach(function(img) {
      img.style.cursor = 'pointer';
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Click to view ' + (img.alt || 'image') + ' in fullscreen');
      
      img.addEventListener('click', function() {
        openLightbox(img, [img]);
      });
      
      img.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img, [img]);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleries);
  } else {
    initGalleries();
  }
})();
