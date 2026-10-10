"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Download, MessageCircle, X } from "lucide-react";
import { JerseyArt } from "./JerseyArt";
import { cn } from "@/lib/cn";
import { money, type Jersey } from "@/data/jerseys";
import { waLink } from "@/lib/site";

type Ctx = { open: (jersey: Jersey, size?: string) => void };
const OrderContext = createContext<Ctx | null>(null);

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}

function svgToPngBlob(svg: SVGSVGElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", "1000");
    clone.setAttribute("height", "1000");
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas"));
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1000, 1000);
      ctx.drawImage(img, 0, 0, 1000, 1000);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), "image/png");
    };
    img.onerror = () => reject(new Error("img"));
    img.src = url;
  });
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [jersey, setJersey] = useState<Jersey | null>(null);
  const [size, setSize] = useState<string>("");
  const [downloaded, setDownloaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  const open = useCallback((j: Jersey, s?: string) => {
    setJersey(j);
    setSize(s ?? "");
    setDownloaded(false);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (jersey && !d.open) d.showModal();
    if (!jersey && d.open) d.close();
  }, [jersey]);

  async function download() {
    if (!jersey) return;
    setBusy(true);
    try {
      if (jersey.image) {
        const res = await fetch(jersey.image);
        const blob = await res.blob();
        const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
        saveBlob(blob, `${jersey.slug}.${ext}`);
      } else {
        const svg = artRef.current?.querySelector("svg");
        if (svg) saveBlob(await svgToPngBlob(svg), `${jersey.slug}.png`);
      }
      setDownloaded(true);
    } finally {
      setBusy(false);
    }
  }

  const message = jersey
    ? `Hi Elite Jersey, I want to order this jersey.\n\n${jersey.name}\nSize: ${size || "(please confirm)"}\nPrice: ${money(jersey.price)}\nLink: ${typeof window !== "undefined" ? window.location.origin : ""}/jersey/${jersey.slug}\n\nI have attached the photo.`
    : "";

  return (
    <OrderContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="order-title"
        onClose={() => setJersey(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setJersey(null);
        }}
        className="m-auto w-[min(92vw,28rem)] overflow-visible rounded-2xl bg-white p-0 text-ink shadow-2xl max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none"
      >
        {jersey && (
          <div className="relative p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setJersey(null)}
              aria-label="Close"
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-muted hover:bg-bg hover:text-ink"
            >
              <X className="size-5" />
            </button>
            <h2 id="order-title" className="pr-8 font-display text-xl font-semibold">
              Order on WhatsApp
            </h2>

            <div className="mt-4 flex gap-4 rounded-xl bg-bg p-3">
              <div ref={artRef} className="size-24 shrink-0 rounded-lg bg-white">
                {jersey.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={jersey.image} alt={jersey.name} className="size-full rounded-lg object-cover" />
                ) : (
                  <JerseyArt colors={jersey.colors} pattern={jersey.pattern} title={jersey.name} className="size-full" />
                )}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold leading-snug">{jersey.name}</p>
                <p className="mt-1 font-display text-lg font-bold">{money(jersey.price)}</p>
              </div>
            </div>

            <fieldset className="mt-4">
              <legend className="mb-2 text-sm font-semibold">Select size</legend>
              <div className="flex flex-wrap gap-2">
                {jersey.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-9 min-w-11 rounded-full border px-3 text-sm font-medium transition-colors",
                      size === s ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand hover:text-brand",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <ol className="mt-5 space-y-2 text-sm text-muted">
              <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-bold text-brand">1</span>Download the jersey photo.</li>
              <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-bold text-brand">2</span>Open WhatsApp with your order message.</li>
              <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-bold text-brand">3</span>Attach the photo and send. We confirm the rest there.</li>
            </ol>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={download}
                disabled={busy}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
              >
                {downloaded ? <Check className="size-5" /> : <Download className="size-5" />}
                {downloaded ? "Photo downloaded" : busy ? "Preparing..." : "Download Photo"}
              </button>
              <a
                href={downloaded ? waLink(message) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!downloaded}
                tabIndex={downloaded ? 0 : -1}
                className={cn(
                  "flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white transition-colors",
                  downloaded ? "bg-wa hover:bg-wa-dark" : "pointer-events-none bg-wa/40",
                )}
              >
                <MessageCircle className="size-5" />
                Continue to WhatsApp
              </a>
            </div>
            <p className="mt-3 text-center text-xs text-muted">We confirm price, delivery and payment on WhatsApp.</p>
          </div>
        )}
      </dialog>
    </OrderContext.Provider>
  );
}
