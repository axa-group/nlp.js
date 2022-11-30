# REST connector

The REST connector provides a simple API for the bot to receive the user messages

## Installation

You can install @nlpjs/rest-connector:

```bash
    npm install @nlpjs/rest-connector
```

## Usage

The REST connector is an HTTP based connector, because of that it requires the usage of the express-api-server
(**TODO**: add link) component to be registered in your bot.
This is the main basic configuration recommended in order to use this connector:

```json
{
  "settings": {
    ...
  },
  "use": [
    ...,
    "ExpressApiServer",
    "RestConnector",
    "Bot"]
}
```

Of course, you can add any other configuration you may need.

## Configuration

For configuration details refer to [the proper configuration section](/configuration#rest-connector)
