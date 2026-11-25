import type { Concept } from "./types";

/**
 * Every box, arrow and era in the app points to one entry here.
 * The detail panel shows each field in full. Nothing is summarized.
 *
 * Example account ID 123456789012 is the placeholder AWS itself uses in its examples.
 * ARN format: arn:aws:<service>:<region>:<account-id>:<resource>
 */
export const CONCEPTS: Record<string, Concept> = {
  /* ======================================================================
     SHARED
     ====================================================================== */
  customer: {
    name: "Customer (FoodDash app)",
    aliases: ["client", "user", "end user", "browser / mobile app"],
    oneLiner: "A hungry person tapping “Place Order” in the FoodDash app.",
    plain: [
      "The customer is the person using the FoodDash app on their phone or in a web browser. When they tap “Place Order”, their phone sends a small message called a request across the internet.",
      "In computing, the side that asks is called the client and the side that answers is called the server. The customer's phone is the client. Everything else in this timeline is about where the server lives and who has to look after it.",
    ],
    analogy: "The customer is like someone calling a restaurant to place an order. They don't care whether the kitchen is in the same building, in a shared food court or in a cloud kitchen across town. They only care that the food arrives fast and the order is never lost.",
    why: "Every machine, service and rule in all 5 eras exists to answer this one request quickly, correctly and safely, even when thousands of customers order at the same time.",
    foodDash: "Sends “place order”, “show menu” and “track my rider” requests to the FoodDash backend.",
    connections: [
      { peer: "FoodDash backend (wherever it runs in that era)", direction: "out", protocol: "HTTPS", port: "443", rule: "The app opens an encrypted HTTPS connection to the backend's address. HTTPS = HTTP (the web's request language) + TLS (Transport Layer Security, the encryption). Port 443 is the standard door number for HTTPS." },
    ],
    advanced: [
      "Before the request leaves, the phone asks DNS (Domain Name System, the internet's phonebook) to turn fooddash.com into an IP address. In AWS this phonebook is Route 53 (Module 01).",
      "The phone never talks to a server directly by name. It talks to an IP address and port, e.g. 203.0.113.10:443. Port 80 is plain HTTP and should only redirect to 443.",
    ],
    facts: ["Protocol: HTTPS (HTTP + TLS encryption)", "Port: 443", "Plain HTTP port 80: redirect to 443 only", "Example request: POST /orders"],
  },

  /* ======================================================================
     ERA 1: ON-PREMISES BARE-METAL
     ====================================================================== */
  era1: {
    name: "Era 1 · On-premises bare-metal servers",
    aliases: ["on-prem era", "the data-center era", "pre-cloud"],
    oneLiner: "You buy, house, power, cool and fix your own physical computers.",
    plain: [
      "To launch FoodDash before the cloud, you had to guess how much traffic you'd get for the next few years, get a budget approved, order physical servers, wait weeks for delivery, rent a room with power and cooling, bolt the servers into racks, plug in cables and install an operating system by hand.",
      "Only then could you deploy your app. From idea to first customer took 3 to 6 months.",
      "The golden rule was one app per server: Orders, Payments and Menu each got their own machine, so a crash or bad update in one couldn't take down the others.",
    ],
    analogy: "It's like opening a restaurant by first buying the land, building the kitchen, buying every stove and fridge yourself, and paying the electricity bill even on days when nobody comes in.",
    why: "There was no other option. If you wanted software to serve customers, you had to own the hardware it ran on.",
    foodDash: "Three physical servers in your own server room: Server 1 runs Orders, Server 2 runs Payments, Server 3 runs Menu.",
    connections: [
      { peer: "Customer", direction: "in", protocol: "HTTPS", port: "443", rule: "Traffic arrives over your internet line from an ISP (Internet Service Provider), passes your office router and firewall, then reaches the server's network card." },
    ],
    advanced: [
      "Capacity planning forced you to buy for the peak (e.g. the Diwali sale) and leave most hardware idle the rest of the year.",
      "Each server was a single point of failure (SPOF). Redundancy meant buying 2 of everything, doubling the cost.",
      "Hardware depreciates, losing value every year, and is usually replaced every 3 to 5 years, so the buying cycle never ends.",
    ],
    facts: ["Time to launch: 3 to 6 months", "Typical CPU use: 5 to 15%", "Cost model: CapEx (pay upfront)", "You manage: building, power, cooling, security, hardware, OS, app"],
    mistakes: ["Buying for today's traffic and crashing on the first big sale.", "Buying for the peak and wasting 85 to 95% of the hardware all year."],
  },
  room: {
    name: "On-premises server room",
    aliases: ["on-prem", "data center (DC)", "server room", "colo (when rented)"],
    oneLiner: "A room you own or rent, filled with physical computers you bought.",
    plain: [
      "“On-premises” (on-prem) means the servers sit on your premises: a building you own or rent. A data center is a room or building designed to hold many servers, with strong electricity, cooling and network connections.",
      "Renting rack space in someone else's data center is called colocation (colo). You still own and fix the servers; you just rent the room, power and network.",
    ],
    analogy: "Your own private kitchen: you built it, you clean it, you fix the fridge when it breaks at midnight.",
    why: "Servers need constant power, cooling and physical security. A normal office can't provide that safely.",
    foodDash: "Holds Server 1 (Orders), Server 2 (Payments) and Server 3 (Menu), plus the router, firewall and cables.",
    connections: [
      { peer: "Internet (via your ISP)", direction: "both", protocol: "TCP/IP", port: "443 inbound for HTTPS", rule: "One internet line enters the room. If it fails and you have no second line from another ISP, all of FoodDash goes offline." },
    ],
    advanced: [
      "Real data centers are rated in tiers (Tier I to Tier IV) by how much redundancy they have in power and cooling.",
      "AWS today runs huge data centers grouped into Availability Zones and Regions (Module 04), so you never build this room yourself.",
    ],
    facts: ["You manage: building · power · cooling · security · hardware · OS · app", "Racks hold servers measured in U (1U = 1.75 inches tall)"],
  },
  srv: {
    name: "Physical server (bare-metal)",
    aliases: ["bare-metal", "box", "machine", "host", "dedicated server"],
    oneLiner: "A real computer bolted into a rack, running one app directly on its hardware.",
    plain: [
      "A server is just a computer whose job is to answer requests from other computers. “Bare-metal” means your software runs directly on the real hardware, the “metal”, with no extra layer in between.",
      "Inside every server are the same three building blocks as your laptop: a CPU (the brain), RAM (fast short-term memory) and a disk (slow long-term storage). An operating system (OS) such as Linux sits on top of the hardware, and your app runs on the OS.",
    ],
    analogy: "One delivery van per restaurant dish. The van for samosas drives around mostly empty, but you still bought it, insure it and park it.",
    why: "Before virtualization, the safe way to keep apps from breaking each other was to give each one its own physical machine.",
    foodDash: "Server 1 runs the Orders app, Server 2 runs Payments, Server 3 runs Menu. Each sits mostly idle.",
    connections: [
      { peer: "Customer", direction: "in", protocol: "HTTPS", port: "443", rule: "Requests reach the server's network card through the office router and firewall. The firewall must allow port 443 in." },
      { peer: "Administrator", direction: "in", protocol: "SSH", port: "22", rule: "Admins log in remotely with SSH (Secure Shell) on port 22 to install updates. Port 22 should only be open to the office network, never to the whole internet." },
    ],
    advanced: [
      "Layers from bottom to top: hardware → OS (e.g. Linux) → runtime (e.g. Java 21) → app (e.g. Spring Boot Orders service).",
      "Because each server runs one app, CPU utilization was typically only 5 to 15%. That waste is the exact problem virtualization (Era 2) solved.",
    ],
    facts: ["Typical CPU use: 5 to 15%", "HTTPS: port 443", "SSH admin access: port 22", "Lifespan before replacement: about 3 to 5 years"],
    mistakes: ["Opening SSH port 22 to the whole internet (0.0.0.0/0). Attackers scan for it constantly."],
  },
  util: {
    name: "CPU utilization",
    aliases: ["utilization", "CPU %", "CPU usage", "load"],
    oneLiner: "How much of the computer's brain is actually busy.",
    plain: [
      "CPU stands for Central Processing Unit, the part of the computer that executes your code. Utilization is the percentage of time it's busy doing work.",
      "12% means that for every second, the CPU was working for 0.12 seconds and doing nothing for 0.88 seconds. You paid for 100% of it.",
    ],
    analogy: "A taxi that's driving with a passenger 12% of the day and parked the other 88%, while you still pay the full loan, insurance and parking.",
    why: "It's the number that proves how much money is being wasted, and it's the number auto scaling (Era 3) watches to add or remove servers.",
    foodDash: "Orders server: 12% used. Payments: 8%. Menu: 15%. On average, about 88% of the hardware does nothing.",
    connections: [
      { peer: "Monitoring tool (later: Amazon CloudWatch)", direction: "out", protocol: "Metrics", port: "n/a", rule: "The server reports CPU % over time. In AWS, EC2 sends a metric called CPUUtilization to CloudWatch automatically." },
    ],
    advanced: [
      "On Windows you can see it in Task Manager → Performance → CPU, or with Get-Counter '\\Processor(_Total)\\% Processor Time'. On Linux: top or htop.",
      "Average utilization hides peaks. A server can average 12% but hit 100% for 10 minutes at lunch, so capacity planning looks at the peak.",
    ],
    facts: ["Era 1 typical: 5 to 15%", "Era 2 typical: 60 to 80%", "EC2 metric name: CPUUtilization", "EC2 basic monitoring: 5-minute data points · detailed: 1-minute"],
  },
  lead: {
    name: "Lead time",
    aliases: ["provisioning time", "time to provision", "procurement time"],
    oneLiner: "The time from “we need a server” to “it's serving customers”.",
    plain: [
      "Provisioning means getting a new server ready to use. On-prem, that meant: budget approval, purchase order, vendor shipping, racking it, cabling it and installing the OS. Lead time is how long all of that takes.",
      "Because lead time was 3 to 6 months, you had to predict your traffic far in advance. That guessing is called capacity planning.",
    ],
    analogy: "Ordering a custom-built delivery van: if the festival is next week and the van arrives in 3 months, you miss the festival.",
    why: "Long lead time is why companies over-bought hardware: running out was worse than wasting money.",
    foodDash: "Need a 4th Orders server for the Diwali sale? Too late. It arrives after Diwali.",
    connections: [],
    advanced: [
      "Era 2 cut lead time for new VMs to minutes, but new physical hosts still took weeks.",
      "Era 3 (cloud) cut it to about a minute: one API call to EC2 RunInstances returns a running server.",
    ],
    facts: ["On-prem: 3 to 6 months", "Virtualization: weeks for hardware, minutes for a VM", "Cloud EC2: about 1 minute", "Lambda: milliseconds per request"],
  },
  capex: {
    name: "CapEx (Capital Expenditure)",
    aliases: ["upfront cost", "capital spend"],
    oneLiner: "Money spent upfront to buy things you own, like servers.",
    plain: [
      "CapEx is money you spend before you earn anything, to buy something you'll own for years, like a server.",
      "The opposite is OpEx (Operating Expenditure): money you pay regularly for what you actually use, like rent or electricity. The cloud turns servers from CapEx into OpEx.",
    ],
    analogy: "CapEx is buying a car. OpEx is taking an auto-rickshaw only when you need to go somewhere.",
    why: "With CapEx, if FoodDash fails after 3 months, the money is gone and you're stuck with machines you can only resell at a loss.",
    foodDash: "Buying 10 servers for the Diwali peak means paying for all 10 on day one, even though 9 sit idle most of the year.",
    connections: [],
    advanced: [
      "Hardware loses value every year (depreciation), so accountants write it down over 3 to 5 years.",
      "Cloud pricing is OpEx: EC2 bills per second (Linux, 60-second minimum), Lambda per millisecond.",
    ],
    facts: ["CapEx: pay upfront, own the asset", "OpEx: pay as you use", "EC2 Linux billing: per second, 60 s minimum", "Lambda billing: per request + per ms"],
  },
  facil: {
    name: "Power, cooling and physical security",
    aliases: ["facilities", "data-center operations"],
    oneLiner: "The invisible costs of keeping servers alive 24 hours a day.",
    plain: [
      "Servers turn electricity into heat. Without strong air-conditioning they overheat and shut down. You also need backup batteries (UPS, Uninterruptible Power Supply), a backup generator for power cuts, fire safety, and guards so nobody walks off with a server.",
    ],
    analogy: "The rent, electricity, AC and security guard for your restaurant: you pay them every day whether 1 or 1,000 customers walk in.",
    why: "These costs never stop, even at 3 AM when nobody is ordering food.",
    foodDash: "Your server room needs AC, a UPS, a generator and a locked door, all paid by FoodDash.",
    connections: [],
    advanced: [
      "AWS spreads these costs across millions of customers, which is a big part of why renting is cheaper than owning at small scale.",
      "Data centers measure efficiency with PUE (Power Usage Effectiveness): total facility power ÷ IT equipment power. 1.0 would be perfect.",
    ],
    facts: ["UPS = Uninterruptible Power Supply", "PUE = Power Usage Effectiveness (lower is better, 1.0 is ideal)"],
  },

  /* ======================================================================
     ERA 2: VIRTUALIZATION
     ====================================================================== */
  era2: {
    name: "Era 2 · Virtualization and hypervisors",
    aliases: ["virtualization era", "VM era", "server consolidation"],
    oneLiner: "One physical server pretends to be many separate computers.",
    plain: [
      "A piece of software called a hypervisor splits one physical server into several virtual machines (VMs). Each VM believes it has its own CPU, RAM, disk and network card, and runs its own operating system.",
      "Now Orders, Payments and Menu can share one box safely. If the Payments VM crashes, the Orders VM keeps running.",
      "Utilization jumps from about 10% to about 70%, so you buy far fewer servers.",
    ],
    analogy: "Instead of one van per dish, one big van with three locked compartments. Each dish has its own space and key, but you only bought, fuel and park one van.",
    why: "Era 1 wasted 85 to 95% of every server. Virtualization packs several apps onto one machine without letting them interfere.",
    foodDash: "One physical host runs VM 1 (Orders), VM 2 (Payments) and VM 3 (Menu).",
    connections: [
      { peer: "Customer", direction: "in", protocol: "HTTPS", port: "443", rule: "Traffic reaches the physical network card, then the hypervisor's virtual switch forwards it to the right VM's virtual network card based on the VM's IP address." },
    ],
    advanced: [
      "You still buy, rack and maintain the physical host, and still wait weeks for new hardware. Only VMs became fast to create.",
      "This is the technology AWS rents out as EC2. When AWS launched EC2 in 2006, it ran on the Xen hypervisor; today it runs on Nitro, AWS's own KVM-based hypervisor with dedicated hardware cards.",
    ],
    facts: ["VMware ESX: 2001", "Xen: 2003", "Typical CPU use: 60 to 80%", "You manage: hardware, hypervisor, OS, app"],
  },
  host: {
    name: "Physical server (the host)",
    aliases: ["host", "hypervisor host", "physical host"],
    oneLiner: "Still one real machine, now shared by several virtual machines.",
    plain: [
      "The host is the real hardware: CPU, RAM, disk and network card. The hypervisor runs on it and hands out slices of these resources to each VM.",
    ],
    analogy: "The building in a block of flats. Each flat (VM) is private, but they all share one foundation, roof and water supply.",
    why: "Running 3 apps on 1 box means buying about a third of the hardware.",
    foodDash: "One host now carries Orders, Payments and Menu.",
    connections: [
      { peer: "Hypervisor", direction: "both", protocol: "Direct hardware access", port: "n/a", rule: "Only the hypervisor talks to the real hardware. VMs never touch it directly." },
    ],
    advanced: [
      "If the host fails, every VM on it fails together. Clusters move VMs to healthy hosts (live migration, e.g. VMware vMotion).",
      "Over-commit: you can promise VMs more total vCPUs than the host has physical cores, betting they won't all be busy at once.",
    ],
    facts: ["Typical CPU use: 60 to 80%", "Single host failure = all its VMs down (unless clustered)"],
  },
  hyp: {
    name: "Hypervisor",
    aliases: ["VMM (Virtual Machine Monitor)", "virtualization layer"],
    oneLiner: "Software that splits one physical computer into several pretend computers.",
    plain: [
      "The hypervisor sits between the hardware and the VMs. It gives each VM a fake (virtual) CPU, RAM, disk and network card, and makes sure no VM can see or touch another VM's memory.",
      "Type 1 hypervisors run directly on the hardware (VMware ESXi, Xen, KVM, Microsoft Hyper-V). Type 2 hypervisors run as an app on a normal OS (VirtualBox, VMware Workstation), which is what you'd use on a laptop.",
    ],
    analogy: "A building manager who divides one big hall into private offices with walls and locked doors, and decides how much electricity and space each office gets.",
    why: "It's what makes sharing hardware safe. Without it, apps sharing a machine could crash or spy on each other.",
    foodDash: "Splits one host into VM 1 (Orders), VM 2 (Payments) and VM 3 (Menu).",
    connections: [
      { peer: "Physical hardware (below)", direction: "both", protocol: "Direct access", port: "n/a", rule: "The hypervisor is the only software allowed to control the real CPU, RAM and devices." },
      { peer: "Virtual machines (above)", direction: "both", protocol: "Virtual devices", port: "n/a", rule: "Each VM sees virtual hardware and must go through the hypervisor for everything." },
    ],
    advanced: [
      "Modern CPUs have built-in support (Intel VT-x, AMD-V) that makes virtualization nearly as fast as bare-metal.",
      "AWS Nitro moves networking, storage and security work onto dedicated Nitro Cards, so almost all of the host's CPU goes to your instances.",
    ],
    facts: ["Type 1: ESXi, Xen, KVM, Hyper-V", "Type 2: VirtualBox, VMware Workstation", "EC2 launched on Xen (2006) · today: Nitro (KVM-based)"],
  },
  vm: {
    name: "Virtual Machine (VM)",
    aliases: ["guest", "virtual server", "instance (AWS)", "EC2 instance"],
    oneLiner: "A complete computer made of software, with its own OS.",
    plain: [
      "A VM has everything a real computer has, but virtual: virtual CPUs (vCPUs), virtual RAM, a virtual disk and a virtual network card. It boots its own operating system, called the guest OS, and runs your app on top.",
      "VMs are isolated: one VM can't read another's memory, and if one crashes, the others keep running.",
    ],
    analogy: "A private flat in a building: your own door, kitchen and lock, even though the building is shared.",
    why: "It gives the safety of separate servers with the savings of shared hardware.",
    foodDash: "VM 1 runs Orders, VM 2 runs Payments, VM 3 runs Menu, each on its own guest OS (Linux).",
    connections: [
      { peer: "Customer", direction: "in", protocol: "HTTPS", port: "443", rule: "Each VM has its own IP address. The hypervisor's virtual switch delivers traffic to the right VM." },
      { peer: "Hypervisor", direction: "both", protocol: "Virtual devices", port: "n/a", rule: "All disk, network and CPU access goes through the hypervisor." },
    ],
    advanced: [
      "A vCPU usually maps to one hardware thread of a physical core. On many EC2 types, 2 vCPUs = 1 physical core with 2 threads.",
      "A VM still boots a full OS, which takes tens of seconds to minutes and uses hundreds of MB of RAM. Containers (Era 4) remove that overhead.",
    ],
    facts: ["In AWS a VM is an EC2 instance", "Guest OS boot time: tens of seconds to minutes", "Example: t3.micro = 2 vCPU, 1 GiB RAM"],
  },

  /* ======================================================================
     ERA 3: CLOUD
     ====================================================================== */
  era3: {
    name: "Era 3 · Cloud computing and elastic scaling",
    aliases: ["cloud era", "IaaS (Infrastructure as a Service)", "elastic computing"],
    oneLiner: "Rent AWS's virtual machines by the second, over the internet.",
    plain: [
      "AWS took the virtualization of Era 2, built enormous data centers, and lets anyone rent VMs over the internet with one click or one API call. A server is running in about a minute.",
      "You pay per second while it runs and stop paying when you delete it. That turns servers from CapEx into OpEx.",
      "Elastic means the number of servers can grow and shrink automatically. At the lunch rush an Auto Scaling Group adds servers; when it's quiet, it removes them.",
    ],
    analogy: "Instead of buying vans, you use a ride-hailing app: a van shows up in minutes, you pay per trip, and on festival days you book 10 at once.",
    why: "It removes the biggest pains of Eras 1 and 2: months of lead time, upfront cost, and guessing capacity.",
    foodDash: "FoodDash runs on 2 EC2 instances in Mumbai (ap-south-1). At lunch the Auto Scaling Group adds 2 more. Food photos live in S3.",
    connections: [
      { peer: "Customer", direction: "in", protocol: "HTTPS", port: "443", rule: "In production, traffic first hits an Application Load Balancer (Module 02), which forwards it to healthy instances. The diagram simplifies this to show scaling." },
    ],
    advanced: [
      "You still patch the operating system, choose instance sizes and manage the runtime. AWS manages everything below the hypervisor.",
      "Shared responsibility model: AWS secures the cloud (buildings, hardware, hypervisor); you secure what you put in the cloud (OS patches, firewall rules, data, IAM).",
    ],
    facts: ["Amazon S3 launched: March 2006", "Amazon EC2 launched: August 2006", "Time to launch: about 1 minute", "You manage: OS, runtime, app"],
  },
  region: {
    name: "AWS Region",
    aliases: ["region", "e.g. ap-south-1 (Mumbai)"],
    oneLiner: "A geographic area where AWS runs several separate data centers.",
    plain: [
      "A Region is a named place in the world where AWS has data centers, for example ap-south-1 (Mumbai) and ap-south-2 (Hyderabad). You choose a Region when you create most resources.",
      "Each Region is split into Availability Zones (AZs): groups of data centers with separate power, cooling and networking, a few kilometres apart, so a fire or flood in one doesn't take down the others.",
    ],
    analogy: "A city where a delivery company has several separate warehouses. If one warehouse floods, the others keep delivering.",
    why: "Run close to your customers for low delay (latency), and keep data inside India when the law requires it.",
    foodDash: "FoodDash runs in ap-south-1 (Mumbai) because most customers are in India.",
    connections: [
      { peer: "Availability Zones", direction: "both", protocol: "Private high-speed network", port: "n/a", rule: "AZs in a Region are linked by fast, low-latency private fibre. You spread servers across 2+ AZs for high availability." },
    ],
    advanced: [
      "AZ names look like ap-south-1a, ap-south-1b, ap-south-1c. Mumbai has 3 AZs.",
      "Most services are regional: an EC2 instance in Mumbai isn't visible when your console is set to another Region. A very common beginner confusion.",
      "A few services are global, such as IAM and Route 53.",
    ],
    facts: ["ap-south-1 = Mumbai (3 AZs)", "ap-south-2 = Hyderabad (3 AZs)", "AZ name example: ap-south-1a", "Global services: IAM, Route 53, CloudFront"],
    mistakes: ["Creating resources in the wrong Region (e.g. us-east-1) and then “losing” them in the console.", "Forgetting a resource in another Region and getting billed for it."],
  },
  asg: {
    name: "Auto Scaling Group",
    aliases: ["ASG", "EC2 Auto Scaling"],
    oneLiner: "A self-adjusting group of EC2 instances that grows when busy and shrinks when quiet.",
    plain: [
      "An Auto Scaling Group keeps the number of EC2 instances between a minimum and a maximum. You give it three numbers: min (never fewer), max (never more) and desired (how many right now).",
      "A scaling policy changes the desired number automatically, for example: “keep average CPU at 60%”. If CPU goes higher, it adds instances; if lower, it removes them.",
      "It also replaces unhealthy instances automatically: if an instance fails its health check, the ASG terminates it and launches a fresh one.",
    ],
    analogy: "A restaurant manager who calls in extra cooks when the queue gets long and sends them home when it's quiet, so you only pay wages for the busy hours.",
    why: "It solves Era 1's capacity-planning guessing game: you no longer buy for the peak; you scale to the peak and back.",
    foodDash: "min 2 · desired 2 · max 4. At the lunch rush it goes 2 → 4, then back to 2 in the afternoon.",
    connections: [
      { peer: "Amazon CloudWatch alarm", direction: "in", protocol: "Alarm action", port: "n/a", rule: "A CloudWatch alarm or target-tracking policy tells the ASG to change its desired capacity." },
      { peer: "EC2 instances", direction: "out", protocol: "EC2 API (RunInstances / TerminateInstances)", port: "n/a", rule: "The ASG launches instances from a launch template (AMI, instance type, security group) and terminates extras." },
      { peer: "Load balancer target group", direction: "out", protocol: "Registration", port: "8080 (app port)", rule: "New instances are registered with the load balancer's target group so they start receiving traffic once healthy." },
    ],
    advanced: [
      "A launch template stores the recipe for new instances: AMI (Amazon Machine Image, the disk image), instance type, security groups and a startup script (user data).",
      "Target tracking is the simplest policy: pick a metric and a target (e.g. ASGAverageCPUUtilization = 60) and AWS does the math.",
      "Cooldown / warm-up periods stop the group from adding instances again before new ones have finished starting.",
    ],
    facts: ["FoodDash settings: min 2 · desired 2 · max 4", "Policy example: target tracking, average CPU 60%", "ASG itself is free; you pay for the instances it runs"],
    mistakes: ["Setting max too high with no billing alarm.", "Setting min to 1, which makes that single instance a SPOF."],
  },
  ec2: {
    name: "Amazon EC2 instance",
    aliases: ["EC2 (Elastic Compute Cloud)", "instance", "virtual machine", "VM"],
    oneLiner: "A virtual machine you rent from AWS, ready in about a minute.",
    plain: [
      "EC2 stands for Elastic Compute Cloud. An EC2 instance is a VM running on AWS's hardware. You pick an instance type (how much CPU and RAM), an AMI (Amazon Machine Image, the starting disk with an OS), a network (VPC and subnet) and a security group (firewall rules).",
      "“Elastic” means you can create, resize, stop and delete instances whenever you want, and pay only while they run.",
    ],
    analogy: "A fully furnished flat you can rent by the second, move into in a minute, and hand back the moment you're done.",
    why: "No buying, no shipping, no racking: about one minute from request to running server.",
    foodDash: "EC2 instances 1 to 4 each run the Orders app (Spring Boot on Java 21) on port 8080.",
    connections: [
      { peer: "Application Load Balancer", direction: "in", protocol: "HTTP", port: "8080", rule: "The instance's security group must allow inbound 8080 only from the load balancer's security group, never from 0.0.0.0/0 (the whole internet)." },
      { peer: "Amazon S3", direction: "out", protocol: "HTTPS (S3 API)", port: "443", rule: "The instance uses an IAM role (instance profile) with permission like s3:PutObject on arn:aws:s3:::fooddash-food-photos/*. Never store access keys on the instance." },
      { peer: "Amazon CloudWatch", direction: "out", protocol: "Metrics", port: "n/a", rule: "CPUUtilization and other metrics are sent automatically." },
    ],
    advanced: [
      "Network placement: each instance gets a private IP inside a subnet, e.g. 10.0.2.15 in subnet 10.0.2.0/24 of VPC 10.0.0.0/16. CIDR notation: /16 = 65,536 addresses, /24 = 256 addresses, and AWS reserves 5 in every subnet, leaving 251 usable.",
      "Instance families: t (burstable, cheap), m (general), c (compute), r (memory). t3.micro = 2 vCPU, 1 GiB RAM.",
      "Stopping an instance stops compute billing, but attached EBS disks are still billed. Terminating deletes it.",
      "Instance ARN example: arn:aws:ec2:ap-south-1:123456789012:instance/i-0abc123def4567890",
    ],
    facts: ["Example type: t3.micro (2 vCPU, 1 GiB RAM)", "Linux billing: per second, 60 s minimum", "App port: 8080 · HTTPS at load balancer: 443 · SSH: 22", "VPC 10.0.0.0/16 · subnet 10.0.2.0/24 · private IP 10.0.2.15"],
    mistakes: ["Opening port 22 or 8080 to 0.0.0.0/0.", "Leaving instances running after a lab.", "Saving AWS access keys in files on the instance instead of using an IAM role."],
  },
  s3: {
    name: "Amazon S3",
    aliases: ["S3 (Simple Storage Service)", "bucket", "object storage"],
    oneLiner: "Unlimited, durable file storage you reach over HTTPS.",
    plain: [
      "S3 stores files, which S3 calls objects, inside containers called buckets. Each object has a key (its name/path), for example dishes/paneer-tikka.jpg.",
      "You never buy disks or worry about running out of space. You pay for the gigabytes stored and the requests made.",
      "Bucket names are globally unique across all AWS accounts, so “photos” is taken but “fooddash-food-photos” might not be.",
    ],
    analogy: "A giant, infinitely large cupboard with labelled boxes (buckets). You put items (objects) in by name and take them out by name, and the cupboard is copied across several buildings so nothing gets lost.",
    why: "Storing millions of photos on server disks is fragile and expensive. S3 is built for 99.999999999% (11 nines) durability.",
    foodDash: "Bucket fooddash-food-photos stores every dish photo and restaurant logo.",
    connections: [
      { peer: "EC2 / Lambda (your code)", direction: "in", protocol: "HTTPS (S3 API)", port: "443", rule: "Code calls PutObject / GetObject. Access is allowed only if the caller's IAM role has permission on arn:aws:s3:::fooddash-food-photos/*." },
      { peer: "CloudFront (Module 01)", direction: "in", protocol: "HTTPS", port: "443", rule: "Customers should load photos through CloudFront, with the bucket kept private using Origin Access Control (OAC)." },
    ],
    advanced: [
      "Block Public Access is on by default for new buckets. Leave it on and serve public files through CloudFront.",
      "Storage classes trade price for access speed: Standard, Standard-IA (Infrequent Access), Glacier for archives. Lifecycle rules move objects automatically.",
      "S3 has strong read-after-write consistency: once a PUT succeeds, the next GET returns the new object.",
      "Maximum single object size: 5 TB.",
    ],
    facts: ["Launched: March 2006", "Durability: 99.999999999% (11 nines)", "Bucket ARN: arn:aws:s3:::fooddash-food-photos", "Object URL style: https://fooddash-food-photos.s3.ap-south-1.amazonaws.com/dishes/paneer-tikka.jpg", "Max object size: 5 TB"],
    mistakes: ["Making a bucket public to “quickly test”.", "Forgetting to empty and delete lab buckets."],
  },
  cw: {
    name: "Amazon CloudWatch alarm",
    aliases: ["CloudWatch", "alarm", "metric alarm"],
    oneLiner: "A watcher that checks a number and fires when it crosses a line.",
    plain: [
      "CloudWatch collects metrics (numbers over time) from AWS services, like CPUUtilization from EC2. An alarm watches one metric and changes state when a rule is broken, for example: average CPU > 60% for 2 minutes.",
      "Alarm states: OK, ALARM and INSUFFICIENT_DATA. When it enters ALARM it can trigger actions: scale an Auto Scaling Group, send an email via SNS, and more.",
    ],
    analogy: "A smoke detector for your servers: it constantly measures, and when the number crosses a line it rings and someone (or something) acts.",
    why: "Auto Scaling needs a trigger. CloudWatch is the eyes; the ASG is the hands.",
    foodDash: "Alarm “orders-high-cpu”: average CPU > 60% for 2 minutes → add 2 instances.",
    connections: [
      { peer: "EC2 instances", direction: "in", protocol: "Metrics", port: "n/a", rule: "EC2 publishes CPUUtilization automatically (every 5 minutes with basic monitoring, every 1 minute with detailed monitoring)." },
      { peer: "Auto Scaling Group", direction: "out", protocol: "Alarm action", port: "n/a", rule: "On ALARM, it runs the ASG's scaling policy, which raises desired capacity." },
    ],
    advanced: [
      "With target tracking, AWS creates and manages the CloudWatch alarms for you.",
      "CloudWatch Logs stores application logs; CloudWatch Metrics stores numbers. Different features, same service name.",
      "Alarm ARN example: arn:aws:cloudwatch:ap-south-1:123456789012:alarm:orders-high-cpu",
    ],
    facts: ["Metric: AWS/EC2 · CPUUtilization", "Rule: Average > 60 for 2 periods of 60 s", "States: OK · ALARM · INSUFFICIENT_DATA"],
  },

  /* ======================================================================
     ERA 4: CONTAINERS
     ====================================================================== */
  era4: {
    name: "Era 4 · Microservices and containers",
    aliases: ["container era", "microservices", "Docker era"],
    oneLiner: "Package each service once, run the identical package everywhere.",
    plain: [
      "FoodDash is split into small independent services (microservices): menu, payments, orders, tracking. Each can be updated and scaled separately.",
      "Each service is baked into a container image: the code plus the exact Java version, libraries and settings it needs. The image is stored in a registry and runs identically on a laptop, in QA and in production.",
      "Containers share the host's operating system kernel instead of each booting a full OS, so they start in about a second and use far less memory than VMs.",
    ],
    analogy: "Shipping containers: the same steel box fits on any ship, train or truck. Nobody repacks the goods at each step, so nothing gets lost or broken.",
    why: "It kills the classic “it works on my machine!” bug, because every environment runs the exact same image.",
    foodDash: "4 containers (menu, payments, orders, tracking) run on one EC2 host in an ECS cluster. Images live in Amazon ECR.",
    connections: [
      { peer: "Customer", direction: "in", protocol: "HTTPS → HTTP", port: "443 → 8080", rule: "The load balancer receives HTTPS on 443 and forwards to the orders container on its container port 8080." },
    ],
    advanced: [
      "Someone still has to run and size the cluster of hosts and pay for idle capacity, unless you use AWS Fargate, where AWS runs the hosts for you.",
      "ECS (Elastic Container Service) is AWS's own orchestrator; EKS (Elastic Kubernetes Service) is managed Kubernetes.",
    ],
    facts: ["Docker: 2013", "Amazon ECS: 2014", "Amazon EKS: 2018", "You manage: images, app, cluster settings"],
  },
  laptop: {
    name: "Developer laptop",
    aliases: ["local machine", "dev box", "workstation"],
    oneLiner: "Where you write code and build the container image once.",
    plain: [
      "You write the Spring Boot code, then a Dockerfile describes how to build the image: which base image (e.g. a Java 21 runtime), which files to copy in, and which command starts the app.",
      "docker build turns the Dockerfile into an image. docker push uploads it to the registry.",
    ],
    analogy: "The factory where the shipping container is packed and sealed.",
    why: "Building once and reusing the same image everywhere guarantees the code that was tested is the code that runs.",
    foodDash: "Builds the image fooddash-orders:v1.",
    connections: [
      { peer: "Amazon ECR", direction: "out", protocol: "HTTPS (Docker registry API)", port: "443", rule: "First log in: aws ecr get-login-password | docker login --username AWS --password-stdin <registry>. The login token is valid for 12 hours. Then docker push." },
    ],
    advanced: [
      "In real teams, a CI pipeline (e.g. GitHub Actions) builds and pushes images, not individual laptops. Covered in Module 05.",
      "Tag images with a version or Git commit hash, not just “latest”, so you always know exactly what's running.",
    ],
    facts: ["docker build -t fooddash-orders:v1 .", "docker tag fooddash-orders:v1 123456789012.dkr.ecr.ap-south-1.amazonaws.com/fooddash-orders:v1", "docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/fooddash-orders:v1"],
  },
  ecr: {
    name: "Amazon ECR",
    aliases: ["ECR (Elastic Container Registry)", "registry", "image repository"],
    oneLiner: "A private library of container images.",
    plain: [
      "ECR stores your container images privately. Each service gets a repository (e.g. fooddash-orders), and each version is an image with a tag (e.g. v1).",
      "Hosts and services pull images from ECR when they start containers.",
    ],
    analogy: "A secure warehouse of sealed shipping containers, each labelled with a version, ready to be loaded onto any ship.",
    why: "Build once, store once, then run the identical image in Dev, QA, Staging and Prod.",
    foodDash: "Repository fooddash-orders holds image tag v1.",
    connections: [
      { peer: "Developer laptop / CI pipeline", direction: "in", protocol: "HTTPS", port: "443", rule: "docker push after docker login with a 12-hour token. The pusher needs IAM permissions such as ecr:PutImage and ecr:InitiateLayerUpload." },
      { peer: "ECS hosts / Fargate", direction: "out", protocol: "HTTPS", port: "443", rule: "Pulled by the ECS task execution role, which needs ecr:GetAuthorizationToken, ecr:BatchGetImage and ecr:GetDownloadUrlForLayer." },
    ],
    advanced: [
      "Image scanning finds known security vulnerabilities in your image layers.",
      "Lifecycle policies delete old images automatically, e.g. keep only the last 10, which keeps storage costs down.",
    ],
    facts: ["Registry URI: 123456789012.dkr.ecr.ap-south-1.amazonaws.com", "Repository ARN: arn:aws:ecr:ap-south-1:123456789012:repository/fooddash-orders", "Login token validity: 12 hours"],
  },
  chost: {
    name: "EC2 host in an ECS cluster",
    aliases: ["container instance", "node", "ECS host"],
    oneLiner: "A normal EC2 instance whose job is to run many containers side by side.",
    plain: [
      "An ECS cluster is a group of hosts that run containers. Each host here is an EC2 instance with the ECS agent installed, which receives instructions from ECS about which containers to run.",
      "With AWS Fargate you skip this layer entirely: AWS provides the compute and you only describe the containers.",
    ],
    analogy: "A cargo ship carrying many containers at once.",
    why: "Packing small containers tightly onto one host uses hardware even better than VMs did.",
    foodDash: "One host runs the menu, payments, orders and tracking containers.",
    connections: [
      { peer: "Amazon ECS (control plane)", direction: "both", protocol: "HTTPS", port: "443", rule: "The ECS agent on the host keeps an outbound connection to ECS to receive tasks and report status." },
      { peer: "Amazon ECR", direction: "out", protocol: "HTTPS", port: "443", rule: "Pulls images when starting tasks." },
    ],
    advanced: [
      "A task definition is the recipe for containers: image, CPU, memory, port mappings (e.g. containerPort 8080) and environment variables.",
      "An ECS service keeps N copies of a task running and registers them with a load balancer target group.",
    ],
    facts: ["ECS = AWS's own orchestrator", "EKS = managed Kubernetes", "Fargate = serverless compute for containers"],
  },
  runtime: {
    name: "Container runtime",
    aliases: ["Docker engine", "containerd", "container engine"],
    oneLiner: "Software that starts containers and keeps them isolated on one OS.",
    plain: [
      "The runtime takes an image and starts it as a running container. It uses Linux kernel features (namespaces for isolation, cgroups for CPU/memory limits) so containers can't see each other's processes or files.",
      "Because containers share the host's kernel instead of booting their own OS, they start in about a second and use much less memory than VMs.",
    ],
    analogy: "The crane and lashing system on the ship that loads containers and keeps each one locked in its own slot.",
    why: "It's what makes containers light and fast compared with VMs.",
    foodDash: "Starts and isolates the 4 FoodDash containers.",
    connections: [
      { peer: "Host OS kernel (below)", direction: "both", protocol: "Linux namespaces + cgroups", port: "n/a", rule: "All containers share this one kernel." },
      { peer: "Containers (above)", direction: "both", protocol: "Process isolation", port: "n/a", rule: "Each container gets its own filesystem view, network namespace and resource limits." },
    ],
    advanced: [
      "VM vs container: VM = full guest OS, boots in minutes, strong hardware-level isolation. Container = shared kernel, starts in seconds, lighter isolation.",
      "Images are built in layers. Unchanged layers are cached and shared, which makes builds and pulls fast.",
    ],
    facts: ["Isolation: namespaces · Limits: cgroups", "VM boot: minutes · container start: about 1 second", "Image standard: OCI (Open Container Initiative)"],
  },
  ctr: {
    name: "Container",
    aliases: ["Docker container", "task (ECS)", "pod (Kubernetes)"],
    oneLiner: "A running copy of an image: your app plus everything it needs, sealed in a box.",
    plain: [
      "An image is the sealed package; a container is that package running. You can run many containers from the same image.",
      "The FoodDash orders container runs Spring Boot, which listens on port 8080 inside the container.",
    ],
    analogy: "A sealed lunch box packed in the same kitchen every time: open it anywhere and the meal is exactly the same.",
    why: "It solves “it works on my machine!”: the box is byte-for-byte identical in every environment.",
    foodDash: "menu, payments, orders (Spring Boot · :8080) and tracking each run as a container.",
    connections: [
      { peer: "Load balancer", direction: "in", protocol: "HTTP", port: "8080 (container port)", rule: "The task definition maps containerPort 8080. The load balancer's target group sends traffic to it, and the security group must allow 8080 only from the load balancer." },
      { peer: "Amazon ECR", direction: "in", protocol: "HTTPS", port: "443", rule: "The image is pulled from ECR before the container starts." },
    ],
    advanced: [
      "Containers should be stateless: never store orders or uploads inside the container; use a database or S3, because a container can be replaced at any moment.",
      "Health checks (e.g. GET /actuator/health in Spring Boot) let ECS replace a container that stops responding.",
    ],
    facts: ["Spring Boot default port: 8080", "Health check example: GET /actuator/health", "Image: fooddash-orders:v1"],
  },

  /* ======================================================================
     ERA 5: SERVERLESS
     ====================================================================== */
  era5: {
    name: "Era 5 · Serverless and event-driven",
    aliases: ["serverless", "FaaS (Function as a Service)", "event-driven architecture"],
    oneLiner: "No servers to manage at all: code runs only when an event happens.",
    plain: [
      "An order arrives at API Gateway, which wakes up a Lambda function. Lambda saves the order to DynamoDB and notifies the restaurant through SNS, then goes back to sleep.",
      "There are still servers somewhere, but AWS owns, patches and scales them. You only upload code and configuration.",
      "You pay per request and per millisecond of run time. When nobody orders, you pay ₹0 for compute.",
    ],
    analogy: "A cloud kitchen that only switches on the stove when an order comes in, and charges you only for the minutes the stove was on.",
    why: "Even with containers, you paid for hosts sitting idle at 3 AM. Serverless removes idle cost and server management completely.",
    foodDash: "POST /orders → API Gateway → Lambda placeOrder() → DynamoDB Orders table + SNS “new order” message.",
    connections: [
      { peer: "Customer", direction: "in", protocol: "HTTPS", port: "443", rule: "Requests go to the API Gateway endpoint, e.g. https://abc123.execute-api.ap-south-1.amazonaws.com/prod/orders." },
    ],
    advanced: [
      "Trade-offs: less control over the machine, a short cold-start delay on the first request after idle, and a maximum run time of 15 minutes per invocation.",
      "Event-driven means services react to events (an HTTP request, a new S3 file, a queue message) instead of constantly polling.",
    ],
    facts: ["AWS Lambda launched: November 2014", "Lambda max run time: 15 minutes", "You manage: just your code (+ IAM permissions)"],
  },
  apigw: {
    name: "Amazon API Gateway",
    aliases: ["API GW", "API Gateway", "front door for APIs"],
    oneLiner: "A managed front door that receives HTTPS requests and hands them to your code.",
    plain: [
      "API Gateway gives you a public HTTPS address for your API. You define routes, like POST /orders, and connect each route to a backend such as a Lambda function.",
      "It handles TLS encryption, request throttling (rate limits), authentication checks and scaling for you. There's no web server to run or patch.",
    ],
    analogy: "The reception desk of a hotel: every guest arrives there first, gets checked, and is sent to the right room. The guests never wander the corridors themselves.",
    why: "Without it, you'd need a web server running 24x7 just to receive requests, which defeats the point of serverless.",
    foodDash: "Route POST /orders invokes the placeOrder Lambda function.",
    connections: [
      { peer: "Customer", direction: "in", protocol: "HTTPS", port: "443", rule: "Public endpoint like https://abc123.execute-api.ap-south-1.amazonaws.com/prod/orders. Plain HTTP is not accepted." },
      { peer: "AWS Lambda (placeOrder)", direction: "out", protocol: "Lambda Invoke (proxy integration)", port: "n/a (AWS internal)", rule: "The function's resource-based policy must allow apigateway.amazonaws.com to call lambda:InvokeFunction. Without it you get a 500 error." },
    ],
    advanced: [
      "Two main types: REST API (more features: usage plans, API keys, request validation) and HTTP API (simpler, cheaper, faster).",
      "Default account-level throttling: 10,000 requests per second with a burst of 5,000, per Region (can be raised).",
      "Integration timeout for REST APIs is about 29 seconds by default, so long jobs should be handed off asynchronously.",
    ],
    facts: ["Protocol: HTTPS · port 443", "Route: POST /orders", "Endpoint: https://abc123.execute-api.ap-south-1.amazonaws.com/prod/orders", "Throttle default: 10,000 rps, burst 5,000"],
  },
  lambda: {
    name: "AWS Lambda",
    aliases: ["Lambda", "function", "serverless function", "FaaS (Function as a Service)"],
    oneLiner: "Upload just a function; AWS runs it only when an event arrives.",
    plain: [
      "A Lambda function is a piece of code with one entry point, called the handler. In Java that's a method like handleRequest(input, context).",
      "When an event arrives (here, an HTTP request from API Gateway), Lambda starts an execution environment if one isn't already warm, runs your handler, returns the result, and then stays warm for a while in case another request comes.",
      "You choose memory (128 MB to 10,240 MB); CPU power scales with memory. You pay per request and per millisecond of duration.",
    ],
    analogy: "A chef who appears the instant an order ticket prints, cooks that one dish, and disappears. You only pay for the seconds they were cooking.",
    why: "No servers at all. When nobody orders, you pay ₹0 for compute.",
    foodDash: "placeOrder() validates the order, writes it to DynamoDB and publishes a message to SNS. Runs for about 120 ms.",
    connections: [
      { peer: "API Gateway", direction: "in", protocol: "Invoke (event)", port: "n/a", rule: "Allowed by the function's resource-based policy (principal apigateway.amazonaws.com, action lambda:InvokeFunction)." },
      { peer: "Amazon DynamoDB", direction: "out", protocol: "HTTPS (DynamoDB API)", port: "443", rule: "The function's execution role needs dynamodb:PutItem on arn:aws:dynamodb:ap-south-1:123456789012:table/Orders." },
      { peer: "Amazon SNS", direction: "out", protocol: "HTTPS (SNS API)", port: "443", rule: "The execution role needs sns:Publish on arn:aws:sns:ap-south-1:123456789012:new-orders." },
      { peer: "Amazon CloudWatch Logs", direction: "out", protocol: "HTTPS", port: "443", rule: "Needs logs:CreateLogGroup, logs:CreateLogStream and logs:PutLogEvents (included in the AWSLambdaBasicExecutionRole managed policy)." },
    ],
    advanced: [
      "Cold start: the first request after idle must create an environment and start the JVM, which can add hundreds of milliseconds to seconds for Java. Lambda SnapStart for Java greatly reduces this.",
      "Two permission sides: the resource-based policy says WHO may call the function; the execution role says WHAT the function may call.",
      "Concurrency: each simultaneous request uses one execution environment. Default account limit per Region is 1,000 concurrent executions (new accounts may start lower; it can be raised).",
    ],
    facts: ["Function ARN: arn:aws:lambda:ap-south-1:123456789012:function:placeOrder", "Runtime: Java 21 (java21)", "Memory: 128 MB to 10,240 MB", "Max timeout: 15 minutes", "Billing: per request + per ms", "Free tier: 1 million requests/month"],
    mistakes: ["Giving the execution role full admin (“*”) permissions.", "Setting a huge timeout so a bug runs (and bills) for 15 minutes."],
  },
  ddb: {
    name: "Amazon DynamoDB",
    aliases: ["DynamoDB", "DDB", "NoSQL key-value database"],
    oneLiner: "A fully managed database that stores items by key and answers in milliseconds at any scale.",
    plain: [
      "DynamoDB stores data in tables. Each row is called an item, and every item is found by its primary key, for example orderId = \"ord-1042\".",
      "There's no database server to size, patch or back up by hand. It scales automatically and typically answers in single-digit milliseconds.",
      "It's NoSQL: no fixed columns and no SQL JOINs. You design tables around the questions your app will ask.",
    ],
    analogy: "A gigantic, perfectly organized locker room: give the attendant the locker number (key) and they hand you the contents instantly, no matter how many lockers exist.",
    why: "Serverless code needs a database that's also serverless: no servers, pay per request, scales with traffic.",
    foodDash: "Table “Orders” with partition key orderId stores every order and its status.",
    connections: [
      { peer: "AWS Lambda (placeOrder)", direction: "in", protocol: "HTTPS (DynamoDB API)", port: "443", rule: "Allowed only if the Lambda execution role has dynamodb:PutItem on the table ARN." },
      { peer: "Tracking screen (later)", direction: "in", protocol: "HTTPS (DynamoDB API)", port: "443", rule: "Reads with GetItem by orderId, which requires dynamodb:GetItem." },
    ],
    advanced: [
      "Capacity modes: on-demand (pay per read/write request, no planning) or provisioned (set read/write capacity units, cheaper for steady traffic).",
      "Maximum item size: 400 KB. Store big files in S3 and keep just the S3 key in DynamoDB.",
      "Partition key design matters: spread traffic across many key values to avoid “hot” partitions.",
    ],
    facts: ["Table ARN: arn:aws:dynamodb:ap-south-1:123456789012:table/Orders", "Primary key: orderId (partition key)", "Max item size: 400 KB", "Mode: on-demand (pay per request)"],
  },
  sns: {
    name: "Amazon SNS",
    aliases: ["SNS (Simple Notification Service)", "pub/sub", "topic"],
    oneLiner: "Publish one message; SNS pushes it to every subscriber.",
    plain: [
      "SNS works with topics. A publisher sends one message to a topic, and SNS delivers a copy to every subscriber of that topic: an SMS, an email, an HTTPS endpoint, an SQS queue or a Lambda function.",
      "The publisher doesn't need to know who the subscribers are. This pattern is called publish/subscribe (pub/sub).",
    ],
    analogy: "A WhatsApp broadcast list: you send one message, and everyone on the list receives it.",
    why: "It decouples services: placeOrder just announces “new order!” and any number of systems can react without changing its code.",
    foodDash: "Topic new-orders notifies the restaurant's tablet app (and could also notify an analytics queue).",
    connections: [
      { peer: "AWS Lambda (placeOrder)", direction: "in", protocol: "HTTPS (SNS API)", port: "443", rule: "Allowed if the execution role has sns:Publish on the topic ARN." },
      { peer: "Restaurant app / SMS / SQS", direction: "out", protocol: "HTTPS · SMS · SQS", port: "443 for HTTPS endpoints", rule: "Each subscriber must be subscribed to the topic (and confirm, for email/HTTPS)." },
    ],
    advanced: [
      "Fan-out pattern: SNS → several SQS queues, so each consumer processes messages at its own pace and nothing is lost if one is slow.",
      "Maximum message size: 256 KB.",
    ],
    facts: ["Topic ARN: arn:aws:sns:ap-south-1:123456789012:new-orders", "Max message size: 256 KB", "Pattern: publish/subscribe"],
  },
  bill: {
    name: "Pay-per-use billing",
    aliases: ["serverless pricing", "usage-based billing", "OpEx"],
    oneLiner: "You're charged only for the milliseconds your code actually ran.",
    plain: [
      "With Lambda, you pay a tiny fee per request plus a charge based on how long your code ran (rounded up to the nearest millisecond) and how much memory you gave it.",
      "Zero orders at 3 AM means zero compute cost at 3 AM. This is the opposite of Era 1, where you paid for idle servers 24x7.",
    ],
    analogy: "A taxi meter that only runs while you're in the car, instead of buying the car.",
    why: "It's the end of the journey that started with buying idle servers upfront in Era 1.",
    foodDash: "Each placeOrder run of about 120 ms is billed; idle time costs nothing.",
    connections: [],
    advanced: [
      "Lambda duration is billed in GB-seconds: memory (GB) × run time (seconds). 512 MB for 0.12 s = 0.06 GB-seconds.",
      "Pay-per-use is cheapest for spiky or low traffic. At very high, steady traffic, always-on containers can become cheaper. Architects compare both.",
    ],
    facts: ["Lambda free tier: 1 million requests/month", "Duration unit: GB-second", "Billing granularity: 1 ms"],
  },

  /* ======================================================================
     CONNECTIONS (ARROWS)
     ====================================================================== */
  "conn-e1-req": {
    name: "Customer → Server 1 (Orders)",
    aliases: ["inbound request", "north-south traffic"],
    oneLiner: "The order travels from the phone, over the internet, into your building.",
    plain: [
      "The request leaves the customer's phone, crosses the internet to your ISP line, passes your office router (which directs traffic) and firewall (which blocks anything not allowed), and reaches Server 1's network card on port 443.",
    ],
    analogy: "A letter going from the customer's post office, through the city's mail system, to your building's reception, then to the right desk.",
    why: "Every step on this path is equipment you bought and must keep running.",
    foodDash: "POST /orders reaches the Orders app on Server 1.",
    connections: [
      { peer: "Customer → Server 1", direction: "in", protocol: "HTTPS (TLS)", port: "443", rule: "Firewall rule: allow TCP 443 from anywhere (0.0.0.0/0) to Server 1. Every other inbound port is blocked." },
    ],
    advanced: ["If your single ISP line or router fails, FoodDash is unreachable even though the servers are fine: another single point of failure."],
    facts: ["Path: phone → internet → ISP → router → firewall → Server 1", "Allow: TCP 443 inbound", "Block: everything else"],
  },
  "conn-e2-req": {
    name: "Customer → VM 1 (Orders)",
    aliases: ["inbound request", "virtual switch forwarding"],
    oneLiner: "The request reaches the physical server, then the hypervisor forwards it to the right VM.",
    plain: [
      "The request arrives at the host's physical network card. The hypervisor runs a virtual switch that looks at the destination IP address and hands the packet to VM 1's virtual network card.",
    ],
    analogy: "A building's reception desk forwarding a parcel to the correct flat number.",
    why: "Several VMs share one physical network card, so something must sort the traffic.",
    foodDash: "POST /orders reaches the Orders app inside VM 1.",
    connections: [
      { peer: "Customer → VM 1", direction: "in", protocol: "HTTPS", port: "443", rule: "Each VM has its own IP address; the virtual switch forwards by that address." },
    ],
    advanced: ["In AWS, the equivalent is the VPC network: each EC2 instance gets an Elastic Network Interface (ENI) with a private IP."],
    facts: ["Physical NIC → virtual switch → VM's virtual NIC", "Port: 443"],
  },
  "conn-e3-req": {
    name: "Customer → EC2 instance",
    aliases: ["inbound request"],
    oneLiner: "The order reaches one of the running EC2 instances in Mumbai.",
    plain: [
      "In a real setup, the customer's HTTPS request first reaches an Application Load Balancer (ALB) on port 443. The ALB picks a healthy instance and forwards the request to it on the app port, 8080.",
      "This diagram draws the request straight to the instances so you can focus on scaling; the ALB gets its own lesson in Module 02.",
    ],
    analogy: "A restaurant host seating each new customer at whichever waiter is free.",
    why: "Spreading requests over several instances is what makes scaling out useful.",
    foodDash: "POST /orders goes to EC2 instance 1 (or 2, 3, 4 during the rush).",
    connections: [
      { peer: "Customer → ALB", direction: "in", protocol: "HTTPS", port: "443", rule: "ALB security group allows 443 from 0.0.0.0/0." },
      { peer: "ALB → EC2", direction: "out", protocol: "HTTP", port: "8080", rule: "Instance security group allows 8080 only from the ALB's security group." },
    ],
    advanced: ["The instances live in private subnets (e.g. 10.0.2.0/24) with no public IP; only the ALB faces the internet."],
    facts: ["Customer → ALB: HTTPS 443", "ALB → EC2: HTTP 8080", "Private subnet: 10.0.2.0/24"],
  },
  "conn-e3-rush": {
    name: "Customer → extra instances (lunch rush)",
    aliases: ["scale-out traffic"],
    oneLiner: "During the rush, new instances start receiving their share of orders.",
    plain: [
      "When the Auto Scaling Group launches instances 3 and 4, they're registered with the load balancer. Once they pass health checks, the load balancer starts sending them requests too.",
    ],
    analogy: "Extra cooks join the kitchen at lunch, and the order screen starts assigning them tickets.",
    why: "New capacity is only useful once it actually receives traffic.",
    foodDash: "Orders are now spread over 4 instances instead of 2.",
    connections: [
      { peer: "ALB → new instances", direction: "out", protocol: "HTTP", port: "8080", rule: "Instances receive traffic only after passing the target group's health check (e.g. GET /actuator/health returns 200)." },
    ],
    advanced: ["Scale-in later uses connection draining (deregistration delay) so in-flight orders finish before an instance is removed."],
    facts: ["Health check: HTTP 200 on /actuator/health", "Deregistration delay default: 300 s"],
  },
  "conn-e3-cw": {
    name: "CloudWatch alarm → Auto Scaling Group",
    aliases: ["scaling trigger", "alarm action"],
    oneLiner: "The alarm fires and tells the ASG to add instances.",
    plain: [
      "When average CPU stays above 60% for 2 minutes, the alarm enters the ALARM state and runs the ASG's scaling policy, raising desired capacity from 2 to 4.",
    ],
    analogy: "The smoke detector ringing and the manager calling in extra staff.",
    why: "It connects measuring (CloudWatch) with acting (Auto Scaling).",
    foodDash: "orders-high-cpu alarm → desired capacity 2 → 4.",
    connections: [
      { peer: "CloudWatch → ASG", direction: "out", protocol: "Alarm action (AWS internal)", port: "n/a", rule: "The alarm's action references the scaling policy ARN of the ASG." },
    ],
    advanced: ["With target tracking, AWS creates both the high and low alarms for you, so scale-out and scale-in happen automatically."],
    facts: ["Condition: Average CPUUtilization > 60 for 2 × 60 s", "Action: increase desired capacity by 2"],
  },
  "conn-e3-s3": {
    name: "EC2 instance → Amazon S3",
    aliases: ["object storage access"],
    oneLiner: "The app saves and reads food photos in S3 over HTTPS.",
    plain: [
      "When a restaurant uploads a dish photo, the Orders app calls the S3 API (PutObject) over HTTPS. It's allowed because the instance has an IAM role with permission on the bucket.",
    ],
    analogy: "A cook sending finished dishes to a giant shared cold store instead of keeping them on the kitchen counter.",
    why: "Instances come and go with auto scaling; files must live somewhere permanent.",
    foodDash: "Photos stored in arn:aws:s3:::fooddash-food-photos.",
    connections: [
      { peer: "EC2 → S3", direction: "out", protocol: "HTTPS (S3 API)", port: "443", rule: "IAM role policy allows s3:PutObject and s3:GetObject on arn:aws:s3:::fooddash-food-photos/*. No access keys on disk." },
    ],
    advanced: ["A VPC gateway endpoint for S3 lets private instances reach S3 without going through the internet or a NAT gateway, which saves money."],
    facts: ["Port 443", "Actions: s3:PutObject, s3:GetObject", "Resource: arn:aws:s3:::fooddash-food-photos/*"],
  },
  "conn-e4-push": {
    name: "Laptop → Amazon ECR (docker push)",
    aliases: ["image push"],
    oneLiner: "The built image is uploaded to the private registry.",
    plain: [
      "After docker build, you log in to ECR with a temporary token and run docker push. Only the image layers ECR doesn't already have are uploaded.",
    ],
    analogy: "Sending the sealed container to the port warehouse.",
    why: "Every environment will pull this exact image, so it must be stored centrally.",
    foodDash: "fooddash-orders:v1 is pushed to ECR.",
    connections: [
      { peer: "Laptop → ECR", direction: "out", protocol: "HTTPS", port: "443", rule: "aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-south-1.amazonaws.com (token valid 12 hours)." },
    ],
    advanced: ["In CI, use an IAM role assumed through OIDC (OpenID Connect) instead of long-lived access keys."],
    facts: ["Port 443", "Token validity: 12 hours", "Target: 123456789012.dkr.ecr.ap-south-1.amazonaws.com/fooddash-orders:v1"],
  },
  "conn-e4-pull": {
    name: "Amazon ECR → EC2 host (image pull)",
    aliases: ["image pull"],
    oneLiner: "The host downloads the image before starting the container.",
    plain: [
      "When ECS tells the host to run a task, the host pulls the image from ECR over HTTPS, using the task execution role's permissions, then the runtime starts the container.",
    ],
    analogy: "The ship loading the sealed container from the warehouse.",
    why: "The host can only run what it has downloaded.",
    foodDash: "The host pulls fooddash-orders:v1 and starts the orders container.",
    connections: [
      { peer: "ECR → host", direction: "out", protocol: "HTTPS", port: "443", rule: "Task execution role needs ecr:GetAuthorizationToken, ecr:BatchGetImage, ecr:GetDownloadUrlForLayer. Hosts in private subnets need a NAT gateway or VPC endpoints to reach ECR." },
    ],
    advanced: ["Cached layers mean later pulls of new versions only download what changed."],
    facts: ["Port 443", "Role: ECS task execution role"],
  },
  "conn-e4-req": {
    name: "Customer → orders container",
    aliases: ["inbound request", "port mapping"],
    oneLiner: "HTTPS on 443 at the load balancer becomes HTTP on 8080 at the container.",
    plain: [
      "The customer connects to the load balancer on port 443. The load balancer decrypts the request (TLS termination) and forwards it to the orders container's port 8080, as defined by the port mapping in the task definition.",
    ],
    analogy: "The hotel reception (443) walking the guest to room 8080.",
    why: "Containers listen on their own app ports; the load balancer is the single public entry point.",
    foodDash: "POST /orders → orders container (Spring Boot · :8080).",
    connections: [
      { peer: "Customer → load balancer", direction: "in", protocol: "HTTPS", port: "443", rule: "Load balancer security group allows 443 from 0.0.0.0/0." },
      { peer: "Load balancer → container", direction: "out", protocol: "HTTP", port: "8080", rule: "Container/host security group allows 8080 only from the load balancer's security group." },
    ],
    advanced: ["With awsvpc networking (required on Fargate), each task gets its own network interface and private IP."],
    facts: ["443 → 8080", "containerPort: 8080", "Network mode: awsvpc"],
  },
  "conn-e5-req": {
    name: "Customer → API Gateway",
    aliases: ["inbound request"],
    oneLiner: "The order arrives at the managed HTTPS front door.",
    plain: [
      "The app sends POST /orders to the API Gateway endpoint over HTTPS. API Gateway checks the route, applies throttling and any authorization, then invokes Lambda.",
    ],
    analogy: "A guest arriving at the hotel reception.",
    why: "It gives serverless code a public address without running any web server.",
    foodDash: "POST https://abc123.execute-api.ap-south-1.amazonaws.com/prod/orders",
    connections: [
      { peer: "Customer → API Gateway", direction: "in", protocol: "HTTPS", port: "443", rule: "Only HTTPS is accepted. Throttled at 10,000 rps (burst 5,000) per account per Region by default." },
    ],
    advanced: ["Add an authorizer (e.g. Amazon Cognito, Module 02) so only logged-in customers can place orders."],
    facts: ["Port 443", "Method + path: POST /orders", "Stage: prod"],
  },
  "conn-e5-invoke": {
    name: "API Gateway → Lambda (invoke)",
    aliases: ["Lambda proxy integration", "invoke"],
    oneLiner: "API Gateway wakes up the placeOrder function with the request as an event.",
    plain: [
      "With proxy integration, API Gateway passes the whole HTTP request (method, path, headers, body) to Lambda as a JSON event, waits for the function's response and sends it back to the customer.",
    ],
    analogy: "Reception phoning the chef with the exact order ticket.",
    why: "It's the moment code actually runs, and billing starts.",
    foodDash: "Invokes arn:aws:lambda:ap-south-1:123456789012:function:placeOrder.",
    connections: [
      { peer: "API Gateway → Lambda", direction: "out", protocol: "Lambda Invoke (synchronous)", port: "n/a (AWS internal)", rule: "Lambda resource-based policy: Principal apigateway.amazonaws.com, Action lambda:InvokeFunction, SourceArn = the API's ARN." },
    ],
    advanced: ["Synchronous invoke: the customer waits for the answer. For long work, return quickly and continue asynchronously (SQS, EventBridge)."],
    facts: ["Action: lambda:InvokeFunction", "Principal: apigateway.amazonaws.com", "REST integration timeout: about 29 s"],
  },
  "conn-e5-ddb": {
    name: "Lambda → DynamoDB (PutItem)",
    aliases: ["database write"],
    oneLiner: "The function saves the new order as an item in the Orders table.",
    plain: [
      "placeOrder calls DynamoDB's PutItem API over HTTPS with the order data, e.g. orderId, customerId, items, total and status = PLACED.",
    ],
    analogy: "The chef writing the order into the restaurant's order book.",
    why: "Lambda environments are temporary; anything that must be remembered goes into a database.",
    foodDash: "Writes to arn:aws:dynamodb:ap-south-1:123456789012:table/Orders.",
    connections: [
      { peer: "Lambda → DynamoDB", direction: "out", protocol: "HTTPS (DynamoDB API)", port: "443", rule: "Execution role allows dynamodb:PutItem on the table ARN only (least privilege)." },
    ],
    advanced: ["Use a condition expression (attribute_not_exists(orderId)) so a retried request can't create a duplicate order."],
    facts: ["Action: dynamodb:PutItem", "Port 443"],
  },
  "conn-e5-sns": {
    name: "Lambda → SNS (Publish)",
    aliases: ["notification"],
    oneLiner: "The function announces “new order!” to everyone subscribed.",
    plain: ["placeOrder calls SNS Publish on the new-orders topic. SNS delivers the message to the restaurant app and any other subscribers."],
    analogy: "Ringing the kitchen bell so every station knows a new order arrived.",
    why: "The restaurant must know instantly, without placeOrder knowing how the restaurant is notified.",
    foodDash: "Publishes to arn:aws:sns:ap-south-1:123456789012:new-orders.",
    connections: [
      { peer: "Lambda → SNS", direction: "out", protocol: "HTTPS (SNS API)", port: "443", rule: "Execution role allows sns:Publish on the topic ARN." },
    ],
    advanced: ["Publishing after the DynamoDB write means a failed write never sends a false notification."],
    facts: ["Action: sns:Publish", "Port 443", "Max message: 256 KB"],
  },
};
