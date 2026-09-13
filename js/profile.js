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

    // If no username in URL, check path
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

        // DataSaver: save profile locally
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

        // Increment views
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

        const bioEl = document.getElementById("display-bio");
        if (data.bio && data.bio.trim() !== "") {
            bioEl.textContent = data.bio;
        } else {
            bioEl.style.display = "none";
        }

        document.getElementById("avatar").src = 
            data.avatar_url || 
            "https://api.dicebear.com/7.x/avataaars/svg?seed=" + data.username;

        const bannerWrapper = document.getElementById("banner-wrapper");
        if (data.banner_url && bannerWrapper) {
            document.getElementById("banner").src = data.banner_url;
        } else if (bannerWrapper) {
            bannerWrapper.style.display = "none";
        }

        document.getElementById("views-count").textContent = data.views || 0;

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
