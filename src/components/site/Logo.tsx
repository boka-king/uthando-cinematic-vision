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

function useLogoFailed() {
  const [failed, setFailed] = useState(false);

  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth === 0) setFailed(true);
  }, []);

  const onError = useCallback(() => setFailed(true), []);

  return { failed, ref, onError };
}

export function LogoMark({ className }: { className?: string }) {
  const { failed, ref, onError } = useLogoFailed();

  if (failed) return <FallbackEmblem className={className} />;

  return (
    <img
      ref={ref}
      src={markAsset.url}
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
  const { failed, ref, onError } = useLogoFailed();

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
      src={lockupAsset.url}
      alt="Uthandolwamandla Managing and Distribution (Pty) Ltd logo"
      width={1000}
      height={760}
      onError={onError}
      fetchPriority="high"
      className={imgClassName}
    />
  );
}
