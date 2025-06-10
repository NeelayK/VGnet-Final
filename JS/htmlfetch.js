// htmlfetch.js
import { canvasLoad } from './script.js';
import { fetchCollab, fetchGallery, fetchProjects, fetchPublications, fetchSponsors, fetchTeam, renderInfoSection, setupPaginationButtons } from './sqlfetch.js';

export function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}

export function loadPage(page) {
    let pageFile = `${page}.html`;

    fetch(pageFile)
        .then(response => response.text())
        .then(data => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            document.getElementById("content").innerHTML = data;

            if (document.getElementById("missionCanvas")) canvasLoad();
            //if(document.getElementById("RecentPublished")) renderMostRecentPublication();
            if (document.getElementById("JP")){
                fetchPublications();
                setupPaginationButtons();
            }
            if(document.querySelector(".info-section")){
                renderInfoSection();
                fetchSponsors();
            }
            if (document.querySelector(".projects")) fetchProjects();
            if (document.querySelector(".collabsHead")) fetchCollab();
            if (document.querySelector(".team-category")) {
                fetchTeam();
                fetchGallery();
            }

            handleScroll();
        })
        .catch(error => console.error(`Error loading ${pageFile}:`, error));
}

window.loadComponent = loadComponent;
window.loadPage = loadPage;


