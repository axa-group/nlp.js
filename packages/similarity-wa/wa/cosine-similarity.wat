(module 
    (memory (import "js" "mem") 1)

    (func $vecMagnitude (param $start i32) (param $len i32) (result f64)
        (local $sum f64)
        (local $i i32)
        (local $value f64)

        (set_local $sum (f64.const 0))
        (set_local $i (i32.const 0))
        (block $loopExit
            (loop $loop
                ;; if (i == vec.length) exit loop
                (br_if $loopExit (i32.gt_u (get_local $i) (get_local $len)))

                ;; sum += vec[i] * vec[i];
                (set_local $sum
                    (f64.add
                        (get_local $sum)
                        (f64.mul
                            (tee_local $value (f64.load (i32.add (get_local $i) (get_local $start))))
                            (get_local $value)
                        )
                    )
                )

                ;; i = i + 1
                (set_local $i (i32.add (get_local $i) (i32.const 1)))
                (br $loop)
            )
        )

        (f64.sqrt (get_local $sum))
    )

    (func $vecDotProduct (param $len0 i32) (param $len1 i32) (result f64)
        (local $product f64)
        (local $i i32)

        (set_local $product (f64.const 0))
        (set_local $i (i32.const 0))

        (block $loopExit
            (loop $loop
                ;; if (i == vec.length) exit loop
                (br_if $loopExit (i32.gt_u (get_local $i) (get_local $len0)))

                ;; sum += vec[i] * vec[i];
                (set_local $product
                    (f64.add
                        (get_local $product)
                        (f64.mul
                            (f64.load (get_local $i))
                            (f64.load (i32.add (get_local $i) (get_local $len0)))
                        )
                    )
                )

                ;; i = i + 1
                (set_local $i (i32.add (get_local $i) (i32.const 1)))
                (br $loop)
            )
        )

        (get_local $product)
    )

    (func $cosineSimilarity (param $len0 i32) (param $len1 i32) (result f64)
        ;; vecDotProduct(vecA, vecB) / (this.vecMagnitude(vecA) * this.vecMagnitude(vecB))
        (f64.div
            (call $vecDotProduct (get_local $len0) (get_local $len1))
            (f64.mul
                (call $vecMagnitude (i32.const 0) (get_local $len0))
                (call $vecMagnitude (get_local $len0) (get_local $len1))
            )
        )
    )

    (export "cosineSimilarity" (func $cosineSimilarity))
    (export "vecMagnitude" (func $vecMagnitude))
    (export "vecDotProduct" (func $vecDotProduct))
)
