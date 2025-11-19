import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../');
const installerDir = path.resolve(projectRoot, '_installer');
const manifestPath = path.resolve(installerDir, 'installer-manifest.json');
const packageJsonPath = path.resolve(projectRoot, 'package.json');
const nextConfigPath = path.resolve(projectRoot, 'next.config.js');

interface Module {
  id: string;
  name: string;
  description: string;
  type: string;
  selected: boolean;
  devDependencies: Record<string, string>;
  filesToDeleteIfDeselected: string[];
  nextConfigModifications?: {
    removeIfDeselected?: string; // Key in nextConfig to remove
  };
}

interface Manifest {
  installerVersion: string;
  modules: Module[];
}

async function runInstaller() {
  console.log('🚀 Next.js Kickstarter Installer wird gestartet...');

  let manifest: Manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (error) {
    console.error('Fehler beim Lesen von installer-manifest.json:', error);
    process.exit(1);
  }

  const scssModule = manifest.modules.find(m => m.id === 'scss');
  if (!scssModule) {
    console.error('SCSS-Modul nicht im Manifest gefunden.');
    process.exit(1);
  }

  // --- 1. Interactive Prompt ---
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'enableScss',
      message: `Möchtest du ${scssModule.name} (${scssModule.description}) nutzen?`,
      default: scssModule.selected,
    },
  ]);

  const enableScss = answers.enableScss;
  console.log(`SCSS-Unterstützung ${enableScss ? 'aktiviert' : 'deaktiviert'}.`);

  // --- 2. Apply Changes ---
  await updatePackageJson(enableScss, scssModule);
  await updateNextConfig(enableScss, scssModule);
  await handleScssFiles(enableScss, scssModule);

  // --- 3. Install Dependencies ---
  await installDependencies();

  // --- 4. Cleanup ---
  await cleanupInstaller();

  console.log('🎉 Setup abgeschlossen! Viel Spaß beim Codieren!');
}

async function updatePackageJson(enableScss: boolean, module: Module) {
  console.log('package.json wird aktualisiert...');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  if (enableScss) {
    // Ensure sass is in devDependencies
    if (!packageJson.devDependencies) packageJson.devDependencies = {};
    Object.assign(packageJson.devDependencies, module.devDependencies);
  } else {
    // Remove sass from devDependencies
    if (packageJson.devDependencies && module.devDependencies) {
      for (const devDep in module.devDependencies) {
        delete packageJson.devDependencies[devDep];
      }
    }
  }

  // Remove setup script
  if (packageJson.scripts && packageJson.scripts.setup) {
    delete packageJson.scripts.setup;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('package.json aktualisiert.');
}

async function updateNextConfig(enableScss: boolean, module: Module) {
  console.log('next.config.js wird aktualisiert...');
  let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');

  if (module.nextConfigModifications?.removeIfDeselected === 'sassOptions') {
    // Regex to find and remove sassOptions block, considering potential comments or surrounding code
    // This regex looks for `sassOptions: { ... },` or `sassOptions: { ... }`
    const removeRegex = /(\s*sassOptions:\s*\{[\s\S]*?\},?\s*)/m;
    
    if (!enableScss && removeRegex.test(nextConfigContent)) {
      nextConfigContent = nextConfigContent.replace(removeRegex, '');
      console.log('sassOptions aus next.config.js entfernt.');
    } else if (enableScss && !removeRegex.test(nextConfigContent)) {
        // If SCSS is enabled, but sassOptions is missing, re-add it.
        // This is a simple append for now. A more robust solution would be an AST transformation.
        // Find the 'nextConfig' object and insert sassOptions inside it.
        const nextConfigStart = nextConfigContent.indexOf('const nextConfig = {');
        if (nextConfigStart !== -1) {
            // Find the end of the reactStrictMode line to insert after it
            const reactStrictModeLineEnd = nextConfigContent.indexOf('reactStrictMode: true,', nextConfigStart) + 'reactStrictMode: true,'.length;
            if (reactStrictModeLineEnd !== -1) {
                // Ensure correct indentation
                const newSassOptions = `\n\tsassOptions: {\n\t\tincludePaths: [path.join(__dirname, 'src/scss')],\n\t},\n`;
                nextConfigContent = nextConfigContent.substring(0, reactStrictModeLineEnd) + newSassOptions + nextConfigContent.substring(reactStrictModeLineEnd);
                console.log('sassOptions zu next.config.js hinzugefügt.');
            }
        }
    }
  }

  fs.writeFileSync(nextConfigPath, nextConfigContent);
  console.log('next.config.js aktualisiert.');
}

async function handleScssFiles(enableScss: boolean, module: Module) {
  if (!enableScss) {
    console.log('SCSS-Dateien werden gelöscht...');
    for (const filePath of module.filesToDeleteIfDeselected) {
      const fullPath = path.resolve(projectRoot, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Gelöscht: ${filePath}`);
      }
    }
    const scssDirPath = path.resolve(projectRoot, 'src/scss');
    // Check if directory is empty before removing
    if (fs.existsSync(scssDirPath) && fs.readdirSync(scssDirPath).length === 0) {
      fs.rmSync(scssDirPath, { recursive: true, force: true }); // Use rmSync for directory
      console.log(`Leeres Verzeichnis gelöscht: src/scss`);
    } else if (fs.existsSync(scssDirPath)) {
        console.warn(`Das Verzeichnis src/scss ist nach dem Löschen von Dateien nicht leer. Bitte manuell überprüfen.`);
    }
  }
}

async function installDependencies() {
    console.log('Paketmanager wird ausgeführt, um Abhängigkeiten zu installieren/entfernen...');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const packageManager = packageJson.packageManager?.split('@')[0] || 'npm';

    return new Promise<void>((resolve, reject) => {
        exec(`${packageManager} install`, { cwd: projectRoot }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Fehler beim Ausführen von '${packageManager} install': ${error.message}`);
                console.error(stderr);
                return reject(error);
            }
            console.log(stdout);
            console.log(`Abhängigkeiten erfolgreich aktualisiert mit '${packageManager}'.`);
            resolve();
        });
    });
}


async function cleanupInstaller() {
  console.log('Installationsdateien werden bereinigt...');
  fs.rmSync(installerDir, { recursive: true, force: true });
  console.log('Installationsverzeichnis entfernt.');
}

runInstaller().catch(error => {
  console.error('Ein Fehler ist während der Installation aufgetreten:', error);
  process.exit(1);
});
