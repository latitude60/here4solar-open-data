import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const currentCsv = "data/current/uk-solar-export-tariffs-2026-07-10-v2.csv";
const currentJson = "data/current/uk-solar-export-tariffs-2026-07-10-v2.json";

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^\uFEFF/, "");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (quoted) fail("CSV ends inside a quoted field");
  if (field !== "" || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  assert(rows.length > 1, "CSV has no data rows");
  const headers = rows[0];
  const records = rows.slice(1).map((values, index) => {
    assert(values.length === headers.length, `CSV row ${index + 2} has ${values.length} fields; expected ${headers.length}`);
    return Object.fromEntries(headers.map((header, fieldIndex) => [header, values[fieldIndex]]));
  });
  return { headers, records };
}

function sha256(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relativePath))).digest("hex");
}

const csv = parseCsv(read(currentCsv));
const json = JSON.parse(read(currentJson));
const dataPackage = JSON.parse(read("datapackage.json"));
const expectedHeaders = Object.keys(json.columns);

assert(json.version === "2.0", `Unexpected JSON version ${json.version}`);
assert(json.checked_date === "2026-07-10", `Unexpected checked date ${json.checked_date}`);
assert(JSON.stringify(csv.headers) === JSON.stringify(expectedHeaders), "CSV headers do not match the JSON column order");
assert(csv.records.length === json.rows.length, "CSV and JSON row counts differ");
assert(dataPackage.version === "2.0.0", "Data Package version is not 2.0.0");
assert(dataPackage.resources.length === 2, "Data Package should describe two current resources");
for (const resource of dataPackage.resources) {
  assert(fs.existsSync(path.join(root, resource.path)), `Data Package resource is missing: ${resource.path}`);
}

const validStatuses = new Set(["published_flat_rate", "official_site_checked_public_rate_not_located"]);
const validOfgemStatuses = new Set(["mandatory", "voluntary", "not_listed_on_2026_27_ofgem_seg_list"]);
const validConditions = new Set(["yes", "no", "not_stated"]);
const keys = new Set();

json.rows.forEach((record, index) => {
  const csvRecord = csv.records[index];
  for (const header of csv.headers) {
    const expected = record[header] == null ? "" : String(record[header]);
    assert(csvRecord[header] === expected, `CSV and JSON differ at row ${index + 2}, field ${header}`);
  }
  assert(validStatuses.has(record.record_status), `Invalid record_status at JSON row ${index + 1}`);
  assert(validOfgemStatuses.has(record.ofgem_seg_status), `Invalid ofgem_seg_status at JSON row ${index + 1}`);
  for (const field of ["import_supplier_required", "installer_or_purchase_required", "battery_required"]) {
    assert(validConditions.has(record[field]), `Invalid ${field} at JSON row ${index + 1}`);
  }
  assert(/^\d{4}-\d{2}-\d{2}$/.test(record.checked_date), `Invalid checked_date at JSON row ${index + 1}`);
  for (const field of ["source_url", "ofgem_source_url"]) {
    const url = new URL(record[field]);
    assert(url.protocol === "https:", `${field} is not HTTPS at JSON row ${index + 1}`);
  }
  if (record.record_status === "published_flat_rate") {
    assert(Number.isFinite(record.rate_p_per_kwh) && record.rate_p_per_kwh > 0, `Published row ${index + 1} has no positive rate`);
  } else {
    assert(record.rate_p_per_kwh == null, `Source-gap row ${index + 1} should have a null rate`);
  }
  const key = `${record.legal_licensee}|${record.tariff}`;
  assert(!keys.has(key), `Duplicate legal_licensee and tariff key: ${key}`);
  keys.add(key);
});

for (const line of read("SHA256SUMS").trim().split(/\r?\n/)) {
  const match = line.match(/^([a-f0-9]{64})\s{2}(.+)$/);
  assert(match, `Malformed SHA256SUMS line: ${line}`);
  assert(fs.existsSync(path.join(root, match[2])), `Checksummed file is missing: ${match[2]}`);
  assert(sha256(match[2]) === match[1], `Checksum mismatch: ${match[2]}`);
}

const summary = {
  version: json.version,
  checkedDate: json.checked_date,
  rows: json.rows.length,
  publishedFlatRates: json.rows.filter((row) => row.record_status === "published_flat_rate").length,
  officialSourceGaps: json.rows.filter((row) => row.record_status === "official_site_checked_public_rate_not_located").length,
  publicBrands: new Set(json.rows.map((row) => row.supplier)).size,
  currentOfgemLicensees: new Set(json.rows.filter((row) => row.ofgem_seg_status !== "not_listed_on_2026_27_ofgem_seg_list").map((row) => row.legal_licensee)).size,
  checksums: read("SHA256SUMS").trim().split(/\r?\n/).length,
};

assert(summary.rows === 33, "Expected 33 total records");
assert(summary.publishedFlatRates === 30, "Expected 30 published flat-rate records");
assert(summary.officialSourceGaps === 3, "Expected three official-source-gap records");
assert(summary.publicBrands === 17, "Expected 17 public brands");
assert(summary.currentOfgemLicensees === 16, "Expected all 16 current Ofgem licensees");

console.log(JSON.stringify({ ok: true, ...summary }, null, 2));

