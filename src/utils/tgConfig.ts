// Предотвращаем скролл на мобильных устройствах + специально для Telegram WebApp
let touchStartY = 0;

function tgConfig() {
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    // Проверяем, не происходит ли touch на элементах управления игры
    const target = e.target as HTMLElement;
    const isGameControl = target.closest('[data-game-control]');

    // Если это не элемент управления игрой, блокируем скролл
    if (!isGameControl) {
      e.preventDefault();
    }
  }, { passive: false });

  // Специально для Telegram WebApp
  window.addEventListener('load', () => {
    // Получаем доступ к Telegram WebApp API если он доступен
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      // Расширяем приложение на весь экран
      tg.expand();

      // Отключаем вертикальные свайпы
      tg.disableVerticalSwipes();

      // Устанавливаем цвет темы
      tg.setHeaderColor('#000000');

      // Говорим Telegram что приложение готово
      tg.ready();
    }

    // Дополнительная защита от скролла
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Блокируем pull-to-refresh в браузерах
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
  });
}

export { tgConfig }
