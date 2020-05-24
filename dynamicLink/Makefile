dynamiclib: dynamicLibraries/lib.c
	emcc -s SIDE_MODULE dynamicLibraries/lib.c -o lib.wasm

dynamicmain: dynamicLibraries/main.c
	emcc dynamicLibraries/main.c -s MAIN_MODULE=1\
		-s RUNTIME_LINKED_LIBS=['lib.wasm'] \
		-s EXPORTED_FUNCTIONS=['_putchar','_main'] -o main.html


dlopenlib: dlopen/lib.c
	emcc -s SIDE_MODULE dlopen/lib.c -o lib.wasm

dlopenmain: dlopen/main.c
	emcc dlopen/main.c -s MAIN_MODULE=1\
		-s RUNTIME_LINKED_LIBS=['lib.wasm'] \
		-s EXPORTED_FUNCTIONS=['_putchar','_add'] -o main.html

dynamic: dynamiclib dynamicmain

dlopen: dlopenlib dlopenmain

clean:
	rm -rf *.wasm *.js *.html

.PHONY: lib main clean