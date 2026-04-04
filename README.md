# PV Battle - Gamifikacja Produkcji Fotowoltaicznej

Dashboard do rywalizacji w produkcji energii słonecznej między sąsiadami.
Łączy dane z **Home Assistant** (falownik Deye) oraz **SolarFusion** (falownik Huawei).

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

## Konfiguracja z prawdziwymi danymi

Skopiuj `.env.example` do `.env` i uzupełnij:

```bash
cp .env.example .env
```

### Home Assistant (Twoje dane - Deye)
- `HA_URL` - adres Home Assistant (np. `http://homeassistant.local:8123`)
- `HA_TOKEN` - Long-Lived Access Token z HA (Profil → Tokeny)
- `HA_SENSOR_*` - entity_id sensorów falownika Deye

### SolarFusion (Dane sąsiada - Huawei)
- `SOLARFUSION_URL` - URL API SolarFusion
- `SOLARFUSION_API_KEY` - klucz API
- `SOLARFUSION_PLANT_ID` - ID instalacji sąsiada

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
- **Źródła danych**: Home Assistant REST API, SolarFusion API
