// ==========================================
// LANDING STATS (Live from Supabase)
// ==========================================
async function loadLandingStats() {
    try {
        // 1. عدد المستخدمين
        const { count: usersCount } = await supabaseClient
            .from("profiles")
            .select("*", { count: "exact", head: true });

        // 2. مجموع المشاهدات
        const { data: viewsData } = await supabaseClient
            .from("profiles")
            .select("views");

        const totalViews = (viewsData || []).reduce(
            (sum, p) => sum + (p.views || 0), 
            0
        );

        // 3. عدد البروفايلات (نفس عدد المستخدمين)
        const profilesCount = usersCount || 0;

        // 4. تحديث الأرقام في الصفحة
        const usersEl = document.getElementById("stat-users");
        const viewsEl = document.getElementById("stat-views");
        const profilesEl = document.getElementById("stat-profiles");

        if (usersEl) usersEl.textContent = (usersCount || 0).toLocaleString();
        if (viewsEl) viewsEl.textContent = totalViews.toLocaleString();
        if (profilesEl) profilesEl.textContent = profilesCount.toLocaleString();

    } catch (err) {
        console.log("Stats loading failed:", err);
    }
}

// تشغيل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadLandingStats);