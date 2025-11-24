import * as React from "react";

export const AddColumnIcon = React.memo(
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
        stroke="#000"
        strokeLinecap="round"
      />
      <path d="M7.514 4.137V17.17" stroke="#000" />
      <path
        d="m5.208 14.863 2.306 2.306 2.305-2.306"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill="#fff" d="M10.418 5.984h7.572v7.572h-7.572z" />
      <path
        d="M14.195 7.18v5.18m2.597-2.596H11.61"
        stroke="#000"
        strokeWidth="1.099"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

AddColumnIcon.displayName = "AddColumnIcon";