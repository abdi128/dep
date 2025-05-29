import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        

<svg
      viewBox="0 0 200 240"
      width={props.width || 120}
      height={props.height || 144}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer shield (classic security/insurance style) */}
      <path
        d="
          M100 20
          L180 60
          Q175 170 100 220
          Q25 170 20 60
          Z
        "
        fill="#1976d2"
        stroke="#1976d2"
        strokeWidth="8"
        />
      {/* Inner white shield for depth */}
      <path
        d="
          M100 40
          L164 70
          Q160 155 100 200
          Q40 155 36 70
          Z
        "
        fill="#fff"
      />
      {/* Medical pulse line */}
      <polyline
        points="55,150 85,120 105,170 125,90 155,150"
        fill="none"
        stroke="#1976d2"
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Pulse dot */}
      <circle cx="155" cy="150" r="12" fill="#1976d2" />
    </svg>
    );
}
