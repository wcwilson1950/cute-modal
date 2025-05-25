/**
 * Ditch the ajax image in favor of a one element div, suggested by
 * 
 * https://css-tricks.com/single-element-loaders-the-spinner/
 * 
 */
class CuteModal extends HTMLElement {
  #shadowRoot;
  #toastContainer;
  #alert_wrapper;
  #src;
  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
    this.addEventListener('modal-open', (e) => {
      this.#handleOpen(e.detail);
    });
    this.addEventListener('options-open', (e) => {
      this.#handleOptions(e.detail);
    });
    this.addEventListener('notify', (e) => {
      this.#handleToast(e.detail);
    });
    this.addEventListener('loading-show', (e) => {
      this.#handleLoading(e.detail);
    });
  }

  connectedCallback() {
    if (!this.#src) {
      this.#src = this.getAttribute('media-path') ? this.getAttribute('media-path') : '.';
      if (this.getAttribute('media-path')) {
        this.#src = this.getAttribute('media-path')
      } else {
        const scripts = document.querySelectorAll('script');
        for (let i = 0; i < scripts.length; i++) {
          //console.log(scripts[i].getAttribute('src'));
          const src = scripts[i].getAttribute('src');
          if (src && src.indexOf('cute-modal.js') >= 0) {
            this.#src = src.replace('cute-modal.js', '');
          }
        }
      }
      const src = this.#src.replace(/\?.*$/, '');
      this.#shadowRoot.innerHTML = `<link rel="stylesheet" href="${src}css/style.css"><div class="toaster"></div>`;
      this.#toastContainer = this.#shadowRoot.querySelector('.toaster');
    }
  }

  #handleOpen(config) {
    let data;
    if (!config) {
      data = {
        type: 'info',
        closeStyle: 'circle',
        title: 'Default Title',
        message: 'This is my message to you.',
        confirmText: 'Yes',
        cancelText: 'No',
        buttonText: 'Okay',
        buttons: 'columns',
        payload: {}
      }
    } else {
      if (config.type && ['error', 'info', 'question', 'success', 'warning'].indexOf(config.type.toLowerCase()) >= 0) {
        config.type = config.type.toLowerCase();
      } else {
        config.type = 'info';
      }
      if (config.buttons && ['rows', 'columns'].indexOf(config.buttons.toLowerCase()) >= 0) {
        config.buttons = config.buttons.toLowerCase();
      } else {
        config.buttons = 'columns';
      }
      data = {
        type: config.type,
        closeStyle: config.closeStyle || 'circle',
        title: config.title || 'Default Title',
        message: config.message || 'This is my message to you.',
        confirmText: config.confirmText || 'Yes',
        cancelText: config.cancelText || 'No',
        buttonText: config.buttonText || 'Okay',
        buttons: config.buttons,
        payload: config.payload || {}
      }
    }
    this.#renderModal(data);
    this.#attachEventHandlers(data.payload);
  }
  #handleOptions(config) {
    let data;
    if (!config) {
      data = {
        type: 'info',
        closeStyle: 'circle',
        title: 'Default Title',
        message: 'This is my message to you.',
        confirmText: 'Yes',
        cancelText: 'No',
        buttonText: 'Okay',
        buttons: 'columns',
        payload: {}
      }
    } else {
      data = {
        closeStyle: config.closeStyle || 'circle',
        title: config.title || 'Default Title',
        cancelText: config.cancelText || 'No options I like.',
        options: config.options || []
      }
    }
    this.#renderOptions(data);
    this.#attachOptionsEvents(data);
  }

  #handleLoading(config) {
    const div_loader = `<div class="loader-wrapper"><div class="loader" style="color:${config.color}"></div></div>`;
    if (config.bOn) {
      // turn on afterbegin
      if (!this.#shadowRoot.querySelector('.loader-wrapper')) {
        this.#shadowRoot.querySelector('.toaster').insertAdjacentHTML('beforebegin', div_loader);
      }
    } else {
      // turn off
      if (this.#shadowRoot.querySelector('.loader-wrapper')) {
        this.#shadowRoot.querySelector('.loader-wrapper').remove();
      }
    }
  }
  #handleToast(config) {

    if (config.type && ['error', 'info', 'success', 'warning'].indexOf(config.type.toLowerCase()) >= 0) {
      config.type = config.type.toLowerCase();
    } else {
      config.type = 'info';
    }
    if (!config.message) {
      config.message = 'Default message.';
    }
    if (!config.timer || Number.isNaN(config.timer)) {
      config.timer = 3000;
    }
    const toastId = config.toastId;
    const templateContent = `
      <div class="toast-content ${config.type}-bg" id="${toastId}-toast-content">
        <div>
          <div class="toast-frame">
            <div class="toast-body">
              <img class="toast-body-img" src="${this.#src}img/${config.type}.svg" />
              <div class="toast-body-content">
                <span class="toast-message">${config.message}</span>
                <div class="toast-close" id="${toastId}-toast-close">X</div>
              </div>
            </div>
          </div>
          <div class="toast-timer ${config.type}-timer" style="animation: timer ${config.timer}ms linear;"/>
        </div>
      </div>
      `;

    const toasts = this.#shadowRoot.querySelectorAll('.toast-content');

    if (toasts.length) {
      toasts[0].insertAdjacentHTML('beforebegin', templateContent);
    } else {
      this.#toastContainer.innerHTML = templateContent;
    }
    this.#toastEventHandler(toastId, config.message, config.timer);
  }
  #toastEventHandler(toastId, message, timer) {

    const toastContent = this.#shadowRoot.getElementById(`${toastId}-toast-content`);

    setTimeout(() => {
      toastContent.remove();
      this.dispatchEvent(new CustomEvent(`toast-close-${toastId}`, { detail: { toastId, message } }));
    }, timer);

    const toastClose = this.#shadowRoot.getElementById(`${toastId}-toast-close`);

    toastClose.addEventListener('click', () => {
      toastContent.remove();
      this.dispatchEvent(new CustomEvent(`toast-close-${toastId}`, { detail: { toastId, message } }));
    });
  }

  #renderModal(config) {
    const container = document.createElement("div");

    let btnTemplate = `
      <button class="alert-button ${config.type}-bg ${config.type}-btn">${config.buttonText}</button>
      `;

    if (config.type === 'question') {
      btnTemplate = `
        <div class="question-buttons-${config.buttons}">
          <button class="confirm-button ${config.type}-bg ${config.type}-btn">${config.confirmText}</button>
          <button class="cancel-button error-bg error-btn">${config.cancelText}</button>
        </div>
        `;
    }
    container.innerHTML = `
      <div class="alert-wrapper">
        <div class="alert-frame">
          <div class="alert-header ${config.type}-bg">
            <span class="alert-close ${config.closeStyle === 'circle'
        ? 'alert-close-circle'
        : 'alert-close-default'
      }">X</span>
            <img class="alert-img" src="${this.#src}img/${config.type}.svg" />
          </div>
          <div class="alert-body">
            <span class="alert-title">${config.title}</span>
            <span class="alert-message">${config.message}</span>
            ${btnTemplate}
          </div>
        </div>
      </div>`;

    if (this.#alert_wrapper) {
      this.#alert_wrapper.remove();
    }

    this.#shadowRoot.appendChild(container);
  }
  #renderOptions(config) {
    const optionsList = config.options.map(option => {
      return `<ul class="an-option">
      <li class="title"><h2>${option.title}</h2></li>
      <li class="message">${option.message}</li>
      <li><a class="optionbutton" href="javascript:void(0)">${option.buttonText}</a></li></ul>`;
    }).join('');

    const container = document.createElement("div");
    container.innerHTML = `
<div class="alert-wrapper">
  <div class="options-frame">
    <header>${config.title}<span class="alert-close ${config.closeStyle === 'circle'
        ? 'alert-close-circle'
        : 'alert-close-default'
      }">X</span></header>    
    <main class="options-main">${optionsList}</main>
    <footer><a class="cancel" href="javascript:void(0)">${config.cancelText}</a></footer>
  </div>
</div>`;

    if (this.#alert_wrapper) {
      this.#alert_wrapper.remove();
    }

    this.#shadowRoot.appendChild(container);
  }

  #destroyModal() {
    this.#alert_wrapper.remove();
    this.#alert_wrapper = null;
  }

  #attachEventHandlers(payload) {
    const cancelButton = this.#shadowRoot.querySelector(".cancel-button");
    if (cancelButton) {
      cancelButton.addEventListener('click', e => {
        this.dispatchEvent(new CustomEvent("modal-cancel"))
        this.#destroyModal();
      });

    }
    const okButton = this.#shadowRoot.querySelector(".confirm-button");
    if (okButton) {
      okButton.addEventListener('click', e => {
        this.dispatchEvent(new CustomEvent("modal-ok", { detail: payload }));
        this.#destroyModal();
      });
    }
    const alertButton = this.#shadowRoot.querySelector(".alert-button");
    if (alertButton) {
      alertButton.addEventListener('click', e => {
        this.dispatchEvent(new CustomEvent("modal-close"))
        this.#destroyModal();
      });
    }
    const closeButton = this.#shadowRoot.querySelector(".alert-close");
    if (closeButton) {
      closeButton.addEventListener('click', e => {
        this.dispatchEvent(new CustomEvent("modal-close"))
        this.#destroyModal();
      });
    }
    this.#alert_wrapper = this.#shadowRoot.querySelector('.alert-wrapper')
  }

  #attachOptionsEvents(options) {
    const cancelButton = this.#shadowRoot.querySelector(".cancel");

    if (cancelButton) {
      cancelButton.addEventListener('click', e => {
        this.dispatchEvent(new CustomEvent("options-cancel"))
        this.#destroyModal();
      });
    }
    const closeButton = this.#shadowRoot.querySelector(".alert-close");
    if (closeButton) {
      closeButton.addEventListener('click', e => {
        this.dispatchEvent(new CustomEvent("options-close"));
        this.#destroyModal();
      });
    }
    this.#alert_wrapper = this.#shadowRoot.querySelector('.alert-wrapper');
  }
}
window.customElements.define('cute-modal', CuteModal);

cuteToast = (message, type = 'info', timer = 3000) => {
  const id = () => {
    return 't' + Math.random().toString(36).substring(2, 12);
  }
  const toastId = id();
  return new Promise((resolve, reject) => {
    const cute_modal = document.querySelector('cute-modal');
    cute_modal.dispatchEvent(new CustomEvent('notify', {
      detail: {
        type,
        message,
        timer,
        toastId
      }
    }));
    cute_modal.addEventListener(`toast-close-${toastId}`, (data) => {
      //console.log(data);
      resolve(data.detail.message);
    }, { once: true });
  });
}
cuteModal = (config) => {
  document.querySelector('cute-modal').dispatchEvent(new CustomEvent('modal-open', {
    detail: { ...config }
  }));
}
cuteLoadWait = (bOn, color = 'green') => {
  const bOnBool = Boolean(bOn);
  document.querySelector('cute-modal').dispatchEvent(new CustomEvent('loading-show', {
    detail: { bOn: bOnBool, color }
  }));
}
cuteOptions = (config) => {
  document.querySelector('cute-modal').dispatchEvent(new CustomEvent('options-open', {
    detail: { ...config }
  }));
}