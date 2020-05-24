(module
    ;; type with index 0 in type list, as a signature for both stringApi.create and modifyDOM
    (type ( func (param i32 i32 i32 i32 i32) ) )
    ;; type with index 1 in type list, as a signature for stringApi.setAttribute
    (type ( func (param i32 i32 i32) ) )
    (import "string" "memory" (memory 100) )
    (import "domApi" "create" ( func (type 0) ) )                ;; function with index 0 in function list
    (import "domApi" "setAttribute" ( func (type 1) ) )        ;; function with index 1 in function list
    (func (type 0)                                        ;; function with index 2 in function list
        get_local 0
        get_local 1
        get_local 2
        get_local 3
        get_local 4
        call 0                ;; create new DOM node (call “create”)
        i32.const 0        ;; offset for '#testId'
        i32.const 12        ;; offset for 'style'
        i32.const 24        ;; offset for 'color:red'
        call 1                ;; change style attribute (call “setAttribute”)
    )
    (export "modifyDOM" (func 2))
)
