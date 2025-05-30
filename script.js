document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // Utility Functions
  // ======================
  const debounce = (func, wait = 100) => {
      let timeout;
      return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
      };
  };

  // ======================
  // Mobile Navigation
  // ======================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navAdvanced = document.querySelector('.nav-advanced');

  // Mobile Menu Toggle
  if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
          const isOpen = this.classList.toggle('active');
          
          // Toggle both nav-links and nav-advanced if they exist
          if (navLinks) navLinks.classList.toggle('active');
          if (navAdvanced) navAdvanced.classList.toggle('active');
          
          // Update icon and aria attribute
          this.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
          this.setAttribute('aria-expanded', isOpen);
      });
  }

  // Header Scroll Effect
  const header = document.querySelector('.glass-header');
  if (header) {
      window.addEventListener('scroll', function() {
          if (window.scrollY > 50) {
              header.classList.add('scrolled');
          } else {
              header.classList.remove('scrolled');
          }
      });
  }

  // Magnetic Logo Effect
  const logo = document.querySelector('.logo-magnetic');
  if (logo) {
      logo.addEventListener('mousemove', function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const angleX = (y - centerY) / 10;
          const angleY = (centerX - x) / 10;
          
          this.style.transform = `perspective(500px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      });
      
      logo.addEventListener('mouseleave', function() {
          this.style.transform = 'perspective(500px) rotateX(0) rotateY(0)';
      });
  }

  // ======================
  // Smooth Scrolling
  // ======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const target = document.querySelector(targetId);
          if (target) {
              e.preventDefault();
              
              window.scrollTo({
                  top: target.offsetTop - 90,
                  behavior: 'smooth'
              });
              
              // Close mobile menu if open
              if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                  mobileMenuBtn.classList.remove('active');
                  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                  mobileMenuBtn.setAttribute('aria-expanded', 'false');
                  
                  if (navLinks) navLinks.classList.remove('active');
                  if (navAdvanced) navAdvanced.classList.remove('active');
              }
              
              // Accessibility focus
              target.setAttribute('tabindex', '-1');
              target.focus();
          }
      });
  });

  // ======================
  // Animated Counter
  // ======================
  const animateCounters = () => {
      const statNumbers = document.querySelectorAll('.stat-number');
      
      statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count')) || 0;
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          
          const updateCounter = () => {
              current += step;
              if (current < target) {
                  stat.textContent = Math.ceil(current);
                  requestAnimationFrame(updateCounter);
              } else {
                  stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
              }
          };
          
          updateCounter();
          
          // Animate progress circle
          const circle = stat.closest('.stat-card')?.querySelector('.stat-progress circle:nth-child(2)');
          if (circle) {
              const radius = circle.r.baseVal.value;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (target / (stat.textContent.includes('+') ? 150 : 10) * circumference);
              circle.style.strokeDashoffset = offset;
          }
      });
  };

  // Intersection Observer for counters
  const statsSection = document.getElementById('stats');
  if (statsSection) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  animateCounters();
                  observer.unobserve(entry.target);
              }
          });
      }, { threshold: 0.5 });

      observer.observe(statsSection);
  }

  // ======================
  // Scroll Animations
  // ======================
  const animateOnScroll = () => {
      const animateElements = document.querySelectorAll('.animate');
      
      animateElements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementPosition < windowHeight - 100) {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
          }
      });
  };

  window.addEventListener('scroll', debounce(animateOnScroll));
  window.addEventListener('load', animateOnScroll);

  // ======================
  // Project Card Parallax
  // ======================
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
          const x = e.clientX - card.getBoundingClientRect().left;
          const y = e.clientY - card.getBoundingClientRect().top;
          
          const centerX = card.offsetWidth / 2;
          const centerY = card.offsetHeight / 2;
          
          const moveX = (x - centerX) / 20;
          const moveY = (y - centerY) / 20;
          
          const img = card.querySelector('.project-image');
          if (img) {
              img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
          }
      });
      
      card.addEventListener('mouseleave', () => {
          const img = card.querySelector('.project-image');
          if (img) {
              img.style.transform = 'scale(1.1) translate(0, 0)';
          }
      });
  });

  // ======================
  // Testimonial Slider
  // ======================
  const initTestimonialSlider = () => {
      const slider = document.querySelector('.testimonials-slider');
      if (!slider) return;

      const slides = document.querySelectorAll('.testimonial-slide');
      const dotsContainer = document.querySelector('.slider-dots');
      const prevBtn = document.querySelector('.slider-prev');
      const nextBtn = document.querySelector('.slider-next');
      let currentSlide = 0;
      let slideInterval;

      // Create dots if container exists
      if (dotsContainer && slides.length > 0) {
          dotsContainer.innerHTML = ''; // Clear existing dots
          slides.forEach((_, index) => {
              dotsContainer.insertAdjacentHTML('beforeend', 
                  `<div class="slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
              );
          });
      }

      const dots = document.querySelectorAll('.slider-dot');

      // Show slide function
      const showSlide = (index) => {
          slides.forEach(slide => slide.classList.remove('active'));
          dots.forEach(dot => dot.classList.remove('active'));
          
          slides[index]?.classList.add('active');
          if (dots[index]) dots[index].classList.add('active');
          currentSlide = index;
      };

      // Next slide
      const nextSlide = () => {
          currentSlide = (currentSlide + 1) % slides.length;
          showSlide(currentSlide);
      };

      // Previous slide
      const prevSlide = () => {
          currentSlide = (currentSlide - 1 + slides.length) % slides.length;
          showSlide(currentSlide);
      };

      // Auto-rotate
      const startSlider = () => {
          clearInterval(slideInterval);
          slideInterval = setInterval(nextSlide, 5000);
      };

      // Initialize slider
      if (slides.length > 0) {
          showSlide(0);
          startSlider();
          
          // Event listeners
          if (nextBtn) nextBtn.addEventListener('click', () => {
              nextSlide();
              startSlider();
          });

          if (prevBtn) prevBtn.addEventListener('click', () => {
              prevSlide();
              startSlider();
          });

          dots.forEach(dot => {
              dot.addEventListener('click', () => {
                  showSlide(parseInt(dot.getAttribute('data-index')));
                  startSlider();
              });
          });

          // Pause on hover
          slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
          slider.addEventListener('mouseleave', startSlider);
      }
  };

  initTestimonialSlider();

  // ======================
  // Form Handling
  // ======================
  const floatingGroups = document.querySelectorAll('.floating-group');
  floatingGroups.forEach(group => {
      const input = group.querySelector('.form-control');
      if (!input) return;

      // Check initial value
      if (input.value) {
          group.querySelector('label').classList.add('active');
      }

      // Update on input
      input.addEventListener('input', function() {
          const label = group.querySelector('label');
          if (this.value) {
              label.classList.add('active');
          } else {
              label.classList.remove('active');
          }
      });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const formData = {
              name: this.querySelector('#name')?.value,
              email: this.querySelector('#email')?.value,
              subject: this.querySelector('#subject')?.value,
              message: this.querySelector('#message')?.value
          };

          // Here you would typically send the data to a server
          console.log('Form submitted:', formData);
          
          // Show success message
          alert('Thank you for your message! I will get back to you soon.');
          this.reset();
          
          // Reset floating labels
          floatingGroups.forEach(group => {
              group.querySelector('label').classList.remove('active');
          });
      });
  }

  // ======================
  // Responsive Service Cards
  // ======================
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length > 0) {
      const checkMobile = () => {
          serviceCards.forEach(card => {
              if (window.innerWidth <= 768) {
                  card.classList.add('mobile-fallback');
              } else {
                  card.classList.remove('mobile-fallback');
              }
          });
      };

      // Initial check
      checkMobile();
      
      // Check on resize
      window.addEventListener('resize', debounce(checkMobile));
      
      // Click to toggle on mobile
      serviceCards.forEach(card => {
          card.addEventListener('click', function() {
              if (window.innerWidth <= 768) {
                  this.classList.toggle('flipped');
              }
          });
      });
  }

  // ======================
  // Back to Top Button
  // ======================
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
      // Initialize state
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
      backToTopBtn.style.transition = 'opacity 0.3s, visibility 0.3s';

      // Click handler
      backToTopBtn.addEventListener('click', () => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });

      // Scroll handler
      window.addEventListener('scroll', () => {
          if (window.scrollY > 300) {
              backToTopBtn.style.opacity = '1';
              backToTopBtn.style.visibility = 'visible';
          } else {
              backToTopBtn.style.opacity = '0';
              backToTopBtn.style.visibility = 'hidden';
          }
      });
  }

  // ======================
  // Footer Year Update
  // ======================
  const yearElement = document.getElementById('year');
  if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
  }

  // ======================
  // Force Footer Sections Visibility (Debug)
  // ======================
  const footerNewsletter = document.querySelector('.footer-newsletter');
  const footerConnect = document.querySelector('.footer-connect');
  
  if (footerNewsletter) footerNewsletter.style.display = 'block';
  if (footerConnect) footerConnect.style.display = 'block';
});

document.addEventListener('DOMContentLoaded', function() {
  // Back to top button functionality
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
      // Initialize state
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
      backToTopBtn.style.transition = 'opacity 0.3s, visibility 0.3s';

      // Click handler
      backToTopBtn.addEventListener('click', () => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });

      // Scroll handler
      window.addEventListener('scroll', () => {
          if (window.scrollY > 300) {
              backToTopBtn.style.opacity = '1';
              backToTopBtn.style.visibility = 'visible';
          } else {
              backToTopBtn.style.opacity = '0';
              backToTopBtn.style.visibility = 'hidden';
          }
      });
  }

  // Form handling
  const inputGroups = document.querySelectorAll('.input-group');
  inputGroups.forEach(group => {
      const input = group.querySelector('input');
      const label = group.querySelector('label');
      
      if (input && label) {
          // Check initial value
          if (input.value) {
              label.classList.add('active');
          }

          // Update on input
          input.addEventListener('input', function() {
              if (this.value) {
                  label.classList.add('active');
              } else {
                  label.classList.remove('active');
              }
          });
      }
  });
});