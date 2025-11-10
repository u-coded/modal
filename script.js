// モーダルに関連するセレクターとクラス名を定義
const MODAL_SEL = "[data-modal]";
const OPEN_SEL = "[data-modal-open]";
const CONTAINER_SEL = "[data-modal-container]";
const CLOSE_SEL = "[data-modal-close]";
const PREV_SEL = "[data-modal-prev]";
const NEXT_SEL = "[data-modal-next]";
const OPEN_CLASS = "is-open";
const CLOSE_CLASS = "is-close";

// DOM内の全てのモーダル、開閉トリガーを取得
const body = document.body;
const modals = document.querySelectorAll(MODAL_SEL);
const openTriggers = document.querySelectorAll(OPEN_SEL);
const closeTriggers = document.querySelectorAll(CLOSE_SEL);
const prevTriggers = document.querySelectorAll(PREV_SEL);
const nextTriggers = document.querySelectorAll(NEXT_SEL);

// 各モーダルを開くボタンにクリックイベントを設定
openTriggers.forEach((openTrigger) => {
  openTrigger.addEventListener("click", () => {
    const modalId = openTrigger.dataset.modalOpen;
    openModal(modalId);
  });
});

// 各モーダルを閉じるボタンにクリックイベントを設定
closeTriggers.forEach((closeTrigger) => {
  closeTrigger.addEventListener("click", () => {
    const modalId = closeTrigger.closest(MODAL_SEL).id;
    closeModal(modalId);
  });
});

// 前のモーダルを開くボタンの設定
prevTriggers.forEach((prevTrigger) => {
  prevTrigger.addEventListener("click", () => {
    const currentModal = prevTrigger.closest(MODAL_SEL);
    const prevModalId = prevTrigger.dataset.modalPrev;
    switchModal(currentModal.id, prevModalId);
  });
});

// 次のモーダルを開くボタンの設定
nextTriggers.forEach((nextTrigger) => {
  nextTrigger.addEventListener("click", () => {
    const currentModal = nextTrigger.closest(MODAL_SEL);
    const nextModalId = nextTrigger.dataset.modalNext;
    switchModal(currentModal.id, nextModalId);
  });
});

// 各モーダルに対して外部クリックやキーボードイベントを設定
modals.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    const modalId = modal.id;
    // モーダルのコンテナ以外の領域をクリックした場合にモーダルを閉じる
    if (!e.target.closest(CONTAINER_SEL)) {
      closeModal(modalId);
    }
  });

  modal.addEventListener("keydown", (e) => {
    const modalId = modal.id;
    // Escapeキーが押された場合にモーダルを閉じる
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal(modalId);
    }
  });
});

// モーダルを開く関数
function openModal(modalId, preserveScrollPosition = false) {
  const modal = document.getElementById(modalId);

  // スクロール位置を保持する場合は、既存のスクロール位置を使用
  let scrollY;
  if (preserveScrollPosition && body.dataset.scrollY) {
    scrollY = parseInt(body.dataset.scrollY, 10);
  } else {
    // 現在のスクロール位置を保存
    scrollY = window.scrollY;
    body.dataset.scrollY = scrollY.toString();
  }

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.width = "100%";

  // モーダルを開く前に body を inert に設定
  body.setAttribute("inert", "");

  modal.classList.add(OPEN_CLASS);
  modal.setAttribute("aria-hidden", "false");
  modal.showModal();

  // モーダル自体を inert の影響から除外
  modal.removeAttribute("inert");

  requestAnimationFrame(() => {
    modal.classList.remove(OPEN_CLASS);
  });
}

// モーダルを閉じる関数
function closeModal(modalId, keepScrollPosition = false) {
  const modal = document.getElementById(modalId);

  // aria-hiddenを設定する前にフォーカスを外す
  if (document.activeElement && modal.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  modal.classList.add(CLOSE_CLASS);
  modal.setAttribute("aria-hidden", "true");

  // アニメーション終了時にモーダルを閉じる処理を実行
  modal.addEventListener(
    "transitionend",
    () => {
      modal.classList.remove(CLOSE_CLASS);
      modal.close();

      // スクロール位置を保持する場合は、position: fixedを維持
      if (!keepScrollPosition) {
        // モーダルを閉じた後、body を再操作可能に
        body.removeAttribute("inert");

        // position: fixedを解除してスクロール位置を復元
        const scrollY = body.dataset.scrollY || "0";
        body.style.position = "";
        body.style.top = "";
        body.style.width = "";
        delete body.dataset.scrollY;
        window.scrollTo(0, parseInt(scrollY, 10));

        // 元の開くトリガーにフォーカスを戻す
        const openTrigger = document.querySelector(`[data-modal-open="${modalId}"]`);
        openTrigger?.focus();
      }
    },
    { once: true }
  );
}

// モーダルを切り替える関数
function switchModal(currentModalId, nextModalId) {
  // スクロール位置を保持したままモーダルを切り替える
  const currentModal = document.getElementById(currentModalId);

  // aria-hiddenを設定する前にフォーカスを外す
  if (document.activeElement && currentModal.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  currentModal.classList.add(CLOSE_CLASS);
  currentModal.setAttribute("aria-hidden", "true");

  // アニメーション終了時に次のモーダルを開く
  currentModal.addEventListener(
    "transitionend",
    () => {
      currentModal.classList.remove(CLOSE_CLASS);
      currentModal.close();

      // スクロール位置を保持したまま次のモーダルを開く
      openModal(nextModalId, true);
    },
    { once: true }
  );
}
