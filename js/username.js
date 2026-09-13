// ==========================================
// USERNAME SETUP
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    const continueBtn = document.getElementById("continue");
    const input = document.getElementById("username");
    const messageEl = document.getElementById("message");

    if (!continueBtn) return;

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
        const { data: existingProfile } = await supabaseClient
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();

        if (existingProfile?.username) {
            window.location.href = "/dashboard";
            return;
        }
    }

    continueBtn.addEventListener("click", async () => {
        const username = input.value.trim().toLowerCase();

        // ✅ التحقق من الطول
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

        // ✅ التحقق من الرموز (حروف، أرقام، . و _ فقط)
        if (!/^[a-z0-9._]+$/.test(username)) {
            messageEl.textContent = "Only letters, numbers, dot (.) and underscore (_) allowed.";
            messageEl.style.color = "red";
            return;
        }

        // ✅ ما يبدأش بـ . أو _
        if (/^[._]/.test(username)) {
            messageEl.textContent = "Username cannot start with . or _";
            messageEl.style.color = "red";
            return;
        }

        // ✅ ما ينتهيش بـ . أو _
        if (/[._]$/.test(username)) {
            messageEl.textContent = "Username cannot end with . or _";
            messageEl.style.color = "red";
            return;
        }

        // ✅ ما فيهش .. أو __
        if (/[._]{2,}/.test(username)) {
            messageEl.textContent = "Username cannot contain consecutive . or _";
            messageEl.style.color = "red";
            return;
        }

        messageEl.textContent = "Checking availability...";
        messageEl.style.color = "#888";

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

        const { data: { user } } = await supabaseClient.auth.getUser();

        if (!user) {
            messageEl.textContent = "You must be logged in.";
            messageEl.style.color = "red";
            setTimeout(() => window.location.href = "/", 1500);
            return;
        }

        const { data: existingProfile } = await supabaseClient
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();

        if (existingProfile) {
            messageEl.textContent = "You already have a profile.";
            messageEl.style.color = "orange";
            setTimeout(() => window.location.href = "/dashboard", 1500);
            return;
        }

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
            window.location.href = "/dashboard";
        }, 1200);
    });
});
