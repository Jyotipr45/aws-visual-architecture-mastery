# 03 · Tier 3: Data and Storage

> **In FoodDash terms:** the memory of the business. Who our customers are, every menu, every order and payment, live rider locations, and every food photo.

---

## Picking the right storage for each job

```mermaid
flowchart TB
    APP["Tier 2<br/>Java order service"] -->|"SQL, port 5432"| RDS[("RDS PostgreSQL<br/>users, orders, payments")]
    APP -->|"port 6379"| REDIS[("ElastiCache Redis<br/>hot menu cache")]
    APP -->|"HTTPS API"| DDB[("DynamoDB<br/>live rider location")]
    APP -->|"HTTPS API"| S3[("S3<br/>food photos, backups")]

    style APP fill:#3b0764,stroke:#a78bfa,color:#f8fafc
    style RDS fill:#064e3b,stroke:#34d399,color:#f8fafc
    style REDIS fill:#064e3b,stroke:#34d399,color:#f8fafc
    style DDB fill:#064e3b,stroke:#34d399,color:#f8fafc
    style S3 fill:#064e3b,stroke:#34d399,color:#f8fafc
```

## Lessons in this module

| # | Lesson | One-line meaning |
|---|---|---|
| 3.1 | **S3** (Simple Storage Service) deep dive | Unlimited file storage: buckets, objects, storage classes, lifecycle rules |
| 3.2 | **RDS** (Relational Database Service) | Managed SQL databases (PostgreSQL, MySQL) with backups and Multi-AZ |
| 3.3 | **DynamoDB** | NoSQL key-value database that stays fast at any scale |
| 3.4 | **ElastiCache** (Redis) | In-memory cache so popular menus load in under a millisecond |
| 3.5 | **Isolated subnets and encryption** | Databases with no internet route at all, data encrypted with KMS |

🎬 Animation: *coming soon*
