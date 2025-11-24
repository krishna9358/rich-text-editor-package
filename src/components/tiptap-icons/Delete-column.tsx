import * as React from "react";

export const DeleteColumnIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      width="20"
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3.889 12.77v-6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-1.423"
        stroke="#DC362E"
        strokeLinecap="round"
      />
      <path d="M7.514 4.137V17.17" stroke="#DC362E" />
      <path
        d="m5.208 14.863 2.306 2.306 2.305-2.306"
        stroke="#DC362E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill="#fff" d="M10.418 5.984h7.572v7.572h-7.572z" />
      <path
        d="m16.03 7.934-3.665 3.664m3.672 0-3.664-3.664"
        stroke="#DC362E"
        strokeWidth="1.099"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

DeleteColumnIcon.displayName = "DeleteColumnIcon";
