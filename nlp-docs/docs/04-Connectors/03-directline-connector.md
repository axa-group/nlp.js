# Directline connector

The directline connector is a Microsfot Bot framework styled connector allowing you to interact with a Bot without the need to
use an Azure Bot instance.

## Installation

You can install @nlpjs/directline-connector:

```bash
    npm install @nlpjs/directline-connector
```

## Usage

The directline connector is an HTTP based connector, because of that it requires the usage of the express-api-server (**TODO**: add link) component
to be registered in your bot.
This is the main basic configuration recommended in order to use this connector:

```json
{
  "settings": {
    ...
  },
  "use": [
    ...,
    "ExpressApiServer",
    "DirectlineConnector",
    "Bot"]
}
```

Of course, you can add any other configuration you may need.

## Configuration

For configuration details refer to [the proper configuration section](/configuration#directline-connector)
