import * as vscode from "vscode";

const rootProperty = "router-explorer";

export enum ConfigurationProperty {
  SearchPatternInVueFiles = "search.routes.vue.pattern",
  RootDirectoryName = "root.directory.name",
  ShowDebugMessage = "debug.messages",
}

export enum SearchPattern {
  Nuxt = "Nuxt",
  Next = "Next",
}

function getConfigurationProperty<T>(
  property: ConfigurationProperty,
  fallback: T
) {
  return (
    vscode.workspace.getConfiguration(rootProperty).get<T>(property) ?? fallback
  );
}

function getRootDirectoryName(): string {
  return getConfigurationProperty(
    ConfigurationProperty.RootDirectoryName,
    "pages"
  );
}

function getSearchPatternInVueFiles(): SearchPattern {
  return getConfigurationProperty(
    ConfigurationProperty.SearchPatternInVueFiles,
    SearchPattern.Nuxt
  );
}

function isDebugMessages(): boolean {
  return getConfigurationProperty(
    ConfigurationProperty.ShowDebugMessage,
    process.env.NODE_ENV === "development"
  );
}

export const configuration = {
  getRootDirectoryName,
  getSearchPatternInVueFiles,
  isDebugMessages
};
