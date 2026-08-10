# 🛠️ 001 — Tooling & Local Environment

> **Status:** 🟢 Ready  
> **Focus:** Local Docker development environment  
> **Next Step:** Run my first container

---

## 🎯 Goal

Before getting hands-on with containers, I needed a local environment where I could build, run, and eventually manage containerized applications.

For this lab, I am working from a Windows machine using Docker Desktop and Visual Studio Code.

My goal with the setup was to keep it simple and use the tools I will actually be working with throughout the lab.

---

## 💻 Local Environment

| Component | Tool |
|---|---|
| Host Operating System | Windows |
| Code Editor | Visual Studio Code |
| Container Platform | Docker Desktop |
| Container CLI | Docker CLI |
| Primary Terminal | PowerShell |
| Linux Environment | WSL 2 / Ubuntu |
| Version Control | Git / GitHub |

---

## 🐳 Docker Desktop

I installed **Docker Desktop for Windows** to provide the local Docker environment for this lab.

Docker Desktop will be used to:

- Build container images
- Run containers locally
- Manage images and containers
- Work with Docker networks and volumes later in the lab
- Provide the local container environment before moving into Kubernetes

Docker Desktop is also integrated with WSL 2 on my workstation.

### WSL Environment

I verified that my Linux environments are running under WSL 2.

```powershell
wsl -l -v