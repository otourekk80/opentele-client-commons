OpenTele Client Questionnaire Parser
====================================

## Development with local copy of this component ##
In bower.json of the component using opentele-client-commons replace the dependency with something like below:

    "opentele-client-commons": "file:///<absolute path to your repos>/opentele-client-commons/.git/#master"


**Note:** For changes in opentele-client-commons to take effect:

* 'grunt release' must have been executed
* Changes must be committed locally
* The component using opentele-client-commons must execute the following command: 'bower update opentele-client-commons --force'