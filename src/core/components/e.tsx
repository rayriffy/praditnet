import { memo, SVGProps } from 'react'

export const E = memo<SVGProps<SVGSVGElement>>(props => (
  <svg
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 62.3 88.3"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        x1="213.8"
        y1="332.1"
        x2="213.8"
        y2="243.8"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#2596c4" />
        <stop offset=".2" stop-color="#2488c1" />
        <stop offset=".3" stop-color="#247abe" />
        <stop offset=".4" stop-color="#2983c1" />
        <stop offset=".6" stop-color="#379cca" />
        <stop offset=".9" stop-color="#4dc4d9" />
        <stop offset="1" stop-color="#57d6e0" />
      </linearGradient>
      <linearGradient
        id="b"
        x1="218.7"
        y1="287.7"
        x2="218.7"
        y2="273.1"
        gradientTransform="rotate(13.3 218.8 280.4)"
        xlinkHref="#a"
      />
    </defs>
    <path
      d="M239 265.8a43.2 43.2 0 0 0-4.7-6.6l-.1-.1a44.1 44.1 0 0 0-51.5-11.4v9a36 36 0 0 1 39.6 2.2 25.3 25.3 0 0 1 8.5 11.4c2.6 7 2.8 12.7.4 17.3-4.7 9.3-18.7 11-18.9 11.1a4 4 0 0 0 .5 8 3.9 3.9 0 0 0 .5 0c.7 0 15.3-2 23-12.2a36.2 36.2 0 0 1-38.5 29.5 35.8 35.8 0 0 1-15.1-4.8v9a43.6 43.6 0 0 0 14.7 3.8 44.1 44.1 0 0 0 41.6-66.2Z"
      transform="translate(-182.7 -243.8)"
      style={{
        fill: ' url(#a)',
      }}
    />
    <circle
      cx="218.7"
      cy="280.4"
      r="7.3"
      transform="rotate(-13.3 -919.5 943.2)"
      style={{
        fill: ' url(#b)',
      }}
    />
  </svg>
))
