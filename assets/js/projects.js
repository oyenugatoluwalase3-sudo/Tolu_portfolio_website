/* ================================================================
   PROJECTS DATA — assets/js/projects.js
   This is the ONLY file you edit to add or change projects.
   main.js reads it and builds the cards, filters and stats.

   TO ADD A PROJECT (or a new challenge day):
   1. Copy any object in `portfolioProjects`, paste it at the end.
   2. Change the fields. Keep a comma between objects.
   3. Save, commit, refresh.

   FIELDS
   id            "04" or "Day 05" (shown on the card)
   tool          label next to the id, e.g. "Power BI", "SQL + Power BI"
   status        "Completed" | "In Progress"
   title         project title
   description   1-2 sentences
   tags          pills. The filter bar matches on these ("Power BI",
                 "SQL", "Python") so keep the spelling.
   findingsLabel heading above the bullet list
   findings      3-4 short bullets
   githubLink    full URL ("" hides the button)
   imageSrc      "images/xyz.png" or "" for the placeholder
   series        optional. Use CHALLENGE.name for challenge days.
   ================================================================ */

const CHALLENGE = {
  name: "30-Day Data Analytics Challenge",
  totalDays: 30,
  repo: "https://github.com/oyenugatoluwalase3-sudo/30-day-data-analytics-challenge"
};

/* Link to a day's folder in the challenge repo, e.g. dayLink(5) */
const dayLink = (n) =>
  `${CHALLENGE.repo}/tree/HEAD/Day${String(n).padStart(2, "0")}`;

const portfolioProjects = [
  /* ── Main projects ─────────────────────────────────────────── */
  {
    id: "01",
    tool: "Power BI",
    status: "Completed",
    title: "Chocolate Sales Dashboard",
    description: "End-to-end Power BI report analysing global chocolate sales.",
    tags: ["Power BI", "DAX", "Sales Analytics"],
    findingsLabel: "Key Findings",
    findings: [
      "$12.8M total revenue · 7.4% YoY growth",
      "Australia led all 6 markets at $2.4M",
      "Smooth Silky Salty was the top-selling product"
    ],
    githubLink: "https://github.com/oyenugatoluwalase3-sudo/chocolate-sales-dashboard",
    imageSrc: "images/images__1_-removebg-preview.png"
  },
  {
    id: "02",
    tool: "Python",
    status: "Completed",
    title: "Nigerian Healthcare EDA",
    description: "An Exploratory Data Analysis project investigating disease burden, geographic hotspots, and healthcare infrastructure across Nigeria.",
    tags: ["Python", "Pandas", "Plotly", "EDA"],
    findingsLabel: "Key Insights",
    findings: [
      "Visualized geographic disease burden across 36 states using interactive Plotly maps.",
      "Tracked time-series trends (2015-2023) for highest-impact diseases dynamically.",
      "Utilized correlation matrices to mathematically prove the synthetic, unweighted nature of the facility dataset."
    ],
    githubLink: "https://github.com/oyenugatoluwalase3-sudo/nigerian-healthcare-eda",
    imageSrc: "images/map-screenshot.png"
  },
  {
    id: "03",
    tool: "SQL",
    status: "Completed",
    title: "Indian Flight Booking & Pricing Analysis",
    description: "An analytical SQL layer built on a 300,000+ record dataset to uncover airline pricing strategies, class premiums, and route volatility.",
    tags: ["SQL Server", "CTEs", "Window Functions", "Data Cleansing"],
    findingsLabel: "Business & Technical Highlights",
    findings: [
      "Calculated a 600% class premium gap, revealing Vistara's massive ~47K Rupee markup for Business class.",
      "Identified the Delhi-Mumbai corridor as the undisputed premium travel hub (>5,000 Business flights).",
      "Engineered multi-table JOINs and NTILE window functions to map exponential last-minute price hikes."
    ],
    githubLink: "https://github.com/oyenugatoluwalase3-sudo/Flight-Booking-SQL-Analysis",
    imageSrc: "images/flight-booking-screenshot.png"
  },

  /* ── 30-Day Data Analytics Challenge ───────────────────────── */
  {
    id: "Day 01",
    tool: "SQL + Power BI",
    status: "Completed",
    series: CHALLENGE.name,
    title: "Does Advertising Actually Work?",
    description: "Tested 200,000 campaign records to see whether ad spend really pays back, and whether spending more buys better returns.",
    tags: ["SQL Server", "Power BI", "Marketing"],
    findingsLabel: "Key Findings",
    findings: [
      "Every campaign had an ROI above 1: all earned back more than they cost",
      "Facebook led on average ROI at 5.02",
      "High- and low-spend campaigns differed by under 0.02 ROI, so channel mattered more than budget"
    ],
    githubLink: dayLink(1),
    imageSrc: ""
  },
  {
    id: "Day 02",
    tool: "SQL + Power BI",
    status: "Completed",
    series: CHALLENGE.name,
    title: "What Makes a Club the Big Six?",
    description: "Combined club finances, transfers and Premier League results to test what really separates the Big Six from everyone else.",
    tags: ["SQL Server", "Power BI", "Football"],
    findingsLabel: "Key Findings",
    findings: [
      "Man City revenue grew from €154M in 2010 to €809M in 2024",
      "Man United spent about €4.5B on wages over four seasons yet averaged 66.8 points",
      "Big Six profile: €400M+ revenue, 65+ average points, 50%+ top-four rate"
    ],
    githubLink: dayLink(2),
    imageSrc: ""
  },
  {
    id: "Day 03",
    tool: "Python + SQL + Power BI",
    status: "Completed",
    series: CHALLENGE.name,
    title: "Do Critics Actually Affect Movie Sales?",
    description: "74 romantic comedies (2007–2011): Rotten Tomatoes, Metacritic and IMDb scores against US box office, with Python for data collection and cleaning.",
    tags: ["Python", "SQL Server", "Power BI", "Entertainment"],
    findingsLabel: "Key Findings",
    findings: [
      "Correlation between critic scores and US box office was just 0.04",
      "The Twilight Saga: New Moon scored 28% on Rotten Tomatoes yet took $298M",
      "‘Mixed’ reviews averaged about $71M versus about $48M for ‘Good’ reviews"
    ],
    githubLink: dayLink(3),
    imageSrc: ""
  },
  {
    id: "Day 04",
    tool: "SQL + Power BI",
    status: "Completed",
    series: CHALLENGE.name,
    title: "Can a School Spot At-Risk Students Early?",
    description: "1,048 Maths and Portuguese student records, cleaned in SQL Server and built into a three-page Power BI dashboard with an At-Risk Tracker.",
    tags: ["SQL Server", "Power BI", "Education"],
    findingsLabel: "Key Findings",
    findings: [
      "9.8% of Maths students were flagged At Risk versus 2.3% in Portuguese",
      "No home internet meant about 1.4 (Maths) and 1.1 (Portuguese) points lower on average",
      "All 54 students who finished on zero showed a declining trend from Term 1"
    ],
    githubLink: dayLink(4),
    imageSrc: ""
  }

  /* Day 05 is in your repo but not in its README table yet.
     Copy a Day block above, change the fields, and use dayLink(5). */
];
