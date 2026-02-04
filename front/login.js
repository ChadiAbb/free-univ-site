const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const pseudo = document.getElementById("pseudo").value;
    const password = document.getElementById("password").value;

    try {
        const reponse = await fetch("http://80.247.3.232:8443/api/auth/login", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    pseudo : pseudo,
                    password : password,
                })
            }
        );
        const data = await reponse.json();

        if (reponse.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            errorMessage.innerText = "Mot de passe ou pseudo incorrect";
        }
    } catch (error) {
        console.error("Erreur : ", error);
        
    }
})