import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// --- Types ---
interface Module {
  id: string;
  name: string;
  description: string;
  type: string;
  selected: boolean;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  filesToDeleteIfDeselected?: string[];
  nextConfigModifications?: {
    removeIfDeselected?: string;
    removeWrapper?: string;
    removeFromPageExtensions?: string;
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
const installerDir = path.resolve(projectRoot, '_installer');
const manifestPath = path.resolve(installerDir, 'installer-manifest.json');
const packageJsonPath = path.resolve(projectRoot, 'package.json');
const nextConfigPath = path.resolve(projectRoot, 'next.config.js');

// --- Main Installer Logic ---
async function runInstaller() {
  console.log('🚀 Next.js Kickstarter Installer wird gestartet...');

  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // 1. Interactive Prompts
  const prompts = manifest.modules.map(mod => ({
    type: 'confirm',
    name: mod.id,
    message: `Möchtest du ${mod.name} nutzen? (${mod.description})`,
    default: mod.selected,
  }));
  const answers = await inquirer.prompt(prompts);

  const selectedModules = manifest.modules.filter(mod => answers[mod.id]);
  const deselectedModules = manifest.modules.filter(mod => !answers[mod.id]);

  console.log('\nAusgewählte Module:', selectedModules.map(m => m.name).join(', ') || 'Keine');
  console.log('Abgewählte Module:', deselectedModules.map(m => m.name).join(', ') || 'Keine', '\n');

  // 2. Apply Changes
  await updatePackageJson(deselectedModules);
  await updateNextConfig(deselectedModules);
  await handleFilesToDelete(deselectedModules);

  // 3. Install Dependencies
  await installDependencies();

  // 4. Cleanup
  await cleanupInstaller();

  console.log('🎉 Setup abgeschlossen! Viel Spaß beim Codieren!');
}

// --- File Modification Functions ---

async function updatePackageJson(deselectedModules: Module[]) {
  console.log('package.json wird aktualisiert...');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  for (const module of deselectedModules) {
    if (module.dependencies && packageJson.dependencies) {
      for (const dep in module.dependencies) {
        delete packageJson.dependencies[dep];
      }
    }
    if (module.devDependencies && packageJson.devDependencies) {
      for (const devDep in module.devDependencies) {
        delete packageJson.devDependencies[devDep];
      }
    }
  }

  // Remove setup script
  if (packageJson.scripts?.setup) {
    delete packageJson.scripts.setup;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('package.json aktualisiert.');
}

async function updateNextConfig(deselectedModules: Module[]) {
  console.log('next.config.js wird aktualisiert...');
  let content = fs.readFileSync(nextConfigPath, 'utf-8');

  for (const module of deselectedModules) {
    const mods = module.nextConfigModifications;
    if (!mods) continue;

    // Remove a simple key-value block (like sassOptions)
    if (mods.removeIfDeselected) {
      const regex = new RegExp(`\s*${mods.removeIfDeselected}:\s*\{[\s\S]*?\},?`, 'm');
      content = content.replace(regex, '');
      console.log(`- '${mods.removeIfDeselected}' aus next.config.js entfernt.`);
    }

    // Remove a page extension from the pageExtensions array
    if (mods.removeFromPageExtensions) {
      const regex = new RegExp(`'${mods.removeFromPageExtensions}',?\s*|\s*,'${mods.removeFromPageExtensions}'`, 'g');
      content = content.replace(regex, '');
      console.log(`- '${mods.removeFromPageExtensions}' aus 'pageExtensions' entfernt.`);
    }
    
    // Remove a wrapper function (like withMDX)
    if (mods.removeWrapper) {
      const wrapperConstRegex = new RegExp(`const\s+${mods.removeWrapper}\s*=\s*require\(.*\);?`, 'm');
      content = content.replace(wrapperConstRegex, '');
      
      const moduleExportRegex = new RegExp(`module\.exports\s*=\s*${mods.removeWrapper}\((.*)\);`, 's');
      content = content.replace(moduleExportRegex, 'module.exports = $1;');
      console.log(`- Wrapper '${mods.removeWrapper}' aus next.config.js entfernt.`);
    }
  }

  fs.writeFileSync(nextConfigPath, content);
  console.log('next.config.js aktualisiert.');
}

async function handleFilesToDelete(deselectedModules: Module[]) {
  console.log('Nicht benötigte Dateien und Ordner werden gelöscht...');
  for (const module of deselectedModules) {
    if (!module.filesToDeleteIfDeselected) continue;

    for (const fileOrDirPath of module.filesToDeleteIfDeselected) {
      const fullPath = path.resolve(projectRoot, fileOrDirPath);
      if (fs.existsSync(fullPath)) {
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`- Verzeichnis gelöscht: ${fileOrDirPath}`);
          } else {
            fs.unlinkSync(fullPath);
            console.log(`- Datei gelöscht: ${fileOrDirPath}`);
          }
        } catch (e) {
            console.error(`Fehler beim Löschen von ${fullPath}:`, e)
        }
      }
    }
  }
}

// --- Execution Functions ---

async function installDependencies() {
  console.log('Paketmanager wird ausgeführt, um Abhängigkeiten zu installieren/entfernen...');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const packageManager = packageJson.packageManager?.split('@')[0] || 'npm';

  return new Promise<void>((resolve, reject) => {
    exec(`${packageManager} install`, { cwd: projectRoot }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Fehler beim Ausführen von '${packageManager} install': ${error.message}\n${stderr}`);
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

// --- Run Script ---
runInstaller().catch(error => {
  console.error('\nEin schwerwiegender Fehler ist während der Installation aufgetreten:', error);
  process.exit(1);
});