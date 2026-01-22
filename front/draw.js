function draw_event(event, schedule_start, schedule_end) {
    if (event.startDate <= schedule_start || event.endDate >= schedule_end) {
        console.log("error");
        return;
    }

    const table = document.getElementById("table");
    const height = table.getBoundingClientRect().height;
    const width = table.getBoundingClientRect().width;

    /* calculate position on the board */
    console.log((event.startDate.slice(9, 15) - 80000) / 10000);
    const x = (0.1 * width) + ((0.9 * width) / 6) * (event.startDate.slice(0, 8) - schedule_start.slice(0, 8));
    const y = (0.1 * height) + 5 + ((0.9 * height) / 13 + 5) * ((event.startDate.slice(9, 15) - 80000) / 10000);
    const h = ((0.9 * height) / 13) * event.duration;
    const w = ((0.9 * width) / 6);

    const textHeight = getTextHeight("Logique", 15 * width / 750, "Arial", 100);

    const eventBox = document.createElement("div");
    eventBox.style.position = "absolute";
    eventBox.style.left = x + "px";
    eventBox.style.top = y + "px";
    eventBox.style.width = w + "px";
    eventBox.style.height = h + "px";
    eventBox.style.backgroundColor = "#c4cb3cff";
    eventBox.style.color = "#000000";
    eventBox.style.padding = "5px";
    eventBox.style.marginLeft = "5px";
    eventBox.style.boxSizing = "border-box";
    eventBox.style.overflow = "hidden";
    eventBox.style.borderRadius = "5%";

    eventBox.addEventListener("click",() =>  {

        const article = document.createElement("article");
        article.style.width = "100px";
        article.style.height = "100px";
        article.style.position ="relative";
        article.style.top = 100 + "px";
        article.style.left = 100 + "px";
        table.parentNode.insertBefore(article,table);
    })
    /* Name */
    const nameDiv = document.createElement("div");
    nameDiv.style.fontFamily = "Arial";
    nameDiv.style.fontSize = (15 * height / 750) + "px";
    nameDiv.textContent = event.name;

    /* Room */
    const roomDiv = document.createElement("div");
    roomDiv.style.fontFamily = "Arial";
    roomDiv.style.fontSize = (15 * height / 750) + "px";
    roomDiv.style.marginTop = "5px";
    roomDiv.textContent = event.location;

    /* time */
    const timeDiv = document.createElement("div");
    timeDiv.style.fontFamily = "Arial";
    timeDiv.style.fontSize = (15 * height / 750) + "px";
    timeDiv.style.marginTop = "5px";
    const start = event.StartDate;
    const end = event.EndDate;
    const val = start.Hour + "h" + start.Minute + "-" + end.Hour + "h" + end.Minute;
    timeDiv.textContent = val;

    eventBox.appendChild(nameDiv);
    eventBox.appendChild(roomDiv);
    eventBox.appendChild(timeDiv);

    table.appendChild(eventBox);
}

function getTextHeight(text, fontSize, fontFamily, width) {
    const tempElement = document.createElement('span');
    tempElement.style.visibility = 'hidden';
    tempElement.style.whiteSpace = 'nowrap';
    tempElement.style.fontFamily = fontFamily;
    tempElement.style.fontSize = `${fontSize}px`;
    tempElement.style.width = `${width}px`;
    tempElement.style.display = 'inline-block';
    tempElement.textContent = text;

    document.body.appendChild(tempElement);
    const height = tempElement.getBoundingClientRect().height;
    document.body.removeChild(tempElement);

    return height;
}

function getMonday(gap) {
    // gap is the number of week between today and the selected date
    const aujourdHui = new Date();
    const jourActuel = aujourdHui.getDay(); // 0 (dimanche) à 6 (samedi)
    const diffLundi = aujourdHui.getDate() - jourActuel + (jourActuel === 0 ? -6 : 1);
    const lundi = new Date(aujourdHui.setDate(diffLundi));
    return lundi;
}

function draw_table() {
    const table = document.getElementById("table");
    const height = table.getBoundingClientRect().height;
    const width = table.getBoundingClientRect().width;

    // Vider le contenu précédent
    table.innerHTML = '';
    table.style.position = 'relative';

    const headerHeight = 0.1 * height;
    const hourColumnWidth = 0.1 * width;
    const dayColumnWidth = (0.9 * width) / 6;
    const cellHeight = (0.9 * height) / 13;

    // Jours de la semaine
    var jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    const aujourdHui = new Date();
    const jourActuel = aujourdHui.getDay();
    const diffLundi = aujourdHui.getDate() - jourActuel + (jourActuel === 0 ? -6 : 1);
    const lundi = new Date(aujourdHui.setDate(diffLundi));

    // Générer les dates pour chaque jour de la semaine
    jours = jours.map((jour, index) => {
        const date = new Date(lundi);
        date.setDate(lundi.getDate() + index);
        const jourDate = date.getDate();
        const moisDate = date.getMonth() + 1;
        return `${jour} ${jourDate}/${moisDate}`;
    });

    // Heures (de 8h à 20h)
    const heures = [];
    for (let h = 8; h <= 20; h++) {
        heures.push(`${h}h`);
    }

    // Création de la table HTML
    const tableElement = document.createElement("table");
    tableElement.style.width = width + "px";
    tableElement.style.height = height + "px";
    tableElement.style.borderCollapse = "collapse";
    tableElement.style.position = "absolute";
    tableElement.style.top = "0";
    tableElement.style.left = "0";

    // En-tête avec les jours
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    
    // Cellule vide pour le coin
    const emptyHeader = document.createElement("th");
    emptyHeader.style.width = hourColumnWidth + "px";
    emptyHeader.style.height = headerHeight + "px";
    emptyHeader.style.backgroundColor = "#e0e0e0";
    headerRow.appendChild(emptyHeader);

    // En-têtes des jours
    jours.forEach((jour) => {
        const th = document.createElement("th");
        th.style.width = dayColumnWidth + "px";
        th.style.height = headerHeight + "px";
        th.style.backgroundColor = "#4CAF50";
        th.style.textAlign = "center";
        th.style.verticalAlign = "middle";
        th.style.fontFamily = "Arial";
        th.style.fontSize = (15 * width / 750) + "px";
        th.style.border = "1px solid #ccc";
        th.textContent = jour;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tableElement.appendChild(thead);

    // Corps de la table avec les heures et cellules
    const tbody = document.createElement("tbody");

    heures.forEach((heure) => {
        const row = document.createElement("tr");

        // Colonne des heures
        const hourCell = document.createElement("td");
        hourCell.style.width = hourColumnWidth + "px";
        hourCell.style.height = cellHeight + "px";
        hourCell.style.backgroundColor = "#e0e0e0";
        hourCell.style.textAlign = "center";
        hourCell.style.verticalAlign = "middle";
        hourCell.style.fontFamily = "Arial";
        hourCell.style.fontSize = (15 * width / 750) + "px";
        hourCell.style.border = "1px solid #ccc";
        hourCell.textContent = heure;
        row.appendChild(hourCell);

        // Cellules pour chaque jour
        jours.forEach(() => {
            const cell = document.createElement("td");
            cell.style.width = dayColumnWidth + "px";
            cell.style.height = cellHeight + "px";
            cell.style.backgroundColor = "white";
            cell.style.border = "1px solid #ccc";
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    tableElement.appendChild(tbody);
    table.appendChild(tableElement);
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}