#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Class to manage and update version numbers and build numbers
 * for a React Native project, including Android and iOS.
 */
class VersionManager {
    /**
     * Initializes the VersionManager.
     * Sets up readline interface for user input and determines paths
     * to package.json, Android build.gradle, and iOS project.pbxproj.
     */
    constructor() {
        /**
         * @type {readline.Interface} Interface for reading user input
         */
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        /**
         * @type {string} Root directory of the project
         */
        this.projectRoot = process.cwd();

        /**
         * @type {string} Path to package.json
         */
        this.packageJsonPath = path.join(this.projectRoot, 'package.json');

        /**
         * @type {string} Path to Android build.gradle
         */
        this.androidGradlePath = path.join(this.projectRoot, 'android', 'app', 'build.gradle');

        /**
         * @type {string|null} Path to iOS project.pbxproj if found
         */
        this.iosProjectPath = this.findIOSProjectFile();
    }

    /**
     * Creates a backup of a file with a .bak extension.
     * @param {string} filePath - The path of the file to back up.
     */
    backupFile(filePath) {
        if (!filePath || !fs.existsSync(filePath)) return;
        const backupPath = filePath + '.bak';
        try {
            fs.copyFileSync(filePath, backupPath);
            console.log(`📦 Backup created: ${backupPath}`);
        } catch (error) {
            console.warn(`⚠️ Could not create backup for ${filePath}:`, error.message);
        }
    }

    /**
     * Searches for the iOS Xcode project file (.xcodeproj) and returns the path
     * to its project.pbxproj file.
     * @returns {string|null} Path to project.pbxproj or null if not found
     */
    findIOSProjectFile() {
        const iosDir = path.join(this.projectRoot, 'ios');
        if (!fs.existsSync(iosDir)) return null;

        const files = fs.readdirSync(iosDir);
        const xcodeProject = files.find(file => file.endsWith('.xcodeproj'));

        return xcodeProject ? path.join(iosDir, xcodeProject, 'project.pbxproj') : null;
    }

    /**
     * Prompts the user with a question and returns the input.
     * @param {string} query - The question to display to the user.
     * @returns {Promise<string>} User input
     */
    async question(query) {
        return new Promise(resolve => {
            this.rl.question(query, resolve);
        });
    }

    /**
     * Reads the current version from package.json.
     * @returns {string|null} Current version string or null if an error occurs
     */
    getCurrentPackageVersion() {
        try {
            const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
            return packageJson.version;
        } catch (error) {
            console.error('Error reading package.json:', error.message);
            return null;
        }
    }

    /**
     * Reads current build numbers from Android and iOS projects.
     * @returns {{android: number|null, ios: number|null}} Build numbers for Android and iOS
     */
    getCurrentBuildNumbers() {
        let androidBuildNumber = null;
        let iosBuildNumber = null;

        // Android
        try {
            const gradleContent = fs.readFileSync(this.androidGradlePath, 'utf8');
            const versionCodeMatch = gradleContent.match(/versionCode\s+(\d+)/);
            if (versionCodeMatch) {
                androidBuildNumber = parseInt(versionCodeMatch[1]);
            }
        } catch (error) {
            console.warn('Could not read Android build.gradle:', error.message);
        }

        // iOS
        try {
            if (this.iosProjectPath && fs.existsSync(this.iosProjectPath)) {
                const pbxprojContent = fs.readFileSync(this.iosProjectPath, 'utf8');
                const currentProjectVersionMatch = pbxprojContent.match(/CURRENT_PROJECT_VERSION\s*=\s*(\d+)/);
                if (currentProjectVersionMatch) {
                    iosBuildNumber = parseInt(currentProjectVersionMatch[1]);
                }
            }
        } catch (error) {
            console.warn('Could not read iOS project.pbxproj:', error.message);
        }

        return { android: androidBuildNumber, ios: iosBuildNumber };
    }

