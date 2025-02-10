import React from "react";

import { Link } from "react-router-dom";

interface ChildrenWithRedirectProps {
  children: React.ReactNode;
  redirectTo: string;
  isExternal?: boolean; // default false for internal links (relative to current domain)
}

export const ChildrenWithRedirect: React.FC<ChildrenWithRedirectProps> = ({
  children,
  redirectTo,
  isExternal,
}) => {
  return (
    <Link
      to={redirectTo}
      target={
        isExternal ? "_blank" : "_self" // open in new tab for external links, otherwise same tab for internal links (default)
      }
    >
      {children}
    </Link>
  );
};
