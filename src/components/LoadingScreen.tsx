import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingScreenProps {
  /** When set, shows error UI with message and retry. When null, shows loading UI. */
  error: string | null;
  /** Optional title for loading state (default: "Loading…") */
  loadingTitle?: string;
  /** Optional subtitle for loading state */
  loadingSubtitle?: string;
  /** Enable auto-retry on error: reload after delay, up to maxAttempts */
  autoRetry?: boolean;
  /** Delay in ms before auto-retry (default: 3000) */
  autoRetryDelay?: number;
  /** Max auto-retry attempts (default: 3) */
  maxRetryAttempts?: number;
  /** Custom retry handler; default is window.location.reload() */
  onRetry?: () => void;
  className?: string;
}

const CREATION_GRADIENT =
  "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)";

export function LoadingScreen({
  error,
  loadingTitle = "Loading…",
  loadingSubtitle = "Getting real-time information",
  autoRetry = false,
  autoRetryDelay = 3000,
  maxRetryAttempts = 3,
  onRetry,
  className,
}: LoadingScreenProps) {
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doRetry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  useEffect(() => {
    if (!error || !autoRetry) return;
    if (retryCountRef.current >= maxRetryAttempts) return;

    retryTimerRef.current = setTimeout(() => {
      retryCountRef.current += 1;
      doRetry();
    }, autoRetryDelay);

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [error, autoRetry, autoRetryDelay, maxRetryAttempts]);

  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0d1117] via-[hsl(260,25%,8%)] to-[#0d1117] p-6",
        className
      )}
    >
      <div className="w-full max-w-[28rem] flex flex-col items-center gap-8">
        {/* Logo – flip-in entrance */}
        <div
          className="loading-screen-flip-in h-32 w-32 flex items-center justify-center shrink-0"
          style={{ minHeight: 128, minWidth: 128 }}
        >
          <img
            src="/2K26.png"
            alt="Creation 2K26"
            className="h-28 w-28 object-contain"
          />
        </div>

        {error ? (
          /* Error state */
          <div className="loading-screen-fade-in w-full rounded-xl bg-gray-900/60 backdrop-blur border border-red-900/30 p-6 flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400 animate-pulse-soft">
              <AlertCircle className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-red-400">{error}</h2>
            <p className="text-sm text-muted-foreground">
              Please try again or contact support.
            </p>
            {autoRetry && (
              <p className="text-xs text-muted-foreground">
                Auto-retrying in {autoRetryDelay / 1000}s…
              </p>
            )}
            <Button
              onClick={doRetry}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : (
          /* Loading state */
          <div className="loading-screen-fade-in flex flex-col items-center gap-6">
            {/* Double ring spinner + center logo */}
            <div
              className="relative flex h-20 w-20 items-center justify-center shrink-0"
              style={{ minHeight: 80, minWidth: 80 }}
            >
              {/* Outer ring – primary, fast spin */}
              <div
                className="absolute h-20 w-20 rounded-full border-4 border-transparent border-t-primary animate-loading-spin"
                style={{ minWidth: 80, minHeight: 80 }}
                aria-hidden
              />
              {/* Inner ring – secondary, slow opposite spin */}
              <div
                className="absolute h-16 w-16 rounded-full border-4 border-transparent border-t-secondary border-r-secondary animate-loading-spin-slow"
                style={{ minWidth: 64, minHeight: 64 }}
                aria-hidden
              />
              {/* Center logo – pulse */}
              <div className="animate-pulse-soft flex h-12 w-12 items-center justify-center">
                <img
                  src="/2K26.png"
                  alt=""
                  className="h-10 w-12 object-contain"
                  aria-hidden
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <h1
                className="loading-screen-text-gradient text-lg font-semibold"
                style={{
                  background: CREATION_GRADIENT,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {loadingTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {loadingSubtitle}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
