var selected = [];

function fetchFormation(){

    fetch("http://80.247.3.232:8080/uniduler/formation")
    .then((response) => response.date)
    .then((data) => {
        /* Display the choice and preselect from the api */
        const token = localStorage.getItem("token");
        fetch("http://80.247.3.232:8443/api/user/preferences",
            {
                method:"GET",
                headers: {
                    "Authorization" : token
                }
            }
        )
        .then((response) => response.date)
        .then((data) => {
            updateFormation(formations,pref)
        })

    })
}

function updateFormation(formations,pref){
    const selector = document.getElementById("selector");

    formations.forEach(element => {
        const div = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");

        input.type = "checkbox";
        input.id = element;

        label.innerText = element;

        input.appendChild(label);
        div.appendChild(input);

        if (pref["parcours"].includes(element)){
            div.appendChild(fetchYear(element,pref));
        }

        selected.appendChild(div);
    });
}

function fetchYear(formation,pref){
    const div = document.createElement("div");

    fetch(`http://80.247.3.232:8080/uniduler/year?formation=${formation}`)
    .then((response) => response.data )
    .then((data) => {
        div.appendChild(updateYear(formation,data,pref));
    })
    return div;
}

function updateYear(formation,years,pref){
    const div = document.createElement("div");

    years.forEach(element => {

    })   
}

function fetchGroups(){

}

function updateGroups(){

}

function fetchType(){

}

function updateType(){

}