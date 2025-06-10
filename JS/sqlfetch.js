import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { canvasLoad } from './script.js';

const supabaseUrl = "https://prfkhjuujnheztwhwmcd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZmtoanV1am5oZXp0d2h3bWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDk2NjIsImV4cCI6MjA1NzM4NTY2Mn0.j92nEtB5mUORV5VlCpLsTbJNinSykjnpaX0R1cnZQXc";
const supabase = createClient(supabaseUrl, supabaseKey);



let publicationsData = {
  1: [], // Journal Papers
  2: [], // Conference Papers
  3: [], // Patents
};

const pageSize = 10;
const currentPage = {
  1: 0,
  2: 0,
  3: 0,
};


function getSectionMap() {
  return {
    1: document.querySelector('#JP .info-container'),
    2: document.querySelector('#CP .info-container'),
    3: document.querySelector('#PP .info-container'),
  };
}

function updatePageInfo(type) {
  const totalPublications = publicationsData[type].length;
  const totalPages = Math.ceil(totalPublications / pageSize);
  const current = currentPage[type];
  const start = current * pageSize + 1;
  const end = Math.min((current + 1) * pageSize, totalPublications);
  
  const pageInfoElement = document.querySelector(`.page-info[data-type="${type}"]`);
  if (pageInfoElement) {
    pageInfoElement.textContent = `[${start}-${end}/${totalPublications}]`;
  }

  const prevButton = document.querySelector(`.prev-btn[data-type="${type}"]`);
  const nextButton = document.querySelector(`.next-btn[data-type="${type}"]`);
  
  if (prevButton) {
    prevButton.classList.toggle('disabled', current === 0);
  }
  if (nextButton) {
    nextButton.classList.toggle('disabled', current >= totalPages - 1);
  }
}

export function renderPage(type) {
  const sectionMap = getSectionMap();
  const container = sectionMap[type];

  if (!container) {
    console.error(`Container for type ${type} not found`);
    return;
  }

  container.innerHTML = '';

  const sortedData = publicationsData[type].sort((a, b) => new Date(b.date) - new Date(a.date));

  const start = currentPage[type] * pageSize;
  const end = start + pageSize;
  const pageData = sortedData.slice(start, end);

  pageData.forEach(publication => {
    const infoBox = document.createElement('div');
    infoBox.classList.add('info-box');

    const title = document.createElement('h4');
    title.textContent = publication.title;

    const authors = document.createElement('p');
    authors.textContent = `Authors: ${publication.authors}`;

    const dateObj = new Date(publication.date);
    const formattedDate = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const date = document.createElement('h4');
    date.textContent = `${formattedDate}`;

    infoBox.appendChild(title);
    infoBox.appendChild(authors);
    infoBox.appendChild(date);

    container.appendChild(infoBox);
  });

  updatePageInfo(type);
}

export async function fetchPublications() {
  try {
    const { data, error } = await supabase.from("publication").select("*");
    if (error) throw error;

    publicationsData = { 1: [], 2: [], 3: [] };
    data.forEach(pub => {
      if (publicationsData[pub.type]) {
        publicationsData[pub.type].push(pub);
      }
    });

    currentPage[1] = 0;
    currentPage[2] = 0;
    currentPage[3] = 0;

    [1, 2, 3].forEach(type => {
      renderPage(type);
      updatePageInfo(type);
    });

  } catch (error) {
    console.error("Error loading publications:", error);
  }
}


export function setupPaginationButtons() {
  const nextButtons = document.querySelectorAll('.next-btn');
  const prevButtons = document.querySelectorAll('.prev-btn');

  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = Number(btn.dataset.type);
      const maxPage = Math.ceil(publicationsData[type].length / pageSize) - 1; // Fixed this line
      if (currentPage[type] < maxPage) {
        currentPage[type]++;
        renderPage(type);
      }
    });
  });

  prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = Number(btn.dataset.type);
      if (currentPage[type] > 0) {
        currentPage[type]--;
        renderPage(type);
      }
    });
  });
}


