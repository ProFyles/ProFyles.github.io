// ==========================================
// USERNAME SETUP
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    const continueBtn = document.getElementById("continue");
    const input = document.getElementById("username");
    const messageEl = document.getElementById("message");

    if (!continueBtn) return;

    // ✅ أولاً: تحقق إذا كان المستخدم لديه بروفايل بالفعل
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
        const { data: existingProfile } = await supabaseClient
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();

        if (existingProfile?.username) {
            // المستخدم لديه بروفايل → وجّهه للوحة التحكم
            window.location.href = "dashboard.html";
            return;
        }
    }

    continueBtn.addEventListener("click", async () => {
        const username = input.value.trim().toLowerCase();

        // Validate
        if (username.length < 4) {
            messageEl.textContent = "Username must be at least 4 characters.";
            messageEl.style.color = "red";
            return;
        }

        if (username.length > 20) {
            messageEl.textContent = "Username must be 20 characters or less.";
            messageEl.style.color = "red";
            return;
        }

        if (!/^[a-z0-9_]+$/.test(username)) {
            messageEl.textContent = "Only letters, numbers, and _ allowed.";
            messageEl.style.color = "red";
            return;
        }

        messageEl.textContent = "Checking availability...";
        messageEl.style.color = "#888";

        // Check if username taken
        const { data: existing } = await supabaseClient
            .from("profiles")
            .select("username")
            .eq("username", username)
            .maybeSingle();

        if (existing) {
            messageEl.textContent = "This username is already taken.";
            messageEl.style.color = "red";
            return;
        }

        // Get current user
        const { data: { user } } = await supabaseClient.auth.getUser();

        if (!user) {
            messageEl.textContent = "You must be logged in.";
            messageEl.style.color = "red";
            setTimeout(() => window.location.href = "../index.html", 1500);
            return;
        }

        // ✅ تحقق مرة أخرى إذا كان لديه بروفايل
        const { data: existingProfile } = await supabaseClient
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();

        if (existingProfile) {
            messageEl.textContent = "You already have a profile. Redirecting...";
            messageEl.style.color = "orange";
            setTimeout(() => window.location.href = "dashboard.html", 1500);
            return;
        }

        // Save username
        const { error } = await supabaseClient
            .from("profiles")
            .insert([{ 
                id: user.id, 
                username: username 
            }]);

        if (error) {
            messageEl.textContent = "Error: " + error.message;
            messageEl.style.color = "red";
            return;
        }

        messageEl.textContent = "Username saved! Redirecting...";
        messageEl.style.color = "green";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);
    });
});