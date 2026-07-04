const dashboard = {
  title: "Главная",
  gameRunning: "Игра запущена",
  gameNotRunning: "Игра не запущена",

  error: {
    title: "Не удалось загрузить",
  },

  gameStatus: "Игра",
  bepinexStatus: "BepInEx",
  detected: "Обнаружен",
  notDetected: "Не обнаружен",
  notSet: "Не указано",
  deployBepinex: "Установить BepInEx",

  stats: {
    installed: "Установлено",
    canInstall: "К установке",
    canUpdate: "Доступны обновления",
    enabled: "Включено",
  },

  modActions: "Действия с модами",
  allUpToDate: "Все моды актуальны",
  updatable_one: "Доступно обновление для {{count}} мода",
  updatable_few: "Доступны обновления для {{count}} модов",
  updatable_many: "Доступны обновления для {{count}} модов",
  updatable_other: "Доступны обновления для {{count}} модов",
  installable_one: "{{count}} к установке",
  installable_few: "{{count}} к установке",
  installable_many: "{{count}} к установке",
  installable_other: "{{count}} к установке",
  syncAll: "Обновить все",
  installAll: "Установить все",

  launchGame: "Запустить игру",
  launching: "Запуск…",

  footer: {
    game: "ИГРА",
    gameName: "Human Host",
    bepinex: "BepInEx",
    enabledRatio: "{{enabled}}/{{total}} включено",
  },

  sync: {
    inProgress: "Синхронизация модов…",
    success_one: "Синхронизирован {{count}} мод",
    success_few: "Синхронизировано {{count}} мода",
    success_many: "Синхронизировано {{count}} модов",
    success_other: "Синхронизировано {{count}} мода(-ов)",
    partial: "Синхронизировано {{ok}}, ошибок: {{failed}}",
    failedAll: "Ошибка синхронизации",
    nothing: "Нечего синхронизировать",
  },

  deploy: {
    inProgress: "Установка BepInEx…",
    progress: "{{phase}} {{percent}}%",
    success: "BepInEx установлен",
    failed: "Не удалось установить BepInEx",
    phase: {
      download: "Загрузка",
      extract: "Распаковка",
      done: "Завершение",
    },
  },

  launch: {
    starting: "Запуск игры… (через Steam, займёт несколько секунд)",
    started: "Игра запущена",
    slow: "Команда отправлена — игра ещё загружается…",
    failed: "Не удалось запустить игру",
  },

  bepinexCompat: {
    below: {
      title: "Версия BepInEx устарела",
      desc: "Обнаружена версия {{version}}, старее рекомендуемой 5.4.23.2. Некоторые моды могут работать неправильно — рекомендуется установить версию 5.4.23.2.",
    },
    above: {
      title: "Версия BepInEx новее",
      desc: "Обнаружена версия {{version}}, новее рекомендуемой 5.4.23.2. Обычно работает без проблем, но полностью не проверена; если мод ведёт себя некорректно, следуйте указаниям его автора для соответствующей версии.",
    },
    incompatible: {
      title: "Версия BepInEx несовместима",
      desc: "Обнаружена версия {{version}} — другая мажорная версия, чем та, на которую рассчитаны эти моды (BepInEx 5.x). Моды, скорее всего, не загрузятся — установите версию BepInEx 5.4.23.2.",
    },
  },

  hideManager: {
    title: "Обязательная настройка отключена",
    desc: "Этой игре нужен параметр HideManagerGameObject = true в BepInEx.cfg, иначе ни один мод BepInEx не загрузится — они выглядят установленными, но в игре ничего не делают.",
    descMissing: "Файл BepInEx.cfg ещё не создан (обычно он появляется при первом запуске игры). HHMM может создать его прямо сейчас с уже включённой обязательной настройкой — предварительный запуск игры не нужен.",
    fix: "Исправить",
    fixed: "Обязательная настройка включена — вступит в силу при следующем запуске игры",
    fixFailed: "Не удалось применить настройку",
  },
} as const;

export default dashboard;
