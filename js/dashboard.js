// ==========================================
// DASHBOARD
// ==========================================

function formatUID(num) {
    return "#" + String(num).padStart(4, "0");
}

document.addEventListener("DOMContentLoaded", async () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuToggle = document.getElementById("menu-toggle");
    const logoutBtn = document.getElementById("logout-btn");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            overlay.classList.toggle("show");
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            overlay.classList.remove("show");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await supabaseClient.auth.signOut();
            window.location.href = "/";
        });
    }

    const userMenuToggle = document.getElementById("user-menu-toggle");
    const userDropdown = document.getElementById("user-dropdown");

    if (userMenuToggle && userDropdown) {
        userMenuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle("open");
        });

        document.addEventListener("click", () => {
            userDropdown.classList.remove("open");
        });
    }

    await loadDashboardData();
});

async function loadDashboardData() {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        window.location.href = "/";
        return;
    }

    let { data: profile } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    // DataSaver: try restore if profile missing
    if (!profile && window.restoreProfile) {
        console.log('Profile not found, trying restore...');
        profile = await window.restoreProfile(supabaseClient);
    }

    if (!profile) {
        window.location.href = "/username";
        return;
    }

    // ==========================================
    // AUTO-AGREE TO TERMS
    // ==========================================
    if (!profile.terms_agreed) {
        await supabaseClient
            .from("profiles")
            .update({ terms_agreed: true })
            .eq("id", user.id);
        profile.terms_agreed = true;
    }

    // DataSaver: save profile locally
    if (window.saveLocalData) {
        window.saveLocalData('my_profile_' + user.id, {
            username: profile.username,
            uid_number: profile.uid_number,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            banner_url: profile.banner_url,
            links: profile.links,
            views: profile.views
        });
    }

    const usernameEl = document.getElementById("display-username");
    if (usernameEl) usernameEl.textContent = profile.username;

    if (profile.uid_number) {
        const uidEl = document.getElementById("display-uid");
        if (uidEl) uidEl.textContent = formatUID(profile.uid_number);

        const uidNote = document.getElementById("uid-note");
        if (uidNote) {
            uidNote.textContent = "Joined " + new Date(profile.created_at).toLocaleDateString();
        }
    }

    const viewsEl = document.getElementById("display-views");
    if (viewsEl) viewsEl.textContent = profile.views || 0;

    const bottomUsername = document.getElementById("bottom-username");
    if (bottomUsername) bottomUsername.textContent = profile.username;

    const bottomUid = document.getElementById("bottom-uid");
    if (bottomUid && profile.uid_number) {
        bottomUid.textContent = "UID " + formatUID(profile.uid_number);
    }

    const avatarImg = document.getElementById("user-avatar-img");
    if (avatarImg) {
        avatarImg.src = profile.avatar_url || 
            "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.username;
    }

    const profileUrl = "/" + profile.username;

    const myPageLink = document.getElementById("my-page-link");
    if (myPageLink) myPageLink.href = profileUrl;

    // ==========================================
    // BUILD DROPDOWN MENU DYNAMICALLY
    // ==========================================
    const dropdown = document.getElementById("user-dropdown");
    if (dropdown) {
        dropdown.innerHTML = `
            <a href="/dashboard" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Account</span>
            </a>
            <a href="/customize" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                <span>Customize</span>
            </a>
            <a href="/links" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span>Links</span>
            </a>
            <a href="/badges" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                <span>Badges</span>
            </a>
            <a href="/settings" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span>Settings</span>
            </a>
            <div class="dropdown-divider" style="height:1px;background:#1a1a1a;margin:6px 0;"></div>
            <a href="/terms" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <span>Terms</span>
            </a>
            <a href="/credits" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                <span>Credits</span>
            </a>
            <a href="${profileUrl}" target="_blank" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                <span>My Page</span>
            </a>
        `;
    }
}
