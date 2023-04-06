

let tablebody = document.getElementById("table_body")

fetch('data.json')
    .then(response => response.json())
    .then(data => {
    
        console.log(data)
        console.log(`obj data = ${data.employees}`)
        console.log(`obj_dta = ${data.employees[0]["name"]}`)
    

        const array_employees = data.employees
        //Kallar på funktionen printTableData(datan)
        printTableData(array_employees)

    })
    .catch(error => console.error(error));


function printTableData(t_data){
    
    let tr_string = "";
    
    t_data.forEach(pers_obj => {
        tr_string += `<tr>
            <td>${pers_obj.name}</td><td>${pers_obj.email}</td>
        </tr>`    
    });

    tablebody.innerHTML=tr_string;

  }