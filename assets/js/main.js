/*****************************************************
 * CALCULADORA JAVASCRIPT
 * Índex de Funcions:
 * 1. crearBoto ---------------------- Creació de botons
 * 2. buttonAction ------------------- Gestió de clics
 * 3. agregarNumero ------------------ Afegir numeros
 * 4. agregarOperacio ---------------- Afegir operació
 * 5. returnResult ------------------- Calcula resultat
 * 6. updateDisplay ------------------ Actualitza pantalla
 * 7. sleep -------------------------- Funció utilitat per esperar
 * 8. showMemoryBanner --------------- Mostra / amaga la memòria
 * 9. memoryTabManagement ------------ Gestiona historial / memòria
 * 10. executarFuncio ---------------- Executa funcions especials (=, MR, M+, M-, etc)
 * 11. actualitzarContador ----------- Actualitza el rellotge del temps total
 *****************************************************/

/***************
 * LAYOUT DE TECLAT
 ***************/
const keyLayout = [
    ['MR','M+','M-','%'],
    ['7','8','9','×'],
    ['4','5','6','-'],
    ['1','2','3','+'],
    ['+/-','0','.', '=']
];

/***********************
 * DEFINICIÓ DE TECLAS
 ***********************/
const keys = [
    // Memòria
    {label: 'MC', value: 'MC', type: 'func'},
    {label: 'MR', value: 'MR', type: 'func'},
    {label: 'M+', value: 'M+', type: 'func'},
    {label: 'M-', value: 'M-', type: 'func'},

    // Operadors
    {label: '%', value: '/', type: 'op'},
    {label: '×', value: '*', type: 'op'},
    {label: '-', value: '-', type: 'op'},
    {label: '+', value: '+', type: 'op'},

    // Nombres
    {label: '7', value: '7', type: 'num'},
    {label: '8', value: '8', type: 'num'},
    {label: '9', value: '9', type: 'num'},
    {label: '4', value: '4', type: 'num'},
    {label: '5', value: '5', type: 'num'},
    {label: '6', value: '6', type: 'num'},
    {label: '1', value: '1', type: 'num'},
    {label: '2', value: '2', type: 'num'},
    {label: '3', value: '3', type: 'num'},
    {label: '0', value: '0', type: 'num'},

    // Funcions Addicionals
    {label: '+/-', value: '+/-', type: 'func'},
    {label: '.', value: '.', type: 'func'},
    {label: '=', value: '=', type: 'func'},
];

/***********************
 * CONSTANTS DE DOM
 ***********************/
const KeyContainer = document.getElementById("keys");
const DisplayLastOp = document.getElementById("lastOP");
const DisplayNumber = document.getElementById("displayingNbs");

/***********************
 * VARIABLES GLOBALS
 ***********************/
let memory = 0;                  // Valor guardat en memòria
let pNumero = null;              // Primer número de l'operació
let operacio = null;             // Operador actual
let sNumero = null;              // Segon número
let resultat = null;             // Resultat de la operació
let segonNumero = false;          // Flag si estem introduint segon número
let inputNumbers = '';            // Número introduït actual
let userInputView = '';           // String que es mostra a la pantalla
let historialOperacions = [];     // Array historial de calculs
let pestañaActual = 'historial'; // Pestanya actual de memòria/historial

/********************************************
 * 1. CREACIÓ DE BOTONS
 ********************************************/
function crearBoto(obj) {
    const opButton = document.createElement("div");
    const label = opButton.dataset.label = obj.label;
    const value = opButton.dataset.value = obj.value;
    const type = opButton.dataset.type = obj.type;
    opButton.textContent = label;
    opButton.classList.add('key', type);
    opButton.addEventListener("click", () => buttonAction(value, type));
    return opButton;    
}

// Afegir botons al DOM segons keyLayout
keyLayout.forEach(key => {
    key.forEach(keyV => {
        keys.forEach(keyN => {
            if (keyV === keyN["label"]) {
                const btnOption = crearBoto(keyN);
                KeyContainer.appendChild(btnOption);
            };
        });
    });
});

/********************************************
 * 2. GESTIÓ DE CLICS DE BOTONS
 ********************************************/
function buttonAction(value, type) {
    switch(type) {
        case 'num': agregarNumero(value); break;
        case 'op': agregarOperacio(value); break;
        case 'func': executarFuncio(value); break;
    }
}

/********************************************
 * 3. AFEGIR NUMEROS
 ********************************************/
function agregarNumero(value) {
    /***
     * Afegim numeros a inputNumbers i userInputView
     * Actualitza sNumero si estem introduint segon número
    */
    if (segonNumero && inputNumbers === '') {
        inputNumbers = value;
        userInputView = DisplayNumber.textContent + value;
    } else if (resultat !== null && !segonNumero) {
        inputNumbers = value;
        userInputView = value;
    } else {
        inputNumbers += value;
        userInputView += value;
    }

    if (segonNumero) sNumero = parseFloat(inputNumbers);

    updateDisplay();
}

