const { copyFileSync, mkdirSync, readdirSync, writeFileSync } = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const copyFromApp = () => {
    const files = [
        'app-config.yaml',
        'app-config.production.yaml',
        'app-config.local.yaml',
        'lerna.json',
        'playwright.config.ts',
    ]
    const directories = [
        'packages',
        'examples'
    ]
    for (const file of files) {
        console.log(`Copying ${file}...`);
        copyFileSync(`./backstage/${file}`, file);
    }
    
    const copyFiles = (source, destination) => {
        const files = readdirSync(source, { withFileTypes: true });
        for (const file of files) {
            console.log(`Copying ${file.name}...`);
            const sourcePath = path.join(source, file.name);
            const destinationPath = path.join(destination, file.name);
            if (file.isDirectory()) {
                mkdirSync(destinationPath, { recursive: true });
                copyFiles(sourcePath, destinationPath);
            } else {
                copyFileSync(sourcePath, destinationPath);
            }
        }
    };

    for (const directory of directories) {
        const source = `./backstage/${directory}`;
        const destination = `./${directory}`;
        mkdirSync(destination, { recursive: true });
        copyFiles(source, destination);
    }
}

const mergePackageJson = () => {
    console.log('Merging package.json from scaffolded app to the current app...');
    const scaffoldPackageJson = require('./backstage/package.json');
    const appPackageJson = require('./package.json');

    const mergeObjects = (target, source) => {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) {
                        target[key] = {};
                    }
                    mergeObjects(target[key], source[key]);
                } else if (!target.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
    };

    const mergedPackageJson = { ...appPackageJson };
    mergeObjects(mergedPackageJson, scaffoldPackageJson);

    const finalPackageJson = JSON.stringify(mergedPackageJson, null, 2);
    
    // Write the merged package.json back to the file system
    console.log('Writing merged package.json to file...');
    writeFileSync('./package.json', finalPackageJson);
};

const scaffold = () => {
    console.log('Starting the scaffold process...');
    let stdoutSeen = false;
    const process = spawn('npx', ['@backstage/create-app', '--skip-install'], { stdio: 'pipe' });

    process.stdout.on('data', (data) => {
        console.log(data.toString());
        // Check if the first bit of data contains a newline
        if (!stdoutSeen) {
            process.stdin.write('\n');
            stdoutSeen = true;
        }
    });

    process.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    process.on('close', (code) => {
        console.log(`Process exited with code ${code}`);
        if (code !== 0) {
            console.error('npx failed');
        } else {
            // Call the next function after the process is closed
            copyFromApp();
            mergePackageJson();
        }
    });
};

scaffold();
