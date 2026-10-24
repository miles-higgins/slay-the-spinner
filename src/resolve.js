import { MATCH, SHOT_TYPES, BATTER_ROSTER } from './data.js';
import { calculateProbabilities } from './probability.js';
import { cloneBatter, firstName } from './state.js';

function spendCard(batter, shotType) {
    batter.hand[shotType] = Math.max(0, batter.hand[shotType] - 1);
}

export function applyConfidenceMilestones(batter) {
    const messages = [];
    for (const milestone of MATCH.confidenceMilestones) {
        if (batter.confidence >= milestone && batter.lastReplenishMilestone < milestone) {
            batter.lastReplenishMilestone = milestone;
            for (const shot of SHOT_TYPES) {
                batter.hand[shot] += 1;
            }
            messages.push({
                log: `✨ CONFIDENCE MILESTONE (${milestone}%)! +1 Card charges gained!`,
                logType: 'replenish',
                feedback: `✨ MILESTONE REACHED (${milestone}%)! Hand Refilled!`,
                feedbackType: 'zone',
            });
        }
    }
    return messages;
}

export function nextBatter(wickets) {
    return cloneBatter(BATTER_ROSTER[wickets % BATTER_ROSTER.length]);
}

function cleanRuns(shotType, inZone) {
    if (inZone) {
        if (shotType === 'slog') return 6;
        if (shotType === 'cut') return 4;
        if (shotType === 'push') return Math.random() < 0.5 ? 4 : 2;
        if (shotType === 'defend') return 1;
        return 0;
    }
    if (shotType === 'defend') return 0;
    if (shotType === 'push') return Math.random() < 0.6 ? 1 : 2;
    if (shotType === 'cut') return Math.random() < 0.7 ? 4 : 2;
    if (shotType === 'slog') return Math.random() < 0.5 ? 6 : 4;
    return 0;
}

export function resolveDelivery(state, shotType) {
    const striker = state.striker;
    const calc = calculateProbabilities(striker, state.currentDelivery, shotType);
    const messages = [];
    const name = firstName(striker.name);

    striker.balls += 1;

    if (Math.random() < calc.wicketProb) {
        if (!calc.inZone) spendCard(striker, shotType);
        striker.confidence = Math.max(0, striker.confidence - 35);
        messages.push({
            log: `❌ WICKET! ${name} out playing ${shotType}!`,
            logType: 'wicket',
            feedback: `❌ WICKET FALLEN! ${name} is out!`,
            feedbackType: 'wicket',
        });
        return {
            wicket: true,
            runs: 0,
            historyMark: 'W',
            rotateStrike: false,
            messages,
        };
    }

    let outcomeRuns = 0;
    const isMishit = Math.random() > calc.cleanProb;

    if (!isMishit) {
        outcomeRuns = cleanRuns(shotType, calc.inZone);

        if (calc.inZone) {
            messages.push({
                log: `⚡ ZONE POWER! ${name} smashes ${outcomeRuns} RUNS!`,
                logType: 'zone-op',
                feedback: `⚡ ZONE SLAM! ${outcomeRuns} RUNS SCORED!`,
                feedbackType: 'zone',
            });
        } else {
            let confGain = (shotType === 'slog' || shotType === 'cut') ? 12 : 8;
            if (calc.isHighRisk) {
                confGain += 25;
                messages.push({
                    log: `🔥 HIGH RISK SURGE! (+${confGain}% Conf)`,
                    logType: 'surge',
                    feedback: `🔥 COUNTER SUCCESS: ${outcomeRuns} Run(s) [High Risk Surge]!`,
                    feedbackType: 'boundary',
                });
            } else {
                messages.push({
                    log: `${name} plays a clean ${shotType} for ${outcomeRuns} run(s).`,
                    logType: '',
                    feedback: outcomeRuns >= 4
                        ? `💥 BOUNDARY! ${outcomeRuns} RUNS SCORED!`
                        : outcomeRuns === 0
                            ? 'Dot ball played defensively.'
                            : `Clean play: Scored ${outcomeRuns} run(s).`,
                    feedbackType: outcomeRuns >= 4 ? 'boundary' : 'normal',
                });
            }

            striker.confidence = Math.min(100, striker.confidence + confGain);
            messages.push(...applyConfidenceMilestones(striker));
        }

        if (
            striker.confidence >= MATCH.zoneThreshold
            && (striker.confidence - 20) < MATCH.zoneThreshold
            && !calc.inZone
        ) {
            messages.push({
                log: `⚡ ${name} ENTERED THE ZONE!`,
                logType: 'surge',
                feedback: `⚡ ${name} ENTERED THE ZONE (FLOW STATE)!`,
                feedbackType: 'zone',
            });
        }
    } else if (calc.inZone) {
        outcomeRuns = 1;
        striker.confidence = Math.max(0, striker.confidence - 18);
        messages.push({
            log: '⚠️ Mistimed in Zone! Scrambled 1 run. (-18% Conf)',
            logType: 'mishit',
            feedback: '⚠️ Zone hit mistimed! Scrambled 1 run.',
            feedbackType: 'normal',
        });
    } else {
        spendCard(striker, shotType);
        if (Math.random() < 0.50) {
            outcomeRuns = 1;
            striker.confidence = Math.max(0, striker.confidence - 10);
            messages.push({
                log: `⚠️ Thick outside edge! Scrambled 1 hurried run. Spent 1 ${shotType} card.`,
                logType: 'mishit',
                feedback: '⚠️ Edge! Scrambled 1 run [Card Spent].',
                feedbackType: 'wicket',
            });
        } else {
            outcomeRuns = 0;
            striker.confidence = Math.max(0, striker.confidence - 12);
            messages.push({
                log: `⚠️ Mishit bat-pad block. Dot ball. Spent 1 ${shotType} card.`,
                logType: 'mishit',
                feedback: '⚠️ Mishit dot ball [Card Spent].',
                feedbackType: 'wicket',
            });
        }
    }

    if (calc.inZone) {
        striker.confidence -= 6;
        if (striker.confidence < MATCH.zoneThreshold) {
            messages.push({ log: '💔 Lost Flow State!', logType: 'mishit' });
        }
    }

    return {
        wicket: false,
        runs: outcomeRuns,
        historyMark: String(outcomeRuns),
        rotateStrike: outcomeRuns % 2 !== 0,
        messages,
    };
}