/********************************************
 * 4. AFEGIR OPERACIÓ
 ********************************************/
function agregarOperacio(value) {
    /***
     * Assigna l'operador i prepara variables per segon número
     */
    if (inputNumbers === '' && resultat === null) return;

    if (!segonNumero) {
        pNumero = parseFloat(inputNumbers);
    } else if (segonNumero && inputNumbers !== '') {
        sNumero = parseFloat(inputNumbers);
        resultat = returnResult(pNumero, operacio, sNumero);
        pNumero = resultat;

        const opAnterior = keys.find(key => key.value === operacio && key.type === 'op');
        DisplayLastOp.textContent = `${pNumero} ${opAnterior ? opAnterior.label : operacio} ${sNumero} =`;
    }

    operacio = value;
    segonNumero = true;

    const nuevaOp = keys.find(key => key.value === value && key.type === 'op');
    const simboloOp = nuevaOp ? nuevaOp.label : value;

    userInputView = (inputNumbers !== '' ? inputNumbers : pNumero) + simboloOp;

    inputNumbers = '';
    sNumero = null;
    resultat = null;

    updateDisplay();
}

/********************************************
 * 5. CALCULA RESULTAT
 ********************************************/
function returnResult(pNumero, operacio, sNumero) {
    /***
     * Retorna el resultat de pNumero operacio sNumero
     */
    const pN = parseFloat(pNumero);
    const sN = parseFloat(sNumero);
    
    switch (operacio) {
        case '+': return pN + sN;
        case '-': return pN - sN;
        case '*': return pN * sN;
        case '/': return sN !== 0 ? pN / sN : 'Error';
        default: return 'Error';
    }
}

/********************************************
 * 6. ACTUALITZA PANTALLA
 ********************************************/
function updateDisplay() {
    /***
     * Mostra userInputView a la pantalla
     */
    DisplayNumber.textContent = userInputView || '0';
}

/********************************************
 * 7. UTILITAT PER ESPERAR
 ********************************************/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/********************************************
 * 8. MOSTRA / AMAGA MEMÒRIA AMB ANIMACIÓ
 ********************************************/
const pin = document.getElementById("memoPin");
const memoryDisplay = document.querySelector(".memoryDisplay");
const memoryPin = document.querySelector(".memoPin");

memoryDisplay.style.transition = "transform 0.5s ease, opacity 0.5s ease";
memoryPin.style.transition = "transform 0.5s ease";

let memoryVisible = false;

pin.addEventListener("click", showMemoryBanner);

async function showMemoryBanner() {
    if (!memoryVisible) {
        // Mostrar
        memoryDisplay.style.display = "grid"; 
        await new Promise(r => requestAnimationFrame(r)); // garantir render inicial

        memoryDisplay.style.transform = "translateX(0)";
        memoryDisplay.style.opacity = "1";
        memoryDisplay.style.pointerEvents = "auto";

        memoryPin.style.transform = "translateY(-20vh)";
        
        await new Promise(r => setTimeout(r, 500)); // esperar transició

        memoryPin.style.transform = "translateX(0)";
        memoryVisible = true;
    } else {
        // Amagar
        memoryDisplay.style.transform = "translateX(-100%)";
        memoryDisplay.style.opacity = "0";
        memoryDisplay.style.pointerEvents = "none";

        memoryPin.style.transform = "translateY(-20vh)";

        await new Promise(r => setTimeout(r, 500)); // esperar transició
        memoryDisplay.style.display = "none";
        memoryPin.style.transform = "translateX(0)";
        memoryVisible = false;
    }
}

/********************************************
 * 9. GESTIÓ HISTORIAL / MEMÒRIA
 ********************************************/
function memoryTabManagement() {
    const historialTab = document.getElementById("windowSelectedHis");
    const memoriaTab = document.getElementById("windowSelectedMem");
    const content = document.querySelector(".memoryDisplay .content");

    function renderContent() {
        content.innerHTML = '';
        if (pestañaActual === 'historial') {
            if (historialOperacions.length === 0) {
                content.textContent = 'Encara no hi ha historial.';
                return;
            }
            historialOperacions.forEach(op => {
                const opDiv = document.createElement('div');
                opDiv.classList.add('historialItem');

                const operacioDiv = document.createElement('div');
                operacioDiv.classList.add('operacio');
                operacioDiv.textContent = op.operacio;

                const resultatDiv = document.createElement('div');
                resultatDiv.classList.add('resultat');
                resultatDiv.textContent = op.resultat;

                opDiv.appendChild(operacioDiv);
                opDiv.appendChild(resultatDiv);
                content.appendChild(opDiv);
            });
        } else {
            const memDiv = document.createElement('div');
            memDiv.classList.add('memoryItem');

            const valorDiv = document.createElement('div');
            valorDiv.classList.add('memoryValue');
            valorDiv.textContent = memory;

            const botonesDiv = document.createElement('div');
            botonesDiv.classList.add('memoryButtons');

            ['MC','M+','M-'].forEach(func => {
                const btn = document.createElement('div');
                btn.classList.add('memoryBtn');
                btn.textContent = func;
                btn.addEventListener('click', () => executarFuncio(func));
                botonesDiv.appendChild(btn);
            });

            memDiv.appendChild(valorDiv);
            memDiv.appendChild(botonesDiv);
            content.appendChild(memDiv);
        }

        historialTab.classList.toggle('selected', pestañaActual === 'historial');
        memoriaTab.classList.toggle('selected', pestañaActual === 'memoria');
    }

    historialTab.addEventListener('click', () => {
        pestañaActual = 'historial';
        renderContent();
    });

    memoriaTab.addEventListener('click', () => {
        pestañaActual = 'memoria';
        renderContent();
    });

    renderContent();
    return renderContent;
}

