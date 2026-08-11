# 🛠️ 001 — Tooling & Local Environment

> **Status:** ✅ Validated  
> **Focus:** Local Docker development environment  
> **Platform:** Windows + Docker Desktop + WSL 2  
> **Primary Editor:** Visual Studio Code  

---

## 🎯 Goal

Before getting hands-on with containers, I needed to get my local environment ready and make sure all of the tools could communicate with each other.

For this lab, I am working from a Windows workstation and using Docker Desktop as my local container platform.

I wanted to keep the setup simple and only use the tools that are actually part of the work I am doing.

---

## 🧰 Current Toolset

| Tool | Purpose | Status |
|---|---|---|
| 🪟 Windows | Host operating system | ✅ Ready |
| 🐳 Docker Desktop | Local container platform | ✅ Ready |
| 🐧 WSL 2 / Ubuntu | Linux environment | ✅ Ready |
| 💻 Visual Studio Code | Primary code editor | ✅ Ready |
| 📦 Container Tools | Docker integration inside VS Code | ✅ Ready |
| ⌨️ PowerShell | Primary terminal for Docker commands | ✅ Ready |
| 🐳 Docker CLI | Command-line interaction with Docker | ✅ Ready |
| 🌿 Git | Local version control | ✅ Ready |
| 🐙 GitHub | Remote repository | ✅ Ready |

---

# 💻 Local Workstation

## 🪟 Windows Host

My main workstation is running Windows.

Windows is where I currently use:

- Visual Studio Code
- Docker Desktop
- PowerShell
- Git
- GitHub

I am also using WSL 2 so I have access to an Ubuntu Linux environment when I need it.

---

## 🐧 WSL 2 / Ubuntu

I have Ubuntu installed through Windows Subsystem for Linux.

This gives me access to a Linux command-line environment without needing a separate Linux computer or virtual machine that I manage myself.

For now, most of my Docker work is being done through PowerShell, but Ubuntu is available for Linux-based work as the lab becomes more advanced.

### 🔍 WSL Validation

I checked my WSL environments with:

```powershell
wsl -l -v
```

My environment showed:

```text
NAME                   STATE      VERSION
Ubuntu                 Running    2
docker-desktop         Running    2
docker-desktop-data    Running    2
```

This confirmed that Ubuntu and the Docker Desktop WSL environments were running with **WSL 2**.

---

# 🐳 Docker Environment

## Docker Desktop

I installed **Docker Desktop for Windows** to provide the local Docker environment for this lab.

Docker Desktop is responsible for running the local Docker engine that I use to:

- Build Docker images
- Create containers
- Start and stop containers
- Manage container images
- Map container ports to my local machine
- Work with Docker networking and storage later in the lab

Docker Desktop is using WSL 2 on my workstation.

---

## ⌨️ Docker CLI

I am also using the Docker command-line interface.

Instead of depending only on the Docker Desktop GUI, I want to understand how to interact with Docker directly from the terminal.

Some of the commands I have started working with include:

```powershell
docker
docker version
docker build
docker run
docker ps
docker images
```

As I continue through the lab, I will add new commands to the notes where I actually use them.

---

## ✅ Docker CLI Validation

I first confirmed that the Docker CLI was available from the VS Code PowerShell terminal.

```powershell
docker
```

Docker returned its available commands, including:

```text
run
exec
ps
build
pull
push
images
version
info
```

I also verified the installed Docker CLI version:

```powershell
docker --version
```

Result:

```text
Docker version 24.0.5, build ced0996
```

---

## 🔌 Docker Engine Validation

One thing I learned during setup is that having the Docker CLI installed does **not** automatically mean the Docker engine is working.

There are two different pieces involved:

```text
Docker CLI
    │
    │ sends commands
    ▼
Docker Engine
    │
    ▼
Images / Containers
```

At one point, the Docker CLI was available but Docker commands that needed the engine were not responding correctly.

This helped me understand the difference between:

```powershell
docker --version
```

and:

```powershell
docker version
```

### `docker --version`

Verifies that the Docker CLI exists and can run.

### `docker version`

Checks the Docker CLI version and also communicates with the Docker engine.

This was useful because it helped me separate a **CLI problem** from a **Docker engine problem**.

---

# 💻 Visual Studio Code

## Primary Editor

Visual Studio Code is my primary editor for this lab.

I use VS Code for:

- Application code
- Dockerfiles
- JSON files
- Markdown documentation
- Git and GitHub
- Running Docker commands from the integrated terminal
- Kubernetes configuration files later in the lab

---

## 📦 Container Tools Extension

I installed the Docker / Container Tools extension in Visual Studio Code.

This added a **Containers** view to VS Code.

The view allows me to inspect Docker resources such as:

- 📦 Containers
- 🖼️ Images
- 🌐 Registries

