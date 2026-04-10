document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('visitForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            message: document.getElementById('message').value || 'No additional message'
        };

        const submitButton = form.querySelector('.submit-button');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="button-text">Sending...</span>';
        submitButton.disabled = true;

        try {
            const response = await fetch('https://formspree.io/f/xbdpvyka', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Success message
                formMessage.innerHTML = `
                    <div class="success-message">
                        <span class="message-icon">✓</span>
                        <div>
                            <strong>Visit Scheduled Successfully!</strong>
                            <p>We'll contact you at ${formData.phone} to confirm your visit on ${formData.date}.</p>
                        </div>
                    </div>
                `;
                formMessage.className = 'form-message show success';
                form.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.className = 'form-message';
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error message
            formMessage.innerHTML = `
                <div class="error-message">
                    <span class="message-icon">✕</span>
                    <div>
                        <strong>Submission Failed</strong>
                        <p>Please call us directly at <a href="tel:9900262442">+91 9900262442</a></p>
                    </div>
                </div>
            `;
            formMessage.className = 'form-message show error';

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.className = 'form-message';
            }, 5000);
        } finally {
            // Reset button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // Set minimum date to today and maximum date to 10 days from today
    const dateInput = document.getElementById('date');
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 10);
    
    const todayStr = today.toISOString().split('T')[0];
    const maxDateStr = maxDate.toISOString().split('T')[0];
    
    dateInput.setAttribute('min', todayStr);
    dateInput.setAttribute('max', maxDateStr);

    // Phone number validation - exactly 10 digits
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        // Remove all non-digit characters
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        e.target.value = value;
        
        // Validate length
        if (value.length > 0 && value.length < 10) {
            phoneInput.setCustomValidity('Phone number must be exactly 10 digits');
        } else if (value.length === 10) {
            phoneInput.setCustomValidity('');
        } else {
            phoneInput.setCustomValidity('');
        }
    });

    // Additional validation on form submit
    form.addEventListener('submit', function(e) {
        const phoneValue = phoneInput.value.replace(/\D/g, '');
        if (phoneValue.length !== 10) {
            e.preventDefault();
            phoneInput.setCustomValidity('Phone number must be exactly 10 digits');
            phoneInput.reportValidity();
            return false;
        }
    }, true);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.amenity-card, .spec-card, .unit-card, .term-item').forEach(el => {
        observer.observe(el);
    });

    // Add floating animation to stats
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.animationDelay = `${index * 0.2}s`;
    });
});