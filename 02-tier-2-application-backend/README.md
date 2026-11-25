# 02 · Tier 2: Application (Backend and Business Logic)

> **In FoodDash terms:** the kitchen. When a customer taps "Place Order", this tier checks who they are, calculates the bill, talks to the restaurant, and saves the order.

---

## How an order reaches the kitchen

```mermaid
flowchart LR
    CF["From Tier 1<br/>CloudFront"] -->|"HTTPS 443"| ALB["ALB<br/>Application Load Balancer"]
    COG["Cognito<br/>login and tokens"] -.->|"is this user real?"| ALB
    ALB -->|"HTTP 8080"| A1["Order service<br/>container 1"]
    ALB -->|"HTTP 8080"| A2["Order service<br/>container 2"]
    APIGW["API Gateway"] --> L["Lambda<br/>send order SMS"]
    A1 --> T3["Tier 3<br/>databases"]
    A2 --> T3

    style ALB fill:#3b0764,stroke:#a78bfa,color:#f8fafc
    style A1 fill:#3b0764,stroke:#a78bfa,color:#f8fafc
    style A2 fill:#3b0764,stroke:#a78bfa,color:#f8fafc
    style COG fill:#7f1d1d,stroke:#f87171,color:#f8fafc
    style APIGW fill:#713f12,stroke:#facc15,color:#f8fafc
    style L fill:#713f12,stroke:#facc15,color:#f8fafc
    style T3 fill:#064e3b,stroke:#34d399,color:#f8fafc
```

## Lessons in this module

| # | Lesson | One-line meaning |
|---|---|---|
| 2.1 | **EC2** (Elastic Compute Cloud) | Rent a virtual computer by the second |
| 2.2 | **ALB** (Application Load Balancer) | Spread incoming orders across many servers, skip broken ones |
| 2.3 | **Auto Scaling Groups** | Add servers at lunch rush, remove them at 3 AM |
| 2.4 | **ECS** (Elastic Container Service) + **Fargate** | Run the Java app as Docker containers without managing servers |
| 2.5 | **Lambda + API Gateway** | Run small functions only when something happens |
| 2.6 | **Cognito** | Sign-up, login, and secure tokens for customers |
| 2.7 | **Private subnets and Security Groups** | Keep the kitchen hidden from the internet, allow only the ALB in |

🎬 Animation: *coming soon*
