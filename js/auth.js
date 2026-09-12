// ==========================================
// AUTHENTICATION
// ==========================================

async function signInWithGoogle() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/pages/auth/username.html"
        }
    });

    if (error) {
        console.error("Google login failed:", error.message);
        alert("Google login failed: " + error.message);
    }
}

async function signInWithDiscord() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "discord",
        options: {
            redirectTo: window.location.origin + "/pages/auth/username.html"
        }
    });

    if (error) {
        console.error("Discord login failed:", error.message);
        alert("Discord login failed: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const heroBtn = document.getElementById("hero-google-login");
    const discordBtn = document.getElementById("hero-discord-login");
    const navBtn = document.getElementById("nav-login");
    const signupBtn = document.getElementById("nav-signup");

    if (heroBtn) heroBtn.addEventListener("click", signInWithGoogle);
    if (discordBtn) discordBtn.addEventListener("click", signInWithDiscord);
    if (navBtn) navBtn.addEventListener("click", signInWithGoogle);
    if (signupBtn) signupBtn.addEventListener("click", signInWithGoogle);

    loadLandingStats();

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabaseClient
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

    if (profile?.username) {
        window.location.href = "/Dashboard";
    } else {
        window.location.href = "/Username";
    }
});

async function loadLandingStats() {
    try {
        const { count: usersCount } = await supabaseClient
            .from("profiles")
            .select("*", { count: "exact", head: true });

        const { data: viewsData } = await supabaseClient
            .from("profiles")
            .select("views");

        const totalViews = (viewsData || []).reduce(
            (sum, p) => sum + (p.views || 0),
            0
        );

        const usersEl = document.getElementById("stat-users");
        const viewsEl = document.getElementById("stat-views");
        const profilesEl = document.getElementById("stat-profiles");
        const ctaEl = document.getElementById("cta-count");

        if (usersEl) usersEl.textContent = (usersCount || 0).toLocaleString();
        if (viewsEl) viewsEl.textContent = totalViews.toLocaleString();
        if (profilesEl) profilesEl.textContent = (usersCount || 0).toLocaleString();
        if (ctaEl) ctaEl.textContent = (usersCount || 0).toLocaleString();

    } catch (err) {
        console.log("Stats loading failed:", err);
    }
}