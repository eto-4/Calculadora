
// Layout
const keyLayout = [
    ['MR','M+','M-','%'],
    ['7','8','9','/'],
    ['4','5','6','*'],
    ['1','2','3','-'],
    ['0','.','=', '+']
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

// Functions

// Creació de botons
function crearBoto({label, value, type}) {
    const opButton = document.createElement("div");
    opButton.label = label;
    opButton.value = value;
    opButton.type = type;

    opButton.classlist = key 
}
