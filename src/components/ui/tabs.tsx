"use client";
import * as T from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";
export const Tabs = T.Root;
export const TabsList = ({ className, ...p }: React.ComponentProps<typeof T.List>) => <T.List className={cn("inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1", className)} {...p} />;
export const TabsTrigger = ({ className, ...p }: React.ComponentProps<typeof T.Trigger>) => (
  <T.Trigger className={cn("min-h-9 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm", className)} {...p} />
);
export const TabsContent = ({ className, ...p }: React.ComponentProps<typeof T.Content>) => <T.Content className={cn("mt-4", className)} {...p} />;
