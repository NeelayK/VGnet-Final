import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { canvasLoad } from './script.js';

const supabaseUrl = "https://prfkhjuujnheztwhwmcd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZmtoanV1am5oZXp0d2h3bWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDk2NjIsImV4cCI6MjA1NzM4NTY2Mn0.j92nEtB5mUORV5VlCpLsTbJNinSykjnpaX0R1cnZQXc";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchPublications() {
    try {
        const { data, error } = await supabase.from("publications").select("*");

        const infoSection = document.querySelector('.info-section');
        const canvas = document.createElement('canvas');
        canvas.id = 'missionCanvas';
        infoSection.appendChild(canvas);

        const infoContainer = document.querySelector('.publications');
        infoContainer.innerHTML = '';

        data.forEach((publication) => {
            const infoBox = document.createElement('div');
            infoBox.classList.add('info-box');

            const authors = document.createElement('h4');
            authors.textContent = publication.authors;

            const title = document.createElement('h2');
            title.textContent = publication.paperName;

            const date = document.createElement('p');
            date.textContent = publication.date;

            infoBox.appendChild(authors);
            infoBox.appendChild(title);
            infoBox.appendChild(date);
            infoContainer.appendChild(infoBox);
        });

        canvasLoad(100, 150, 1.2,'missionCanvas','200,155,230');
    } catch (error) {
        console.error("Error loading publications:", error);
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

        canvasLoad(100, 200, 1.1, 'missionCanvasOngoing','155,155,255');
        canvasLoad(100, 100, 1.1, 'missionCanvasCompleted','255,155,155');

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

        const categories = {
            1: document.getElementById("bsms"),
            2: document.getElementById("alumni"),
            3: document.getElementById("cphd"),
            4: document.getElementById("ps")
        };

        Object.values(categories).forEach(category => {
            if (category) category.innerHTML = "";
        });

        data.forEach((team) => {
            const groupId = parseInt(team.group, 10);
            if (!categories[groupId]) {
                console.warn(`Unknown team group: ${groupId}`);
                return;
            }

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

            categories[groupId].appendChild(teamMember);
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
