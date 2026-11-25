import type { DiagramNode, Era } from "./types";

/**
 * Diagram space: 1000 x 520 units. Every node sits inside x 40..960, y 36..502,
 * with at least 16 units between neighbours, so nothing overlaps or touches an edge.
 * The customer node (x 40..190) is shared by every era.
 */
export const CUSTOMER: DiagramNode = {
  id: "customer", concept: "customer", kind: "node", x: 40, y: 222, w: 150, h: 96,
  title: "👤 Customer", sub: "taps “Place Order”", sub2: "FoodDash app", tone: "slate",
};

const BADGE_Y = 462;
const badge = (id: string, concept: string, x: number, title: string, tone: DiagramNode["tone"]): DiagramNode =>
  ({ id, concept, kind: "badge", x, y: BADGE_Y, w: 216, h: 40, title, tone });

export const ERAS: Era[] = [
  /* --------------------------------------------------------------- ERA 1 */
  {
    id: "e1", icon: "🖥️", year: "1990s", name: "Bare-metal", tone: "slate", concept: "era1",
    title: "Era 1 · On-premises bare-metal servers", when: "1990s to mid-2000s",
    stats: [["Time to launch", "3 to 6 months"], ["You pay for", "Hardware upfront, 24x7"], ["Typical CPU use", "5 to 15%"], ["You manage", "Everything, building to app"]],
    nodes: [
      { id: "room", concept: "room", kind: "zone", x: 290, y: 36, w: 670, h: 404, title: "🏢 Your own server room (on-premises)", tone: "slate" },
      { id: "srv1", concept: "srv", kind: "stack", x: 322, y: 86, w: 190, h: 262, title: "Server 1", sub: "physical machine", rows: ["🍔 Orders app", "Linux OS", "CPU · RAM · Disk"], bar: 12, tone: "slate" },
      { id: "srv2", concept: "srv", kind: "stack", x: 530, y: 86, w: 190, h: 262, title: "Server 2", sub: "physical machine", rows: ["💳 Payments app", "Linux OS", "CPU · RAM · Disk"], bar: 8, tone: "slate" },
      { id: "srv3", concept: "srv", kind: "stack", x: 738, y: 86, w: 190, h: 262, title: "Server 3", sub: "physical machine", rows: ["📋 Menu app", "Linux OS", "CPU · RAM · Disk"], bar: 15, tone: "slate" },
      { id: "facil", concept: "facil", kind: "node", x: 322, y: 366, w: 606, h: 56, title: "⚡ Power · ❄️ Cooling · 🔋 Backup generator · 💂 Security", sub: "all yours to pay for and run, 24 hours a day", tone: "slate" },
      badge("b-lead", "lead", 290, "⏳ Lead time: 3 to 6 months", "slate"),
      badge("b-capex", "capex", 517, "💸 Paid upfront (CapEx)", "slate"),
      badge("b-util", "util", 744, "📉 85 to 95% of CPU idle", "rose"),
    ],
    edges: [
      { id: "e1-req", concept: "conn-e1-req", d: "M190 270 C250 270 262 248 322 248", tone: "slate", label: "HTTPS · 443", labelAt: [240, 226] },
    ],
    steps: [
      { title: "A customer places an order", text: "A hungry customer taps “Place Order”. Their phone sends an HTTPS request on port 443. In 2003, that request has to reach a computer that FoodDash physically owns.", focus: ["customer"], edges: [] },
      { title: "The request travels into your building", text: "It crosses the internet to your ISP line, passes your office router and firewall, and lands on Server 1. Every piece of equipment on that path is yours to buy and fix.", focus: ["customer", "srv1"], edges: ["e1-req"] },
      { title: "One app per server", text: "Orders, Payments and Menu each get a whole physical machine. That way a crash or bad update in one app can never take down another. Safe, but very expensive.", focus: ["srv1", "srv2", "srv3"], edges: [] },
      { title: "Most of every CPU sits idle", text: "Look at the red bars: 12%, 8% and 15% busy. You paid for 100% of three machines and use about 12% of each. The other 85 to 95% is powered, cooled... and wasted.", focus: ["srv1", "srv2", "srv3", "b-util"], edges: [] },
      { title: "You pay for everything, all the time", text: "Power, cooling, backup generators and security run 24 hours a day, even at 3 AM when nobody orders food. And the servers themselves were paid for upfront (CapEx).", focus: ["facil", "b-capex"], edges: [] },
      { title: "Need more? Wait months.", text: "Diwali sale coming? Ordering a 4th server takes 3 to 6 months (lead time). So you must guess your traffic years ahead. Guess low and you crash; guess high and you waste money.", focus: ["b-lead"], edges: [] },
    ],
  },

  /* --------------------------------------------------------------- ERA 2 */
  {
    id: "e2", icon: "🧩", year: "2000s", name: "Virtualization", tone: "sky", concept: "era2",
    title: "Era 2 · Virtualization and hypervisors", when: "VMware ESX 2001 · Xen 2003",
    stats: [["Time to launch", "Weeks"], ["You pay for", "Fewer servers, still upfront"], ["Typical CPU use", "60 to 80%"], ["You manage", "Hardware, hypervisor, OS, app"]],
    nodes: [
      { id: "host-zone", concept: "host", kind: "zone", x: 290, y: 36, w: 670, h: 404, title: "🖥️ ONE physical server (the host)", tone: "sky" },
      { id: "vm1", concept: "vm", kind: "stack", x: 322, y: 80, w: 190, h: 196, title: "VM 1", sub: "virtual machine", rows: ["🍔 Orders app", "Guest OS (Linux)"], tone: "sky" },
      { id: "vm2", concept: "vm", kind: "stack", x: 530, y: 80, w: 190, h: 196, title: "VM 2", sub: "virtual machine", rows: ["💳 Payments app", "Guest OS (Linux)"], tone: "sky" },
      { id: "vm3", concept: "vm", kind: "stack", x: 738, y: 80, w: 190, h: 196, title: "VM 3", sub: "virtual machine", rows: ["📋 Menu app", "Guest OS (Linux)"], tone: "sky" },
      { id: "hyp", concept: "hyp", kind: "node", x: 322, y: 292, w: 606, h: 56, title: "Hypervisor", sub: "splits the hardware: VMware ESXi · Xen · KVM", tone: "sky" },
      { id: "hw", concept: "host", kind: "node", x: 322, y: 362, w: 606, h: 62, title: "Physical hardware", sub: "CPU · RAM · Disk · Network card", tone: "slate" },
      badge("b2-lead", "lead", 290, "⏳ Lead time: weeks", "sky"),
      badge("b2-util", "host", 517, "📈 CPU used: ~70%", "emerald"),
      badge("b2-iso", "vm", 744, "🧩 1 box, 3 isolated apps", "sky"),
    ],
    edges: [
      { id: "e2-req", concept: "conn-e2-req", d: "M190 270 C250 270 262 178 322 178", tone: "sky", label: "HTTPS · 443", labelAt: [246, 340] },
    ],
    steps: [
      { title: "The same order, a smarter server", text: "The customer's HTTPS request on port 443 now reaches ONE physical server that runs several virtual machines.", focus: ["customer", "vm1"], edges: ["e2-req"] },
      { title: "Three VMs, fully isolated", text: "VM 1 (Orders), VM 2 (Payments) and VM 3 (Menu) each have their own guest OS. If Payments crashes, Orders keeps running, just like separate servers.", focus: ["vm1", "vm2", "vm3"], edges: [] },
      { title: "The hypervisor does the magic", text: "The hypervisor splits the real CPU, RAM and disk into slices and gives each VM a set of fake (virtual) hardware. No VM can touch another's memory.", focus: ["hyp"], edges: [] },
      { title: "One box, about 70% busy", text: "Three apps share one set of hardware, so utilization jumps from ~10% to ~70%. You buy about a third of the servers.", focus: ["hw", "b2-util"], edges: [] },
      { title: "But you still own the hardware", text: "New VMs take minutes, but a new physical host still takes weeks to buy and rack. This idea of renting VMs is exactly what AWS turned into EC2.", focus: ["b2-lead", "b2-iso"], edges: [] },
    ],
  },

  /* --------------------------------------------------------------- ERA 3 */
  {
    id: "e3", icon: "☁️", year: "2006", name: "Cloud", tone: "violet", concept: "era3",
    title: "Era 3 · Cloud computing and elastic scaling", when: "S3: March 2006 · EC2: August 2006",
    stats: [["Time to launch", "About 1 minute"], ["You pay for", "Per second of server time"], ["Typical CPU use", "You choose, scales with load"], ["You manage", "OS, runtime, app"]],
    nodes: [
      { id: "region", concept: "region", kind: "zone", x: 290, y: 36, w: 670, h: 404, title: "☁️ AWS Region ap-south-1 (Mumbai)", tone: "violet" },
      { id: "asg", concept: "asg", kind: "zone", x: 316, y: 80, w: 404, h: 316, title: "Auto Scaling Group (min 2 · max 4)", tone: "violet" },
      { id: "ec2-1", concept: "ec2", kind: "node", x: 340, y: 120, w: 166, h: 88, title: "EC2 instance 1", sub: "🍔 Orders app", sub2: "t3.micro · :8080", tone: "violet" },
      { id: "ec2-2", concept: "ec2", kind: "node", x: 530, y: 120, w: 166, h: 88, title: "EC2 instance 2", sub: "🍔 Orders app", sub2: "t3.micro · :8080", tone: "violet" },
      { id: "ec2-3", concept: "ec2", kind: "node", x: 340, y: 286, w: 166, h: 88, title: "EC2 instance 3", sub: "🍔 Orders app", sub2: "added at lunch", tone: "violet", pulse: "rush" },
      { id: "ec2-4", concept: "ec2", kind: "node", x: 530, y: 286, w: 166, h: 88, title: "EC2 instance 4", sub: "🍔 Orders app", sub2: "added at lunch", tone: "violet", pulse: "rush" },
      { id: "rush", concept: "asg", kind: "badge", x: 418, y: 230, w: 200, h: 32, title: "🍛 Lunch rush: +2 servers", tone: "amber", pulse: "rush" },
      { id: "s3", concept: "s3", kind: "node", x: 752, y: 96, w: 180, h: 96, title: "🪣 Amazon S3", sub: "bucket: food photos", sub2: "unlimited storage", tone: "emerald" },
      { id: "cw", concept: "cw", kind: "node", x: 752, y: 260, w: 180, h: 96, title: "📊 CloudWatch", sub: "alarm: CPU > 60%", sub2: "→ add servers", tone: "amber" },
      badge("b3-lead", "ec2", 290, "⏳ Lead time: ~60 seconds", "violet"),
      badge("b3-pay", "capex", 517, "💳 Pay per second (OpEx)", "violet"),
      badge("b3-scale", "asg", 744, "📈 Scales 2 → 4 → 2 on its own", "emerald"),
    ],
    edges: [
      { id: "e3-req", concept: "conn-e3-req", d: "M190 260 C262 260 272 164 340 164", tone: "violet", label: "HTTPS · 443", labelAt: [238, 196] },
      { id: "e3-rush", concept: "conn-e3-rush", d: "M190 280 C262 280 272 330 340 330", tone: "violet", pulse: "rush" },
      { id: "e3-cw", concept: "conn-e3-cw", d: "M752 308 C736 308 736 320 722 320", tone: "amber", dashed: true, arrow: true },
      { id: "e3-s3", concept: "conn-e3-s3", d: "M696 164 C724 164 724 144 752 144", tone: "emerald", dashed: true, arrow: true },
    ],
    steps: [
      { title: "Rent servers in Mumbai", text: "FoodDash now runs in an AWS Region, ap-south-1 (Mumbai), close to its customers. No building, no racks, no waiting: one API call starts a server in about a minute.", focus: ["region"], edges: [] },
      { title: "Orders reach an EC2 instance", text: "The HTTPS request on 443 reaches EC2 instance 1. (In production a load balancer sits in front and forwards to port 8080; that's Module 02.)", focus: ["customer", "ec2-1"], edges: ["e3-req"] },
      { title: "An Auto Scaling Group keeps 2 running", text: "The ASG's rules: never fewer than 2 (min), never more than 4 (max). If an instance becomes unhealthy, it's replaced automatically.", focus: ["asg", "ec2-1", "ec2-2"], edges: [] },
      { title: "Lunch rush: CloudWatch raises the alarm", text: "Average CPU climbs above 60% for 2 minutes. The CloudWatch alarm enters ALARM and tells the ASG to add capacity.", focus: ["cw"], edges: ["e3-cw"] },
      { title: "Two more servers appear", text: "The ASG launches instances 3 and 4. Once they pass health checks they start taking orders. After lunch, they're removed and billing for them stops.", focus: ["ec2-3", "ec2-4", "rush"], edges: ["e3-rush"] },
      { title: "Photos live in S3", text: "Instances come and go, so files can't live on their disks. Food photos go to an S3 bucket over HTTPS 443, allowed by the instance's IAM role.", focus: ["s3", "ec2-2"], edges: ["e3-s3"] },
      { title: "Pay per second", text: "No upfront purchase (CapEx). You pay per second only while instances run (OpEx). The capacity-planning guessing game from Era 1 is gone.", focus: ["b3-pay", "b3-scale", "b3-lead"], edges: [] },
    ],
  },

  /* --------------------------------------------------------------- ERA 4 */
  {
    id: "e4", icon: "📦", year: "2013", name: "Containers", tone: "emerald", concept: "era4",
    title: "Era 4 · Microservices and containers", when: "Docker: 2013 · Amazon ECS: 2014 · EKS: 2018",
    stats: [["Time to launch", "Seconds per container"], ["You pay for", "Hosts or tasks, per second"], ["Typical CPU use", "High, packed tightly"], ["You manage", "Images, app, cluster settings"]],
    nodes: [
      { id: "laptop", concept: "laptop", kind: "node", x: 290, y: 40, w: 200, h: 90, title: "💻 Your laptop", sub: "docker build (once)", sub2: "fooddash-orders:v1", tone: "slate" },
      { id: "ecr", concept: "ecr", kind: "node", x: 290, y: 176, w: 200, h: 90, title: "📦 Amazon ECR", sub: "image registry", sub2: "fooddash-orders:v1", tone: "emerald" },
      { id: "chost", concept: "chost", kind: "zone", x: 540, y: 36, w: 420, h: 404, title: "🖥️ EC2 host (ECS cluster)", tone: "emerald" },
      { id: "c-menu", concept: "ctr", kind: "node", x: 560, y: 74, w: 184, h: 94, title: "📋 menu", sub: "container", sub2: "same image everywhere", tone: "emerald" },
      { id: "c-pay", concept: "ctr", kind: "node", x: 756, y: 74, w: 184, h: 94, title: "💳 payments", sub: "container", sub2: "same image everywhere", tone: "emerald" },
      { id: "c-orders", concept: "ctr", kind: "node", x: 560, y: 182, w: 184, h: 94, title: "🍔 orders", sub: "container", sub2: "Spring Boot · :8080", tone: "emerald" },
      { id: "c-track", concept: "ctr", kind: "node", x: 756, y: 182, w: 184, h: 94, title: "🛵 tracking", sub: "container", sub2: "same image everywhere", tone: "emerald" },
      { id: "runtime", concept: "runtime", kind: "node", x: 560, y: 292, w: 380, h: 56, title: "Container runtime (Docker engine)", sub: "containers share one OS kernel", tone: "emerald" },
      { id: "hostos", concept: "chost", kind: "node", x: 560, y: 362, w: 380, h: 62, title: "Host OS + hardware", sub: "one EC2 instance, many containers", tone: "slate" },
      badge("b4-same", "ctr", 290, "✅ Same box in Dev → Prod", "emerald"),
      badge("b4-fast", "runtime", 517, "🚀 Starts in ~1 second", "emerald"),
      badge("b4-once", "ecr", 744, "🔁 Build once, run anywhere", "emerald"),
    ],
    edges: [
      { id: "e4-push", concept: "conn-e4-push", d: "M390 130 V174", tone: "emerald", arrow: true, label: "docker push · 443", labelAt: [460, 152] },
      { id: "e4-pull", concept: "conn-e4-pull", d: "M490 221 H538", tone: "emerald", arrow: true, label: "pull", labelAt: [514, 200] },
      { id: "e4-req", concept: "conn-e4-req", d: "M190 270 C340 270 420 300 560 252", tone: "emerald", label: "443 → 8080", labelAt: [372, 312] },
    ],
    steps: [
      { title: "Build the image once", text: "On your laptop, docker build bakes the Spring Boot code, Java 21 and every library into one image: fooddash-orders:v1.", focus: ["laptop"], edges: [] },
      { title: "Push it to Amazon ECR", text: "docker push uploads the image over HTTPS 443 to your private registry, after logging in with a 12-hour token.", focus: ["laptop", "ecr"], edges: ["e4-push"] },
      { title: "The host pulls the image", text: "ECS tells the host to run the orders service. The host pulls the exact same image from ECR.", focus: ["ecr", "chost"], edges: ["e4-pull"] },
      { title: "The runtime starts containers in seconds", text: "Containers share the host's OS kernel instead of booting their own OS, so they start in about a second and use far less memory than VMs.", focus: ["runtime", "c-menu", "c-pay", "c-orders", "c-track"], edges: [] },
      { title: "Orders reach the orders container", text: "The customer connects on HTTPS 443; the load balancer forwards to the orders container on its port 8080.", focus: ["customer", "c-orders"], edges: ["e4-req"] },
      { title: "Same box everywhere", text: "Dev, QA, Staging and Prod all run the byte-for-byte identical image. “It works on my machine!” is finally gone.", focus: ["b4-same", "b4-once", "b4-fast"], edges: [] },
    ],
  },

  /* --------------------------------------------------------------- ERA 5 */
  {
    id: "e5", icon: "⚡", year: "2014", name: "Serverless", tone: "amber", concept: "era5",
    title: "Era 5 · Serverless and event-driven", when: "AWS Lambda: November 2014",
    stats: [["Time to launch", "Instant, on each event"], ["You pay for", "Per request + per ms"], ["Typical CPU use", "No idle servers at all"], ["You manage", "Just your code"]],
    nodes: [
      { id: "managed", concept: "era5", kind: "zone", x: 290, y: 36, w: 670, h: 404, title: "☁️ Fully managed by AWS: no servers for you", tone: "amber" },
      { id: "apigw", concept: "apigw", kind: "node", x: 316, y: 206, w: 180, h: 100, title: "🚪 API Gateway", sub: "POST /orders", sub2: "HTTPS · 443", tone: "sky" },
      { id: "lambda", concept: "lambda", kind: "node", x: 546, y: 206, w: 180, h: 100, title: "⚡ Lambda", sub: "placeOrder()", sub2: "Java 21 · ~120 ms", tone: "amber", pulse: "glow" },
      { id: "ddb", concept: "ddb", kind: "node", x: 776, y: 206, w: 160, h: 100, title: "🗄️ DynamoDB", sub: "Orders table", sub2: "pay per request", tone: "emerald" },
      { id: "sns", concept: "sns", kind: "node", x: 546, y: 76, w: 180, h: 80, title: "📣 Amazon SNS", sub: "“New order!” to restaurant", tone: "violet" },
      { id: "bill", concept: "bill", kind: "node", x: 316, y: 334, w: 620, h: 86, title: "💸 Billed only while your code runs", sub: "idle = ₹0", tone: "amber", meter: true },
      badge("b5-zero", "lambda", 290, "🧘 0 servers to manage", "amber"),
      badge("b5-ms", "bill", 517, "⏱️ Pay per millisecond", "amber"),
      badge("b5-idle", "bill", 744, "😴 Nobody ordering? ₹0", "emerald"),
    ],
    edges: [
      { id: "e5-req", concept: "conn-e5-req", d: "M190 270 C250 270 256 256 316 256", tone: "sky", label: "HTTPS · 443", labelAt: [240, 232] },
      { id: "e5-invoke", concept: "conn-e5-invoke", d: "M496 256 H546", tone: "amber", arrow: true, label: "invoke", labelAt: [521, 186] },
      { id: "e5-ddb", concept: "conn-e5-ddb", d: "M726 256 H776", tone: "emerald", arrow: true, label: "PutItem", labelAt: [751, 186] },
      { id: "e5-sns", concept: "conn-e5-sns", d: "M636 206 V158", tone: "violet", arrow: true, label: "Publish", labelAt: [682, 182] },
    ],
    steps: [
      { title: "The order hits API Gateway", text: "POST /orders arrives over HTTPS 443 at a managed front door. No web server is running anywhere that you have to look after.", focus: ["customer", "apigw"], edges: ["e5-req"] },
      { title: "API Gateway wakes up Lambda", text: "It invokes the placeOrder function. Allowed because the function's resource-based policy lets apigateway.amazonaws.com call lambda:InvokeFunction.", focus: ["apigw", "lambda"], edges: ["e5-invoke"] },
      { title: "Lambda saves the order", text: "placeOrder writes the order to the DynamoDB Orders table with PutItem over HTTPS 443, allowed by its execution role.", focus: ["lambda", "ddb"], edges: ["e5-ddb"] },
      { title: "Lambda tells the restaurant", text: "It publishes “New order!” to the SNS topic new-orders. SNS pushes it to the restaurant's tablet app.", focus: ["lambda", "sns"], edges: ["e5-sns"] },
      { title: "You pay only for those ~120 ms", text: "Billing counts requests and milliseconds of run time. The meter runs only while code runs.", focus: ["bill", "b5-ms"], edges: ["e5-req", "e5-invoke", "e5-ddb", "e5-sns"] },
      { title: "Nobody ordering? ₹0", text: "At 3 AM with no orders, nothing runs and compute costs nothing. That's the end of the journey that began with idle servers in Era 1.", focus: ["b5-idle", "b5-zero"], edges: [] },
    ],
  },
];
