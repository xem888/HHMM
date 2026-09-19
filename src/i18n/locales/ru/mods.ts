const mods = {
  title: "Мои моды",
  subtitle: "Установленные моды Human Host",

  import: "Импорт",
  dropOverlay: {
    title: "Отпустите для установки",
    hint: "Перетащите файлы модов .dll или .zip в любое место для установки",
  },
  dropTip: "Перетащите файл мода .dll или .zip в любое место, чтобы установить его, — или используйте « Импорт » выше.",

  searchPlaceholder: "Поиск по названию или файлу…",

  filter: {
    all: "Все",
    notInstalled: "Не установлено",
    enabled: "Включённые",
    updatable: "Обновления",
  },

  sort: {
    name: "Название А-Я",
    nameDesc: "Название Я-А",
    newest: "Недавно обновлённые",
    largest: "Наибольший размер",
  },

  status: {
    canUpdate: "Обновить",
    upToDate: "Актуально",
    notInstalled: "Не установлено",
  },

  source: {
    local: "Локальный",
  },

  meta: {
    version: "v{{version}}",
    unknownVersion: "версия неизвестна",
    modified: "Обновлён {{time}}",
    unknownTime: "неизвестно",
    author: "Автор",
    updatedAt: "Последнее обновление",
    publishedAt: "Первая публикация",
    size: "Размер файла",
    file: "Файл",
  },

  time: {
    justNow: "только что",
    minutesAgo: "{{count}} мин. назад",
    hoursAgo: "{{count}} ч. назад",
    daysAgo: "{{count}} д. назад",
  },

  action: {
    openConfig: "Открыть конфиг",
    install: "Установить",
    update: "Обновить",
    uninstall: "Удалить",
  },

  uninstallConfirm: {
    title: "Удалить {{name}}?",
    workshop: "Файлы мода будут удалены из игры. Подписка сохранится, поэтому его можно установить снова в любой момент.",
    local: "Этот мод установлен вручную, и у HHMM нет его копии. Файлы будут удалены безвозвратно, восстановить их не получится.",
  },

  empty: {
    none: {
      title: "Модов пока нет",
      description:
        "Перетащите .dll мода сюда, синхронизируйте из Workshop или выберите файл для установки.",
    },
    noResults: {
      title: "Ничего не найдено",
      description: "Попробуйте другой запрос или измените фильтр.",
    },
  },

  error: {
    title: "Не удалось загрузить моды",
    description: "Произошла ошибка при сканировании установленных модов.",
  },

  toast: {
    installing: "Установка мода…",
    installed: "Установлен {{name}}",
    installFailed: "Не удалось установить {{name}}",
    installingOne: "Установка…",
    installedOne: "Установлен {{name}}",
    uninstalling: "Удаление…",
    uninstalled: "Удалён {{name}}",
    uninstallFailed: "Не удалось удалить {{name}}",
    updating: "Обновление…",
    updated: "Обновлён {{name}}",
    updateFailed: "Не удалось обновить {{name}}",
    syncing: "Синхронизация модов…",
    synced: "Синхронизирован {{count}} мод",
    synced_other: "Синхронизированы {{count}} мода(-ов)",
    syncNothing: "Все моды уже актуальны",
    syncPartial: "Синхронизировано {{ok}}, ошибок: {{failed}}",
    syncFailed: "Ошибка синхронизации",
    enabled: "Включён {{name}}",
    disabled: "Отключён {{name}}",
    toggleFailed: "Не удалось изменить состояние {{name}}",
  },
} as const;

export default mods;
