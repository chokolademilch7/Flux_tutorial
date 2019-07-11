// ============================================
// Dispatcher
// StoreとAction、StoreとComponentを繋ぐために使う
// ============================================

class Dispatcher {
  constructor() {
    this._handlers = {};
  }

  on(type, handler) {
    if (typeof this._handlers[type] === 'undefined') {
      this._handlers[type] = [];
    }
    this._handlers[type].push(handler);
  }

  emit(type, data) {
    const handlers = this._handlers[type] || [];
    for (let i = 0; i < handlers.length; i++) {
      let handler = handlers[i];
      // 他のオブジェクトのメソッド呼ぶやつ、thisを手動で指定できる
      handler.call(this, data);
    }
  }
}


// ================================================
// Store
// あるイベントがやってきたら、State(内部の状態)を更新する
// getterで外からStateを取得できるようにする
// 値が変わったことを自己申告する
// ================================================

class Store extends Dispatcher {
  constructor(dispatcher) {
    super();
    this.count = 0;
    // addEventListener的なやつ (e)"countUp"を検知したらonCountUpを発火
    dispatcher.on("countUp", this.onCountUp.bind(this));
  }

  // getter stateを外部から取得する時に使う
  getCount() {
    return this.count;
  }

  onCountUp(count) {
    if (this.count === count) {
      return;
    }
    this.count = count;
    // Stateが変わったことを自己申告
    this.emit("CHANGE");
  }
}


// ================================================
// Action
// イベントを発行する場所
// ユーザーアクションに対しての処理をかく
// ================================================

class ActionCreator {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  // Fensiのthis._dispatch()の形
  countUp(data) {
    this.dispatcher.emit("countUp", data);
  }
}


// ================================================
// Component
// ユーザイベントの受付 clickされた -> handleHoge発火など
// イベントハンドラで対応したactionを呼ぶ
// ================================================

const dispatcher = new Dispatcher();
const action = new ActionCreator(dispatcher);
const store = new Store(dispatcher);

const button = document.querySelector('.demo__button');
const result = document.querySelector('.demo__result');

let count = store.getCount();

store.on("CHANGE", () => {
  count = store.getCount();
  result.innerHTML = `カウント:${count}`;
});

// ボタンがクリックされたらアクションのカウントアップを発火
button.addEventListener('click', () => {action.countUp(count + 1)});





