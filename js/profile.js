// ==========================================
// PROFILE PAGE
// ==========================================

function formatUID(num) {
    return "#" + String(num).padStart(4, "0");
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
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

let tracks = [];
let currentTrack = 0;
let isPlaying = false;

function setupSpotify(tracksData) {
    if (!tracksData || tracksData.length === 0) return;
    tracks = tracksData;
    currentTrack = 0;
    document.getElementById('spotify-player').style.display = 'flex';
    loadTrack(0, true);
}

function loadTrack(index, autoplay = false) {
    const track = tracks[index];
    if (!track) return;
    currentTrack = index;

    const audio = document.getElementById('sp-audio');
    audio.src = track.audio_url;

    document.getElementById('sp-title').textContent = track.title || 'Untitled';
    document.getElementById('sp-artist').textContent = track.artist || 'Unknown Artist';
    document.getElementById('sp-cover-img').src = track.cover_url || 
        'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (track.title || 'music');

    if (autoplay) {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayIcon();
        }).catch(() => {
            isPlaying = false;
            updatePlayIcon();
        });
    }
}

function updatePlayIcon() {
    const icon = document.getElementById('sp-play-icon');
    if (!icon) return;
    if (isPlaying) {
        icon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
    } else {
        icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }
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
            .from("profiles").select("*").eq("username", username).maybeSingle();

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
                views: data.views
            });
        }

        // Views
        try {
            const ipRes = await fetch("https://api.ipify.org?format=json");
            const ipData = await ipRes.json();
            await supabaseClient.rpc("increment_views", { 
                profile_id: data.id, viewer_ip: ipData.ip 
            });
            const { data: updated } = await supabaseClient
                .from("profiles").select("views").eq("id", data.id).maybeSingle();
            if (updated) data.views = updated.views;
        } catch (err) {}

        // Background
        const bgMedia = document.getElementById("bg-media");
        if (data.video_url) {
            const video = document.createElement("video");
            video.src = data.video_url;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            bgMedia.appendChild(video);
        } else if (data.banner_url) {
            const img = document.createElement("img");
            img.src = data.banner_url;
            bgMedia.appendChild(img);
        }

        // Avatar
        document.getElementById("avatar").src = data.avatar_url || 
            "https://api.dicebear.com/7.x/avataaars/svg?seed=" + data.username;

        // Display Name
        const usernameEl = document.getElementById("display-username");
        usernameEl.textContent = data.display_name || data.username;

        // UID
        if (data.uid_number) {
            document.getElementById("display-uid").textContent = formatUID(data.uid_number);
        }

        // Location
        const locationEl = document.getElementById("display-location");
        if (data.location) {
            locationEl.textContent = "📍 " + data.location;
        } else {
            locationEl.style.display = "none";
        }

        // Bio
        const bioEl = document.getElementById("display-bio");
        if (data.bio && data.bio.trim() !== "") {
            bioEl.textContent = data.bio;
        } else {
            bioEl.style.display = "none";
        }

        // Badges
        const badgesContainer = document.getElementById("badges-container");
        if (data.verified) badgesContainer.innerHTML += '<div class="badge-item">✅</div>';
        if (data.discord_id) badgesContainer.innerHTML += '<div class="badge-item">💬</div>';

        // Views
        document.getElementById("views-count").textContent = data.views || 0;

        // Theme
        if (data.theme_color) {
            document.documentElement.style.setProperty('--accent-color', data.theme_color);
            document.getElementById("avatar-wrapper").style.background = 
                `linear-gradient(135deg, ${data.theme_color}, #5865F2)`;
        }

        // Glow
        if (data.glow_username) {
            usernameEl.classList.add("glow-text");
            usernameEl.style.color = data.theme_color || "#a855f7";
        }
        if (data.animated_title) usernameEl.classList.add("animated-title");

        // Links
        const linksContainer = document.getElementById("links-container");
        linksContainer.innerHTML = "";

        if (data.links && Array.isArray(data.links)) {
            data.links.forEach(link => {
                const a = document.createElement("a");
                a.href = link.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.className = "link-button";
                a.innerHTML = `
                    <span class="link-icon"><img src="${getIcon(link.platform)}" alt=""></span>
                    <span class="link-label">${link.label || link.platform}</span>
                `;
                if (data.glow_socials) a.classList.add("glow-border");
                linksContainer.appendChild(a);
            });
        }

        // Spotify
        if (data.music_tracks && Array.isArray(data.music_tracks) && data.music_tracks.length > 0) {
            setupSpotify(data.music_tracks);
        } else if (data.music_url) {
            setupSpotify([{
                title: data.display_name || data.username,
                artist: 'Profy',
                cover_url: data.avatar_url,
                audio_url: data.music_url
            }]);
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

// Spotify controls
document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("sp-audio");
    const playBtn = document.getElementById("sp-play");
    const prevBtn = document.getElementById("sp-prev");
    const nextBtn = document.getElementById("sp-next");
    const progressBar = document.getElementById("sp-progress-bar");
    const progressFill = document.getElementById("sp-progress-fill");
    const currentTimeEl = document.getElementById("sp-current");
    const durationEl = document.getElementById("sp-duration");

    if (playBtn) {
        playBtn.addEventListener("click", () => {
            if (audio.paused) { audio.play(); isPlaying = true; }
            else { audio.pause(); isPlaying = false; }
            updatePlayIcon();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (tracks.length === 0) return;
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            loadTrack(currentTrack, true);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (tracks.length === 0) return;
            currentTrack = (currentTrack + 1) % tracks.length;
            loadTrack(currentTrack, true);
        });
    }

    if (progressBar) {
        progressBar.addEventListener("click", (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
        });
    }

    if (audio) {
        audio.addEventListener("timeupdate", () => {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = percent + "%";
                currentTimeEl.textContent = formatTime(audio.currentTime);
            }
        });
        audio.addEventListener("loadedmetadata", () => {
            durationEl.textContent = formatTime(audio.duration);
        });
        audio.addEventListener("ended", () => {
            currentTrack = (currentTrack + 1) % tracks.length;
            loadTrack(currentTrack, true);
        });
        audio.addEventListener("play", () => { isPlaying = true; updatePlayIcon(); });
        audio.addEventListener("pause", () => { isPlaying = false; updatePlayIcon(); });
    }

    loadProfile();
});
