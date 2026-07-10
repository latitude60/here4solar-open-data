# Changelog

All notable dataset releases are preserved. Supplier rates can change after the stated check date.

## 2.1.0 — 10 July 2026

- Changed the Pozitive Energy record from a published 5p/kWh rate to an explicit official-source gap after its former SEG page returned HTTP 404 and no replacement current tariff page was located.
- Preserved version 2.0 in `data/archive/` so the published transparency report remains reproducible.
- Updated the current CSV, JSON, metadata, citation, checksums and research package.

## 2.0.0 — 10 July 2026

- Expanded coverage to all 16 suppliers on Ofgem's 2026/27 mandatory and voluntary SEG list.
- Added Good Energy public export products as clearly labelled market-context records.
- Published 30 supplier-sourced flat-rate records.
- Added three explicit official-source-gap records rather than inserting secondary-source rates.
- Added legal-licensee, Ofgem-status and visible eligibility-condition fields.
- Added CSV, JSON, field documentation, checksums and a reproducible validation script.

## 1.0.0 — 10 July 2026

- Published the original six-supplier comparison snapshot.
- Preserved the CSV and JSON files in `data/archive/` when version 2.0 replaced the current release.
