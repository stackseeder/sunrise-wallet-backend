## Sunrise CRM Backend

### Prerequisites
- Node.js > 8.12
- MongoDB

### Installation

-   make environment
```
$ cp .env.example .env
```
-   install packages
```
$ npm install
```

### Run Project

-   DB Migration

```
$ npm run migrate:up
```

-   dev development

```
$ npm run dev                // linux
$ npm run dev:daemon

$ npm run dev:window         // windows
$ npm run dev:daemonwindow
```

-   production deployment
```
$ pm2 start npm --name api -- run start

$ pm2 start npm --name daemon -- run start:daemon
```
