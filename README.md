# 🇺🇬 This is Uganda

A React Native CLI app built with the **new architecture** (TurboModules, Fabric, JSI, and NitroModules).  
Explore Uganda’s beauty through modern mobile engineering practices.

![React Native](https://img.shields.io/badge/React%20Native-0.73%2B-blue)
![Yarn](https://img.shields.io/badge/Package%20Manager-Yarn-2188B6?logo=yarn)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)


# 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Linting & Formatting](#-linting--formatting)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Contributors](#-contributors-)
- [License](#-license)


# ✨ Features
- ⚡️ **New React Native Architecture** (TurboModules, Fabric Renderer, JSI, NitroModules).  
- 📱 **Cross-platform**: Android + iOS support.  
- 🧭 **React Navigation** for smooth app navigation.  
- ⚛️ **Signals state management** via [`@preact/signals-react`](https://www.npmjs.com/package/@preact/signals-react).  
- 🔧 Strict **TypeScript** typing.  
- 🎨 Code style enforced with **ESLint + Prettier**.  
- 📂 Clear modular file structure.

# 🛠 Tech Stack
- [React Native CLI](https://reactnative.dev/docs/environment-setup)  
- [React Navigation](https://reactnavigation.org/)  
- [@preact/signals-react](https://github.com/preactjs/signals)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Yarn](https://yarnpkg.com/)  
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)  


# 📋 Prerequisites
Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (≥ 18.x recommended)  
- [Yarn](https://classic.yarnpkg.com/en/docs/install)  
- [React Native CLI](https://reactnative.dev/docs/environment-setup)  
- [Xcode](https://developer.apple.com/xcode/) (for iOS)  
- [Android Studio](https://developer.android.com/studio) (for Android)  
- [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) (for iOS dependencies)


# 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Tambulab/this-is-uganda.git
cd this-is-uganda
yarn install
````

Install iOS dependencies:

```bash
cd ios && pod install && cd ..
```


## ▶️ Running the App

Start the Metro bundler:

```bash
yarn start
```

Run on Android:

```bash
yarn android
```

Run on iOS:

```bash
yarn ios
```


# 🏗 Project Structure

For full details see [file-structure.md](./file-structure.md).
Key directories:

```
this-is-uganda/
├── android/        # Native Android code
├── ios/            # Native iOS code
├── src/            # App source code
│   ├── components/ # Shared components
│   ├── navigation/ # Navigation setup
│   ├── screens/    # Screen components
│   ├── signals/    # Signals state management
│   └── utils/      # utilities
│   └── helpers/    # Helpers functions
│   └── types/      # Typescript global types definitons
├── index.js        # Entry point
└── ...
```


# 🧪 Testing

Run unit tests with:

```bash
yarn test
```


# 🎨 Linting & Formatting

Check linting issues:

```bash
yarn lint
```

Format code with Prettier:

```bash
yarn format
```


# 🐛 Troubleshooting

* **Metro bundler not starting?**
  Clear the cache:

  ```bash
  yarn start --reset-cache
  ```

* **iOS pods not working?**
  Run:

  ```bash
  cd ios && pod install --repo-update
  ```

* **Android build issues?**
  Ensure you’ve installed the correct JDK + Android SDK.


# Workflow

1. **Create a new branch** for your work:

   ```bash
   git checkout -b feature/my-feature
   ```
2. **Make your changes** and commit them with clear messages:

   ```bash
   git commit -m "Add: short description of change"
   ```
3. **Push your branch** to the repo:

   ```bash
   git push origin feature/my-feature
   ```
4. **Open a Pull Request (PR)** to merge your branch into `dev`.

# Contribution Guidelines

* Use **descriptive branch names**:

  * `feature/awesome-feature`
  * `fix/bug-description`
  * `chore/dependency-update`
* Keep commits focused — avoid mixing unrelated changes.
* Ensure code passes linting & tests before submitting.
* Add yourself to the [Contributors](#contributors-) list with the All Contributors bot by commenting:

  ```
  @all-contributors please add @your-username for code
  ```


# License
This project is licensed under the [MIT License](./LICENSE).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ssewilliam"><img src="https://avatars.githubusercontent.com/u/21138053?v=4?s=100" width="100px;" alt="ssewilliam"/><br /><sub><b>ssewilliam</b></sub></a><br /><a href="https://github.com/Tambulab/this-is-uganda/commits?author=ssewilliam" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

