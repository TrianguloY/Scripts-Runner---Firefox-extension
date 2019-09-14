# Scripts Runner

A Firefox extension to create/run/edit small scripts. Created to improve the Bookmarklet feature, specifically to allow quick editing and testing. It also supports running the scripts inside iframes (bookmarklets don't).

## What it does

Provides a button that, when pressed, will show a list to create, delete, run and edit scripts. It also provides a button to export the current scripts to a json, and another to import scripts.

Note: this is my first published extension, and it has currently very basic functionality. I'll consider upgrading it in the future, criticism is welcomed.

### Permissions

* `<all_urls>`: Permission needed to run scripts inside iframes generated dinamically (unfortunately the 'activeTab' permission don't allow this). No scripts are run in any background tab or anywhere else.
* `storage`: Permission used to save and retrieve the scripts. Otherwise when closing/reopening the extension they would be gone.
* `clipboardRead`: The export/import feature uses the clipboard for convenience. Will consider removing this to manual copy/paste.
* `webNavigation`: The permission needed to run scripts in the current tab/iframe.

