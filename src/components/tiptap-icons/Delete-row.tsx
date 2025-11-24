import * as React from "react";

export const DeleteRowIcon = React.memo(
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
        d="M12.93 4.002h-6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-1.423"
        stroke="#DC362E"
        strokeLinecap="round"
      />
      <path d="M4.297 7.627h13.031" stroke="#DC362E" />
      <path
        d="m15.023 5.321 2.305 2.306-2.305 2.305"
        stroke="#DC362E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill="#fff" d="M6.24 10.532h7.572v7.572H6.24z" />
      <path
        d="m11.852 12.482-3.664 3.664m3.672 0-3.665-3.664"
        stroke="#DC362E"
        strokeWidth={1.099}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

DeleteRowIcon.displayName = "DeleteRowIcon";