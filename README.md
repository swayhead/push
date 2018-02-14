# Push

**Warning: This extension is currently in preview. If you would like to test it, and experience bugs or issues, please see "Reporting Bugs" at the bottom.**

Push is a file transfer extension. It is inspired in part by Sublime's fantastic SFTP plugin as well as Coda's workflow features, and provides you with a tool to upload and download files within a workspace.

## Features

It currently provides:

 - Transfer of individual files
 - Transfer of folders
 - Queueing (and transfer after save bulk)
 - Watching of files within the project

## ⚡️ Quick setup

Push supports many options and configuration modes. The most common of which is a single SFTP setup for an active workspace. The following steps will help you get set up in no time:

 1. Install Push from the [VS Code extension marketplace](https://marketplace.visualstudio.com/items?itemName=njp-anderson.push).
 2. In the command palette, choose **Create/Edit Push configuration** and then confirm the location, then choose the **SFTP** template.
 3. Fill in the missing details within the settings file. At minimum, you will need a `host`, `username`, `password` (if not using keys), and a `root` path.
 4. You should then be able to upload files within the workspace by using the explorer menu, title bars, or command palette.

For more complete setup and configuration details, feel free to read on.

## Extension Settings

This extension contributes the following settings:

| Setting | Default | Description |
| --- | --- | --- |
| `locale` | `en-gb` | Language to use. See "Push in your language".
| `settingsFilename` | `.push.settings.json` | Settings file name. Defaults to `.push.settings.json`. |
| `debugMode` | `false` | Enable debug mode for more logging. Useful if reporting errors. |
| `privateSSHKey` | (Empty) | Set the location of your private .ssh key. Will attempt to locate within the local .ssh folder by default. |
| `privateSSHKeyPassphrase` | (Empty) | If you're using a private key with a passphrase, enter it here. |
| `uploadQueue` | `true` | If enabled, uses an upload queue, allowing you to upload all saved files since the last upload. |
| `ignoreGlobs` | `**/.DS_Store`,<br>`**/Thumbs.db`,<br>`**/desktop.ini`,<br>`**/.git/\*`,<br>`**/.svn/*` | A list of file globs to ignore when uploading. |
| `queueCompleteMessageType` | `status` | Choose how to be notified on queue completion. Either `status`, or `message` for a permanent reminder. |
| `statusMessageColor` | `notification.`<br>`infoBackground` | Choose the colour of the queue completion status message. |

## Using Push
Push has three main modes of operation: 1) As a standard, on-demand uploader, 2) as a queue-based uploader on save, or 3) as a file watching uploader. All three can be combined or ignored as your preferences dictate.

### How does Push upload?

When Push uploads a file within the workspace, it does a few things to make sure the file gets into the right place on your remote location - regardless of which service is used:

 1. Find the nearest `.push.settings.json` (or equivalent) to the file. Push will look upwards along the ancestor tree of the file to find this.
 2. Connect to the service required and find the root path as defined.
 3. Use the root path as a basis for uploading the file at its own path, relative to the workspace.
 4. Upload the file.

#### Root path resolving

If, for instance, an SFTP connection has been defined in the settings file for your workspace, and it has a `root` of `/home/myaccount/public`, all files in your workspace will be uploaded to there as a base path.

For instance, if your workspace root was `/Users/myusername/Projects/myproject/` and the file you uploaded was at `<workspace>/contact/index.php`, then it would end up being uploaded to `/home/myaccount/public/contact/index.php`.

### On demand uploading

There are a few methods you can use to upload on-demand. Two of which are the command palette, and the context menu in the file explorer, seen below:

**Command palette:**

