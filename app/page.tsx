'use client';
import { usePostStatus } from '@/hooks/mutations/use-post-status.hook';
import { useState } from 'react';


export default function Home() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const { mutate: postStatus, isPending } = usePostStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postStatus({ status: text, files: files ? Array.from(files) : undefined });
    setText('');
    setFiles(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <textarea
        className="w-full p-2 border rounded mb-3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
      />

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        className="mb-3"
      />

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
