import { MATCH } from './data.js';

export function cloneBatter(template) {
    return structuredClone(template);
}

export function firstName(name) {
    return name.split(' ')[0];
}

export function createMatchState() {
    return {
        runs: 0,
        wickets: 0,
        targetRuns: 0,
        maxOvers: MATCH.maxOvers,
        totalBalls: MATCH.totalBalls,
        currentOver: 1,
        ballInOver: 1,
        overComplete: false,
        gameOver: false,
        overBallHistory: [],
        striker: null,
        nonStriker: null,
        currentBowler: null,
        currentDelivery: null,
    };
}

export function pickTarget() {
    return MATCH.minTarget + Math.floor(Math.random() * MATCH.targetSpan);
}

export function ballsBowled(state) {
    const completedOvers = (state.currentOver - 1) * MATCH.ballsPerOver;
    const ballsThisOver = Math.min(MATCH.ballsPerOver, Math.max(0, state.ballInOver - 1));
    return completedOvers + ballsThisOver;
}

export function oversDisplay(state) {
    const ballsThisOver = state.ballInOver > MATCH.ballsPerOver
        ? MATCH.ballsPerOver
        : Math.max(0, state.ballInOver - 1);
    return `${state.currentOver - 1}.${ballsThisOver}`;
}

export function rotateStrike(state) {
    const temp = state.striker;
    state.striker = state.nonStriker;
    state.nonStriker = temp;
}

export function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
