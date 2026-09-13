// ==========================================
// DATASAVER - Local Backup System
// ==========================================

(function() {
    const SAVE_KEY = 'profy_datasaver';

    // Save data locally
    window.saveLocalData = function(key, data) {
        try {
            const allData = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
            allData[key] = {
                data: data,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(allData));
            console.log('✅ DataSaver: Saved', key);
        } catch (err) {
            console.error('DataSaver error:', err);
        }
    };

    // Get local data
    window.getLocalData = function(key) {
        try {
            const allData = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
            return allData[key]?.data || null;
        } catch (err) {
            return null;
        }
    };

    // Clear local data
    window.clearLocalData = function(key) {
        try {
            const allData = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
            delete allData[key];
            localStorage.setItem(SAVE_KEY, JSON.stringify(allData));
        } catch (err) {}
    };

    // Get all saved keys
    window.getAllSavedKeys = function() {
        try {
            const allData = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
            return Object.keys(allData);
        } catch (err) {
            return [];
        }
    };

    // Restore profile from local
    window.restoreProfile = async function(supabaseClient) {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return null;

        const localProfile = window.getLocalData('my_profile_' + user.id);
        if (!localProfile) return null;

        console.log('🔄 Restoring profile from local...');

        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .upsert([{
                    id: user.id,
                    username: localProfile.username,
                    bio: localProfile.bio || '',
                    avatar_url: localProfile.avatar_url,
                    links: localProfile.links || []
                }], { onConflict: 'id' })
                .select()
                .single();

            if (error) {
                console.error('Restore error:', error);
                return null;
            }

            console.log('✅ Profile restored!');
            return data;
        } catch (err) {
            console.error('Restore failed:', err);
            return null;
        }
    };
})();
