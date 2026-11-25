# 01 · Tier 1: Presentation (Frontend and Edge)

> **In FoodDash terms:** everything the customer touches first. Typing `fooddash.com`, seeing the restaurant list, loading food photos fast, and being protected from attackers before a request ever reaches our kitchen (the backend).

---

## The request journey through Tier 1

```mermaid
flowchart LR
    U["👤 Customer<br/>types fooddash.com"] -->|"1. Where is fooddash.com?"| R53["Route 53<br/>DNS phonebook"]
    R53 -->|"2. Go to this CloudFront address"| CF["CloudFront<br/>CDN edge location<br/>near the customer"]
    WAF["AWS WAF<br/>firewall rules"] -.->|"3. inspects every request"| CF
    CF -->|"4a. website files"| S3["S3 bucket<br/>static website"]
    CF -->|"4b. /api/* calls"| T2["Tier 2<br/>backend"]

    style R53 fill:#0c4a6e,stroke:#38bdf8,color:#f8fafc
    style CF fill:#0c4a6e,stroke:#38bdf8,color:#f8fafc
    style WAF fill:#7f1d1d,stroke:#f87171,color:#f8fafc
    style S3 fill:#064e3b,stroke:#34d399,color:#f8fafc
    style T2 fill:#3b0764,stroke:#a78bfa,color:#f8fafc
```

## Lessons in this module

| # | Lesson | One-line meaning |
|---|---|---|
| 1.1 | **S3 static website hosting** | Put the FoodDash website files (HTML, CSS, JS) in a cloud folder |
| 1.2 | **CloudFront** (Content Delivery Network) | Keep copies near customers in 400+ edge locations so pages load fast |
| 1.3 | **Route 53** (DNS, Domain Name System) | The internet's phonebook; named after DNS port 53. Covers records and *Alias* records |
| 1.4 | **ACM** (AWS Certificate Manager) | Free HTTPS padlock certificates |
| 1.5 | **AWS WAF** (Web Application Firewall) | A security guard that blocks bad requests before they reach us |
| 1.6 | **Public subnets and edge locations** | Which parts of the system are allowed to face the internet |

🎬 Animation: *coming soon*
