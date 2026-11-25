# 06 · Infrastructure as Code (Terraform)

> **In FoodDash terms:** instead of clicking 300 buttons in the AWS console (and forgetting which ones), we write the whole FoodDash setup as code. One command builds it. One command (`terraform destroy`) deletes it. That is also our best weapon for keeping the bill at $0.00.

---

## The Terraform loop

```mermaid
flowchart LR
    CODE["📝 Write<br/>main.tf"] --> INIT["terraform init<br/>download AWS plugin"]
    INIT --> PLAN["terraform plan<br/>preview changes"]
    PLAN --> APPLY["terraform apply<br/>create in AWS"]
    APPLY --> DESTROY["🧹 terraform destroy<br/>delete everything"]

    style CODE fill:#1e293b,stroke:#94a3b8,color:#f8fafc
    style INIT fill:#4c0519,stroke:#fb7185,color:#f8fafc
    style PLAN fill:#4c0519,stroke:#fb7185,color:#f8fafc
    style APPLY fill:#4c0519,stroke:#fb7185,color:#f8fafc
    style DESTROY fill:#064e3b,stroke:#34d399,color:#f8fafc
```

## Lessons in this module

| # | Lesson | One-line meaning |
|---|---|---|
| 6.1 | **Why IaC** | Repeatable, reviewable, deletable infrastructure |
| 6.2 | **Terraform basics** | Providers, resources, variables, outputs |
| 6.3 | **State files** | How Terraform remembers what it built (and why `.tfstate` is never committed) |
| 6.4 | **Remote state on S3** | Sharing state safely across a team, with locking |
| 6.5 | **Modules** | Reusable building blocks: one VPC module used by Dev, QA, Staging, Prod |
| 6.6 | **Full FoodDash in Terraform** | The complete 3-tier app, built and destroyed from code |

🎬 Animation: *coming soon*
