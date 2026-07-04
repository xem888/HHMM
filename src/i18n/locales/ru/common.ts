const common = {
  ok: "ОК",
  cancel: "Отмена",
  save: "Сохранить",
  create: "Создать",
  apply: "Применить",
  delete: "Удалить",
  search: "Поиск…",
  refresh: "Обновить",
  enable: "Включить",
  disable: "Отключить",
  browse: "Обзор файлов",
  confirm: "Подтвердить",
  discard: "Отменить изменения",
  retry: "Повторить",
  reload: "Перезагрузить",
  close: "Закрыть",
  resetDefaults: "Сбросить настройки",

  loading: "Загрузка…",
  success: "Успешно",
  failed: "Ошибка",
  enabled: "Включён",
  disabled: "Отключён",
  upToDate: "Актуально",
  yes: "Да",
  no: "Нет",

  workshop: "Workshop",
  local: "Локально",

  error: {
    title: "Что-то пошло не так",
    description: "Произошла непредвиденная ошибка. Повторите попытку или перезагрузите приложение.",
  },

  unsaved: {
    title: "Несохранённые изменения",
    description: "Есть несохранённые изменения. Отменить их?",
  },
  trayShow: "Показать HHMM",
  trayQuit: "Выход",
  gameRunningBanner: "Игра запущена — изменения модов приостановлены. Сначала закройте игру.",
  update: {
    checkFailed: "Не удалось проверить обновления",
    upToDate: "У вас последняя версия",
    available: "Доступна новая версия {{version}}",
    install: "Обновить сейчас",
    downloading: "Загрузка обновления…",
    downloadingPct: "Загрузка {{pct}}%",
    installed: "Обновление установлено — перезапустите",
    installFailed: "Не удалось установить обновление",
  },
} as const;

export default common;
