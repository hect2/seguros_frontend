import { buildFileUrl } from "./build_file_url";

export const downloadFile = async (module: string, id: number, filename: string) => {

    const url = buildFileUrl(module, String(id), filename);

    const authToken = localStorage.getItem("token");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!response.ok) {
        console.error("Error descargando archivo");
        return;
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
}