export async function renderInfoSection() {
  const recentNewsContainer = document.getElementById("recentNews");
  recentNewsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const [pubRes, newsRes, projRes] = await Promise.all([
      supabase.from("publication").select("*"),
      supabase.from("news").select("*"),
      supabase.from("projects").select("*").eq("completed", true),
    ]);

    if (pubRes.error || newsRes.error || projRes.error) {
      throw new Error("Error fetching data from Supabase.");
    }

const latestPub = pubRes.data
  .filter(pub => pub.type === 3)
  .sort((a, b) => new Date(b.date) - new Date(a.date))[0];


    const latestNews = newsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    const latestCompletedProject = projRes.data.sort((a, b) => b.id - a.id)[0];

    recentNewsContainer.innerHTML = "";

    const createNewsTab = (heading, text) => {
      const tab = document.createElement("div");
      tab.className = "newsTab";

      const h3 = document.createElement("h3");
      h3.className = "lab-description";
      h3.textContent = heading;

      const h4 = document.createElement("h4");
      h4.textContent = text;

      const hr = document.createElement("hr");

      tab.appendChild(h3);
      tab.appendChild(h4);
      tab.appendChild(hr);

      return tab;
    };

    if (latestPub) {
      recentNewsContainer.appendChild(createNewsTab("Latest Patent", latestPub.title));
    }

    if (latestNews) {
      recentNewsContainer.appendChild(createNewsTab("Project News", latestNews.title));
    }

    if (latestCompletedProject) {
      recentNewsContainer.appendChild(createNewsTab("Just Completed Project", latestCompletedProject.title));
    }

  } catch (err) {
    console.error("Failed to render info section:", err);
    recentNewsContainer.innerHTML = "<p>Error loading content.</p>";
  }
}

















