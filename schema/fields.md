# Field reference

| Field | Meaning |
|---|---|
| `record_status` | `published_flat_rate` or `official_site_checked_public_rate_not_located`. |
| `supplier` | Public supplier or brand name. |
| `legal_licensee` | Legal supplier entity, or the public export provider for a market-context row. |
| `ofgem_seg_status` | `mandatory`, `voluntary` or `not_listed_on_2026_27_ofgem_seg_list`. |
| `tariff` | Public tariff name or a transparent source-gap status label. |
| `rate_p_per_kwh` | Flat advertised export rate in pence per kWh; blank/null when no official public rate was located. |
| `rate_type` | How the official source describes the price or term, including unresolved wording conflicts. |
| `import_supplier_required` | Whether matching import supply is explicitly required: `yes`, `no` or `not_stated`. |
| `installer_or_purchase_required` | Whether a qualifying installation or purchase is explicitly required. |
| `battery_required` | Whether a battery is explicitly required. |
| `system_size_public_summary` | Capacity condition shown in the public summary where relevant. |
| `checked_date` | Primary-source check date in ISO 8601 format. |
| `source_url` | Supplier-owned source checked for the record. |
| `ofgem_source_url` | Ofgem's current SEG licensee list. |
| `notes` | Eligibility, ambiguity or verification note. The current supplier contract governs. |

