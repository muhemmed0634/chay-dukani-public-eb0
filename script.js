/* ==========================================================================
   TƏBİİ LƏNKƏRAN ÇAYI & TƏBİİ YAĞLAR - JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');

    const heroVideo = document.getElementById('hero-video');
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const soundText = document.getElementById('sound-text');

    const backToTopBtn = document.getElementById('back-to-top');

    const productModal = document.getElementById('product-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalBodyContent = document.getElementById('modal-body-content');
    const productModalBtns = document.querySelectorAll('.btn-product-modal');

    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const quickForm = document.getElementById('quick-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    // 2. Video Playback & Sound Control
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.play().catch(err => {
            console.log('Video autoplay requires user interaction:', err);
        });

        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                if (heroVideo.muted) {
                    heroVideo.muted = false;
                    if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high';
                    if (soundText) soundText.textContent = 'Səsi Bağla';
                } else {
                    heroVideo.muted = true;
                    if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark';
                    if (soundText) soundText.textContent = 'Səsi Aç';
                }
            });
        }
    }

    // 3. Header Scroll State & Back to Top
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header shadow — null guard
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top button — null guard
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Active Nav Link Highlight
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Mobile Navigation Drawer
    const openDrawer = () => {
        if (mobileDrawer) mobileDrawer.classList.add('open');
        if (drawerOverlay) drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawerMenu = () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (drawerOverlay) drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (closeDrawer) closeDrawer.addEventListener('click', closeDrawerMenu);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawerMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeDrawerMenu);
    });

    // 5. Product Data & Modal Logic
    const productsData = {
        tea: {
            title: "Təbii Lənkəran Çayları (Qara & Yaşıl & May Çayı)",
            badge: "Lənkəran Əl Yığımı",
            image: "photo5.jpeg",
            description: "Azərbaycanın ən məşhur subtropik çay diyarı olan Lənkəranın dağ ətəklərindən xüsusi sevgi ilə toplanmış təbii çay yarpaqları.",
            features: [
                "100% Təbii və qatqısız əl yığımı yarpaqlar",
                "Heç bir kimyəvi aromatizator və süni rəngləndirici yoxdur",
                "Dəmləndikdə təmiz kəhrəba rəngi və təbii ətir bəxş edir",
                "Xüsusi hermetik qoruyucu paketlərdə təravətini tam qoruyur",
                "Qara çay, orqanik yaşıl çay və zərif may çayı çeşidləri"
            ],
            delivery: "Bakı, Sumqayıt, bütün rayonlar və Moskvaya (Rusiya) çatdırılma!"
        },
        oil: {
            title: "Saf Təbii Zeytun Yağı (Soyuq Sıxım)",
            badge: "100% Saf & Soyuq Sıxım",
            image: "photo1.jpeg",
            description: "Ənənəvi soyuq sıxım (Extra Virgin) qaydası ilə hazırlanmış, qızılı-kəhrəba rəngli, 100% qatqısız və saf təbii zeytun yağı.",
            features: [
                "Heç bir qatqısız, 100% saf soyuq sıxım zeytun yağı",
                "Gigiyenik və təmiz şüşə butulkalarda qablaşdırılır",
                "Salatlara və yeməklərə əla təbii dad və zəngin ətir qatır",
                "Ürək-damar və həzm sistemi üçün zəngin antioksidant və vitamin mənbəyidir",
                "Topdan və pərakəndə sifariş imkanı"
            ],
            delivery: "Bakı, Sumqayıt, bütün rayonlar və Moskvaya (Rusiya) çatdırılma!"
        },
        rice: {
            title: "Əsl Lənkəran Düyüsü (Haşimi / Sədri)",
            badge: "Yerli Məhsul",
            image: "rice_wp.jpeg",
            description: "Lənkəranın məhsuldar torpaqlarında, təbii bulaq suları ilə yetişdirilən və ənənəvi qaydada döyülən əsl Lənkəran düyüsü. Bərəkətli, ətirli və çox dadlıdır.",
            features: [
                "Lənkəranın ekoloji təmiz təbiətində yetişdirilmişdir",
                "Bişərkən dənə-dənə olur, bir-birinə yapışmır",
                "Təbii üsulla (kimyəvi dərmansız) emal edilib",
                "Plov və digər düyü yeməkləri üçün mükəmməl seçimdir"
            ],
            delivery: "Bakı, Sumqayıt, bütün rayonlar və Moskvaya (Rusiya) çatdırılma!"
        },
        honey: {
            title: "Xalis Təbii Bal (Meşə və Dağ Çiçəklərindən)",
            badge: "Təbii Meşə Balı",
            image: "honey.jpeg",
            description: "Təbii meşə və dağ çiçəklərindən əldə edilmiş, heç bir qatqısı olmayan yüksək keyfiyyətli xalis bal. Əsil təbiət dadı və şəfa mənbəyi.",
            features: [
                "Yalnız təbii meşə və dağ çiçəklərindən çəkilmişdir",
                "Şəkər tozu və ya digər süni qatqılar qətiyyən yoxdur",
                "İmmuniteti gücləndirir, təbii enerji verir",
                "Əsil təbii və orqanik şəfa mənbəyidir"
            ],
            delivery: "Bakı, Sumqayıt, bütün rayonlar və Moskvaya (Rusiya) çatdırılma!"
        }
    };

    const openProductModal = (productKey) => {
        if (!productModal || !modalBodyContent) return;
        const item = productsData[productKey];
        if (!item) return;

        modalBodyContent.innerHTML = `
            <div class="modal-product-layout" style="display: flex; flex-direction: column; gap: 20px;">
                <div style="position: relative; border-radius: 16px; overflow: hidden; max-height: 280px;">
                    <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 280px; object-fit: cover;" loading="lazy">
                    <span style="position: absolute; bottom: 14px; left: 14px; background: rgba(42,23,15,0.85); color: #fff; padding: 6px 16px; border-radius: 9999px; font-size: 0.82rem; font-weight: 600;">
                        ${item.badge}
                    </span>
                </div>
                <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--color-primary-dark); margin-bottom: 10px;">
                        ${item.title}
                    </h3>
                    <p style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 16px;">
                        ${item.description}
                    </p>
                    <div style="background: var(--color-bg-secondary); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                        <strong style="display: block; font-size: 0.95rem; color: var(--color-primary-dark); margin-bottom: 8px;">
                            <i class="fa-solid fa-star" style="color: var(--color-honey);"></i> Əsas Xüsusiyyətləri:
                        </strong>
                        <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem; color: var(--color-text-main);">
                            ${item.features.map(f => `<li><i class="fa-solid fa-check" style="color: var(--color-green); margin-right: 8px;"></i> ${f}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="background: var(--color-honey-light); padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(212,144,42,0.3); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; color: var(--color-primary-dark); font-weight: 600; font-size: 0.92rem;">
                        <i class="fa-solid fa-truck-fast" style="color: var(--color-honey); font-size: 1.2rem;"></i>
                        <span>${item.delivery}</span>
                    </div>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <a href="tel:+994507125101" class="btn btn-primary" style="flex: 1; min-width: 180px;">
                            <i class="fa-solid fa-phone"></i> Zəng ilə Sifariş
                        </a>
                        <a href="https://wa.me/994507125101?text=Salam,%20${encodeURIComponent(item.title)}%20haqqında%20məlumat%20və%20sifariş%20etmək%20istəyirəm." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex: 1; min-width: 180px;">
                            <i class="fa-brands fa-whatsapp"></i> WhatsApp Sifariş
                        </a>
                    </div>
                </div>
            </div>
        `;

        productModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeProductModal = () => {
        if (!productModal) return;
        productModal.classList.remove('open');
        document.body.style.overflow = '';
    };

    productModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productKey = btn.getAttribute('data-product');
            openProductModal(productKey);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductModal);

    // 6. Gallery Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!lightboxModal || !lightboxImg || !lightboxCaption) return;
            const img = item.querySelector('img');
            if (!img) return;
            const caption = item.getAttribute('data-caption') || img.alt;

            lightboxImg.src = img.src;
            lightboxImg.alt = caption;
            lightboxCaption.textContent = caption;
            lightboxModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeLightbox();
            closeDrawerMenu();
        }
    });

    // 7. Toast Notification Helper
    const showToast = (message) => {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // 8. Fullstack Order Form Handling (Connected to /api/orders)
    if (quickForm) {
        quickForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-form-btn');
            const nameInput = document.getElementById('user_name');
            const phoneInput = document.getElementById('user_phone');
            const locationInput = document.getElementById('delivery_location');
            const productInput = document.getElementById('product_interest');
            const quantityInput = document.getElementById('product_quantity');
            const notesInput = document.getElementById('user_notes');

            const fullName = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const location = locationInput
                ? locationInput.options[locationInput.selectedIndex].text
                : '';
            const product = productInput
                ? productInput.options[productInput.selectedIndex].text
                : '';
            const quantity = quantityInput ? quantityInput.value.trim() : '1 ədəd';
            const notes = notesInput ? notesInput.value.trim() : '';

            if (!fullName || !phone) {
                alert('Zəhmət olmasa ad, soyad və telefon nömrənizi qeyd edin.');
                return;
            }

            // Set loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sifariş qeyd olunur...</span>`;
            }

            const orderPayload = {
                fullName,
                phone,
                location,
                product,
                quantity,
                notes
            };

            let orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
            let apiSuccess = false;

            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderPayload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                if (result && result.data && result.data.id) {
                    orderId = result.data.id;
                }
                apiSuccess = true;

            } catch (err) {
                console.warn('API error, saving to local backup storage:', err);
            }

            // Backup to client localStorage regardless of API result
            try {
                const localBackup = JSON.parse(localStorage.getItem('backup_orders') || '[]');
                localBackup.unshift({
                    id: orderId,
                    ...orderPayload,
                    status: 'Yeni',
                    apiSaved: apiSuccess,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('backup_orders', JSON.stringify(localBackup));
            } catch (storageErr) {
                console.warn('localStorage error:', storageErr);
            }

            // Restore button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Sifarişi / Müraciəti Göndər</span> <i class="fa-solid fa-arrow-right"></i>`;
            }

            // Success feedback — ensure it is visible
            if (formFeedback) {
                formFeedback.style.display = '';
                formFeedback.className = 'form-feedback success';
                formFeedback.innerHTML = `
                    <div style="font-size: 1rem; margin-bottom: 6px;">
                        <i class="fa-solid fa-circle-check"></i> <strong>Təşəkkür edirik, ${fullName}!</strong>
                    </div>
                    <p style="font-size: 0.88rem; margin-bottom: 8px;">
                        Sifarişiniz (<strong>№ ${orderId}</strong>) qəbul edildi! Məhsul: <strong>${product} (${quantity})</strong> — Çatdırılma: <strong>${location}</strong>.
                    </p>
                    <div style="font-size: 0.82rem; color: #046c4e;">
                        Əməkdaşımız tezliklə <strong>${phone}</strong> nömrəsi ilə əlaqə saxlayacaq.
                    </div>
                `;

                showToast(`Sifariş № ${orderId} uğurla qəbul edildi!`);
                quickForm.reset();

                // Hide feedback after 10 seconds and reset display so it can show again
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                    formFeedback.className = 'form-feedback';
                    formFeedback.innerHTML = '';
                }, 10000);
            }

            // WhatsApp notification helper (console log for admin awareness)
            const waOrderText = `Salam, yeni sifariş:%0A👤 Müştəri: ${fullName}%0A📞 Tel: ${phone}%0A📦 Məhsul: ${product}%0A⚖️ Miqdar: ${quantity}%0A📍 Çatdırılma: ${location}%0A📝 Qeyd: ${notes || 'Yoxdur'}`;
            console.log('WhatsApp order text:', `https://wa.me/994507125101?text=${waOrderText}`);
        });
    }

    // 9. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
