export const returnAbsolutePath = (path: string) => {
  const url = new URL(path, import.meta.url).toString()
  
  const removeFile = url.replace(/^file:\/\//, "")
  
  return removeFile.match(/^\/\w\:/) ?
    removeFile.substring(1, removeFile.length) :
    removeFile
}
