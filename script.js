

// ── LIVE WATCH CLOCK ──
function updateClock() {
  const now = new Date();
  const s = now.getSeconds(), m = now.getMinutes(), h = now.getHours() % 12;
  const secDeg  = s * 6;
  const minDeg  = m * 6 + s * 0.1;
  const hourDeg = h * 30 + m * 0.5;
  $('#secHand').css('transform', `rotate(${secDeg}deg)`);
  $('#minHand').css('transform', `rotate(${minDeg}deg)`);
  $('#hourHand').css('transform', `rotate(${hourDeg}deg)`);
}
// Build tick marks
(function buildTicks() {
  const wrap = $('#tickMarks');
  for (let i = 0; i < 60; i++) {
    const isMajor = i % 5 === 0;
    wrap.append(`<div class="tick ${isMajor?'major':''}" style="transform:rotate(${i*6}deg)"><span></span></div>`);
  }
})();
updateClock();
setInterval(updateClock, 1000);

// ── NAVBAR SCROLL ──
$(window).on('scroll', function() {
  if ($(this).scrollTop() > 80) {
    $('#mainNav').addClass('scrolled');
    $('#backToTop').addClass('visible');
  } else {
    $('#mainNav').removeClass('scrolled');
    $('#backToTop').removeClass('visible');
  }
  // Active nav links
  $('section[id]').each(function() {
    const top = $(this).offset().top - 100;
    const bot = top + $(this).outerHeight();
    if ($(window).scrollTop() >= top && $(window).scrollTop() < bot) {
      const id = $(this).attr('id');
      $('.nav-link').removeClass('active');
      $(`.nav-link[href="#${id}"]`).addClass('active');
    }
  });
});

// ── SMOOTH NAV LINKS ──
$('.nav-link, a[href^="#"]').on('click', function(e) {
  const href = $(this).attr('href');
  if (href && href.startsWith('#') && $(href).length) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: $(href).offset().top - 70 }, 600);
    // Close mobile menu
    $('#navMenu').collapse('hide');
  }
});

// ── FADE-UP OBSERVER ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));

