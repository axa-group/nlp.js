# Pipelines

## console.hear
eq input.message "quit"
jne sendMessage
console.exit
label sendMessage
nlp.process input.message
.say input.answer

## main
nlp.loadOrTrain
console.say "Say something!"
