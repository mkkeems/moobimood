import { CommandIcon, Search } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

type CommandSearchButtonProps = {
  onClick: () => void;
};

const CommandSearchButton = ({ onClick }: CommandSearchButtonProps) => {
  return (
    <Button
      variant="outline"
      className="flex lg:flex-1 justify-between gap-2 px-3 text-sm text-muted-foreground"
      onClick={onClick}
    >
      <Search size={16} />
      Search
      <div className="flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
        <CommandIcon size={12} />K
      </div>
    </Button>
  );
};

export default CommandSearchButton;
