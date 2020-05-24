const domApi = (document => {                // IIFE (see chapter 1.3.2. )
    const createElement = document.createElement.bind(document);
    const querySelector = document.querySelector.bind(document);
    let $elem;
    const create = function createAndAppend($parent = 'body', content = '', tag = 'div', id = '', classes = '') {
        $parent = querySelector($parent);
        $elem = createElement(tag);
        $elem.textContent = content;
        $elem.id = id;
        $elem.class = classes;
        $parent.appendChild($elem);
    };
    const update = function findAndChange(selector, content = '') {
        $elem = querySelector(selector);
        if ($elem) $elem.textContent = content;
    };
    const remove = function findAndDelete(selector, content = '') {
        $elem = querySelector(selector);
        if ($elem) $elem.parentNode.removeChild($elem);
    };
    const setAttribute = function setAttribute(selector, attributeName = '', attributeValue = '') {
        $elem = querySelector(selector);
        $elem.setAttribute(attributeName, attributeValue);
    };
    const getAttribute = function getAttribute(selector, attributeName = '') {
        $elem = querySelector(selector);
        return $elem.getAttribute(attributeName);
    };
    return { create, update, remove, setAttribute, getAttribute };
})(document);

let memoryDescriptor = { initial: 100 };
let memory = new WebAssembly.Memory(memoryDescriptor);

const stringApi = (memory => {        // IIFE : memory is our WASM memory object (with a buffer field)
    const maxSize = new Uint8Array(memory.buffer).length;
    const encoder = new TextEncoder();        // UTF-8 by default
    const enc = encoder.encodeInto.bind(encoder);
    const decoder = new TextDecoder();        // UTF-8 by default
    const dec = decoder.decode.bind(decoder);
    let size, previousOffset, currentOffset = 0, nextOffset;        // respectively string size; last, current and future string addresses
    const map = {};        // for testing purpose : to store the correspondence between strings and offsets
    const encode = function utf8Encode(string, offset=currentOffset) {
         if (map[string]) {                // optimization
            return map[string];
         }
         size = new Blob([string]).size;        // an UTF-8 character can take several bytes so do not use string.length!
        // wasm need memory align, so for example '#testId', it needs allocate 8 bytes, and another 4 bytes for its length;
         nextOffset = currentOffset + 4 * (1 + Math.ceil(size / 4));
         if (offset % 4)    throw new Error('offset must be a multiple of 4!');
         if (size > maxSize || nextOffset > maxSize)    throw new Error('String is too big!');
         new Uint32Array(memory.buffer, offset, 4)[0] = size;           // 4 first bytes reserved for storing the string size (in bytes)
         enc(string, new Uint8Array(memory.buffer, 4 + offset) );
         map[string] = offset;
        previousOffset = offset;
         currentOffset = nextOffset;
         return offset;
    };
    const decode = function utf8Decode(offset=previousOffset) {
        [size] = new Uint32Array(memory.buffer, offset, 1);
        return dec( new Uint8Array(memory.buffer, offset + 4, size) );
    };
    // used after growing the memory,  for keeping the memory reference (previous reference lost)
    const setMemory = (newMemory) => { memory = newMemory };
    return { encode, decode, setMemory, map };
})(memory);

function mapStringsToOffsets(func) {                // func is as an example domApi.create
    // encode the strings inside the memory
    return (...offsetArguments) => {        // returned function is for instance domApi.create, accepting offsets instead of strings
        stringArguments = offsetArguments.map( offset => stringApi.decode(offset) );
        const result = func.apply(this, stringArguments);
        return (typeof result === 'string') ?                // convert the result to an offset if this is a string
             stringApi.encode(result)
            : result
    }
}

const mapOffsetsToStrings = func => (...stringArguments) => {
    offsetArguments = stringArguments.map( string => stringApi.encode(string) );
    return stringApi.decode( func.apply(this, offsetArguments) );
};

for (let key in domApi) {        // we overwrite the domApi so that its functions accept offsets as arguments.
    domApi[key] = mapStringsToOffsets(domApi[key]);
}