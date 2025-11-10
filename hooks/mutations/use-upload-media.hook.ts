import { useState } from "react";
import { useMastoClient } from "../use-masto-client.hook";
import { useUserSession } from "../use-user-session.hook";

export function useUploadMedia() {
    const mastoClient = useMastoClient();
    const { token } = useUserSession(); // from your session hook
    const instanceUrl = "https://mastodon.social"; // or dynamic per-user

    const [progress, setProgress] = useState<Record<string, number>>({});
    const [uploads, setUploads] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFiles = async (files: File[]) => {
        if (!mastoClient) throw new Error("Masto client not initialized");
        if (!token) throw new Error("Access token not available");

        setIsUploading(true);
        const mediaIds: string[] = [];

        for (const file of files) {
            const uploadId = crypto.randomUUID();
            setProgress((p) => ({ ...p, [uploadId]: 0 }));

            const form = new FormData();
            form.append("file", file);
            form.append("description", file.name);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${instanceUrl}/api/v2/media`);
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);

            const uploadPromise = new Promise<string>((resolve, reject) => {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        setProgress((prev) => ({ ...prev, [uploadId]: percent }));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        mediaIds.push(response.id);
                        resolve(response.id);
                    } else {
                        reject(new Error(`Upload failed: ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error("Network error during upload"));
            });

            xhr.send(form);
            await uploadPromise;
        }

        setUploads(mediaIds);
        setIsUploading(false);
        return mediaIds;
    };

    return {
        uploadFiles,
        progress,
        uploads,
        isUploading,
    };
}
