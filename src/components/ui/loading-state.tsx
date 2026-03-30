"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6", 
        lg: "w-8 h-8"
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
            {text && <span className="text-sm text-text-secondary">{text}</span>}
        </div>
    );
}

interface LoadingStateProps {
    isLoading: boolean;
    error?: string;
    onRetry?: () => void;
    empty?: boolean;
    emptyText?: string;
    emptyIcon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function LoadingState({ 
    isLoading, 
    error, 
    onRetry, 
    empty, 
    emptyText = "No data available", 
    emptyIcon,
    children, 
    className 
}: LoadingStateProps) {
    if (isLoading) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-20", className)}>
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-text-secondary">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-20", className)}>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
                    <p className="text-red-600 font-medium mb-2">Error</p>
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (empty) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-20", className)}>
                {emptyIcon || <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>}
                <p className="text-text-secondary mb-2">{emptyText}</p>
            </div>
        );
    }

    return <>{children}</>;
}
