/**
 * AVATARS MODULE (avatars.js)
 * Visual renderers for Batters & Bowlers
 */
const AvatarEngine = {
    // Batter SVG Graphics mapped by role/key
    batters: {
        anchor: `
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                    <linearGradient id="grad-anchor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0284c7" />
                        <stop offset="100%" stop-color="#0f172a" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" fill="url(#grad-anchor)" stroke="#38bdf8" stroke-width="2"/>
                <!-- Torso -->
                <path d="M 30 90 L 40 55 L 60 55 L 70 90 Z" fill="#0284c7" />
                <path d="M 45 55 L 50 90 L 55 55 Z" fill="#38bdf8" />
                <!-- Visor / Helmet -->
                <path d="M 32 36 C 32 20, 68 20, 68 36 C 68 44, 62 48, 50 48 C 38 48, 32 44, 32 36 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                <path d="M 36 32 C 40 28, 60 28, 64 32 C 66 37, 60 40, 50 40 C 40 40, 34 37, 36 32 Z" fill="#38bdf8" opacity="0.85"/>
                <!-- Grille -->
                <line x1="38" y1="42" x2="62" y2="42" stroke="#94a3b8" stroke-width="1.5"/>
                <line x1="42" y1="46" x2="58" y2="46" stroke="#94a3b8" stroke-width="1.5"/>
                <!-- Bat -->
                <path d="M 68 85 L 76 45 L 82 47 L 72 87 Z" fill="#d97706" stroke="#f59e0b" stroke-width="1"/>
            </svg>`,

        hitter: `
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                    <linearGradient id="grad-hitter" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#b45309" />
                        <stop offset="100%" stop-color="#0f172a" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" fill="url(#grad-hitter)" stroke="#f59e0b" stroke-width="2"/>
                <path d="M 28 90 L 38 52 L 62 52 L 72 90 Z" fill="#d97706" />
                <path d="M 30 34 C 30 18, 70 18, 70 34 C 70 44, 64 48, 50 48 C 36 48, 30 44, 30 34 Z" fill="#451a03" stroke="#f59e0b" stroke-width="2"/>
                <path d="M 34 30 C 40 25, 60 25, 66 30 C 68 36, 62 39, 50 39 C 38 39, 32 36, 34 30 Z" fill="#f59e0b" opacity="0.9"/>
                <line x1="36" y1="42" x2="64" y2="42" stroke="#fbbf24" stroke-width="2"/>
                <!-- Flames / Aura -->
                <path d="M 15 50 Q 10 35 20 25 Q 18 40 22 55 Z" fill="#ef4444" opacity="0.6"/>
                <path d="M 85 50 Q 90 35 80 25 Q 82 40 78 55 Z" fill="#f59e0b" opacity="0.6"/>
            </svg>`,

        technician: `
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                    <linearGradient id="grad-tech" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#6b21a8" />
                        <stop offset="100%" stop-color="#0f172a" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" fill="url(#grad-tech)" stroke="#a855f7" stroke-width="2"/>
                <path d="M 32 90 L 42 55 L 58 55 L 68 90 Z" fill="#7e22ce" />
                <path d="M 34 34 C 34 20, 66 20, 66 34 C 66 42, 60 46, 50 46 C 40 46, 34 42, 34 34 Z" fill="#1e1b4b" stroke="#a855f7" stroke-width="2"/>
                <path d="M 37 31 Q 50 26 63 31 Q 65 37 50 37 Q 35 37 37 31 Z" fill="#c084fc" opacity="0.85"/>
                <circle cx="50" cy="34" r="3" fill="#a855f7"/>
            </svg>`
    },

    // Bowler SVG Graphics mapped by archetype
    bowlers: {
        enforcer: `
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#ef4444" stroke-width="2"/>
                <path d="M 25 90 L 38 52 L 62 52 L 75 90 Z" fill="#991b1b" />
                <!-- Head & Headband -->
                <circle cx="50" cy="35" r="16" fill="#f87171" />
                <rect x="33" y="27" width="34" height="6" fill="#ef4444" rx="2" />
                <!-- Sunglasses / Goggles -->
                <path d="M 36 33 L 64 33 L 60 41 L 40 41 Z" fill="#0f172a" stroke="#ef4444" stroke-width="1.5" />
                <!-- Cricket Ball -->
                <circle cx="72" cy="62" r="9" fill="#dc2626" stroke="#f87171" stroke-width="1"/>
                <path d="M 68 55 Q 72 62 76 69" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="2,1" fill="none"/>
            </svg>`,

        spinner: `
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/>
                <path d="M 28 90 L 40 55 L 60 55 L 72 90 Z" fill="#0369a1" />
                <circle cx="50" cy="36" r="15" fill="#38bdf8" />
                <!-- Cap -->
                <path d="M 33 34 C 33 22, 67 22, 67 34 Z" fill="#0284c7" />
                <path d="M 30 34 L 70 34 L 65 38 L 35 38 Z" fill="#0369a1" />
                <!-- Orbit Trail -->
                <ellipse cx="70" cy="60" rx="14" ry="6" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,2" transform="rotate(-15 70 60)"/>
                <circle cx="78" cy="58" r="6" fill="#dc2626"/>
            </svg>`,

        seamer: `
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#10b981" stroke-width="2"/>
                <path d="M 30 90 L 40 54 L 60 54 L 70 90 Z" fill="#047857" />
                <circle cx="50" cy="35" r="15" fill="#34d399" />
                <!-- Sweatband & Hair -->
                <path d="M 36 24 Q 50 18 64 24 Q 60 30 50 30 Q 40 30 36 24 Z" fill="#065f46" />
                <rect x="35" y="30" width="30" height="4" fill="#10b981" />
                <circle cx="68" cy="65" r="7.5" fill="#dc2626"/>
                <line x1="68" y1="57.5" x2="68" y2="72.5" stroke="#ffffff" stroke-width="1.5"/>
            </svg>`
    },

    // Helper function to return SVG HTML by key
    getBatterAvatar(key) {
        return this.batters[key] || this.batters.anchor;
    },

    getBowlerAvatar(index) {
        const keys = ['enforcer', 'spinner', 'seamer'];
        return this.bowlers[keys[index % keys.length]] || this.bowlers.enforcer;
    }
};