This gives me a visual view of the same Docker environment I am controlling from the command line.

---

# 🐛 Setup Issue I Worked Through

During setup, the VS Code Containers extension initially displayed:

```text
Failed to connect. Is Docker running?
```

I also had a point where:

```powershell
docker
```

was not recognized by PowerShell.

I confirmed that the Docker CLI executable existed on the system and found it at:

```text
C:\Program Files\Docker\Docker\resources\bin\docker.exe
```

I was able to run the Docker executable directly, which confirmed that Docker was installed even though PowerShell was not initially finding the command.

After restarting VS Code and later restarting the workstation, the Docker CLI and Docker Desktop environment were able to communicate correctly.

---

## 🧠 What I Learned From Troubleshooting

Installing Docker Desktop, having the Docker CLI available, and having the Docker engine running are related but separate things.

The basic communication path is:

```text
VS Code / PowerShell
        │
        ▼
    Docker CLI
        │
        ▼
  Docker Desktop
        │
        ▼
   Docker Engine
        │
        ▼
Images & Containers
```

Understanding that separation helped me troubleshoot the environment instead of assuming that my application files were causing the problem.

---

# 🔄 My Local Development Workflow

My current environment looks like this:

```text
┌──────────────────────────────────────────┐
│                 Windows                  │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │       Visual Studio Code         │   │
│   │                                  │   │
│   │  Application Code                │   │
│   │  Dockerfiles                     │   │
│   │  Documentation                   │   │
│   │  Git / GitHub                    │   │
│   │  Integrated PowerShell Terminal  │   │
│   └────────────────┬─────────────────┘   │
│                    │                     │
│                    ▼                     │
│               Docker CLI                 │
│                    │                     │
│                    ▼                     │
│             Docker Desktop               │
│                    │                     │
│              Docker Engine               │
│                    │                     │
│          ┌─────────┴─────────┐           │
│          ▼                   ▼           │
│       Images             Containers      │
│                                          │
│             WSL 2 / Ubuntu               │
│                                          │
└──────────────────────────────────────────┘
```

---

# 🧠 Key Takeaways

## 🐳 Docker Desktop Is More Than the GUI

Docker Desktop gives me a graphical interface, but the actual Docker environment can also be controlled from the command line.

---

## ⌨️ The CLI Matters

I want to understand what commands are doing instead of only clicking through Docker Desktop.

The GUI is useful for visibility, but the CLI helps me understand the actual workflow.

---

## 💻 VS Code Is My Workspace

Visual Studio Code is where I create and manage the project files.

VS Code itself is not Docker.

The Container Tools extension connects VS Code to the Docker environment so I can view Docker resources from inside my editor.

---

## 🐧 WSL 2 Gives Me Linux on Windows

WSL 2 provides my Ubuntu Linux environment.

Docker Desktop also uses WSL 2 as part of my local Windows Docker environment.

---

## 📦 The CLI and Engine Are Different

One of the most useful things I learned during setup was the difference between the Docker CLI and Docker engine.

```text
CLI
"Here is what I want Docker to do."

        ↓

ENGINE
"Actually performs the container work."
```

The CLI can exist even when the engine is not responding correctly.

That distinction became important while I was troubleshooting my setup.

---

# ✅ Environment Checklist

- [x] Windows workstation ready
- [x] WSL 2 enabled
- [x] Ubuntu running with WSL 2
- [x] Docker Desktop installed
- [x] Docker Desktop running
- [x] Visual Studio Code configured
- [x] Container Tools extension installed
- [x] Docker CLI available from VS Code terminal
- [x] Docker CLI version verified
- [x] Docker engine communication verified
- [x] Git repository configured
- [x] GitHub remote configured
- [x] First Docker image successfully built
- [x] First Docker container successfully started
- [x] Local container environment validated

---

# 🚀 Environment Validated

The setup phase is complete.

I validated the environment by successfully building a Docker image and running my first containerized Node.js web application.

The application was exposed to my local machine through:

```text
localhost:3000
```

Successfully reaching the application in the browser confirmed that my Docker environment was working from end to end.

The actual build, container troubleshooting, source fixes, image rebuild, and port mapping are documented as part of:

> **Lab 01 — First Container**

---

# 📍 Current Progress

```text
00  Tooling & Local Setup        ✅ VALIDATED
        │
        ▼
01  First Container              ✅ VALIDATED
        │
        ▼
02  Images & Containers          🔜 NEXT
```

My next focus is understanding Docker images and containers in more detail, including:

- Image lifecycle
- Container lifecycle
- Read-only images
- Image layers
- Attached and detached containers
- Interactive containers
- Inspecting images
- Copying files between the host and containers
- Naming and tagging
- Docker Hub
- Pushing and pulling shared images