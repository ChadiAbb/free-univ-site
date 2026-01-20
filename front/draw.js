function draw_event(event,schedule_start,schedule_end){
    if (event.startDate <= schedule_start || event.endDate >= schedule_end) {
        console.log("error");
        return
    }

    const table = document.getElementById("table");
    const height = table.getBoundingClientRect().height;
    const width = table.getBoundingClientRect().width;

    /* calculate postion on the board */
    console.log((event.startDate.slice(9,15)-80000)/10000);
    const x = (0.1*width) + ((0.9*width)/6)*(event.startDate.slice(0,8)-schedule_start.slice(0,8));
    const y = (0.1*height) + ((0.9*height)/13)*((event.startDate.slice(9,15)-80000)/10000);
    const h = (0.1*height) + ((0.9*height)/13)*event.duration;
    const w = ((0.9*width)/6)

    const textHeight = getTextHeight("Logique",15 * ((7 * 44) / width),"Arial",100);

    const box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    box.setAttribute("height",h);
    box.setAttribute("width",w);
    box.setAttribute("x",x);
    box.setAttribute("y",y);
    box.setAttribute("fill","#c4cb3cff");
    box.setAttribute("color","#000000");

    /* Name */
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("width", "100%");
    text.setAttribute("height", "100%");
    text.setAttribute("viewBox", `0 0 100% 100%`);
    text.setAttribute("x",x + 5);
    text.setAttribute("y",y + 10);
    set_font(text,width);
    text.textContent = event.name;

    /* Room */
    const room = document.createElementNS("http://www.w3.org/2000/svg", "text");
    room.setAttribute("width", "100%");
    room.setAttribute("height", "100%");
    room.setAttribute("viewBox", `0 0 100% 100%`);
    room.setAttribute("x",x + 5);
    room.setAttribute("y",y + 10 + textHeight);
    set_font(room,width);
    room.textContent = event.location;

    /* time */
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("width", "100%");
    t.setAttribute("height", "100%");
    t.setAttribute("viewBox", `0 0 100% 100%`);
    t.setAttribute("x",x + 5);
    t.setAttribute("y",y + 20 + textHeight);
    set_font(t,width);
    const start = event.StartDate;
    const end = event.EndDate;
    const val = start.Hour + "h" + start.Minute + "-" + end.Hour + "h" + end.Minute;
    t.textContent = val;
    
    table.appendChild(box);
    table.appendChild(room);
    table.appendChild(text);
    table.appendChild(t);
}

function set_font(element,width){
    element.setAttribute("fill", "black");
    element.setAttribute("font-family", "Arial");
    element.setAttribute("font-size",15*width/750);
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

function getMonday(gap){
    // gad is the number of week between today and the selected date
    const aujourdHui = new Date();
    const jourActuel = aujourdHui.getDay(); // 0 (dimanche) à 6 (samedi)
    const diffLundi = aujourdHui.getDate() - jourActuel + (jourActuel === 0 ? -6 : 1); // Calcul pour obtenir le lundi
    const lundi = new Date(aujourdHui.setDate(diffLundi));
}


function draw_table(){
    // Dimensions du SVG
    const table = document.getElementById("table");
    const height = table.getBoundingClientRect().height;
    const width = table.getBoundingClientRect().width;
    console.log(height);
    console.log(width);
    
    
    const headerHeight = 0.1*height;
    const hourColumnWidth = 0.1*width;
    const dayColumnWidth = (0.9*width)/6;
    const cellHeight = (0.9*height)/13;

    // Jours de la semaine
    var jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    const aujourdHui = new Date();
    const jourActuel = aujourdHui.getDay(); // 0 (dimanche) à 6 (samedi)
    const diffLundi = aujourdHui.getDate() - jourActuel + (jourActuel === 0 ? -6 : 1); // Calcul pour obtenir le lundi
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

    // Création du SVG
    const svg = table;
    //svg.setAttribute("width", width);
    //svg.setAttribute("height", height);

    // Arrière-plan
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", width);
    background.setAttribute("height", height);
    background.setAttribute("fill", "#ff0000ff");
    svg.appendChild(background);

    // En-tête des jours
    jours.forEach((jour, index) => {
        const x = hourColumnWidth + index * dayColumnWidth;
        const header = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        header.setAttribute("x", x);
        header.setAttribute("y", 0);
        header.setAttribute("width", dayColumnWidth);
        header.setAttribute("height", headerHeight);
        header.setAttribute("fill", "#4CAF50");
        svg.appendChild(header);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + dayColumnWidth / 2);
        text.setAttribute("y", headerHeight / 2 + 5);
        text.setAttribute("text-anchor", "middle");
        set_font(text,width);
        text.textContent = jour;
        svg.appendChild(text);
    });

    // Colonne des heures
    const hourColumn = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    hourColumn.setAttribute("x", 0);
    hourColumn.setAttribute("y", height);
    hourColumn.setAttribute("width", hourColumnWidth);
    hourColumn.setAttribute("height", 0.9 * height);
    hourColumn.setAttribute("fill", "#e0e0e0");
    svg.appendChild(hourColumn);

    // Heures
    heures.forEach((heure, index) => {
        const y = headerHeight + index * cellHeight;
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", hourColumnWidth / 2);
        text.setAttribute("y", y + cellHeight / 2 + 5);
        text.setAttribute("text-anchor", "middle");
        set_font(text,width);
        text.textContent = heure;
        svg.appendChild(text);
    });

    // Cases pour chaque heure/jour
    heures.forEach((_, heureIndex) => {
        jours.forEach((_, jourIndex) => {
        const x = hourColumnWidth + jourIndex * dayColumnWidth;
        const y = headerHeight + heureIndex * cellHeight;
        const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cell.setAttribute("x", x);
        cell.setAttribute("y", y);
        cell.setAttribute("width", dayColumnWidth);
        cell.setAttribute("height", cellHeight);
        cell.setAttribute("fill", "white");
        cell.setAttribute("stroke", "#ccc");
        svg.appendChild(cell);
        });
    });

    // Ajout du SVG à la page
    //document.getElementById("table").appendChild(svg);
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
