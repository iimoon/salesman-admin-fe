import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
    size?: "small" | "medium" | "large";
    show?: boolean;
    className?: string;
}

export function Spinner({ size = "medium", show = true, className }: SpinnerProps) {
    if (!show) return null;

    const sizeClasses = {
        small: "h-4 w-4",
        medium: "h-6 w-6",
        large: "h-10 w-10",
    };

    return (
        <span className={cn("flex items-center justify-center", className)}>
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        </span>
    );
}
