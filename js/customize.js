// ==========================================
// CUSTOMIZE PAGE - Full Logic
// ==========================================

let currentUser = null;
let currentProfile = null;
let uploadedAvatarUrl = null;
let uploadedBannerUrl = null;
let uploadedVideoUrl = null;
let musicTracks = [];
let newTrackCoverUrl = null;
let newTrackAudioUrl = null;

// ==========================================
// INIT
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) { window.location.href = "/"; return; }
    currentUser = user;

    const { data: profile } = await supabaseClient
        .from("profiles").select("*").eq("id", user.id).maybeSingle();

    if (!profile) { window.location.href = "/Login"; return; }
    currentProfile = profile;

    loadExistingData(profile);
    setupUploadHandlers();
    setupToggles();
    setupColorPicker();
    setupMusicHandlers();
    setupSaveButton();
    setupSidebar();
});

// ==========================================
// LOAD EXISTING DATA
// ==========================================
function loadExistingData(profile) {
    document.getElementById("live-avatar").src = profile.avatar_url || 
        "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.username;
    document.getElementById("live-name").textContent = profile.display_name || profile.username;
    document.getElementById("live-uid").textContent = "#" + String(profile.uid_number || 0).padStart(4, "0");

    if (profile.avatar_url) {
        const av = document.getElementById("avatar-preview");
        av.src = profile.avatar_url;
        av.classList.add("show");
        uploadedAvatarUrl = profile.avatar_url;
    }

    if (profile.banner_url) {
        const bn = document.getElementById("banner-preview");
        bn.src = profile.banner_url;
        bn.classList.add("show");
        uploadedBannerUrl = profile.banner_url;
    }

    if (profile.video_url) {
        const vd = document.getElementById("video-preview");
        vd.src = profile.video_url;
        vd.classList.add("show");
        uploadedVideoUrl = profile.video_url;
    }

    document.getElementById("display-name").value = profile.display_name || "";
    document.getElementById("bio").value = profile.bio || "";
    document.getElementById("location").value = profile.location || "";

    const color = profile.theme_color || "#a855f7";
    document.getElementById("theme-color").value = color;
    document.getElementById("color-preview").style.background = color;

    document.querySelectorAll(".toggle-switch").forEach(t => {
        const key = t.dataset.key;
        if (profile[key]) {
            t.classList.add("active");
            const card = t.closest(".toggle-card");
            if (card) card.classList.add("active");
        }
    });

    musicTracks = profile.music_tracks || [];
    renderTracks();
}

// ==========================================
// UPLOAD HANDLERS
// ==========================================
function setupUploadHandlers() {
    document.getElementById("avatar-upload").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = await uploadFile(file, "avatars");
        if (url) {
            uploadedAvatarUrl = url;
            const p = document.getElementById("avatar-preview");
            p.src = url;
            p.classList.add("show");
            document.getElementById("live-avatar").src = url;
        }
    });

    document.getElementById("banner-upload").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = await uploadFile(file, "banners");
        if (url) {
            uploadedBannerUrl = url;
            const p = document.getElementById("banner-preview");
            p.src = url;
            p.classList.add("show");
        }
    });

    document.getElementById("video-upload").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = await uploadFile(file, "videos");
        if (url) {
            uploadedVideoUrl = url;
            const p = document.getElementById("video-preview");
            p.src = url;
            p.classList.add("show");
        }
    });

    document.getElementById("track-cover").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = await uploadFile(file, "covers");
        if (url) {
            newTrackCoverUrl = url;
            const p = document.getElementById("cover-preview");
            p.src = url;
            p.style.display = "block";
        }
    });

    document.getElementById("track-audio").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = await uploadFile(file, "audio");
        if (url) {
            newTrackAudioUrl = url;
            document.getElementById("audio-status").textContent = "✅ Audio uploaded";
        }
    });
}

