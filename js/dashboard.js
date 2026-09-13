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

    document.querySelectorAll('[data-toggle="account-group"]').forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("account-group").classList.toggle("open");
            btn.classList.toggle("active");
        });
    });

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

    const { data: profile } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (!profile) {
        window.location.href = "/Username";
        return;
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

    const dropdownMyPage = document.getElementById("dropdown-my-page");
    if (dropdownMyPage) dropdownMyPage.href = profileUrl;

    // Fix nav links
    document.querySelectorAll('.nav-item').forEach(item => {
        const label = item.querySelector('.nav-label');
        if (!label) return;
        const text = label.textContent.trim().toLowerCase();
        if (text === 'links') item.href = 'links.html';
        if (text === 'customize') item.href = 'customize.html';
        if (text === 'analytics') item.href = 'analytics.html';
        if (text === 'badges') item.href = 'badges.html';
        if (text === 'settings') item.href = 'settings.html';
    });
}
