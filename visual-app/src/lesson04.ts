/**
 * Lesson 0.4 · Microservices and Containers: Pack Once, Run Anywhere.
 * Source of truth for both the app and 00-history-and-cloud-evolution/lesson-0.4-microservices-and-containers.md
 * (generated with scripts/gen-lesson-md.ts).
 */
import type { Lesson } from "./lessonTypes";

export const LESSON04: Lesson = {
  id: "0.4",
  module: "00",
  file: "lesson-0.4-microservices-and-containers.md",
  eraIndex: 3,
  shortTitle: "Containers",
  title: "Microservices and Containers: Pack Once, Run Anywhere",
  meta: ["⏱️ 22 min read", "🧪 25 min lab", "💰 $0.00 (an empty ECR repository, plus an optional 20 MB image for a few minutes)"],
  bigIdea:
    "Split one giant app into small services, and ship each one inside a container: a sealed box holding the code plus everything it needs to run (Java, libraries, settings). The same box runs identically on your laptop, a test server and AWS. No more “it works on my machine”.",

  storyHeading: "The story: FoodDash outgrows one big app (2013 to 2016)",
  storyIntro:
    "FoodDash now runs happily on EC2 with Auto Scaling. But the code has grown into one enormous Java application, and 30 developers are tripping over each other. Here's what happened next:",
  storySteps: [
    { icon: "🧱", title: "One big app", text: "Menu, Orders, Payments and Delivery all live in one Java app (a monolith)." },
    { icon: "✂️", title: "Split it up", text: "Each part becomes a small microservice with its own team and its own deploys." },
    { icon: "😩", title: "Works on my machine!", text: "Laptop has Java 17, the server has Java 11. Deploy crashes.", slow: true },
    { icon: "📦", title: "Put it in a container", text: "Code + Java + libraries sealed into one image (Docker, 2013)." },
    { icon: "🗄️", title: "Push to a registry", text: "Store the image in Amazon ECR, AWS's private image shelf." },
    { icon: "🚀", title: "Run anywhere", text: "The same image starts in seconds on a laptop, ECS, EKS or Fargate." },
  ],
  storyOutro: [
    "Splitting the monolith fixed the team problem: the Payments team can release twice a day without waiting for the Menu team. But it multiplied the deployment problem. Ten services, each needing the right Java version, the right libraries and the right settings, on every laptop, test server and production server. Something always differs, and the classic bug report becomes “but it works on my machine!”",
    "Containers solve that by shipping the machine's setup along with the code. A developer writes a short recipe (a Dockerfile), builds it into an image, and pushes the image to a registry. Every environment pulls that exact image, byte for byte. If it worked in testing, it is the same thing that runs in production.",
    "A container is not a VM. All containers on a host share that host's operating system kernel (the core of the OS), and the kernel walls each one off with features called namespaces (what it can see) and cgroups (how much CPU and RAM it may use). No guest OS to boot means containers start in about a second and are tens of megabytes instead of gigabytes. Run the simulator below to see the difference for FoodDash's services.",
  ],
  diagram: `
flowchart LR
    DEV["💻 Developer laptop<br/>Dockerfile + Java code"] -->|"docker build"| IMG["📦 Image<br/>fooddash/menu:1.0"]
    IMG -->|"docker push · HTTPS, port 443"| ECR["🗄️ Amazon ECR repository<br/>123456789012.dkr.ecr.ap-south-1.amazonaws.com/fooddash/menu"]
    ECR -->|"pull · HTTPS, port 443"| RT
    subgraph HOST["🖥️ Container host in ap-south-1 (EC2 or Fargate)"]
        RT["⚙️ Container runtime (containerd)<br/>one shared Linux kernel"]
        C1["📦 menu<br/>port 8080"]
        C2["📦 orders<br/>port 8081"]
        C3["📦 payments<br/>port 8082"]
        RT --> C1
        RT --> C2
        RT --> C3
    end

    style HOST fill:#0f172a,stroke:#34d399,color:#f8fafc
    style ECR fill:#064e3b,stroke:#34d399,color:#f8fafc`,

  glossaryHint: "Filter terms (e.g. image, Dockerfile, ECR, Fargate, port)",
  glossary: [
    { word: "Monolith", alias: "monolithic app", meaning: "One big application where every feature is built, tested and deployed together as a single unit.", foodDash: "Menu, Orders, Payments and Delivery in one Java app: one bug means redeploying everything." },
    { word: "Microservice", alias: "service", meaning: "A small, independent app that does one job and talks to other services over the network, usually through HTTP APIs.", foodDash: "The Payments service is its own app with its own team." },
    { word: "API", alias: "Application Programming Interface, REST API, endpoint", meaning: "A defined way for programs to talk to each other, e.g. sending JSON over HTTP to a URL like /orders.", foodDash: "Orders calls POST /payments on the Payments service." },
    { word: "Container", alias: "Docker container", meaning: "A running, isolated process created from an image. It has its own files, network and process list, but shares the host's kernel.", foodDash: "One running copy of the Menu service." },
    { word: "Image", alias: "container image, Docker image", meaning: "A read-only package with the app and everything it needs (runtime, libraries, config). You start containers from it.", foodDash: "fooddash/menu:1.0 contains Java 17 plus menu-service.jar." },
    { word: "Dockerfile", alias: "build recipe", meaning: "A text file with step-by-step instructions to build an image, e.g. FROM a base image, COPY your files, EXPOSE a port.", foodDash: "Every FoodDash service has a Dockerfile next to its code." },
    { word: "Layer", alias: "image layer", meaning: "Each Dockerfile step creates a layer. Layers are cached and shared, so rebuilding and downloading are fast.", foodDash: "All Java services share the same Java base layer, downloaded once." },
    { word: "Tag", alias: "image tag, version label", meaning: "The label after the colon in an image name, e.g. :1.0. The tag latest is just a default name, not a guarantee of newest.", foodDash: "fooddash/orders:2.3.1 is exactly what's in production." },
    { word: "Registry", alias: "container registry, Docker Hub, ECR", meaning: "A server that stores images so any machine can push (upload) and pull (download) them.", foodDash: "Production pulls images from Amazon ECR." },
    { word: "Docker", alias: "Docker Engine, Docker Desktop", meaning: "The popular tool (from 2013) that builds and runs containers. Docker Desktop on Windows runs them inside a small Linux VM (WSL2).", foodDash: "Developers run all of FoodDash on a laptop with Docker." },
    { word: "Container runtime", alias: "containerd, runc", meaning: "The low-level software on a host that actually starts and stops containers.", foodDash: "On ECS hosts, containerd runs the FoodDash containers." },
    { word: "Kernel", alias: "OS kernel, Linux kernel", meaning: "The core of the operating system that talks to the hardware. All containers on one host share it; each VM has its own.", foodDash: "Ten FoodDash containers, one Linux kernel." },
    { word: "Namespaces and cgroups", alias: "Linux isolation features", meaning: "Namespaces control what a container can see (files, processes, network); cgroups (control groups) limit how much CPU and RAM it can use.", foodDash: "The Menu container can't see the Payments container's files and can't eat all the RAM." },
    { word: "Port mapping", alias: "-p host:container, publish", meaning: "Connecting a port on the host to a port inside the container. -p 8080:80 means host port 8080 forwards to container port 80.", foodDash: "Open http://localhost:8080 to reach the Menu container's port 80." },
    { word: "Orchestrator", alias: "container orchestration", meaning: "Software that decides where containers run, restarts crashed ones, scales them and rolls out new versions.", foodDash: "ECS keeps 3 copies of Orders running at all times." },
    { word: "ECR", alias: "Amazon Elastic Container Registry", meaning: "AWS's private image registry. Repository address: <account-id>.dkr.ecr.<region>.amazonaws.com/<name>.", foodDash: "123456789012.dkr.ecr.ap-south-1.amazonaws.com/fooddash/menu" },
    { word: "ECS", alias: "Amazon Elastic Container Service", meaning: "AWS's own container orchestrator. You describe a service (image, CPU, RAM, how many copies) and ECS runs it.", foodDash: "Runs the Menu, Orders and Payments services." },
    { word: "EKS", alias: "Amazon Elastic Kubernetes Service, Kubernetes, K8s", meaning: "AWS-managed Kubernetes, the open-source orchestrator from Google. More powerful and portable, more to learn.", foodDash: "An option if FoodDash ever needs to run on several clouds." },
    { word: "Fargate", alias: "AWS Fargate, serverless containers", meaning: "Runs your containers without you managing any EC2 servers. You pay per vCPU and GB of RAM per second while each task runs.", foodDash: "No OS patching for the hosts that run FoodDash containers." },
    { word: "OCI", alias: "Open Container Initiative", meaning: "The open standard for image and runtime formats, so images built with Docker run on any compliant runtime.", foodDash: "The same image works in ECS, EKS and on a laptop." },
  ],

  ideasHeading: "How microservices and containers fit together",
  widget: "density",
  ideas: [
    {
      icon: "✂️",
      title: "Monolith vs microservices",
      text: "Microservices aren't free: you trade one big problem (everything is tangled) for many small ones (lots of services talking over a network).",
      table: {
        head: ["", "Monolith", "Microservices"],
        rows: [
          ["Deploy", "Whole app at once", "Each service on its own"],
          ["Scale", "Copy the whole app", "Scale only the busy service (Orders on Diwali)"],
          ["A bug crashes...", "Possibly everything", "Usually just that service"],
          ["Teams", "Everyone in one codebase", "One team per service"],
          ["Hard parts", "Big, slow releases", "Networking, monitoring, data split across services"],
        ],
      },
    },
    {
      icon: "📦",
      title: "VM vs container",
      text: "Both isolate apps. A VM fakes a whole computer with its own OS; a container is an isolated process on a shared kernel.",
      table: {
        head: ["", "Virtual machine (Lesson 0.2)", "Container"],
        rows: [
          ["Contains", "Full guest OS + app", "App + its libraries only"],
          ["Starts in", "Tens of seconds to minutes", "About a second"],
          ["Size", "Gigabytes", "Tens to hundreds of megabytes"],
          ["Isolation", "Very strong (separate kernels)", "Strong, but the kernel is shared"],
          ["Runs on", "A hypervisor", "A container runtime on any Linux host (often itself a VM)"],
        ],
      },
    },
    {
      icon: "🔢",
      title: "Image, container, registry, tag: how they relate",
      text: "Think of a recipe, a cooked dish, a shared fridge and a label. Here's the ECR address broken into parts.",
      table: {
        head: ["Part", "Example", "Meaning"],
        rows: [
          ["Account ID", "123456789012", "Your 12-digit AWS account number"],
          ["Registry host", "dkr.ecr.ap-south-1.amazonaws.com", "ECR's address in the Mumbai Region (HTTPS, port 443)"],
          ["Repository", "fooddash/menu", "The shelf for one service's images"],
          ["Tag", ":1.0", "Which version of the image"],
          ["Repository ARN", "arn:aws:ecr:ap-south-1:123456789012:repository/fooddash/menu", "The repository's full AWS name, used in permissions"],
        ],
      },
    },
    {
      icon: "☸️",
      title: "Who runs containers in AWS",
      text: "Building the image is the easy part; something has to start, restart and scale the containers. AWS gives you a choice of orchestrator and of where the containers run.",
      table: {
        head: ["Service", "What it does", "Pick it when"],
        rows: [
          ["ECS", "AWS's own, simpler orchestrator", "You're all-in on AWS and want the easy path (FoodDash's choice)"],
          ["EKS", "Managed Kubernetes", "You need Kubernetes tools or portability between clouds"],
          ["Fargate", "Runs ECS or EKS containers with no servers to manage", "You don't want to patch or size EC2 hosts"],
          ["EC2 launch type", "Containers run on EC2 instances you manage", "You need special hardware or the lowest price at large scale"],
        ],
      },
    },
    {
      icon: "🧠",
      title: "Why containers start so fast",
      text: "Starting a VM means booting a whole operating system. Starting a container just means the shared kernel starts one more process, with namespaces giving it a private view (its own files, process list and network) and cgroups capping its CPU and RAM. Because nothing boots, the Orders service can go from 3 to 30 copies in seconds when the Diwali rush hits.",
    },
    {
      icon: "⚠️",
      title: "What containers did NOT fix",
      text: "Something still has to run 24 hours a day: containers on EC2 or Fargate are billed while they run, even at 3 AM when nobody orders. You now operate many moving parts (an orchestrator, a registry, service-to-service networking, monitoring). And containers don't patch themselves: when a security hole is found in the base image, you rebuild and redeploy. Lesson 0.5 asks: what if you only paid when an order actually arrived?",
    },
  ],

  labHeading: "Hands-on lab: run, build and ship a FoodDash container",
  lab: {
    goal: "Run your first containers, prove they share one kernel, package a tiny FoodDash menu page into your own image, then create an ECR repository in AWS (and optionally push your image to it).",
    cost: "$0.00. An empty ECR repository costs nothing; ECR storage is $0.10 per GB per month, so an optional 20 MB image kept for a few minutes costs a tiny fraction of a cent. Everything is deleted in Cleanup.",
    where: "Windows PowerShell with Docker Desktop (Steps 1 to 4), and the AWS CLI logged in as your IAM user (Steps 5 and 6).",
    before: [
      "Docker Desktop is installed and running: docker --version prints a version. No Docker? Read Steps 1 to 4 and do Step 5, which needs only the AWS CLI.",
      "aws sts get-caller-identity shows your IAM user, not root.",
      "Keep this PowerShell window open until Cleanup.",
    ],
    steps: [
      {
        title: "Step 1: Meet the container engine",
        code: `docker --version

# Which kind of containers does this engine run?
docker info --format "{{.OSType}}"`,
        output: `Docker version 28.x.x, build xxxxxxx
linux`,
        after: "“linux” even on Windows: Docker Desktop runs a small Linux VM through WSL2 (Lesson 0.2!) and runs your containers inside it, because containers share a Linux kernel. Your version number will differ.",
      },
      {
        title: "Step 2: Run your first container",
        code: `# --rm = delete the container when it exits
docker run --rm hello-world`,
        after: "Docker didn't have the hello-world image, so it pulled it from Docker Hub (a public registry, over HTTPS port 443), created a container, ran it, printed a message and exited. Pull, create, run, exit: the whole container life cycle in about two seconds.",
      },
      {
        title: "Step 3: Run a web server and prove containers share one kernel",
        code: `# -d = run in background, -p 8080:80 = host port 8080 -> container port 80
docker run -d --name fooddash-menu -p 8080:80 nginx:alpine
docker ps

# curl.exe (not the PowerShell alias) fetches the page
curl.exe -s http://localhost:8080 | Select-String "<title>"

# Which Linux does the container think it is?
docker exec fooddash-menu cat /etc/os-release | Select-String "PRETTY_NAME"

# Which kernel is it really using?
docker exec fooddash-menu uname -r`,
        output: `<title>Welcome to nginx!</title>
PRETTY_NAME="Alpine Linux v3.xx"
6.6.87.2-microsoft-standard-WSL2`,
        after: "The container believes it's Alpine Linux (its own files and libraries), yet uname -r shows the WSL2 kernel: the same kernel every container on this machine shares. No guest OS booted, which is why it started instantly. Open http://localhost:8080 in your browser too: the request goes to host port 8080, Docker forwards it to port 80 inside the container. Your exact versions will differ.",
      },
      {
        title: "Step 4: Package FoodDash's menu as your own image",
        code: `mkdir fooddash-menu-lab; cd fooddash-menu-lab

# The app: one tiny web page
'<h1>FoodDash Menu v1</h1><p>Masala Dosa: Rs 120</p>' | Set-Content -Encoding ascii index.html

# The recipe: start from nginx, copy our page in, document port 80
@"
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
"@ | Set-Content -Encoding ascii Dockerfile

# Build the image and give it a name:tag
docker build -t fooddash/menu:1.0 .

# Run it on a different host port (8080 is taken by Step 3)
docker run -d --name menu-v1 -p 8081:80 fooddash/menu:1.0
curl.exe -s http://localhost:8081
docker images fooddash/menu`,
        output: `<h1>FoodDash Menu v1</h1><p>Masala Dosa: Rs 120</p>
REPOSITORY      TAG   IMAGE ID       CREATED          SIZE
fooddash/menu   1.0   3f2a9c1d7e55   10 seconds ago   ~50MB`,
        after: "FROM picked a base image, COPY added your app as a new layer, EXPOSE documented the port. That image now contains everything the page needs, and it will behave identically on any machine with a container runtime. That's the end of “works on my machine”. (Image ID, time and size will differ.)",
      },
      {
        title: "Step 5: Create a private image shelf in AWS (ECR)",
        code: `aws ecr create-repository \`
  --repository-name fooddash/menu-lab \`
  --region ap-south-1 \`
  --image-scanning-configuration scanOnPush=true \`
  --query "repository.[repositoryArn,repositoryUri]" \`
  --output text`,
        output: `arn:aws:ecr:ap-south-1:123456789012:repository/fooddash/menu-lab   123456789012.dkr.ecr.ap-south-1.amazonaws.com/fooddash/menu-lab`,
        after: "Two names for the same repository. The ARN (arn : aws : ecr service : ap-south-1 Region : your account ID : repository/name) is what permissions refer to. The URI is the address Docker pushes to and pulls from, over HTTPS port 443. scanOnPush=true tells ECR to check every pushed image for known security holes. Your 12-digit account ID replaces 123456789012.",
      },
      {
        title: "Step 6 (optional, needs Docker): Push your image to ECR",
        code: `$acct     = aws sts get-caller-identity --query Account --output text
$registry = "$acct.dkr.ecr.ap-south-1.amazonaws.com"
$repo     = "$registry/fooddash/menu-lab"

# Log Docker in to ECR with a temporary token (valid 12 hours); the token never appears on screen
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $registry

# Give the image its ECR name, then upload it
docker tag fooddash/menu:1.0 "\${repo}:1.0"
docker push "\${repo}:1.0"

# See it in AWS
aws ecr list-images --repository-name fooddash/menu-lab --region ap-south-1`,
        output: `Login Succeeded
...
1.0: digest: sha256:... size: ...
{
    "imageIds": [
        {
            "imageDigest": "sha256:...",
            "imageTag": "1.0"
        }
    ]
}`,
        after: "Your image now lives in your AWS account. Any ECS task, EKS pod or Fargate task in ap-south-1 that is allowed to read this repository can pull and run exactly what you built on your laptop. Open ECR in the Console to see the image and its scan result. ${repo} with braces is needed because the colon right after the variable name would otherwise confuse PowerShell.",
      },
    ],
  },

  whatIfs: [
    { q: "...the Payments container crashes at 8 PM on a Saturday?", a: "With microservices, only Payments is down: customers can still browse menus and fill carts. The orchestrator (ECS) notices the container stopped and starts a fresh one from the same image within seconds. In the old monolith, the same bug could have taken the whole app down. Orders placed during those seconds need retries, which you'll design in Tier 2." },
    { q: "...you deploy menu:latest and the new version is broken?", a: "latest is just a label that moves, so you can't be sure which build is running or which one to go back to. Use version tags (1.0, 1.1) and turn on ECR tag immutability so a tag can never be overwritten. Rolling back is then simply “run 1.0 again”, and it's byte-for-byte the image that worked before." },
    { q: "...two containers both ask for host port 8080?", a: "The second one fails with “port is already allocated”: only one process can listen on a host port. That's why Step 4 used -p 8081:80. Inside, both containers can happily use port 80, because each has its own network namespace. In AWS, a load balancer and ECS's dynamic port mapping handle this for you." },
    { q: "...a security hole is announced in the nginx base image?", a: "Your running containers don't patch themselves. ECR's scan (scanOnPush) flags the image, you rebuild it FROM the fixed base image, push a new tag and redeploy. Also remember containers share the host's kernel: a kernel bug could affect every container on that host. Fargate gives each task its own isolation boundary that doesn't share a kernel with other customers' tasks." },
    { q: "...a container is deleted? What happens to files written inside it?", a: "They're gone. A container's writable layer lives and dies with the container. That's by design: containers should be disposable. Anything that must survive (orders, payments, uploaded photos) goes outside the container: a database, S3 or a mounted volume. You'll see this in Tier 3." },
  ],

  cleanup: [
    "Delete the ECR repository and any images in it: aws ecr delete-repository --repository-name fooddash/menu-lab --region ap-south-1 --force",
    "Stop and remove both containers: docker rm -f fooddash-menu menu-v1",
    "Remove the images: docker rmi fooddash/menu:1.0 nginx:alpine hello-world (and \"${repo}:1.0\" if you did Step 6)",
    "If you did Step 6, log Docker out of ECR: docker logout $registry",
    "Delete the lab folder: cd ..; Remove-Item -Recurse fooddash-menu-lab",
    "Check: aws ecr describe-repositories --region ap-south-1 no longer lists fooddash/menu-lab, and docker ps -a shows neither container.",
    "Habit check: AWS Console → Billing and Cost Management → Bills shows $0.00 for this month.",
  ],
  cleanupDone: "✅ Done. Repository, containers and images deleted, bill: $0.00.",

  takeaways: [
    "Microservices split one big app into small services that deploy and scale independently, at the cost of more moving parts.",
    "A container packs an app with everything it needs; an image is the sealed package, a registry (ECR) stores it, a tag names the version.",
    "Containers share the host's kernel (isolated by namespaces and cgroups), so they start in about a second and are far smaller than VMs.",
    "In AWS, ECS or EKS orchestrate containers, and they run on EC2 hosts you manage or on Fargate with no servers to manage.",
    "Still unsolved: containers bill while they run, even when nobody orders. Next: “What if your code ran only when an order arrived?”",
  ],
  next: "Lesson 0.5: Serverless and event-driven",
};
