//Načtení elementů z html
var input = document.getElementById("pocetZadani");
var button = document.getElementById("button");
var holder = document.getElementById("holder");
var z = 0;

//Zadání minima a maxima generátoru
const min = 10;
const max = 40;

//funkce kontroly správného zadání
function control(m, n, pocetZadani) {
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
function generator(m, n) {
  Agen = Array(m).fill(0);
  Bgen = Array(n).fill(0);
  C = new Array(m);

  for (let i = 0; i < m; i++) Agen[i] = getRandomNumber(min, max) * 10;
  for (let i = 0; i < n; i++) Bgen[i] = getRandomNumber(min, max) * 10;
  for (let i = 0; i < m; i++) C[i] = new Array(n).fill(0);

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = getRandomNumber(1, 50);
    }
  }

  let zadaniZ = new Array(m);
  for (let i = 0; i < m; i++) zadaniZ[i] = new Array(n).fill(0); //Vytvoření prázdné matice nákladů

  return { Agen, Bgen, C, zadaniZ };
}

//funkce zápis hodnot zadání
function zadani(A, B, C, zadaniZ, cisloZadani, m, n) {
  // var output = document.getElementById("zadani" + cisloZadani);
  // var output4 = document.getElementById("table" + cisloZadani);

  let output = "<p id='zadani" + cisloZadani + "'></p>";
  let output4 = "<table id='table" + cisloZadani + "'><tr></tr></table>";

  let zadaniA = A;
  let zadaniB = B;
  let zadaniC = C;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      zadaniZ[i][j] = zadaniC[i][j];
    }
  }

  //Vyhodí nadpis Zadání
  let textZadani =
    "<h2>Zadání č. " +
    cisloZadani +
    " </h2><span>Vyřešte dopravní úlohu pomocí metody VAM. Vypočtěte objem přepravy a celkové přepravní náklady.</span>";
  output = output.substring(0, output.indexOf(">") + 1);
  output += textZadani;
  output += "</p>";
  //vyplnění table zadáním DOM HTML
  let tableZadani = [];
  tableZadani = "<td> &nbsp </td>";
  for (let i = 0; i < n; i++) {
    let x = i + 1;
    tableZadani += "<td>O<sub>" + x + "</sub></td>";
  }
  for (let i = 1; i < m + 1; i++) {
    tableZadani += "<tr>";
    tableZadani += "<td>D<sub>" + i + "</sub></td>";
    for (let j = 1; j < n + 1; j++) {
      let x = i - 1;
      let y = j - 1;
      tableZadani +=
        "<td class='upper-right'>&nbsp<sup>" + zadaniC[x][y] + "<sup></td>";
    }
    tableZadani += "<td>" + zadaniA[i - 1] + "</td>";
    tableZadani += "</tr>";
  }
  tableZadani += "<tr><td>&nbsp</td>";
  for (let i = 1; i < n + 1; i++) {
    tableZadani += "<td>" + zadaniB[i - 1] + "</td>";
  }
  tableZadani += "</tr>";
  output4 = output4.substring(0, output4.indexOf(">") + 1);
  output4 += tableZadani;
  output4 += "</table>";

  return { output, output4 };
}

//funkce vyrovnávač úloh
function vyrovnavac(A, B) {
  var sumA = A.reduce((a, b) => a + b, 0); //Sumace A
  var sumB = B.reduce((a, b) => a + b, 0); //Sumace B

  if (sumA > sumB) {
    for (let i = 0; i < B.length; i++) {
      B[i] += ~~((sumA - sumB) / n);
    }
  } else if (sumA < sumB) {
    for (let i = 0; i < A.length; i++) {
      A[i] += ~~((sumB - sumA) / n);
    }
  }

  //Ještě jednou projet, protože vznikne zbytek, a ten se přičtě k poslednímu číslu
  sumA = A.reduce((a, b) => a + b, 0); //Sumace A
  sumB = B.reduce((a, b) => a + b, 0); //Sumace B

  if (sumA > sumB) {
    B[n - 1] += sumA - sumB;
  } else if (sumA < sumB) {
    A[m - 1] += sumB - sumA;
  }

  return { A, B };
}

//funkce transpozice matice
function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i])); //Transpozice matice C
}

