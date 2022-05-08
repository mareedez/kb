import languages from '../layouts/languages.js';

export default class Keyboard {
  constructor() {
    this.shift = false;
    this.caps = false;
    this.ctrl = false;
    this.language = 'en';
    this.elements = {
      textarea: null,
      keyboardContainer: null,
    };
  }

  init() {
    this.elements.keyboardContainer = document.createElement('div');
    this.elements.keyboardContainer.classList.add('base');
    this.elements.textarea = document.createElement('textarea');
    this.about = document.createElement('div');
    this.system = document.createElement('span');
    this.system.innerText = 'Made for Windows';
    this.languageInstructions = document.createElement('span');
    this.languageInstructions.innerText = 'Press Ctrl + Alt to Switch the Language';
    this.about.classList.add('about');

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.elements.keyboardContainer.onmousedown = this.mouseEvent;
    this.elements.keyboardContainer.onmouseup = this.mouseEvent;
  }

  mouseEvent = (e) => {
    e.stopPropagation();
    if (e.target.closest('.key')) {
      const mouseButton = e.target.closest('.key');
      const code = mouseButton.marker;
      this.handleEvent({ code, type: e.type });
    }
  };

  handleEvent = (e) => {
    const functionalKeys = ['Ins', 'Home', 'PgUp', 'End', 'PgDn', 'CapsLock',
      'Shift', 'Ctrl', 'Win', 'Alt', 'Fn', '▤'];
    this.elements.textarea.focus();
    const { code, type } = e;
    const keyPressed = this.keys.find((key) => key.marker === code);
    if (!keyPressed) {
      return;
    }
    if (type === 'keydown' || type === 'mousedown') {
      keyPressed.classList.add('active');
      let nextText;
      const cursorStart = this.elements.textarea.selectionStart;
      const cursorEnd = this.elements.textarea.selectionEnd;
      if (type === 'keydown') {
        e.preventDefault();
      }
      let input = keyPressed.textContent;
      if (input === 'Shift') {
        if (!this.shift) {
          this.shift = true;
        }
        this.reload();
      }
      if (input === 'Ctrl') {
        if (!this.ctrl) {
          this.ctrl = true;
        }
      }
      if (input === 'Alt' && this.ctrl === true) {
        this.setLanguage();
      }
      if (input === 'CapsLock') {
        this.checkCaps();
        if (this.caps) {
          keyPressed.classList.add('caps-on');
        } else {
          keyPressed.classList.remove('caps-on');
        }
      }
      if (functionalKeys.includes(input)) {
        input = '';
      }
      if (input === 'Tab') {
        input = '\t';
      }
      if (input === 'Enter') {
        input = '\n';
      }
      let previousText = this.elements.textarea.value.slice(0, cursorStart);

      if (input === 'Backspace') {
        input = '';
        if (previousText) {
          if (cursorStart === cursorEnd) {
            previousText = this.elements.textarea.value.slice(0, cursorStart - 1);
          } else {
            previousText = this.elements.textarea.value.slice(0, cursorStart);
          }
        }
      }

      nextText = this.elements.textarea.value.slice(cursorEnd);
      if (nextText && input === 'Del') {
        input = '';
        nextText = nextText.slice(1);
      }
      if (input === 'Del') {
        input = '';
      }

      this.elements.textarea.value = previousText + input + nextText;
      if (keyPressed.marker === 'Delete') {
        this.elements.textarea.setSelectionRange(cursorStart, cursorStart);
      }
      if (nextText && keyPressed.marker !== 'Backspace' && keyPressed.marker !== 'Delete') {
        this.elements.textarea.setSelectionRange(cursorStart + 1, cursorStart + 1);
      }
      if (nextText && keyPressed.marker === 'Backspace' && previousText.length === 0) {
        this.elements.textarea.setSelectionRange(0, 0);
      }
      if (nextText && keyPressed.marker === 'Backspace' && previousText.length) {
        if (cursorStart === cursorEnd) {
          this.elements.textarea.setSelectionRange(cursorStart - 1, cursorStart - 1);
        } else {
          this.elements.textarea.setSelectionRange(cursorStart, cursorStart);
        }
      }
    }

    if (type === 'keyup' || type === 'mouseup') {
      keyPressed.classList.remove('active');
      if (keyPressed.textContent === 'Ctrl') {
        this.ctrl = false;
      }
      if (keyPressed.textContent === 'Shift') {
        this.shift = false;
        this.reload();
      }
    }
  };

  setLanguage() {
    if (this.language === 'en') {
      this.language = 'ru';
    } else {
      this.language = 'en';
    }
    localStorage.setItem('language', this.language);
    this.reload();
  }

  getLanguage() {
    if (localStorage.getItem('language')) {
      this.language = localStorage.getItem('language');
    } else {
      localStorage.setItem('language', this.language);
    }
  }

