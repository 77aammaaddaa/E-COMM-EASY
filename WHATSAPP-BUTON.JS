/**
 * WhatsApp Chat Widget - Dynamic Options Supported
 * Version: 4.0
 * GitHub: https://github.com/77aammaaddaa/E-COMM-EASY/blob/main/WHATSAPP-BUTON.JS
 */

(function () {
    var isWidgetCreated = false;

    function onBodyReady(callback) {
        if (document.body) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    window.CreateWhatsappChatWidget = function (option = {}) {
        if (option.enabled === false) return;

        const defaultOption = {
            brandSetting: {
                autoShow: false,
                backgroundColor: '#e68600',
                brandImg: 'https://files.easy-orders.net/1757075063084089582.png',
                brandName: 'مكانك ستور مصر',
                brandSubTitle: 'موجودين نساعدك',
                welcomeText: 'أهلاً بيك! 👋 إزاي نقدر نساعدك النهاردة؟',
                phoneNumber: '',
                options: [] // خيارات الأزرار المخصصة
            },
            chatButtonSetting: {
                backgroundColor: '#e68600',
                ctaText: 'أهلاً بيك! إزاي نقدر نساعدك؟',
                position: 'right',
                marginBottom: '20',
                marginRight: '20',
                marginLeft: '0',
                iconColor: '#ffffff'
            },
            enabled: true
        };

        const finalOption = {
            brandSetting: { ...defaultOption.brandSetting, ...(option.brandSetting || {}) },
            chatButtonSetting: { ...defaultOption.chatButtonSetting, ...(option.chatButtonSetting || {}) },
            enabled: option.enabled !== undefined ? option.enabled : true
        };

        onBodyReady(function () {
            if (isWidgetCreated || document.querySelector('#whatsapp-chat-widget')) return;
            isWidgetCreated = true;

            initWidget(finalOption);
        });
    };

    function initWidget(finalOption) {
        const cleanPhone = (finalOption.brandSetting.phoneNumber || '').replace(/[^0-9]/g, '');
        const iconFillColor = finalOption.chatButtonSetting.iconColor || '#ffffff';

        // بناء قائمة الأزرار الديناميكية
        let optionsHtml = '';
        const userOptions = finalOption.brandSetting.options || [];

        if (userOptions.length > 0) {
            optionsHtml = '<div class="wa-options-container">';
            userOptions.forEach(opt => {
                let formattedMsg = (opt.message || '')
                    .replace(/{{page_link}}|__page_link__/g, encodeURIComponent(window.location.href))
                    .replace(/{{page_title}}|__page_title__/g, window.document.title)
                    .replace(/\n/g, '%0A');

                let waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${formattedMsg}`;

                optionsHtml += `
                    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="wa-option-item">
                        <span>${opt.label}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                `;
            });
            optionsHtml += '</div>';
        } else {
            // زر واحد افتراضي في حال عدم وجود قائمة خيارات
            let defaultMsg = (finalOption.brandSetting.messageText || '')
                .replace(/{{page_link}}|__page_link__/g, encodeURIComponent(window.location.href))
                .replace(/{{page_title}}|__page_title__/g, window.document.title)
                .replace(/\n/g, '%0A');

            optionsHtml = `
                <a rel="noopener noreferrer" role="button" target="_blank"
                    href="https://api.whatsapp.com/send?phone=${cleanPhone}&text=${defaultMsg}"
                    class="wa-chat-box-content-send-btn">
                    <span class="wa-chat-box-content-send-btn-text">${finalOption.brandSetting.ctaText || 'تواصل معنا'}</span>
                </a>
            `;
        }

        injectStyles(finalOption);

        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'whatsapp-chat-widget';
        widgetContainer.innerHTML = `
            <div class="wa-widget-send-button">
                <svg id="wa-widget-svg" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.7881 4.06584C21.1709 1.44525 17.69 0.00132957 13.9811 0C6.33875 0 0.118997 6.21909 0.116338 13.8635C0.115008 16.3072 0.75387 18.6925 1.96711 20.7946L0 27.9796L7.34989 26.0517C9.37482 27.1566 11.655 27.7383 13.9752 27.739H13.9811C21.6222 27.739 27.8427 21.5192 27.8453 13.8748C27.8466 10.17 26.406 6.6871 23.7881 4.06651V4.06584ZM13.9811 25.3975H13.9765C11.909 25.3969 9.88075 24.8411 8.1111 23.7914L7.69027 23.5415L3.3286 24.6856L4.49264 20.4329L4.21874 19.9968C3.06533 18.162 2.45572 16.0413 2.45705 13.8642C2.45971 7.51078 7.6291 2.34138 13.9858 2.34138C17.0638 2.34271 19.957 3.54266 22.1328 5.72117C24.3086 7.89902 25.5059 10.7949 25.5046 13.8735C25.5019 20.2275 20.3326 25.3969 13.9811 25.3969V25.3975ZM20.3019 16.7673C19.9556 16.5938 18.2524 15.7561 17.9346 15.6405C17.6169 15.5248 17.3862 15.467 17.1555 15.814C16.9248 16.161 16.2607 16.9415 16.0586 17.1721C15.8565 17.4035 15.6544 17.4321 15.308 17.2585C14.9617 17.085 13.8455 16.7194 12.522 15.5394C11.4922 14.6206 10.7968 13.4866 10.5948 13.1395C10.3926 12.7925 10.5735 12.605 10.7463 12.4329C10.9018 12.2773 11.0926 12.028 11.2661 11.8259C11.4397 11.6238 11.4969 11.4789 11.6125 11.2482C11.7282 11.0168 11.6704 10.8148 11.584 10.6412C11.4975 10.4677 10.8048 8.76253 10.5156 8.06918C10.2344 7.39377 9.94858 7.48551 9.7365 7.47421C9.53439 7.46424 9.30373 7.46225 9.07239 7.46225C8.84104 7.46225 8.46605 7.54867 8.14831 7.89569C7.83056 8.24267 6.93573 9.08097 6.93573 10.7855C6.93573 12.49 8.17693 14.1381 8.35042 14.3694C8.52391 14.6008 10.7935 18.0995 14.2683 19.6006C15.0947 19.9576 15.7402 20.171 16.2434 20.3306C17.0731 20.5945 17.8283 20.5573 18.4252 20.4682C19.0907 20.3685 20.4748 19.6299 20.7633 18.8208C21.0518 18.0117 21.0518 17.3177 20.9654 17.1734C20.879 17.0292 20.6477 16.9421 20.3013 16.7686L20.3019 16.7673Z" fill="${iconFillColor}" />
                </svg>
                <svg id="wa-widget-opened-svg" width="23" height="13" viewBox="0 0 23 13" fill="none" style="pointer-events: none; display: none;" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.20001 1.7334L11.6154 11.1488L21.0308 1.7334" stroke="#363636" stroke-width="2" stroke-linecap="square"/>
                </svg>
            </div>
            <div class='wa-chat-bubble'>
                <div class="wa-chat-bubble-close-button">
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" style="pointer-events: none; display: block;" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.6001 4.1001L8.4001 8.9001M3.6001 8.9001L8.4001 4.1001" stroke="white" stroke-width="1.33333"/>
                    </svg>
                </div>
                <div class="wa-chat-bubble-text">${finalOption.chatButtonSetting.ctaText}</div>
            </div>
            <div class='wa-chat-box'>
                <div class="wa-chat-box-header">
                    <img class='wa-chat-box-brand' onError='this.src="https://files.easy-orders.net/1757075063084089582.png";' src='${finalOption.brandSetting.brandImg}' alt=''/>
                    <div>
                        <div class="wa-brand-name">${finalOption.brandSetting.brandName}</div>
                        <div class="wa-brand-status">${finalOption.brandSetting.brandSubTitle}</div>
                    </div>
                </div>
                <div class='wa-chat-box-content-chat-welcome'>
                    ${finalOption.brandSetting.welcomeText.replace(/\n/g, '<br/>')}
                </div>
                ${optionsHtml}
                <div class='wa-chat-box-poweredby'>
                    Powered by <a href="https://mhfortech.blogspot.com/" target="_blank" class="wa-chat-box-poweredby-link">MH FOR TECH</a>
                </div>
            </div>
        `;

        document.body.appendChild(widgetContainer);

        const chatBox = widgetContainer.querySelector('.wa-chat-box');
        const waWidgetSvg = widgetContainer.querySelector('#wa-widget-svg');
        const waWidgetOpenedSvg = widgetContainer.querySelector('#wa-widget-opened-svg');
        const chatBubble = widgetContainer.querySelector('.wa-chat-bubble');
        const sendBtn = widgetContainer.querySelector('.wa-widget-send-button');

        if (finalOption.brandSetting.autoShow) {
            chatBox.classList.add('wa-chat-box-visible');
            if (waWidgetSvg) waWidgetSvg.style.display = 'none';
            if (waWidgetOpenedSvg) waWidgetOpenedSvg.style.display = 'block';
            if (chatBubble) chatBubble.style.display = 'none';
            if (sendBtn) sendBtn.classList.add('wa-widget-send-button-clicked');
        }

        widgetContainer.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains('wa-widget-send-button') && target.classList.contains('wa-widget-send-button-clicked')) {
                chatBox.classList.remove('wa-chat-box-visible');
                if (waWidgetSvg) waWidgetSvg.style.display = 'block';
                if (waWidgetOpenedSvg) waWidgetOpenedSvg.style.display = 'none';
                if (chatBubble) chatBubble.style.cssText = '';
                target.className = 'wa-widget-send-button';
            } else if ((target.classList.contains('wa-widget-send-button') && !target.classList.contains('wa-widget-send-button-clicked')) || target.classList.contains('wa-chat-bubble-text')) {
                chatBox.classList.add('wa-chat-box-visible');
                if (waWidgetSvg) waWidgetSvg.style.display = 'none';
                if (waWidgetOpenedSvg) waWidgetOpenedSvg.style.display = 'block';
                if (chatBubble) chatBubble.style.display = 'none';
                if (sendBtn) sendBtn.classList.add('wa-widget-send-button-clicked');
            }

            if (target.classList.contains('wa-chat-bubble-close-button')) {
                if (chatBubble) chatBubble.classList.add('wa-chat-bubble-closed');
            }
        });

        setTimeout(function () {
            if (chatBox) chatBox.classList.add('wa-chat-box-transition');
        }, 100);
    }

    function injectStyles(finalOption) {
        if (document.getElementById('wa-widget-styles')) return;

        const styles = `
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

            #whatsapp-chat-widget{ display: ${finalOption.enabled ? 'block' : 'none'}; direction: rtl; text-align: right; }
            .wa-chat-box-header{ display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
            .wa-brand-name{ font-family: 'Outfit', sans-serif !important; font-weight: 700; font-size: 16px; color: #18181b; }
            .wa-brand-status{ font-family: 'Outfit', sans-serif !important; font-size: 12px; color: #16a34a; }
            .wa-options-container{ display: flex; flex-direction: column; gap: 8px; margin-top: 6px; width: 100%; }
            .wa-option-item{ background: #f4f4f5; color: #18181b !important; border: 1px solid #e4e4e7; padding: 10px 14px; border-radius: 12px; font-family: 'Outfit', sans-serif !important; font-size: 13px; font-weight: 600; text-decoration: none !important; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s ease; }
            .wa-option-item:hover{ background: ${finalOption.chatButtonSetting.backgroundColor}; color: #ffffff !important; border-color: ${finalOption.chatButtonSetting.backgroundColor}; }
            .wa-chat-box-content-chat-welcome{ font-family: 'Outfit', sans-serif !important; font-size: 15px; line-height: 140%; color: #3f3f46; background: #f4f4f5; padding: 12px; border-radius: 14px; }
            .wa-chat-box-brand{ width: 44px; height: 44px; border-radius: 100px; object-fit: cover; }
            .wa-chat-box{ background-color: white; z-index: 16000160 !important; min-width: 310px; position: fixed !important; bottom: ${parseInt(finalOption.chatButtonSetting.marginBottom) + 70}px !important; ${finalOption.chatButtonSetting.position == 'left' ? 'left : ' + finalOption.chatButtonSetting.marginLeft + 'px' : 'right : ' + finalOption.chatButtonSetting.marginRight + 'px'}; border-radius: 24px; border: 1px solid #e4e4e7; box-shadow: 0 12px 30px rgba(0,0,0,0.15); padding: 20px; display: flex; flex-direction: column; gap: 10px; pointer-events: none; opacity: 0; scale: 0; transform-origin: ${finalOption.chatButtonSetting.position == 'left' ? 'left' : 'right'} bottom; }
            .wa-chat-box-visible{ pointer-events: auto; opacity: 1; scale: 1; }
            .wa-chat-box-transition { transition: scale 150ms ease-in, opacity 250ms ease-in; }
            .wa-widget-send-button { margin: 0 0 ${finalOption.chatButtonSetting.marginBottom}px 0 !important; position: fixed !important; z-index: 16000160 !important; bottom: 0 !important; height: 52px; min-width: 52px; border-radius: 100px; background-color: ${finalOption.chatButtonSetting.backgroundColor}; box-shadow: 0 4px 14px rgba(0,0,0,0.25); ${finalOption.chatButtonSetting.position == 'left' ? 'left : ' + finalOption.chatButtonSetting.marginLeft + 'px' : 'right : ' + finalOption.chatButtonSetting.marginRight + 'px'}; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            .wa-chat-box-poweredby{ margin-top: 4px; text-align: center; font-family: 'Outfit', sans-serif !important; font-size: 11px; color: #a1a1aa; }
            .wa-chat-box-poweredby-link{ font-weight: 600; color: #71717a !important; text-decoration: none !important; }
            .wa-chat-bubble{ display: ${finalOption.chatButtonSetting.ctaText ? 'flex' : 'none'}; align-items: center; gap: 8px; z-index: 16000160 !important; position: fixed !important; bottom: ${parseInt(finalOption.chatButtonSetting.marginBottom) + 60}px !important; ${finalOption.chatButtonSetting.position == 'left' ? 'left : ' + finalOption.chatButtonSetting.marginLeft + 'px' : 'right : ' + finalOption.chatButtonSetting.marginRight + 'px'}; }
            .wa-chat-bubble-closed{ display: none; }
            .wa-chat-bubble-close-button{ height: 18px; min-width: 18px; background: #27272a; border-radius: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            .wa-chat-bubble-text{ font-family: 'Outfit', sans-serif !important; background: #FFFFFF; border: 1px solid #e4e4e7; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 500; font-size: 13px; color: #18181b; cursor: pointer; }
            @media only screen and (max-width: 600px) { .wa-chat-box { min-width: 0%; right: 16px!important; left: 16px!important; } }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'wa-widget-styles';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
})();
