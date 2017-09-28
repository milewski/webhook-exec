# webhook-exec

[![Build Status](https://travis-ci.org/milewski/webhook-exec.svg?branch=master)](https://travis-ci.org/milewski/webhook-exec)
[![npm version](https://badge.fury.io/js/webhook-exec.svg)](https://badge.fury.io/js/webhook-exec)
[![npm downloads](https://img.shields.io/npm/dm/webhook-exec.svg)](https://www.npmjs.com/package/webhook-exec)
[![dependencies](https://david-dm.org/milewski/webhook-exec.svg)](https://www.npmjs.com/package/webhook-exec)
[![greenkeeper](https://badges.greenkeeper.io/milewski/webhook-exec.svg)](https://greenkeeper.io)

A lightweight WebHook Server that execute commands defined directly on your packages.json file, how?

```json
{
  "scripts": {
    "start-webhook": "webhook-exec --port 1234 --secret 123456 --server gogs",
    "stop-webhook": "webhook-exec stop"
  },
  "webhooks": {
    "push": [
      "git pull",
      "npm install",
      "npm run build"
    ],
    "delete": "rm -rf . && echo 'bye-bye'"
  }
}
```

You can find a list of events that you can react to here [https://developer.github.com/webhooks/#events](https://developer.github.com/webhooks/#events)

## Install

```bash
$ npm install webhook-exec -D
```

## Options

| Options | type   | default   | description                                                   |
|---------|--------|-----------|---------------------------------------------------------------|
| host    | string | localhost | The host address which the webhook will be listening for data |
| port    | number | 7070      | The host port number                                          |
| secret  | string | -         | A secret key shared with your webhook client/server           |
| server  | string | github    | one of `github`, `gogs`, `gitlab`, `bitbucket`                |

## Commands

`stop` stop the server. example:

```
webhook stop
```

## License 

[MIT](LICENSE) © [Rafael Milewski](https://rafael-milewski.com?github=readme)
