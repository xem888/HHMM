const settings = {
  title: "Настройки",

  appearance: {
    title: "Внешний вид",
    description: "Тема оформления и язык интерфейса.",
    theme: "Тема",
    language: "Язык",
    minimizeToTray: "Сворачивать в трей при закрытии",
    minimizeToTrayHint:
      "Если включено, нажатие кнопки закрытия окна не завершает программу, а сворачивает HHMM в системный трей. Щёлкните значок в трее, чтобы открыть снова, или щёлкните правой кнопкой, чтобы выйти.",
  },
  theme: {
    light: "Светлая",
    dark: "Тёмная",
    system: "Системная",
  },

  environment: {
    title: "Пути и окружение",
    description: "Расположение игры и загрузчик модов BepInEx.",
    gamePath: "Путь к игре",
    gamePathEmpty: "Не указан",
    setManually: "Указать вручную",
    openFolder: "Открыть папку",
    bepinexStatus: "Статус BepInEx",
    redeploy: "Переустановить",
    notDetected: "Не обнаружен",
    logs: "Журнал",
    logsHint: "Просмотрите журнал выполнения, чтобы помочь в диагностике проблем.",
    openLogs: "Показать журнал",
  },

  about: {
    title: "О программе",
    description: "Информация о приложении и ссылки.",
    appName: "HHMM — Human Host Mod Manager",
    tagline: "Менеджер модов для Human Host.",
    version: "Версия",
    project: "Проект",
    openRepo: "Открыть на GitHub",
    checkUpdate: "Проверить обновления",
    updateUnavailable: "Проверка обновлений пока недоступна.",
  },

  toast: {
    gamePathSet: "Путь к игре обновлён",
    gamePathFailed: "Не удалось задать путь к игре",
    deploying: "Установка BepInEx…",
    deployPhase: "BepInEx: {{phase}} {{percent}}%",
    deployDone: "BepInEx установлен",
    deployFailed: "Не удалось установить BepInEx",
    openLogsFailed: "Не удалось открыть журнал",
  },

  logViewer: {
    title: "Журнал выполнения",
    subtitle: "Последние действия (показаны самые свежие записи).",
    refresh: "Обновить",
    copy: "Копировать",
    openFolder: "Открыть папку",
    clear: "Очистить",
    empty: "Записей в журнале пока нет.",
    copied: "Журнал скопирован в буфер обмена",
    copyFailed: "Не удалось скопировать журнал",
    cleared: "Журнал очищен",
    clearFailed: "Не удалось очистить журнал",
    clearConfirmTitle: "Очистить журнал?",
    clearConfirmBody:
      "Это безвозвратно удалит все текущие записи журнала, и отменить это действие нельзя.",
  },

  error: {
    title: "Не удалось загрузить настройки",
  },
} as const;

export default settings;
