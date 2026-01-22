document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const token = localStorage.getItem("token");

    console.log(navbar);

    let navContent = `
        <ul id="nav-links">
        <li>
            <a href="./index.html">Free-Univ</a>
        </li>
        <li>
            <a href="./free.html">Salles libres</a>
        </li>
    `;
    if(token) {
        navContent += `
        <li>
            <a href="./preferences.html">Prefences</a>
        </li>
        <li>
            <button id="logoutBtn">Déconnexion</button>
        </li>
        `;
    } else {
        navContent += `
        <li>
            <a href="login.html">Connexion</a>
        </li>
        `;
    }
    navContent+=`</ul>`;
    console.log(navContent);

    navbar.innerHTML = navContent;

    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "index.html"
        });
    }

});