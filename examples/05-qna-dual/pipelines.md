# default

## main
nlp.loadOrTrain

# bot1

## console.hear
eq input.message "quit"
jne sendMessage
console.exit
label sendMessage
nlp.process input.message
.say input.answer

## main
console.say "Say something!"

# bot2

## main
