
// Layout
const keyLayout = [
    ['MR','M+','M-','%'],
    ['7','8','9','×'],
    ['4','5','6','-'],
    ['1','2','3','+'],
    ['+/-','0','.', '=']
];


// Funcionalitats
const keys = [

    // --- Funcions de memòria ---
    {label: 'MC', value: 'MC', type: 'func'},
    {label: 'MR', value: 'MR', type: 'func'},
    {label: 'M+', value: 'M+', type: 'func'},
    {label: 'M-', value: 'M-', type: 'func'},

    // --- Operadors bàsics ---
    {label: '%', value: '/', type: 'op'},
    {label: '×', value: '*', type: 'op'},
    {label: '-', value: '-', type: 'op'},
    {label: '+', value: '+', type: 'op'},

    // --- Números ---
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

    // --- Funcions Adicionals ---
    {label: '+/-', value: '+/-', type: 'func'},
    {label: '.', value: '.', type: 'func'},
    {label: '=', value: '=', type: 'func'},
];

// Constants
const KeyContainer = document.getElementById("keys");
const DisplayLastOp = document.getElementById("lastOP");
const DisplayNumber = document.getElementById("displayingNbs");

// Functions

// Creació de botons
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

// Creació de Botons amb forEach
keyLayout.forEach(key => {
    key.forEach(keyV => {

        console.log(keyV);
        keys.forEach(keyN => {
        
            if (keyV === keyN["label"]) {
        
                console.log(keyN);
        
                const btnOption = crearBoto(keyN);
                KeyContainer.appendChild(btnOption);
            };
        });
    });
});

// Llogica
function buttonAction(value, type) {
    switch(type) {
        case 'num': agregarNumero(value); break;
        case 'op': agregarOperacio(value); break;
        case 'func': executarFuncio(value); break;
    }
}

// Valor guardat en la memoria.
let memory = 0;

// Variables necessaries per el calcul:
let pNumero = null;
let operacio = null;
let sNumero = null;
let resultat = null;
let segonNumero = false;

// Variable per cada numero de la operació
let inputNumbers = '';

// Numero / Operació que es mostra per pantalla.
let userInputView = '';

function agregarNumero(value) {
    /*** 
     * Afegint els numeros a les segúents variables:
     *  InputNumbers & UserInputView
     * També s'en carrega de la assignació del valor de SegonNumero.
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
    
    if (segonNumero) {
        sNumero = parseFloat(inputNumbers);
    }

    updateDisplay();
}

function agregarOperacio(value) {
    /***
     * Agregar la operació a la variable: {operació} i assignarli el valor del label per el UserInputView
     * Nateja InputNumbers per començar a introduïr numeros a sNumero. i nateja sNumero per si fem més d'una equació
    */

    if (inputNumbers === '') return;
    
    if (pNumero === null) {
        pNumero = parseFloat(inputNumbers);
    } else if (segonNumero && sNumero !== null) {
        resultat = returnResult(pNumero, operacio, sNumero);
        pNumero = resultat;
        
        const opAnterior = keys.find(key => key.value === operacio && key.type === 'op');
        DisplayLastOp.textContent = `${pNumero} ${opAnterior ? opAnterior.label : operacio} ${sNumero} =`;
    }
    
    operacio = value;
    segonNumero = true;
    
    const nuevaOp = keys.find(key => key.value === value && key.type === 'op');
    const simboloOp = nuevaOp ? nuevaOp.label : value;
    
    if (resultat !== null) {
        userInputView = resultat + simboloOp;
        resultat = null;
    } else {
        userInputView = pNumero + simboloOp;
    }
    
    inputNumbers = '';
    sNumero = null;
    updateDisplay();
}

function executarFuncio(value) {
    /***
     * S'encarrega de gestionar els tipus de operacions/funcions que l'usuari vulgui executar.
     */

    switch (value) {
        case '=': 
            if (pNumero !== null && operacio !== null && inputNumbers !== '') {
                sNumero = parseFloat(inputNumbers);
                resultat = returnResult(pNumero, operacio, sNumero);
                
                const opObj = keys.find(key => key.value === operacio && key.type === 'op');
                const simboloOp = opObj ? opObj.label : operacio;
                
                DisplayLastOp.textContent = `${pNumero} ${simboloOp} ${sNumero} =`;
                
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
                if (inputNumbers === '') {
                    inputNumbers = '0.';
                    userInputView = userInputView === '0' ? '0.' : userInputView + '0.';
                } else {
                    inputNumbers += '.';
                    userInputView += '.';
                }
            }
            break;
            
        case '+/-':
            if (inputNumbers !== '' && inputNumbers !== '0') {
                inputNumbers = (-parseFloat(inputNumbers)).toString();
                userInputView = inputNumbers;
            }
            break;
            
        case 'MC': 
            memory = 0;
            break;
        case 'MR': 
            if (memory !== 0) {
                inputNumbers = memory.toString();
                userInputView = inputNumbers;
            }
            break;
        case 'M+': 
            if (inputNumbers !== '') {
                memory += parseFloat(inputNumbers);
            }
            break;
        case 'M-': 
            if (inputNumbers !== '') {
                memory -= parseFloat(inputNumbers);
            }
            break;
    }
    updateDisplay();
}

function returnResult(pNumero, operacio, sNumero) {
    /***
     * Calcula I retorna el resultat de la operació.
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

function updateDisplay() {
    /***
     * Actualitza la vista de la calculadora (id=displayingNum).
     */
    DisplayNumber.textContent = userInputView || '0';
}

updateDisplay();