(module
    (type ( func (param i32 i32 i32 i32 i32) ) )
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
            call 0                ;; create new DOM node
            i32.const 34        ;; offset corresponding to the second ‘r’ letter   'color:red                       '
            i32.const 1702194274        ;; 32-bit value to be replaced in the memory at the offset 34
            i32.store offset=0 align=1               ;; store value at offset 34 (0 0 are alignment and relative offset
                                ;; see chapter 2.2.3.6.3. for explanations about these values)
            i32.const 0        ;; offset for '#testId'
            i32.const 12        ;; offset for 'style'
            i32.const 24        ;; offset for 'color:red     ‘, changed to ‘color:blue     ‘
            call 1                ;; change style attribute
    )
    (export "modifyDOM" (func 2))
)
