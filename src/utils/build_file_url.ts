export const buildFileUrl = (module : string, id : string, filename : string) =>
  `${import.meta.env.VITE_API_URL}/api/file?${new URLSearchParams({ module, id, filename })}`;