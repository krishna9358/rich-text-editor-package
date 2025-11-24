import * as React from "react";

export const AddRowIcon = React.memo(
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
        d="M12.825 4.185h-6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-1.423"
        stroke="#000"
        strokeLinecap="round"
      />
      <path d="M4.192 7.81h13.032" stroke="#000" />
      <path
        d="m14.918 5.504 2.306 2.306-2.306 2.305"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill="#fff" d="M6.136 10.715h7.572v7.572H6.136z" />
      <path
        d="M9.913 11.91v5.182m2.597-2.597H7.328"
        stroke="#000"
        strokeWidth="1.099"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

AddRowIcon.displayName = "AddRowIcon";