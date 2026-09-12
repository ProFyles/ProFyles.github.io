// ==========================================
// CLICK SOUNDS SYSTEM
// ==========================================

(function() {
    // إنشاء Web Audio Context
    let audioCtx = null;
    let soundEnabled = true;

    // تحميل الإعداد من localStorage
    const savedSetting = localStorage.getItem('profy_sound');
    if (savedSetting === 'off') {
        soundEnabled = false;
    }

    // تهيئة Audio Context عند أول تفاعل
    function initAudio() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Audio not supported');
            }
        }
    }

    // توليد صوت نقرة
    function playClickSound() {
        if (!soundEnabled) return;
        
        initAudio();
        if (!audioCtx) return;

        try {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            // نوع الموجة
            oscillator.type = 'sine';
            
            // التردد (نغمة عالية قصيرة)
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);

            // مستوى الصوت (خفيف)
            gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.08);
        } catch (e) {
            // تجاهل الأخطاء
        }
    }

    // صوت نجاح
    function playSuccessSound() {
        if (!soundEnabled) return;
        initAudio();
        if (!audioCtx) return;

        try {
            const now = audioCtx.currentTime;

            // نغمة أولى
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(600, now);
            osc1.frequency.exponentialRampToValueAtTime(900, now + 0.1);
            gain1.gain.setValueAtTime(0.08, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc1.start(now);
            osc1.stop(now + 0.15);

            // نغمة ثانية
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(900, now + 0.1);
            osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
            gain2.gain.setValueAtTime(0.08, now + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc2.start(now + 0.1);
            osc2.stop(now + 0.25);
        } catch (e) {}
    }

    // صوت خطأ
    function playErrorSound() {
        if (!soundEnabled) return;
        initAudio();
        if (!audioCtx) return;

        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) {}
    }

    // صوت hover خفيف
    function playHoverSound() {
        if (!soundEnabled) return;
        initAudio();
        if (!audioCtx) return;

        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.04);
        } catch (e) {}
    }

    // ربط الأصوات بجميع الأزرار والروابط
    function attachSounds() {
        document.querySelectorAll('button, a, .nav-item, .link-button, .stat-card, .feature-card, .pricing-btn').forEach(el => {
            if (el.dataset.soundAttached) return;
            el.dataset.soundAttached = 'true';

            el.addEventListener('click', playClickSound);
            
            el.addEventListener('mouseenter', playHoverSound);
        });
    }

    // مراقبة العناصر الجديدة
    const observer = new MutationObserver(() => {
        attachSounds();
    });

    // عندما تجهز الصفحة
    document.addEventListener('DOMContentLoaded', () => {
        attachSounds();
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // زر كتم الصوت
    function addSoundToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'click-sound';
        toggle.innerHTML = soundEnabled ? '🔊' : '🔇';
        toggle.title = 'Toggle Sound';
        toggle.setAttribute('aria-label', 'Toggle sound');

        if (!soundEnabled) toggle.classList.add('muted');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            soundEnabled = !soundEnabled;
            localStorage.setItem('profy_sound', soundEnabled ? 'on' : 'off');
            toggle.innerHTML = soundEnabled ? '🔊' : '🔇';
            toggle.classList.toggle('muted', !soundEnabled);
            
            if (soundEnabled) playSuccessSound();
        });

        document.body.appendChild(toggle);
    }

    // أضف الزر بعد تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addSoundToggle);
    } else {
        addSoundToggle();
    }

    // تصدير الدوال
    window.ProfySounds = {
        click: playClickSound,
        success: playSuccessSound,
        error: playErrorSound,
        hover: playHoverSound
    };
})();