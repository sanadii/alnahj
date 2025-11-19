const fs = require("fs");
const path = require("path");

const INPUT_PATH = path.join("backend", "files", "merged_electors.csv");
const OUTPUT_PATH = path.join("backend", "files", "merged_electors_enriched.csv");

const AREA_CODE_MAP = {
  NK: "North Kuwait",
  NN: "North Kuwait",
  WK: "West Kuwait",
  WKII: "West Kuwait",
  "WK-I": "West Kuwait",
  "WK-II": "West Kuwait",
  EK: "East Kuwait",
  EKI: "East Kuwait",
  "EK-I": "East Kuwait",
  "EK-II": "East Kuwait",
  SEK: "South & East Kuwait",
  "S&EK": "South & East Kuwait",
  SK: "South Kuwait",
  SO: "South Operations",
  SE: "South East Kuwait",
  PK: "Production Operations",
  PI: "Production Operations",
  AK: "Ahmadi",
  HQ: "Head Office",
  GC: "Gathering Center Network",
  BK: "Burgan Area",
  NKF: "North Kuwait",
  MM: "Maintenance Management",
};

const TEAM_DEPARTMENT_KEYWORDS = [
  ["Maintenance", "Maintenance"],
  ["Water Handling", "Production Operations"],
  ["Operations Technical Services", "Technical Services"],
  ["Operational Technical Services", "Technical Services"],
  ["Operations Support", "Support Services"],
  ["Support Services", "Support Services"],
  ["Technical Services", "Technical Services"],
  ["Operations", "Operations"],
  ["Projects", "Projects"],
  ["Drilling", "Drilling"],
  ["Security", "Security"],
  ["Fire", "Fire & Safety"],
  ["Marine", "Marine Operations"],
  ["Medical", "Medical Services"],
  ["Gas", "Gas Operations"],
  ["Innovation", "Innovation & Technology"],
  ["Purchasing", "Supply Chain Management"],
  ["Materials", "Supply Chain Management"],
];

const AREA_LOCATIONS_BASE = {
  "North Kuwait": ["GC-15", "GC-25", "NK Operations Center", "NK Gathering Station"],
  "South Kuwait": ["GC-21", "GC-32", "Burgan Complex", "SK Operations Hub"],
  "West Kuwait": ["WK Operations Base", "WK Maintenance Yard", "GC-03", "GC-05"],
  "East Kuwait": ["EK Operations Center", "GC-10", "GC-16", "East Kuwait Control Room"],
  "South & East Kuwait": ["SEK Field Office", "South & East Operations Center", "Burgan Workshop"],
  "Production Operations": ["Production Support Base", "Operations Support Center", "Ahmadi Operations Complex"],
  Ahmadi: ["Ahmadi HQ", "Ahmadi Support Center"],
  "Head Office": ["Head Office - Ahmadi"],
  "Gathering Center Network": ["GC-01", "GC-02", "GC-06"],
  "Burgan Area": ["Burgan Workshop", "Burgan Control Room"],
  "Maintenance Management": ["Maintenance Support Center"],
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomChoice(list, rng) {
  if (!list.length) {
    return "";
  }
  const index = Math.floor(rng() * list.length);
  return list[index];
}

function parseCsv(content) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];

    if (char === '"') {
      if (insideQuotes && content[i + 1] === '"') {
        currentValue += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && content[i + 1] === "\n") {
        i += 1;
      }
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  if (currentValue.length > 0 || insideQuotes || currentRow.length) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows;
}

