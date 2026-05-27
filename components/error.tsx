'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="mb-4 text-red-500/50" size={48} />
      <h2 className="font-heading text-3xl uppercase text-white">Something whistled</h2>
      <p className="mt-2 max-w-sm text-sm text-white/40 uppercase tracking-widest">
        RPC connection dropped or network is unstable.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
      >
        <RefreshCw size={14} /> Retry Whistle
      </button>
    </div>
  );
}