/**
 * shared.js — Tüm sayfalarda ortak JavaScript yardımcıları
 */

/* -------------------------------------------------------
   0. Oturum Kontrolü
   login.html hariç tüm sayfalarda oturum geçerliliği
   kontrol edilir; geçersizse login.html'e yönlendirir.
------------------------------------------------------- */
(function checkAuth() {
    var path = window.location.pathname;
    // login.html ve index.html'de bu kontrolü yapma (index kendi kontrolünü yapıyor)
    if (path.endsWith('login.html') || path.endsWith('index.html') ||
        path === '/' || path.endsWith('/')) return;

    var token   = sessionStorage.getItem('auth_token');
    var expires = parseInt(sessionStorage.getItem('auth_expires') || '0', 10);
    var ok      = token === 'ok' && Date.now() < expires;

    if (!ok) {
        window.location.replace('login.html');
    }
})();

/* -------------------------------------------------------
   1. Otomatik Geri Dönüş Butonu
   index.html hariç tüm sayfalara otomatik eklenir.
------------------------------------------------------- */
(function injectBackButton() {
    if (window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/')) {
        return;
    }
    const btn = document.createElement('a');
    btn.href        = 'index.html';
    btn.className   = 'back-btn';
    btn.textContent = 'Ana Menü';
    btn.setAttribute('aria-label', 'Ana menüye dön');
    document.body.prepend(btn);
})();

/* -------------------------------------------------------
   2. XSS Koruması — Kullanıcı girdisini güvenli render et
   Kullanım: element.textContent = escapeHtml(userInput);
            veya element.innerHTML = escapeHtml(userInput);
------------------------------------------------------- */
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* -------------------------------------------------------
   3. Resim Fallback — Yüklenemeyen resimleri gizle
   Kullanım: <img onerror="imgFallback(this)" ...>
------------------------------------------------------- */
function imgFallback(img) {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = [
        'width:' + (img.width || 200) + 'px',
        'height:' + (img.height || 150) + 'px',
        'background:#f0f0f0',
        'border-radius:8px',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'color:#999',
        'font-size:0.8rem',
        'font-family:sans-serif'
    ].join(';');
    placeholder.textContent = '🖼 Görsel yüklenemedi';
    img.parentNode.insertBefore(placeholder, img);
}

/* -------------------------------------------------------
   4. Tost Bildirimi — Kullanıcıya kısa geri bildirim
   Kullanım: showToast('Tebrikler!', 'success');
            tipler: 'success' | 'error' | 'info'
------------------------------------------------------- */
function showToast(message, type = 'info', duration = 2500) {
    const colors = {
        success: '#27ae60',
        error:   '#e74c3c',
        info:    '#3498db'
    };
    const toast = document.createElement('div');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText = [
        'position:fixed',
        'top:60px',
        'left:50%',
        'transform:translateX(-50%)',
        'background:' + (colors[type] || colors.info),
        'color:#fff',
        'padding:10px 22px',
        'border-radius:30px',
        'font-family:\'Segoe UI\',sans-serif',
        'font-size:0.9rem',
        'font-weight:700',
        'box-shadow:0 4px 12px rgba(0,0,0,0.2)',
        'z-index:99999',
        'pointer-events:none',
        'opacity:0',
        'transition:opacity 0.3s'
    ].join(';');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

/* -------------------------------------------------------
   5. Klavye Navigasyonu — Quiz seçenek butonları için
   1-4 tuşlarına basarak seçenek seçilebilir.
------------------------------------------------------- */
function enableKeyboardQuiz(containerSelector, optionSelector) {
    document.addEventListener('keydown', function(e) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
            const container = document.querySelector(containerSelector);
            if (!container) return;
            const btns = container.querySelectorAll(optionSelector);
            if (btns[num - 1] && !btns[num - 1].disabled) {
                btns[num - 1].click();
            }
        }
        // Enter / Space tuşu ile "Sonraki Soru"
        if (e.key === 'Enter' || e.key === ' ') {
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn && nextBtn.style.display !== 'none') {
                nextBtn.click();
            }
        }
    });
}
