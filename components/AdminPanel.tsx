"use client";

import { Loader2, PlusCircle, ShieldCheck, Trophy } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import {
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { NINETY_PLUS_ADDRESS, ninetyPlusAbi } from "@/lib/contract";
import { xLayerTestnet } from "@/lib/wagmi";

const faucetUrl = "https://web3.okx.com/xlayer/faucet";

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function AdminActionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof PlusCircle;
  children: ReactNode;
}) {
  return (
    <section className="panel admin-card">
      <div className="admin-card-head">
        <div className="flex items-center gap-3">
          <Icon size={22} color="#00FF85" />
          <div>
            <h2 className="font-heading text-4xl uppercase leading-none">{title}</h2>
            <p className="mt-2 text-sm text-white/66">{description}</p>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

export function AdminPanel() {
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();

  const [createHome, setCreateHome] = useState("");
  const [createAway, setCreateAway] = useState("");
  const [createKickoff, setCreateKickoff] = useState("");
  const [createAiPrediction, setCreateAiPrediction] = useState("");
  const [createHash, setCreateHash] = useState<`0x${string}` | undefined>();
  const [createError, setCreateError] = useState("");

  const [finalizeMatchId, setFinalizeMatchId] = useState("1");
  const [finalizeHomeScore, setFinalizeHomeScore] = useState("0");
  const [finalizeAwayScore, setFinalizeAwayScore] = useState("0");
  const [finalizeHash, setFinalizeHash] = useState<`0x${string}` | undefined>();
  const [finalizeError, setFinalizeError] = useState("");

  const [hideMatchId, setHideMatchId] = useState("1");
  const [hideHash, setHideHash] = useState<`0x${string}` | undefined>();
  const [hideError, setHideError] = useState("");

  const { isLoading: createConfirming, isSuccess: createConfirmed } = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: xLayerTestnet.id,
  });

  const { isLoading: finalizeConfirming, isSuccess: finalizeConfirmed } = useWaitForTransactionReceipt({
    hash: finalizeHash,
    chainId: xLayerTestnet.id,
  });

  const { isLoading: hideConfirming, isSuccess: hideConfirmed } = useWaitForTransactionReceipt({
    hash: hideHash,
    chainId: xLayerTestnet.id,
  });

  async function ensureChain() {
    if (typeof window === "undefined") {
      return;
    }

    await switchChainAsync({ chainId: xLayerTestnet.id });
  }

  async function handleCreateMatch() {
    setCreateError("");

    try {
      if (!createHome.trim() || !createAway.trim() || !createAiPrediction.trim()) {
        setCreateError("Fill home, away, kickoff, and AI prediction.");
        return;
      }

      const kickoffTs = Date.parse(createKickoff);
      if (Number.isNaN(kickoffTs)) {
        setCreateError("Enter a valid kickoff date and time.");
        return;
      }

      await ensureChain();
      const txHash = await writeContractAsync({
        address: NINETY_PLUS_ADDRESS,
        abi: ninetyPlusAbi,
        functionName: "createMatch",
        args: [createHome.trim(), createAway.trim(), BigInt(Math.floor(kickoffTs / 1000)), createAiPrediction.trim()],
        chainId: xLayerTestnet.id,
      });
      setCreateHash(txHash);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Create match failed");
    }
  }

  async function handleFinalizeMatch() {
    setFinalizeError("");

    try {
      const matchId = Number(finalizeMatchId);
      const homeScore = Number(finalizeHomeScore);
      const awayScore = Number(finalizeAwayScore);

      if (!Number.isInteger(matchId) || matchId <= 0) {
        setFinalizeError("Enter a valid match id.");
        return;
      }

      if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
        setFinalizeError("Enter integer home and away scores.");
        return;
      }

      await ensureChain();
      const txHash = await writeContractAsync({
        address: NINETY_PLUS_ADDRESS,
        abi: ninetyPlusAbi,
        functionName: "finalizeMatch",
        args: [BigInt(matchId), homeScore, awayScore],
        chainId: xLayerTestnet.id,
      });
      setFinalizeHash(txHash);
    } catch (error) {
      setFinalizeError(error instanceof Error ? error.message : "Finalize match failed");
    }
  }

  async function handleHideMatch() {
    setHideError("");

    try {
      const matchId = Number(hideMatchId);

      if (!Number.isInteger(matchId) || matchId <= 0) {
        setHideError("Enter a valid match id.");
        return;
      }

      await ensureChain();
      const txHash = await writeContractAsync({
        address: NINETY_PLUS_ADDRESS,
        abi: ninetyPlusAbi,
        functionName: "hideMatch",
        args: [BigInt(matchId)],
        chainId: xLayerTestnet.id,
      });
      setHideHash(txHash);
    } catch (error) {
      setHideError(error instanceof Error ? error.message : "Hide match failed");
    }
  }

  const explorerUrl = (hash?: `0x${string}`) => (hash ? `${xLayerTestnet.blockExplorers.default.url}/tx/${hash}` : "");

  return (
    <div className="grid gap-5">
      <AdminActionCard
        title="Create Match"
        description="Add a future fixture to the contract."
        icon={PlusCircle}
      >
        <div className="mb-4 rounded-sm border border-[#FFD700]/20 bg-[#FFD700]/5 p-3 text-xs leading-6 text-white/70">
          <strong className="text-[#FFD700]">Required before predictions work:</strong> Create all 8 matches
          in the exact order listed in the fixtures array (Mexico first, England last). The contract assigns
          match IDs sequentially starting at 1 — they must match the frontend fixture IDs.
        </div>
        <div className="admin-grid">
          <Field label="Home Team" value={createHome} onChange={setCreateHome} placeholder="Brazil" />
          <Field label="Away Team" value={createAway} onChange={setCreateAway} placeholder="Nigeria" />
          <Field label="Kickoff Time" type="datetime-local" value={createKickoff} onChange={setCreateKickoff} />
          <Field
            label="AI Prediction"
            value={createAiPrediction}
            onChange={setCreateAiPrediction}
            placeholder="Brazil flair, Nigeria chaos"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="primary-action" type="button" disabled={isPending || createConfirming} onClick={handleCreateMatch}>
            <PlusCircle size={18} />
            {createConfirming ? "Creating..." : "Create Match"}
          </button>
          <a className="secondary-action" href={faucetUrl} target="_blank" rel="noreferrer">
            Get Free Test OKB
          </a>
        </div>

        {createHash ? (
          <a className="mt-4 inline-flex text-sm font-black text-pitch" href={explorerUrl(createHash)} target="_blank" rel="noreferrer">
            View create tx on X Layer Explorer
          </a>
        ) : null}
        {createConfirmed ? <div className="loading-banner mt-4">Match created successfully.</div> : null}
        {createError ? <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{createError}</div> : null}
      </AdminActionCard>

      <AdminActionCard
        title="Finalize Match"
        description="Set the final score and award 10 points for the correct winner."
        icon={Trophy}
      >
        <div className="admin-grid">
          <Field label="Match ID" type="number" value={finalizeMatchId} onChange={setFinalizeMatchId} />
          <Field label="Home Score" type="number" value={finalizeHomeScore} onChange={setFinalizeHomeScore} />
          <Field label="Away Score" type="number" value={finalizeAwayScore} onChange={setFinalizeAwayScore} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="primary-action" type="button" disabled={isPending || finalizeConfirming} onClick={handleFinalizeMatch}>
            <Trophy size={18} />
            {finalizeConfirming ? "Finalizing..." : "Finalize Match"}
          </button>
        </div>

        {finalizeHash ? (
          <a className="mt-4 inline-flex text-sm font-black text-pitch" href={explorerUrl(finalizeHash)} target="_blank" rel="noreferrer">
            View finalize tx on X Layer Explorer
          </a>
        ) : null}
        {finalizeConfirmed ? <div className="loading-banner mt-4">Match finalized and points distributed.</div> : null}
        {finalizeError ? <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{finalizeError}</div> : null}
      </AdminActionCard>

      <AdminActionCard
        title="Hide Match"
        description="Hide finalized matches from public view."
        icon={ShieldCheck}
      >
        <div className="admin-grid">
          <Field label="Match ID" type="number" value={hideMatchId} onChange={setHideMatchId} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="primary-action" type="button" disabled={isPending || hideConfirming} onClick={handleHideMatch}>
            <ShieldCheck size={18} />
            {hideConfirming ? "Hiding..." : "Hide Match"}
          </button>
        </div>

        {hideHash ? (
          <a className="mt-4 inline-flex text-sm font-black text-pitch" href={explorerUrl(hideHash)} target="_blank" rel="noreferrer">
            View hide tx on X Layer Explorer
          </a>
        ) : null}
        {hideConfirmed ? <div className="loading-banner mt-4">Match hidden successfully.</div> : null}
        {hideError ? <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{hideError}</div> : null}
      </AdminActionCard>
    </div>
  );
}
