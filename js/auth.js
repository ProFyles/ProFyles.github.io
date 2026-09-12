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
    // 3 أزرار تسجيل الدخول
    const heroBtn = document.getElementById("hero-google-login");
    const navBtn = document.getElementById("nav-login");
    const signupBtn = document.getElementById("nav-signup");

    if (heroBtn) heroBtn.addEventListener("click", signInWithGoogle);
    if (navBtn) navBtn.addEventListener("click", signInWithGoogle);
    if (signupBtn) signupBtn.addEventListener("click", signInWithGoogle);

    // التحقق من المستخدم المسجل
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