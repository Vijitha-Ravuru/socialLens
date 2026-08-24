# GitHub Setup Guide — SocialLens

> **This guide is written for someone doing this for the first time.**
> Read each step carefully before running any command.

---

## What You Need Before Starting

- [ ] A free GitHub account → Sign up at [github.com](https://github.com)
- [ ] Git installed on your computer → Download at [git-scm.com](https://git-scm.com/downloads) → Click "Windows" → Install it with default options
- [ ] To verify Git is installed, open a terminal and type: `git --version`

---

## Step 1 — Open Your Terminal in the Project Folder

You need to open a terminal (command prompt / PowerShell) **inside your project folder**.

**Method A — From File Explorer:**
1. Open File Explorer and navigate to `D:\socialLens-anti`
2. Click the address bar at the top
3. Type `cmd` and press Enter
4. A terminal window opens inside that folder ✓

**Method B — From VS Code:**
1. Open VS Code with your project open
2. Press `Ctrl + `` ` (backtick) to open the terminal
3. The terminal should already be in `D:\socialLens-anti`

**Verify you are in the right place:**
```
cd D:\socialLens-anti
```
Then type:
```
dir
```
You should see files like `README.md`, `client`, `server`, `.gitignore` listed.

---

## Step 2 — Tell Git Who You Are (One-Time Setup)

Git needs to know your name and email. This is only done once on your computer.

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your@email.com"
```

Replace `"Your Full Name"` and `"your@email.com"` with your actual name and the email you used to sign up to GitHub.

---

## Step 3 — Initialize Git in Your Project

Git needs to be initialized in your project folder before it can track your files.

```bash
git init
```

What this does: Creates a hidden `.git` folder inside your project. This is what makes it a Git repository.

You should see:
```
Initialized empty Git repository in D:/socialLens-anti/.git/
```

> **Note:** Git may say the default branch is `master`. That is fine — we will rename it to `main` later.

---

## Step 4 — Stage All Your Files

Staging means telling Git "I want to include these files in my next save point".

```bash
git add .
```

The `.` means "add all files in this folder". Git will automatically skip files listed in `.gitignore` (like `node_modules` and `.env`).

**Verify what will be committed:**
```bash
git status
```

You should see a long list of green files. **You should NOT see** `server/.env`, `node_modules/`, or `client/dist/` in that list. If you do, stop and check your `.gitignore` file.

---

## Step 5 — Make Your First Commit

A commit is a saved snapshot of your project at this point in time.

```bash
git commit -m "Initial commit: SocialLens — Social Media Content Analyzer"
```

What this does: Saves all staged files as a permanent snapshot with the message you provided.

You should see output like:
```
[master (root-commit) abc1234] Initial commit: SocialLens — Social Media Content Analyzer
 X files changed, X insertions(+)
```

---

## Step 6 — Create an Empty Repository on GitHub

1. Open your browser and go to: **[https://github.com/new](https://github.com/new)**
2. Fill in the form:
   - **Repository name:** `sociallens-ai` (or any name you prefer)
   - **Description:** `Social Media Content Analyzer — PDF/Image upload, OCR, AI engagement analysis`
   - **Visibility:** Choose Public (required if you are sharing it for an assessment)
   - **IMPORTANT:** Do NOT check any of these boxes:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   - These already exist in your project. Adding them on GitHub would create a conflict.
3. Click **"Create repository"**

---

## Step 7 — Find Your Repository URL

After creating the repository, GitHub will show you a page with setup instructions.

At the top of the page, you will see a URL like this:

```
https://github.com/YOUR_USERNAME/sociallens-ai.git
```

**Copy this URL.** You will need it in the next step.

You can find this URL by:
- Looking at the green "Code" button on your repository page
- Clicking it → Copy the HTTPS link

---

## Step 8 — Connect Your Local Project to GitHub

Run this command, replacing the URL with your actual repository URL from Step 7:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sociallens-ai.git
```

What this does: Creates a connection called "origin" that points to your GitHub repository. From now on, Git knows where to push your code.

---

## Step 9 — Rename Your Branch to "main"

Modern GitHub uses `main` as the default branch name:

```bash
git branch -M main
```

What this does: Renames your current branch from `master` to `main`.

---

## Step 10 — Push Your Code to GitHub

This is the step that actually uploads your code:

```bash
git push -u origin main
```

What this does:
- `push` — upload your commits to GitHub
- `-u origin main` — set "origin main" as the default for future pushes (so next time you can just type `git push`)

You will see a progress bar and output like:
```
Enumerating objects: 47, done.
Counting objects: 100% (47/47), done.
...
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

If asked for your username and password, enter your GitHub username and a **Personal Access Token** (not your password — GitHub no longer accepts passwords for push). To create a token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name, set expiry, check `repo` scope
4. Copy the token and use it as your password when prompted

---

## Step 11 — Verify on GitHub

1. Open your browser
2. Go to `https://github.com/YOUR_USERNAME/sociallens-ai`

You should see your repository with these files:
```
✅ client/
✅ server/
✅ README.md
✅ APPROACH.md
✅ GITHUB_READINESS.md
✅ GITHUB_SETUP.md
✅ .gitignore
✅ package.json
```

You should NOT see:
```
❌ server/.env          (must not be visible — contains your configuration)
❌ node_modules/        (must not be visible — too large, install locally)
❌ client/dist/         (must not be visible — build output)
```

---

## Making Future Updates

When you make changes to your project later, use these 3 commands:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

**Examples of good commit messages:**
```bash
git commit -m "Fix OCR confidence display for low-quality scans"
git commit -m "Add error handling for oversized PDF files"
git commit -m "Improve platform preview styling"
git commit -m "Update README with deployment instructions"
```

**To check what files you have changed:**
```bash
git status
```

**To see your history of commits:**
```bash
git log --oneline
```

---

## Final Assessment Submission

According to the project guide, you need to submit three things:

### 1. Working Application URL
This is the live URL where your application is deployed and running.
- If you have deployed it (e.g. on Railway, Render, Vercel, etc.), that URL is your working application URL.
- If not yet deployed, mention this is a local development build.

### 2. GitHub Repository URL
This is the URL of your GitHub repository:
```
https://github.com/YOUR_USERNAME/sociallens-ai
```

### 3. Approach Write-Up (max 200 words)
The content of your `APPROACH.md` file serves as this write-up. You can submit it as a document or paste it directly into the submission form.

---

## Quick Reference — All Commands in Order

```bash
# One-time setup
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize and commit (run once in D:\socialLens-anti)
git init
git add .
git status           # verify .env and node_modules are NOT listed
git commit -m "Initial commit: SocialLens — Social Media Content Analyzer"

# Connect to GitHub (after creating repo on github.com)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your message here"
git push
```
