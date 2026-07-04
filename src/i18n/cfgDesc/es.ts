const d: Record<string, Record<string, string>> = {
  "humanhost.admin.panel.cfg": {
    OverrideFov:
      "Usa el FOV que indiques aquí abajo en lugar del campo de visión por defecto del juego.",
    Fov: "Campo de visión de la cámara, en grados. Cuanto más alto, más amplia será la imagen.",
    OverrideCamOffset:
      "Reposiciona la cámara con los tres valores de abajo (derecha, arriba y atrás).",
    CamOffsetRight:
      "Desplazamiento horizontal de la cámara, en metros: positivo hacia la derecha, negativo hacia la izquierda.",
    CamOffsetUp:
      "Desplazamiento vertical de la cámara, en metros: positivo hacia arriba, negativo hacia abajo.",
    CamOffsetBack:
      "Acerca o aleja la cámara en la dirección a la que mira el personaje, en metros: positivo hacia delante, negativo hacia atrás.",
    Debuffs:
      "Lista de efectos negativos a los que serás inmune, separados por comas.",
    SavedPoints:
      "Puntos de teletransporte guardados, uno por línea con el formato nombre|x|y|z.",
    X: "Posición horizontal de la esquina superior izquierda del panel.",
    Y: "Posición vertical de la esquina superior izquierda del panel.",
    Width: "Ancho del panel.",
    Height: "Alto del panel.",
  },
  "humanhost.quickloot.cfg": {
    EnableDebug:
      "No lo toques. Sirve únicamente para que el autor del mod depure errores.",
    Hotkey:
      "Tecla para recoger de golpe todo el botín cercano. Admite combinaciones, por ejemplo «X» o «LeftControl + X».",
    Radius:
      "Radio de recogida alrededor del personaje, en metros.",
    GroundItems: "Recoge los objetos sueltos que haya por el suelo.",
    GroundResources:
      "Recoge también los recursos del suelo que normalmente tendrías que apuntar para coger.",
    WorldContainers:
      "Saquea automáticamente los contenedores del mundo. El almacenamiento que hayas colocado tú nunca se toca.",
    ZombieCorpses:
      "Saquea automáticamente los cadáveres de los zombis que mates.",
  },
  "humanhost.stack.customizer.cfg": {
    ScanOnStartup:
      "OPCIÓN DE DESARROLLADOR: NO LA CAMBIES salvo que sepas lo que haces. Recorre todo el catálogo de Addressables para volcar la lista completa de objetos (es lento y provoca un tirón perceptible al arrancar). El autor del mod la usa para generar el archivo StackCustomizer_items.csv que se incluye con el mod. Jugadores: dejadla en false. Gracias al parche de Harmony, los ajustes por objeto funcionan sin necesidad de escanear nada.",
    DumpItemList:
      "OPCIÓN DE DESARROLLADOR: con ScanOnStartup activado, además escribe la lista completa de objetos detectados (con los nombres en los 14 idiomas) en BepInEx/plugins/StackCustomizer_items.csv.",
    Mode:
      "Modo de apilado (excluyentes entre sí). Unified: todo objeto apilable usa el valor de UnifiedMaxStack. Multiplier: el MaxStack original de cada objeto se multiplica por Multiplier, con el límite que imponga MultiplierCap.",
    UnifiedMaxStack:
      "Se usa con Mode = Unified. Fuerza este MaxStack en todos los objetos apilables.",
    Multiplier:
      "Se usa con Mode = Multiplier. Multiplica por este valor el MaxStack original de cada objeto.",
    MultiplierCap:
      "Se usa con Mode = Multiplier. Tope de seguridad: el resultado de la multiplicación nunca superará este valor.",
  },
  "humanhost.storagebox.expand.cfg": {
    Columns:
      "Columnas por fila (original: 5, máximo 12). Si la haces más ancha, se solapará con la interfaz de la mochila al abrirla.",
    Rows:
      "Número total de filas (original: 6). Por defecto, 10 filas x 10 columnas = 100 huecos.",
    VisibleRows:
      "Filas visibles antes de que aparezca el desplazamiento (original: 6, máximo 10). Si pones más, se sale de la pantalla.",
    ScrollbarWidth: "Ancho de la barra de desplazamiento, en píxeles.",
    ScrollSensitivity:
      "Sensibilidad del desplazamiento con la rueda del ratón.",
  },
  "humanhost.vehicle.tweaks.cfg": {
    SolarMultiplier:
      "Multiplicador de la velocidad de carga del generador solar. De serie ronda los 0,05 de combustible por segundo con el tiempo óptimo (un tic de 0,15 cada 3 segundos), así que cargar 1000 de combustible lleva unas 5,5 horas de juego, y solo carga de día y con el cielo despejado. Con x10 baja a unos 33 minutos. La velocidad total se reparte por igual entre todos los motores del vehículo que aún no estén llenos.",
    BicycleMultiplier:
      "Multiplicador de la velocidad de carga del generador de pedales (bicicleta). De serie da 0,3 de combustible por segundo pedaleando y 0,6 esprintando (1000 de combustible = 55 / 28 minutos). Con x5 baja a unos 11 / 5,5 minutos. La velocidad total se reparte por igual entre todos los motores del vehículo que aún no estén llenos.",
    EnableRefillHotkey:
      "Activa una tecla rápida que llena al instante el combustible de todos los motores de vehículo cargados.",
    RefillHotkey:
      "Tecla para llenar de combustible todos los motores de vehículo cargados. El valor es un nombre de Unity KeyCode, con modificadores opcionales unidos por « + ». Ejemplos: End | Home | F5 | KeypadEnter | R + LeftControl | G + LeftAlt. Nomenclatura: las letras van de la A a la Z; los números de la fila superior son Alpha1..Alpha0; los del teclado numérico, Keypad1..Keypad0; los modificadores son LeftControl/LeftShift/LeftAlt (o sus variantes Right*). Evita las teclas que ya usa el juego (W/A/S/D, Space, Shift, F, H) y F12 (captura de pantalla de Steam).",
    EnableZoomRange:
      "Personaliza hasta dónde puede alejarse y acercarse la cámara con la rueda mientras vas montado en un vehículo.",
    MaxDistance:
      "Distancia máxima de la cámara cuando vas montado (de serie 8). Hasta dónde puedes alejar la cámara con la rueda.",
    MinDistance:
      "Distancia mínima de la cámara cuando vas montado (de serie ~0). Hasta dónde puedes acercar la cámara con la rueda.",
  },
  "humanhost.backpack.expand.cfg": {
    BagSlotCount:
      "Número total de huecos de la mochila. De serie son 56. Se recomienda usar múltiplos de 7 (56/63/70/.../203/210/...).",
    ScrollbarWidth: "Ancho de la barra de desplazamiento, en píxeles.",
    ScrollSensitivity:
      "Sensibilidad del desplazamiento con la rueda del ratón.",
  },
};

export default d;
