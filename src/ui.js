import { MATCH, SHOT_TYPES, SHOT_LABELS } from './data.js';
import { getBatterAvatar, getBowlerAvatar } from './avatars.js';
import { calculateProbabilities, EMPOWERED_NAMES, EMPOWERED_PERKS, inTheZone } from './probability.js';
import { ballsBowled, oversDisplay } from './state.js';

function $(id) {
    return document.getElementById(id);
}

function formatHand(hand) {
    return `Def:${hand.defend} Push:${hand.push} Cut:${hand.cut} Slog:${hand.slog}`;
}

function renderBatter(prefix, batter, boxId) {
    if (!batter) return;
    const zone = inTheZone(batter);
    $(`${prefix}-avatar`).innerHTML = getBatterAvatar(batter.avatarKey);
    $(`${prefix}-info`).innerHTML = `<b>${batter.name}</b>`;
    $(`${prefix}-stats`).innerText = `${batter.runs} (${batter.balls})`;
    const sr = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '0.0';
    $(`${prefix}-sr`).innerText = `SR: ${sr}`;
    $(`${prefix}-trait`).innerText = batter.traitName;
    $(`${prefix}-hand`).innerText = `Hand: ${formatHand(batter.hand)}`;

    const pctId = prefix === 'striker' ? 'pctStriker' : 'pctNonStriker';
    const barId = prefix === 'striker' ? 'barStriker' : 'barNonStriker';
    $(pctId).innerText = `${Math.round(batter.confidence)}%`;
    const bar = $(barId);
    bar.style.width = `${batter.confidence}%`;
    bar.classList.toggle('zone-active', zone);
    $(boxId).classList.toggle('in-zone', zone);
}

function renderBallStream(state) {
    let html = '';
    for (let i = 1; i <= MATCH.ballsPerOver; i++) {
        let cls = 'ball-node';
        let valText = '-';
        let valClass = '';

        if (i <= state.overBallHistory.length) {
            cls += ' completed';
            valText = state.overBallHistory[i - 1] || '0';
            if (valText === '4') valClass = 'four';
            else if (valText === '6') valClass = 'six';
            else if (valText === 'W') valClass = 'wicket';
        } else if (i === state.ballInOver && !state.gameOver && !state.overComplete) {
            cls += ' active';
            valText = '••';
        }

        html += `
            <div class="${cls}">
                <span class="ball-num-sub">B${i}</span>
                <span class="ball-val ${valClass}">${valText}</span>
            </div>`;
    }
    $('ballStream').innerHTML = html;
}

function renderShots(state) {
    const striker = state.striker;
    if (!striker || !state.currentDelivery) return;

    const zone = inTheZone(striker);
    for (const type of SHOT_TYPES) {
        const btn = $(`btn-${type}`);
        const nameEl = $(`name-${type}`);
        const chargesEl = $(`charges-${type}`);
        const probEl = $(`prob-${type}`);
        const perkEl = $(`perk-${type}`);
        const calc = calculateProbabilities(striker, state.currentDelivery, type);

        if (zone) {
            btn.classList.add('empowered');
            nameEl.innerText = EMPOWERED_NAMES[type];
            nameEl.classList.add('empowered-name');
            perkEl.innerText = EMPOWERED_PERKS[type];
            chargesEl.innerText = '∞ FREE';
            chargesEl.classList.add('infinite');
            btn.disabled = state.gameOver;
        } else {
            btn.classList.remove('empowered');
            nameEl.innerText = SHOT_LABELS[type];
            nameEl.classList.remove('empowered-name');
            perkEl.innerText = '';
            chargesEl.innerText = `x${striker.hand[type]}`;
            chargesEl.classList.remove('infinite');
            btn.disabled = striker.hand[type] <= 0 || state.gameOver;
        }

        probEl.innerText = `${Math.round(calc.cleanProb * 100)}% Clean`;
    }
}

export function createUI() {
    function log(message, type = '') {
        const box = $('logBox');
        if (!box) return;
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerText = `> ${message}`;
        box.appendChild(entry);
        box.scrollTop = box.scrollHeight;
    }

    function setFeedback(message, type = 'normal') {
        const banner = $('liveFeedback');
        if (!banner) return;
        banner.className = `live-feedback-banner ${type}`;
        banner.innerText = message;
    }

    function render(state) {
        $('runs').innerText = state.runs;
        $('wickets').innerText = state.wickets;
        $('overs').innerText = oversDisplay(state);

        const remaining = Math.max(0, state.totalBalls - ballsBowled(state));
        const needed = Math.max(0, state.targetRuns - state.runs);
        const reqRate = remaining > 0 ? ((needed / remaining) * 6).toFixed(1) : '0.0';

        $('targetRuns').innerText = state.targetRuns;
        $('runsNeeded').innerText = needed;
        $('ballsRemaining').innerText = remaining;
        $('reqRunRate').innerText = reqRate;

        if (!state.striker) return;

        renderBatter('striker', state.striker, 'box-striker');
        renderBatter('nonstriker', state.nonStriker, 'box-nonstriker');

        const strikerZone = inTheZone(state.striker);
        $('mainContainer').classList.toggle('zone-active-bg', strikerZone);
        $('flowBanner').style.display = strikerZone ? 'block' : 'none';
        $('zonePerksBadge').style.display = strikerZone ? 'inline' : 'none';

        if (state.currentBowler) {
            $('bowler-avatar').innerHTML = getBowlerAvatar(state.currentBowler.avatarKey);
            const overNum = $('over-num-disp');
            if (overNum) overNum.innerText = state.currentOver;
            $('bowler-overview-desc').innerText =
                `${state.currentBowler.name} — "${state.currentBowler.desc}"`;
        }

        if (state.currentDelivery) {
            $('delivery-text').innerText = state.currentDelivery.name;
            $('ball-num-disp').innerText = Math.min(state.ballInOver, MATCH.ballsPerOver);
        }

        renderBallStream(state);
        renderShots(state);

        const playVisible = state.gameOver ? 'none' : '';
        $('controlPanel').style.display = playVisible;
        document.querySelector('.bowler-overview-box').style.display = playVisible;
        document.querySelector('.delivery-box').style.display = playVisible;
    }

    function bindShots(onShot) {
        for (const type of SHOT_TYPES) {
            $(`btn-${type}`).addEventListener('click', () => onShot(type));
        }
    }

    return { log, setFeedback, render, bindShots };
}
