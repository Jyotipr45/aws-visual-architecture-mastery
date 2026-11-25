/**
 * Lesson 0.1 · Life Before the Cloud: Bare-Metal Servers.
 * Full content, mirrored from 00-history-and-cloud-evolution/lesson-0.1-bare-metal-servers.md.
 */

export const LESSON01 = {
  id: "0.1",
  title: "Life Before the Cloud: Bare-Metal Servers",
  meta: ["⏱️ 15 min read", "🧪 10 min lab", "💰 $0.00 (this lab creates nothing in AWS)"],
  bigIdea:
    "Before AWS, running an app meant buying and babysitting physical computers. Every AWS service you will learn later exists to remove one of the pains you'll see here.",

  storyIntro: "Imagine it's 2003 and you want to launch FoodDash. There's no AWS yet. Here's what you have to do:",
  storySteps: [
    { icon: "💡", title: "Idea", text: "Launch FoodDash." },
    { icon: "🧮", title: "Guess traffic", text: "Predict how many orders you'll get for the next 3 years." },
    { icon: "💰", title: "Budget approval", text: "Convince someone to pay for servers before you've earned a rupee." },
    { icon: "📦", title: "Order servers", text: "Wait 4 to 8 weeks for delivery.", slow: true },
    { icon: "🏢", title: "Rent space", text: "Find a room with power, cooling and security." },
    { icon: "🔧", title: "Rack & install", text: "Bolt servers into racks, plug in cables, install the OS." },
    { icon: "🚀", title: "Finally launch", text: "3 to 6 months after the idea." },
  ],
  storyOutro: [
    "Three to six months pass before a single customer can order a samosa. And you decided how many servers to buy on day one, before you knew how popular FoodDash would be.",
    "Then you follow the golden rule of that era: one app per server. Orders, Payments and Menu each get their own machine, so a crash in one can't take down the others.",
    "Look at the CPU numbers in the timeline: 12%, 8% and 15%. You paid for 100% of three machines and you're using about 12% of each. The rest is paid for, powered, cooled... and idle.",
  ],

  glossary: [
    { word: "Server", alias: "box, machine, host", meaning: "A computer whose job is to answer requests from other computers (a “client” asks, the “server” serves).", foodDash: "It's where the FoodDash order code runs." },
    { word: "Bare-metal", alias: "physical server, dedicated server", meaning: "Your software runs directly on the real hardware, with no layer in between. “Metal” = the physical machine.", foodDash: "Simple, but one machine can only safely run one app." },
    { word: "On-premises", alias: "on-prem", meaning: "The servers sit in a building you own or rent, not in someone else's data center.", foodDash: "You are responsible for everything: the room, power, cooling, security." },
    { word: "Data center", alias: "DC, server room", meaning: "A building (or room) designed to hold many servers, with strong power, cooling and network connections.", foodDash: "AWS today owns huge ones; in 2003 you built your own small one." },
    { word: "Rack", alias: "server rack, cabinet", meaning: "A tall metal frame that holds servers stacked like drawers. Server height is measured in U (1U = 1.75 inches).", foodDash: "A “2U server” takes two slots in the rack." },
    { word: "CPU", alias: "Central Processing Unit, processor", meaning: "The computer's brain: it runs your code's instructions.", foodDash: "More CPU = more orders handled per second." },
    { word: "RAM", alias: "Random Access Memory, memory", meaning: "Super-fast short-term memory. Cleared when the power goes off.", foodDash: "Your running Java app and its data live here." },
    { word: "Disk", alias: "storage, HDD / SSD", meaning: "Slow but permanent memory. Survives power-off.", foodDash: "The operating system, app files and database live here." },
    { word: "OS", alias: "Operating System", meaning: "The base software that controls the hardware, like Linux or Windows.", foodDash: "Your Spring Boot app runs on top of it." },
    { word: "Utilization", alias: "CPU %, usage", meaning: "How much of a resource is actually busy.", foodDash: "Low utilization = money wasted on idle hardware." },
    { word: "Provisioning", alias: "spinning up, setting up", meaning: "Getting a new server ready to use.", foodDash: "On-prem: months. In AWS: about a minute." },
    { word: "Lead time", alias: "provisioning time", meaning: "Time from “we need a server” to “it's serving customers”.", foodDash: "Long lead time means you must guess traffic in advance." },
    { word: "Capacity planning", alias: "sizing", meaning: "Guessing how much hardware you'll need in the future.", foodDash: "Guess too low: crash. Guess too high: waste." },
    { word: "CapEx", alias: "Capital Expenditure, upfront cost", meaning: "Money spent upfront to buy something you own.", foodDash: "Buying servers is CapEx: you pay before earning anything." },
    { word: "OpEx", alias: "Operating Expenditure, running cost", meaning: "Money paid regularly for what you use, like rent or electricity.", foodDash: "The cloud turns servers into OpEx: pay per second." },
    { word: "Depreciation", alias: "write-down", meaning: "Hardware loses value every year and needs replacing every 3 to 5 years.", foodDash: "You'll buy all those servers again in a few years." },
    { word: "SPOF", alias: "Single Point Of Failure", meaning: "One part whose failure breaks the whole system.", foodDash: "If Server 2 dies, nobody can pay." },
  ],

  pains: [
    { icon: "😫", title: "Pain 1: It's slow", text: "Need a 4th server because FoodDash is growing? Order it, wait weeks for delivery, rack it, cable it, install the OS. Your competitor, meanwhile, has already launched." },
    { icon: "💸", title: "Pain 2: It's expensive, even when idle", text: "You pay for the hardware upfront (CapEx), then pay for electricity, cooling and space 24 hours a day, even at 3 AM when nobody is ordering food." },
    { icon: "🎲", title: "Pain 3: Capacity planning is a guessing game", text: "Say one server handles 100 orders per minute. A normal weekday needs 1 server (100 orders/min). The Diwali sale needs 10 (1,000 orders/min). Buy 1 and the site crashes on Diwali, orders are lost and customers complain on social media. Buy 10 and 9 sit idle the other 360 days at about 10% average utilization. There's no right answer, because the hardware can't grow and shrink. Hold on to this: in Lesson 0.3 AWS Auto Scaling makes this problem disappear." },
  ],

  lab: {
    goal: "See the same CPU, RAM, disk and utilization numbers a 2003 sysadmin (system administrator) would have watched, on the computer in front of you.",
    cost: "$0.00. Nothing is created in AWS.",
    where: "Windows PowerShell (no admin rights needed).",
    steps: [
      {
        title: "Step 1: Inspect your “server's” hardware",
        code: `# CPU: the brain. Cores = physical brains, logical processors = threads it can run at once
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors

# RAM: short-term memory, shown in GB
Get-CimInstance Win32_ComputerSystem | Select-Object @{n='RAM_GB'; e={[math]::Round($_.TotalPhysicalMemory / 1GB, 1)}}

# Disk: long-term storage on drive C:
Get-PSDrive C | Select-Object @{n='Used_GB'; e={[math]::Round($_.Used / 1GB)}}, @{n='Free_GB'; e={[math]::Round($_.Free / 1GB)}}`,
        after: "What you just did: asked Windows (the OS) to describe the bare-metal hardware it runs on. In the cloud, you'll pick these same three numbers from a menu instead of buying them.",
      },
      {
        title: "Step 2: Measure utilization, the number that started the cloud revolution",
        code: `# Sample total CPU usage once per second, 5 times
Get-Counter '\\Processor(_Total)\\% Processor Time' -SampleInterval 1 -MaxSamples 5`,
        after: "You'll most likely see single-digit or low double-digit numbers. That's the point: most computers sit mostly idle most of the time. Multiply that by thousands of company servers worldwide, and you can see why someone eventually asked, “Why not share all this idle hardware?” Tip: if your Windows isn't in English, that counter name may differ. Open Task Manager → Performance → CPU and watch the “Utilization” number instead.",
      },
      {
        title: "Step 3: Do the FoodDash capacity-planning math",
        code: `$ordersNormal    = 100    # orders per minute on a normal day
$ordersPeak      = 1000   # orders per minute during the Diwali sale
$ordersPerServer = 100    # what one server can handle

$serversToBuy = [math]::Ceiling($ordersPeak / $ordersPerServer)
$avgUtil      = [math]::Round(($ordersNormal / ($serversToBuy * $ordersPerServer)) * 100)

"Servers to buy for the peak : $serversToBuy"
"Average utilization         : $avgUtil %"
"Hardware idle on normal days: $(100 - $avgUtil) %"`,
        output: `Servers to buy for the peak : 10
Average utilization         : 10 %
Hardware idle on normal days: 90 %`,
        after: "Try it: change $ordersPeak to 5000 (a viral cricket-final promotion) and run it again. Then picture yourself asking your boss to approve buying 50 servers that will be about 98% idle most of the year. You can also play with the calculator above.",
      },
    ],
  },

  whatIfs: [
    { q: "...the Diwali sale brings 10x traffic, but you only bought servers for normal days?", a: "The single Orders server hits 100% CPU, requests queue up, and then time out. Customers see errors and order from a competitor. You can't fix it that day, because buying a new server takes weeks (lead time). That's the core pain the cloud's elastic scaling solves (Lesson 0.3)." },
    { q: "...Server 2's power supply dies at 2 AM?", a: "Payments goes down completely, because Server 2 was a single point of failure (SPOF). Someone has to drive to the server room with a spare part. Until then, nobody can pay. In AWS you'll learn to run copies across separate data centers (Availability Zones) so one failure doesn't stop the business." },
    { q: "...you bought 10 servers, and FoodDash shuts down after 3 months?", a: "The money is already spent (CapEx). You're stuck with 10 servers you can only resell at a big loss. In the cloud, you'd simply delete everything and stop paying the same minute. That freedom to experiment cheaply is a big reason startups love AWS." },
    { q: "...the server room's air-conditioning breaks on a hot day?", a: "Servers overheat and either slow down to protect themselves or shut off. Cooling, power and backup generators are invisible costs of on-premises. AWS handles all of this in its data centers, and that's part of what you're paying for." },
  ],

  cleanup: [
    "This lab created nothing in AWS, so there's nothing to delete. Get-Counter stopped by itself after 5 samples.",
    "Still build the habit now, because it will matter in later labs: open the AWS Console → Billing and Cost Management → Bills.",
    "Confirm the current month shows $0.00.",
  ],

  takeaways: [
    "Bare-metal on-premises = you buy, house, power, cool and fix physical servers yourself.",
    "The rule of one app per server kept apps safe from each other, but left machines 85 to 95% idle.",
    "Lead time of months forced capacity planning: a guessing game you always lose in one direction.",
    "Servers were CapEx: paid upfront, losing value, even if the business failed.",
    "Every later era is an answer to these pains. Next up: “What if one physical server could pretend to be many?”",
  ],
};
