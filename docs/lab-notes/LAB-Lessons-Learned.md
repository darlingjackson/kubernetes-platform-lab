# 🐳 Docker Lesson Learned: Getting My Hello World App Running

> **Kubernetes Platform Lab — Troubleshooting Notes**

---

## 🎯 What I Was Trying to Do

The goal of this part of the lab was pretty simple: I wanted to containerize a small web application that displayed:

```text
Hello World!

I wanted the application running inside a Docker container and accessible from my computer at:
http://localhost:3000

The basic flow I was working through was:
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

The application itself was a small Node.js application using files including:
app.mjs
helper.mjs
package.json

🏗️ Step 1 — Build the Docker Image

I started by building the image from the Dockerfile:
docker build .
    💡 What this command does
        docker — runs the Docker CLI.
        build — tells Docker to create an image.
        . — tells Docker to use the current directory as the build context.

the build completed successfully: [+] Building 51.1s (11/11) FINISHED

Docker processed the Dockerfile and completed steps including:
[2/5] WORKDIR /app
[3/5] COPY package*.json ./
[4/5] RUN npm install
[5/5] COPY . .