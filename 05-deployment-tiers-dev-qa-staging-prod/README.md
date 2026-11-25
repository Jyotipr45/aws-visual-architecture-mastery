# 05 · Deployment Tiers: Dev, QA, Staging, Prod

> **In FoodDash terms:** how a new feature (say, "Schedule an order for later") travels from your laptop to millions of hungry customers without breaking anything.

---

## The same app, four separate copies

```mermaid
flowchart LR
    DEV["🧪 Dev<br/>developers break things freely"] -->|"tests pass"| QA["🔍 QA / Test<br/>testers try to break it"]
    QA -->|"approved"| STG["🎭 Staging<br/>exact copy of production"]
    STG -->|"release"| PROD["🚀 Production<br/>real customers"]

    style DEV fill:#1e293b,stroke:#94a3b8,color:#f8fafc
    style QA fill:#0c4a6e,stroke:#38bdf8,color:#f8fafc
    style STG fill:#713f12,stroke:#facc15,color:#f8fafc
    style PROD fill:#064e3b,stroke:#34d399,color:#f8fafc
```

## Lessons in this module

| # | Lesson | One-line meaning |
|---|---|---|
| 5.1 | **Why 4 environments** | What each one is for, and what goes wrong if you skip one |
| 5.2 | **AWS Organizations and multi-account setup** | One AWS account per environment, so Dev can never touch Prod |
| 5.3 | **IAM boundaries between environments** | Who can deploy where |
| 5.4 | **CI/CD pipelines** | GitHub Actions or CodePipeline moving code through the stages automatically |
| 5.5 | **Blue/Green deployments** | Run old and new side by side, switch traffic instantly, switch back if broken |
| 5.6 | **Canary deployments** | Send 5% of customers to the new version first, then grow |

🎬 Animation: *coming soon*
