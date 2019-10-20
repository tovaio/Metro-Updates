# Metro-Updates

## How to build:

```
cd [insert_project_name]
npm init
```

## Run the web app

### In production:

```
npm run build
npm run start
```

This builds the `webpack` bundles and stores them in `dist`, and then it runs an `express` server of the web app on `localhost:3000`. Visit the address to open the web app.

### In developer mode (with hot module replacement):

```
npm run server
```

With hot module replacement, everytime a `webpack` entrypoint is updated, the project is re-bundled, stored in memory, and served on `localhost:3000`.