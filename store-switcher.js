/**
 * Store Switcher - Egypt, Saudi Arabia, UAE
 * Version 1.0
 * استخدم هذا الملف في أي متجر myeasyorders
 */

(function() {
    // قائمة المتاجر (أضف أو عدل كما تشاء)
    const stores = [
        {
            id: "egypt",
            name: "مكانك ستور مصر 🇪🇬",
            url: "https://mkank-store.myeasyorders.com/",
            domain: "mkank-store.myeasyorders.com",
            color: "#000000",
            borderColor: "#ce1126"
        },
        {
            id: "saudi",
            name: "مكانك ستور السعودية 🇸🇦",
            url: "https://mkank-store-sa.myeasyorders.com/",
            domain: "mkank-store-sa.myeasyorders.com",
            color: "#165d31",
            borderColor: "#ffffff"
        },
        {
            id: "uae",
            name: "مكانك ستور الإمارات 🇦🇪",
            url: "https://mkank-store-ae.myeasyorders.com/",
            domain: "mkank-store-ae.myeasyorders.com",
            color: "#00732f",
            borderColor: "#ff0000"
        }
    ];

    // انتظر تحميل الصفحة بالكامل
    window.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById('store-switcher-container');
        if (!container) {
            console.warn('Store switcher container not found. Create a div with id="store-switcher-container"');
            return;
        }

        const currentUrl = window.location.href;
        let currentStore = null;

        // تحديد المتجر الحالي
        for (const store of stores) {
            if (currentUrl.includes(store.domain)) {
                currentStore = store;
                break;
            }
        }
        // إذا لم يتم التعرف (مثل localhost)، اعتبر مصر الافتراضية
        if (!currentStore) currentStore = stores[0];

        // إضافة الأزرار فقط للمتاجر الأخرى
        stores.forEach(store => {
            if (store.id === currentStore.id) return;

            const btn = document.createElement('button');
            btn.textContent = `تسوق من ${store.name}`;
            btn.className = 'store-switch-btn';
            btn.style.backgroundColor = store.color;
            btn.style.padding = '8px 16px';
            btn.style.fontSize = '14px';
            btn.style.fontWeight = 'bold';
            btn.style.border = 'none';
            btn.style.borderRadius = '12px';
            btn.style.cursor = 'pointer';
            btn.style.color = 'white';
            btn.style.display = 'inline-flex';
            btn.style.alignItems = 'center';
            btn.style.gap = '8px';
            btn.style.transition = '0.2s';
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            btn.onmouseenter = () => { btn.style.transform = 'translateY(-2px)'; btn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'; };
            btn.onmouseleave = () => { btn.style.transform = 'translateY(0)'; btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)'; };
            btn.onclick = () => { window.location.href = store.url; };
            container.appendChild(btn);
        });
    });
})();
