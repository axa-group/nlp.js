(module 
    (memory (import "js" "mem") 1)

    (func $vecMagnitude (param $start i32) (param $len i32) (result f32)
        (local $sum i32)
        (local $i i32)
        (local $value i32)
        (local $max_len i32)
        (local $start_offs i32)

        (set_local $max_len (i32.mul (i32.const 4) (get_local $len)))
        (set_local $start_offs (i32.mul (i32.const 4) (get_local $start)))

        (set_local $sum (i32.const 0))
        (set_local $i (i32.const 0))
        (block $loopExit
            (loop $loop
                ;; if (i == vec.length) exit loop
                (br_if $loopExit (i32.eq (get_local $i) (get_local $max_len)))

                ;; sum += vec[i] * vec[i];
                (set_local $sum
                    (i32.add
                        (get_local $sum)
                        (i32.mul
                            (tee_local $value (i32.load (i32.add (get_local $i) (get_local $start_offs))))
                            (get_local $value)
                        )
                    )
                )

                ;; i = i + 1
                (set_local $i (i32.add (get_local $i) (i32.const 4)))
                (br $loop)
            )
        )

        (f32.sqrt (f32.convert_u/i32 (get_local $sum)))
    )

    (func $vecDotProduct (param $len0 i32) (param $len1 i32) (result i32)
        (local $product i32)
        (local $i i32)
        (local $max_len i32)

        (set_local $max_len (i32.mul (i32.const 4) (get_local $len0)))
        (set_local $product (i32.const 0))
        (set_local $i (i32.const 0))

        (block $loopExit
            (loop $loop
                ;; if (i == vec.length) exit loop
                (br_if $loopExit (i32.eq (get_local $i) (get_local $max_len)))

                ;; sum += vec[i] * vec[i];
                (set_local $product
                    (i32.add
                        (get_local $product)
                        (i32.mul
                            (i32.load (get_local $i))
                            (i32.load (i32.add (get_local $i) (get_local $max_len)))
                        )
                    )
                )

                ;; i = i + 1
                (set_local $i (i32.add (get_local $i) (i32.const 4)))
                (br $loop)
            )
        )

        (get_local $product)
    )

    (func $cosineSimilarity (param $len0 i32) (param $len1 i32) (result f32)
        ;; vecDotProduct(vecA, vecB) / (this.vecMagnitude(vecA) * this.vecMagnitude(vecB))
        (f32.div
            (f32.convert_u/i32 (call $vecDotProduct (get_local $len0) (get_local $len1)))
            (f32.mul
                (call $vecMagnitude (i32.const 0) (get_local $len0))
                (call $vecMagnitude (get_local $len0) (get_local $len1))
            )
        )
    )

    (export "cosineSimilarity" (func $cosineSimilarity))
    (export "vecMagnitude" (func $vecMagnitude))
    (export "vecDotProduct" (func $vecDotProduct))
)
