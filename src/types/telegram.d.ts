interface TelegramWebApp {
  initData: string
  initDataUnsafe: any
  version: string
  platform: string
  close(): void
  expand(): void
  isExpanded: boolean
  ready(): void
  disableVerticalSwipes(): void
  setHeaderColor(color: string): void
  MainButton: {
    setText(text: string): void
    onClick(callback: () => void): void
    show(): void
    hide(): void
  }
  // можно дополнить при необходимости
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp
  }
}

