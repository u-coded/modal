// モーダルに関連するセレクターとクラス名を定義
const MODAL_SEL = "[data-modal]"; // モーダル要素を示すセレクター
const OPEN_SEL = "[data-modal-open]"; // モーダルを開くボタンのセレクター
const CONTAINER_SEL = "[data-modal-container]"; // モーダルのコンテンツを囲むコンテナのセレクター
const CLOSE_SEL = "[data-modal-close]"; // モーダルを閉じるボタンのセレクター

const OPEN_CLASS = "is-open"; // モーダルが開かれているときに付与するクラス
const CLOSE_CLASS = "is-close"; // モーダルが閉じられるときに付与するクラス

// DOM内の全てのモーダル、開閉トリガーを取得
const body = document.body;
const modals = document.querySelectorAll(`${MODAL_SEL}`);
const openTriggers = document.querySelectorAll(`${OPEN_SEL}`);
const closeTriggers = document.querySelectorAll(`${CLOSE_SEL}`);

// 各モーダルを開くボタンにクリックイベントを設定
openTriggers.forEach((openTrigger) => {
  openTrigger.addEventListener("click", () => {
    const modalId = openTrigger.dataset.modalOpen; // data-modal-open属性からモーダルIDを取得
    openModal(modalId); // モーダルを開く関数を呼び出し
  });
});

// 各モーダルを閉じるボタンにクリックイベントを設定
closeTriggers.forEach((closeTrigger) => {
  closeTrigger.addEventListener("click", () => {
    const modalId = closeTrigger.closest(MODAL_SEL).id; // 閉じるボタンの親要素からモーダルIDを取得
    closeModal(modalId); // モーダルを閉じる関数を呼び出し
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
      e.preventDefault(); // デフォルトの動作を防ぐ
      closeModal(modalId);
    }
  });
});

// モーダルを開く関数
function openModal(modalId) {
  const modal = document.getElementById(modalId); // モーダルIDに基づいてモーダル要素を取得

  // モーダルを開く前に body を inert に設定
  body.setAttribute("inert", "");

  modal.classList.add(OPEN_CLASS); // モーダルを開くクラスを追加
  modal.setAttribute("aria-hidden", "false"); // アクセシビリティ用にaria-hidden属性をfalseに設定
  modal.showModal(); // ネイティブのshowModal()でモーダルを表示

  // モーダル自体を inert の影響から除外
  modal.removeAttribute("inert");

  body.style.overflow = "hidden";
  body.style.height = "100vh";

  requestAnimationFrame(() => {
    modal.classList.remove(OPEN_CLASS); // 開いた後にOPEN_CLASSを削除
  });
}

// モーダルを閉じる関数
function closeModal(modalId) {
  const modal = document.getElementById(modalId); // モーダルIDに基づいてモーダル要素を取得
  modal.classList.add(CLOSE_CLASS); // モーダルを閉じるクラスを追加
  modal.setAttribute("aria-hidden", "true"); // アクセシビリティ用にaria-hidden属性をtrueに設定

  body.style.overflow = "";
  body.style.height = "";

  // アニメーション終了時にモーダルを閉じる処理を実行
  modal.addEventListener(
    "transitionend",
    () => {
      modal.classList.remove(CLOSE_CLASS); // 閉じるクラスを削除
      modal.close(); // ネイティブのclose()でモーダルを閉じる

      // モーダルを閉じた後、body を再操作可能に
      body.removeAttribute("inert");

      // 元の開くトリガーにフォーカスを戻す
      const openTrigger = document.querySelector(
        `[data-modal-open="${modalId}"]`
      );
      openTrigger?.focus();
    },
    { once: true } // 一度だけ実行するリスナー
  );
}
