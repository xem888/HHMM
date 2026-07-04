import * as React from "react";
import { AlertTriangle, RotateCcw, RefreshCw } from "lucide-react";
import i18n from "@/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleRetry = () => this.setState({ hasError: false });
  private handleReload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    const t = (key: string, fallback: string) => {
      const v = i18n.t(key, { ns: "common" });
      return typeof v === "string" && v !== key ? v : fallback;
    };

    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Card className="flex max-w-md flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {t("error.title", "Something went wrong")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                "error.description",
                "An unexpected error occurred. You can retry or reload the app.",
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={this.handleRetry}>
              <RotateCcw className="h-4 w-4" />
              {t("retry", "Retry")}
            </Button>
            <Button onClick={this.handleReload}>
              <RefreshCw className="h-4 w-4" />
              {t("reload", "Reload")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}
