import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CommandSearchGroupProps = {
  heading: string;
  children: ReactNode;
  className?: string;
};

export const CommandSearchGroup = ({
  children,
  heading,
  className,
}: CommandSearchGroupProps) => {
  return (
    <div className={cn("p-2 ", className)}>
      <div className="font-bold p-2 text-muted-foreground">{heading}</div>
      {/* <div className="h-px bg-border" /> */}
      <div className={cn("flex flex-col")}>{children}</div>
    </div>
  );
};

export default CommandSearchGroup;
