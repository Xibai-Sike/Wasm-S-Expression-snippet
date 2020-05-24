#include "stdio.h"

#ifdef __EMSCRIPTEN__
  #include <dlfcn.h>
  #include <emscripten.h>
#endif

typedef int(*Add)(int,int);

void CalculateAdd(const char* file_name)
{
  void* handle = dlopen(file_name, RTLD_NOW);
  if (handle == NULL) { return; }

  Add add = (Add)dlsym(handle, "add");
  if (add == NULL) { return; }

  printf("add(1,2): %d\n", add(1,2));

  dlclose(handle);
}

int load()
{
  printf("start to loading\n");
  emscripten_async_wget("lib.wasm", "lib.wasm", CalculateAdd, NULL);

  return 0;
}