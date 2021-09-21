import * as vscode from "vscode";
import { WorkspaceFolder } from "vscode";
import * as globby from "globby";
import { Entry } from "globby";
import * as path from "path";
import { validateUserRoute } from "./validateUserRoute";
import { getMatcher } from "./matchers";
import { MatcherType } from "./MatcherType";

const rootDirName = "pages";

type InitialFilesData = Array<Array<Entry & { absolutePath: string }>>;

async function getWorkspacesFilesData(
  workspaceFolders: readonly WorkspaceFolder[]
): Promise<InitialFilesData> {
  const workspacesFiles = await Promise.all(
    workspaceFolders.map(async (folder) => {
      const cwd = path.join(folder.uri.fsPath, rootDirName);
      const globbyResult = await globby("**/*.{ts,tsx,js,jsx,vue}", {
        cwd,
        objectMode: true,
      });
      return globbyResult.map((result) => {
        const pathWithoutFileExtension = result.path.substring(
          0,
          result.path.lastIndexOf(".")
        );
        return {
          ...result,
          path: pathWithoutFileExtension,
          absolutePath: path.join(cwd, result.path),
        };
      });
    })
  );
  return workspacesFiles;
}

// Remove leading and trailing /
function getNormalizedUserRoute(userRoute: string): string {
  let result = userRoute;

  if (userRoute.startsWith("/")) {
    result = result.substring(1);
  }
  if (userRoute.endsWith("/")) {
    result = result.substring(0, result.length - 1);
  }

  return result;
}

function getMatcherScore(matcherType: MatcherType) {
  switch (matcherType) {
    case MatcherType.Regular:
      return 1;
    case MatcherType.Index:
      return 2;
    case MatcherType.Fallback:
      return 3;
  }
}

function compareMatcher(a: MatcherType, b: MatcherType): number {
  return getMatcherScore(a) - getMatcherScore(b);
}

const findFilePath = ({
  userRoute,
  workspacesFilesData,
}: {
  userRoute: string;
  workspacesFilesData: InitialFilesData;
}): string | undefined => {
  for (const filesData of workspacesFilesData) {
    const filesWithMatchers = filesData
      .map((file) => {
        return { file, matcher: getMatcher(file) };
      })
      .sort((a, b) => {
        return compareMatcher(a.matcher.type, b.matcher.type);
      });

    for (const fileMatcher of filesWithMatchers) {
      console.log(fileMatcher.matcher);
      if (userRoute.match(fileMatcher.matcher.regexp)) {
        const filePath = fileMatcher.file.absolutePath;
        return filePath;
      }
    }
  }
};

export async function navigateToRoute() {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    vscode.window.showInformationMessage("Workspace not found");
    return;
  }

  const workspacesFilesData = await getWorkspacesFilesData(workspaceFolders);

  const userRoute = await vscode.window.showInputBox({
    // title:"Router",
    placeHolder: "/api/v2/user",
    prompt: "Search Route",
    validateInput: validateUserRoute,
  });

  if (!userRoute) {
    vscode.window.showInformationMessage("Invalid Route");
    return;
  }

  const foundPath = findFilePath({
    userRoute: getNormalizedUserRoute(userRoute),
    workspacesFilesData,
  });

  if (!foundPath) {
    vscode.window.showInformationMessage("Route not found");
    return;
  }
  vscode.window.showInformationMessage(foundPath);

  const textDocument = await vscode.workspace.openTextDocument(foundPath);
  await vscode.window.showTextDocument(textDocument);
}
