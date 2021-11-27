## How to publish new version

- upgrade version in package.json `version` field
- Add git tag with format v[number].[number].[number] according to version
- git push --tags
- The CI in GitHub actions will run the deploy script (`.github/workflows/deploy.yml`) that publish the extension to
  vscode marketplace
