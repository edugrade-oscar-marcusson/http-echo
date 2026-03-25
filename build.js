const { spawnSync } = require("child_process");
const Path = require("path");
const OS = require('os');
const FS = require('fs');

build(getDotnetRID());

function build(target) {
    if (process.argv[2] != "uninstall") {
        console.log("");
        console.log("Bygger " + target);
        const args = [
            "publish",
            "-c", "Release",
            "-r", target,
            "--self-contained", "true",
            "/p:PublishSingleFile=true",
            "/p:PublishTrimmed=true"
        ];

        const result = spawnSync("dotnet", args, { stdio: "inherit" });
        if (result.error) {
            throw result.error;
        }
        if (result.status !== 0) {
            process.exit(result.status);
        }
    }

    const programName = `http-echo${OS.platform() == "win32" ? ".exe" : ""}`;
    const buildPath = Path.resolve(Path.join("bin", "Release", "net8.0", target, "publish", programName));

    if (process.argv[2] == "install") {
        console.log();
        console.log();
        console.log();
        installExecutableGlobally(buildPath);
    }
    else if (process.argv[2] == "uninstall") {
        uninstallExecutableGlobally(buildPath);
    }
    else {
        const outputPath = Path.resolve(programName);
        FS.rmSync(programName, { force: true });
        FS.cpSync(buildPath, outputPath);
    }
}

function getDotnetRID() {
    const platform = OS.platform(); // 'win32', 'darwin', 'linux'
    const arch = OS.arch(); // 'x64', 'arm', 'arm64', etc.

    let ridPlatform;
    let ridArch;

    // Map platform
    switch (platform) {
        case 'win32':
            ridPlatform = 'win';
            break;
        case 'darwin':
            ridPlatform = 'osx';
            break;
        case 'linux':
            ridPlatform = 'linux';
            break;
        default:
            throw new Error(`Har inget stöd för plattformen ${platform}`);
    }

    // Map architecture
    switch (arch) {
        case 'x64':
            ridArch = 'x64';
            break;
        case 'arm64':
            ridArch = 'arm64';
            break;
        case 'arm':
            ridArch = 'arm';
            break;
        case 'ia32':
            ridArch = 'x86';
            break;
        default:
            throw new Error(`har inget stöd för arkitekturen ${arch}`);
    }

    return `${ridPlatform}-${ridArch}`;
}

function resolveTargetInstallationDirectory(exePath) {
    const platform = OS.platform();
    let targetDir;

    if (platform === 'win32') {
        const appData = process.env.APPDATA;
        if (!appData) throw new Error('Det fanns ingen APPDATA miljövariabel, så det går inte att installera');
        targetDir = Path.join(appData, 'npm');
    } else {
        targetDir = Path.join(OS.homedir(), 'bin');
    }

    return targetDir;
}

function installExecutableGlobally(exePath) {
    if (!FS.existsSync(exePath)) {
        throw new Error(`Kunde inte hitta det byggda programmet under ${exePath}`);
    }

    const targetDir = resolveTargetInstallationDirectory(exePath);
    if (!FS.existsSync(targetDir)) {
        FS.mkdirSync(targetDir, { recursive: true });
    }

    const exeName = Path.basename(exePath);
    const dest = Path.join(targetDir, exeName);

    FS.copyFileSync(exePath, dest);
    FS.chmodSync(dest, 0o755); // Make sure it's executable

    console.log("\x1b[1m\x1b[32mhttp-echo\x1b[0m är nu installerat");
    console.log(`Programmet placerades under \x1b[36m${dest}\x1b[0m`);
    console.log();
    console.log(`Terminalen kan behöva startas om för att programmet ska dyka upp`);
    console.log(`Säkerställ att \x1b[36m${targetDir}\x1b[0m finns i din PATH om problem uppstår`);
}

function uninstallExecutableGlobally(exePath) {
    const targetDir = resolveTargetInstallationDirectory(exePath);
    const exeName = Path.basename(exePath);
    const dest = Path.join(targetDir, exeName);
    try {
        FS.rmSync(dest);
        console.log("\x1b[1m\x1b[32mhttp-echo\x1b[0m är nu avinstallerat");
    }
    catch {
        console.log("\x1b[1m\x1b[32mhttp-echo\x1b[0m var redan avinstallerat");
    }
}