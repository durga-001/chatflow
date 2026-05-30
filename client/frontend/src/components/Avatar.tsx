import type { User } from "../types/chat";
import { getInitialsColor } from "../assets/mockData";

interface AvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const statusSizeMap = {
  sm: "w-2 h-2 -bottom-0.5 -right-0.5",
  md: "w-2.5 h-2.5 -bottom-0.5 -right-0.5",
  lg: "w-3 h-3 -bottom-0.5 -right-0.5",
};

export default function Avatar({
  user,
  size = "md",
  showStatus = false,
}: AvatarProps) {
  const colorClass = getInitialsColor(user.initials);

  return (
    <div className="relative flex-shrink-0">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className={`${sizeMap[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`
            ${sizeMap[size]} rounded-full font-semibold font-display
            flex items-center justify-center ${colorClass}
            ring-2 ring-surface-border
          `}
        >
          {user.initials}
        </div>
      )}

      {showStatus && (
        <span
          className={`
            status-dot absolute ${statusSizeMap[size]}
            ${user.status === "online" ? "online" : user.status === "away" ? "away" : "offline"}
          `}
        />
      )}
    </div>
  );
}
