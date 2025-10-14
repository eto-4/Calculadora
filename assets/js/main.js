
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
    {label: 'MC', value: 'mem-clear', type: 'func'},
    {label: 'MR', value: 'mem-recall', type: 'func'},
    {label: 'M+', value: 'mem-add', type: 'func'},
    {label: 'M-', value: 'mem-sub', type: 'func'},

    // --- Operadors bàsics ---
    {label: '%', value: '%', type: 'op'},
    {label: '÷', value: '/', type: 'op'},
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
    {label: '+/-', value: 'neg', type: 'func'},
    {label: '.', value: '.', type: 'func'},
    {label: '=', value: 'result', type: 'func'},
];

// Constants

const KeyContainer = document.getElementById("keys");
const DisplayNumber = document.getElementById("display");

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
    
    // opButton.addEventListener("click", () => {
    //     console.log(value);
    //     console.log(type);
    // });


    return opButton;    
}

function buttonAction(value, type) {
    switch(type) {
        case 'num': agregarNumero(value); break;
        case 'op': agregarOperacio(value); break;
        case 'func': executarFuncio(value); break;
    }
}

// Valor guardat en la memoria.
const memory = 0;

const pNumero = "";
const operacio = "";
const sNumero = "";


function agregarNumero(value) {
    display = document.getElementById("displayingNbs");

    display.textContent += value;
}

function agregarOperacio(value) {

}

function executarFuncio(value) {

}

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