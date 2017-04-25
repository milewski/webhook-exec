# webhook-exec

[![Build Status](https://travis-ci.org/milewski/webhook-exec.svg?branch=master)](https://travis-ci.org/milewski/webhook-exec)
[![npm version](https://badge.fury.io/js/webhook-exec.svg)](https://badge.fury.io/js/webhook-exec)
[![npm downloads](https://img.shields.io/npm/dm/webhook-exec.svg)](https://www.npmjs.com/package/webhook-exec)
[![dependencies](https://david-dm.org/milewski/webhook-exec.svg)](https://www.npmjs.com/package/webhook-exec)

A lightweight WebHook Server that execute commands defined directly on your packages.json file, how?

```json
{
  "scripts": {
    "start-webhook": "webhook --port 1234 --secret 123456",
    "stop-webhook": "webhook stop"
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

## License 

[MIT](LICENSE) © [Rafael Milewski](https://github.com/milewski)