const updateMemoryDisplay = memoryTabManagement();

/********************************************
 * 10. EXECUTA FUNCIONS (=, MR, M+, M-, etc)
 ********************************************/
function executarFuncio(value) {
    switch (value) {
        case '=':
            if (pNumero !== null && operacio !== null && inputNumbers !== '') {
                sNumero = parseFloat(inputNumbers);
                resultat = returnResult(pNumero, operacio, sNumero);

                const opObj = keys.find(k => k.value === operacio && k.type === 'op');
                const simboloOp = opObj ? opObj.label : operacio;

                DisplayLastOp.textContent = `${pNumero} ${simboloOp} ${sNumero} =`;

                historialOperacions.push({
                    operacio: `${pNumero} ${simboloOp} ${sNumero} =`,
                    resultat: resultat
                });

                userInputView = resultat.toString();
                pNumero = resultat;
                inputNumbers = resultat.toString();
                segonNumero = false;
                operacio = null;
                sNumero = null;
            }
            break;

        case '.':
            if (!inputNumbers.includes('.')) {
                inputNumbers = inputNumbers === '' ? '0.' : inputNumbers + '.';
                userInputView = inputNumbers;
            }
            break;

        case '+/-':
            if (inputNumbers !== '' && inputNumbers !== '0') {
                inputNumbers = (-parseFloat(inputNumbers)).toString();
                userInputView = inputNumbers;
            }
            break;

        case 'MC':
            memory = 0; break;

        case 'MR':
            if (memory !== 0) {
                inputNumbers = memory.toString();
                userInputView = inputNumbers;
                if (!segonNumero) pNumero = memory;
                if (segonNumero) sNumero = memory;
            }
            break;

        case 'M+':
            if (inputNumbers !== '') memory += parseFloat(inputNumbers);
            break;
        case 'M-':
            if (inputNumbers !== '') memory -= parseFloat(inputNumbers);
            break;
    }

    updateMemoryDisplay();
    updateDisplay();
}

/********************************************
 * 11. ACTUALITZAR RELLOTGE
 ********************************************/
function actualitzarContador() {
    const hora = document.getElementById("hora");
    const minut = document.getElementById("minut");
    const segon = document.getElementById("segon");

    let nHora = Number(hora.textContent);
    let nMinut = Number(minut.textContent);
    let nSegon = Number(segon.textContent);

    nSegon += 1;

    if (nSegon === 60) {
        nSegon = 0;
        nMinut += 1;
    } 
    if (nMinut === 60) {
        nMinut = 0;
        nHora += 1;
    }
    if (nHora === 24) {
        nHora = 0;
    }

    // Mostrar dos digits
    hora.textContent = String(nHora).padStart(2, '0');
    minut.textContent = String(nMinut).padStart(2, '0');
    segon.textContent = String(nSegon).padStart(2, '0');
}


/********************************************
 * DETECCIÓ DE TECLES.
 ********************************************/
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // --- Números ---
    if (!isNaN(key) && key !== ' ') { // detecta 0-9
        agregarNumero(key);
        return;
    }

    // --- Operacions ---
    if (['+', '-', '*', '/'].includes(key)) {
        agregarOperacio(key);
        return;
    }

    // --- Funcions especials ---
    switch (key) {
        case 'Enter':
        case '=':
            event.preventDefault();
            executarFuncio('=');
            break;

        case '.':
            executarFuncio('.');
            break;

        case 'm': //MR
        case 'M':
            executarFuncio('MR');
            break;

        case 'c': // C (clear de memory) 
        case 'C':
            executarFuncio('MC');
            break;

        case 'n': // canviar signe (+/-)
        case 'N':
            executarFuncio('+/-');
            break;

        default:
            // Altres tecles
            break;
    }
});

// Actualitzar funcions només obrir la pàgina.
setInterval(actualitzarContador, 1000);
updateMemoryDisplay();
updateDisplay();