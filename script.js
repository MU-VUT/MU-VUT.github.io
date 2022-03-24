// !!!!!!!!---------------------------------!!!!!!!!

//Vyrešit počet generovaných zadání z inputu usera
//Přidat možnosti řešení pomocí MSZ a Indexové metody

// !!!!!!!!---------------------------------!!!!!!!!

//Načtení elementů z html
var input = document.getElementById("pocetZadani");
var inputM = document.getElementById("m");
var inputN = document.getElementById("n");
var button = document.getElementById("button");
var holder = document.getElementById("holder");
var z = 0;

//Zadání minima a maxima generátoru
const min = 10;
const max = 50;

//funkce kontroly správného zadání
function control() {
    let pocetZadani = Number(input.value);
    let m = Number(inputM.value);
    let n = Number(inputN.value);

    if (pocetZadani < 0 || pocetZadani > 99) {
        alert("Počet zadání mimo rozsah");
        throw new Error("Počet zadání mimo rozsah");
    }

    if (m < 3 || m > 10 || n < 3 || n > 10) {
        alert("Počet dodavatelů nebo odběratelů mimo rozsah");
        throw new Error("Počet dodavatelů nebo odběratelů mimo rozsah");
    }
}

//funkce náhodného celého čísla
function getRandomNumber(min, max) {
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

//funkce generátor nulových matic a vektorů
function generator() {
    m = Number(inputM.value); //Počet řádků/zdrojů
    n = Number(inputN.value); //Počet sloupců/odběratelů

    A = Array(m).fill(0)
    B = Array(n).fill(0)
    C = new Array(m);

    for (let i = 0; i < m; i++) A[i] = getRandomNumber(min, max) * 10;
    for (let i = 0; i < n; i++) B[i] = getRandomNumber(min, max) * 10;
    for (let i = 0; i < m; i++) C[i] = new Array(n).fill(0);

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            C[i][j] = getRandomNumber(1, 99);
        }
    }

    X = new Array(m);
    for (let i = 0; i < m; i++) X[i] = new Array(n).fill(0); //Vytvoření prázdné matice přepravy

    Z = new Array(m);
    for (let i = 0; i < m; i++) Z[i] = new Array(n).fill(0); //Vytvoření prázdné matice nákladů
}

//funkce zápis hodnot zadání
function zadani() {
    // var output = document.getElementById("zadani" + cisloZadani);
    // var output4 = document.getElementById("table" + cisloZadani);

    let zadaniA = A;
    let zadaniB = B;
    let zadaniC = C;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            Z[i][j] = zadaniC[i][j]
        }
    }

    //Vyhodí nadpis Zadání
    textZadani = ("<h2>Zadání č. " + cisloZadani + " </h2><span>Vyřešte dopravní úlohu pomocí metody VAM. Vypočtěte objem přepravy a celkové přepravní náklady.</span>")
    output = output.substring(0, output.indexOf('>') + 1);
    output += textZadani;
    output += ("</p>");
    //vyplnění table zadáním DOM HTML
    tableZadani = [];
    tableZadani = ("<td> &nbsp </td>");
    for (let i = 0; i < n; i++) {
        let x = i + 1;
        tableZadani += ("<td>O<sub>" + x + "</sub></td>");
    };
    for (let i = 1; i < m + 1; i++) {
        tableZadani += ("<tr>")
        tableZadani += ("<td>D<sub>" + i + "</sub></td>")
        for (let j = 1; j < n + 1; j++) {
            let x = i - 1;
            let y = j - 1;
            tableZadani += ("<td class='upper-right'>&nbsp<sup>" + zadaniC[x][y] + "<sup></td>")
        }
        tableZadani += ("<td>" + zadaniA[i - 1] + "</td>");
        tableZadani += ("</tr>")
    };
    tableZadani += ("<tr><td>&nbsp</td>")
    for (let i = 1; i < n + 1; i++) {
        tableZadani += ("<td>" + zadaniB[i - 1] + "</td>");
    };
    tableZadani += ("</tr>")
    output4 = output4.substring(0, output4.indexOf('>') + 1);
    output4 += tableZadani;
    output4 += ("</table>");
}

//funkce vyrovnávač úloh
function vyrovnavac() {
    let sumA = A.reduce((a, b) => a + b, 0); //Sumace A
    let sumB = B.reduce((a, b) => a + b, 0); //Sumace B

    if (sumA > sumB) {
        let rozdil = sumA - sumB;
        B[n - 1] += rozdil;
    }
    else if (sumA < sumB) {
        let rozdil = sumB - sumA;
        A[m - 1] += rozdil;
    }
}

