import { cn } from "@/lib/utils/cn";
export const Skeleton = ({ className }: { className?: string }) => <div aria-hidden className={cn("skeleton h-4 w-full", className)} />;
