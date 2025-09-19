# Contributing Guide

We welcome contributions of all kinds — bug fixes, features, documentation, and improvements. Please follow these guidelines to keep the workflow smooth and consistent.

---

## 🚀 Development Setup

* Use **Node.js v20+**.
* Use **Yarn** as the package manager.
* Install dependencies with:

```sh
yarn install
```

---

## 🌱 Branching & Workflow

* Branch names should be prefixed according to the change type:

  * `feature/...` for new features
  * `fix/...` for bug fixes
  * `chore/...` for maintenance tasks

* Always **sync with the latest `dev` branch** before starting work:

```sh
git checkout dev
git pull
git checkout -b feature/my-feature
git merge --no-ff dev
```

* **Pull Requests (PRs):**

  * Open **draft PRs** if your work is still in progress.
  * Mark as **ready for review** once complete.
  * All PRs must target the `dev` branch.

---

## 📝 Commits

* Follow **conventional commit messages** (universal style).
* Examples:

  * `feat: add login screen`
  * `fix: crash on Android when opening modal`
  * `chore: update dependencies`

---

## ✅ Standards

* Keep code clean and consistent.
* Run linters, tests, and formatters before committing (if applicable).
* Update documentation when necessary.

---

## 🤝 Contribution Scope

* We welcome:

  * Bug fixes
  * New features
  * Documentation improvements
  * General maintenance

---

## 🧑‍🤝‍🧑 Community

* All contributors are expected to follow our [Code of Conduct](.github/CODE_OF_CONDUCT.md).
* PRs require **at least one review approval** before merging.
