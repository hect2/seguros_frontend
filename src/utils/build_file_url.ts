export const buildFileUrl = (module : string, id : string, filename : string) =>
  `http://localhost:8001/api/file?${new URLSearchParams({ module, id, filename })}`;