    /**
     * Updates the version field in package.json.
     * @param {string} newVersion - New version string to set
     * @returns {boolean} True if successful, false otherwise
     */
    updatePackageJsonVersion(newVersion) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
            packageJson.version = newVersion;
            fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
            console.log(`✅ Updated package.json version to ${newVersion}`);
            return true;
        } catch (error) {
            console.error('Error updating package.json:', error.message);
            return false;
        }
    }

    /**
     * Updates the Android build.gradle file with a new versionName and versionCode.
     * Creates a backup before making changes.
     * @param {string} versionName - New version name (e.g., "1.0.0")
     * @param {number} versionCode - New integer version code
     * @returns {boolean} True if update succeeded, false otherwise
     */
    updateAndroidVersion(versionName, versionCode) {
        try {
            this.backupFile(this.androidGradlePath);
            let gradleContent = fs.readFileSync(this.androidGradlePath, 'utf8');

            // Update versionCode
            const versionCodeUpdated = gradleContent.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);

            // Update versionName - handle different formats
            let versionNameUpdated = versionCodeUpdated.replace(/versionName\s+"[^"]*"/g, `versionName "${versionName}"`);
            versionNameUpdated = versionNameUpdated.replace(/versionName\s+'[^']*'/g, `versionName "${versionName}"`);
            versionNameUpdated = versionNameUpdated.replace(/versionName\s+[^\s\n]+/g, `versionName "${versionName}"`);

            // Verify
            const versionCodeMatch = versionNameUpdated.match(/versionCode\s+(\d+)/);
            const versionNameMatch = versionNameUpdated.match(/versionName\s+["']([^"']+)["']/);

            if (versionCodeMatch && versionNameMatch) {
                fs.writeFileSync(this.androidGradlePath, versionNameUpdated);
                console.log(`✅ Updated Android: versionName="${versionNameMatch[1]}", versionCode=${versionCodeMatch[1]}`);
                return true;
            } else {
                console.error('❌ Failed to update Android version - could not match version patterns');
                console.log('Current versionCode match:', versionCodeMatch);
                console.log('Current versionName match:', versionNameMatch);
                return false;
            }
        } catch (error) {
            console.error('Error updating Android build.gradle:', error.message);
            return false;
        }
    }

    /**
     * Updates iOS project.pbxproj with new MARKETING_VERSION and CURRENT_PROJECT_VERSION.
     * Creates a backup before editing.
     * @param {string} marketingVersion - New marketing version (CFBundleShortVersionString)
     * @param {number} projectVersion - New project version (CFBundleVersion)
     * @returns {boolean} True if update succeeded, false otherwise
     */
    updateIOSVersion(marketingVersion, projectVersion) {
        if (!this.iosProjectPath || !fs.existsSync(this.iosProjectPath)) {
            console.warn('⚠️  iOS project.pbxproj not found, skipping iOS update');
            return true;
        }

        try {
            this.backupFile(this.iosProjectPath);
            let pbxprojContent = fs.readFileSync(this.iosProjectPath, 'utf8');

            pbxprojContent = pbxprojContent.replace(/MARKETING_VERSION\s*=\s*[^;]+;/g, `MARKETING_VERSION = ${marketingVersion};`);
            pbxprojContent = pbxprojContent.replace(/CURRENT_PROJECT_VERSION\s*=\s*\d+;/g, `CURRENT_PROJECT_VERSION = ${projectVersion};`);

            fs.writeFileSync(this.iosProjectPath, pbxprojContent);
            console.log(`✅ Updated iOS: MARKETING_VERSION=${marketingVersion}, CURRENT_PROJECT_VERSION=${projectVersion}`);
            return true;
        } catch (error) {
            console.error('Error updating iOS project.pbxproj:', error.message);
            return false;
        }
    }

    /**
     * Prompts the user for a new version number.
     * @param {string} currentVersion - The current version string
     * @returns {Promise<string>} The new version input or the current version if empty
     */
    async promptForVersion(currentVersion) {
        console.log(`\n📦 Current version: ${currentVersion}`);
        const input = await this.question('Enter new version (or press Enter to keep current): ');
        return input.trim() || currentVersion;
    }

    /**
     * Prompts the user for a build number, suggesting the next increment.
     * @param {{android: number|null, ios: number|null}} currentBuildNumbers - Current build numbers
     * @returns {Promise<number>} The chosen build number
     */
    async promptForBuildNumber(currentBuildNumbers) {
        const { android, ios } = currentBuildNumbers;
        const maxBuild = Math.max(android || 0, ios || 0);
        const suggestedBuild = maxBuild + 1;

        console.log(`\n🔢 Current build numbers:`);
        if (android !== null) console.log(`   Android: ${android}`);
        if (ios !== null) console.log(`   iOS: ${ios}`);
        console.log(`   Suggested next: ${suggestedBuild}`);

        const input = await this.question(`Use build number ${suggestedBuild}? (y/n/enter number): `);
        const trimmedInput = input.trim().toLowerCase();

        if (trimmedInput === 'y' || trimmedInput === 'yes' || trimmedInput === '') {
            return suggestedBuild;
        } else if (trimmedInput === 'n' || trimmedInput === 'no') {
            return maxBuild;
        } else {
            const customBuild = parseInt(trimmedInput);
            if (isNaN(customBuild) || customBuild < 1) {
                console.log('Invalid input. Using suggested build number.');
                return suggestedBuild;
            }
            return customBuild;
        }
    }

    /**
     * Executes the version and build number update process:
     * 1. Reads current versions
     * 2. Prompts the user for updates
     * 3. Confirms changes
     * 4. Applies updates to package.json, Android, and iOS
     */
    async run() {
        console.log('🚀 React Native Version Manager\n');

        if (!fs.existsSync(this.packageJsonPath)) {
            console.error('❌ package.json not found. Are you in a React Native project root?');
            this.rl.close();
            return;
        }

        try {
            const currentVersion = this.getCurrentPackageVersion();
            if (!currentVersion) {
                console.error('❌ Could not read current version from package.json');
                this.rl.close();
                return;
            }

            const newVersion = await this.promptForVersion(currentVersion);
            const currentBuildNumbers = this.getCurrentBuildNumbers();
            const newBuildNumber = await this.promptForBuildNumber(currentBuildNumbers);

            console.log(`\n📋 Summary of changes:`);
            console.log(`   Version: ${currentVersion} → ${newVersion}`);
            console.log(`   Build number: ${newBuildNumber}`);

            const confirm = await this.question('\nProceed with these changes? (y/n): ');
            if (!['y', 'yes'].includes(confirm.trim().toLowerCase())) {
                console.log('❌ Operation cancelled');
                this.rl.close();
                return;
            }

            console.log('\n🔄 Applying changes...\n');

            const packageSuccess = this.updatePackageJsonVersion(newVersion);
            const androidSuccess = this.updateAndroidVersion(newVersion, newBuildNumber);
            const iosSuccess = this.updateIOSVersion(newVersion, newBuildNumber);

            if (packageSuccess && androidSuccess && iosSuccess) {
                console.log('\n🎉 All updates completed successfully!');
            } else {
                console.log('\n⚠️  Some updates failed. Please check the error messages above.');
            }
        } catch (error) {
            console.error('❌ An unexpected error occurred:', error.message);
        } finally {
            this.rl.close();
        }
    }
}

// Run the script
const versionManager = new VersionManager();
versionManager.run().catch(console.error);
