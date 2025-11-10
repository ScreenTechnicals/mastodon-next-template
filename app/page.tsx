"use client";

import { usePostStatus } from "@/hooks/mutations/use-post-status.hook";
import { useState } from "react";


export default function Home() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const { mutate: postStatus, isPending } = usePostStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !files?.length) return;

    postStatus({
      status: text,
      files: files ? Array.from(files) : undefined,
    });

    setText("");
    setFiles(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg max-w-xl mx-auto">
      <textarea
        className="w-full p-2 border rounded mb-3"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="file"
        multiple
        accept="image/*,video/mp4,video/webm,video/quicktime"
        onChange={(e) => setFiles(e.target.files)}
        className="mb-3"
      />

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Posting…" : "Post"}
      </button>
    </form>
  );
}
