#!/usr/bin/env node

import { createInterface } from "readline";
import { cp, readFile, writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = resolve(__dirname, "..");

const rl = createInterface({ input: process.stdin, output: process.stdout });

const ask = (question, defaultVal = "") =>
  new Promise((resolve) => {
    const suffix = defaultVal ? ` (${defaultVal})` : "";
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });

// ========================================
// COLOR GENERATION
// ========================================

function hexToHSL(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(hex) {
  const base = hexToHSL(hex);

  const primary = {
    50: hslToHex(base.h, Math.min(base.s * 0.3, 30), 96),
    100: hslToHex(base.h, Math.min(base.s * 0.4, 35), 91),
    200: hslToHex(base.h, Math.min(base.s * 0.5, 40), 82),
    300: hslToHex(base.h, base.s * 0.7, 68),
    400: hslToHex(base.h, base.s * 0.85, 55),
    500: hslToHex(base.h, base.s, base.l),
    600: hslToHex(base.h, base.s * 1.05, base.l * 0.82),
    700: hslToHex(base.h, base.s * 1.1, base.l * 0.65),
    800: hslToHex(base.h, base.s * 1.1, base.l * 0.45),
    900: hslToHex(base.h, base.s * 1.1, base.l * 0.28),
  };

  const secH = (base.h + 180) % 360;
  const secondary = {
    50: hslToHex(secH, Math.min(base.s * 0.3, 30), 96),
    100: hslToHex(secH, Math.min(base.s * 0.4, 35), 91),
    200: hslToHex(secH, Math.min(base.s * 0.5, 40), 82),
    300: hslToHex(secH, base.s * 0.7, 68),
    400: hslToHex(secH, base.s * 0.85, 55),
    500: hslToHex(secH, base.s * 0.9, base.l),
    600: hslToHex(secH, base.s * 0.95, base.l * 0.82),
    700: hslToHex(secH, base.s, base.l * 0.65),
    800: hslToHex(secH, base.s, base.l * 0.45),
    900: hslToHex(secH, base.s, base.l * 0.28),
  };

  const neutralSat = Math.min(base.s * 0.15, 8);
  const neutrals = {
    0: "#ffffff",
    50: hslToHex(base.h, neutralSat, 98),
    100: hslToHex(base.h, neutralSat, 96),
    200: hslToHex(base.h, neutralSat * 0.9, 91),
    300: hslToHex(base.h, neutralSat * 0.8, 86),
    400: hslToHex(base.h, neutralSat * 0.7, 68),
    500: hslToHex(base.h, neutralSat * 0.6, 52),
    600: hslToHex(base.h, neutralSat * 0.5, 38),
    700: hslToHex(base.h, neutralSat * 0.4, 28),
    800: hslToHex(base.h, neutralSat * 0.4, 18),
    900: hslToHex(base.h, neutralSat * 0.3, 10),
  };

  return { primary, secondary, neutrals };
}

function buildColorBlock(palette) {
  const lines = [];

  const addGroup = (prefix, obj) => {
    Object.entries(obj).forEach(([k, v]) => {
      lines.push(`$${prefix}-${k}: ${v};`);
    });
  };

  addGroup("brand-primary", palette.primary);
  lines.push("");
  addGroup("brand-secondary", palette.secondary);
  lines.push("");
  addGroup("neutral", palette.neutrals);

  return lines.join("\n");
}

function isValidHex(hex) {
  return /^#?[0-9a-fA-F]{6}$/.test(hex);
}

function normalizeHex(hex) {
  return hex.startsWith("#") ? hex : `#${hex}`;
}

// ========================================
// FILE OPERATIONS
// ========================================

async function applyColors(projectDir, hex) {
  const varsFile = resolve(projectDir, "src/styles/_variables.scss");
  let content = await readFile(varsFile, "utf-8");

  const palette = generatePalette(hex);
  const newColors = buildColorBlock(palette);

  // Replace from first $brand-primary to last $neutral line
  content = content.replace(
    /\$brand-primary-50:[\s\S]*?\$neutral-900:[^;]*;/,
    newColors
  );

  await writeFile(varsFile, content, "utf-8");
}

async function updatePackageJson(projectDir, projectName) {
  const pkgFile = resolve(projectDir, "package.json");
  let content = await readFile(pkgFile, "utf-8");
  const pkg = JSON.parse(content);

  const devOnly = ["@vitejs/plugin-react", "sass", "vite"];

  const dependencies = {};
  const devDependencies = {};

  for (const [name, version] of Object.entries(pkg.devDependencies || {})) {
    if (devOnly.includes(name)) {
      devDependencies[name] = version;
    } else {
      dependencies[name] = version;
    }
  }

  const newPkg = {
    name: projectName,
    version: "0.1.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies,
    devDependencies,
  };

  await writeFile(pkgFile, JSON.stringify(newPkg, null, 2) + "\n", "utf-8");
}

async function updateSiteData(projectDir, projectName) {
  const siteDataFile = resolve(projectDir, "src/data/siteData.js");
  let content = await readFile(siteDataFile, "utf-8");

  content = content.replace(
    /export const SITE_NAME = ".*?";/,
    `export const SITE_NAME = "${projectName}";`
  );

  await writeFile(siteDataFile, content, "utf-8");
}

async function setupLanguages(projectDir, languages) {
  const localesDir = resolve(projectDir, "src/locales");
  const providerFile = resolve(
    projectDir,
    "src/contexts/language/LanguageProvider.jsx"
  );

  // Delete locale files that are not in the selected languages
  const allLocales = ["uk", "en"];
  for (const locale of allLocales) {
    if (!languages.includes(locale)) {
      const localeFile = resolve(localesDir, `${locale}.json`);
      if (existsSync(localeFile)) {
        await unlink(localeFile);
      }
    }
  }

  // Update LanguageProvider.jsx
  let content = await readFile(providerFile, "utf-8");

  // Remove import lines for unused languages and keep used ones
  const allImportLines = allLocales.map(
    (lang) => `import ${lang} from "../../locales/${lang}.json";`
  );
  const newImportLines = languages.map(
    (lang) => `import ${lang} from "../../locales/${lang}.json";`
  );

  for (const line of allImportLines) {
    content = content.replace(line + "\n", "");
  }

  // Add back the needed imports after the last react import line
  content = content.replace(
    'import { LanguageContext } from "./LanguageContext";',
    'import { LanguageContext } from "./LanguageContext";\n' +
      newImportLines.join("\n")
  );

  // Update the translations object
  const translationsObj = `{ ${languages.join(", ")} }`;
  content = content.replace(
    /const translations = \{[^}]*\};/,
    `const translations = ${translationsObj};`
  );

  await writeFile(providerFile, content, "utf-8");
}

// ========================================
// THEME
// ========================================

async function applyTheme(projectDir, theme) {
  if (theme !== "light") return;

  // --- _variables.scss ---
  const varsFile = resolve(projectDir, "src/styles/_variables.scss");
  let vars = await readFile(varsFile, "utf-8");

  // Semantic: background
  vars = vars.replace(/\$color-background:.*?;/, "$color-background: $neutral-50;");

  // Semantic: text colors
  vars = vars.replace(/\$color-text-primary:.*?;/, "$color-text-primary: $neutral-800;");
  vars = vars.replace(/\$color-text-secondary:.*?;/, "$color-text-secondary: $neutral-500;");
  vars = vars.replace(/\$color-text-tertiary:.*?;/, "$color-text-tertiary: $neutral-400;");
  vars = vars.replace(/\$color-text-inverse:.*?;/, "$color-text-inverse: $neutral-0;");

  // Semantic: borders
  vars = vars.replace(/\$color-border:.*?;/, "$color-border: $neutral-200;");
  vars = vars.replace(/\$color-border-light:.*?;/, "$color-border-light: $neutral-100;");
  vars = vars.replace(/\$color-border-dark:.*?;/, "$color-border-dark: $neutral-300;");

  // Glassmorphism
  vars = vars.replace(/\$glass-bg:.*?;/, "$glass-bg: rgba(255, 255, 255, 0.7);");
  vars = vars.replace(/\$glass-border:.*?;/, "$glass-border: rgba(0, 0, 0, 0.08);");
  vars = vars.replace(/\$glass-blur:.*?;/, "$glass-blur: 20px;");

  // Glow
  vars = vars.replace(/\$glow-size:.*?;/, "$glow-size: 600px;");
  vars = vars.replace(/\$glow-blur:.*?;/, "$glow-blur: 150px;");
  vars = vars.replace(/\$glow-opacity:.*?;/, "$glow-opacity: 0.08;");

  await writeFile(varsFile, vars, "utf-8");

  // --- Footer.scss ---
  const footerFile = resolve(projectDir, "src/components/Footer/Footer.scss");
  let footer = await readFile(footerFile, "utf-8");
  footer = footer.replace(
    /rgba\(v\.\$neutral-800, 0\.4\)/,
    "rgba(v.$neutral-200, 0.4)"
  );
  await writeFile(footerFile, footer, "utf-8");

  // --- LanguageSwitcher.scss ---
  const langSwitcherFile = resolve(projectDir, "src/components/LanguageSwitcher/LanguageSwitcher.scss");
  let langSwitcher = await readFile(langSwitcherFile, "utf-8");
  langSwitcher = langSwitcher.replace(
    /rgba\(255, 255, 255, 0\.12\)/,
    "rgba(0, 0, 0, 0.06)"
  );
  langSwitcher = langSwitcher.replace(
    /rgba\(255, 255, 255, 0\.18\)/,
    "rgba(0, 0, 0, 0.12)"
  );
  await writeFile(langSwitcherFile, langSwitcher, "utf-8");

  // --- Partners.jsx ---
  const partnersFile = resolve(projectDir, "src/components/Partners/Partners.jsx");
  let partners = await readFile(partnersFile, "utf-8");
  partners = partners.replace(
    /stroke="rgba\(255,255,255,0\.1\)"/g,
    'stroke="rgba(0,0,0,0.1)"'
  );
  partners = partners.replace(
    /fill="rgba\(255,255,255,0\.4\)"/g,
    'fill="rgba(0,0,0,0.35)"'
  );
  await writeFile(partnersFile, partners, "utf-8");

  // --- Portfolio.jsx ---
  const portfolioFile = resolve(projectDir, "src/components/Portfolio/Portfolio.jsx");
  let portfolio = await readFile(portfolioFile, "utf-8");
  portfolio = portfolio.replace(
    /fill="rgba\(255,255,255,0\.08\)"/g,
    'fill="rgba(0,0,0,0.06)"'
  );
  portfolio = portfolio.replace(
    /fill="rgba\(255,255,255,0\.06\)"/g,
    'fill="rgba(0,0,0,0.04)"'
  );
  portfolio = portfolio.replace(
    /stroke="rgba\(255,255,255,0\.1\)"/g,
    'stroke="rgba(0,0,0,0.08)"'
  );
  portfolio = portfolio.replace(
    /fill="rgba\(255,255,255,0\.15\)"/g,
    'fill="rgba(0,0,0,0.12)"'
  );
  await writeFile(portfolioFile, portfolio, "utf-8");
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log("");
  console.log("  LaunchKit Landing - створення нового проекту");
  console.log("  =============================================");
  console.log("");

  // 1. Project name
  const projectName = await ask("Назва проекту");
  if (!projectName) {
    console.log("Назва проекту обов'язкова.");
    rl.close();
    process.exit(1);
  }

  const projectDir = resolve(process.cwd(), projectName);

  if (existsSync(projectDir)) {
    console.log(`Папка "${projectName}" вже існує.`);
    rl.close();
    process.exit(1);
  }

  // 2. Brand color
  console.log("");
  console.log("  Основний колір бренду — кнопки, акценти, футер.");
  console.log("  Вся палітра згенерується автоматично.");
  const colorInput = await ask("Hex колір", "#6C3CE0");
  const brandColor = normalizeHex(colorInput);

  if (!isValidHex(brandColor)) {
    console.log(`Невірний hex колір: ${brandColor}`);
    rl.close();
    process.exit(1);
  }

  // 3. Theme
  console.log("");
  const themeInput = await ask("Тема сайту (dark, light)", "dark");
  const theme = themeInput.toLowerCase().trim();

  if (theme !== "dark" && theme !== "light") {
    console.log(`Невірна тема: ${theme}. Використовуйте "dark" або "light".`);
    rl.close();
    process.exit(1);
  }

  // 4. Languages
  console.log("");
  const langInput = await ask("Мови сайту (uk, en, uk+en)", "uk+en");
  const languages = langInput
    .split("+")
    .map((l) => l.trim())
    .filter(Boolean);

  const validLangs = ["uk", "en"];
  for (const lang of languages) {
    if (!validLangs.includes(lang)) {
      console.log(`Невідома мова: ${lang}. Доступні: uk, en`);
      rl.close();
      process.exit(1);
    }
  }

  rl.close();

  // 5. Copy template
  console.log("");
  console.log(`Створюю проект "${projectName}"...`);

  await mkdir(projectDir, { recursive: true });

  const SKIP = [
    "node_modules",
    ".git",
    "dist",
    "dist-ssr",
    "docs",
    "cli",
    ".claude",
    ".env",
    ".npmignore",
  ];

  await cp(TEMPLATE_DIR, projectDir, {
    recursive: true,
    filter: (src) => {
      const name = src
        .replace(TEMPLATE_DIR, "")
        .replace(/\\/g, "/")
        .split("/")[1];
      return !SKIP.includes(name);
    },
  });

  // 6. Update package.json
  console.log("Оновлюю назву проекту...");
  await updatePackageJson(projectDir, projectName);

  // 7. Update siteData.js
  await updateSiteData(projectDir, projectName);

  // 8. Generate colors
  if (brandColor.toLowerCase() !== "#6c3ce0") {
    console.log(`Генерую кольорову палітру з ${brandColor}...`);
    await applyColors(projectDir, brandColor);
  }

  // 9. Apply theme
  if (theme === "light") {
    console.log("Застосовую світлу тему...");
    await applyTheme(projectDir, theme);
  }

  // 10. Setup languages
  console.log("Налаштовую мови...");
  await setupLanguages(projectDir, languages);

  // 11. Install dependencies
  console.log("Встановлюю залежності...");
  try {
    execSync("npm install", { cwd: projectDir, stdio: "inherit" });
  } catch {
    console.log("npm install не вдалось. Запустіть вручну:");
    console.log(`  cd ${projectName} && npm install`);
  }

  // 12. Done
  console.log("");
  console.log("  Готово! Запускайте:");
  console.log(`  cd ${projectName}`);
  console.log("  npm run dev");
  console.log("");
}

main();