// ==========================================
// UPLOAD FILE TO SUPABASE
// ==========================================
async function uploadFile(file, folder) {
    const progressEl = document.getElementById(folder + "-progress");
    if (progressEl) progressEl.textContent = "Uploading...";

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentUser.id}/${folder}/${Date.now()}.${fileExt}`;

        const { error } = await supabaseClient.storage
            .from("profy-assets")
            .upload(fileName, file, { upsert: true, cacheControl: '3600' });

        if (error) {
            console.error("Upload error:", error);
            if (progressEl) progressEl.textContent = "❌ " + error.message;
            return null;
        }

        const { data: { publicUrl } } = supabaseClient.storage
            .from("profy-assets")
            .getPublicUrl(fileName);

        if (progressEl) progressEl.textContent = "✅ Uploaded";
        return publicUrl;
    } catch (err) {
        console.error("Upload failed:", err);
        if (progressEl) progressEl.textContent = "❌ Upload failed";
        return null;
    }
}

// ==========================================
// TOGGLES
// ==========================================
function setupToggles() {
    document.querySelectorAll(".toggle-switch").forEach(t => {
        t.addEventListener("click", () => {
            t.classList.toggle("active");
            const card = t.closest(".toggle-card");
            if (card) card.classList.toggle("active");
        });
    });
}

// ==========================================
// COLOR PICKER
// ==========================================
function setupColorPicker() {
    document.querySelectorAll(".color-preset").forEach(p => {
        p.addEventListener("click", () => {
            const color = p.dataset.color;
            document.getElementById("theme-color").value = color;
            document.getElementById("color-preview").style.background = color;
            document.querySelectorAll(".color-preset").forEach(x => x.classList.remove("active"));
            p.classList.add("active");
        });
    });

    document.getElementById("theme-color").addEventListener("input", (e) => {
        document.getElementById("color-preview").style.background = e.target.value;
    });
}

// ==========================================
// MUSIC TRACKS
// ==========================================
function setupMusicHandlers() {
    document.getElementById("add-track-btn").addEventListener("click", () => {
        const title = document.getElementById("track-title").value.trim();
        const artist = document.getElementById("track-artist").value.trim();

        if (!title) { alert("Please enter a track title"); return; }
        if (!newTrackAudioUrl) { alert("Please upload an audio file"); return; }

        musicTracks.push({
            title: title,
            artist: artist || "Unknown Artist",
            cover_url: newTrackCoverUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + title,
            audio_url: newTrackAudioUrl
        });

        document.getElementById("track-title").value = "";
        document.getElementById("track-artist").value = "";
        document.getElementById("cover-preview").style.display = "none";
        document.getElementById("audio-status").textContent = "";
        newTrackCoverUrl = null;
        newTrackAudioUrl = null;

        renderTracks();
    });
}

function renderTracks() {
    const container = document.getElementById("tracks-list");
    container.innerHTML = "";

    if (musicTracks.length === 0) {
        container.innerHTML = '<p style="color:#555;font-size:12px;text-align:center;padding:10px;">No tracks yet. Add one below.</p>';
        return;
    }

    musicTracks.forEach((track, i) => {
        const div = document.createElement("div");
        div.className = "track-card";
        div.innerHTML = `
            <div class="track-cover-small"><img src="${track.cover_url}"></div>
            <div class="track-info-small">
                <div class="track-title-small">${track.title}</div>
                <div class="track-artist-small">${track.artist}</div>
            </div>
            <button class="track-remove" onclick="removeTrack(${i})">✕</button>
        `;
        container.appendChild(div);
    });
}

window.removeTrack = (index) => {
    musicTracks.splice(index, 1);
    renderTracks();
};

// ==========================================
// SAVE
// ==========================================
function setupSaveButton() {
    document.getElementById("save-btn").addEventListener("click", async () => {
        const status = document.getElementById("save-status");
        status.textContent = "Saving...";

        const updates = {
            avatar_url: uploadedAvatarUrl || currentProfile.avatar_url,
            banner_url: uploadedBannerUrl || currentProfile.banner_url,
            video_url: uploadedVideoUrl || currentProfile.video_url,
            display_name: document.getElementById("display-name").value.trim() || null,
            bio: document.getElementById("bio").value.trim() || "",
            location: document.getElementById("location").value.trim() || null,
            theme_color: document.getElementById("theme-color").value.trim() || "#a855f7",
            music_tracks: musicTracks,
            glow_username: document.getElementById("glow-username").classList.contains("active"),
            glow_socials: document.getElementById("glow-socials").classList.contains("active"),
            glow_badges: document.getElementById("glow-badges").classList.contains("active"),
            animated_title: document.getElementById("animated-title").classList.contains("active")
        };

        const { error } = await supabaseClient
            .from("profiles").update(updates).eq("id", currentUser.id);

        if (error) {
            status.textContent = "❌ " + error.message;
            return;
        }

        status.textContent = "✅ Saved!";
        setTimeout(() => { status.textContent = "No changes"; }, 2000);
    });

    document.getElementById("reset-btn").addEventListener("click", () => {
        if (confirm("Reset all changes?")) window.location.reload();
    });
}

// ==========================================
// SIDEBAR
// ==========================================
function setupSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const toggle = document.getElementById("menu-toggle");

    if (toggle) toggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("show");
    });

    if (overlay) overlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
    });

    const logout = document.getElementById("logout-btn");
    if (logout) logout.addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        window.location.href = "/";
    });
}
