"use client";

import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const MAX_SIDE = 1400;
const QUALITY = 0.8;

/** Redimensiona e comprime a foto no navegador antes de enviar. */
async function compress(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const webp = canvas.toDataURL("image/webp", QUALITY);
  // Safari antigo não gera WebP e devolve PNG: nesse caso, usa JPEG.
  return webp.startsWith("data:image/webp")
    ? webp
    : canvas.toDataURL("image/jpeg", QUALITY);
}

export function ImagePicker({
  currentSrc,
  error,
}: {
  /** URL da foto já salva (modo edição). */
  currentSrc?: string;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // "" = manter atual, "__remove__" = remover, data URL = nova foto
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string>();

  const preview =
    value && value !== "__remove__"
      ? value
      : value === "__remove__"
        ? undefined
        : currentSrc;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setLocalError(undefined);
    setBusy(true);
    try {
      setValue(await compress(file));
    } catch {
      setLocalError("Não foi possível ler essa imagem. Tente outra.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="image" value={value} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Foto da receita" className="h-full w-full object-cover" />
          <div className="absolute right-3 bottom-3 flex gap-2 [&>button]:bg-parchment">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              <RefreshCw /> Trocar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setValue(currentSrc ? "__remove__" : "")}
              disabled={busy}
            >
              <Trash2 /> Remover
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-warm-mist bg-soft-paper text-graphite transition-colors duration-150 hover:border-ash hover:text-ink"
        >
          {busy ? (
            <LoaderCircle className="size-6 animate-spin" strokeWidth={1.5} />
          ) : (
            <ImagePlus className="size-6" strokeWidth={1.5} />
          )}
          <span className="text-sm">
            {busy ? "Processando…" : "Adicionar foto (opcional)"}
          </span>
        </button>
      )}

      {(localError || error) && (
        <p className="text-sm text-destructive">{localError ?? error}</p>
      )}
    </div>
  );
}
