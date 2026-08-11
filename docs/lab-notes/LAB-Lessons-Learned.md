# 🐳 Docker Lesson Learned: Getting My Hello World App Running

> **Kubernetes Platform Lab — Troubleshooting Notes**

---

## 📌 Quick Summary

| | |
|---|---|
| **Goal** | Run a simple Node.js web application inside a Docker container |
| **Expected Result** | Display `Hello World!` at `http://localhost:3000` |
| **Issue** | Container started, then immediately stopped |
| **Error** | `ERR_MODULE_NOT_FOUND` |
| **Root Cause** | Filename did not match the module import |
| **Resolution** | Renamed `helper.mjs` to `helpers.mjs`, rebuilt the image, and ran a new container |

---

## 🎯 What I Was Trying to Do

The goal of this part of the lab was pretty simple: containerize a small web application that displays:

```text
Hello World!
```

I wanted the application to run inside a Docker container and be accessible from my computer at:

```text
http://localhost:3000
```

### The flow I was trying to build

```text
Application Files
       ↓
   Dockerfile
       ↓
 docker build .
       ↓
  Docker Image
       ↓
   docker run
       ↓
   Container
       ↓
localhost:3000
       ↓
 Hello World!
```

The application was a small Node.js app that included files such as:

```text
app.mjs
helper.mjs
package.json
```

---

# 🏗️ Building and Running the Container

## 1️⃣ Build the Docker Image

I started by building an image from the Dockerfile:

```powershell
docker build .
```

### 💡 What this command does

- `docker` — runs the Docker CLI.
- `build` — tells Docker to build an image.
- `.` — uses the current directory as the **build context**.

The build completed successfully:

```text
[+] Building 51.1s (11/11) FINISHED
```

Docker completed steps including:

```text
[2/5] WORKDIR /app
[3/5] COPY package*.json ./
[4/5] RUN npm install
[5/5] COPY . .
```

At this point, I knew Docker was able to successfully build the image.

---

## 2️⃣ Find the Image ID

Instead of trying to figure out the Image ID from all of the SHA-256 values in the build output, I used:

```powershell
docker image ls -a
```

### 💡 What this command does

- `docker image ls` — lists Docker images stored locally.
- `-a` — shows **all** images, including untagged images.

The command displays a table similar to:

```text
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
```

I used the value displayed under:

```text
IMAGE ID
```

### ⭐ Command I Want to Remember

```powershell
docker image ls -a
```

This was much easier than trying to guess which SHA value from the build output was the actual Image ID.

---

## 3️⃣ Run the Container

Once I had the correct Image ID, I ran:

```powershell
docker run -p 3000:3000 <IMAGE_ID>
```

### 💡 What `-p 3000:3000` means

Docker port mappings use this format:

```text
HOST_PORT:CONTAINER_PORT
```

So:

```text
3000:3000
```

means:

```text
My Computer
localhost:3000
      ↓
    Docker
      ↓
  Container
  Port 3000
```

The goal was to open:

```text
http://localhost:3000
```

and see:

```text
Hello World!
```

---

# ⚠️ What Went Wrong

Docker successfully created the container, but the container immediately stopped.

The Node.js application returned:

```text
Error [ERR_MODULE_NOT_FOUND]:
Cannot find module '/app/helpers.mjs'
imported from /app/app.mjs
```

Docker Desktop showed that containers had been created, but they were no longer running.

At this point I learned something important:

> **A stopped container does not automatically mean Docker failed.**

Docker had successfully:

```text
Found the image
      ↓
Created the container
      ↓
Mapped port 3000
      ↓
Started the container
      ↓
Started Node.js
```

The failure happened **inside the application** after Docker started it.

---

# 🕵️ Troubleshooting

## 1️⃣ Open a Shell Inside the Image

Because the application was crashing immediately, I needed a way to get inside the container without allowing Node.js to start normally.

I ran:

```powershell
docker run --rm -it --entrypoint sh <IMAGE_ID>
```

This gave me a Linux shell inside a temporary container.

My prompt changed to:

```text
#
```

That told me I was now working **inside the container**.

### 💡 Command Breakdown

| Option | What It Does |
|---|---|
| `docker run` | Creates a new container from an image |
| `--rm` | Automatically deletes the temporary container when I exit |
| `-i` | Keeps standard input open |
| `-t` | Gives me a terminal |
| `-it` | Creates an interactive terminal session |
| `--entrypoint sh` | Starts a Linux shell instead of the normal application |
| `<IMAGE_ID>` | Specifies which image to use |

Normally, my image was doing this:

```text
Container
    ↓
Node.js
    ↓
Application Error
    ↓
Container Stops
```

Using `--entrypoint sh` temporarily changed that to:

```text
Container
    ↓
Linux Shell
    ↓
Manual Troubleshooting
```

> 💡 This ended up being one of the most useful troubleshooting commands from this exercise.

---

## 2️⃣ Inspect the Files Inside the Container

Once I was inside the container, I ran:

```bash
ls -la /app
```

### 💡 What this command does

- `ls` — lists files and directories.
- `-l` — shows detailed file information.
- `-a` — includes hidden files.
- `/app` — tells Linux which directory I want to inspect.

The output showed files including:

```text
app.mjs
helper.mjs
package.json
package-lock.json
node_modules
```

Then I noticed something important.

The container had:

```text
helper.mjs
```

but the Node.js error said it was looking for:

```text
helpers.mjs
```

That gave me my first real clue.

---

## 3️⃣ Check What `app.mjs` Was Trying to Import

Next, I searched `app.mjs` for the helper module:

