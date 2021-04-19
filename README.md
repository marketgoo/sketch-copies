# mktgoo Data

This is a Sketch plugin to fetch and update copies using external services like Airtable or Google Spreadsheets.

## Installation

- [Download](../../releases/latest/download/sketch-copies.sketchplugin.zip) the
  latest release of the plugin
- Un-zip
- Double-click on sketch-copies.sketchplugin

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things
work, checkout the
[skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project
folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```

### Debugging

To view the output of your `console.log`, you have a few different options:

- Use the [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
- Open `Console.app` and look for the sketch logs
- Look at the `~/Library/Logs/com.bohemiancoding.sketch3/Plugin Output.log` file

Skpm provides a convenient way to do the latter:

```bash
skpm log
```

The `-f` option causes `skpm log` to not stop when the end of logs is reached,
but rather to wait for additional data to be appended to the input

### Publishing your plugin

```bash
skpm publish <bump>
```

(where `bump` can be `patch`, `minor` or `major`)

`skpm publish` will create a new release on your GitHub repository and create an
appcast file in order for Sketch users to be notified of the update.
