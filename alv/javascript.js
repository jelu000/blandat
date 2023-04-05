

class Bokning {
    constructor(b_id, namn, tel, tid, datum, email) {
        this.b_id = b_id;
        this.namn = namn;
        this.tel = tel;
        this.tid = tid;
        this.datum = datum;
        this.email = email;
    }
}

let vald_dag_bokningar = [];

let datum = document.getElementById("input_datum")
//console.log("datum=" + datum.value)
let bokning_table_body = document.getElementById("table_body");


//När datum ändras i kalender
datum.addEventListener("change", dateChange);

async function dateChange(e) {
    valt_datum = e.target.value;
    //console.log(`change ${valt_datum}`)
    
    await getDayBokinDataDb(valt_datum);       
}

async function bokaTiden() {
    //console.log("click")
    let input_namn = document.getElementById("input_namn").value
    let input_email = document.getElementById("input_email").value
    let input_tel = document.getElementById("input_tel").value
    let input_datum = document.getElementById("input_datum").value
    let input_tid = document.getElementById("input_tid").value

    bokaTid(input_namn, input_tel, input_tid, input_datum, input_email);

    await getDayBokinDataDb(input_datum);
    
    //Tömmer textfält namn, tel och  email
    document.getElementById("input_namn").value = "";
    document.getElementById("input_email").value = "";
    document.getElementById("input_tel").value = "";
}

async function bokaTid(t_namn, t_tel, t_tid, t_datum, t_email) {

    if (t_namn !== "" && t_tid !== "") {
        const now = Date.now();
        const id = now.toString();
        //console.log(`daum= ${now}`);
    
        let bokning = new Bokning(id, t_namn, t_tel, t_tid, t_datum, t_email);
        vald_dag_bokningar.push(bokning);

        await setDayBokingDataDb(vald_dag_bokningar, t_datum);
    }
    else
        alert("Namn eller tid saknas!")
}

async function delButtonClick(e) {
    const sourceElement = e.target;
    //console.log(`id= ${sourceElement.id}`);
    await delDayBoking(vald_dag_bokningar, document.getElementById("input_datum").value, sourceElement.id);
}

function listDayBokings(){
    //console.log(`längd= ${vald_dag_bokningar.length}`)
    let tr_string = "";
    
    vald_dag_bokningar.forEach(dbokn => {
        tr_string += `<tr>
        <td>${dbokn.tid}</td><td>${dbokn.namn}</td><td>${dbokn.tel}</td><td>${dbokn.email}</td><td>${dbokn.b_id}</td><td><button onclick="delButtonClick(event)" name="${dbokn.b_id}" id="${dbokn.b_id}">avboka</button></td>
        </tr>`    
    });

    bokning_table_body.innerHTML=tr_string;
}

let bokingSort = (a, b) => {
    if (a.tid < b.tid) {
        return -1;
      }
      if (a.tid > b.tid) {
        return 1;
      }
      return 0;
}

//------------------------------------------------------------
//Databas funktioner med CRUD frågor---------------------------
async function setDayBokingDataDb(t_bokningar_dag, t_date) {
    
    localStorage.setItem(t_date, JSON.stringify(t_bokningar_dag));
    //getDayBokinDataDb(t_date);
}

async function getDayBokinDataDb(t_date){
    let dagbokningar = []

    try {
        dagbokningar = await JSON.parse(localStorage.getItem(t_date) );

        //Om billistan  är tom Null från localStorage
        if (dagbokningar == null){
            vald_dag_bokningar = []
            console.log(`hämtar ${dagbokningar}`)
        }
        else{
            console.log(`hämtar2 ${dagbokningar}`)
            dagbokningar.sort(bokingSort);//Sorterar på tid
            vald_dag_bokningar = dagbokningar;
        }

        listDayBokings(); 
    }
    catch (e){
        console.log(`Fel: ${e}`)
    }
    //return dagbokningar;
}

async function delDayBoking(t_bokningar_dag, t_date, t_id){

    try{

        const del_t_bokningar_dag = await t_bokningar_dag.filter((o, i) => o.b_id !== t_id)//e.target.id
        localStorage.setItem(t_date , JSON.stringify(del_t_bokningar_dag));
        getDayBokinDataDb(t_date);
    }
    catch(e){
        alert(`Kunde inte tabort bokning: ${e}`)
    }

}