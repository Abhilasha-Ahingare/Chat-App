import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({ delayDuration = 0, ...props }) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({ className, children, hideArrow, ...props }) {
  return (
    <TooltipPrimitive.Content
      data-slot="tooltip-content"
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    >
      {children}
      {/* Only render arrow if hideArrow is not true */}
      {!hideArrow && (
        <TooltipPrimitive.Arrow className="fill-current text-popover" />
      )}
    </TooltipPrimitive.Content>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
