# orderup-back




# Git Workflow Cheat Sheet

## 1. Branching Strategy

- **main**: Production-ready code. Auto-deploys to production.
- **develop**: Integration branch for features. Stable but not production-ready.
- **feature/**: New features. Branched from `develop`.
- **release/**: Prepares code for production. Branched from `develop`.
- **hotfix/**: Urgent fixes for production. Branched from `main`.

---

## 2. Git Setup
```bash
git remote add origin https://github.com/org-name/repo-name.git
cd repo-name
git checkout develop
```

---

## 3. Feature Development Workflow

### ✂️ Step 1: Create a Feature Branch
```bash
git checkout -b feature/new-feature develop
```

### ✂️ Step 2: Make Changes & Commit
Use **Conventional Commits**:
```bash
git commit -m "feat(auth): Implement login functionality"
```

### ✂️ Step 3: Push & Open a PR
```bash
git push origin feature/new-feature
```
- Open a Pull Request **feature/new-feature → develop**.
- Request code review.

### ✂️ Step 4: Merge Approved PRs
- Mishael reviews & approves.
- **Squash & Merge** to keep history clean.

---

## 4. Release Process
Once `develop` is stable and ready:
```bash
git checkout -b release/v1.0 develop
git push origin release/v1.0
```
- Final testing on `release/v1.0`
- Merge into `main`:
```bash
git checkout main
git merge release/v1.0
git push origin main
```
- Tag release:
```bash
git tag v1.0
```

---

## 5. Hotfixes (Emergency Fixes)
```bash
git checkout -b hotfix/urgent-fix main
# Fix the issue
git commit -m "fix: urgent bug in checkout"
git push origin hotfix/urgent-fix
git checkout main
git merge hotfix/urgent-fix
git push origin main
```
- Deploy immediately.
- Merge back into `develop`:
```bash
git checkout develop
git merge hotfix/urgent-fix
git push origin develop
```

---

## 6. Git Best Practices

- ✅ No direct commits to `main` or `develop`.
- ✅ Every feature/fix has its own branch.
- ✅ Always use Pull Requests (PRs) to merge.
- ✅ Mandatory code reviews before merge.
- ✅ All CI/CD checks must pass before merge.
- ✅ Commit messages must be meaningful & conventional.

---

## 7. CI/CD Automation with GitHub Actions

### Trigger Conditions
```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - develop
```

### CI/CD Workflow Summary
- Run tests on every PR to `develop`.
- Auto-deploy when `main` is updated.
- Use GitHub Secrets to store API keys and tokens.

---

This workflow ensures smooth collaboration, high-quality code, and reliable deployment. Coordinate with Mishael for CI/CD setup, secret management, and deployment triggers.