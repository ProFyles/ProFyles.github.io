// ==========================================
// i18n — Multi-language System
// ==========================================

const translations = {
    en: { signIn: "Sign In", signUpFree: "Sign Up Free", heroTitle: "One link.<br>Everything about you.", heroSubtitle: "Create a feature-rich, customizable link-in-bio page in minutes.", heroBtnPrimary: "Sign Up for Free", heroBtnSecondary: "View Pricing", statUsers: "Users", statViews: "Profile Views", statProfiles: "Profiles Created", featuresTitle: "Everything you want, right here.", featuresSubtitle: "Profy is your go-to for modern, feature-rich link-in-bio pages.", featCustom: "Custom Profile", featCustomDesc: "Personalize your page with avatar, bio, and theme.", featLinks: "Social Links", featLinksDesc: "Add all your social accounts in one place.", featViews: "View Counter", featViewsDesc: "See how many people visited your profile.", featFast: "Fast & Secure", featFastDesc: "Lightning-fast pages with enterprise security.", pricingTitle: "Explore our exclusive plans", pricingSubtitle: "Join 56,900+ subscribers", freePlan: "Free", freePrice: "0€", freePeriod: "/Lifetime", freeDesc: "For beginners, link all your socials in one place.", getStarted: "Get Started", premium: "💎 Premium", premiumPrice: "7,99€", premiumPeriod: "/Lifetime", premiumDesc: "Pay once. Keep it forever.", learnMore: "Learn More", mostPopular: "Most Popular", ctaTitle: "Over <span class='highlight-purple' id='cta-count'>0</span> people use Profy", ctaSubtitle: "What are you waiting for?", ctaBtn: "Claim Your Profile", copyright: "© 2025 Profy. All rights reserved." },

    ar: { signIn: "تسجيل الدخول", signUpFree: "سجّل مجاناً", heroTitle: "رابط واحد.<br>كل شيء عنك.", heroSubtitle: "أنشئ صفحة تعريفية احترافية قابلة للتخصيص في دقائق.", heroBtnPrimary: "سجّل مجاناً", heroBtnSecondary: "عرض الأسعار", statUsers: "المستخدمون", statViews: "مشاهدات الملف", statProfiles: "الملفات المنشأة", featuresTitle: "كل ما تريد، هنا.", featuresSubtitle: "Profy وجهتك لصفحات تعريفية عصرية.", featCustom: "ملف مخصص", featCustomDesc: "خصّص صفحتك بالصورة والسيرة والثيم.", featLinks: "روابط التواصل", featLinksDesc: "أضف كل حساباتك في مكان واحد.", featViews: "عداد المشاهدات", featViewsDesc: "شاهد عدد زوار ملفك الشخصي.", featFast: "سريع وآمن", featFastDesc: "صفحات فائقة السرعة مع أمان متقدم.", pricingTitle: "استكشف خططنا الحصرية", pricingSubtitle: "انضم إلى أكثر من 56,900 مشترك", freePlan: "مجاني", freePrice: "0€", freePeriod: "/مدى الحياة", freeDesc: "للمبتدئين، اربط كل حساباتك في مكان واحد.", getStarted: "ابدأ الآن", premium: "💎 بريميوم", premiumPrice: "7,99€", premiumPeriod: "/مدى الحياة", premiumDesc: "ادفع مرة واحدة، واحتفظ به للأبد.", learnMore: "اعرف المزيد", mostPopular: "الأكثر شعبية", ctaTitle: "أكثر من <span class='highlight-purple' id='cta-count'>0</span> شخص يستخدمون Profy", ctaSubtitle: "ماذا تنتظر؟", ctaBtn: "احصل على ملفك", copyright: "© 2025 Profy. جميع الحقوق محفوظة." },

    fr: { signIn: "Connexion", signUpFree: "Inscription", heroTitle: "Un lien.<br>Tout sur vous.", heroSubtitle: "Créez une page de bio en minutes.", heroBtnPrimary: "S'inscrire", heroBtnSecondary: "Tarifs", statUsers: "Utilisateurs", statViews: "Vues", statProfiles: "Profils", featuresTitle: "Tout ici.", featuresSubtitle: "Profy pour des pages bio modernes.", featCustom: "Profil personnalisé", featCustomDesc: "Avatar, bio et thème.", featLinks: "Liens sociaux", featLinksDesc: "Tous vos comptes.", featViews: "Compteur", featViewsDesc: "Vues du profil.", featFast: "Rapide & sûr", featFastDesc: "Sécurité avancée.", pricingTitle: "Nos offres", pricingSubtitle: "56 900+ abonnés", freePlan: "Gratuit", freePrice: "0€", freePeriod: "/À vie", freeDesc: "Pour débuter.", getStarted: "Commencer", premium: "💎 Premium", premiumPrice: "7,99€", premiumPeriod: "/À vie", premiumDesc: "Payez une fois.", learnMore: "En savoir plus", mostPopular: "Populaire", ctaTitle: "<span class='highlight-purple' id='cta-count'>0</span> utilisateurs", ctaSubtitle: "Qu'attendez-vous ?", ctaBtn: "Réclamez", copyright: "© 2025 Profy." },

    es: { signIn: "Entrar", signUpFree: "Regístrate", heroTitle: "Un enlace.<br>Todo sobre ti.", heroSubtitle: "Crea una bio en minutos.", heroBtnPrimary: "Regístrate", heroBtnSecondary: "Precios", statUsers: "Usuarios", statViews: "Vistas", statProfiles: "Perfiles", featuresTitle: "Todo aquí.", featuresSubtitle: "Profy para bios modernas.", featCustom: "Perfil", featCustomDesc: "Avatar, bio y tema.", featLinks: "Enlaces", featLinksDesc: "Todas tus cuentas.", featViews: "Contador", featViewsDesc: "Vistas del perfil.", featFast: "Rápido", featFastDesc: "Seguridad avanzada.", pricingTitle: "Planes", pricingSubtitle: "56,900+ suscriptores", freePlan: "Gratis", freePrice: "0€", freePeriod: "/Vida", freeDesc: "Para empezar.", getStarted: "Empezar", premium: "💎 Premium", premiumPrice: "7,99€", premiumPeriod: "/Vida", premiumDesc: "Paga una vez.", learnMore: "Saber más", mostPopular: "Popular", ctaTitle: "<span class='highlight-purple' id='cta-count'>0</span> usuarios", ctaSubtitle: "¿Qué esperas?", ctaBtn: "Reclama", copyright: "© 2025 Profy." },

    de: { signIn: "Anmelden", signUpFree: "Registrieren", heroTitle: "Ein Link.<br>Alles über dich.", heroSubtitle: "Bio in Minuten.", heroBtnPrimary: "Registrieren", heroBtnSecondary: "Preise", statUsers: "Benutzer", statViews: "Aufrufe", statProfiles: "Profile", featuresTitle: "Alles hier.", featuresSubtitle: "Profy für moderne Bios.", featCustom: "Profil", featCustomDesc: "Avatar, Bio, Theme.", featLinks: "Links", featLinksDesc: "Alle Konten.", featViews: "Zähler", featViewsDesc: "Profilaufrufe.", featFast: "Schnell", featFastDesc: "Sicherheit.", pricingTitle: "Pläne", pricingSubtitle: "56.900+ Abos", freePlan: "Kostenlos", freePrice: "0€", freePeriod: "/Leben", freeDesc: "Für Anfänger.", getStarted: "Starten", premium: "💎 Premium", premiumPrice: "7,99€", premiumPeriod: "/Leben", premiumDesc: "Einmal zahlen.", learnMore: "Mehr", mostPopular: "Beliebt", ctaTitle: "<span class='highlight-purple' id='cta-count'>0</span> Nutzer", ctaSubtitle: "Worauf warten?", ctaBtn: "Sichern", copyright: "© 2025 Profy." },

    tr: { signIn: "Giriş", signUpFree: "Kaydol", heroTitle: "Tek link.<br>Her şey.", heroSubtitle: "Dakikalar içinde bio.", heroBtnPrimary: "Kaydol", heroBtnSecondary: "Fiyatlar", statUsers: "Kullanıcı", statViews: "Görüntüleme", statProfiles: "Profil", featuresTitle: "Her şey burada.", featuresSubtitle: "Profy modern bio için.", featCustom: "Profil", featCustomDesc: "Avatar, bio, tema.", featLinks: "Linkler", featLinksDesc: "Tüm hesaplar.", featViews: "Sayaç", featViewsDesc: "Görüntüleme.", featFast: "Hızlı", featFastDesc: "Güvenlik.", pricingTitle: "Planlar", pricingSubtitle: "56.900+ abone", freePlan: "Ücretsiz", freePrice: "0€", freePeriod: "/Ömür", freeDesc: "Yeni başlayanlar.", getStarted: "Başla", premium: "💎 Premium", premiumPrice: "7,99€", premiumPeriod: "/Ömür", premiumDesc: "Bir kez öde.", learnMore: "Daha", mostPopular: "Popüler", ctaTitle: "<span class='highlight-purple' id='cta-count'>0</span> kişi", ctaSubtitle: "Ne bekliyorsun?", ctaBtn: "Al", copyright: "© 2025 Profy." },

    ru: { signIn: "Войти", signUpFree: "Регистрация", heroTitle: "Одна ссылка.<br>Всё о тебе.", heroSubtitle: "Bio за минуты.", heroBtnPrimary: "Регистрация", heroBtnSecondary: "Цены", statUsers: "Пользователи", statViews: "Просмотры", statProfiles: "Профили", featuresTitle: "Всё здесь.", featuresSubtitle: "Profy для современных bio.", featCustom: "Профиль", featCustomDesc: "Аватар, био, тема.", featLinks: "Ссылки", featLinksDesc: "Все аккаунты.", featViews: "Счётчик", featViewsDesc: "Просмотры.", featFast: "Быстро", featFastDesc: "Безопасность.", pricingTitle: "Планы", pricingSubtitle: "56 900+ подписчиков", freePlan: "Бесплатно", freePrice: "0€", freePeriod: "/Навсегда", freeDesc: "Для новичков.", getStarted: "Начать", premium: "💎 Премиум", premiumPrice: "7,99€", premiumPeriod: "/Навсегда", premiumDesc: "Раз и навсегда.", learnMore: "Подробнее", mostPopular: "Популярный", ctaTitle: "<span class='highlight-purple' id='cta-count'>0</span> человек", ctaSubtitle: "Чего ждёшь?", ctaBtn: "Получить", copyright: "© 2025 Profy." },

    pt: { signIn: "Entrar", signUpFree: "Inscreva-se", heroTitle: "Um link.<br>Tudo sobre você.", heroSubtitle: "Bio em minutos.", heroBtnPrimary: "Inscreva-se", heroBtnSecondary: "Preços", statUsers: "Usuários", statViews: "Visualizações", statProfiles: "Perfis", featuresTitle: "Tudo aqui.", featuresSubtitle: "Profy para bios modernas.", featCustom: "Perfil", featCustomDesc: "Avatar, bio, tema.", featLinks: "Links", featLinksDesc: "Todas as contas.", featViews: "Contador", featViewsDesc: "Visualizações.", featFast: "Rápido", featFastDesc: "Segurança.", pricingTitle: "Planos", pricingSubtitle: "56.900+ assinantes", freePlan: "Grátis", freePrice: "0€", freePeriod: "/Vitalício", freeDesc: "Para iniciantes.", getStarted: "Começar", premium: "💎 Premium", premiumPrice: "7,99€", premiumPeriod: "/Vitalício", premiumDesc: "Pague uma vez.", learnMore: "Saiba mais", mostPopular: "Popular", ctaTitle: "<span class='highlight-purple' id='cta-count'>0</span> pessoas", ctaSubtitle: "O que espera?", ctaBtn: "Reivindicar", copyright: "© 2025 Profy." }
};

function getFlag(lang) {
    const flags = { en: '🇺🇸', ar: '🇲🇦', fr: '🇫🇷', es: '🇪🇸', de: '🇩🇪', tr: '🇹🇷', ru: '🇷🇺', pt: '🇧🇷' };
    return flags[lang] || '🌐';
}

function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    localStorage.setItem('profy_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // تطبيق الترجمات
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // ✅ إعادة تحميل الإحصائيات بعد تغيير اللغة
    if (typeof loadLandingStats === 'function') {
        loadLandingStats();
    }

    // تحديث العلم في الزر
    const flagEl = document.getElementById('current-flag');
    if (flagEl) flagEl.textContent = getFlag(lang);
}

// تشغيل عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('profy_lang') || 'en';
    setLanguage(savedLang);

    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            langMenu.classList.remove('open');
        });

        langMenu.querySelectorAll('[data-lang]').forEach(item => {
            item.addEventListener('click', () => {
                setLanguage(item.getAttribute('data-lang'));
                langMenu.classList.remove('open');
            });
        });
    }
});