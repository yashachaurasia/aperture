# Aperture Field Status — Take-Home

A simplified Field Status feature that tells growers whether a field needs irrigation, based on current soil moisture and user-defined thresholds.

---

## How to Run

**Prerequisites:** Docker and Docker Compose installed.

```bash
git clone <repo-url>
cd aperture
make up
```

That's it. `make up` will copy `.env.example` to `.env` if one doesn't exist, then build and start all services. Docker Compose will:
1. Start a PostGIS-enabled Postgres database
2. Wait for the database to be healthy
3. Run Django migrations
4. Seed the three sample fields
5. Start the Django API on `http://localhost:8000`
6. Start the React frontend on `http://localhost:3005`

Open `http://localhost:3005` to view the app.
Open `http://localhost:8000/api/fields/` to inspect the raw API response.

### Other commands

| Command | Description |
|---|---|
| `make up` | Build and start all services |
| `make down` | Stop all containers |
| `make reset` | Stop containers, drop volumes, and rebuild from scratch |
| `make logs` | Tail logs from all containers |

---

## Configuration

All configuration is managed via environment variables. Docker Compose reads from a `.env` file at the project root and falls back to sensible defaults if the file is absent — so the project runs out of the box without any setup.

A `.env.example` is included with the default values and `make up` command copies it to the `.env`. The `.env` file is gitignored and should never be committed.

```bash
POSTGRES_DB=aperture_db
POSTGRES_USER=aperture_user
POSTGRES_PASSWORD=aperture
SECRET_KEY=change-me-in-production
DEBUG=true
CORS_ALLOWED_ORIGINS=http://localhost:3005,http://127.0.0.1:3005
REACT_APP_API_URL=http://localhost:8000
PORT=3005
```

Copy your own `.env` if you want to override any values.

---

## Status Logic

Each field is assigned one of three statuses based on its soil moisture values:

| Status | Condition | Meaning |
|---|---|---|
| **Consider Irrigating** | `current < stress_threshold` | Soil moisture has fallen below the crop's stress threshold — water stress is likely occurring and yield is at risk |
| **Investigate** | `stress_threshold ≤ current < ideal` | Moisture is above the stress floor but below the target — conditions are marginal and trending toward stress |
| **No Action Needed** | `current ≥ ideal` | Moisture is at or above the ideal target — no intervention needed |

### Why these thresholds?

The `stress_threshold` maps directly to **Management Allowable Depletion (MAD)** — a well-established agronomic concept for the point at which soil moisture depletion begins to reduce crop yield. The `ideal_soil_moisture` maps to **field capacity** — the target moisture level that irrigation aims to restore.

**Sources consulted:**
- Oklahoma State University Extension, *Understanding Soil Water Content and Thresholds for Irrigation Management* (BAE-1537)
- Virginia Tech Extension, *Scheduling Agricultural Irrigation Based on Soil Moisture Content* (BSE-339)
- University of Minnesota Extension, *Basics of Irrigation Scheduling*
- Stocker et al. (2022), *Critical soil moisture thresholds of plant water stress in terrestrial ecosystems*, Science Advances

The "Investigate" zone exists because conditions between the stress floor and ideal are agronomically marginal. Research shows that once moisture crosses the critical threshold, evapotranspiration becomes soil-moisture-limited and conditions can deteriorate quickly. A warning state before that point gives the grower time to act.

### Why status is computed, not stored

Status is derived from current data — storing it would create a consistency risk (stored status could become stale if moisture readings update). The `status` and `explanation` fields are computed at request time in `fields/recommendation.py` and attached to the response in the view. The view handles HTTP concerns; the logic module handles domain reasoning — keeping them cleanly separated.

---

## Assumptions

- Soil moisture values are **volumetric water content** (m³/m³), consistent with how modern soil sensors report data.
- `stress_threshold` and `ideal_soil_moisture` are user-defined per field, not derived from soil type or crop species. In production, these would be set by the grower or informed by field-specific calibration.
- No authentication is implemented, as specified.
- The `Field` model intentionally omits a geometry column, but is designed to support a PostGIS `PolygonField` for farm boundary overlays — a natural next step given Aperture's geospatial stack.

---

## Product Decisions & Tradeoffs

**Status computed at request time, not stored**
At this scale, computing status on every request is negligible. It also avoids stale data bugs — stored status would need to be recomputed whenever moisture values change. Given the time constraint, I went with run time status computation. But, at higher scale, the better pattern is to compute and store status at write time rather than read time, so reads are always instant regardless of load.

**Rule-based logic over ML**
Within the scope of this exercise, rule-based logic is the right fit. The inputs are well-defined, the thresholds are user-provided, and the output needs to be immediately understandable to a non-technical farmer. The tradeoff is that it only looks at the current snapshot — two fields at the same moisture level get the same status, even if one has been dropping steadily for three days and the other has been stable. In future, ML model outputs, if available, could be incorporated alongside the rule-based logic — for example, using predicted moisture trajectory to adjust the urgency of an Investigate recommendation while keeping the final status simple and explainable.

**Explanation string owned by the backend**
The human-readable explanation is generated in `recommendation.py`, not constructed on the frontend. This means copy changes, localization, or logic refinements happen in one place — the API — without requiring a frontend deploy.

**`updated_at` on the Field model**
Not in the original sample data, but added deliberately. A soil moisture recommendation is only meaningful in the context of when the reading was taken — stale data with no timestamp could lead a farmer to act on outdated information. This field is the foundation for showing data freshness in the UI ("Last updated 2 hours ago"), which becomes critical as the product matures.

**PostGIS over plain Postgres**
The exercise doesn't require geospatial queries, but using PostGIS signals that the `Field` model is designed to grow. Adding a `PolygonField` for farm boundaries is a one-line model change — the infrastructure is already there.

---

## What I Would Improve With More Time

**Trend data and trajectory**
A single moisture reading is a snapshot. Real irrigation decisions are made on direction — is moisture falling fast or slowly? With a `MoistureReading` time-series model, I could surface "moisture dropped 0.03 in the last 6 hours" alongside the status, which changes the urgency of an "Investigate" recommendation significantly.

**Farm boundary geometry**
Adding a PostGIS `PolygonField` to the `Field` model would allow field status to be overlaid on a map — which is the natural product evolution and consistent with Aperture's stack. TiTiler could serve the soil moisture rasters, and the field boundaries would provide the spatial context.

**Threshold configuration via UI**
Currently `stress_threshold` and `ideal_soil_moisture` are set at the database level. A natural next step would be exposing these as editable inputs in the UI, backed by an update endpoint, so growers can tune their own thresholds without any technical knowledge.

**Push notifications**
When a field crosses into "Consider Irrigating," the grower should be notified proactively rather than having to check the dashboard.

**Row-level tenancy**
In production, each grower should only see their own fields. This would be implemented via Django's custom manager pattern with a `FarmAccount` foreign key.

---

## Tech Stack

- **Backend:** Python 3.11, Django 4.2, PostgreSQL + PostGIS
- **Frontend:** React 18 (Create React App)
- **Infrastructure:** Docker Compose (single-command setup)
