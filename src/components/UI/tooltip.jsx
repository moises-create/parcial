import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const greenTheme = {
  darkBg: "#065f46",
  lightText: "#d1fae5",
};

const Tooltip = ({ content, side = "right", children }) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root delayDuration={150}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className="z-50 rounded-md px-2 py-1.5 text-xs shadow-md animate-in fade-in-0 zoom-in-95"
          style={{
            backgroundColor: greenTheme.darkBg,
            color: greenTheme.lightText,
          }}
        >
          {content}
          <TooltipPrimitive.Arrow
            className="fill-current"
            style={{ color: greenTheme.darkBg }}
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

export default Tooltip;
