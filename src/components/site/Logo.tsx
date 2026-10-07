import { useCallback, useState } from "react";
import lockupAsset from "@/assets/logo-lockup.png.asset.json";
import markAsset from "@/assets/logo-mark.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * Logo rendering with a graceful fallback: if the bitmap cannot load (network
 * failure, blocked asset, cache miss), we swap in an inline typographic mark
 * built from theme tokens so the brand never renders as a broken image.
 *
 * The mount-time `complete && naturalWidth === 0` check covers images that
 * failed before React attached the error listener during hydration.
 */

const FALLBACK_SIZE = "min-h-11 min-w-11";

function FallbackEmblem({ className }: { className?: string | undefined }) {
  return (
    <span
      role="img"
      aria-label="Uthandolwamandla emblem"
      className={cn(
        "display flex items-center justify-center rounded-full border border-border bg-primary/10 text-primary select-none",
        FALLBACK_SIZE,
        className,
      )}
    >
      U
    </span>
  );
}

function useLogoFailed(sources: string[]) {
  const [index, setIndex] = useState(0);
  const failed = index >= sources.length;

  const onError = useCallback(() => setIndex((i) => i + 1), []);

  const ref = useCallback(
    (node: HTMLImageElement | null) => {
      // Only treat as failed once loading finished with no pixels.
      if (node && node.complete && node.currentSrc && node.naturalWidth === 0) onError();
    },
    [onError],
  );

  return { failed, ref, onError, src: sources[index] ?? "" };
}

export function LogoMark({ className }: { className?: string }) {
  const { failed, ref, onError, src } = useLogoFailed(["/brand/logo-mark.webp", markAsset.url]);

  if (failed) return <FallbackEmblem className={className} />;

  return (
    <img
      ref={ref}
      key={src}
      src={src}
      alt="Uthandolwamandla emblem"
      width={44}
      height={38}
      onError={onError}
      className={cn("h-auto w-11 shrink-0 object-contain", className)}
    />
  );
}

export function LogoLockup({
  className,
  imgClassName,
}: {
  className?: string;
  imgClassName?: string;
}) {
  const { failed, ref, onError, src } = useLogoFailed(["/brand/logo-lockup.webp", lockupAsset.url]);

  if (failed) {
    return (
      <div
        role="img"
        aria-label="Uthandolwamandla Managing and Distribution (Pty) Ltd"
        className={cn("flex flex-col items-center gap-4 text-center", className)}
      >
        <FallbackEmblem className="min-h-20 min-w-20 text-4xl" />
        <span className="display text-2xl sm:text-3xl">Uthandolwamandla</span>
        <span className="micro text-muted-foreground">Managing & Distribution</span>
      </div>
    );
  }

  return (
    <img
      ref={ref}
      key={src}
      src={src}
      alt="Uthandolwamandla Managing and Distribution (Pty) Ltd logo"
      width={1000}
      height={772}
      onError={onError}
      fetchPriority="high"
      className={imgClassName}
    />
  );
}
