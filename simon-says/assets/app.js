import { S as Store } from "./store.js";
import { V as View } from "./view.js";
class App {
  constructor() {
    this.view = new View();
    this.store = new Store();
    this.onStartOrResetClick = this.onStartOrResetClick.bind(this);
    this.onDifficultyClick = this.onDifficultyClick.bind(this);
    this.onVirtualKeybordClick = this.onVirtualKeybordClick.bind(this);
    this.onKeyboardPress = this.onKeyboardPress.bind(this);
    this.onRepeatOrNextClick = this.onRepeatOrNextClick.bind(this);
  }
  onStartOrResetClick(evt) {
    const currRound = this.store.currentRound;
    if (currRound === 0) {
      this.view.disableKeyboardLayout(false);
      this.view.updateUserSeqInfo(this.store.state.user.history);
      this.store.newRound();
      this.view.unBindGameDifficultyEvent(this.onDifficultyClick);
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        this.store.state.user.isRoundPass
      );
      this.view.updateRoundInfo(
        this.store.currentRound,
        this.store.state.gameRounds
      );
      this.lockInput();
      this.view.disableKeyboardLayout(true);
      this.view.disableBtn(false);
      this.view.disableDifficulty(true);
      this.view.showSequence(
        this.store.state.gameSequence[this.store.currentRound - 1]
      );
      this.view.addEventListener("showSequence:done", () => {
        this.unLockInput();
        this.view.unBindGameDifficultyEvent(this.onDifficultyClick);
        this.view.disableKeyboardLayout(false);
        this.view.disableBtn();
      });
      this.view.updateInfoGeneral("");
      console.log(
        this.store.state.gameSequenceReadable,
        "randomly generated sequence"
      );
    }
    if (currRound !== 0) {
      this.view.disableKeyboardLayout(true);
      this.store.state.user.history = "";
      this.view.updateUserSeqInfo(this.store.state.user.history);
      this.view.unBindGameDifficultyEvent(this.onDifficultyClick);
      this.store.reset();
      this.view.bindGameDifficultyEvent(this.onDifficultyClick);
      this.view.disableDifficulty(false);
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        this.store.state.user.isRoundPass
      );
      this.view.updateRoundInfo(
        this.store.currentRound,
        this.store.state.gameRounds
      );
      this.view.updateInfoGeneral("");
    }
    this.view.updateInfoGeneral("");
    this.view.udpateStartBtn(this.store.currentRound);
    this.view.unBindKeyboardEvent(this.onKeyboardPress);
    this.view.unBindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    this.view.updateUserSeqInfo(this.store.state.user.history);
  }
  onDifficultyClick(evt) {
    if (evt.target.classList.contains("difficulty")) {
      this.store.difficultyState = evt.target.id;
      this.view.updateDifficulty(this.store.difficultyState);
      this.view.renderLayout(this.store.difficultyState);
    }
  }
  processKey(code) {
    this.store.addUserSequence(code);
    const isInputPassed = this.store.checkUserSequence(
      code,
      this.store.isCorrect
    );
    this.store.isCorrect = isInputPassed;
    this.store.calcHP(isInputPassed);
    if (this.store.isGameOver) {
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        this.store.state.user.isRoundPass,
        this.store.state.gameOver
      );
      this.view.updateInfoGeneral('GAME OVER! Press "NEW GAME" to try again.');
      this.lockInput();
      this.view.disableKeyboardLayout(true);
      this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
      return;
    }
    if (!isInputPassed && this.store.state.user.hp === 1 && !this.store.isHintAvailable) {
      this.view.updateInfoGeneral(`GAME OVER! Press "NEW GAME" to try again.`);
      this.lockInput();
      this.view.disableKeyboardLayout(true);
      this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
      return;
    }
    if (!isInputPassed) {
      this.view.updateInfoGeneral(
        'Oops... Press "REPEAT" to repeat the sequence'
      );
      this.lockInput();
      this.view.disableKeyboardLayout(true);
      this.view.bindRepeatSequenceEvent(this.onRepeatOrNextClick);
      this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
      return;
    }
    if (this.store.state.user.isRoundPass && this.store.state.user.hp > 0) {
      this.view.disableKeyboardLayout();
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        this.store.state.user.isRoundPass
      );
    }
    if (isInputPassed && this.store.userSequence.length === // checking row.length by round - 1 as idx of randomSeq[[0][1][2]]
    // with user input that were pushed on click
    this.store.gameSequence[this.store.currentRound - 1].length && this.store.currentRound === this.store.state.gameRounds) {
      this.store.gameOver = true;
      this.view.updateInfoGeneral('YOU WIN! Press "NEW GAME" to start again.');
      this.view.disableKeyboardLayout(true);
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        this.store.state.user.isRoundPass,
        this.store.state.gameOver
      );
      this.lockInput();
      this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
      return;
    }
    if (isInputPassed && this.store.userSequence.length === // checking row.length by round - 1 as idx of randomSeq[[0][1][2]]
    // with user input that were pushed on click
    this.store.gameSequence[this.store.currentRound - 1].length) {
      this.view.updateInfoGeneral('NICE! Press "Next Round" to continue!');
      this.view.disableKeyboardLayout(true);
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        this.store.state.user.isRoundPass
      );
      this.lockInput();
      this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
      this.view.bindRepeatSequenceEvent(this.onRepeatOrNextClick);
    }
  }
  onVirtualKeybordClick(evt) {
    if (evt.target.classList.contains("keycap")) {
      this.processKey(evt.target.id);
      this.view.updateUserSeqInfo(this.store.state.user.history);
    }
    if (!this.store.state.user.isRoundPass) {
      this.view.bindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    }
    if (!this.store.state.user.isUserCorrect) {
      this.view.unBindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    }
  }
  onKeyboardPress(evt) {
    const codeKey = evt.key.toUpperCase().charCodeAt(0);
    let isValidKey = false;
    if (this.store.state.user.difficulty === "easy") {
      isValidKey = 48 <= codeKey && codeKey <= 57;
    } else if (this.store.state.user.difficulty === "medium") {
      isValidKey = 65 <= codeKey && codeKey <= 90 && evt.key.length === 1;
    } else if (this.store.state.user.difficulty === "hard") {
      isValidKey = 48 <= codeKey && codeKey <= 57 || 65 <= codeKey && codeKey <= 90 && evt.key.length === 1;
    }
    if (isValidKey) {
      let padKeyCod = codeKey.toString();
      this.processKey(padKeyCod);
      this.view.highlightKey(codeKey);
      this.view.updateUserSeqInfo(this.store.state.user.history);
    }
    if (!this.store.state.user.isRoundPass) {
      setTimeout(() => {
        if (!this.store.state.user.isUserCorrect) {
          this.view.unBindKeyboardEvent(this.onKeyboardPress);
        } else this.view.bindKeyboardEvent(this.onKeyboardPress);
      }, 200);
    }
    if (!this.store.state.user.isUserCorrect) {
      this.view.unBindKeyboardEvent(this.onKeyboardPress);
    }
  }
  onRepeatOrNextClick(evt) {
    this.view.disableKeyboardLayout(false);
    this.view.updateInfoGeneral("");
    this.view.updateUserSeqInfo("");
    if (this.store.state.user.isRoundPass) {
      this.store.nextRound();
      this.lockInput();
      this.view.disableKeyboardLayout(true);
      this.view.disableBtn(false);
      this.view.showSequence(
        this.store.state.gameSequence[this.store.currentRound - 1]
      );
      this.view.addEventListener("showSequence:done", () => {
        this.unLockInput();
        this.view.disableKeyboardLayout(false);
        this.view.disableBtn();
      });
    } else if (!this.store.state.user.isRoundPass && this.store.isHintAvailable) {
      this.store.useHint();
      this.lockInput();
      this.view.disableKeyboardLayout(true);
      this.view.disableBtn(false);
      this.view.showSequence(
        this.store.state.gameSequence[this.store.currentRound - 1]
      );
      this.view.addEventListener("showSequence:done", () => {
        this.unLockInput();
        this.view.disableKeyboardLayout(false);
        this.view.disableBtn();
      });
    }
    this.view.updateHelpBtn(
      this.store.currentRound,
      this.store.isHintAvailable,
      // this.store.isCorrect,
      this.store.state.user.isRoundPass
    );
    this.view.updateRoundInfo(
      this.store.currentRound,
      this.store.state.gameRounds
    );
  }
  init() {
    this.view.renderUI(this.store.state);
    this.view.bindGameDifficultyEvent(this.onDifficultyClick);
    this.view.bindRepeatSequenceEvent(this.onRepeatOrNextClick);
    this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
    this.view.updateDifficulty(this.store.difficultyState);
  }
  lockInput() {
    this.view.unBindRepeatSequenceEvent(this.onRepeatOrNextClick);
    this.view.unBindStartOrResetGameEvent(this.onStartOrResetClick);
    this.view.unBindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    this.view.unBindKeyboardEvent(this.onKeyboardPress);
  }
  unLockInput() {
    this.view.bindRepeatSequenceEvent(this.onRepeatOrNextClick);
    this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
    this.view.bindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    this.view.bindKeyboardEvent(this.onKeyboardPress);
  }
}
const app = new App();
app.init();
