function formatUID(num) {
    return "#" + String(num).padStart(4, "0");
}

async function loadProfile() {
    const loadingEl = document.getElementById("loading");
    const profileEl = document.getElementById("profile-content");
    const notFoundEl = document.getElementById("not-found");

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("user") || "";

    if (!username || username.includes(".html")) {
        loadingEl.style.display = "none";
        notFoundEl.style.display = "block";
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("username", username)
            .maybeSingle();

        if (error || !data) {
            loadingEl.style.display = "none";
            notFoundEl.style.display = "block";
            return;
        }

        // ✅ Increment views
        try {
            await supabaseClient.rpc("increment_views", { profile_id: data.id });
            data.views = (data.views || 0) + 1;
        } catch (err) {
            console.log("Views increment failed:", err);
        }

        document.getElementById("display-username").textContent = data.username;

        if (data.uid_number) {
            document.getElementById("display-uid").textContent = formatUID(data.uid_number);
        }

        if (data.bio && data.bio.trim() !== "") {
            document.getElementById("display-bio").textContent = data.bio;
        } else {
            document.getElementById("display-bio").style.display = "none";
        }

        document.getElementById("avatar").src = 
            data.avatar_url || 
            "https://api.dicebear.com/7.x/avataaars/svg?seed=" + data.username;

        if (data.views !== undefined && data.views !== null) {
            document.getElementById("views-count").textContent = data.views;
        }

        loadingEl.style.display = "none";
        profileEl.style.display = "flex";
        document.title = data.username + " | Profy";

    } catch (err) {
        console.error("Error:", err);
        loadingEl.style.display = "none";
        notFoundEl.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);