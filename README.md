# PV Battle - Gamifikacja Produkcji Fotowoltaicznej

Dashboard do rywalizacji w produkcji energii słonecznej między sąsiadami.
Łączy dane z **Home Assistant** (falownik Deye) oraz **FusionSolar** (falownik Huawei).

## Funkcje

- **Dzienny pojedynek** z punktacją w kategoriach: produkcja, autokonsumpcja, eksport, import
- **Live power gauge** - porównanie aktualnej mocy w czasie rzeczywistym
- **Historia** - wykresy produkcji: tydzień / miesiąc / rok
- **Serie zwycięstw** - kto ma najdłuższą passę?
- **Osiągnięcia** - odblokuj trofea za wyjątkowe wyniki
- **Ranking** - tabela z win%, średnią produkcją i trendem
- **Tryb demo** - działa bez konfiguracji z danymi mockowanymi

## Szybki start

```bash
npm install
npm run dev
```

Dashboard uruchomi się na `http://localhost:5173` w trybie demo.

## Konfiguracja prawdziwych danych

Skopiuj `.env.example` do `.env` i uzupełnij:

```bash
cp .env.example .env
```

### Home Assistant (Twoje dane - Deye)

1. **HA_URL** - adres Home Assistant (np. `http://homeassistant.local:8123`)
2. **HA_TOKEN** - Long-Lived Access Token:
   - HA → Profil → Security → Long-Lived Access Tokens → Utwórz token
3. **HA_SENSOR_*** - entity_id sensorów falownika Deye/Solarman:
   - Sprawdź w HA → Developer Tools → States → wyszukaj "deye" lub "solarman"
   - Albo uruchom backend i wejdź na `/api/debug/ha-sensors`

### FusionSolar (Dane sąsiada - Huawei)

Potrzebujesz konta **Northbound API** w FusionSolar (nie zwykłego loginu!):

1. Zaloguj się do FusionSolar jako administrator firmy
2. Idź do: **System → Company Management → Northbound Management → Add**
3. Utwórz login i hasło dla API
4. Wpisz w `.env`:
   - `FUSIONSOLAR_USER` - login Northbound
   - `FUSIONSOLAR_PASSWORD` - hasło Northbound
5. Opcjonalnie: `FUSIONSOLAR_STATION_CODE` (auto-discovery jeśli puste)

**URL API** - domyślnie `https://intl.fusionsolar.huawei.com/thirdData`. Dla EU:
- `https://eu5.fusionsolar.huawei.com/thirdData`

## Debugowanie

Po skonfigurowaniu `.env` i uruchomieniu backendu:

- `GET /api/debug/ha-sensors` - lista wszystkich sensorów solarnych w HA
- `GET /api/debug/fusionsolar` - test połączenia z FusionSolar

## Uruchomienie z backendem

```bash
npm run dev:server   # serwer API (port 3001)
npm run dev          # frontend (port 5173, proxy do API)
```

## System punktowy

| Kategoria | Punkty | Wygrywa |
|-----------|--------|---------|
| Produkcja | 3 pkt | Wyższa wartość |
| Autokonsumpcja | 2 pkt | Wyższy % |
| Eksport | 1 pkt | Wyższa wartość |
| Import z sieci | 2 pkt | Niższa wartość |

## Stack technologiczny

- **Frontend**: React + Vite + Tailwind CSS v4 + Recharts + Lucide Icons
- **Backend**: Express.js
- **Źródła danych**: Home Assistant REST API (Deye), Huawei FusionSolar Northbound API