// ── COUNT-UP ANIMATION ──
function animateCount(el) {
  const target = parseInt($(el).data('count'));
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    $(el).text(count.toLocaleString() + (target >= 1000 ? '+' : '+'));
    if (count >= target) clearInterval(timer);
  }, 30);
}
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = 1;
      animateCount(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ── PRODUCT FILTER ──
function filterProducts(cat) {
  $('.filter-tab').removeClass('active');
  $(`.filter-tab[data-filter="${cat}"]`).addClass('active');
  if (cat === 'all') {
    $('.product-item').fadeIn(300);
  } else {
    $('.product-item').each(function() {
      if ($(this).data('category') === cat) $(this).fadeIn(300);
      else $(this).fadeOut(200);
    });
  }
}
$('.filter-tab').on('click', function() {
  filterProducts($(this).data('filter'));
});

// ── CATEGORY CARDS → FILTER ──
// Already wired via onclick="filterProducts('...')" which scrolls to products
function filterProducts(cat) {
  const target = document.getElementById('products');
  $('html,body').animate({scrollTop: $(target).offset().top - 70}, 400, function() {
    $('.filter-tab').removeClass('active');
    const btn = $(`.filter-tab[data-filter="${cat}"]`);
    if (btn.length) btn.addClass('active');
    if (cat === 'all') {
      $('.product-item').show();
    } else {
      $('.product-item').each(function() {
        $(this).data('category') === cat ? $(this).show() : $(this).hide();
      });
    }
  });
}

// ── COMPARE TABLE DATA ──
const watchData = {
  grand: {
    name: 'Grandeur Classic', price: 'Rs. 45,000', category: 'Formal',
    brand: 'Royal Empire', movement: 'Swiss Automatic', waterResistant: '30M',
    material: 'Stainless Steel', warranty: '2 Years', smartFeatures: false,
    chronograph: false, gps: false, heartRate: false
  },
  titan: {
    name: 'Titan Diver 200M', price: 'Rs. 18,500', category: 'Sports',
    brand: 'StrikePro', movement: 'Japanese Quartz', waterResistant: '200M',
    material: 'Titanium', warranty: '1 Year', smartFeatures: false,
    chronograph: true, gps: false, heartRate: false
  },
  smart: {
    name: 'SmartX Pro 2024', price: 'Rs. 32,000', category: 'Smart',
    brand: 'TechWear', movement: 'Digital', waterResistant: '50M',
    material: 'Aluminium Alloy', warranty: '1 Year', smartFeatures: true,
    chronograph: true, gps: true, heartRate: true
  },
  urban: {
    name: 'Urban Chic Rose Gold', price: 'Rs. 12,000', category: 'Casual',
    brand: 'Vogue Time', movement: 'Japanese Quartz', waterResistant: '30M',
    material: 'Rose Gold Plated', warranty: '1 Year', smartFeatures: false,
    chronograph: false, gps: false, heartRate: false
  },
  moon: {
    name: 'Heritage Moonphase', price: 'Rs. 95,000', category: 'Formal',
    brand: 'Prestige Co.', movement: 'Swiss Automatic', waterResistant: '50M',
    material: 'Solid Gold Bezel', warranty: '2 Years', smartFeatures: false,
    chronograph: true, gps: false, heartRate: false
  },
  expo: {
    name: 'Expedition Chrono', price: 'Rs. 28,000', category: 'Sports',
    brand: 'Endure Sports', movement: 'Quartz Chronograph', waterResistant: '100M',
    material: 'Titanium', warranty: '2 Years', smartFeatures: false,
    chronograph: true, gps: false, heartRate: false
  }
};

function tick(val) {
  return val
    ? '<i class="bi bi-check-circle-fill" style="color:#2ecc71;"></i>'
    : '<i class="bi bi-x-circle-fill" style="color:#e74c3c;"></i>';
}

function updateCompare() {
  const val1 = $('#watch1Select').val();
  const val2 = $('#watch2Select').val();

  const w1 = watchData[val1];
  const w2 = watchData[val2];

  if (!w1 || !w2) {
    console.warn("Select both watches first!");
    return;
  }

  $('#th1').text(w1.name || "N/A");
  $('#th2').text(w2.name || "N/A");

  const rows = [
    ['Brand', w1.brand, w2.brand],
    ['Price', w1.price, w2.price],
    ['Category', w1.category, w2.category],
    ['Movement', w1.movement, w2.movement],
    ['Water Resistance', w1.waterResistant, w2.waterResistant],
    ['Material', w1.material, w2.material],
    ['Warranty', w1.warranty, w2.warranty],
    ['Chronograph', tick(w1.chronograph), tick(w2.chronograph)],
    ['Heart Rate Monitor', tick(w1.heartRate), tick(w2.heartRate)],
    ['GPS', tick(w1.gps), tick(w2.gps)],
    ['Smart Features', tick(w1.smartFeatures), tick(w2.smartFeatures)],
  ];

  let html = '';
  rows.forEach(([feat, v1, v2]) => {
    html += `<tr>
      <td class="feature-name">${feat}</td>
      <td>${v1 || "N/A"}</td>
      <td>${v2 || "N/A"}</td>
    </tr>`;
  });

  $('#compareTbody').html(html);
}
$('#watch1Select, #watch2Select').on('change', updateCompare);

// ── NEWSLETTER FORM ──
$('#newsletterForm').on('submit', function(e) {
  e.preventDefault();
  const email = $('#newsletterEmail').val().trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    $('#newsletterErr').show();
    $('#newsletterMsg').hide();
  } else {
    $('#newsletterErr').hide();
    $('#newsletterMsg').show();
    $(this)[0].reset();
    setTimeout(() => $('#newsletterMsg').fadeOut(), 4000);
  }
});

