// ==========================================
// AUTHENTICATION
// ==========================================

async function signInWithGoogle() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            // هذا السطر يستخدم النطاق الحالي تلقائياً (localhost أو GitHub Pages)
            redirectTo: window.location.origin + "/pages/username.html"
        }
    });

    if (error) {
        console.error("Google login failed:", error.message);
        alert("Google login failed: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // ربط الأزرار الثلاثة بوظيفة تسجيل الدخول
    const heroBtn = document.getElementById("hero-google-login");
    const navBtn = document.getElementById("nav-login");
    const signupBtn = document.getElementById("nav-signup");

    if (heroBtn) heroBtn.addEventListener("click", signInWithGoogle);
    if (navBtn) navBtn.addEventListener("click", signInWithGoogle);
    if (signupBtn) signupBtn.addEventListener("click", signInWithGoogle);

    // التحقق مما إذا كان المستخدم مسجلاً بالفعل
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    // التحقق مما إذا كان المستخدم يمتلك ملفاً شخصياً
    const { data: profile } = await supabaseClient
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

    if (profile?.username) {
        // المستخدم لديه ملف شخصي -> التوجه إلى لوحة التحكم
        window.location.href = "/pages/dashboard.html";
    } else {
        // المستخدم جديد -> التوجه لاختيار اسم المستخدم
        window.location.href = "/pages/username.html";
    }
});