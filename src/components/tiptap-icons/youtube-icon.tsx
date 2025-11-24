import React from "react";

const YoutubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="25"
    height="25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.783 6.252c-.726-.01-1.544-.01-2.468-.01-4 0-6 0-7.244.87-1.242.87-1.242 2.27-1.242 5.07 0 2.8-.001 4.2 1.242 5.07 1.243.87 3.243.87 7.244.87 4 0 6.001 0 7.243-.87 1.243-.87 1.243-2.27 1.243-5.07 0-.458 0-.878-.006-1.265"
      stroke="#000"
      strokeWidth={1.33}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.467 9.806v4.752a.465.465 0 0 0 .468.463.455.455 0 0 0 .26-.077L14.8 12.59a.462.462 0 0 0 .004-.77l-3.606-2.397a.471.471 0 0 0-.651.125.454.454 0 0 0-.08.259Z"
      stroke="#000"
      strokeWidth={1.33}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.801 7.218h4m-2-2v4"
      stroke="#000"
      strokeWidth={1.333}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default YoutubeIcon;