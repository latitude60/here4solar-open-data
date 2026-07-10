# UK solar export tariff and SEG licensee data

A dated, source-led dataset from [Here4Solar](https://here4solar.uk/uk-solar-export-tariff-data/) covering every supplier on Ofgem's 2026/27 Smart Export Guarantee licensee list, plus Good Energy export products for market context.

Version 2.0 was checked on 10 July 2026. It contains:

- all 16 current mandatory and voluntary SEG licensees listed by Ofgem;
- 30 supplier-published flat-rate tariff records across 17 public brands;
- three explicit records where an official supplier site was checked but no public rate was located;
- supplier, legal-entity and Ofgem-status fields;
- import-supplier, tied-installation and battery conditions where the public summary states them;
- a primary supplier URL and the Ofgem list URL on every record.

This is a dated editorial snapshot, not a live tariff feed or recommendation. Always check the supplier's current tariff information, eligibility rules and contract before switching.

## Research report

The [UK Solar Export Tariff Transparency Report 2026](https://here4solar.uk/solar-export-tariff-transparency-report-2026/) turns the version 2.0 data into reproducible findings. [Download report version 1.1 as a five-page PDF](https://here4solar.uk/wp-content/uploads/2026/07/here4solar-uk-export-tariff-transparency-report-july-2026-v1-1.pdf).

A [1200x630 shareable findings graphic](https://here4solar.uk/wp-content/uploads/2026/07/uk-solar-export-tariff-transparency-report-2026.png) is available for relevant articles, presentations and social posts. Keep the wording intact and credit the report page.

Headline results include:

- a 25p/kWh public headline maximum, or 20p/kWh among current Ofgem-listed licensees;
- a 4.1p/kWh maximum when all three tested supply, purchase and battery ties must explicitly be absent;
- 15 of 30 published flat-rate records requiring matching import supply;
- eight of 30 tied to an installer or equipment purchase;
- four of 30 explicitly requiring a battery;
- three official-source gaps, reported as discoverability findings rather than compliance conclusions.

Good Energy confirmed by email on 10 July 2026 that 12p/kWh is the current standard Solar Savings rate for new applications. Report version 1.1 records the clarification and the original version 1.0 PDF remains preserved on Here4Solar.

## Files

- `data/current/uk-solar-export-tariffs-2026-07-10-v2.csv` — analysis-ready CSV.
- `data/current/uk-solar-export-tariffs-2026-07-10-v2.json` — structured data, field definitions and methodology.
- `data/archive/` — the original six-supplier version 1 release, retained rather than silently overwritten.
- `schema/fields.md` — concise field reference.
- `SHA256SUMS` — checksums for all current and archived data files.
- `datapackage.json` — Frictionless Data-style package and field metadata.
- `CITATION.cff` and `.zenodo.json` — citation and repository-archiving metadata.
- `scripts/validate-data.mjs` — dependency-free CSV, JSON, schema and checksum validation.

## Validate the release

Use Node.js 20 or later and run:

```sh
npm test
```

The validator checks that the CSV and JSON contain the same 33 records, validates controlled values and source URLs, confirms the 30 published rates and three source-gap records, checks coverage of 16 current Ofgem licensees and verifies every hash in `SHA256SUMS`.

The included GitHub Actions workflow runs the same validation for pushes and pull requests.

## Method

1. Start with [Ofgem's 2026/27 SEG supplier list](https://www.ofgem.gov.uk/guidance/smart-export-guarantee-supplier-list).
2. Retain every mandatory and voluntary licensee.
3. Check the supplier's own public site for a flat export rate and visible eligibility conditions.
4. Exclude dynamic and time-of-use tariffs from the single numeric rate field.
5. Use `not_stated` rather than infer a condition absent from the public summary.
6. Record `official_site_checked_public_rate_not_located` instead of copying an unverified secondary-source number.
7. Keep Good Energy rows as market context while marking that the company is not on Ofgem's current list.

## Known official-source gaps

On 10 July 2026, Here4Solar did not locate a public official tariff rate for:

- Fuse Energy Supply Limited;
- Foxglove Energy Supply Limited, trading publicly as Outfox Energy;
- Smart Pay Energy Ltd.

The dataset retains these companies because Ofgem lists them as current licensees. A primary tariff URL is welcome through the correction process.

## Reuse

The data is available under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Attribute Here4Solar and link to the [dataset methodology page](https://here4solar.uk/uk-solar-export-tariff-data/).

Suggested citation:

> Here4Solar. *UK solar export tariff and SEG licensee coverage dataset*, version 2.0, checked 10 July 2026. https://here4solar.uk/uk-solar-export-tariff-data/

## Corrections

Please follow [CONTRIBUTING.md](CONTRIBUTING.md). Primary supplier or Ofgem URLs are required for rate, status and eligibility corrections.
