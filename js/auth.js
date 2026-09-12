// ==========================================
// AUTHENTICATION
// ==========================================

async function signInWithGoogle() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/pages/username.html"
        }
    });

    if (error) {
        console.error("Google login failed:", error.message);
        alert("Google login failed: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // ربط الأزرار الثلاثة
    const heroBtn = document.getElementById("hero-google-login");
    const navBtn = document.getElementById("nav-login");
    const signupBtn = document.getElementById("nav-signup");

    if (heroBtn) heroBtn.addEventListener("click", signInWithGoogle);
    if (navBtn) navBtn.addEventListener("click", signInWithGoogle);
    if (signupBtn) signupBtn.addEventListener("click", signInWithGoogle);

    // ✅ تحميل الإحصائيات
    loadLandingStats();

    // التحقق من المستخدم
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabaseClient
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

    if (profile?.username) {
        window.location.href = "/pages/dashboard.html";
    } else {
        window.location.href = "/pages/username.html";
    }
});

// ==========================================
// LANDING STATS (Live from Supabase)
// ==========================================
async function loadLandingStats() {
    try {
        // 1. عدد المستخدمين
        const { count: usersCount, error: err1 } = await supabaseClient
            .from("profiles")
            .select("*", { count: "exact", head: true });

        if (err1) console.log("Users error:", err1);

        // 2. مجموع المشاهدات
        const { data: viewsData, error: err2 } = await supabaseClient
            .from("profiles")
            .select("views");

        if (err2) console.log("Views error:", err2);

        const totalViews = (viewsData || []).reduce(
            (sum, p) => sum + (p.views || 0),
            0
        );

        // 3. تحديث الأرقام
        const usersEl = document.getElementById("stat-users");
        const viewsEl = document.getElementById("stat-views");
        const profilesEl = document.getElementById("stat-profiles");
        const ctaEl = document.getElementById("cta-count");

        if (usersEl) usersEl.textContent = (usersCount || 0).toLocaleString();
        if (viewsEl) viewsEl.textContent = totalViews.toLocaleString();
        if (profilesEl) profilesEl.textContent = (usersCount || 0).toLocaleString();
        if (ctaEl) ctaEl.textContent = (usersCount || 0).toLocaleString();

        console.log("Stats loaded:", usersCount, totalViews);

    } catch (err) {
        console.log("Stats loading failed:", err);
    }
}