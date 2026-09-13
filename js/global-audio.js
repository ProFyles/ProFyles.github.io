// ==========================================
// GLOBAL AUDIO PLAYER
// يحفظ الموسيقى حتى بعد تغيير الصفحة
// ==========================================

(function() {
    const STORAGE_KEY = 'profy_current_track';
    const POSITION_KEY = 'profy_track_position';
    const PLAYING_KEY = 'profy_is_playing';

    // Create global audio element if not exists
    let audio = document.getElementById('global-audio');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'global-audio';
        audio.loop = false;
        document.body.appendChild(audio);
    }

    window.GlobalAudio = {
        audio: audio,
        
        // Load track data
        load: function(track, autoplay = true) {
            if (!track || !track.audio_url) return;
            
            const currentSrc = localStorage.getItem(STORAGE_KEY);
            const newSrc = JSON.stringify(track);
            
            // Only reload if different track
            if (currentSrc !== newSrc) {
                audio.src = track.audio_url;
                localStorage.setItem(STORAGE_KEY, newSrc);
                localStorage.setItem(POSITION_KEY, '0');
            } else {
                // Restore position
                const savedPos = parseFloat(localStorage.getItem(POSITION_KEY) || '0');
                if (savedPos > 0 && audio.readyState > 0) {
                    audio.currentTime = savedPos;
                }
            }

            // Try to play
            if (autoplay) {
                audio.play().then(() => {
                    localStorage.setItem(PLAYING_KEY, 'true');
                }).catch((err) => {
                    console.log('Autoplay blocked:', err);
                    localStorage.setItem(PLAYING_KEY, 'false');
                });
            }
        },

        // Play/Pause
        toggle: function() {
            if (audio.paused) {
                audio.play();
                localStorage.setItem(PLAYING_KEY, 'true');
            } else {
                audio.pause();
                localStorage.setItem(PLAYING_KEY, 'false');
            }
        },

        // Save position on unload
        savePosition: function() {
            if (audio.currentTime) {
                localStorage.setItem(POSITION_KEY, audio.currentTime.toString());
            }
        },

        // Clear
        clear: function() {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(POSITION_KEY);
            localStorage.removeItem(PLAYING_KEY);
            audio.pause();
            audio.src = '';
        }
    };

    // Save position before leaving
    window.addEventListener('beforeunload', window.GlobalAudio.savePosition);
    
    // Save position every 2 seconds
    setInterval(window.GlobalAudio.savePosition, 2000);
})();