// ── FEEDBACK FORM VALIDATION ──
$('#feedbackForm').on('submit', function(e) {
  e.preventDefault();
  let valid = true;

  // Name
  const name = $('#rName').val().trim();
  if (name.length < 3) { $('#rName').addClass('is-invalid'); valid = false; }
  else $('#rName').removeClass('is-invalid');

  // Email
  const email = $('#rEmail').val().trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) { $('#rEmail').addClass('is-invalid'); valid = false; }
  else $('#rEmail').removeClass('is-invalid');

  // Rating
  const rating = $('input[name="rating"]:checked').val();
  if (!rating) { $('#ratingErr').show(); valid = false; }
  else $('#ratingErr').hide();

  // Review
  const review = $('#rReview').val().trim();
  if (review.length < 20) { $('#rReview').addClass('is-invalid'); valid = false; }
  else $('#rReview').removeClass('is-invalid');

  if (valid) {
    $('#feedbackSuccess').show();
    this.reset();
    $('input[name="rating"]').prop('checked', false);
    setTimeout(() => $('#feedbackSuccess').fadeOut(), 5000);
  }
});

// Live clear invalid on input
$('#feedbackForm .form-control-dark').on('input change', function() {
  $(this).removeClass('is-invalid');
});

// ── CONTACT FORM VALIDATION ──
$('#contactForm').on('submit', function(e) {
  e.preventDefault();
  let valid = true;
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRx = /^(03\d{9}|\+923\d{9}|0\d{10})$/;

  // Name
  const name = $('#cName').val().trim();
  if (name.length < 3) { $('#cName').addClass('is-invalid'); valid = false; }
  else $('#cName').removeClass('is-invalid');

  // Phone
  const phone = $('#cPhone').val().trim().replace(/[\s\-]/g, '');
  if (!phoneRx.test(phone)) { $('#cPhone').addClass('is-invalid'); valid = false; }
  else $('#cPhone').removeClass('is-invalid');

  // Email
  const email = $('#cEmail').val().trim();
  if (!emailRx.test(email)) { $('#cEmail').addClass('is-invalid'); valid = false; }
  else $('#cEmail').removeClass('is-invalid');

  // Subject
  const subj = $('#cSubject').val();
  if (!subj) { $('#cSubject').addClass('is-invalid'); valid = false; }
  else $('#cSubject').removeClass('is-invalid');

  // Message
  const msg = $('#cMessage').val().trim();
  if (msg.length < 15) { $('#cMessage').addClass('is-invalid'); valid = false; }
  else $('#cMessage').removeClass('is-invalid');

  if (valid) {
    $('#contactSuccess').show();
    this.reset();
    setTimeout(() => $('#contactSuccess').fadeOut(), 5000);
  }
});

$('#contactForm .form-control-dark').on('input change', function() {
  $(this).removeClass('is-invalid');
});









// Hamburger click
// toggler.addEventListener("click", () => {
//   nav.classList.toggle("menu-open");
// });

// // Jab menu close ho
// menu.addEventListener("hidden.bs.collapse", () => {
//   nav.classList.remove("menu-open");
// });

// // Scroll logic (fixed)
// window.addEventListener("scroll", () => {
//   if (window.scrollY > 50) {
//     nav.classList.add("menu-open");
//   } else {
//     if (!menu.classList.contains("show")) {
//       nav.classList.remove("menu-open");
//     }
//   }
// });






//   const nav = document.getElementById("mainNav");
//   const toggler = document.querySelector(".navbar-toggler");

//   toggler.addEventListener("click", function () {
//     nav.classList.toggle("menu-open");
//   });




document.addEventListener("DOMContentLoaded", function () {

  const nav = document.getElementById("mainNav");
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.querySelector(".navbar-collapse");

  if (toggler) {
    toggler.addEventListener("click", () => {
      nav.classList.toggle("menu-open");
    });
  }

  if (menu) {
    menu.addEventListener("hidden.bs.collapse", () => {
      nav.classList.remove("menu-open");
    });
  }

});document.addEventListener("DOMContentLoaded", function () {

  const nav = document.getElementById("mainNav");
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.querySelector(".navbar-collapse");

  if (toggler) {
    toggler.addEventListener("click", () => {
      nav.classList.toggle("menu-open");
    });
  }

  if (menu) {
    menu.addEventListener("hidden.bs.collapse", () => {
      nav.classList.remove("menu-open");
    });
  }

});
