const initialValue = {
  gameSequence: [
    ['49', '50', '54'],
    ['49', '50', '54'],
    ['49', '50', '54'],
  ],
  gameSequenceReadable: [
    ['1', '2', '6'],
    ['1', '2', '6'],
    ['1', '2', '6'],
  ],
  currSequence: [],
  // gameRound: 0,
  // gameDifficulty: 'easy',
  gameOver: false,
  gameRounds: 2,
  user: {
    difficulty: 'easy',
    round: 0,
    sequence: [],
    history: [],
    isHintAvailable: true,
    isUserCorrect: null,
    hp: 2,
    isRoundPass: false,
  },
};

export default class Store extends EventTarget {
  #state = initialValue;

  constructor() {
    super();
    this.#state = initialValue;
  }

  get state() {
    return this.#state;
  }

  get difficultyState() {
    this.dispatchEvent(new Event('difficulty:change'));
    return this.#state.user.difficulty;
  }

  set difficultyState(value) {
    this.#state.user.difficulty = value;
  }

  get currentRound() {
    return this.#state.user.round;
  }

  set currentRound(value) {
    this.#state.user.round = value;
  }

  get isHintAvailable() {
    return this.#state.user.isHintAvailable;
  }
  set isHintAvailable(value) {
    this.#state.user.isHintAvailable = value;
  }

  get isCorrect() {
    return this.#state.user.isUserCorrect;
  }
  set isCorrect(value) {
    this.#state.user.isUserCorrect = value;
  }

  get userSequence() {
    return this.#state.user.sequence;
  }

  addUserSequence(value) {
    const list = this.#state.user.sequence;
    list.push(value);
    this.#state.user.sequence = list;
  }

  newRound() {
    this.reset();
    this.currentRound += 1;
  }

  reset() {
    this.#setRandomSequence(
      this.#state.gameRounds,
      this.#state.user.difficulty,
    );
    this.currentRound = 0;
    this.#state.user.sequence = [];
    this.isHintAvailable = true;
    this.isCorrect = null;
  }

  useHint() {
    this.#state.user.isHintAvailable = !this.#state.user.isHintAvailable;
  }

  nextRound() {
    this.#state.user.round += 1;
    this.#state.user.isUserCorrect = null;
    this.#state.user.isRoundPass = false;
    // gameover check
    // user seq
    this.#state.user.history.push(this.#state.user.sequence.slice());
    this.#state.user.sequence = [];
  }

  calcHP(pass) {
    console.log(pass, 'update HP');
    if (!pass) this.#state.user.hp -= 1;
    if (this.#state.user.hp === 0) {
      this.#state.gameOver = true;
    }
  }

  get isGameOver() {
    // this.reset()
    return this.#state.gameOver;
  }

  get gameSequence() {
    return this.#state.gameSequence;
  }

  checkUserSequence(userInput, isLastInputRight) {
    const userSequence = this.#state.user.sequence;
    const gameSequence = this.#state.gameSequence;
    const round = this.#state.user.round;

    this.#state.currSequence = gameSequence[round - 1].slice();
    const currRow = this.#state.currSequence;
    console.log(userSequence, 'user sequence[store]', isLastInputRight);

    if (isLastInputRight === false) {
      console.log('nuLKLL>?>???');
      userSequence.pop();
    }
    const expectedValue = currRow[userSequence.length - 1];

    console.log(
      userSequence,
      this.#state.currSequence,
      'arguments',
      expectedValue,
    );

    console.log(this.#state.currSequence, '133');
    console.log('expected ot input', expectedValue, userInput);
    if (expectedValue !== userInput) {
      return false;
    }
    if (currRow.length === userSequence.length) {
      console.log('NEXT');
      this.state.user.isRoundPass = true;
      return true;
    }
    return true;
  }

  #setRandomSequence(len = 5, type = 'easy') {
    // [1, 2, 6]
    // 48 .. 57 nums
    // 65 .. 90 ABC
    // 97 .. 122 abc
    const dict = {
      easy: '1234567890',
      medium: 'QWERTYUIOPASDFGHJKLZXCVBNM',
      hard: '1234567890' + 'QWERTYUIOPASDFGHJKLZXCVBNM',
    };

    const sequence = [
      ['50', '50'],
      ['49', '50', '54', '54'],
      ['49', '50', '54', '49', '50', '54'],
    ];

    let start = 0;
    let end = dict[type].length;
    const randomNum = Math.floor(Math.random() * (end - start)) + start;
    const randomChar = dict[type][randomNum];
    const list = [];
    const listReadable = [];
    for (let i = 0; i < len; i += 1) {
      const row = [];
      const rowReadable = [];
      const rowLen = (i + 1) * 2;
      for (let j = 0; j < rowLen; j += 1) {
        const randomNum = Math.floor(Math.random() * (end - start)) + start;
        const randomChar = dict[type][randomNum];
        rowReadable.push(randomChar);
        row.push(randomChar.charCodeAt(0).toString());
      }
      listReadable.push(rowReadable);
      list.push(row);
    }

    this.#state.gameSequence = list;
    this.#state.gameSequenceReadable = listReadable;
  }
}
