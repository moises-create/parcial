import * as TooltipPrimitive from "@radix-ui/react-tooltip";

/* ─── tooltip component ─────────────────────────────────────────── */
const Tooltip = ({ content, side = "right", children }) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root delayDuration={150}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className="z-[60] rounded-md bg-gray-900 px-2 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-gray-900" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

export default Tooltip;
