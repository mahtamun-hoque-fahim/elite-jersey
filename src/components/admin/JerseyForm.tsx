"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { saveJersey } from "@/app/admin/actions";
import { Field, inputCls, textareaCls } from "@/components/FormField";
import { SizeChecks } from "./SizeChecks";
import { img, type CatalogType, type Jersey } from "@/data/jerseys";
import { cn } from "@/lib/cn";

export function JerseyForm({ jersey, types }: { jersey?: Jersey; types: CatalogType[] }) {
  const [state, action, pending] = useActionState(saveJersey, undefined);
  const initialType = types.find((t) => t.groups.some((g) => g.id === jersey?.groupId)) ?? types[0];
  const [typeId, setTypeId] = useState(initialType?.id ?? "");
  const type = types.find((t) => t.id === typeId) ?? types[0];
  const [groupId, setGroupId] = useState(jersey?.groupId ?? type?.groups[0]?.id ?? "");
  const group = type?.groups.find((g) => g.id === groupId) ?? type?.groups[0];
  const [customSizes, setCustomSizes] = useState(Boolean(jersey?.sizesOverride));
  const [imageUrl, setImageUrl] = useState(jersey?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setUploadError("Choose an image under 10 MB.");
      return;
    }
    setUploading(true);
    try {
      const sigRes = await fetch("/api/admin/upload-signature", { method: "POST" });
      const sig = await sigRes.json();
      if (!sigRes.ok) throw new Error(sig.error ?? "Could not start upload");
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", sig.apiKey);
      body.append("timestamp", String(sig.timestamp));
      body.append("folder", sig.folder);
      body.append("allowed_formats", sig.allowedFormats);
      body.append("signature", sig.signature);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body });
      const data = await up.json();
      if (!up.ok) throw new Error(data.error?.message ?? "Upload failed");
      setImageUrl(data.secure_url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-6">
      {jersey && <input type="hidden" name="id" value={jersey.id} />}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <section className="grid gap-5 rounded-xl border border-line bg-white p-5 sm:grid-cols-[14rem_1fr]">
        <div>
          <p className="mb-1.5 text-sm font-semibold">Photo</p>
          <div className="grid aspect-square place-items-center overflow-hidden rounded-xl border border-dashed border-line bg-bg">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img(imageUrl, "f_auto,q_auto,w_500")} alt="Jersey preview" className="size-full object-contain" />
            ) : (
              <span className="px-4 text-center text-xs text-muted">No photo yet. The site shows a placeholder until you upload one.</span>
            )}
          </div>
          <label className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand text-sm font-semibold text-brand hover:bg-brand-tint">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Uploading..." : imageUrl ? "Replace photo" : "Upload photo"}
            <input type="file" accept="image/*" onChange={onFile} disabled={uploading} className="sr-only" />
          </label>
          <p className="mt-2 text-xs text-muted">Square photo, at least 1000 px, light or white background. JPG, PNG, WebP or AVIF, up to 10 MB.</p>
          {uploadError && <p role="alert" className="mt-2 text-xs font-medium text-red-600">{uploadError}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Jersey name" htmlFor="name"><input id="name" name="name" required defaultValue={jersey?.name} className={inputCls} /></Field>
          </div>
          <Field label="Type" htmlFor="typeId">
            <select
              id="typeId"
              value={typeId}
              onChange={(e) => {
                setTypeId(e.target.value);
                setGroupId(types.find((t) => t.id === e.target.value)?.groups[0]?.id ?? "");
              }}
              className={inputCls}
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Entry" htmlFor="groupId">
            <select id="groupId" name="groupId" value={group?.id ?? ""} onChange={(e) => setGroupId(e.target.value)} required className={inputCls}>
              {type?.groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Season" htmlFor="season"><input id="season" name="season" required defaultValue={jersey?.season} placeholder="26/27" className={inputCls} /></Field>
          <Field label="Version" htmlFor="version">
            <select id="version" name="version" defaultValue={jersey?.version ?? "Player"} className={inputCls}>
              <option>Player</option>
              <option>Fan</option>
            </select>
          </Field>
          <Field label="Price (BDT)" htmlFor="price"><input id="price" name="price" type="number" min={1} required defaultValue={jersey?.price} className={inputCls} /></Field>
          <Field label="Old price (optional)" htmlFor="oldPrice" hint="Shows a strike-through and a SAVE badge"><input id="oldPrice" name="oldPrice" type="number" min={0} defaultValue={jersey?.oldPrice} className={inputCls} /></Field>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-line bg-white p-5">
        <fieldset className="space-y-3">
          <legend className="mb-1 text-sm font-semibold">Available sizes</legend>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={customSizes} onChange={(e) => setCustomSizes(e.target.checked)} className="size-4 accent-brand" />
            Set sizes for this jersey only
          </label>
          {customSizes ? (
            <SizeChecks key={group?.id} selected={jersey?.sizesOverride ?? group?.sizes} />
          ) : (
            <p className="text-sm text-muted">
              Uses the sizes set for {group?.name ?? "the entry"}: {group?.sizes.join(", ") ?? "none"}. Change them under Types.
            </p>
          )}
        </fieldset>

        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" name="inStock" defaultChecked={jersey?.inStock ?? true} className="size-4 accent-brand" /> In stock
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" name="isNew" defaultChecked={jersey?.isNew ?? false} className="size-4 accent-brand" /> Show NEW badge
          </label>
        </div>

        <Field label="Description" htmlFor="description"><textarea id="description" name="description" rows={4} defaultValue={jersey?.description} className={textareaCls} /></Field>
      </section>

      {types.length === 0 && (
        <p role="alert" className="rounded-lg bg-brand-tint p-3 text-sm">
          Add a type and an entry first. <Link href="/admin/types" className="font-semibold text-brand hover:underline">Open Types</Link>
        </p>
      )}
      {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={pending || uploading || !group} className={cn("h-12 rounded-xl bg-brand px-8 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60")}>
          {pending ? "Saving..." : jersey ? "Save changes" : "Add jersey"}
        </button>
        <Link href="/admin/jerseys" className="grid h-12 place-items-center rounded-xl border border-line bg-white px-6 font-semibold hover:bg-bg">Cancel</Link>
      </div>
    </form>
  );
}