//funkce zjištění maximální diference včetně indexů (VAM)
function vam(A, B, C, m, n) {
  let X = [];
  for (let i = 0; i < m; i++) {
    X[i] = [];
    for (let j = 0; j < n; j++) {
      X[i][j] = 0;
    }
  }

  for (let x = 0; x < m + n - 1; x++) {
    //maximální diference řádků
    var diferenceRow = new Array(m);
    var hodnotaDiffRow = 0;
    var i2 = 1;
    for (let i = 0; i < m; i++) {
      let cRow = C[i]
        .slice()
        .sort((a, b) => a - b)
        .slice(0, 2);
      diferenceRow[i] = cRow[1] - cRow[0];
      if (hodnotaDiffRow < diferenceRow[i]) {
        hodnotaDiffRow = diferenceRow[i];
        i2 = i;
      } else if (hodnotaDiffRow > diferenceRow[i]) {
        hodnotaDiffRow = hodnotaDiffRow;
      } else if (hodnotaDiffRow == diferenceRow[i]) {
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
      let cCol = CT[j]
        .slice()
        .sort((a, b) => a - b)
        .slice(0, 2);
      diferenceCol[j] = cCol[1] - cCol[0];

      if (hodnotaDiffCol < diferenceCol[j]) {
        hodnotaDiffCol = diferenceCol[j];
        j2 = j;
      } else if (hodnotaDiffCol > diferenceCol[j]) {
        hodnotaDiffCol = hodnotaDiffCol;
      } else if (hodnotaDiffCol == diferenceCol[j]) {
        if (Math.min(...CT[j2]) > Math.min(...CT[j])) {
          hodnotaDiffCol = diferenceCol[j];
          j2 = j;
        } else {
          hodnotaDiffCol = hodnotaDiffCol;
        }
      }
    }

    //maximální diference celkem včetně indexů

    let i3 = 0;
    let j3 = 0;

    var hodnotaDiff;
    if (hodnotaDiffRow > hodnotaDiffCol) {
      hodnotaDiff = hodnotaDiffRow;
      i3 = i2;
      let chosenRowMin = Math.min(...C[i3]);
      j3 = C[i3].indexOf(chosenRowMin);
    } else if (hodnotaDiffRow < hodnotaDiffCol) {
      hodnotaDiff = hodnotaDiffCol;
      j3 = j2;
      let chosenColMin = Math.min(...CT[j3]);
      i3 = CT[j3].indexOf(chosenColMin);
    } else if (hodnotaDiffRow == hodnotaDiffCol) {
      if (Math.min(...C[i2]) > Math.min(...CT[j2])) {
        hodnotaDiff = hodnotaDiffRow;
        i3 = i2;
        let chosenRowMin = Math.min(...C[i3]);
        j3 = C[i3].indexOf(chosenRowMin);
      } else {
        hodnotaDiff = hodnotaDiffCol;
        j3 = j2;
        let chosenColMin = Math.min(...CT[j3]);
        i3 = CT[j3].indexOf(chosenColMin);
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

    if (B[j3] == 0) {
      for (let i = 0; i < m; i++) C[i][j3] = Infinity;
    }
    if (A[i3] == 0) {
      for (let j = 0; j < n; j++) C[i3][j] = Infinity;
    }
  }

  return { X };
}

//funkce výpočet Z nákladů
function naklady(X, zadaniZ, m, n) {
  var z = 0;
  let Z = new Array(m);
  for (let i = 0; i < m; i++) Z[i] = new Array(n).fill(0); //Vytvoření prázdné matice nákladů
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      Z[i][j] = zadaniZ[i][j] * X[i][j];
      var flat = Z.flat(Infinity);
      z = flat.reduce((total, num) => {
        return total + num;
      }, 0);
    }
  }
  return z;
}

//funkce display output výsledků
function displayOutput(A, B, C, zadaniZ, cisloZadani, m, n) {
  let { X } = vam(A, B, C, m, n);

  let output5 = "<p id='vysledky" + cisloZadani + "'></p>";
  let output6 = "<table id='table2" + cisloZadani + "'><tr></tr></table>";
  //Vyhodí nadpis Výsledky
  let textVysledky = "<h2>Výsledky č. " + cisloZadani + " </h2>";
  output5 = output5.substring(0, output5.indexOf(">") + 1);
  output5 += textVysledky;
  output5 += "</p>";

  //vyplnění table s výsledky zadáním DOM HTML
  let tableVysledky = [];
  tableVysledky = "<td> &nbsp </td>";
  for (let i = 0; i < n; i++) {
    let x = i + 1;
    tableVysledky += "<td>O<sub>" + x + "</sub></td>";
  }
  for (let i = 1; i < m + 1; i++) {
    tableVysledky += "<tr>";
    tableVysledky += "<td>D<sub>" + i + "</sub></td>";
    for (let j = 1; j < n + 1; j++) {
      let x = i - 1;
      let y = j - 1;
      if (X[x][y] == 0) {
        tableVysledky += "<td>&nbspx&nbsp</td>";
      } else {
        tableVysledky += "<td>" + X[x][y] + "</td>";
      }
    }
    tableVysledky += "</tr>";
  }
  let nn = n + 1;
  let zz = naklady(X, zadaniZ, m, n);
  let zRozdelene;

  zRozdelene = zz.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  tableVysledky +=
    "<tr><td colspan='" +
    nn +
    "'> Celkové náklady na přepravu = " +
    zRozdelene +
    " Kč</td></tr>";
  output6 = output6.substring(0, output6.indexOf(">") + 1);
  output6 += tableVysledky;
  output6 += "</table>";

  return { output5, output6 };
}

//funkce vytvoření PDF
function createPDF() {
  var sTable = document.getElementById("holder").innerHTML;

  var style = "<style>";
  style = style + "body {font-family:Verdana, Geneva, Tahoma, sans-serif;}";
  style = style + "table {border-collapse: collapse;}";
  style = style + "table, td {border: solid 1px;}";
  style = style + "td {padding: 1vw;}";
  style =
    style +
    "td.upper-right {text-align: right; vertical-align: top; padding: 5px;}";
  style = style + "@media print {#tab {page-break-after: always;}}";
  // style = style + "@media print {#tab {page-break-before: always;}}";
  style = style + "@media print {#table1 {page-break-after: always;}}";
  //style = style + "padding: 2px 3px;text-align: center;}";
  style = style + "</style>";

  // CREATE A WINDOW OBJECT.
  var win = window.open("", "", "height=700,width=700");

  win.document.write("<html><head>");
  //win.document.write('<title>Zadání</title>');   // <title> FOR PDF HEADER.
  win.document.write(style); // ADD STYLE INSIDE THE HEAD TAG.
  win.document.write("</head>");
  win.document.write("<body>");
  win.document.write(sTable); // THE TABLE CONTENTS INSIDE THE BODY TAG.
  win.document.write("</body></html>");

  win.document.close(); // CLOSE THE CURRENT WINDOW.

  win.print(); // PRINT THE CONTENTS.
}

//Celková funkce spouštějící aplikaci
function application() {
  let pocetZadani = Number(input.value);
  var m = Number(document.getElementById("m").value); //Počet řádků/zdrojů
  var n = Number(document.getElementById("n").value); //Počet sloupců/odběratelů

  control(m, n, pocetZadani);

  let cisloZadani = 1;
  let textHolder = "";
  let textRozdelovac = "<div class='border-b mt20 mb20'></div>";

  for (let num = 0; num < pocetZadani; num++) {
    let { Agen, Bgen, C, zadaniZ } = generator(m, n);
    let { A, B } = vyrovnavac(Agen, Bgen);
    let { output, output4 } = zadani(A, B, C, zadaniZ, cisloZadani, m, n);
    let { output5, output6 } = displayOutput(
      A,
      B,
      C,
      zadaniZ,
      cisloZadani,
      m,
      n
    );
    // textHolder = textHolder + ("<div id='tab" + cisloZadani + "' class='row'><div class='column'><p id='zadani" + cisloZadani + "'></p><table id='table" + cisloZadani + "'><tr></tr></table></div><div class='column'><p id='vysledky'></p><table id='table2'><tr></tr></table></div></div><span id='rozdelovac'></span>");
    textHolder = textHolder + "<div id='tab' class='row'><div class='column'>";

    textHolder = textHolder + output;
    textHolder = textHolder + output4;
    textHolder = textHolder + "</div><div class='column'>";

    textHolder = textHolder + output5;
    textHolder = textHolder + output6;

    textHolder = textHolder + "</div></div>";
    //Vytvoří rozdělovač mezi zadáními
    textHolder = textHolder + textRozdelovac;

    holder.innerHTML = textHolder;

    cisloZadani += 1;
  }
}

//definice spouštěče funkce display
button.addEventListener("click", application);
