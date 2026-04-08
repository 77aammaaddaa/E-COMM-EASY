/**
 * WhatsApp Chat Widget - Generic Module
 * استدعِ هذه الدالة بعد تحميل الملف مع إعداداتك الخاصة
 */
(function() {
    window.CreateWhatsappChatWidget = async function(option) {
        if (!option.enabled) return;

        // إعدادات افتراضية
        const defaultOption = {
            brandSetting: {
                autoShow: false,
                backgroundColor: '#0a6114',
                borderRadius: '25',
                brandImg: 'https://cdn.clare.ai/wati/images/WATI_logo_square_2.png',
                brandName: 'Store',
                brandSubTitle: '',
                ctaText: 'Chat with us',
                welcomeText: 'Hello! How can I help you?',
                messageText: 'I have a question.',
                phoneNumber: ''
            },
            chatButtonSetting: {
                backgroundColor: '#00E785',
                borderRadius: '25',
                ctaText: 'Chat with us',
                ctaIconWATI: false,
                marginLeft: '0',
                marginRight: '20',
                marginBottom: '20',
                position: 'right'
            }
        };

        // دمج الإعدادات المرسلة مع الافتراضية
        option = {
            brandSetting: { ...defaultOption.brandSetting, ...option.brandSetting },
            chatButtonSetting: { ...defaultOption.chatButtonSetting, ...option.chatButtonSetting },
            enabled: option.enabled
        };

        if (!option.chatButtonSetting.position) {
            option.chatButtonSetting.position = 'right';
            option.chatButtonSetting.marginBottom = '50';
            option.chatButtonSetting.marginLeft = '0';
            option.chatButtonSetting.marginRight = '20';
        }

        // معالجة النصوص
        if (option.brandSetting.messageText) {
            option.brandSetting.messageText = option.brandSetting.messageText
                .replace(/{{page_link}}/g, encodeURIComponent(window.location.href))
                .replace(/__page_link__/g, encodeURIComponent(window.location.href))
                .replace(/{{page_title}}/g, window.document.title)
                .replace(/__page_title__/g, window.document.title)
                .replace(/\n/g, '%0A');
        }

        // SVG أيقونة الواتساب
        const defaultSvg = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.7881 4.06584C21.1709 1.44525 17.69 0.00132957 13.9811 0C6.33875 0 0.118997 6.21909 0.116338 13.8635C0.115008 16.3072 0.75387 18.6925 1.96711 20.7946L0 27.9796L7.34989 26.0517C9.37482 27.1566 11.655 27.7383 13.9752 27.739H13.9811C21.6222 27.739 27.8427 21.5192 27.8453 13.8748C27.8466 10.17 26.406 6.6871 23.7881 4.06651V4.06584Z" fill="white"/>
            <path d="M20.3019 16.7673C19.9556 16.5938 18.2524 15.7561 17.9346 15.6405C17.6169 15.5248 17.3862 15.467 17.1555 15.814C16.9248 16.161 16.2607 16.9415 16.0586 17.1721C15.8565 17.4035 15.6544 17.4321 15.308 17.2585C14.9617 17.085 13.8455 16.7194 12.522 15.5394C11.4922 14.6206 10.7968 13.4866 10.5948 13.1395C10.3926 12.7925 10.5735 12.605 10.7463 12.4329C10.9018 12.2773 11.0926 12.028 11.2661 11.8259C11.4397 11.6238 11.4969 11.4789 11.6125 11.2482C11.7282 11.0168 11.6704 10.8148 11.584 10.6412C11.4975 10.4677 10.8048 8.76253 10.5156 8.06918C10.2344 7.39377 9.94858 7.48551 9.7365 7.47421C9.53439 7.46424 9.30373 7.46225 9.07239 7.46225C8.84104 7.46225 8.46605 7.54867 8.14831 7.89569C7.83056 8.24267 6.93573 9.08097 6.93573 10.7855C6.93573 12.49 8.17693 14.1381 8.35042 14.3694C8.52391 14.6008 10.7935 18.0995 14.2683 19.6006C15.0947 19.9576 15.7402 20.171 16.2434 20.3306C17.0731 20.5945 17.8283 20.5573 18.4252 20.4682C19.0907 20.3685 20.4748 19.6299 20.7633 18.8208C21.0518 18.0117 21.0518 17.3177 20.9654 17.1734C20.879 17.0292 20.6477 16.9421 20.3013 16.7686Z" fill="white"/>
        </svg>`;

        // بناء HTML (مختصر للتوضيح، يمكن إضافة كامل الأنماط من ملفك القديم)
        const widgetHtml = `
            <div id="whatsapp-chat-widget">
                <div class="wa-widget-send-button" style="background-color:${option.chatButtonSetting.backgroundColor}; border-radius:${option.chatButtonSetting.borderRadius}px">
                    ${defaultSvg}
                </div>
                <div class="wa-chat-box" style="display:none; position:fixed; bottom:80px; right:20px; background:white; padding:16px; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.3); width:280px;">
                    <img src="${option.brandSetting.brandImg}" width="50" style="border-radius:50%;">
                    <p>${option.brandSetting.welcomeText}</p>
                    <a href="https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber}&text=${option.brandSetting.messageText}" target="_blank" style="background:${option.chatButtonSetting.backgroundColor}; color:white; padding:10px; display:inline-block; border-radius:12px; text-decoration:none;">${option.brandSetting.ctaText}</a>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHtml);

        // إضافة الأنماط (يمكنك إضافة كامل الـ CSS من ملفك القديم هنا)
        const style = document.createElement('style');
        style.textContent = `
            #whatsapp-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; }
            .wa-widget-send-button { cursor: pointer; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
            .wa-chat-box { transition: 0.2s; }
        `;
        document.head.appendChild(style);

        // تفعيل click
        const btn = document.querySelector('.wa-widget-send-button');
        const box = document.querySelector('.wa-chat-box');
        btn.addEventListener('click', () => {
            if (box.style.display === 'none') box.style.display = 'block';
            else box.style.display = 'none';
        });
        if (option.brandSetting.autoShow) box.style.display = 'block';
    };
})();