  checkCaps() {
    this.caps = this.caps !== true;
    this.reload();
  }

  createKeys() {
    this.keys = [];
    const keyboardFragment = document.createDocumentFragment();
    let pickLayout;
    this.getLanguage();
    if (this.language === 'ru') {
      pickLayout = languages.ru;
    } else {
      pickLayout = languages.en;
    }
    pickLayout.forEach((el) => {
      this.key = document.createElement('div');
      this.key.textContent = el.value;
      this.key.marker = el.code;
      this.key.classList.add('key');
      const green = ['Backquote', 'Digit2', 'Digit6', 'Digit8', 'Equal', 'Insert', 'Home',
        'KeyW', 'KeyR', 'KeyU', 'KeyI', 'KeyO', 'BracketLeft', 'Backslash', 'End',
        'CapsLock', 'KeyD', 'KeyG', 'KeyJ', 'Quote', 'KeyZ', 'KeyC', 'KeyN', 'Comma', 'Period', 'Slash',
        'ShiftRight', 'ControlLeft', 'AltLeft', 'Space', 'ControlRight', 'ArrowLeft', 'ArrowDown'];

      const turquoise = ['Digit1', 'Digit4', 'Minus', 'KeyT', 'Delete', 'PageDown', 'KeyS',
        'KeyH', 'KeyL', 'Semicolon', 'ShiftLeft', 'KeyV', 'KeyM', 'ArrowUp', 'AltRight', 'ContextMenu'];

      const rightStack = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'Insert', 'Home', 'PageUp',
        'Delete', 'End', 'PageDown'];

      const lastStack = ['ControlLeft', 'OSLeft', 'AltLeft', 'AltRight', 'Fn', 'ContextMenu', 'ControlRight'];

      if (green.includes(el.code)) {
        this.key.classList.add('green');
      }

      if (turquoise.includes(el.code)) {
        this.key.classList.add('turquoise');
      }

      if (rightStack.includes(el.code)) {
        this.key.classList.add('rightSide');
      }

      if (lastStack.includes(el.code)) {
        this.key.classList.add('size-macro');
      }

      if (el.code === 'Backspace') {
        this.key.classList.add('key__backspace');
      }

      if (el.code === 'Tab' || el.code === 'Backslash') {
        this.key.classList.add('size-mini');
      }

      if (el.code === 'CapsLock') {
        this.key.classList.add('key__caps');
      }

      if (el.code === 'Enter' || el.code === 'ShiftLeft') {
        this.key.classList.add('size-medium');
      }

      if (el.code === 'Enter') {
        this.key.classList.add('margin-large');
      }

      if (el.code === 'ShiftRight') {
        this.key.classList.add('margin-medium');
        this.key.classList.add('leftShift__key');
      }

      if (el.code === 'Space') {
        this.key.classList.add('space__key');
      }

      if (el.code === 'Backspace' || el.code === 'Backslash' || el.code === 'ControlRight') {
        this.key.classList.add('margin-small');
      }

      if (el.code === 'ArrowUp' || el.code === 'ArrowDown' || el.code === 'ArrowLeft' || el.code === 'ArrowRight') {
        this.key.classList.add('fas');
      }
      this.keys.push(this.key);
      keyboardFragment.append(this.key);
    });
    return keyboardFragment;
  }

  output() {
    document.body.appendChild(this.elements.textarea);
    document.body.appendChild(this.elements.keyboardContainer);
    this.elements.keyboardContainer.appendChild(this.createKeys());
    this.about.appendChild(this.languageInstructions);
    this.about.appendChild(this.system);
    document.body.appendChild(this.about);
  }

  reload() {
    this.keys.forEach((key) => {
      const keyCode = key.marker;
      let pickLayout;
      if (this.language === 'ru') {
        pickLayout = languages.ru;
      } else {
        pickLayout = languages.en;
      }
      pickLayout.forEach((letter) => {
        if (letter.code === keyCode) {
          const output = letter.value;
          const shifted = letter.shift;
          const letterPressed = key;
          if ((this.caps && !this.shift) || (!this.caps && this.shift)) {
            if (!output.match(/[^a-zа-яё]/g)) {
              letterPressed.innerText = output.toUpperCase();
            } else {
              letterPressed.innerText = output;
            }
          }
          if ((!this.caps && !this.shift) || (this.caps && this.shift)) {
            if (!output.match(/[^a-zа-яё]/g)) {
              letterPressed.innerText = output.toLowerCase();
            } else {
              letterPressed.innerText = output;
            }
          }
          if (this.shift) {
            if (shifted !== null) {
              letterPressed.innerText = shifted;
            }
          }
        }
      });
    });
  }
}

const keyboard = new Keyboard();
keyboard.init();
keyboard.output();
