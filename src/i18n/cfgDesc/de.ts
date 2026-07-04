const d: Record<string, Record<string, string>> = {
  "humanhost.admin.panel.cfg": {
    OverrideFov:
      "Überschreibt das Standard-Sichtfeld des Spiels mit dem unten eingestellten FOV-Wert.",
    Fov: "Sichtfeld der Kamera in Grad – je höher der Wert, desto mehr siehst du.",
    OverrideCamOffset:
      "Verschiebt die Kamera anhand der drei Werte unten (rechts, oben und nach hinten).",
    CamOffsetRight:
      "Seitlicher Versatz der Kamera in Metern: positive Werte nach rechts, negative nach links.",
    CamOffsetUp:
      "Höhenversatz der Kamera in Metern: positive Werte nach oben, negative nach unten.",
    CamOffsetBack:
      "Versatz entlang der Blickrichtung in Metern: positive Werte nach vorne, negative nach hinten.",
    Debuffs:
      "IDs der Statuseffekte, gegen die du immun sein sollst – mehrere durch Komma getrennt.",
    SavedPoints:
      "Gespeicherte Teleportpunkte, ein Eintrag pro Zeile im Format Name|x|y|z.",
    X: "X-Position der oberen linken Ecke des Panels.",
    Y: "Y-Position der oberen linken Ecke des Panels.",
    Width: "Breite des Panels.",
    Height: "Höhe des Panels.",
  },
  "humanhost.quickloot.cfg": {
    EnableDebug:
      "Nicht ändern. Dient ausschließlich der Fehlersuche durch den Mod-Autor.",
    Hotkey:
      "Taste, mit der du alle nahen Gegenstände auf einmal aufsammelst. Modifikatoren sind möglich, z. B. „X“ oder „LeftControl + X“.",
    Radius:
      "Aufsammelradius in Metern rund um den Spieler.",
    GroundItems: "Sammelt fallengelassene Gegenstände vom Boden auf.",
    GroundResources:
      "Sammelt am Boden vorkommende Beute ein, die sonst erst gezielt anvisiert werden müsste.",
    WorldContainers:
      "Plündert Behälter in der Spielwelt automatisch. Selbst platzierte Lager bleiben dabei unangetastet.",
    ZombieCorpses:
      "Durchsucht erlegte Zombies automatisch nach Beute.",
  },
  "humanhost.stack.customizer.cfg": {
    ScanOnStartup:
      "ENTWICKLEROPTION – NICHT ÄNDERN, sofern du nicht genau weißt, was du tust. Durchsucht den kompletten Addressables-Katalog und gibt die gesamte Gegenstandsliste aus (langsam, spürbares Ruckeln beim Start). Der Mod-Autor nutzt das, um die mitgelieferte StackCustomizer_items.csv zu erzeugen. Für Spieler: auf false lassen. Dank des Harmony-Patches funktionieren Überschreibungen einzelner Gegenstände auch ohne Scan.",
    DumpItemList:
      "ENTWICKLEROPTION – Wenn ScanOnStartup aktiv ist, wird zusätzlich die komplette gefundene Gegenstandsliste (mit Namen in allen 14 Sprachen) nach BepInEx/plugins/StackCustomizer_items.csv geschrieben.",
    Mode:
      "Stapelmodus (die beiden Modi schließen sich gegenseitig aus). Unified – jeder stapelbare Gegenstand nutzt UnifiedMaxStack. Multiplier – der ursprüngliche MaxStack jedes Gegenstands wird mit Multiplier multipliziert und durch MultiplierCap begrenzt.",
    UnifiedMaxStack:
      "Gilt bei Mode = Unified. Jeder stapelbare Gegenstand wird auf diesen MaxStack festgelegt.",
    Multiplier:
      "Gilt bei Mode = Multiplier. Der ursprüngliche MaxStack jedes Gegenstands wird mit diesem Wert multipliziert.",
    MultiplierCap:
      "Gilt bei Mode = Multiplier. Sicherheitsgrenze – das multiplizierte Ergebnis wird auf diesen Wert begrenzt.",
  },
  "humanhost.storagebox.expand.cfg": {
    Columns:
      "Spalten pro Reihe (Original: 5, maximal 12 – mehr Spalten überlappen mit der Rucksack-Oberfläche, sobald du den Rucksack öffnest).",
    Rows:
      "Anzahl der Reihen insgesamt (Original: 6). Standard sind 10 Reihen × 10 Spalten = 100 Plätze.",
    VisibleRows:
      "Sichtbare Reihen, bevor gescrollt wird (Original: 6, maximal 10 – mehr Reihen ragen über den Bildschirmrand hinaus).",
    ScrollbarWidth: "Breite der Bildlaufleiste in Pixeln.",
    ScrollSensitivity: "Empfindlichkeit des Mausrads beim Scrollen.",
  },
  "humanhost.vehicle.tweaks.cfg": {
    SolarMultiplier:
      "Multiplikator für die Ladegeschwindigkeit des Solargenerators. Im Original sind es bei bestem Wetter etwa 0,05 Sprit/Sek. (alle 3 Sekunden ein Tick von 0,15), 1000 Sprit dauern also rund 5,5 Spielstunden und nur bei Tageslicht und freiem Himmel. ×10 ⇒ etwa 33 Minuten. Die Gesamtrate wird gleichmäßig auf alle noch nicht vollen Motoren des Fahrzeugs aufgeteilt.",
    BicycleMultiplier:
      "Multiplikator für die Ladegeschwindigkeit des Pedalgenerators (Fahrrad). Im Original sind es 0,3 Sprit/Sek. beim Treten und 0,6 Sprit/Sek. beim Sprinten (1000 Sprit = 55 bzw. 28 Minuten). ×5 ⇒ etwa 11 bzw. 5,5 Minuten. Die Gesamtrate wird gleichmäßig auf alle noch nicht vollen Motoren des Fahrzeugs aufgeteilt.",
    EnableRefillHotkey:
      "Aktiviert eine Taste, die alle geladenen Fahrzeugmotoren sofort komplett mit Sprit auffüllt.",
    RefillHotkey:
      "Taste, um alle geladenen Fahrzeugmotoren sofort komplett aufzutanken. Der Wert ist ein Unity-KeyCode-Name, bei Bedarf mit Modifikatoren, verbunden durch ‚ + ‘. Beispiele: End | Home | F5 | KeypadEnter | R + LeftControl | G + LeftAlt. Schreibweise: Buchstaben sind A–Z; die Ziffern der oberen Reihe heißen Alpha1..Alpha0; die Ziffern des Nummernblocks Keypad1..Keypad0; Modifikatoren sind LeftControl/LeftShift/LeftAlt (oder die Right*-Varianten). Vermeide Tasten, die das Spiel schon belegt (W/A/S/D, Space, Shift, F, H) sowie F12 (Steam-Screenshot).",
    EnableZoomRange:
      "Passt an, wie weit sich die Kamera im Fahrzeug per Mausrad heran- und herauszoomen lässt.",
    MaxDistance:
      "Maximale Kameradistanz im Fahrzeug (Original: 8). Legt fest, wie weit du mit dem Mausrad herauszoomen kannst.",
    MinDistance:
      "Minimale Kameradistanz im Fahrzeug (Original: ~0). Legt fest, wie nah du mit dem Mausrad heranzoomen kannst.",
  },
  "humanhost.backpack.expand.cfg": {
    BagSlotCount:
      "Gesamtzahl der Rucksackplätze. Im Original sind es 56. Empfohlen sind Vielfache von 7 (56/63/70/.../203/210/...).",
    ScrollbarWidth: "Breite der Bildlaufleiste in Pixeln.",
    ScrollSensitivity: "Empfindlichkeit des Mausrads beim Scrollen.",
  },
};

export default d;
