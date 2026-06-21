document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if(navMenu.classList.contains('active')){
            icon.classList.remove('bx-menu');
            icon.classList.add('bx-x');
        } else {
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.replace('bx-x', 'bx-menu');
        });
    });

    // Efeito de Zoom interno nas imagens (Adiciona wrapper dinâmico para overflow:hidden)
    document.querySelectorAll('.paper-frame img').forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.className = 'img-zoom-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    });

    // Animação de Scroll Reveal (Surgir ao Rolar)
    const revealElements = document.querySelectorAll('.portfolio-item, .skills-list, .skills-software, .sobre-text, .sobre-image, .section-title, .section-script, .process-card');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => {
        el.classList.add('reveal-item');
        revealOnScroll.observe(el);
    });

    // Portfolio Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'todas' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox Modal Inteligente
    const modal = document.getElementById('dynamic-modal');
    const modalContainer = document.getElementById('modal-container');
    const closeBtn = document.querySelector('.close-modal');
    
    let currentSlides = [];
    let currentSlideIndex = 0;

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            
            modalContainer.innerHTML = ''; // Clear
            
            if (type === 'grafica') {
                const src = item.getAttribute('data-src');
                modalContainer.innerHTML = `
                    <div class="modal-img-container">
                        <img class="modal-content" src="${src}" alt="${title}">
                        <div class="modal-info">
                            <h3>${title}</h3>
                            <p>${desc}</p>
                        </div>
                    </div>
                `;
            } 
            else if (type === 'apresentacao') {
                currentSlides = JSON.parse(item.getAttribute('data-slides'));
                currentSlideIndex = 0;
                
                // Pré-carregamento dos slides (Preload) para não ter delay no celular
                currentSlides.forEach(src => {
                    const img = new Image();
                    img.src = src;
                });
                
                // HTML comentado preparado para iframe futuro
                // <!-- <div class="iframe-container"><iframe src="LINK_AQUI" width="100%" height="100%" frameborder="0" allowfullscreen></iframe></div> -->
                
                modalContainer.innerHTML = `
                    <div class="modal-img-container">
                        <img class="modal-content" id="slide-display" src="${currentSlides[0]}" alt="${title}">
                        <div class="modal-info">
                            <h3>${title}</h3>
                            <p>${desc}</p>
                            <div class="slide-controls">
                                <button class="slide-btn" id="prev-slide"><i class='bx bx-chevron-left'></i></button>
                                <span class="slide-counter"><span id="current-slide-num">1</span> / ${currentSlides.length}</span>
                                <button class="slide-btn" id="next-slide"><i class='bx bx-chevron-right'></i></button>
                            </div>
                        </div>
                    </div>
                `;
                
                document.getElementById('prev-slide').addEventListener('click', () => {
                    if (currentSlideIndex > 0) {
                        currentSlideIndex--;
                        updateSlide();
                    }
                });
                
                document.getElementById('next-slide').addEventListener('click', () => {
                    if (currentSlideIndex < currentSlides.length - 1) {
                        currentSlideIndex++;
                        updateSlide();
                    }
                });
                
                function updateSlide() {
                    document.getElementById('slide-display').src = currentSlides[currentSlideIndex];
                    document.getElementById('current-slide-num').innerText = currentSlideIndex + 1;
                }
            }
            else if (type === 'video') {
                const videoUrl = item.getAttribute('data-video');
                modalContainer.innerHTML = `
                    <div class="modal-video-container" id="video-wrapper">
                        <video id="portfolio-video" controls autoplay>
                            <source src="${videoUrl}" type="video/mp4">
                            Seu navegador não suporta vídeos.
                        </video>
                        <div class="modal-info">
                            <h3>${title}</h3>
                            <p>${desc}</p>
                        </div>
                    </div>
                `;
                
                const videoElement = document.getElementById('portfolio-video');
                const videoWrapper = document.getElementById('video-wrapper');
                
                videoElement.addEventListener('loadedmetadata', () => {
                    // Detecção Inteligente de Proporção
                    if (videoElement.videoHeight > videoElement.videoWidth) {
                        videoWrapper.classList.add('is-vertical');
                    }
                });
            }
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Pausar vídeo ao fechar
        const videoElement = document.getElementById('portfolio-video');
        if (videoElement) {
            videoElement.pause();
        }
        
        // Limpar conteúdo após animação
        setTimeout(() => { modalContainer.innerHTML = ''; }, 300);
    };

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Option 5: Custom Cursor Magnético
    const cursor = document.querySelector('.custom-cursor');
    const clickableElements = document.querySelectorAll('a, button, .portfolio-item, .filter-btn, .close-modal, .play-overlay');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        clickableElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });
    }
});
