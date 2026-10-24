import { MATCH, BATTER_ROSTER, BOWLER_ARCHETYPES, DELIVERIES } from './data.js';
import { cloneBatter, createMatchState, firstName, pickRandom, pickTarget, rotateStrike } from './state.js';
import { nextBatter, resolveDelivery } from './resolve.js';

export function createEngine(ui) {
    let state = createMatchState();

    function flush(messages = []) {
        for (const message of messages) {
            if (message.log) ui.log(message.log, message.logType || '');
            if (message.feedback) ui.setFeedback(message.feedback, message.feedbackType || 'normal');
        }
    }

    function setupNewBall() {
        const deliveryId = pickRandom(state.currentBowler.tendencies);
        state.currentDelivery = DELIVERIES[deliveryId];
    }

    function startOver() {
        state.overBallHistory = [];
        state.ballInOver = 1;
        state.overComplete = false;
        state.currentBowler = pickRandom(BOWLER_ARCHETYPES);
        setupNewBall();
    }

    function endMatch(reason) {
        state.gameOver = true;
        const score = `${state.runs}/${state.wickets}`;

        if (reason === 'target' || (reason === 'overs' && state.runs >= state.targetRuns)) {
            const log = reason === 'target'
                ? `🏆 MATCH WON! Target reached! (${score})`
                : `🏆 MATCH WON! Final score: ${score}`;
            ui.log(log, 'victory');
            ui.setFeedback(
                reason === 'target'
                    ? '🏆 MATCH WON! Target achieved successfully!'
                    : `🏆 MATCH WON! Final Score: ${score}`,
                'zone',
            );
        } else if (reason === 'allout') {
            ui.log(`ALL OUT! Match Lost! Final score: ${score}`, 'wicket');
            ui.setFeedback(`MATCH LOST: All out for ${state.runs}!`, 'wicket');
        } else {
            ui.log(`MATCH LOST! Ran out of overs. Final score: ${score}`, 'wicket');
            ui.setFeedback('MATCH LOST: Ran out of overs.', 'wicket');
        }

        ui.render(state);
    }

    function beginNextOver() {
        state.currentOver += 1;
        if (state.currentOver > state.maxOvers) {
            endMatch(state.runs >= state.targetRuns ? 'target' : 'overs');
            return false;
        }

        ui.log(`--- End of Over ${state.currentOver - 1}. New bowler stepping up. ---`);
        rotateStrike(state);
        startOver();
        return true;
    }

    function advanceBallOrOver() {
        if (state.gameOver) return;

        state.ballInOver += 1;
        if (state.ballInOver > MATCH.ballsPerOver) {
            state.overComplete = true;
            ui.setFeedback(
                `Over ${state.currentOver} complete. Select a shot to start the next over.`,
                'normal',
            );
            ui.render(state);
            return;
        }

        setupNewBall();
        ui.render(state);
    }

    function playShot(shotType) {
        if (state.gameOver) return;

        if (state.overComplete && !beginNextOver()) return;

        const result = resolveDelivery(state, shotType);
        flush(result.messages);

        if (result.wicket) {
            state.wickets += 1;
            state.overBallHistory.push(result.historyMark);

            if (state.wickets >= MATCH.maxWickets) {
                endMatch('allout');
                return;
            }

            state.striker = nextBatter(state.wickets);
            ui.log(`New batter (${state.striker.name}) walks to the crease.`);
            advanceBallOrOver();
            return;
        }

        state.overBallHistory.push(result.historyMark);
        state.striker.runs += result.runs;
        state.runs += result.runs;

        if (state.runs >= state.targetRuns) {
            endMatch('target');
            return;
        }

        if (result.rotateStrike) {
            rotateStrike(state);
            ui.log(`🔄 Strike rotated to ${firstName(state.striker.name)}.`);
        }

        advanceBallOrOver();
    }

    function init() {
        state = createMatchState();
        state.targetRuns = pickTarget();
        state.striker = cloneBatter(BATTER_ROSTER[0]);
        state.nonStriker = cloneBatter(BATTER_ROSTER[1]);

        ui.log(`🎯 TARGET SET: You need ${state.targetRuns} runs off ${MATCH.maxOvers} overs (${MATCH.totalBalls} balls) to win!`);
        ui.setFeedback(`Target: ${state.targetRuns} runs. Match underway!`);
        startOver();
        ui.render(state);
    }

    return {
        init,
        playShot,
        getState: () => state,
    };
}
