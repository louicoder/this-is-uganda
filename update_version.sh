#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class VersionManager {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        this.projectRoot = process.cwd();
        this.packageJsonPath = path.join(this.projectRoot, 'package.json');
        this.androidGradlePath = path.join(this.projectRoot, 'android', 'app', 'build.gradle');
        this.iosProjectPath = this.findIOSProjectFile();
    }

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

    findIOSProjectFile() {
        const iosDir = path.join(this.projectRoot, 'ios');
        if (!fs.existsSync(iosDir)) return null;

        const files = fs.readdirSync(iosDir);
        const xcodeProject = files.find(file => file.endsWith('.xcodeproj'));

        return xcodeProject ? path.join(iosDir, xcodeProject, 'project.pbxproj') : null;
    }

    async question(query) {
        return new Promise(resolve => {
            this.rl.question(query, resolve);
        });
    }

    getCurrentPackageVersion() {
        try {
            const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
            return packageJson.version;
        } catch (error) {
            console.error('Error reading package.json:', error.message);
            return null;
        }
    }

    getCurrentBuildNumbers() {
        let androidBuildNumber = null;
        let iosBuildNumber = null;

        // Get Android build number
        try {
            const gradleContent = fs.readFileSync(this.androidGradlePath, 'utf8');
            const versionCodeMatch = gradleContent.match(/versionCode\s+(\d+)/);
            if (versionCodeMatch) {
                androidBuildNumber = parseInt(versionCodeMatch[1]);
            }
        } catch (error) {
            console.warn('Could not read Android build.gradle:', error.message);
        }

        // Get iOS build number
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

    updateAndroidVersion(versionName, versionCode) {
        try {
            this.backupFile(this.androidGradlePath);
            let gradleContent = fs.readFileSync(this.androidGradlePath, 'utf8');

            // Update versionCode
            const versionCodeUpdated = gradleContent.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);

            // Update versionName - handle different formats
            let versionNameUpdated = versionCodeUpdated.replace(/versionName\s+"[^"]*"/g, `versionName "${versionName}"`);

            // Also handle single quotes
            versionNameUpdated = versionNameUpdated.replace(/versionName\s+'[^']*'/g, `versionName "${versionName}"`);

            // Handle cases without quotes
            versionNameUpdated = versionNameUpdated.replace(/versionName\s+[^\s\n]+/g, `versionName "${versionName}"`);

            // Verify the changes were made
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

    updateIOSVersion(marketingVersion, projectVersion) {
        if (!this.iosProjectPath || !fs.existsSync(this.iosProjectPath)) {
            console.warn('⚠️  iOS project.pbxproj not found, skipping iOS update');
            return true;
        }

        try {
            this.backupFile(this.iosProjectPath);
            let pbxprojContent = fs.readFileSync(this.iosProjectPath, 'utf8');

            // Update MARKETING_VERSION
            pbxprojContent = pbxprojContent.replace(/MARKETING_VERSION\s*=\s*[^;]+;/g, `MARKETING_VERSION = ${marketingVersion};`);

            // Update CURRENT_PROJECT_VERSION
            pbxprojContent = pbxprojContent.replace(/CURRENT_PROJECT_VERSION\s*=\s*\d+;/g, `CURRENT_PROJECT_VERSION = ${projectVersion};`);

            fs.writeFileSync(this.iosProjectPath, pbxprojContent);
            console.log(`✅ Updated iOS: MARKETING_VERSION=${marketingVersion}, CURRENT_PROJECT_VERSION=${projectVersion}`);
            return true;
        } catch (error) {
            console.error('Error updating iOS project.pbxproj:', error.message);
            return false;
        }
    }

    async promptForVersion(currentVersion) {
        console.log(`\n📦 Current version: ${currentVersion}`);
        const input = await this.question('Enter new version (or press Enter to keep current): ');
        return input.trim() || currentVersion;
    }

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

    async run() {
        console.log('🚀 React Native Version Manager\n');

        // Check if we're in a React Native project
        if (!fs.existsSync(this.packageJsonPath)) {
            console.error('❌ package.json not found. Are you in a React Native project root?');
            this.rl.close();
            return;
        }

        try {
            // Step 1: Handle version update
            const currentVersion = this.getCurrentPackageVersion();
            if (!currentVersion) {
                console.error('❌ Could not read current version from package.json');
                this.rl.close();
                return;
            }

            const newVersion = await this.promptForVersion(currentVersion);

            // Step 2: Handle build number update
            const currentBuildNumbers = this.getCurrentBuildNumbers();
            const newBuildNumber = await this.promptForBuildNumber(currentBuildNumbers);

            // Step 3: Confirm changes
            console.log(`\n📋 Summary of changes:`);
            console.log(`   Version: ${currentVersion} → ${newVersion}`);
            console.log(`   Build number: ${newBuildNumber}`);

            const confirm = await this.question('\nProceed with these changes? (y/n): ');

            if (confirm.trim().toLowerCase() !== 'y' && confirm.trim().toLowerCase() !== 'yes') {
                console.log('❌ Operation cancelled');
                this.rl.close();
                return;
            }

            // Step 4: Apply changes
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
