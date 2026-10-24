export const MATCH = {
    maxOvers: 5,
    ballsPerOver: 6,
    totalBalls: 30,
    maxWickets: 10,
    minTarget: 42,
    targetSpan: 11,
    zoneThreshold: 70,
    confidenceMilestones: [30, 50, 70, 90],
};

export const SHOT_TYPES = ['defend', 'push', 'cut', 'slog'];

export const SHOT_LABELS = {
    defend: 'Defend',
    push: 'Push',
    cut: 'Cut',
    slog: 'Slog',
};

export const BOWLER_ARCHETYPES = [
    {
        name: 'The Enforcer (Agile Pace)',
        avatarKey: 'enforcer',
        desc: 'Aggressive bouncers & yorkers. High wicket risk.',
        tendencies: ['bouncer', 'yorker', 'standard'],
    },
    {
        name: 'The Econ-Spinner (Tactical Spin)',
        avatarKey: 'spinner',
        desc: 'Loop-y deliveries & tight lengths. Invites slogs.',
        tendencies: ['flighted', 'standard', 'flighted'],
    },
    {
        name: 'The Swing Bowler (Seam & Swing)',
        avatarKey: 'seamer',
        desc: 'Relentless good-length channel testing patience.',
        tendencies: ['standard', 'standard', 'yorker'],
    },
];

export const DELIVERIES = {
    yorker: {
        id: 'yorker',
        name: 'Spearhead Yorker (Fast & Full)',
        counter: 'defend',
        highRiskShot: 'slog',
        baseWicketRisk: 0.04,
    },
    bouncer: {
        id: 'bouncer',
        name: 'Aggressive Bouncer (Short-pitched)',
        counter: 'cut',
        highRiskShot: 'slog',
        baseWicketRisk: 0.05,
    },
    flighted: {
        id: 'flighted',
        name: 'Looping Slow Delivery (Tossed up)',
        counter: 'slog',
        highRiskShot: 'push',
        baseWicketRisk: 0.02,
    },
    standard: {
        id: 'standard',
        name: 'Good Length Seamer (Standard Channel)',
        counter: 'push',
        highRiskShot: 'slog',
        baseWicketRisk: 0.03,
    },
};

export const BATTER_ROSTER = [
    {
        name: 'Alex (Anchor)',
        avatarKey: 'anchor',
        traitName: '🛡️ Solid Defense',
        role: 'Anchor',
        runs: 0,
        balls: 0,
        confidence: 0,
        lastReplenishMilestone: 0,
        hand: { defend: 1, push: 1, cut: 1, slog: 1 },
        proficiencies: { defend: 0.15, push: 0.15, cut: 0.0, slog: -0.10 },
    },
    {
        name: 'Sam (Power Hitter)',
        avatarKey: 'hitter',
        traitName: '💥 High Voltage Slogger',
        role: 'Hitter',
        runs: 0,
        balls: 0,
        confidence: 0,
        lastReplenishMilestone: 0,
        hand: { defend: 1, push: 1, cut: 1, slog: 1 },
        proficiencies: { defend: -0.10, push: 0.0, cut: 0.05, slog: 0.20 },
    },
    {
        name: 'Chris (Technician)',
        avatarKey: 'technician',
        traitName: '⚔️ Precision Cutter',
        role: 'Technician',
        runs: 0,
        balls: 0,
        confidence: 0,
        lastReplenishMilestone: 0,
        hand: { defend: 1, push: 1, cut: 1, slog: 1 },
        proficiencies: { defend: 0.05, push: 0.10, cut: 0.25, slog: -0.05 },
    },
];
