files=demo demo_suger wasm_global wasm_import wasm_dom wasm_store

demo: demo.wat
	wat2wasm demo.wat
demo_suger: demo_suger.wat
	wat2wasm demo_suger.wat
wasm_global: wasm_global.wat
	wat2wasm wasm_global.wat
wasm_import: wasm_import.wat
	wat2wasm wasm_import.wat
wasm_dom: dom/wasm_dom.wat
	wat2wasm dom/wasm_dom.wat
wasm_store: dom/wasm_store.wat
	wat2wasm dom/wasm_store.wat

all: $files

.PHONY: $files