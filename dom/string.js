var domWasmInstance, domStoreWasmInstance;

var modifyDOM, modifyDOMStore;

async function domWasm() {
    const wasmImport = { domApi, string: { memory } };
    stringApi.encode('#testId');                // offset: 0
    stringApi.encode('style');                // offset: 12
    stringApi.encode('color:red                         ');        // offset: 24
    let bytes = await fetch('wasm_dom.wasm').then((res) => res.arrayBuffer());
    let { instance } = await WebAssembly.instantiate(bytes, wasmImport);
    console.log('var domWasmInstance = ', instance);
    domWasmInstance = instance;
    modifyDOM = mapOffsetsToStrings(instance.exports.modifyDOM);
    modifyDOM('body', 'Accessing the DOM from a WASM module!', 'div', 'testId', '');
    return instance;
}

async function domStoreWasm() {
    const wasmImport = { domApi, string: { memory } };
    stringApi.encode('#testId');                // offset: 0
    stringApi.encode('style');                // offset: 12
    stringApi.encode('color:red                         ');        // offset: 24
    let bytes = await fetch('wasm_store.wasm').then((res) => res.arrayBuffer());
    let { instance } = await WebAssembly.instantiate(bytes, wasmImport);
    console.log('var domStoreWasmInstance = ', instance);
    domStoreWasmInstance = instance;
    modifyDOMStore = mapOffsetsToStrings(instance.exports.modifyDOM);
    modifyDOMStore('body', 'Accessing the DOM from a WASM module!', 'div', 'testId', '');
    return instance;
}