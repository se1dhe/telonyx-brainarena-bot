export type TelegramWebAppUser = {
  id?: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

export type TelegramInitDataUnsafe = {
  query_id?: string
  user?: TelegramWebAppUser
  auth_date?: number
  hash?: string
  start_param?: string
}

export type TelegramWebApp = {
  initData: string
  initDataUnsafe?: TelegramInitDataUnsafe
  ready: () => void
  expand: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

export type TelegramRuntime = {
  isTelegram: boolean
  initData: string
  initDataUnsafe?: TelegramInitDataUnsafe
  user?: TelegramWebAppUser
  ready: () => void
  expand: () => void
}

const noop = () => undefined

export function getTelegramRuntime(): TelegramRuntime {
  const webApp = window.Telegram?.WebApp

  if (!webApp) {
    return {
      isTelegram: false,
      initData: '',
      ready: noop,
      expand: noop
    }
  }

  return {
    isTelegram: true,
    initData: webApp.initData,
    initDataUnsafe: webApp.initDataUnsafe,
    user: webApp.initDataUnsafe?.user,
    ready: () => webApp.ready(),
    expand: () => webApp.expand()
  }
}
