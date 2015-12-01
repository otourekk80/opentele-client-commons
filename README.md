OpenTele Client Commons
====================================

## Development with local copy of this component ##
In bower.json of the component using opentele-client-commons replace the dependency with something like below:

    "opentele-client-commons": "file:///<absolute path to your repos>/opentele-client-commons/.git/#master"

This will expose opentele-client-commons for local linking.

Go to the root folder of the component using opentele-client-commons and type:

`bower link opentele-client-commons`

This will override the dependency in bower.json with a local link.
To remove the link type:

`bower uninstall opentele-client-commons`
followed by a `bower install`

**Note:** For changes in opentele-client-commons to take effect:

* Execute `grunt release` or `grunt dev`(for continous development)  in opentele-client-commons. **Note:** `grunt release` must be executed the first time.
* Build the component using opentele-client-commons

## Releasing a new version ##
* Develop and test your changes
* Execute `grunt release`
* Commit and push changes
* Tag new version on the form `vx.y.z`. Example `git tag -a v1.0.11 -m"Tagging v1.0.11"`
* Push new tag: `git push --tags`

**REMEMBER** to update the version in the component(s) using opentele-client-commons to new version number.
