# Enhance Crunchyroll

A multi-browser extension to enhance your [Crunchyroll](https://www.crunchyroll.com) experience.

<p align="center">
  <a href="https://github.com/crunchy-labs/enhance-crunchyroll/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/crunchy-labs/enhance-crunchyroll?style=flat-square" alt="License">
  </a>
  <a href="https://discord.gg/PXGPGpQxgk">
      <img src="https://img.shields.io/discord/994882878125121596?label=discord&style=flat-square" alt="Discord">
  </a>
  <a href="https://github.com/crunchy-labs/enhance-crunchyroll/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/enhance-crunchyroll/enhance-crunchyroll/ci.yml?branch=master&style=flat-square" alt="CI">
  </a>
</p>

> We are in no way affiliated with, maintained, authorized, sponsored, or officially associated with Crunchyroll LLC or any of its subsidiaries or affiliates.
> The official Crunchyroll website can be found at [www.crunchyroll.com](https://www.crunchyroll.com/).

## ✨ Features

- Download videos[^1][^2].
- Video player improvements
  - No parallel stream limit.
  - Default context menu when right-clicking the player.

[^1]: Due to browser restrictions the download is only available as [`.ts`](https://en.wikipedia.org/wiki/MPEG_transport_stream) file.
[^2]: On Firefox, the episode will be completely loaded into RAM before writing it to the disk which might cause some lagging. This is due to the lack of the (non-standardized) [`showSaveFilePicker`](https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker) method.

## 📥 Installation

### Firefox

- Download `enhance-crunchyroll-<version>-mv2.zip` from the [latest release](https://github.com/crunchy-labs/enhance-crunchyroll/releases/latest) and unzip it
- Go into your browser and type `about:debugging#/runtime/this-firefox` in the address bar
- Click the `Load Temporary Add-on...` button and choose the `manifest.json` file in the unzipped directory

### Chromium / Google Chrome

> As nearly every browser other than Firefox is based on Chromium, this should be the same for most of them

- Download `enhance-crunchyroll-<version>-mv3.zip` from the [latest release](https://github.com/crunchy-labs/enhance-crunchyroll/releases/latest) and unzip it
- Go into your browser and type `chrome://extensions` in the address bar
- Turn on the developer mode by checking the switch in the top right corner
- Click `Load unpacked` and choose the unzipped directory

<details>
  <summary>What is the difference between mv2 and mv3?</summary>
  <p><code>mv</code> stands for <code>manifest version</code> and the number for its revision. Chrome / all Chromium based browsers are limiting support for MV2 extensions in favor of MV3, while Firefox still only has experimental support for MV3 and therefore works better with MV2.</p>
</details>

## 🛠 Development

_You need [nodejs](https://nodejs.org/en) and [npm](https://www.npmjs.com/) installed._

First you need to install the project dependencies.

```shell
$ npm install
```

Start the building/watch process which build the extension to the `dist/` directory and re-builds it on every change.

```shell
$ npm run watch
```

Start your desired browser and load the extension into it. You need to do this in a separate terminal session as the command from the step before is long-running.

```shell
# Start firefox and load the plugin into it
$ npm run serve:firefox
# Start chrome (or chromium) and load the plugin into it
$ npm run serve:chrome
```

## ⚖ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.
