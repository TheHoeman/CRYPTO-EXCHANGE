import { Alert, AlertDescription } from "@/components/ui/alert";
import { Beaker, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SandboxBannerProps {
  onDismiss?: () => void;
}

export default function SandboxBanner({ onDismiss }: SandboxBannerProps) {
  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-chart-4/10 border-chart-4/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Beaker className="h-5 w-5 text-chart-4" />
          <AlertDescription className="text-sm font-medium">
            You're in Sandbox Mode - Practice trading with virtual funds risk-free
          </AlertDescription>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDismiss}
            data-testid="button-dismiss-sandbox"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}
