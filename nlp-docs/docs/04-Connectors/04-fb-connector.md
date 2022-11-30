# Facebook Messenger connector

## Description

This module is a connector for @nlp.js to facilitate the creation of bots for Facebook Messenger.

Under the hood, it's leveraged the official module [botbuilder-adapter-facebook](https://www.npmjs.com/package/botbuilder-adapter-facebook).

Communication follows this process:

```plantuml
@startuml
skinparam componentStyle rectangle

[End user] <-> [FB Messenger page]
[FB Messenger page] <-> [FB Messenger backend]
[FB Messenger backend] <-> [Your backend]

@enduml

```

## Installation

You can install @nlpjs/fb-connector:

```bash
    npm install @nlpjs/fb-connector
```

This module leverages some other @nlp.js dependencies:

- @nlpjs/core
- @nlpjs/connector
- @nlpjs/bot
- @nlpjs/express-api-server (optional, read "Server" section)

## Cards

To be able to interact with user, aside of texts we can use Fb cards. As internal adapter communicates directly with Fb API we need to check documentation about cards into [Facebook Developers site](https://developers.facebook.com/docs/messenger-platform/send-messages).

## Setup

Environment variables required to work:

```bash
FACEBOOK_VERIFY_TOKEN=<***>
FACEBOOK_APP_SECRET=<***>
FACEBOOK_ACCESS_TOKEN=<***>
FACEBOOK_PAGE_ID=<***>
```

Additionally, refer to the [Facebook Messenger Connector configuration](/configuration#fb-connector) section
for more configuration options.

### Server

As we need to expose a backend to receive information from Facebook API, we can use express-api-server module for this.
Every Facebook communication adds an step where signature of message is verified. This implies generating a SHA1 signature from raw body received.

As express.json body parser by default takes incoming rawBody field and replaces by a parsed body field, this forces us to add a little logic to intercept incoming buffer to be able to forward rawBody to that verify step. Have in mind that this doubles memory used per message.

This implies to override initialize step in ExpressApiApp:

```js
class ExpressApiApp extends nlpjs.ExpressApiApp {

  initialize() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(express.json({
      verify: (req, res, buf) => {
        // INFO: rawBody is required for Facebook-connector
        req.rawBody = buf;
      }
    }));
    ...
  }
```
