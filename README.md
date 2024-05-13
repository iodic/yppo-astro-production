# Personal Ombudsman — yppo
## An Astro JS project

<!-- installation -->
## 🛠️ Installation

After cloning the repo, you have some prerequisites to install. Then you can run it on your localhost. You can view the package.json file to see which scripts are included.

### Install prerequisites (once for a machine)

- **Node Installation:** [Install Node.js](https://nodejs.org/en/download/) [Recommended LTS version]

### 👨🏻‍💻 Local setup

After installing Node.js, we have to install NPM packages.

- 👉 Install dependencies

```
npm install
```

- 👉 Run locally

```
npm run dev
```

After that, it will open up a preview of the template in your default browser, watch for changes to source files, and live-reload the browser when changes are saved.

## 🏗️ Production Build

After finishing all the customization, you can create a production build by running this command.

```
npm run build
```

## Troubleshooting notes

Node must be above version 18 for Astro to work; use asdf to change the shell version to the appropriate one:

```bash
asdf shell nodejs 18.14.1
```

## 🗒 Notes

1. <strong>Locale Addition</strong></br>
   Remember to update both astro.config.mjs and /src/i18n/i18nConfig.ts locales

Happy Coding!
