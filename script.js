// Global state for carousel
let currentImageIndex = 0;
const totalImages = 6;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupDropdownMenu();
    setupCarousel();
    setupImageZoom();
    setupSmoothScroll();
    setupButtonHandlers();
    setupFaqAccordion();
    setupDatasheetModal();
    setupQuoteModal();
});

// ========== DROPDOWN MENU ==========
function setupDropdownMenu() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (!dropdownToggle) return;

    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
        dropdownToggle.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdownMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
        }
    });

    // Close dropdown when a dropdown item is clicked
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
        });
    });
}

// ========== CAROUSEL FUNCTIONALITY ==========
function setupCarousel() {
    const prevButton = document.querySelector('.carousel-arrow.prev-arrow');
    const nextButton = document.querySelector('.carousel-arrow.next-arrow');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (!prevButton || !nextButton) return;

    // Previous button
    prevButton.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    });

    // Next button
    nextButton.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateCarousel();
    });

    // Thumbnail clicks
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            currentImageIndex = index;
            updateCarousel();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
            updateCarousel();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % totalImages;
            updateCarousel();
        }
    });
}

function updateCarousel() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Update thumbnail active state
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });

    // Change main image (you can add different images later)
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        // For now, we'll just update the alt text
        const img = mainImage.querySelector('img');
        if (img) {
            img.alt = `Product Image ${currentImageIndex + 1}`;
        }
    }
}

// ========== SMOOTH SCROLL ==========
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ========== BUTTON HANDLERS ==========
function setupButtonHandlers() {
    const contactBtn = document.querySelector('.btn-contact');
    const quoteBtn = document.querySelector('.btn-quote');
    const specsBtn = document.querySelector('.btn-specs');
    const requestQuoteBtn = document.querySelector('.btn-request-quote');
    const catalogueForm = document.querySelector('.catalogue-form');

    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            showNotification('Contact form will be displayed here');
        });
    }

    if (quoteBtn) {
        quoteBtn.addEventListener('click', function() {
            showNotification('Get Custom Quote - Form will be displayed here');
        });
    }

    if (specsBtn) {
        specsBtn.addEventListener('click', function() {
            showNotification('Technical Specifications - Modal will be displayed here');
        });
    }

    if (requestQuoteBtn) {
        requestQuoteBtn.setAttribute('type', 'button');
    }

    if (catalogueForm) {
        catalogueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Catalogue request submitted successfully');
        });
    }
}

function setupImageZoom() {
    const imageWrap = document.getElementById('mainImage');
    const image = imageWrap ? imageWrap.querySelector('img') : null;
    const toggleButton = imageWrap ? imageWrap.querySelector('.carousel-zoom-toggle') : null;
    const preview = document.querySelector('.carousel-zoom-preview');
    const previewImage = document.querySelector('.carousel-zoom-preview-image');

    if (!imageWrap || !image || !toggleButton || !preview || !previewImage) return;

    let isZoomed = false;

    function updatePreviewPosition(clientX, clientY) {
        const rect = imageWrap.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        const safeX = Math.max(0, Math.min(100, x));
        const safeY = Math.max(0, Math.min(100, y));

        previewImage.style.backgroundPosition = `${safeX}% ${safeY}%`;
    }

    function openZoom(clientX, clientY) {
        isZoomed = true;
        imageWrap.classList.add('is-zoomed');
        preview.classList.add('is-visible');
        preview.setAttribute('aria-hidden', 'false');
        toggleButton.setAttribute('aria-label', 'Zoom out image');
        previewImage.style.backgroundImage = `url('${image.getAttribute('src')}')`;

        if (typeof clientX === 'number' && typeof clientY === 'number') {
            updatePreviewPosition(clientX, clientY);
        } else {
            previewImage.style.backgroundPosition = 'center';
        }
    }

    function closeZoom() {
        isZoomed = false;
        imageWrap.classList.remove('is-zoomed');
        preview.classList.remove('is-visible');
        preview.setAttribute('aria-hidden', 'true');
        toggleButton.setAttribute('aria-label', 'Zoom in image');
    }

    imageWrap.addEventListener('click', function(e) {
        if (e.target === toggleButton || toggleButton.contains(e.target)) return;

        if (isZoomed) {
            closeZoom();
        } else {
            openZoom(e.clientX, e.clientY);
        }
    });

    toggleButton.addEventListener('click', function(e) {
        e.stopPropagation();

        if (isZoomed) {
            closeZoom();
        } else {
            const rect = imageWrap.getBoundingClientRect();
            openZoom(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    });

    imageWrap.addEventListener('mousemove', function(e) {
        if (!isZoomed) return;
        updatePreviewPosition(e.clientX, e.clientY);
    });

    imageWrap.addEventListener('mouseleave', function() {
        if (!isZoomed) return;
        previewImage.style.backgroundPosition = 'center';
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isZoomed) {
            closeZoom();
        }
    });
}

// ========== DATASHEET MODAL ==========
function setupDatasheetModal() {
    const openButton = document.querySelector('.btn-datasheet');
    const modalOverlay = document.getElementById('datasheetModal');
    const closeButton = document.querySelector('.datasheet-modal-close');
    const modalForm = document.querySelector('.datasheet-modal-form');
    const emailInput = document.getElementById('datasheetEmail');

    if (!openButton || !modalOverlay || !closeButton || !modalForm) return;

    function openModal() {
        modalOverlay.classList.add('is-open');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (emailInput) {
            window.setTimeout(() => emailInput.focus(), 120);
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('is-open');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        openButton.focus();
    }

    openButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    modalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        closeModal();
        showNotification('Brochure download request submitted successfully');
        modalForm.reset();
    });
}

function setupQuoteModal() {
    const openButton = document.querySelector('.btn-request-quote');
    const modalOverlay = document.getElementById('quoteModal');
    const closeButton = document.querySelector('.quote-modal-close');
    const modalForm = document.querySelector('.quote-modal-form');
    const nameInput = document.getElementById('quoteFullName');

    if (!openButton || !modalOverlay || !closeButton || !modalForm) return;

    function openModal() {
        modalOverlay.classList.add('is-open');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (nameInput) {
            window.setTimeout(() => nameInput.focus(), 120);
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('is-open');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        openButton.focus();
    }

    openButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    modalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        closeModal();
        showNotification('Callback request submitted successfully');
        modalForm.reset();
    });
}

// ========== FAQ ACCORDION ==========
function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!button || !answer) return;

        if (item.classList.contains('active')) {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
            button.setAttribute('aria-expanded', 'true');
        } else {
            answer.style.maxHeight = '0px';
            button.setAttribute('aria-expanded', 'false');
        }

        button.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');

            faqItems.forEach(faqItem => {
                const faqButton = faqItem.querySelector('.faq-question');
                const faqAnswer = faqItem.querySelector('.faq-answer');

                faqItem.classList.remove('active');

                if (faqButton) {
                    faqButton.setAttribute('aria-expanded', 'false');
                }

                if (faqAnswer) {
                    faqAnswer.style.maxHeight = '0px';
                }
            });

            if (!isOpen) {
                item.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });
}

// ========== NOTIFICATION HELPER ==========
function showNotification(message) {
    // You can replace this with a modal or notification system later
    console.log(message);
    alert(message);
}
