// ==========================================
// PROFILE PAGE
// ==========================================

function formatUID(num) {
    return "#" + String(num).padStart(4, "0");
}

const socialIcons = {
    instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
    discord: 'https://cdn.simpleicons.org/discord/5865F2',
    youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
    tiktok: 'https://cdn.simpleicons.org/tiktok/FFFFFF',
    twitter: 'https://cdn.simpleicons.org/x/FFFFFF',
    spotify: 'https://cdn.simpleicons.org/spotify/1DB954',
    github: 'https://cdn.simpleicons.org/github/FFFFFF',
    twitch: 'https://cdn.simpleicons.org/twitch/9146FF',
    roblox: 'https://cdn.simpleicons.org/roblox/FFFFFF',
    telegram: 'https://cdn.simpleicons.org/telegram/26A5E4',
    snapchat: 'https://cdn.simpleicons.org/snapchat/FFFC00',
    reddit: 'https://cdn.simpleicons.org/reddit/FF4500',
    steam: 'https://cdn.simpleicons.org/steam/FFFFFF',
    paypal: 'https://cdn.simpleicons.org/paypal/00457C',
    link: 'https://cdn.simpleicons.org/googlechrome/5865F2'
};

function getIcon(platform) {
    const key = (platform || '').toLowerCase();
    return socialIcons[key] || socialIcons.link;
}

async function loadProfile() {
    const loadingEl = document.getElementById("loading");
    const profileEl = document.getElementById("profile-content");
    const notFoundEl = document.getElementById("not-found");

    let username = "";
    const urlParams = new URLSearchParams(window.location.search);
    username = urlParams.get("user") || "";

    if (!username) {
        const path = window.location.pathname;
        const cleanPath = path.replace(/^\/+|\/+$/g, '');
        if (cleanPath && !cleanPath.includes('/') && cleanPath !== 'index.html') {
            username = cleanPath;
        }
    }

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

        if (window.saveLocalData) {
            window.saveLocalData('profile_' + data.username, {
                username: data.username,
                uid_number: data.uid_number,
                bio: data.bio,
                avatar_url: data.avatar_url,
                banner_url: data.banner_url,
                links: data.links,
                views: data.views,
                created_at: data.created_at
            });
        }

        // Increment views (once per IP)
        try {
            const ipRes = await fetch("https://api.ipify.org?format=json");
            const ipData = await ipRes.json();
            const viewerIp = ipData.ip;

            await supabaseClient.rpc("increment_views", { 
                profile_id: data.id, 
                viewer_ip: viewerIp 
            });
            
            const { data: updated } = await supabaseClient
                .from("profiles")
                .select("views")
                .eq("id", data.id)
                .maybeSingle();
            
            if (updated) data.views = updated.views;
        } catch (err) {
            console.log("Views increment failed:", err);
        }

        // Display Name (or username)
        const usernameEl = document.getElementById("display-username");
        usernameEl.textContent = data.display_name || data.username;

        // UID
        if (data.uid_number) {
            document.getElementById("display-uid").textContent = formatUID(data.uid_number);
        }

        // Bio
        const bioEl = document.getElementById("display-bio");
        if (data.bio && data.bio.trim() !== "") {
            bioEl.textContent = data.bio;
        } else {
            bioEl.style.display = "none";
        }

        // Location
        const locationEl = document.getElementById("display-location");
        if (locationEl && data.location) {
            locationEl.textContent = "📍 " + data.location;
        } else if (locationEl) {
            locationEl.style.display = "none";
        }

        // Avatar
        document.getElementById("avatar").src = 
            data.avatar_url || 
            "https://api.dicebear.com/7.x/avataaars/svg?seed=" + data.username;

        // Banner
        const bannerWrapper = document.getElementById("banner-wrapper");
        if (data.banner_url && bannerWrapper) {
            document.getElementById("banner").src = data.banner_url;
        } else if (bannerWrapper) {
            bannerWrapper.style.display = "none";
        }

        // Views
        document.getElementById("views-count").textContent = data.views || 0;

        // Theme Color
        if (data.theme_color) {
            document.documentElement.style.setProperty('--accent-color', data.theme_color);
            document.getElementById("avatar").style.borderColor = data.theme_color;
        }

        // Glow Effects
        if (data.glow_username) {
            usernameEl.classList.add("glow-text");
        }
        if (data.glow_socials) {
            document.querySelectorAll(".link-button").forEach(el => el.classList.add("glow-border"));
        }

        // Links
        const linksContainer = document.getElementById("links-container");
        linksContainer.innerHTML = "";

        if (data.links && Array.isArray(data.links) && data.links.length > 0) {
            data.links.forEach(link => {
                const a = document.createElement("a");
                a.href = link.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.className = "link-button";

                const iconUrl = getIcon(link.platform);

                a.innerHTML = `
                    <span class="link-icon"><img src="${iconUrl}" alt="${link.platform}"></span>
                    <span>${link.label || link.platform}</span>
                `;

                linksContainer.appendChild(a);
            });

            if (data.glow_socials) {
                document.querySelectorAll(".link-button").forEach(el => el.classList.add("glow-border"));
            }
        }

        loadingEl.style.display = "none";
        profileEl.style.display = "flex";
        document.title = (data.display_name || data.username) + " | Profy";

    } catch (err) {
        console.error("Error:", err);
        loadingEl.style.display = "none";
        notFoundEl.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);