export async function fetchProjects() {
    try {
        const { data, error } = await supabase.from("projects").select("*");
        if (error) throw error;
        const ongoingC = document.querySelector("#ongoing");
        const completedC = document.querySelector("#completed");

        const ongoingContainer = document.querySelector("#ongoing .info-container.projects");
        const completedContainer = document.querySelector("#completed .info-container.projects");

        ongoingContainer.innerHTML = '';
        completedContainer.innerHTML = '';

        const ongoingCanvas = document.createElement('canvas');
        ongoingCanvas.id = 'missionCanvasOngoing';
        ongoingC.appendChild(ongoingCanvas);

        const completedCanvas = document.createElement('canvas');
        completedCanvas.id = 'missionCanvasCompleted';
        completedC.appendChild(completedCanvas);

        data.forEach((project) => {
            const infoBox = document.createElement("div");
            infoBox.classList.add("info-box");

            const header = document.createElement("div");
            header.classList.add("info-header");

            const title = document.createElement("h3");
            title.textContent = project.title;

            const sponsorLogo = document.createElement("img");
            sponsorLogo.src = project.sponsor_img;
            sponsorLogo.alt = "Sponsor Logo";
            sponsorLogo.classList.add("sponsor-logo");

            header.appendChild(title);
            header.appendChild(sponsorLogo);

            const body = document.createElement("div");
            body.classList.add("info-body");

            const desc = document.createElement("p");
            desc.textContent = project.desc;

            const prototypeImg = document.createElement("img");
            prototypeImg.src = project.image_link || "/Assets/default-prototype.png";
            prototypeImg.alt = "Prototype Image";
            prototypeImg.classList.add("prototype-image");

            body.appendChild(desc);
            body.appendChild(prototypeImg);

            const sponsor = document.createElement("h4");
            sponsor.textContent = `Funding Agency: ${project.sponsor}`;

            infoBox.appendChild(header);
            infoBox.appendChild(body);
            infoBox.appendChild(sponsor);

            if (project.completed === true) {
                completedContainer.appendChild(infoBox);
            } else {
                ongoingContainer.appendChild(infoBox);
            }
        });

        canvasLoad(100, 300, 1.8, 'missionCanvasOngoing','255,155,155');
        canvasLoad(100, 100, 1.1, 'missionCanvasCompleted','155,155,255');

    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}







export async function fetchCollab() {
    try {
        
        const { data, error } = await supabase.from("collabs").select("*");
        const headContainer = document.querySelector('.collabsHead');
        headContainer.innerHTML = '';

        const categories = {
            1: { title: "Industrial Collaborators", id: "IC" },
            2: { title: "Government Research Collaborators", id: "GC" },
            3: { title: "Research/Academic Collaborators", id: "AC" }
        };

        const sections = {};

        Object.values(categories).forEach(({ title, id }) => {
            const h2 = document.createElement('h2');
            h2.style.textDecoration = "underline";
            h2.textContent = title;
            headContainer.appendChild(h2);

            const div = document.createElement('div');
            div.id = id;
            div.classList.add("objectives-section", "collabs", "fade-in");
            headContainer.appendChild(div);

            sections[id] = div;
        });

        data.forEach((project) => {
            const { collab_type, collab, desc } = project;
            const category = categories[collab_type];

            if (category) {
                const infoContainer = sections[category.id]; 

                const title = document.createElement('h2'); 
                title.textContent = collab;

                const description = document.createElement('p');
                description.textContent = desc;
                infoContainer.appendChild(title);
                infoContainer.appendChild(description);
            } else {
                console.warn(`Unknown collab_type: ${collab_type}`);
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}












export async function fetchTeam() {
    try {
        const { data, error } = await supabase.from("team").select("*");
        if (error) throw error;

        const categories = {
            1: document.getElementById("bsms"),
            2: document.getElementById("alumni"),
            3: document.getElementById("cphd"),
            4: document.getElementById("ps")
        };

        Object.values(categories).forEach(category => {
            if (category) category.innerHTML = "";
        });

        const hasMembers = { 1: false, 2: false, 3: false, 4: false };

        data.forEach((team) => {
            const groupId = parseInt(team.group, 10);
            const container = categories[groupId];

            if (!container) {
                console.warn(`Unknown team group: ${groupId}`);
                return;
            }

            hasMembers[groupId] = true;

            const teamMember = document.createElement("div");
            teamMember.classList.add("team-member");

            const img = document.createElement("img");
            img.src = team.image_link || "default-image.jpg";
            img.alt = team.name;

            const teamText = document.createElement("div");
            teamText.classList.add("team-text");

            const name = document.createElement("h2");
            name.textContent = team.name;

            const interest = document.createElement("p");
            interest.textContent = team.research_interest;

            teamText.appendChild(name);
            teamText.appendChild(interest);
            teamMember.appendChild(img);
            teamMember.appendChild(teamText);

            container.appendChild(teamMember);
        });

        Object.entries(hasMembers).forEach(([groupId, hasData]) => {
            if (!hasData) {
                const container = categories[groupId];
                if (container) {
                    const prevSection = container.previousElementSibling;
                    if (
                        prevSection &&
                        prevSection.tagName === "SECTION" &&
                        prevSection.querySelector("h2")
                    ) {
                        prevSection.remove();
                    }
                    container.remove(); 
                }
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}






export async function fetchGallery() {
    try {
        const { data, error } = await supabase.from("gallery").select("*");

    const galleryContainer = document.querySelector('.gallery');


        galleryContainer.innerHTML = '';

        data.forEach((item) => {
            const img = document.createElement('img');
            img.src = item.img_link;
            img.style.marginBottom = "1em";

            const caption = document.createElement('h1');
            caption.textContent = item.desc;
            caption.style.fontSize = "1.2rem";
            caption.style.fontWeight = "normal";

            galleryContainer.appendChild(img);
            galleryContainer.appendChild(caption);
        });

    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}


export async function fetchSponsors() {
    try {
        const { data, error } = await supabase.from("fundings").select("*");

    const container = document.getElementById("sponsors");


        container.innerHTML = '';

        data.forEach((item) => {
            const img = document.createElement('img');
            img.src = item.sponsors;
            img.style.marginBottom = "1em";
            img.classList.add("sponsorImg");
            container.appendChild(img);
        });

    } catch (error) {
        console.error('Error loading sponsors:', error);
    }
}