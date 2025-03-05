import { Link } from "react-router-dom";

import { Typography } from "@/components/Typography";

import { humanizeText } from "@/lib/text-format";

import type { NavItem } from "@/components/navigation/type";

export function renderVerticalNavigationItems(items: NavItem[]) {
  if (items.length > 0) {
    return items.map((item, index) => (
      <Link
        to={item.path}
        className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors"
        key={index}
      >
        {item.icon ? item.icon : undefined}
        <Typography variant="span" className={["text-current"]}>
          {humanizeText(item.label)}
        </Typography>
      </Link>
    ));
  }

  return null;
}
