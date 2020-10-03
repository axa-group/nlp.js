(module 
    (memory (import "js" "mem") 1)
    (import "console" "log" (func $log (param i32) (param i32)))

    (func $levenshtein (param $len0 i32) (param $len1 i32) (result i32)
        (local $prevRow i32)
        (local $curCol i32)
        (local $nextCol i32)
        (local $i i32)
        (local $j i32)
        (local $c0 i32)
        (local $c1 i32)
        (local $tmp i32)
        (local $return i32)

        (block $exit
            ;; if len0 == 0 return len1
            (if (i32.eq (get_local $len0) (i32.const 0))
                (then 
                    (set_local $return (get_local $len1))
                    (br $exit)
                )
            )

            ;; if len1 == 0 return len0
            (if (i32.eq (get_local $len1) (i32.const 0))
                (then
                    (set_local $return (get_local $len0))
                    (br $exit)
                )
            )

            ;; prevRow = [n+1]
            (set_local $prevRow
                (i32.add 
                    (get_local $len0)
                    (get_local $len1)
                )
            )

            ;; i = 0
            (set_local $i (i32.const 0))
            (block $initLoopExit
                (loop $initLoop
                    ;; if (i == len1) exit loop
                    (br_if $initLoopExit (i32.gt_u (get_local $i) (get_local $len1)))

                    ;; prevRow[i] = i
                    (i32.store8
                        (i32.add
                            (get_local $prevRow)
                            (get_local $i)
                        )
                        (get_local $i)
                    )

                    ;; i = i + 1
                    (set_local $i (i32.add (get_local $i) (i32.const 1)))
    
                    ;; loop
                    (br $initLoop)
                )
            )


            ;; i = 0
            (set_local $i (i32.const 0))
            (block $mainLoopExit
                (loop $mainLoop
                    ;; if (i > len0) exit loop
                    (br_if $mainLoopExit (i32.eq (get_local $i) (get_local $len0)))
                    
                    ;; nextCol = i + 1
                    (set_local $nextCol (i32.add (get_local $i) (i32.const 1)))

                    ;; c0 = str1[i]
                    (set_local $c0 (i32.load8_u (get_local $i)))

                    ;; j = 0
                    (set_local $j (i32.const 0))
                    (block $innerLoopExit
                        (loop $innerLoop
                            ;; if (j > len1) exit loop
                            (br_if $innerLoopExit (i32.eq (get_local $j) (get_local $len1)))

                            ;; curCol = nextCol
                            (set_local $curCol (get_local $nextCol))

                            ;; c1 = str2[j]
                            (set_local $c1 (i32.load8_u (i32.add (get_local $len0) (get_local $j))))

                            ;; nextCol = prevRow[j] + (strCmp ? 0 : 1);
                            (set_local $nextCol
                                (i32.add
                                    (i32.load8_u
                                        (i32.add
                                            (get_local $prevRow)
                                            (get_local $j)
                                        )
                                    )
                                    (if (result i32)
                                        (i32.eq (get_local $c0) (get_local $c1))
                                        (then (i32.const 0))
                                        (else (i32.const 1))
                                    )
                                )
                            )

                            ;; tmp = curCol + 1
                            (set_local $tmp (i32.add (get_local $curCol) (i32.const 1)))

                            ;; if (nextCol > tmp) nextCol = tmp
                            (set_local $nextCol
                                (if (result i32)
                                    (i32.gt_u (get_local $nextCol) (get_local $tmp))
                                    (then (get_local $tmp))
                                    (else (get_local $nextCol))
                                )
                            )

                            ;; tmp = prevRow[j + 1] + 1;
                            (set_local $tmp
                                (i32.add
                                    (i32.load8_u
                                        (i32.add
                                            (i32.add (get_local $prevRow) (get_local $j))
                                            (i32.const 1)
                                        )
                                    )
                                    (i32.const 1)
                                )
                            )

                            ;; if (nextCol > tmp) nextCol = tmp
                            (set_local $nextCol
                                (if (result i32)
                                    (i32.gt_u (get_local $nextCol) (get_local $tmp))
                                    (then (get_local $tmp))
                                    (else (get_local $nextCol))
                                )
                            )

                            ;; prevRow[j] = curCol
                            (i32.store8 
                                (i32.add (get_local $prevRow) (get_local $j))
                                (get_local $curCol)
                            )
                            
                            ;; j++
                            (set_local $j (i32.add (get_local $j) (i32.const 1)))
                            (br $innerLoop)
                        )
                    )

                    ;; prevRow[j] = nextCol;
                    (i32.store8 
                        (i32.add (get_local $prevRow) (get_local $j))
                        (get_local $nextCol)
                    )

                    ;; i++
                    (set_local $i (i32.add (get_local $i) (i32.const 1)))
                    (br $mainLoop)
                )
            )
            ;; return = nextCol 
            (set_local $return (get_local $nextCol))
        )

        (get_local $return)
    )

    (func $min_u (param $a i32) (param $b i32) (result i32)
        (if (result i32)
            (i32.lt_u
                (get_local $a)
                (get_local $b)
            )
            (then (get_local $a))
            (else (get_local $b))
        )
    )
    
    (export "leven" (func $levenshtein))
)