//funkce transpozice matice
function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i])); //Transpozice matice C
}

//funkce zjištění maximální diference včetně indexů (VAM)
function vam() {
    for (let x = 0; x < m + n - 1; x++) {
        //maximální diference řádků
        var diferenceRow = new Array(m);
        var hodnotaDiffRow = 0;
        var i2 = 1;
        for (let i = 0; i < m; i++) {
            let cRow = C[i].slice().sort((a, b) => a - b).slice(0, 2);
            diferenceRow[i] = cRow[1] - cRow[0];
            if (hodnotaDiffRow < diferenceRow[i]) {
                hodnotaDiffRow = diferenceRow[i];
                i2 = i;
            } else if (hodnotaDiffRow > diferenceRow[i]) {
                hodnotaDiffRow = hodnotaDiffRow;
            }
            else if (hodnotaDiffRow == diferenceRow[i]) {
                if (Math.min(...C[i2]) > Math.min(...C[i])) {
                    hodnotaDiffRow = diferenceRow[i];
                    i2 = i;
                } else {
                    hodnotaDiffRow = hodnotaDiffRow;
                }
            }
        }

        //maximální diference sloupců
        var CT = transpose(C);
        var diferenceCol = new Array(n);
        var hodnotaDiffCol = 0;
        var j2 = 1;
        for (let j = 0; j < n; j++) {
            let cCol = CT[j].slice().sort((a, b) => a - b).slice(0, 2);
            diferenceCol[j] = cCol[1] - cCol[0];
            if (hodnotaDiffCol < diferenceCol[j]) {
                hodnotaDiffCol = diferenceCol[j];
                j2 = j;
            } else if (hodnotaDiffCol > diferenceCol[j]) {
                hodnotaDiffCol = hodnotaDiffCol;
            }
            else if (hodnotaDiffCol == diferenceCol[j]) {
                if (Math.min(...CT[j2]) > Math.min(...CT[j])) {
                    hodnotaDiffCol = diferenceCol[j];
                    j2 = j;
                } else {
                    hodnotaDiffCol = hodnotaDiffCol;
                }
            }
        }


        //maximální diference celkem včetně indexů

        var hodnotaDiff
        if (hodnotaDiffRow > hodnotaDiffCol) {
            hodnotaDiff = hodnotaDiffRow;
            i3 = i2;
            let chosenRowMin = Math.min(...C[i3]);
            var j3 = C[i3].indexOf(chosenRowMin);
        }
        else if (hodnotaDiffRow < hodnotaDiffCol) {
            hodnotaDiff = hodnotaDiffCol;
            j3 = j2;
            let chosenColMin = Math.min(...CT[j3]);
            var i3 = CT[j3].indexOf(chosenColMin);
        }
        else if (hodnotaDiffRow == hodnotaDiffCol) {
            if (Math.min(...C[i2]) > Math.min(...CT[j2])) {
                hodnotaDiff = hodnotaDiffRow;
                i3 = i2;
                let chosenRowMin = Math.min(...C[i3]);
                var j3 = C[i3].indexOf(chosenRowMin);
            } else {
                hodnotaDiff = hodnotaDiffCol;
                j3 = j2;
                let chosenColMin = Math.min(...CT[j3]);
                var i3 = CT[j3].indexOf(chosenColMin);
            }
        }


        //výpočet X + dopočet zbytků + eliminace

        //Výběr minima odběratel/dodavatel
        X[i3][j3] = Math.min(A[i3], B[j3]);

        //Dopočet zbytků dodavatele/řádků
        A[i3] = A[i3] - X[i3][j3];

        //Dopočet zbytků odběratele/sloupců
        B[j3] = B[j3] - X[i3][j3];


        //Eliminiace použitích odběratelů/zdrojů
        if (A[i3] == 0) { //Pokud je vyčerpaný zdroj, eliminuj řádek
            for (let j = 0; j < n; j++) C[i3][j] = Infinity;
        } else if (B[j3] == 0) {
            for (let i = 0; i < m; i++) C[i][j3] = Infinity;
        } else if (A[i3] && B[j3] == 0) {
            for (let j = 0; j < n; j++) C[i3][j] = Infinity;
            for (let i = 0; i < m; i++) C[i][j3] = Infinity;
        }
    }
}

