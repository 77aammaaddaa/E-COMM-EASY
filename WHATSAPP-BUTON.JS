/**
 * WhatsApp Chat Widget - Realistic UI (Mobile Optimized)
 * Version: 2.0
 * Author: Techno Vision
 * Host: GitHub
 */
(function() {
    window.CreateWhatsappChatWidget = async function(option = {}) {
        if (option.enabled === false) return;

        // الإعدادات الافتراضية (تضمن عدم تعطل الكود)
        const defaultOption = {
            brandSetting: {
                autoShow: false,
                backgroundColor: '#25D366',
                brandImg: 'https://cdn.clare.ai/wati/images/WATI_logo_square_2.png',
                brandName: 'خدمة العملاء',
                brandSubTitle: 'متصل الآن',
                ctaText: 'ابدأ المحادثة',
                welcomeText: 'مرحباً بك! 👋<br>كيف يمكننا مساعدتك اليوم؟',
                messageText: 'مرحباً، لدي استفسار.',
                phoneNumber: ''
            },
            chatButtonSetting: {
                backgroundColor: '#25D366',
                borderRadius: '50',
                ctaText: 'تواصل معنا',
                marginLeft: '0',
                marginRight: '20',
                marginBottom: '20',
                position: 'right'
            }
        };

        // دمج الإعدادات بأمان
        const safeBrand = option.brandSetting || {};
        const safeButton = option.chatButtonSetting || {};
        const config = {
            brandSetting: { ...defaultOption.brandSetting, ...safeBrand },
            chatButtonSetting: { ...defaultOption.chatButtonSetting, ...safeButton }
        };

        // معالجة النصوص الديناميكية (رابط الصفحة، عنوان الصفحة)
        let msg = config.brandSetting.messageText || '';
        msg = msg.replace(/{{page_link}}/g, encodeURIComponent(window.location.href))
                 .replace(/__page_link__/g, encodeURIComponent(window.location.href))
                 .replace(/{{page_title}}/g, window.document.title)
                 .replace(/__page_title__/g, window.document.title)
                 .replace(/\n/g, '%0A');
        config.brandSetting.messageText = msg;

        // الوقت الحالي لعرض الرسالة
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // SVG أيقونة الواتساب (مضبوطة الحجم)
        const whatsappIcon = `<svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.7881 4.06584C21.1709 1.44525 17.69 0.00132957 13.9811 0C6.33875 0 0.118997 6.21909 0.116338 13.8635C0.115008 16.3072 0.75387 18.6925 1.96711 20.7946L0 27.9796L7.34989 26.0517C9.37482 27.1566 11.655 27.7383 13.9752 27.739H13.9811C21.6222 27.739 27.8427 21.5192 27.8453 13.8748C27.8466 10.17 26.406 6.6871 23.7881 4.06651V4.06584ZM13.9811 25.3975H13.9765C11.909 25.3969 9.88075 24.8411 8.1111 23.7914L7.69027 23.5415L3.3286 24.6856L4.49264 20.4329L4.21874 19.9968C3.06533 18.162 2.45572 16.0413 2.45705 13.8642C2.45971 7.51078 7.6291 2.34138 13.9858 2.34138C17.0638 2.34271 19.957 3.54266 22.1328 5.72117C24.3086 7.89902 25.5059 10.7949 25.5046 13.8735C25.5019 20.2275 20.3326 25.3969 13.9811 25.3969V25.3975ZM20.3019 16.7673C19.9556 16.5938 18.2524 15.7561 17.9346 15.6405C17.6169 15.5248 17.3862 15.467 17.1555 15.814C16.9248 16.161 16.2607 16.9415 16.0586 17.1721C15.8565 17.4035 15.6544 17.4321 15.308 17.2585C14.9617 17.085 13.8455 16.7194 12.522 15.5394C11.4922 14.6206 10.7968 13.4866 10.5948 13.1395C10.3926 12.7925 10.5735 12.605 10.7463 12.4329C10.9018 12.2773 11.0926 12.028 11.2661 11.8259C11.4397 11.6238 11.4969 11.4789 11.6125 11.2482C11.7282 11.0168 11.6704 10.8148 11.584 10.6412C11.4975 10.4677 10.8048 8.76253 10.5156 8.06918C10.2344 7.39377 9.94858 7.48551 9.7365 7.47421C9.53439 7.46424 9.30373 7.46225 9.07239 7.46225C8.84104 7.46225 8.46605 7.54867 8.14831 7.89569C7.83056 8.24267 6.93573 9.08097 6.93573 10.7855C6.93573 12.49 8.17693 14.1381 8.35042 14.3694C8.52391 14.6008 10.7935 18.0995 14.2683 19.6006C15.0947 19.9576 15.7402 20.171 16.2434 20.3306C17.0731 20.5945 17.8283 20.5573 18.4252 20.4682C19.0907 20.3685 20.4748 19.6299 20.7633 18.8208C21.0518 18.0117 21.0518 17.3177 20.9654 17.1734C20.879 17.0292 20.6477 16.9421 20.3013 16.7686Z" fill="white"/>
        </svg>`;

        // هيكل HTML للنافذة والزر
        const widgetHTML = `
            <div id="tv-wa-widget" style="position: fixed; bottom: ${config.chatButtonSetting.marginBottom}px; ${config.chatButtonSetting.position === 'left' ? `left: ${config.chatButtonSetting.marginLeft}px;` : `right: ${config.chatButtonSetting.marginRight}px;`} z-index: 99999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <!-- الزر العائم -->
                <div class="tv-wa-btn" style="background-color: ${config.chatButtonSetting.backgroundColor}; border-radius: ${config.chatButtonSetting.borderRadius}px; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,0.2); transition: transform 0.2s ease;">
                    ${whatsappIcon}
                </div>

                <!-- نافذة المحادثة (مخفية في البداية) -->
                <div class="tv-wa-chat" style="position: absolute; bottom: 70px; ${config.chatButtonSetting.position === 'left' ? 'left: 0;' : 'right: 0;'} width: 350px; max-width: 85vw; background-color: #efeae2; border-radius: 18px; box-shadow: 0 12px 28px rgba(0,0,0,0.2); overflow: hidden; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.25s ease-in-out; direction: rtl;">
                    
                    <!-- Header (مثل واتساب) -->
                    <div style="background-color: #008069; color: white; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="position: relative;">
                                <img src="${config.brandSetting.brandImg}" alt="Avatar" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2);">
                                <span style="position: absolute; bottom: 2px; right: 2px; width: 10px; height: 10px; background-color: #25D366; border-radius: 50%; border: 2px solid #008069;"></span>
                            </div>
                            <div>
                                <div style="font-weight: 700; font-size: 16px;">${config.brandSetting.brandName}</div>
                                <div style="font-size: 12px; color: #d1f4ec;">${config.brandSetting.brandSubTitle}</div>
                            </div>
                        </div>
                        <div class="tv-wa-close" style="font-size: 26px; cursor: pointer; opacity: 0.8; line-height: 1;">&times;</div>
                    </div>

                    <!-- Body: منطقة الرسائل -->
                    <div style="padding: 20px; background-image: url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408e075d.png'); background-size: cover; min-height: 150px;">
                        <!-- فقاعة الترحيب -->
                        <div style="background-color: white; padding: 10px 12px; border-radius: 8px 0 8px 8px; max-width: 85%; box-shadow: 0 1px 1px rgba(0,0,0,0.1); position: relative; margin-bottom: 12px;">
                            <div style="font-size: 13px; color: #027eb5; font-weight: 700; margin-bottom: 4px;">${config.brandSetting.brandName}</div>
                            <div style="font-size: 14px; color: #111b21; line-height: 1.5;">${config.brandSetting.welcomeText}</div>
                            <div style="font-size: 11px; color: #667781; text-align: left; margin-top: 6px;">${timeString}</div>
                            <!-- ذيل الفقاعة -->
                            <div style="position: absolute; top: 0; right: -8px; width: 0; height: 0; border-top: 10px solid white; border-right: 10px solid transparent;"></div>
                        </div>
                    </div>

                    <!-- Footer: زر بدء المحادثة -->
                    <div style="padding: 12px 16px; background-color: #f0f2f5; text-align: center; border-top: 1px solid #e9edef;">
                        <a href="https://api.whatsapp.com/send?phone=${config.brandSetting.phoneNumber}&text=${config.brandSetting.messageText}" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background-color: #25D366; color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 15px; font-weight: 700; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: background 0.2s;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            ${config.brandSetting.ctaText}
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // إضافة بعض التنسيقات التكميلية
        const style = document.createElement('style');
        style.textContent = `
            .tv-wa-btn:hover { transform: scale(1.05); }
            .tv-wa-chat.active { opacity: 1 !important; visibility: visible !important; transform: translateY(0) !important; }
            .tv-wa-close:hover { opacity: 1; }
            @media (max-width: 480px) {
                .tv-wa-chat { width: 90vw !important; left: 5vw !important; right: auto !important; bottom: 80px; }
                .tv-wa-btn { width: 52px !important; height: 52px !important; }
            }
        `;
        document.head.appendChild(style);

        // منطق إظهار وإخفاء النافذة
        const btn = document.querySelector('.tv-wa-btn');
        const chatBox = document.querySelector('.tv-wa-chat');
        const closeBtn = document.querySelector('.tv-wa-close');

        if (btn && chatBox && closeBtn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                chatBox.classList.toggle('active');
            });
            closeBtn.addEventListener('click', () => {
                chatBox.classList.remove('active');
            });
            // إغلاق النافذة عند النقر خارجها (اختياري)
            document.addEventListener('click', (e) => {
                if (!chatBox.contains(e.target) && !btn.contains(e.target)) {
                    chatBox.classList.remove('active');
                }
            });
        }

        // إظهار تلقائي إذا كان autoShow مفعلاً
        if (config.brandSetting.autoShow) {
            setTimeout(() => {
                if (chatBox) chatBox.classList.add('active');
            }, 1500);
        }
    };
})();
