

# Contributing to This Is Uganda

Thank you for your interest in contributing!  
Please follow these guidelines to ensure smooth collaboration.

---

# 📥 1. Clone the Repository
First, clone the project to your local machine:

```bash
git clone https://github.com/Tambulab/this-is-uganda.git
cd this-is-uganda
````

# 🌱 2. Branching Workflow

1. Checkout the `dev` branch:

   ```bash
   git checkout dev
   ```

2. Create a new branch from `dev`.
   **Branch naming convention**:

   * `feature/<short-description>` (for new features)
   * `bugfix/<short-description>` (for bug fixes)
   * `hotfix/<short-description>` (for urgent fixes)
   * `chore/<short-description>` (for maintenance tasks)

   Example:

   ```bash
   git checkout -b feature/add-login-form
   ```



# ✍️ 3. Making Changes

1. Make your changes in the newly created branch.

2. Stage your changes:

   ```bash
   git add .
   ```

3. Commit with a clear and descriptive message:

   ```bash
   git commit -m "feat: add login form with validation"
   ```

   **Commit message guidelines**:

   * Use present tense (“add feature” not “added feature”).
   * Be specific about what was changed.
   * Recommended prefixes:

     * `feat:` → new feature
     * `fix:` → bug fix
     * `docs:` → documentation only
     * `chore:` → build/maintenance tasks



# 🚀 4. Pushing Your Branch

Push your branch to the remote repository:

```bash
git push -u origin <your-branch-name>
```

The `-u` flag sets up tracking so future pushes can be done simply with:

```bash
git push
```



# 🔀 5. Creating a Pull Request (PR)

1. Go to the repository on GitHub.
2. Create a **Pull Request (PR)**:

   * **Base branch**: `dev`
   * **Compare branch**: your feature/bugfix branch
3. Provide a clear title and description of your changes.
4. Submit the PR for review.

⚠️ **Important:** PRs should **always** point to the `dev` branch — never directly to `main`.



# 🔄 6. Merging Your Branch

When merging, always use **no fast-forward** (`--no-ff`) to preserve branch history:

```bash
git checkout dev
git merge --no-ff <your-branch-name>
```



# ✅ 7. Best Practices & Notes

* Keep your branch up-to-date with `dev`:

  ```bash
  git checkout dev
  git pull origin dev
  git checkout <your-branch-name>
  git merge dev
  ```
* Write clean, self-explanatory code.
* Add or update documentation when needed.
* Test your changes before pushing.
* Keep PRs focused and small — one logical change per PR.



# 📌 Summary Workflow

```bash
# Clone repo
git clone https://github.com/Tambulab/this-is-uganda.git
cd this-is-uganda

# Start work
git checkout dev
git checkout -b feature/short-description

# Stage + Commit
git add .
git commit -m "feat: meaningful commit message"

# Push
git push -u origin feature/short-description

# Create PR -> base: dev
# Merge PR with --no-ff strategy
```



Happy coding, and thank you for contributing! 🎉
