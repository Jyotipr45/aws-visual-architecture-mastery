# 04 · Networking (VPC) and Security

> **In FoodDash terms:** the building and its locks. A private gated building (VPC) with a public lobby (public subnet), a staff-only kitchen (private subnet), and a locked vault (isolated subnet).

---

## The FoodDash network

```mermaid
flowchart TB
    NET["🌍 Internet"] <--> IGW["Internet Gateway (IGW)<br/>main front door"]
    subgraph VPC["VPC 10.0.0.0/16 (65,536 private addresses)"]
        IGW <--> PUB["Public subnet 10.0.1.0/24<br/>ALB, NAT Gateway"]
        PUB --> PRIV["Private subnet 10.0.2.0/24<br/>app servers and containers"]
        PRIV --> ISO["Isolated subnet 10.0.3.0/24<br/>databases, no internet route"]
    end

    style VPC fill:#0f172a,stroke:#fb923c,color:#f8fafc
    style PUB fill:#0c4a6e,stroke:#38bdf8,color:#f8fafc
    style PRIV fill:#3b0764,stroke:#a78bfa,color:#f8fafc
    style ISO fill:#064e3b,stroke:#34d399,color:#f8fafc
```

## Lessons in this module

| # | Lesson | One-line meaning |
|---|---|---|
| 4.1 | **IAM** (Identity and Access Management) | Users, roles, policies: who is allowed to do what |
| 4.2 | **Regions and Availability Zones** | Where AWS data centers physically are, and why we use 2 or more |
| 4.3 | **VPC and CIDR blocks** | Your private network, and what `10.0.0.0/16` actually means |
| 4.4 | **Subnets and Route Tables** | Public vs private vs isolated, and the `0.0.0.0/0` rule |
| 4.5 | **Internet Gateway and NAT Gateway** | The front door, and the one-way exit for private servers |
| 4.6 | **Security Groups vs NACLs** | Per-server firewall vs per-subnet firewall |
| 4.7 | **Secrets Manager and KMS** | Storing passwords and encryption keys safely |

🎬 Animation: *coming soon*
