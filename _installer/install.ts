import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// --- Types ---
interface FileCopyOperation {
  from: string;
  to: string;
}

interface Module {
  id: string;
  name: string;
  description: string;
  type: string;
  selected: boolean;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  filesToCopy?: FileCopyOperation[];
  nextConfigModifications?: {
    addSassOptions?: boolean;
    addMdxWrapper?: boolean;
  };
  cssModifications?: {
    addPlugin?: string;
    addBlock?: {
      anchor: string;
      content: string;
    };
  };
}

interface Manifest {
  installerVersion: string;
  modules: Module[];
}

// --- Constants ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../');
const templatesDir = path.resolve(__dirname, 'templates');
const manifestPath = path.resolve(__dirname, 'installer-manifest.json');
const rootPackageJsonPath = path.resolve(projectRoot, 'package.json');
const basePackageJsonPath = path.resolve(templatesDir, 'package.base.json');
const nextConfigPath = path.resolve(projectRoot, 'next.config.js');
const mainCssPath = path.resolve(projectRoot, 'src/styles/main.css');

// --- Main Installer Logic ---
async function runInstaller() {
  console.log('🚀 Next.js Kickstarter Installer wird gestartet...');

  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // 1. Interactive Prompts
  const prompts = manifest.modules.map(mod => ({
    type: 'confirm',
    name: mod.id,
    message: `Soll '${mod.name}' hinzugefügt werden? (${mod.description})`,
    default: mod.selected,
  }));
  const answers = await inquirer.prompt(prompts);

  const selectedModules = manifest.modules.filter(mod => answers[mod.id]);
  console.log('\nAusgewählte Module:', selectedModules.map(m => m.name).join(', ') || 'Keine', '\n');

  // 2. Build and Write Final package.json
  await buildPackageJson(selectedModules);

  // 3. Apply file and config changes for selected features
  await handleFileCopying(selectedModules);
  await updateNextConfig(selectedModules);
  await updateCssFiles(selectedModules);
  
  // 4. Install final dependencies
  await installDependencies();

  // 5. Ask about cleanup
  const { shouldCleanup } = await inquirer.prompt([
    {
        type: 'confirm',
        name: 'shouldCleanup',
        message: 'Soll das Installer-Skript nach der Ausführung gelöscht werden? (Empfohlen)',
        default: true,
    },
  ]);

  if (shouldCleanup) {
    await cleanupInstaller();
  } else {
    console.log('\nInstaller-Skript wird beibehalten. Du kannst es später erneut ausführen.');
  }

  console.log('🎉 Setup abgeschlossen! Viel Spaß beim Codieren!');
}

// --- File & Config Modification Functions ---

async function buildPackageJson(selectedModules: Module[]) {
  console.log('package.json wird erstellt...');
  const basePackageJson = JSON.parse(fs.readFileSync(basePackageJsonPath, 'utf-8'));

  for (const module of selectedModules) {
    if (module.dependencies) {
      Object.assign(basePackageJson.dependencies, module.dependencies);
    }
    if (module.devDependencies) {
      Object.assign(basePackageJson.devDependencies, module.devDependencies);
    }
  }

  // Add the installer script itself to devDependencies for potential re-runs
  const installerPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'));
  Object.assign(basePackageJson.devDependencies, installerPackageJson.devDependencies);

  basePackageJson.scripts.setup = 'tsx _installer/install.ts';
  
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(basePackageJson, null, 2) + '\n');
  console.log('package.json erfolgreich erstellt.');
}

async function handleFileCopying(selectedModules: Module[]) {
  console.log('Dateien werden kopiert...');
  for (const module of selectedModules) {
    if (!module.filesToCopy) continue;
    for (const op of module.filesToCopy) {
      const source = path.resolve(templatesDir, op.from);
      const dest = path.resolve(projectRoot, op.to);
      fs.cpSync(source, dest, { recursive: true });
      console.log(`- '${op.from}' nach '${op.to}' kopiert.`);
    }
  }
}

async function updateNextConfig(selectedModules: Module[]) {
  console.log('next.config.js wird aktualisiert...');
  let content = fs.readFileSync(nextConfigPath, 'utf-8');

  for (const module of selectedModules) {
    const mods = module.nextConfigModifications;
    if (!mods) continue;

    if (mods.addSassOptions) {
        content = content.replace(
            'reactStrictMode: true,',
            'reactStrictMode: true,\n\tsassOptions: { includePaths: [path.join(__dirname, "src/scss")] },'
        );
        console.log(`- 'sassOptions' zu next.config.js hinzugefügt.`);
    }
    if (mods.addMdxWrapper) {
        const mdxConfig = `const withMDX = require('@next/mdx')({
            extension: /\.mdx?$/,
            options: {
                // If you use remark-gfm, you'll need to use next.config.mjs
                // as the package is ESM only
                // https://github.com/remarkjs/remark-gfm#install
                remarkPlugins: [],
                rehypePlugins: [],
                // If you use \`MDXProvider\`, uncomment the following line.
                // providerImportSource: "@mdx-js/react",
            },
        });`;
        content = `${mdxConfig}\n${content}`;
        content = content.replace(
            'module.exports = nextConfig;',
            'module.exports = withMDX(nextConfig);'
        );
        content = content.replace(
            "pageExtensions: ['js', 'jsx', 'ts', 'tsx']",
            "pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx']"
        );
        console.log(`- 'withMDX'-Wrapper zu next.config.js hinzugefügt.`);
    }
  }
  fs.writeFileSync(nextConfigPath, content);
  console.log('next.config.js aktualisiert.');
}

async function updateCssFiles(selectedModules: Module[]) {
  console.log('CSS-Dateien werden aktualisiert...');
  let content = fs.readFileSync(mainCssPath, 'utf-8');
  for (const module of selectedModules) {
    if (!module.cssModifications) continue;
    const mods = module.cssModifications;

    if (mods.addPlugin) {
      content = content.replace('@import \'tailwindcss\';', `@import 'tailwindcss';\n${mods.addPlugin}`);
      console.log(`- Plugin '${mods.addPlugin}' zu main.css hinzugefügt.`);
    }
    if (mods.addBlock) {
      content = content.replace(mods.addBlock.anchor, mods.addBlock.content);
      console.log(`- Theme-Block zu main.css hinzugefügt.`);
    }
  }
  fs.writeFileSync(mainCssPath, content);
  console.log('CSS-Dateien aktualisiert.');
}

// --- Execution & Cleanup Functions ---

async function installDependencies() {
  console.log('Abhängigkeiten werden installiert...');
  const packageManager = 'yarn';

  return new Promise<void>((resolve, reject) => {
    const child = exec(`${packageManager} install`, { cwd: projectRoot });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`Abhängigkeiten erfolgreich installiert mit '${packageManager}'.`);
        resolve();
      } else {
        reject(new Error(`'${packageManager} install' fehlgeschlagen mit Code ${code}`));
      }
    });
  });
}

async function cleanupInstaller() {
  console.log('Installationsdateien werden bereinigt...');
  const packageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'));
  
  if (packageJson.scripts?.setup) {
    delete packageJson.scripts.setup;
  }
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  fs.rmSync(path.resolve(projectRoot, '_installer'), { recursive: true, force: true });
  
  console.log('Installer-Dateien und setup-Skript entfernt.');
}

// --- Run Script ---
runInstaller().catch(error => {
  console.error('\nEin schwerwiegender Fehler ist während der Installation aufgetreten:', error);
  process.exit(1);
});
