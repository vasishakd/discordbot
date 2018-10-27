$(document).ready(function () {

    let xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:1337/api/top', true);

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(xhr.responseText);

            let cols = [];

            for (let key in data) {
                cols[data[key].name] = data[key].level;
            }

            let table = document.getElementById("table");

            let tbody = document.createElement('tbody');

            let num = 1;
            for (let key in cols) {
                let tr = document.createElement('tr');

                let td = document.createElement('td');
                td.innerHTML = num++;
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerHTML = key;
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerHTML = cols[key];
                tr.appendChild(td);

                tbody.appendChild(tr);
            }

            table.appendChild(tbody);
        }
    };

    xhr.send();
});