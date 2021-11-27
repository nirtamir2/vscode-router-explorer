## How to publish new version

- Add git tag with format v[number].[number].[number]
- git push --tags
- The CI in GitHub actions will run the deploy script (`.github/workflows/deploy.yml`) that publish the extension to
  vscode marketplace
