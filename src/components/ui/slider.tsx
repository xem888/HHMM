import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const reduce = useReducedMotion();
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "group relative flex w-full touch-none select-none items-center py-1.5",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-input transition-[height] duration-200 ease-out motion-safe:group-hover:h-2.5 motion-safe:group-active:h-2.5">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb asChild>
        <motion.div
          whileHover={reduce ? undefined : { scale: 1.15 }}
          whileTap={reduce ? undefined : { scale: 1.3 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="block h-4 w-4 cursor-grab rounded-full border border-primary/50 bg-white shadow active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
