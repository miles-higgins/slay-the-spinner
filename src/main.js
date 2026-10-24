import { createEngine } from './engine.js';
import { createUI } from './ui.js';

const ui = createUI();
const engine = createEngine(ui);

ui.bindShots((shotType) => engine.playShot(shotType));
engine.init();
