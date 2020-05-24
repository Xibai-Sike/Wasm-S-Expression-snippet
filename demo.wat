(module
    (type
        (func (param i32 i32) (result i32)))
    (func (type 0)
        get_local 0
        get_local 1
        i32.div_s
    )
    (export "divide" (func 0))
)