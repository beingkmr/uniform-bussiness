(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
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
    if (!e.target.closest('.nav-dropdown') && window.innerWidth <= 768) {
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove('open');
      });
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
          
          if (links && links.classList.contains('open')) {
            links.classList.remove('open');
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
})();
