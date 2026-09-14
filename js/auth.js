// ==========================================
// AUTHENTICATION
// ==========================================

const SESSION_KEY = 'profy_session_user';

async function signInWithGoogle() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/Login"
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
            redirectTo: window.location.origin + "/Login"
        }
    });

    if (error) {
        console.error("Discord login failed:", error.message);
        alert("Discord login failed: " + error.message);
    }
}

// ==========================================
// AUTO-LOGIN CHECK
// ==========================================
async function checkAutoLogin() {
    // 1. Check Supabase session
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
        // Save session locally
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            id: user.id,
            email: user.email,
            lastLogin: new Date().toISOString()
        }));

        // Check if profile exists
        const { data: profile } = await supabaseClient
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();

        // Redirect to dashboard if profile exists
        if (profile?.username) {
            window.location.href = "/dashboard";
            return true;
        } else {
            window.location.href = "/Login";
            return true;
        }
    }

    // 2. Check local session (if Supabase session expired but user logged in before)
    const localSession = localStorage.getItem(SESSION_KEY);
    if (localSession) {
        try {
            const session = JSON.parse(localSession);
            // Check if session is less than 7 days old
            const lastLogin = new Date(session.lastLogin);
            const now = new Date();
            const daysDiff = (now - lastLogin) / (1000 * 60 * 60 * 24);

            if (daysDiff < 7) {
                // Try to refresh Supabase session
                const { data: { session: supaSession } } = await supabaseClient.auth.getSession();
                if (supaSession) {
                    window.location.href = "/dashboard";
                    return true;
                }
            } else {
                // Session expired, clear it
                localStorage.removeItem(SESSION_KEY);
            }
        } catch (e) {
            localStorage.removeItem(SESSION_KEY);
        }
    }

    return false;
}

document.addEventListener("DOMContentLoaded", async () => {
    const googleBtn = document.getElementById("hero-google-login");
    const discordBtn = document.getElementById("hero-discord-login");

    if (googleBtn) googleBtn.addEventListener("click", signInWithGoogle);
    if (discordBtn) discordBtn.addEventListener("click", signInWithDiscord);

    loadLandingStats();

    // Check auto-login (only on landing page)
    const isLanding = window.location.pathname === "/" || 
                      window.location.pathname === "/index.html" ||
                      window.location.pathname === "";

    if (isLanding) {
        const loggedIn = await checkAutoLogin();
        if (loggedIn) return; // Stop if redirecting
    }

    // Update buttons for logged-in users
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
        const { data: profile } = await supabaseClient
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();

        if (googleBtn) {
            googleBtn.onclick = () => {
                window.location.href = profile?.username ? "/dashboard" : "/Login";
            };
        }

        if (discordBtn) {
            discordBtn.onclick = () => {
                window.location.href = profile?.username ? "/dashboard" : "/Login";
            };
        }
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
