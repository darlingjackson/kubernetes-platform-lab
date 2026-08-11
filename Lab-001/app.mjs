import express from 'express';
import connectToDatabase from './helpers.mjs';

const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Kubernetes Platform Lab | Hello World</title>

    <style>
        /* =========================================================
           KUBERNETES PLATFORM LAB
           First Dockerized Web Application
           ========================================================= */

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;

            font-family: Arial, Helvetica, sans-serif;
            color: #f8fafc;

            background:
                radial-gradient(
                    circle at 20% 20%,
                    rgba(168, 85, 247, 0.18),
                    transparent 35%
                ),
                radial-gradient(
                    circle at 80% 80%,
                    rgba(56, 189, 248, 0.15),
                    transparent 35%
                ),
                #070b14;
        }

        .page {
            width: 100%;
            max-width: 900px;
        }

        /* ---------------------------------------------------------
           Lab Label
           --------------------------------------------------------- */

        .lab-label {
            display: inline-flex;
            align-items: center;
            gap: 0.55rem;

            margin-bottom: 1.5rem;
            padding: 0.55rem 0.9rem;

            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 999px;

            background: rgba(255, 255, 255, 0.04);

            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;

            color: #cbd5e1;
        }

        .lab-label span {
            width: 8px;
            height: 8px;

            border-radius: 50%;
            background: #22c55e;

            box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
        }

        /* ---------------------------------------------------------
           Main Card
           --------------------------------------------------------- */

        .card {
            position: relative;
            overflow: hidden;

            padding: 3.5rem;

            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 28px;

            background: rgba(15, 23, 42, 0.72);

            box-shadow:
                0 30px 80px rgba(0, 0, 0, 0.45),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);

            backdrop-filter: blur(16px);
        }

        .card::before {
            content: "";

            position: absolute;
            top: 0;
            left: 0;

            width: 100%;
            height: 3px;

            background: linear-gradient(
                90deg,
                #a855f7,
                #ec4899,
                #38bdf8
            );
        }

        /* ---------------------------------------------------------
           Container Status
           --------------------------------------------------------- */

        .status {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;

            margin-bottom: 1.75rem;

            font-size: 0.9rem;
            font-weight: 600;

            color: #86efac;
        }

        .status-dot {
            width: 9px;
            height: 9px;

            border-radius: 50%;
            background: #22c55e;

            box-shadow: 0 0 14px rgba(34, 197, 94, 0.8);
        }

        /* ---------------------------------------------------------
           Typography
           --------------------------------------------------------- */

        h1 {
            margin-bottom: 1rem;

            font-size: clamp(3rem, 8vw, 6rem);
            line-height: 0.95;
            letter-spacing: -0.06em;

            color: #ffffff;
        }

        h1 span {
            background: linear-gradient(
                90deg,
                #c084fc,
                #f472b6,
                #7dd3fc
            );

            -webkit-background-clip: text;
            background-clip: text;

            color: transparent;
        }

        .description {
            max-width: 650px;
            margin-bottom: 2.5rem;

            font-size: 1.05rem;
            line-height: 1.8;

            color: #94a3b8;
        }

        /* ---------------------------------------------------------
           Details
           --------------------------------------------------------- */

        .details {
            display: grid;
            grid-template-columns: repeat(3, 1fr);

            gap: 1rem;
            margin-bottom: 2rem;
        }

        .detail {
            padding: 1rem 1.1rem;

            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;

            background: rgba(255, 255, 255, 0.025);
        }

        .detail-label {
            display: block;

            margin-bottom: 0.4rem;

            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;

            color: #64748b;
        }

        .detail-value {
            font-family: Consolas, Monaco, monospace;
            font-size: 0.9rem;

            color: #e2e8f0;
        }

        /* ---------------------------------------------------------
           Terminal
           --------------------------------------------------------- */

        .terminal {
            overflow: hidden;

            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 16px;

            background: #050810;
        }

        .terminal-header {
            display: flex;
            align-items: center;
            gap: 0.45rem;

            padding: 0.85rem 1rem;

            border-bottom: 1px solid rgba(255, 255, 255, 0.07);

            background: rgba(255, 255, 255, 0.025);
        }

        .terminal-dot {
            width: 9px;
            height: 9px;

            border-radius: 50%;
            background: #475569;
        }

        .terminal-title {
            margin-left: 0.5rem;

            font-size: 0.75rem;

            color: #64748b;
        }

        .terminal-body {
            padding: 1.25rem;

            font-family: Consolas, Monaco, monospace;
            font-size: 0.9rem;
            line-height: 1.7;

            color: #94a3b8;
        }

        .terminal-body .prompt {
            color: #c084fc;
        }

        .terminal-body .command {
            color: #f8fafc;
        }

        .terminal-body .success {
            color: #4ade80;
        }

        /* ---------------------------------------------------------
           Footer
           --------------------------------------------------------- */

        .footer {
            margin-top: 1.5rem;

            text-align: center;

            font-size: 0.75rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;

            color: #475569;
        }

        /* ---------------------------------------------------------
           Responsive
           --------------------------------------------------------- */

        @media (max-width: 700px) {

            .card {
                padding: 2rem;
            }

            .details {
                grid-template-columns: 1fr;
            }

            h1 {
                font-size: 3.4rem;
            }
        }
    </style>
</head>

<body>

    <main class="page">

        <div class="lab-label">
            <span></span>
            Kubernetes Platform Lab
        </div>

        <section class="card">

            <div class="status">
                <div class="status-dot"></div>
                Container Running
            </div>

            <h1>
                Hello<br>
                <span>World!</span>
            </h1>

            <p class="description">
                My first containerized web application is officially running.
                This page is being served from inside a Docker container and
                exposed to my local machine through port 3000.
            </p>

            <div class="details">

                <div class="detail">
                    <span class="detail-label">Runtime</span>
                    <span class="detail-value">Node.js</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Platform</span>
                    <span class="detail-value">Docker</span>
                </div>

                <div class="detail">
                    <span class="detail-label">Port</span>
                    <span class="detail-value">localhost:3000</span>
                </div>

            </div>

            <div class="terminal">

                <div class="terminal-header">
                    <span class="terminal-dot"></span>
                    <span class="terminal-dot"></span>
                    <span class="terminal-dot"></span>

                    <span class="terminal-title">
                        PowerShell
                    </span>
                </div>

                <div class="terminal-body">

                    <div>
                        <span class="prompt">PS&gt;</span>
                        <span class="command">docker build .</span>
                    </div>

                    <div class="success">
                        ✓ Docker image built successfully
                    </div>

                    <br>

                    <div>
                        <span class="prompt">PS&gt;</span>
                        <span class="command">
                            docker run -p 3000:3000 &lt;IMAGE_ID&gt;
                        </span>
                    </div>

                    <div class="success">
                        ✓ Container running on localhost:3000
                    </div>

                </div>

            </div>

        </section>

        <p class="footer">
            Built while learning containers • Kubernetes Platform Lab
        </p>

    </main>

</body>
</html>
  `);
});

await connectToDatabase();

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});