```bash
grep -n "helper" /app/app.mjs
```

The output showed:

```text
3:import connectToDatabase from './helpers.mjs'
```

### 💡 What this command does

- `grep` — searches text inside a file.
- `-n` — shows the line number where the match was found.
- `"helper"` — the text I was searching for.
- `/app/app.mjs` — the file I wanted to search.

Now I could compare what the application expected with what was actually inside the container.

---

# 🧩 Root Cause

The application expected this file:

```text
helpers.mjs
```

But the actual file was named:

```text
helper.mjs
```

The difference was literally one letter:

```text
helper.mjs
helpers.mjs
      ^
      s
```

Inside `app.mjs`, the import statement was:

```javascript
import connectToDatabase from './helpers.mjs'
```

Node.js therefore tried to locate:

```text
/app/helpers.mjs
```

That file did not exist.

Node returned:

```text
ERR_MODULE_NOT_FOUND
```

Because Node.js was the main process running inside the container:

```text
Node.js Exits
      ↓
Container Stops
```

So Docker was not the problem. The application inside the container was failing.

---

# 🔧 Resolution

Instead of changing the import statement, I renamed:

```text
helper.mjs
```

to:

```text
helpers.mjs
```

Now the filename matched what `app.mjs` was already expecting:

```text
app.mjs
   ↓
 imports
   ↓
helpers.mjs
```

---

## 🔄 Rebuild the Image

After renaming the file, I rebuilt the image:

```powershell
docker build .
```

This step was important because changing a file on my Windows computer does **not** change an image that has already been built.

The old image still contained:

```text
helper.mjs
```

The updated source files contained:

```text
helpers.mjs
```

So the image had to be rebuilt.

```text
Source File Changed
       ↓
Existing Image Does NOT Change
       ↓
   docker build .
       ↓
 New Image Created
```

---

## 🔎 Find the New Image

After rebuilding, I ran:

```powershell
docker image ls -a
```

I used the new value under:

```text
IMAGE ID
```

and then ran:

```powershell
docker run -p 3000:3000 <NEW_IMAGE_ID>
```

The goal was now:

```text
Docker Container
       ↓
Node.js Application
       ↓
    Port 3000
       ↓
http://localhost:3000
       ↓
   Hello World!
```

---

# 🧠 What I Learned

### 🐳 Docker working does not mean the application is working

Docker successfully created my image and container.

The **application inside the container** was what failed.

Knowing which layer is actually failing makes troubleshooting much easier.

---

### 🔎 Don't guess the Image ID

The output from:

```powershell
docker build .
```

contains several SHA-256 values.

Instead of guessing which one I need, I can use:

```powershell
docker image ls -a
```

and let Docker show me the actual local Image ID.

---

### 🛠️ I can troubleshoot inside a container

This command:

```powershell
docker run --rm -it --entrypoint sh <IMAGE_ID>
```

let me bypass the crashing application and get directly into the Linux environment inside the image.

That allowed me to inspect what was actually there.

---

### 📂 Check actual state instead of assuming

I expected:

```text
helpers.mjs
```

but:

```bash
ls -la /app
```

showed:

```text
helper.mjs
```

Then:

```bash
grep -n "helper" /app/app.mjs
```

showed that the application expected:

```text
helpers.mjs
```

Comparing **what I expected** with **what was actually there** led directly to the root cause.

---

### 🔄 Source changes require a rebuild

Changing:

```text
helper.mjs
```

to:

```text
helpers.mjs
```

did not update the Docker image I already had.

I had to rebuild it:

```powershell
docker build .
```

and then create a new container from the updated image.

---

# 🧰 Commands From This Troubleshooting Session

| Command | What I Used It For |
|---|---|
| `docker build .` | Build an image from my Dockerfile and application files |
| `docker image ls -a` | View all local images and find the correct Image ID |
| `docker run -p 3000:3000 <IMAGE_ID>` | Create a container and map localhost port 3000 to container port 3000 |
| `docker run --rm -it --entrypoint sh <IMAGE_ID>` | Open an interactive Linux shell inside a temporary container |
| `ls -la /app` | See what files actually exist inside the container |
| `grep -n "helper" /app/app.mjs` | Find the helper import inside `app.mjs` |
| `exit` | Leave the temporary troubleshooting container |

---

# 📝 Troubleshooting Flow I Want to Remember

```text
Container Stops
      ↓
Read the Error
      ↓
Determine Which Layer Failed
      ↓
Inspect the Image
      ↓
Open a Shell Inside the Container
      ↓
Inspect the Actual Files
      ↓
Compare Expected vs. Actual
      ↓
Find the Root Cause
      ↓
Fix the Source File
      ↓
Rebuild the Image
      ↓
Create a New Container
      ↓
Test localhost:3000
```

---

# ⭐ Biggest Takeaway

I started this exercise just trying to get a simple **Hello World!** web application running inside a Docker container at:

```text
http://localhost:3000
```

The application did not work on the first try, but troubleshooting it taught me more than if it had.

Instead of reinstalling Docker or changing random settings, I followed the error:

```text
Error Message
      ↓
Inspect Container
      ↓
Compare Expected vs. Actual
      ↓
Find the Mismatch
      ↓
Fix It
      ↓
Rebuild
      ↓
Run Again
```

The biggest lesson was learning how to tell the difference between **Docker failing** and **the application inside the container failing**.

I also learned how to get inside a container, inspect its filesystem, search application files from the Linux command line, and rebuild an image after changing the source files.

Those are troubleshooting skills I can carry forward as I start working with containers inside Kubernetes.