//funkce výpočet Z nákladů
function naklady() {
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            Z[i][j] = Z[i][j] * X[i][j];
            z += Z[i][j];
        }
    }
}

//funkce display output výsledků
function displayOutput() {

    //Vyhodí nadpis Výsledky
    textVysledky = ("<h2>Výsledky č. " + cisloZadani + " </h2>");
    output5 = output5.substring(0, output5.indexOf('>') + 1);
    output5 += textVysledky;
    output5 += ("</p>");


    //vyplnění table s výsledky zadáním DOM HTML
    tableVysledky = [];
    tableVysledky = ("<td> &nbsp </td>");
    for (let i = 0; i < n; i++) {
        let x = i + 1;
        tableVysledky += ("<td>O<sub>" + x + "</sub></td>");
    };
    for (let i = 1; i < m + 1; i++) {
        tableVysledky += ("<tr>")
        tableVysledky += ("<td>D<sub>" + i + "</sub></td>")
        for (let j = 1; j < n + 1; j++) {
            let x = i - 1;
            let y = j - 1;
            if (X[x][y] == 0) {
                tableVysledky += ("<td>&nbspx&nbsp</td>")
            }
            else {
                tableVysledky += ("<td>" + X[x][y] + "</td>")
            }
        }
        tableVysledky += ("</tr>")
    };
    let nn = n + 1;
    let zRozdelene;

    zRozdelene = z.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    tableVysledky += ("<tr><td colspan='" + nn + "'> Celkové náklady na přepravu = " + zRozdelene + " Kč</td></tr>")
    output6 = output6.substring(0, output6.indexOf('>') + 1);
    output6 += tableVysledky;
    output6 += ("</table>");

}

//funkce vytvoření PDF
function createPDF() {
    var sTable = document.getElementById('holder').innerHTML;

    var style = "<style>";
    style = style + "body {font-family:Verdana, Geneva, Tahoma, sans-serif;}";
    style = style + "table {border-collapse: collapse;}";
    style = style + "table, td {border: solid 1px;}";
    style = style + "td {padding: 1vw;}";
    style = style + "td.upper-right {text-align: right; vertical-align: top; padding: 5px;}";
    style = style + "@media print {#tab {page-break-after: always;}}";
    // style = style + "@media print {#tab {page-break-before: always;}}";
    style = style + "@media print {#table1 {page-break-after: always;}}";
    //style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";

    // CREATE A WINDOW OBJECT.
    var win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    //win.document.write('<title>Zadání</title>');   // <title> FOR PDF HEADER.
    win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(sTable);         // THE TABLE CONTENTS INSIDE THE BODY TAG.
    win.document.write('</body></html>');

    win.document.close(); 	// CLOSE THE CURRENT WINDOW.

    win.print();    // PRINT THE CONTENTS.
}

//Celková funkce spouštějící aplikaci
function application() {
    control();
    cisloZadani = 1;
    textHolder = ("");
    output = ("<p id='zadani" + cisloZadani + "'></p>");
    output4 = ("<table id='table" + cisloZadani + "'><tr></tr></table>");
    output5 = ("<p id='vysledky" + cisloZadani + "'></p>");
    output6 = ("<table id='table2" + cisloZadani + "'><tr></tr></table>");
    textRozdelovac = ("<div class='border-b mt20 mb20'></div>");
    pocetZadani = Number(input.value);
    for (let num = 0; num < pocetZadani; num++) {
        generator();
        vyrovnavac();
        zadani();
        vam();
        naklady();
        displayOutput();
        // textHolder = textHolder + ("<div id='tab" + cisloZadani + "' class='row'><div class='column'><p id='zadani" + cisloZadani + "'></p><table id='table" + cisloZadani + "'><tr></tr></table></div><div class='column'><p id='vysledky'></p><table id='table2'><tr></tr></table></div></div><span id='rozdelovac'></span>");
        textHolder = textHolder + ("<div id='tab' class='row'><div class='column'>");
        
        textHolder = textHolder + output;
        textHolder = textHolder + output4;
        textHolder = textHolder + ("</div><div class='column'>");
        
        textHolder = textHolder + output5;
        textHolder = textHolder + output6;
    
        textHolder = textHolder + ("</div></div>");
        //Vytvoří rozdělovač mezi zadáními
        textHolder = textHolder + textRozdelovac;

        holder.innerHTML = textHolder;
        
        cisloZadani += 1;
    }
    
    
}

//definice spouštěče funkce display
button.addEventListener("click", application);


