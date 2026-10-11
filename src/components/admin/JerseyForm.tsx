"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { saveJersey } from "@/app/admin/actions";
import { Field, inputCls, textareaCls } from "@/components/FormField";
import { ALL_SIZES, categoryLabels, img, type Category, type Jersey } from "@/data/jerseys";
import { cn } from "@/lib/cn";

export function JerseyForm({ jersey }: { jersey?: Jersey }) {
  const [state, action, pending] = useActionState(saveJersey, undefined);
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
              <img src={img(imageUrl, "f_auto,q_auto,w_500")} alt="Jersey preview" className="size-full object-cover" />
            ) : (
              <span className="px-4 text-center text-xs text-muted">No photo yet</span>
            )}
          </div>
          <label className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand text-sm font-semibold text-brand hover:bg-brand-tint">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Uploading..." : imageUrl ? "Replace photo" : "Upload photo"}
            <input type="file" accept="image/*" onChange={onFile} disabled={uploading} className="sr-only" />
          </label>
          {uploadError && <p role="alert" className="mt-2 text-xs font-medium text-red-600">{uploadError}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Jersey name" htmlFor="name"><input id="name" name="name" required defaultValue={jersey?.name} className={inputCls} /></Field>
          </div>
          <Field label="Club / Country" htmlFor="team"><input id="team" name="team" required defaultValue={jersey?.team} className={inputCls} /></Field>
          <Field label="Season" htmlFor="season"><input id="season" name="season" required defaultValue={jersey?.season} placeholder="26/27" className={inputCls} /></Field>
          <Field label="Category" htmlFor="category">
            <select id="category" name="category" defaultValue={jersey?.category ?? "club"} className={inputCls}>
              {(Object.keys(categoryLabels) as Category[]).map((c) => (
                <option key={c} value={c}>{categoryLabels[c]}</option>
              ))}
            </select>
          </Field>
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
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Available sizes</legend>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => (
              <label key={s} className="cursor-pointer">
                <input type="checkbox" name="sizes" value={s} defaultChecked={jersey ? jersey.sizes.includes(s) : true} className="peer sr-only" />
                <span className="grid h-10 min-w-12 place-items-center rounded-full border border-line px-4 text-sm font-medium transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40">
                  {s}
                </span>
              </label>
            ))}
          </div>
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

      {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={pending || uploading} className={cn("h-12 rounded-xl bg-brand px-8 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60")}>
          {pending ? "Saving..." : jersey ? "Save changes" : "Add jersey"}
        </button>
        <Link href="/admin/jerseys" className="grid h-12 place-items-center rounded-xl border border-line bg-white px-6 font-semibold hover:bg-bg">Cancel</Link>
      </div>
    </form>
  );
}
