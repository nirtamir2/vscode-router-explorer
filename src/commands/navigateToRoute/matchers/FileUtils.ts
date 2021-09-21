function getNameWithoutExtension(fileName: string) {
  return fileName.replace(/\.[\s\S]+$/, "");
}

function isIndex(fileName: string) {
  return getNameWithoutExtension(fileName).toLocaleLowerCase() === "index";
}

function getExtension(fileName: string) {
  return fileName.split(".").pop();
}

export const FileUtils = {
  isIndex,
  getNameWithoutExtension,
  getExtension,
};
