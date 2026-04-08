/**
 * WhatsApp Chat Widget - Techno Vision Advanced Version
 * Features: RTL, Quick Replies, Event Tracking, XSS Safe, Mobile Bottom Sheet
 * Version: 3.0
 * Author: Techno Vision Solutions
 */

(function() {
    'use strict';

    // ----------------------------- 1. الإعدادات الافتراضية -----------------------------
    const DEFAULTS = {
        enabled: true,
        chatButtonSetting: {
            backgroundColor: '#25D366',
            borderRadius: '50',
            ctaText: 'تواصل معنا',
            marginLeft: '0',
            marginRight: '20',
            marginBottom: '20',
            position: 'right',      // 'right' or 'left'
            iconUrl: null,          // أيقونة مخصصة (رابط SVG أو صورة)
            iconSize: '56px'
        },
        brandSetting: {
            brandName: 'خدمة العملاء',
            brandSubTitle: 'متصل الآن',
            brandImg: 'https://cdn.clare.ai/wati/images/WATI_logo_square_2.png',
            welcomeText: 'مرحباً بك! 👋<br>كيف يمكننا مساعدتك؟',
            messageText: 'مرحباً، لدي استفسار.',
            phoneNumber: '',
            ctaText: 'ابدأ المحادثة',
            autoShow: false,            // ظهور تلقائي بعد مدة
            autoShowDelay: 2000,        // المدة بالمللي ثانية
            showOnExit: false,          // ظهور عند محاولة مغادرة الصفحة
            quickReplies: [],           // أزرار سريعة: [{text: "طلب سعر", message: "أريد معرفة السعر"}]
            rememberClose: true,        // تذكر إغلاق المستخدم لمدة الجلسة
            direction: 'rtl'            // 'rtl' or 'ltr'
        }
    };

    // ----------------------------- 2. دوال مساعدة (أمان، دمج، إلخ) -----------------------------
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
            return c;
        });
    }

    // دمج عميق (deep merge) لكائنات الإعدادات
    function mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) Object.assign(output, { [key]: source[key] });
                    else output[key] = mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }
    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    // تنقية النصوص الديناميكية للرسالة (رابط، عنوان الصفحة)
    function processMessageText(text, pageLink, pageTitle) {
        if (!text) return '';
        let result = text;
        result = result.replace(/\{\{page_link\}\}/g, encodeURIComponent(pageLink));
        result = result.replace(/__page_link__/g, encodeURIComponent(pageLink));
        result = result.replace(/\{\{page_title\}\}/g, pageTitle);
        result = result.replace(/__page_title__/g, pageTitle);
        result = result.replace(/\n/g, '%0A');
        return result;
    }

    // تتبع الأحداث (Google Analytics / Facebook Pixel)
    function trackEvent(eventName, params = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, params);
        }
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', eventName, params);
        }
        console.log(`[WhatsApp Widget] Event: ${eventName}`, params);
    }

    // ----------------------------- 3. بناء HTML للودجت -----------------------------
    function buildWidgetHTML(config) {
        const btnPos = config.chatButtonSetting.position;
        const isRTL = config.brandSetting.direction === 'rtl';
        const iconStyle = `width: ${config.chatButtonSetting.iconSize}; height: ${config.chatButtonSetting.iconSize};`;
        
        // الأيقونة (افتراضية أو مخصصة)
        let iconSvg = `<svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.7881 4.06584C21.1709 1.44525 17.69 0.00132957 13.9811 0C6.33875 0 0.118997 6.21909 0.116338 13.8635C0.115008 16.3072 0.75387 18.6925 1.96711 20.7946L0 27.9796L7.34989 26.0517C9.37482 27.1566 11.655 27.7383 13.9752 27.739H13.9811C21.6222 27.739 27.8427 21.5192 27.8453 13.8748C27.8466 10.17 26.406 6.6871 23.7881 4.06651V4.06584Z" fill="white"/>
            <path d="M20.3019 16.7673C19.9556 16.5938 18.2524 15.7561 17.9346 15.6405C17.6169 15.5248 17.3862 15.467 17.1555 15.814C16.9248 16.161 16.2607 16.9415 16.0586 17.1721C15.8565 17.4035 15.6544 17.4321 15.308 17.2585C14.9617 17.085 13.8455 16.7194 12.522 15.5394C11.4922 14.6206 10.7968 13.4866 10.5948 13.1395C10.3926 12.7925 10.5735 12.605 10.7463 12.4329C10.9018 12.2773 11.0926 12.028 11.2661 11.8259C11.4397 11.6238 11.4969 11.4789 11.6125 11.2482C11.7282 11.0168 11.6704 10.8148 11.584 10.6412C11.4975 10.4677 10.8048 8.76253 10.5156 8.06918C10.2344 7.39377 9.94858 7.48551 9.7365 7.47421C9.53439 7.46424 9.30373 7.46225 9.07239 7.46225C8.84104 7.46225 8.46605 7.54867 8.14831 7.89569C7.83056 8.24267 6.93573 9.08097 6.93573 10.7855C6.93573 12.49 8.17693 14.1381 8.35042 14.3694C8.52391 14.6008 10.7935 18.0995 14.2683 19.6006C15.0947 19.9576 15.7402 20.171 16.2434 20.3306C17.0731 20.5945 17.8283 20.5573 18.4252 20.4682C19.0907 20.3685 20.4748 19.6299 20.7633 18.8208C21.0518 18.0117 21.0518 17.3177 20.9654 17.1734C20.879 17.0292 20.6477 16.9421 20.3013 16.7686Z" fill="white"/>
        </svg>`;
        if (config.chatButtonSetting.iconUrl) {
            iconSvg = `<img src="${escapeHtml(config.chatButtonSetting.iconUrl)}" style="${iconStyle}" alt="WhatsApp">`;
        }

        // الوقت الحالي للفقاعة
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // بناء أزرار الردود السريعة
        let quickRepliesHtml = '';
        if (config.brandSetting.quickReplies && config.brandSetting.quickReplies.length) {
            const btns = config.brandSetting.quickReplies.map(q => {
                const safeText = escapeHtml(q.text);
                const safeMsg = escapeHtml(q.message).replace(/\n/g, '%0A');
                return `<button class="tv-wa-quick-reply" data-msg="${safeMsg}">${safeText}</button>`;
            }).join('');
            quickRepliesHtml = `<div class="tv-wa-quick-replies" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">${btns}</div>`;
        }

        return `
            <div id="tv-wa-widget" style="position: fixed; bottom: ${config.chatButtonSetting.marginBottom}px; ${btnPos}: ${config.chatButtonSetting.marginRight}px; z-index: 99999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ${isRTL ? 'rtl' : 'ltr'};">
                <!-- الزر العائم -->
                <div class="tv-wa-btn" style="background-color: ${config.chatButtonSetting.backgroundColor}; border-radius: ${config.chatButtonSetting.borderRadius}px; width: ${config.chatButtonSetting.iconSize}; height: ${config.chatButtonSetting.iconSize}; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,0.2); transition: transform 0.2s ease;">
                    ${iconSvg}
                </div>

                <!-- نافذة المحادثة -->
                <div class="tv-wa-chat" style="position: absolute; bottom: 75px; ${btnPos}: 0; width: 350px; max-width: 85vw; background-color: #efeae2; border-radius: 18px; box-shadow: 0 12px 28px rgba(0,0,0,0.2); overflow: hidden; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.25s ease-in-out;">
                    <!-- Header -->
                    <div style="background-color: #008069; color: white; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="position: relative;">
                                <img src="${escapeHtml(config.brandSetting.brandImg)}" alt="Avatar" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2);">
                                <span style="position: absolute; bottom: 2px; right: 2px; width: 10px; height: 10px; background-color: #25D366; border-radius: 50%; border: 2px solid #008069;"></span>
                            </div>
                            <div>
                                <div style="font-weight: 700; font-size: 16px;">${escapeHtml(config.brandSetting.brandName)}</div>
                                <div style="font-size: 12px; color: #d1f4ec;">${escapeHtml(config.brandSetting.brandSubTitle)}</div>
                            </div>
                        </div>
                        <div class="tv-wa-close" style="font-size: 26px; cursor: pointer; opacity: 0.8; line-height: 1;">&times;</div>
                    </div>

                    <!-- Body: الرسائل -->
                    <div style="padding: 20px; background-image: url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408e075d.png'); background-size: cover; min-height: 150px;">
                        <div style="background-color: white; padding: 10px 12px; border-radius: 8px 0 8px 8px; max-width: 85%; box-shadow: 0 1px 1px rgba(0,0,0,0.1); position: relative; margin-bottom: 12px;">
                            <div style="font-size: 13px; color: #027eb5; font-weight: 700; margin-bottom: 4px;">${escapeHtml(config.brandSetting.brandName)}</div>
                            <div style="font-size: 14px; color: #111b21; line-height: 1.5;">${escapeHtml(config.brandSetting.welcomeText).replace(/\n/g, '<br>')}</div>
                            <div style="font-size: 11px; color: #667781; text-align: left; margin-top: 6px;">${timeString}</div>
                            <div style="position: absolute; top: 0; ${isRTL ? 'left' : 'right'}: -8px; width: 0; height: 0; border-top: 10px solid white; border-${isRTL ? 'left' : 'right'}: 10px solid transparent;"></div>
                        </div>
                        ${quickRepliesHtml}
                    </div>

                    <!-- Footer: زر الإجراء الرئيسي -->
                    <div style="padding: 12px 16px; background-color: #f0f2f5; text-align: center; border-top: 1px solid #e9edef;">
                        <a href="#" class="tv-wa-cta" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background-color: #25D366; color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 15px; font-weight: 700; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: background 0.2s;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            ${escapeHtml(config.brandSetting.ctaText)}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // ----------------------------- 4. إضافة الأنماط (مرة واحدة) -----------------------------
    function injectStyles() {
        if (document.getElementById('tv-wa-styles')) return;
        const style = document.createElement('style');
        style.id = 'tv-wa-styles';
        style.textContent = `
            .tv-wa-btn:hover { transform: scale(1.05); }
            .tv-wa-chat.active { opacity: 1 !important; visibility: visible !important; transform: translateY(0) !important; }
            .tv-wa-close:hover { opacity: 1; }
            .tv-wa-quick-reply {
                background-color: #ffffff;
                border: 1px solid #25D366;
                border-radius: 20px;
                padding: 6px 14px;
                font-size: 13px;
                font-weight: 500;
                color: #25D366;
                cursor: pointer;
                transition: all 0.2s;
            }
            .tv-wa-quick-reply:hover {
                background-color: #25D366;
                color: white;
            }
            @media (max-width: 480px) {
                .tv-wa-chat { width: 90vw !important; left: 5vw !important; right: auto !important; bottom: 80px; }
                .tv-wa-btn { width: 52px !important; height: 52px !important; }
            }
        `;
        document.head.appendChild(style);
    }

    // ----------------------------- 5. ربط الأحداث والمنطق التفاعلي -----------------------------
    function attachEvents(widgetElement, config) {
        const btn = widgetElement.querySelector('.tv-wa-btn');
        const chatBox = widgetElement.querySelector('.tv-wa-chat');
        const closeBtn = widgetElement.querySelector('.tv-wa-close');
        const ctaLink = widgetElement.querySelector('.tv-wa-cta');
        const quickReplyBtns = widgetElement.querySelectorAll('.tv-wa-quick-reply');

        // فتح/إغلاق النافذة
        function openChat() {
            if (!chatBox) return;
            chatBox.classList.add('active');
            trackEvent('whatsapp_chat_opened', { page: window.location.href });
        }
        function closeChat() {
            if (chatBox) chatBox.classList.remove('active');
        }

        if (btn) btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (chatBox.classList.contains('active')) closeChat();
            else openChat();
        });
        if (closeBtn) closeBtn.addEventListener('click', closeChat);

        // إغلاق عند النقر خارج الودجت
        document.addEventListener('click', (e) => {
            if (widgetElement && !widgetElement.contains(e.target)) {
                closeChat();
            }
        });

        // زر الإجراء الرئيسي (فتح الواتساب)
        if (ctaLink) {
            ctaLink.addEventListener('click', (e) => {
                e.preventDefault();
                let msg = processMessageText(config.brandSetting.messageText, window.location.href, document.title);
                const url = `https://api.whatsapp.com/send?phone=${config.brandSetting.phoneNumber}&text=${msg}`;
                window.open(url, '_blank');
                trackEvent('whatsapp_cta_click', { phone: config.brandSetting.phoneNumber });
                closeChat();
            });
        }

        // الردود السريعة
        quickReplyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const customMsg = btn.getAttribute('data-msg');
                if (customMsg) {
                    const url = `https://api.whatsapp.com/send?phone=${config.brandSetting.phoneNumber}&text=${encodeURIComponent(customMsg)}`;
                    window.open(url, '_blank');
                    trackEvent('whatsapp_quick_reply', { reply: customMsg });
                    closeChat();
                }
            });
        });
    }

    // ----------------------------- 6. الدالة الرئيسية العامة -----------------------------
    window.CreateWhatsappChatWidget = async function(userOptions = {}) {
        // التحقق من وجود الودجت مسبقاً
        if (document.getElementById('tv-wa-widget')) return;

        // دمج الإعدادات
        const config = mergeDeep(DEFAULTS, userOptions || {});
        if (!config.enabled) return;

        // إذا كان rememberClose مفعلاً وتم إغلاق النافذة مسبقاً في هذه الجلسة
        if (config.brandSetting.rememberClose && sessionStorage.getItem('tv_wa_closed') === 'true') return;

        // معالجة رسالة الترحيب والرسالة المسبقة
        config.brandSetting.messageText = processMessageText(config.brandSetting.messageText, window.location.href, document.title);

        // بناء الـ HTML وإضافته
        const html = buildWidgetHTML(config);
        document.body.insertAdjacentHTML('beforeend', html);
        const widget = document.getElementById('tv-wa-widget');
        if (!widget) return;

        // إضافة الأنماط
        injectStyles();

        // ربط الأحداث
        attachEvents(widget, config);

        // إظهار تلقائي حسب الإعدادات
        if (config.brandSetting.autoShow) {
            setTimeout(() => {
                const chatBox = widget.querySelector('.tv-wa-chat');
                if (chatBox && sessionStorage.getItem('tv_wa_autoShown') !== 'true') {
                    chatBox.classList.add('active');
                    sessionStorage.setItem('tv_wa_autoShown', 'true');
                    trackEvent('whatsapp_auto_shown');
                }
            }, config.brandSetting.autoShowDelay || 2000);
        }

        // إظهار عند محاولة الخروج من الصفحة (Exit Intent)
        if (config.brandSetting.showOnExit) {
            let exitShown = false;
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY <= 0 && !exitShown && !sessionStorage.getItem('tv_wa_exitShown')) {
                    const chatBox = widget.querySelector('.tv-wa-chat');
                    if (chatBox) {
                        chatBox.classList.add('active');
                        exitShown = true;
                        sessionStorage.setItem('tv_wa_exitShown', 'true');
                        trackEvent('whatsapp_exit_intent');
                    }
                }
            });
        }

        // تذكر إغلاق المستخدم (عند النقر على زر الإغلاق)
        const closeBtn = widget.querySelector('.tv-wa-close');
        if (closeBtn && config.brandSetting.rememberClose) {
            closeBtn.addEventListener('click', () => {
                sessionStorage.setItem('tv_wa_closed', 'true');
            });
        }
    };
})();