function readCsv(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const rows = parseCsv(content.trimEnd());
  const headers = rows[0];
  const dataRows = rows.slice(1).map((values) => {
    while (values.length < headers.length) {
      values.push("");
    }
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
  return { headers, rows: dataRows };
}

function escapeCsvValue(value) {
  const normalized = value ?? "";
  if (/[",\n\r]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

function writeCsv(filePath, headers, rows) {
  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function matchAreaFromToken(token) {
  if (!token) return null;
  const tokenClean = token.trim().toUpperCase().replace(/\s+/g, "");
  const keys = Object.keys(AREA_CODE_MAP).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    if (tokenClean.startsWith(key)) {
      return AREA_CODE_MAP[key];
    }
  }

  const condensed = tokenClean.replace(/[^A-Z]/g, "");
  for (const key of keys) {
    const keyCondensed = key.toUpperCase().replace(/[^A-Z]/g, "");
    if (condensed.startsWith(keyCondensed)) {
      return AREA_CODE_MAP[key];
    }
  }

  return null;
}

function inferArea(row, rng) {
  const current = (row.Area || "").trim();
  if (current) return current;

  const byCode = matchAreaFromToken(row.Code || "");
  if (byCode) return byCode;

  const team = row.team || "";
  const teamMatch = team.match(/\(([^)]+)\)/);
  if (teamMatch) {
    const fromTeam = matchAreaFromToken(teamMatch[1]);
    if (fromTeam) return fromTeam;
  }
  for (const token of team.split(/[\/\-]/)) {
    const fromToken = matchAreaFromToken(token);
    if (fromToken) return fromToken;
  }

  const groupName = row.group_name || "";
  const groupMatch = groupName.match(/\(([^)]+)\)/);
  if (groupMatch) {
    const fromGroup = matchAreaFromToken(groupMatch[1]);
    if (fromGroup) return fromGroup;
  }
  for (const token of groupName.split(/\s+/)) {
    const fromToken = matchAreaFromToken(token);
    if (fromToken) return fromToken;
  }

  const defaults = [
    "North Kuwait",
    "South Kuwait",
    "West Kuwait",
    "East Kuwait",
    "South & East Kuwait",
    "Production Operations",
  ];
  return randomChoice(defaults, rng);
}

function inferDepartment(row, departmentChoices, rng) {
  const current = (row.department || "").trim();
  if (current && current !== "--") return current;

  const team = (row.team || "").toUpperCase();
  for (const [keyword, department] of TEAM_DEPARTMENT_KEYWORDS) {
    if (team.includes(keyword.toUpperCase())) return department;
  }

  const groupName = (row.group_name || "").toUpperCase();
  for (const [keyword, department] of TEAM_DEPARTMENT_KEYWORDS) {
    if (groupName.includes(keyword.toUpperCase())) return department;
  }

  const designation = row.Desgnation || "";
  if (designation.includes("Maintenance")) return "Maintenance";
  if (designation.includes("Engineer")) return "Engineering";

  if (departmentChoices.length) {
    return randomChoice(departmentChoices, rng);
  }

  return randomChoice(
    [
      "Maintenance",
      "Operations",
      "Support Services",
      "Projects",
      "Technical Services",
      "Production Operations",
      "Engineering",
    ],
    rng
  );
}

function buildAreaLocations(areaLocationPairs) {
  const areaLocations = {};
  for (const [area, list] of Object.entries(AREA_LOCATIONS_BASE)) {
    areaLocations[area] = [...list];
  }
  for (const [area, locations] of areaLocationPairs.entries()) {
    if (!areaLocations[area]) areaLocations[area] = [];
    for (const location of Array.from(locations).sort()) {
      if (!areaLocations[area].includes(location)) {
        areaLocations[area].push(location);
      }
    }
  }
  return areaLocations;
}

function inferLocation(row, area, areaLocations, defaultLocations, rng) {
  const current = (row.Location || "").trim();
  if (current && current !== "--") return current;

  const options = areaLocations[area];
  if (options && options.length) {
    return randomChoice(options, rng);
  }

  return randomChoice(defaultLocations, rng);
}

function inferDesignation(row, department, designationChoices, rng) {
  const current = (row.Desgnation || "").trim();
  if (current && current !== "--") return current;

  const departmentUpper = (department || "").toUpperCase();

  if (departmentUpper.includes("MAINT")) {
    const options = designationChoices.filter((d) =>
      ["Maint", "Foreman", "Supervisor"].some((keyword) => d.includes(keyword))
    );
    if (options.length) return randomChoice(options, rng);
  }

  if (departmentUpper.includes("OPER")) {
    const options = designationChoices.filter((d) =>
      ["Oper", "Coordinator"].some((keyword) => d.includes(keyword))
    );
    if (options.length) return randomChoice(options, rng);
  }

  if (departmentUpper.includes("PROJECT")) {
    const options = designationChoices.filter(
      (d) => d.includes("Project") || d.includes("Engineer")
    );
    if (options.length) return randomChoice(options, rng);
  }

  if (departmentUpper.includes("SECURITY")) return "Security Supervisor";
  if (departmentUpper.includes("FIRE")) return "Fire Officer";
  if (departmentUpper.includes("MEDICAL")) return "Medical Officer";

  return randomChoice(designationChoices, rng);
}

function ensureTeam(row, area, department) {
  const current = (row.team || "").trim();
  if (current && current !== "--") return current;

  const areaSuffixMap = {
    "North Kuwait": "NK",
    "South Kuwait": "SK",
    "West Kuwait": "WK",
    "East Kuwait": "EK",
    "South & East Kuwait": "SEK",
    "Production Operations": "PO",
    Ahmadi: "AH",
    "Head Office": "HO",
  };

  const suffix = areaSuffixMap[area] || "OPS";
  const base = department && department.endsWith("Team") ? department : `${department || "Operations"} Team`;
  return `${base} (${suffix})`;
}

function inferSection(row, department, team) {
  const current = (row.Section || "").trim();
  if (current && current !== "--") return current;

  const teamClean = (team || "").replace(/\([^)]*\)/g, "").replace(/Team/gi, "").trim();
  if (teamClean) {
    return teamClean.endsWith("Section") ? teamClean : `${teamClean} Section`;
  }

  if (department) {
    return department.endsWith("Section") ? department : `${department} Section`;
  }

  return "Operations Section";
}

function seedForRow(row, fallback) {
  const rowId = (row.row_id || "").trim();
  if (/^\d+$/.test(rowId)) return Number(rowId);
  const koc = (row.KOC || "").trim();
  if (/^\d+$/.test(koc)) return Number(koc);
  return fallback;
}

function main() {
  const { headers, rows } = readCsv(INPUT_PATH);

  const existingDesignations = new Set();
  const existingLocations = new Set();
  const existingDepartments = new Set();
  const areaLocationPairs = new Map();

  for (const row of rows) {
    const designation = (row.Desgnation || "").trim();
    const location = (row.Location || "").trim();
    const department = (row.department || "").trim();
    const area = (row.Area || "").trim();

    if (designation && designation !== "--") existingDesignations.add(designation);
    if (location && location !== "--") existingLocations.add(location);
    if (department && department !== "--") existingDepartments.add(department);
    if (area && location) {
      if (!areaLocationPairs.has(area)) areaLocationPairs.set(area, new Set());
      areaLocationPairs.get(area).add(location);
    }
  }

  const areaLocations = buildAreaLocations(areaLocationPairs);

  let defaultLocations = Array.from(existingLocations);
  if (!defaultLocations.length) {
    const combined = new Set();
    for (const locList of Object.values(areaLocations)) {
      for (const loc of locList) {
        combined.add(loc);
      }
    }
    defaultLocations = Array.from(combined);
  }
  if (!defaultLocations.length) {
    defaultLocations = ["Ahmadi HQ", "Burgan Workshop", "GC-15"];
  }

  const designationChoices = Array.from(existingDesignations);
  if (!designationChoices.length) {
    designationChoices.push(
      "Senior Engineer",
      "Maintenance Engineer",
      "Operations Supervisor",
      "Technical Specialist",
      "Field Operator",
      "Instrumentation Supervisor",
      "Project Engineer",
      "Health & Safety Lead",
      "Operations Coordinator"
    );
  }

  const departmentChoices = Array.from(existingDepartments);
  if (!departmentChoices.length) {
    departmentChoices.push(
      "Maintenance",
      "Operations",
      "Support Services",
      "Projects",
      "Technical Services",
      "Production Operations",
      "Engineering"
    );
  }

  const updatedRows = rows.map((row, index) => {
    const rng = mulberry32(seedForRow(row, index) || index);

    const area = inferArea(row, rng);
    const department = inferDepartment(row, departmentChoices, rng);
    const team = ensureTeam(row, area, department);
    const section = inferSection(row, department, team);
    const location = inferLocation(row, area, areaLocations, defaultLocations, rng);
    const designation = inferDesignation(row, department, designationChoices, rng);

    return {
      ...row,
      Area: area,
      department,
      team,
      Section: section,
      Location: location,
      Desgnation: designation,
    };
  });

  writeCsv(OUTPUT_PATH, headers, updatedRows);
}

if (require.main === module) {
  main();
}
