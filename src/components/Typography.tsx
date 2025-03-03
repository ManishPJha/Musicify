import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { forwardRef } from "react";

interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: ClassValue[];
  children: React.ReactNode;
}

export const Typography = forwardRef<unknown, TypographyProps>(
  ({ variant: Component, children, className }) => {
    const componentClasses: { [key in TypographyProps["variant"]]: string } =
      {};

    return (
      <Component className={cn({ componentClasses, ...className })}>
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";
