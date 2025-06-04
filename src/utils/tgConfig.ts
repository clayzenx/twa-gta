function tgConfig() {
  // Специально для Telegram WebApp
  window.Telegram?.WebApp && window.addEventListener('load', () => {
    // Получаем доступ к Telegram WebApp API если он доступен
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      // Расширяем приложение на весь экран
      tg.expand();

      // Отключаем вертикальные свайпы
      tg.disableVerticalSwipes && tg.disableVerticalSwipes();

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
