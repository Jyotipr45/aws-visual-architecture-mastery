/**
 * Lesson 0.2 · Virtualization: One Server Becomes Many.
 * Source of truth for both the app and 00-history-and-cloud-evolution/lesson-0.2-virtualization-and-hypervisors.md
 * (generated with scripts/gen-lesson-md.ts).
 */
import type { Lesson } from "./lessonTypes";

export const LESSON02: Lesson = {
  id: "0.2",
  module: "00",
  file: "lesson-0.2-virtualization-and-hypervisors.md",
  eraIndex: 1,
  shortTitle: "Virtualization",
  title: "Virtualization: One Server Becomes Many",
  meta: ["⏱️ 18 min read", "🧪 15 min lab", "💰 $0.00 (read-only commands, nothing is created)"],
  bigIdea:
    "A thin layer of software called a hypervisor lets one physical computer pretend to be many separate computers (virtual machines). Same hardware, many apps, still kept apart. Every EC2 server you will ever launch in AWS is one of these virtual machines.",

  storyHeading: "The story: FoodDash's 12 lonely servers (2005)",
  storyIntro:
    "It's 2005. FoodDash survived Lesson 0.1 and grew. You now own 12 bare-metal servers, one app on each, because that was the safe rule. Your finance team looks at the bills and the CPU graphs, and asks a fair question:",
  storySteps: [
    { icon: "🖥️", title: "12 servers", text: "One app on each, every box about 10 to 15% busy." },
    { icon: "🧾", title: "The bill hurts", text: "Power, cooling, space and repairs for 12 machines, 24 hours a day.", slow: true },
    { icon: "💡", title: "The big idea", text: "What if one box could pretend to be many computers?" },
    { icon: "🧩", title: "Install a hypervisor", text: "Software that splits one server into many virtual machines (VMs)." },
    { icon: "📦", title: "Move apps into VMs", text: "Each app gets its own VM with its own OS (P2V: physical to virtual)." },
    { icon: "✅", title: "Switch off 9 boxes", text: "3 hosts now run all 12 VMs at about 50 to 70% busy." },
  ],
  storyOutro: [
    "Nothing about the apps changed. Orders still runs on Linux, Payments still runs on its own Linux, Menu still runs on Windows. Each one still believes it has a whole computer to itself. The difference is that three real machines are now doing the work of twelve.",
    "The magic is the hypervisor. It sits between the hardware and the operating systems, hands out slices of CPU (Central Processing Unit) time, RAM (Random Access Memory), disk and network to each VM, and makes sure no VM can see or touch another VM's memory. A crash inside the Payments VM stays inside the Payments VM, exactly like when it had its own box.",
    "Hold on to this picture, because it is literally how AWS works. When Amazon launched EC2 (Elastic Compute Cloud) in 2006, it was a giant pool of physical hosts running a hypervisor (Xen at first, AWS's own Nitro system today), renting out VMs by the hour. In AWS a VM is called an instance.",
  ],
  diagram: `
flowchart TB
    subgraph HOST["🖥️ ONE physical server: the host"]
        direction TB
        subgraph VMS["Virtual machines: the guests"]
            direction LR
            VM1["🧩 VM 1<br/>Guest OS: Linux<br/>Orders app"]
            VM2["🧩 VM 2<br/>Guest OS: Linux<br/>Payments app"]
            VM3["🧩 VM 3<br/>Guest OS: Windows<br/>Menu app"]
        end
        HV["Hypervisor (Type 1)<br/>hands out CPU time, RAM, disk, network<br/>and keeps the VMs apart"]
        HW["⚙️ Real hardware: CPU · RAM · Disk · NIC (network card)"]
        VMS --> HV --> HW
    end

    style HOST fill:#0f172a,stroke:#38bdf8,color:#f8fafc
    style VMS fill:#0c4a6e,stroke:#38bdf8,color:#f8fafc
    style HV fill:#1e293b,stroke:#facc15,color:#f8fafc
    style HW fill:#1e293b,stroke:#94a3b8,color:#f8fafc`,

  glossaryHint: "Filter terms (e.g. VM, hypervisor, vCPU, AMI)",
  glossary: [
    { word: "Virtualization", alias: "virtualisation, server virtualization", meaning: "Using software to make one physical computer behave like several separate computers.", foodDash: "Orders, Payments and Menu share one box but still behave as if each had its own." },
    { word: "VM", alias: "Virtual Machine, guest, instance (in AWS)", meaning: "A pretend computer made of software. It has its own (virtual) CPU, RAM, disk and network card, and runs its own operating system.", foodDash: "The Orders app now lives in a VM instead of on a physical box." },
    { word: "Host", alias: "physical host, hypervisor host, node", meaning: "The real, physical server that runs the hypervisor and the VMs on top of it.", foodDash: "3 hosts now replace 12 old servers." },
    { word: "Guest OS", alias: "guest operating system", meaning: "The operating system installed inside a VM. Each VM has its own, and they can be different (Linux in one, Windows in another).", foodDash: "Payments' Linux and Menu's Windows run side by side on one host." },
    { word: "Hypervisor", alias: "VMM, Virtual Machine Monitor", meaning: "The software layer that creates VMs, shares the hardware between them, and keeps them isolated from each other.", foodDash: "The referee that makes sure the Menu VM can't read the Payments VM's memory." },
    { word: "Type 1 hypervisor", alias: "bare-metal hypervisor, native hypervisor", meaning: "Installed directly on the hardware, with no normal OS underneath. Fast and used in data centers. Examples: VMware ESXi, Microsoft Hyper-V, Xen, KVM (Kernel-based Virtual Machine).", foodDash: "What you install on the 3 production hosts." },
    { word: "Type 2 hypervisor", alias: "hosted hypervisor", meaning: "Runs as an ordinary app on top of a normal OS like Windows or macOS. Slower, but easy for laptops. Examples: Oracle VirtualBox, VMware Workstation.", foodDash: "What a developer uses to test FoodDash on a laptop." },
    { word: "vCPU", alias: "virtual CPU", meaning: "A slice of a physical CPU given to a VM. In AWS, one vCPU is usually one thread of a physical core (a core with hyper-threading runs 2 threads).", foodDash: "A t3.micro gives the Orders VM 2 vCPUs." },
    { word: "Isolation", alias: "sandboxing", meaning: "Keeping VMs separated so a crash, a virus or a memory leak in one cannot affect the others.", foodDash: "A bug in Menu can't crash Payments." },
    { word: "Consolidation", alias: "server consolidation", meaning: "Moving many lightly used physical servers onto fewer, busier hosts.", foodDash: "12 boxes at 12% become 3 hosts at about 58%." },
    { word: "Overcommit", alias: "oversubscription", meaning: "Handing out more virtual CPUs or RAM than the host physically has, betting that not every VM is busy at the same moment.", foodDash: "Fine at 3 AM, risky on Diwali night." },
    { word: "Noisy neighbour", alias: "noisy neighbor", meaning: "One VM using so much of the shared host that other VMs on the same host slow down.", foodDash: "A heavy sales report VM slows down live orders." },
    { word: "Snapshot", alias: "checkpoint", meaning: "A saved copy of a VM's disk (and sometimes memory) at one moment, so you can roll back.", foodDash: "Take one before a risky upgrade of the Payments VM." },
    { word: "Template", alias: "golden image, AMI (Amazon Machine Image) in AWS", meaning: "A ready-made VM disk with the OS and software already installed, used to create new identical VMs in minutes.", foodDash: "Every new Orders VM starts from the same tested template." },
    { word: "Live migration", alias: "vMotion (VMware's name)", meaning: "Moving a running VM from one host to another without switching it off.", foodDash: "Repair a host at noon while customers keep ordering." },
    { word: "P2V", alias: "Physical to Virtual", meaning: "Converting an app that ran on a physical server into a VM.", foodDash: "How the old Menu server became the Menu VM." },
    { word: "VT-x / AMD-V", alias: "hardware-assisted virtualization", meaning: "Special CPU features from Intel (VT-x) and AMD (AMD-V) that make hypervisors fast. Usually switched on in BIOS / UEFI (the firmware settings).", foodDash: "Without them, VMs would be painfully slow." },
    { word: "Nitro", alias: "AWS Nitro System", meaning: "AWS's own hypervisor plus custom hardware cards that do networking and storage work, so almost all of the host's power goes to your instances.", foodDash: "The layer under every modern FoodDash EC2 instance." },
  ],

  ideasHeading: "How virtualization works, and what it fixed",
  widget: "consolidation",
  ideas: [
    {
      icon: "🧠",
      title: "How one machine is shared",
      text: "The hypervisor gives each VM its own slice of every resource and makes each VM believe the slice is a whole computer.",
      table: {
        head: ["Real hardware", "What the hypervisor does", "What each VM sees"],
        rows: [
          ["CPU cores", "Gives each VM turns on the cores, many times per second (time-slicing)", "Its own vCPUs"],
          ["RAM", "Reserves a separate block of memory per VM, walled off from the others", "Its own RAM"],
          ["Disk", "Stores each VM's disk as a big file or volume", "Its own hard disk"],
          ["Network card (NIC)", "Runs a virtual switch and gives each VM a virtual NIC with its own IP address", "Its own network card"],
        ],
      },
    },
    {
      icon: "🥊",
      title: "Type 1 vs Type 2 hypervisors",
      text: "Both create VMs. The difference is what sits underneath them.",
      table: {
        head: ["", "Type 1 (bare-metal)", "Type 2 (hosted)"],
        rows: [
          ["Runs on", "Directly on the hardware", "On top of Windows / macOS / Linux, like an app"],
          ["Speed", "Fast, very little overhead", "Slower, two layers of OS"],
          ["Used for", "Data centers and clouds", "Laptops, testing, learning"],
          ["Examples", "VMware ESXi, Hyper-V, Xen, KVM, AWS Nitro", "VirtualBox, VMware Workstation"],
        ],
      },
    },
    {
      icon: "✅",
      title: "What got better",
      text: "Utilization jumped from about 10 to 15% to about 50 to 70%, so you buy, power and cool far fewer boxes. Apps stay isolated, just like the one-app-per-server rule wanted. A new server takes minutes (clone a template) instead of weeks, as long as your hosts have spare room. Snapshots make risky changes reversible, and live migration lets you repair hardware without downtime.",
    },
    {
      icon: "⚠️",
      title: "What it did NOT fix",
      text: "You still buy the hosts upfront (CapEx), so you still guess how many you'll need: capacity planning just moved from servers to hosts. You still run your own data center. And new problems appeared: one host failure now takes down many VMs at once, hypervisor licences cost money, and VMs multiply out of control because they're so easy to create (VM sprawl). Lesson 0.3 removes the hosts from your life entirely.",
    },
    {
      icon: "🔗",
      title: "How this became AWS EC2",
      text: "Amazon had huge data centers full of virtualized hosts. In 2006 it started renting VMs from that pool to everyone: that's EC2 (Elastic Compute Cloud). The words map one to one, and you'll use them every day.",
      table: {
        head: ["Virtualization word", "AWS word", "Example"],
        rows: [
          ["VM (virtual machine)", "EC2 instance", "Your Orders server"],
          ["VM size (vCPUs + RAM)", "Instance type", "t3.micro = 2 vCPUs, 1 GiB RAM"],
          ["Template / golden image", "AMI (Amazon Machine Image)", "Amazon Linux 2023 AMI"],
          ["Hypervisor", "Nitro (older types: Xen)", "Hidden from you, managed by AWS"],
          ["Physical server, no hypervisor", "Bare-metal instance (*.metal)", "m5.metal"],
        ],
      },
    },
  ],

  labHeading: "Hands-on lab: find the hypervisors on your laptop and inside AWS",
  lab: {
    goal: "Check whether your own CPU can run VMs, meet a real VM already on Windows (WSL2), then ask AWS which hypervisor runs its instances.",
    cost: "$0.00. Every AWS command here is a read-only “describe” call: free, and nothing is created.",
    where: "Windows PowerShell, plus the AWS CLI (Command Line Interface) logged in as your IAM user.",
    before: [
      "AWS CLI v2 is installed: aws --version prints aws-cli/2.x.",
      "aws sts get-caller-identity shows your IAM user ARN (arn:aws:iam::<account-id>:user/...), not :root.",
    ],
    steps: [
      {
        title: "Step 1: Can your CPU run virtual machines?",
        code: `# VirtualizationFirmwareEnabled = True means Intel VT-x / AMD-V is switched on in BIOS/UEFI
# SecondLevelAddressTranslationExtensions = True means the CPU can translate VM memory in hardware (fast VMs)
Get-CimInstance Win32_Processor | Select-Object Name, VirtualizationFirmwareEnabled, SecondLevelAddressTranslationExtensions

# Is a hypervisor already running underneath Windows right now?
(Get-CimInstance Win32_ComputerSystem).HypervisorPresent`,
        after: "Surprise: if HypervisorPresent is True, Windows itself is already running on top of Microsoft's Hyper-V hypervisor (it switches on for WSL2, Docker Desktop or Windows security features). In that case VirtualizationFirmwareEnabled can show False, because the hypervisor has taken the feature for itself and hides it from Windows. Your laptop is already a host, and your Windows is a special guest.",
      },
      {
        title: "Step 2: Meet a real VM on your laptop (WSL2)",
        code: `# WSL2 (Windows Subsystem for Linux, version 2) runs a real Linux kernel inside a lightweight Hyper-V VM
wsl --status
wsl -l -v

# Ask the Linux guest which kernel it runs
wsl uname -r`,
        output: `5.15.167.4-microsoft-standard-WSL2`,
        after: "The kernel name ends with microsoft-standard-WSL2: a Linux guest OS running in a VM next to your Windows, on the same hardware. That's virtualization on your own desk. If WSL isn't installed, just read along: installing it needs admin rights and a restart, and you don't need it for this course yet. (Your kernel version number will differ.)",
      },
      {
        title: "Step 3: Ask AWS which hypervisor runs its instances",
        code: `aws ec2 describe-instance-types \`
  --instance-types t2.micro t3.micro m5.large \`
  --query "InstanceTypes[].{Type:InstanceType,vCPUs:VCpuInfo.DefaultVCpus,MemoryMiB:MemoryInfo.SizeInMiB,Hypervisor:Hypervisor,BareMetal:BareMetal}" \`
  --output table`,
        output: `---------------------------------------------------------------
|                    DescribeInstanceTypes                    |
+-----------+-------------+------------+------------+---------+
| BareMetal | Hypervisor  | MemoryMiB  |   Type     | vCPUs   |
+-----------+-------------+------------+------------+---------+
|  False    |  xen        |  1024      |  t2.micro  |  1      |
|  False    |  nitro      |  1024      |  t3.micro  |  2      |
|  False    |  nitro      |  8192      |  m5.large  |  2      |
+-----------+-------------+------------+------------+---------+`,
        after: "Read it like this: each row is a VM size you can rent. Older types like t2 run on the Xen hypervisor; newer ones run on Nitro, AWS's own hypervisor. MemoryMiB is RAM in mebibytes (1024 MiB = 1 GiB). The backtick character (the key left of 1) at the end of a line tells PowerShell the command continues on the next line. Row order may differ, and the region is the default one you set in aws configure.",
      },
      {
        title: "Step 4: AWS still rents whole physical servers",
        code: `# Instance types with NO hypervisor: you get the entire physical machine
aws ec2 describe-instance-types \`
  --filters Name=bare-metal,Values=true \`
  --query "InstanceTypes[0:5].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]" \`
  --output table`,
        after: "You'll see names ending in .metal (like m5.metal or c5.metal) with huge vCPU and RAM numbers: that's one whole host. People rent these for software licensed per physical CPU, for special performance needs, or to run their own hypervisor. So bare metal from Lesson 0.1 never died; it just became rentable.",
      },
      {
        title: "Step 5: Do FoodDash's consolidation math",
        code: `$apps       = 12   # old bare-metal servers, one app each
$appCpu     = 12   # % CPU each app really uses
$target     = 70   # % CPU we're happy to run a host at
$hvOverhead = 10   # % CPU the hypervisor itself uses

$hosts = [math]::Ceiling(($apps * $appCpu) / ($target - $hvOverhead))

"Hosts needed         : $hosts"
"Servers switched off : $($apps - $hosts)"
"Host CPU now         : $([math]::Round(($apps * $appCpu) / $hosts + $hvOverhead)) %"`,
        output: `Hosts needed         : 3
Servers switched off : 9
Host CPU now         : 58 %`,
        after: "Twelve boxes become three. Change $appCpu to 30 and run it again: busier apps need more hosts, so consolidation saves less. The simulator above lets you drag the same numbers.",
      },
    ],
  },

  whatIfs: [
    { q: "...the host running 6 of FoodDash's VMs has a motherboard failure?", a: "All 6 VMs go down at the same moment. Consolidation saves money, but it puts more eggs in one basket (a bigger “blast radius”). That's why real setups run a cluster of hosts with high availability (HA): the VMs are restarted on a healthy host within minutes. In AWS you'll spread instances across Availability Zones (separate data centers) so one failure never stops FoodDash." },
    { q: "...a badly written sales-report VM uses 100% of its CPU all day?", a: "It can only use the vCPUs it was given, so it can't steal another VM's memory or crash it. But if the host was overcommitted, the other VMs wait longer for their turn on the real cores and everything feels slow: the noisy-neighbour problem. Fixes: CPU limits per VM, moving the heavy VM to another host, or (in AWS) choosing the right instance type." },
    { q: "...you hand out 32 vCPUs on a host that only has 16 hardware threads?", a: "That's overcommit, and it usually works, because most VMs are mostly idle. The day they all get busy together (Diwali!), each VM waits for its turn and response times jump. You haven't escaped capacity planning; you've moved it from servers to hosts." },
    { q: "...a developer needs a fresh test server today?", a: "If a host has spare room: clone the template VM and they have a server in minutes. If every host is full, you're back to Lesson 0.1: order a new host and wait weeks. The cloud's answer is a pool of hosts so large that, from your point of view, it is never full." },
  ],

  cleanup: [
    "Nothing was created in AWS: describe-instance-types only reads information, and read calls are free.",
    "If you started WSL just for this lab, stop its VM to free RAM: wsl --shutdown",
    "Habit check: AWS Console → Billing and Cost Management → Bills shows $0.00 for this month.",
  ],
  cleanupDone: "✅ Done. Nothing was created, bill: $0.00.",

  takeaways: [
    "A hypervisor splits one physical host into many isolated virtual machines (VMs), each with its own guest OS.",
    "Type 1 hypervisors run directly on hardware (data centers, AWS Nitro); Type 2 run as an app on your laptop (VirtualBox).",
    "Virtualization raised utilization from about 10 to 15% to about 50 to 70% and made new servers a matter of minutes.",
    "It did not remove buying hardware, capacity planning or running a data center; it moved those problems to the hosts.",
    "An EC2 instance is a VM on AWS's hosts: instance type = VM size, AMI = template. Next: “What if you didn't have to own the hosts at all?”",
  ],
  next: "Lesson 0.3: Cloud computing and elastic scaling",
};
