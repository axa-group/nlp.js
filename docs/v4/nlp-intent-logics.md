## NLP Logic for Intents

When the NLP has detected an intent there are some options to execute own logic for that intent in different places in the process:

* [Actions](#actions-general-information)
  * [Execute action function before answer generation](#actions-before-answer-generation)
  * [Execute action function after answer generation](#actions-after-answer-generation)
* [Execute a Pipeline after answer generation](#pipeline-after-answer-generation)

## Actions vs. Pipelines
The main difference between these two types of logic is that actions are really defined methods that are assigned "in code" in your JavaScript.Pipelines are defined in the Pipeline FIle and can also contain javaScript snippets, but are more the "configuration approach".

Actions can manipulate the context and all other data of the NLP process and can, when executed before answer generation, allow to inject new context data to be used in the answer generation.
Alternatively (when executed after answer generation) the action can overwrite the final answer and manipulate the context for the next call.

Pipelines are always executed at the end and can so only manipulate the answer and data for the future.

## Actions general information

With defining actions you can define a special method to be called with the data and additional parameters per Intent. In this case it is also possible to have the same method called with different parameter son different intents.

You can define the actions and their parameters in the corpus file on the intents and then just register the relevant action functions in code.

```json
{
    ...,
    "data": [
        {
            "intent": "whatTimeIsIt",
            "utterances": [
                "What time is it?"
            ],
            "answers": [
                "It is {{ time }} o'clock."
            ],
            "actions": [
                {
                    "name": "handleWhatsTimeIntent",
                    "parameters": [
                        "en-US",
                        "parameter 2"
                    ]
                }
            ]
        }
    ]
}
```

and register the action in code as follows:

```javascript
// Register Action functions
const manager = dock.get('nlp');

manager.registerActionFunction('handleWhatsTimeAction', async (data, locale, param2) => { 
  // Inject a new entitiy into context used for answer generation
  data.context.time = new Date().toLocaleTimeString(locale);
  return data;
});
```

You can also define the actions completely in code without the corpus JSON. This looks like this:

```javascript
const manager = dock.get('nlp');

manager.addAction('whatTimeIsIt', 'handleWhatsTimeAction', ['en-US', 'parameter 2'], async (data, locale, param2) => { 
  // Inject a new entitiy into context used for answer generation
  data.context.time = new Date().toLocaleTimeString(locale);
  return data;
});
```

As part of the nlp settings you can define the setting "executeActionsBeforeAnswers" to define when settings are executed in the process

### Actions before answer generation

When actions are executed before the answer generation, you can easiely use the action to manipulate the context and entities that are used to build the answers because they can be used as placeholders in the answer.
If you set the answer then this answer will be used (and rendered with placeholders) and no additional answer generation is executed.
### Actions after answer generation

When actions are executed after the answer generation, you can easily overwrite the full answer and manipulate the data returned and manipulate the context for the next call. But in this case you need to generate the answer yourself completely.

## Pipeline after answer generation

Beside using actions you can also configure a pipeline which is then executed.

Details and an example of a pipeline with onIntent logic can be found in [Quickstart](./quickstart.md#adding-logic-to-an-intent).

The PipeLine is always executed as last step before returning the respone. This means you can easily overwrite the full answer and manipulate the data returned and manipulate the context for the next call. But in this case you need to generate the answer yourself completely.
