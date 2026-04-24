/* =================================================================================
  GOOGLE SHEETS INTEGRATION (via SheetDB)
=================================================================================
*/

// REPLACE THIS URL with your actual SheetDB API URL
const SHEETDB_API_URL = "https://sheetdb.io/api/v1/YOUR_API_ID"; 

let portfolioProjects = [];

async function fetchProjects() {
  const loadingIndicator = document.getElementById('projects-loading');
  if (loadingIndicator) loadingIndicator.style.display = 'block';

  try {
    const response = await fetch(SHEETDB_API_URL);
    const data = await response.json();
    
    // Map the Google Sheet data into the format our website expects
    portfolioProjects = data.map(row => ({
      id: row.id || "00",
      tool: row.tool || "Tool",
      status: row.status || "Status",
      title: row.title || "Project Title",
      description: row.description || "",
      tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
      findingsLabel: row.findingsLabel || "Key Findings",
      findings: row.findings ? row.findings.split('|').map(f => f.trim()) : [],
      githubLink: row.githubLink || "#",
      imageSrc: row.imageSrc || ""
    }));

    if (loadingIndicator) loadingIndicator.style.display = 'none';
    
    // Call the function from main.js to render the cards
    if (typeof renderProjects === "function") {
      renderProjects();
    }

  } catch (error) {
    console.error("Error fetching projects from SheetDB:", error);
    if (loadingIndicator) loadingIndicator.innerText = "Failed to load projects. Please check connection.";
  }
}

// Fetch the data as soon as the file loads
fetchProjects();