![Uploading with the command Palette](https://raw.github.com/njpanderson/push/master/img/command-palette-upload.png)

**Context menu:**

<img src="https://raw.github.com/njpanderson/push/master/img/context-upload.png" alt="Uploading with the context menu" width="276">

The same two methods can be used to perform downloads, as well as most of the other features of Push.

### Queued uploading

Another great feature of Push is that it will keep a list of all files you have edited within VS Code and let you upload them with a single shortcut. This defaults to `cmd-alt-p` (or `ctrl-alt-p` on Windows).

Whenever a file is saved, and the queue is enabled, a ![Upload queue](https://raw.github.com/njpanderson/push/master/img/queue.png) icon with the number of queued items will appear in the status bar.

Use the above shortcut, or select **Upload queued items** in the command palette to upload all of the files in a single operation.

### File watching

A third method of uploading files is to use the watch tool. This can be accessed from the explorer context menu:

<img src="https://raw.github.com/njpanderson/push/master/img/context-watch.png" width="269" alt="Explorer context menu with watch selected"/>

Selecting this option will create a watcher for the file, or in the case of a folder, all of the files within it. Whenever any one of them is altered or created by either VS Code or another app, Push will attempt to upload them.

#### Listing watched files

If you loose track of which files and folders are being watched, either click on the ![Watching](https://raw.github.com/njpanderson/push/master/img/watching.png) icon in the status bar, or choose **List active watchers** from the command palette. A list of watchers similar to the below will appear:

![Watch file list output](https://raw.github.com/njpanderson/push/master/img/output-watched-paths.png)

You can use this list as a reference when removing previously added watchers.

## Service settings files

To customise the server settings for a workspace, either use the context menu in the file explorer and choose **Create/edit Push configuration**, or add a file (by default, called `.push.settings.json`) to your workspace with the following format:

```javascript
{
	"service": "[ServiceName]",
	"[ServiceName]": {
		...
	}
}
```

Each available service has its own set of settings which are within the `[ServiceName]` object on the main server settings object. For instance, if using the `SFTP` service, your config might look something like this:

```javascript
{
	// Service name here is "SFTP"
	"service": "SFTP",
	// "SFTP" here matches the service name
	"SFTP": {
		// SFTP Specific options
		"host": "upload.bobssite.com",
		"username": "bob"
		"password": "xxxxxxx",
		"root": "/home/bob",
		// Global service options
		"collisionUploadAction": "overwrite"
	}
}
```

### Multiple service settings files

When defining a server settings file, placing it in the root of your workspace will define those settings for the whole workspace. Push also supports adding server settings files to sub-diretories within your workspace. When uploading files from within any directory, Push will look for the nearest server settins file and use it for server-specific settings.

This is a very powerful feature which means multiple settings files can be defined within one workspace to upload to either different servers, define different options per folder, or to use entirely different services across a project. For example, the following setup defines two services:

```
<workspace root>
├── dir1
│   ├── .push.settings.json
│   └── filename.txt
├── dir2
│   ├── .push.settings.json
│   ├── filename2.txt
│   └── another-file.jpg
```

In the scenario above, if `filename.txt` and `filename2.txt` were both edited, the upload queue would have 2 items in it, and both would be uploaded using their individual settings files.

**Note:**  While this is a very useful feature, it does have one drawback - you cannot upload a path containing more than one settings file at a time. I.e. if a folder `base` has two subfolders, each with their own `.push.settings.json` file, the `base` folder cannot not be uploaded via the context menus.

## Available services

### SFTP

The SFTP service will upload files to remote SSH/SFTP servers.

| Setting | Default | Description |
| --- | --- | --- |
| `host` | | Hostname or IP of the remote host. |
| `username` | | Username of the authenticated user. |
| `password` | | Password for the authenticated user. Leave blank if using keys. |
| `privateKey` | | Private key path, if using keys. Defaults to the global `privateSSHKey` setting. |
| `keyPassphrase` | | Private key passphrase, if needed. Defaults to the global `privateSSHKeyPassphrase` setting. |
| `root` | `/` | The root path to upload to. All files within the workspace at the same level or lower than the location of the server settings file will upload into this path. |
| `keepaliveInterval` | `3000` | How often, in milliseconds, to send keep-alive packets to the server. Set `0` to disable. |
| `fileMode` | | If required, a [mode](https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation) can be applied to files when they are uploaded. Numeric modes are accepted. E.g: `"700"` to give all access to the owner only. An array of modes is also supported. (See below.) |
| `debug` | `false` | In debug mode, extra information is sent from the underlying SSH client to the console.

#### `fileMode` as an array

The `fileMode` setting of the SFTP service can also be expressed as an array of glob strings and modes required. For instance:

```json
	"fileMode": [{
		"glob": "*.txt",
		"mode": "600"
	}, {
		"glob": "*.jpg",
		"mode": "700"
	}, {
		"glob": "**/*/",
		"mode": "655"
	}]
```

The above example will perform the following:

 - Files with names ending in **.txt** will be given the mode `600`
 - Files with names ending in **.jpg** will be given the mode `700`
 - **All directories** will be given the mode `655`

For those interested, the underlying glob matching is performed by [micromatch](https://www.npmjs.com/package/micromatch#matching-features), and any glob pattern it supports can be used here.

### File

The File service will upload files to another location on your computer. This is done with a standard copy operation. It might seem fairly basic, but can potentially be quite powerful if combined with other syncing solutions or mapped drives (e.g. uploading to `/Volumes/xyz`.)

| Setting | Default | Description |
| --- | --- | --- |
| `root` | `/` | The root path to upload to. All files within the workspace at the same level or lower than the location of the server settings file will upload into this path. |

### General service settings

The following options are available to all services:

| Setting | Default | Description |
| --- | --- | --- |
| `testCollisionTimeDiffs` | `true` | If this option is set to `false`, the service will assume newer files collide, which means all files that exist on the remote will produce a collision warning. |
| `collisionUploadAction` | (Prompt) | Sets how to proceed when colliding with the same remote file. Set one of `stop` (Stop transfer entirely), `skip` (Skip the file), `overwrite` (Overwrite the file), or `rename` (Keep both files by renaming the source file). This option is ignored if the file type (directory or file) does not match the target.
| `collisionDownloadAction` | (Prompt) | Identical in options to `collisionUploadAction`, sets how to proceed when colliding with the same local file.
| `timeZoneOffset` | `0` | The offset, in hours, the time is set to on the origin relative to the local device. I.e. if the origin is GMT+1 and the device is GMT-1, the offset would be `2` |

## Known issues

 - SFTP may have trouble connecting to SSH servers with interactive authentication. This is possibly an issue with the underlying libraries and I am looking to solve this in the future.
 - Some localised strings may not translate until VS Code is reloaded.

## Reporting bugs

Found a bug? Great! Let me know about it in the [Github issue tracker](https://github.com/njpanderson/push/issues) and I'll try to get back to you within a few days. It's a personal project of mine so I can't always reply quickly, but I'll do my best.

### Help! Push deleted all my files, wiped my server and/or made my wife leave me!

First of all, that's terrible and of course I wouldn't wish this on anyone. Secondly, if you do have a method by which I can replicate the problem, do let me know in a bug report and I will give it priority over any new features. Thirdly, please understand that I am not liable for any potential data loss on your server should you use this plugin. Push is not designed or coded to perform deletions of files (except for when it overwrites a file with a new one), and I have tested this plugin constantly during development, but there may still be bugs which potentially cause data loss.

## Roadmap

 - Better display for the watch/upload queue.
 - Adding Amazon S3 support.
 - Support for uploading all VCS altered files.
 - Got a feature request? [Let me know in the issues](https://github.com/njpanderson/push/issues)!

## Push in your language

Currently, Push supports the following languages which can be selected within the configuration:

| Language | Code | Quality | Contributor |
| --- | --- | --- | --- |
| 🇬🇧 English (British) | `en_gb` | High | (Built in) |
| 🇯🇵 Japanese | `ja` | Poor | (Built in) |
| 🇮🇹 Italian | `it` | Low-Medum | (Built in) |

If you'd like to help improve the quality of the existing translations, or add your own translation, please let me know and I would be happy to accommodate you. There are around 70 strings currently set into Push, and can be translated in a few hours by a native speaker.

Get in touch via the issues if you're interesting in helping to localise Push.
