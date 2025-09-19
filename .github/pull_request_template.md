
## Description
<!-- ❗ Replace this text with a clear and concise description of your changes.
     Do NOT leave this section unchanged. -->

### Sample (delete this and write your own)
This PR adds a new endpoint for user profile updates.
- Implements PATCH `/api/users/{id}/profile`
- Validates input data using existing validation middleware
- Updates documentation to include new endpoint
- Includes unit tests and integration tests for validation and response codes

---

## Related Issue(s)
<!-- ❗ Replace with linked issue(s) in the format: Fixes #123 or Closes #456
     If there is no related issue, explain why. -->
Example: `Fixes #123` (replace this line.)

## Changes Made
<!-- Select all that apply -->
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Code refactor
- [ ] Performance improvement
- [ ] Dependency update
- [ ] Security fix
- [ ] Configuration change
- [ ] Build/CI/CD change
- [ ] Style/formatting update
- [ ] Test-related change
- [ ] Other (please describe)

## Contributor Checklist (required before requesting review)
- [ ] I have switched to my branch: `git checkout <your-branch-name>`
- [ ] I have fetched the latest remote refs: `git fetch origin`
- [ ] I have merged `dev` into my branch (so this PR includes a **merge commit from dev** if any new changes exist):  
  _(Run: `git merge origin/dev` while on your branch)_
- [ ] I have resolved any merge conflicts locally and committed the resolution
- [ ] I have pushed my branch (including the merge commit) to the remote:  
  `git push origin <your-branch-name>`
- [ ] My code follows the project’s coding style
- [ ] I have updated relevant documentation
- [ ] I have added/updated tests where applicable
- [ ] All new and existing tests pass
- [ ] I have considered edge cases and potential risks

### Contributor workflow (copy/paste)
```bash
# 1) fetch latest remotes
git fetch origin

# 2) switch to your feature branch
git checkout <your-branch-name>

# 3) (optional) ensure your branch is up-to-date locally
git pull origin <your-branch-name>

# 4) merge dev into your branch (creates a merge commit)
git merge origin/dev

# 5) resolve conflicts if any -> add & commit
git add . && git commt -m "commit message"

# 6) push your branch (this push should include the merge commit)
git push origin <your-branch-name>
```
