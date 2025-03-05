import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { forwardRef } from "react";

interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "blockquote";
  className?: ClassValue[];
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Typography = forwardRef<any, TypographyProps>(
  ({ variant: Component, children, className }, ref) => {
    const componentClasses: { [key in TypographyProps["variant"]]: string } = {
      h1: "Typography__h1",
      h2: "Typography__h2",
      h3: "Typography__h3",
      h4: "Typography__h4",
      p: "Typography__p",
      span: "Typography__span",
      blockquote: "Typography__blockquote",
    };
    const typographyCombinedClasses = cn(
      "text-md text-current font-extrabold",
      className,
      componentClasses[Component]
    );

    return (
      <Component ref={ref} className={typographyCombinedClasses}>
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";
