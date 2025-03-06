var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _state, _Store_instances, setRandomSequence_fn;
const initialValue = {
  gameSequence: [
    ["49", "50", "54"],
    ["49", "50", "54"],
    ["49", "50", "54"]
  ],
  gameSequenceReadable: [
    ["1", "2", "6"],
    ["1", "2", "6"],
    ["1", "2", "6"]
  ],
  currSequence: [],
  // gameRound: 0,
  // gameDifficulty: 'easy',
  gameOver: false,
  gameRounds: 5,
  user: {
    difficulty: "easy",
    round: 0,
    sequence: [],
    sequenceRoudn: "",
    history: "",
    isHintAvailable: true,
    isUserCorrect: true,
    hp: 2,
    isRoundPass: false,
    info: ""
  }
};
class Store extends EventTarget {
  constructor() {
    super();
    __privateAdd(this, _Store_instances);
    __privateAdd(this, _state, initialValue);
    __privateSet(this, _state, initialValue);
  }
  get state() {
    return __privateGet(this, _state);
  }
  get difficultyState() {
    this.dispatchEvent(new Event("difficulty:change"));
    return __privateGet(this, _state).user.difficulty;
  }
  set difficultyState(value) {
    __privateGet(this, _state).user.difficulty = value;
  }
  get currentRound() {
    return __privateGet(this, _state).user.round;
  }
  set currentRound(value) {
    __privateGet(this, _state).user.round = value;
  }
  get isHintAvailable() {
    return __privateGet(this, _state).user.isHintAvailable;
  }
  set isHintAvailable(value) {
    __privateGet(this, _state).user.isHintAvailable = value;
  }
  get isCorrect() {
    return __privateGet(this, _state).user.isUserCorrect;
  }
  set isCorrect(value) {
    __privateGet(this, _state).user.isUserCorrect = value;
  }
  get userSequence() {
    return __privateGet(this, _state).user.sequence;
  }
  addUserSequence(value) {
    const list = __privateGet(this, _state).user.sequence;
    let history = __privateGet(this, _state).user.history;
    list.push(value);
    history = String.fromCharCode(value);
    __privateGet(this, _state).user.sequence = list;
    __privateGet(this, _state).user.history = history;
  }
  newRound() {
    this.reset();
    this.currentRound += 1;
  }
  reset() {
    __privateMethod(this, _Store_instances, setRandomSequence_fn).call(this, __privateGet(this, _state).gameRounds, __privateGet(this, _state).user.difficulty);
    this.currentRound = 0;
    __privateGet(this, _state).user.sequence = [];
    this.isHintAvailable = true;
    this.isCorrect = null;
    __privateGet(this, _state).gameOver = false;
    __privateGet(this, _state).user.hp = 2;
    __privateGet(this, _state).user.isRoundPass = false;
    __privateGet(this, _state).user.history = "";
  }
  useHint() {
    __privateGet(this, _state).user.isHintAvailable = !__privateGet(this, _state).user.isHintAvailable;
    __privateGet(this, _state).user.sequence = [];
  }
  nextRound() {
    __privateGet(this, _state).user.round += 1;
    __privateGet(this, _state).user.isUserCorrect = null;
    __privateGet(this, _state).user.isRoundPass = false;
    __privateGet(this, _state).user.sequence = [];
    __privateGet(this, _state).user.isHintAvailable = true;
    __privateGet(this, _state).user.hp = 2;
  }
  calcHP(pass) {
    if (!pass) __privateGet(this, _state).user.hp -= 1;
    if (__privateGet(this, _state).user.hp === 0) {
      __privateGet(this, _state).gameOver = true;
    }
  }
  get isGameOver() {
    return __privateGet(this, _state).gameOver;
  }
  set gameOver(value) {
    __privateGet(this, _state).gameOver = value;
  }
  get gameSequence() {
    return __privateGet(this, _state).gameSequence;
  }
  checkUserSequence(userInput, isLastInputRight) {
    let userSequence = __privateGet(this, _state).user.sequence;
    const gameSequence = __privateGet(this, _state).gameSequence;
    const round = __privateGet(this, _state).user.round;
    __privateGet(this, _state).currSequence = gameSequence[round - 1].slice();
    const currRow = __privateGet(this, _state).currSequence;
    const expectedValue = currRow[userSequence.length - 1];
    if (expectedValue !== userInput) {
      return false;
    }
    if (currRow.length === userSequence.length) {
      this.state.user.isRoundPass = true;
      return true;
    }
    return true;
  }
}
_state = new WeakMap();
_Store_instances = new WeakSet();
setRandomSequence_fn = function(len = 5, type = "easy") {
  const dict = {
    easy: "1234567890",
    medium: "QWERTYUIOPASDFGHJKLZXCVBNM",
    hard: "1234567890QWERTYUIOPASDFGHJKLZXCVBNM"
  };
  let start = 0;
  let end = dict[type].length;
  const randomNum = Math.floor(Math.random() * (end - start)) + start;
  dict[type][randomNum];
  const list = [];
  const listReadable = [];
  for (let i = 0; i < len; i += 1) {
    const row = [];
    const rowReadable = [];
    const rowLen = (i + 1) * 2;
    for (let j = 0; j < rowLen; j += 1) {
      const randomNum2 = Math.floor(Math.random() * (end - start)) + start;
      const randomChar = dict[type][randomNum2];
      rowReadable.push(randomChar);
      row.push(randomChar.charCodeAt(0).toString());
    }
    listReadable.push(rowReadable);
    list.push(row);
  }
  __privateGet(this, _state).gameSequence = list;
  __privateGet(this, _state).gameSequenceReadable = listReadable;
};
export {
  Store as S
};
