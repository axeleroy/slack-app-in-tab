# Slack App-in-Tab Reborn extension

A Firefox extension to open the Slack app with its multi-workspace sidebar in a simple browser tab, freeing you to use
the Slack app.

> [!NOTE]  
> This extension is a fork of [@louisremi](https://github.com/louisremi)'s [Slack App-in-Tab](https://github.com/louisremi/slack-app-in-tab) which keeps
> the functionality intact while introducing an
> [automated workflow](https://github.com/axeleroy/slack-app-in-tab/actions/workflows/ua-update.yml) to keep the User
> Agent string up to date with the latest Chrome OS release (see [How does it work?](#how-does-it-work))

# How to use

1. Install the extension from [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/slack-app-in-tab/)
2. Visit [app.slack.com](https://app.slack.com) and log into any of your workspaces
3. That's it, all your workspaces appear in the sidebar, just like in the Slack App

# How does it work?

Under the hood, "_Slack App-in-Tab_" is a 10 LOCs long extension.
It changes your browser's User Agent String to the one used in Chrome OS, when you visit app.slack.com.
Slack always runs in _app mode_ on that platform. _Tada!_

# Original Author

[@louisremi](https://twitter.com/louis_remi)
