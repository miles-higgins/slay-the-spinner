import { MATCH } from './data.js';

export const EMPOWERED_NAMES = {
    defend: '🛡️ Impervious Block',
    push: '⚡ Piercing Placement',
    cut: '⚔️ Precision Slash',
    slog: '💥 Unstoppable Launch',
};

export const EMPOWERED_PERKS = {
    defend: '0.0% Wicket Risk • Free Play',
    push: 'Guaranteed 2-4 Runs • Pierces Field',
    cut: 'Zero Edge Risk • High Boundary',
    slog: 'GUARANTEED MAXIMUM 6 • Free Play',
};

const BASE_CLEAN = {
    defend: 0.80,
    push: 0.65,
    cut: 0.50,
    slog: 0.35,
};

const RISK_MULTIPLIER = {
    defend: 0.3,
    push: 0.6,
    cut: 1.4,
    slog: 2.2,
};

export function inTheZone(batter) {
    return (batter?.confidence ?? 0) >= MATCH.zoneThreshold;
}

export function calculateProbabilities(batter, delivery, shotType) {
    const isCounter = shotType === delivery.counter;
    const isHighRisk = shotType === delivery.highRiskShot;
    const zone = inTheZone(batter);

    let cleanProb = BASE_CLEAN[shotType] ?? 0.50;
    cleanProb += batter.proficiencies?.[shotType] ?? 0;
    if (isCounter) cleanProb += 0.20;
    if (isHighRisk) cleanProb -= 0.20;
    cleanProb += (batter.confidence / 100) * 0.20;
    if (zone) cleanProb += 0.25;
    cleanProb = Math.min(0.98, Math.max(0.15, cleanProb));

    let risk = RISK_MULTIPLIER[shotType] ?? 1.0;
    if (isCounter) risk *= 0.5;
    if (isHighRisk) risk *= 1.8;

    const confDampener = Math.max(0.2, 1.0 - (batter.confidence / 100) * 0.8);
    let zoneDampener = zone ? 0.2 : 1.0;
    if (zone && shotType === 'defend') zoneDampener = 0.0;

    const wicketProb = Math.min(0.35, delivery.baseWicketRisk * risk * confDampener * zoneDampener);

    return {
        cleanProb,
        wicketProb,
        isCounter,
        isHighRisk,
        inZone: zone,
    };
}
