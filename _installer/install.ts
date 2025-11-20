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
	console.log('🚀 Starting Next.js Kickstarter Installer...');

	const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
	const nonInteractive = process.argv.includes('--yes');
	let answers: Record<string, 'Yes' | 'No'>;

	if (nonInteractive) {
		console.log('Non-interactive mode (--yes flag detected). Answering "Yes" to all modules.');
		answers = manifest.modules.reduce(
			(acc, mod) => {
				acc[mod.id] = 'Yes';
				return acc;
			},
			{} as Record<string, 'Yes' | 'No'>,
		);
	} else {
		// 1. Interactive Prompts
		const prompts = manifest.modules.map((mod) => ({
			type: 'list' as const,
			name: mod.id,
			message: `Should '${mod.name}' be added? (${mod.description})`,
			choices: ['Yes', 'No'] as const,
			default: 'No' as const,
		}));
		answers = await inquirer.prompt(prompts);
	}

	await saveInstallerOptions(answers);

	const selectedModules = manifest.modules.filter((mod) => answers[mod.id] === 'Yes');
	console.log('\nSelected modules:', selectedModules.map((m) => m.name).join(', ') || 'None', '\n');

	// 2. Build and Write Final package.json
	await buildPackageJson(selectedModules);

	// 3. Apply file and config changes for selected features
	await handleFileCopying(selectedModules);
	await updateNextConfig(selectedModules);
	await updateCssFiles(selectedModules);

	// 4. Install final dependencies
	await installDependencies();

	// 5. Ask about cleanup
	let shouldCleanup: 'Yes' | 'No';
	if (nonInteractive) {
		console.log('Non-interactive mode: Auto-agreeing to cleanup.');
		shouldCleanup = 'Yes';
	} else {
		const { shouldCleanup: cleanupAnswer } = await inquirer.prompt([
			{
				type: 'list' as const,
				name: 'shouldCleanup',
				message: 'Should the installer script be deleted after execution? (Recommended)',
				choices: ['Yes', 'No'] as const,
				default: 'No' as const,
			},
		]);
		shouldCleanup = cleanupAnswer;
	}

	if (shouldCleanup === 'Yes') {
		await cleanupInstaller();
	} else {
		console.log('\nInstaller script will be kept. You can run it again later.');
	}

	console.log('🎉 Setup complete! Happy coding!');
}

// --- File & Config Modification Functions ---

async function buildPackageJson(selectedModules: Module[]) {
  console.log('Creating package.json...');
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
  console.log('package.json successfully created.');
}

async function handleFileCopying(selectedModules: Module[]) {
  console.log('Copying files...');
  for (const module of selectedModules) {
    if (!module.filesToCopy) continue;
    for (const op of module.filesToCopy) {
      const source = path.resolve(templatesDir, op.from);
      const dest = path.resolve(projectRoot, op.to);
      if (!fs.existsSync(source)) {
        console.log(`- Skipped: Source not found (${op.from})`);
        continue;
      }
      fs.cpSync(source, dest, { recursive: true });
      console.log(`- Copied '${op.from}' to '${op.to}'.`);
    }
  }
}

async function updateNextConfig(selectedModules: Module[]) {
  console.log('Updating next.config.js...');
  let content = fs.readFileSync(nextConfigPath, 'utf-8');

  for (const module of selectedModules) {
    const mods = module.nextConfigModifications;
    if (!mods) continue;

    if (mods.addSassOptions) {
        content = content.replace(
            'reactStrictMode: true,',
            'reactStrictMode: true,\n\tsassOptions: { implementation: "sass-embedded", },'
        );
        console.log(`- Added 'sassOptions' to next.config.js.`);
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
        console.log(`- Added 'withMDX' wrapper to next.config.js.`);
    }
  }
  fs.writeFileSync(nextConfigPath, content);
  console.log('next.config.js updated.');
}

async function updateCssFiles(selectedModules: Module[]) {
  console.log('Updating CSS files...');
  let content = fs.readFileSync(mainCssPath, 'utf-8');
  for (const module of selectedModules) {
    if (!module.cssModifications) continue;
    const mods = module.cssModifications;

    if (mods.addPlugin) {
      content = content.replace('@import \'tailwindcss\';', `@import 'tailwindcss';\n${mods.addPlugin}`);
      console.log(`- Added plugin '${mods.addPlugin}' to main.css.`);
    }
    if (mods.addBlock) {
      content = content.replace(mods.addBlock.anchor, mods.addBlock.content);
      console.log(`- Added theme block to main.css.`);
    }
  }
  fs.writeFileSync(mainCssPath, content);
  console.log('CSS files updated.');
}

// --- Execution & Cleanup Functions ---

async function installDependencies() {
  console.log('Installing dependencies...');
  const packageManager = 'yarn';

  return new Promise<void>((resolve, reject) => {
    const child = exec(`${packageManager} install`, { cwd: projectRoot });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`Dependencies successfully installed with '${packageManager}'.`);
        resolve();
      } else {
        reject(new Error(`'${packageManager} install' failed with code ${code}`));
      }
    });
  });
}

async function cleanupInstaller() {
  console.log('Cleaning up installation files...');
  const packageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'));

  if (packageJson.scripts?.setup) {
    delete packageJson.scripts.setup;
  }
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  fs.rmSync(path.resolve(projectRoot, '_installer'), { recursive: true, force: true });

  console.log('Installer files and setup script removed.');
}

// --- Run Script ---
runInstaller().catch(error => {
  console.error('\nA critical error occurred during installation:', error);
  process.exit(1);
});
