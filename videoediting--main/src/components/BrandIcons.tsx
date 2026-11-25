import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function StudioApertureIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect
        x="2"
        y="4"
        width="28"
        height="24"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12.5 11.2L21.5 16L12.5 20.8V11.2Z"
        fill="currentColor"
      />
      <path
        d="M7 8.5H8.5M23.5 8.5H25M7 23.5H8.5M23.5 23.5H25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PremiereProIcon({ className = "h-10 w-10", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="44" height="44" rx="10" fill="#00005B" />
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="9"
        stroke="#9999FF"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <path
        d="M12.5 32.5V15.5H19.6C23.5 15.5 26 17.6 26 21.1C26 24.7 23.4 26.8 19.4 26.8H16.2V32.5H12.5ZM16.2 23.7H19.1C21.1 23.7 22.3 22.7 22.3 21.1C22.3 19.5 21.1 18.6 19.1 18.6H16.2V23.7Z"
        fill="#9999FF"
      />
      <path
        d="M28.4 32.5V20.1H31.7L31.9 22.2C32.7 20.6 34.1 19.8 35.9 19.8C36.3 19.8 36.7 19.8 37 19.9V23.3C36.6 23.2 36.1 23.1 35.5 23.1C33.4 23.1 32.1 24.4 32.1 27V32.5H28.4Z"
        fill="#9999FF"
      />
    </svg>
  );
}

export function AfterEffectsIcon({ className = "h-10 w-10", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="44" height="44" rx="10" fill="#00005B" />
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="9"
        stroke="#D291FF"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <path
        d="M10.4 32.5L16.3 15.5H20.4L26.3 32.5H22.4L21.1 28.4H15.5L14.2 32.5H10.4ZM16.4 25.4H20.2L18.3 19.2L16.4 25.4Z"
        fill="#D291FF"
      />
      <path
        d="M33.7 32.8C29.6 32.8 27.1 30.2 27.1 26.3C27.1 22.4 29.7 19.7 33.4 19.7C37.2 19.7 39.4 22.3 39.4 26C39.4 26.5 39.4 27 39.3 27.4H30.7C30.9 29.1 32 30.1 33.8 30.1C35.1 30.1 36.1 29.6 36.7 28.7L39.1 30.4C38 32 36.2 32.8 33.7 32.8ZM30.7 25H35.9C35.8 23.3 34.8 22.4 33.4 22.4C31.9 22.4 30.9 23.4 30.7 25Z"
        fill="#D291FF"
      />
    </svg>
  );
}

export function CapCutIcon({ className = "h-10 w-10", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="44" height="44" rx="10" fill="#0E1416" />
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="9"
        stroke="#00F5D4"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <path
        d="M13 17.2C13 15.7 14.2 14.5 15.7 14.5H27.4C28.2 14.5 29 14.9 29.5 15.5L35 22.5L29.5 29.5C29 30.1 28.2 30.5 27.4 30.5H15.7C14.2 30.5 13 29.3 13 27.8V26.2L22.5 21.8L13 17.4V17.2Z"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M13 30.8L35 20.2M13 17.2L35 27.8"
        stroke="#00F5D4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM17.85 16.02C17.6 16.72 16.4 17.36 15.83 17.44C15.31 17.52 14.65 17.56 13.93 17.33C13.49 17.19 12.93 17 12.22 16.69C9.22 15.39 7.26 12.37 7.11 12.17C6.96 11.97 5.89 10.55 5.89 9.08C5.89 7.61 6.66 6.89 6.93 6.59C7.2 6.29 7.52 6.22 7.72 6.22C7.92 6.22 8.12 6.22 8.29 6.23C8.47 6.24 8.72 6.16 8.96 6.74C9.21 7.34 9.81 8.81 9.88 8.96C9.95 9.11 10 9.28 9.9 9.48C9.8 9.68 9.75 9.8 9.6 9.97C9.45 10.14 9.29 10.35 9.15 10.48C9 10.63 8.84 10.79 9.02 11.09C9.2 11.39 9.82 12.41 10.73 13.22C11.9 14.26 12.89 14.59 13.19 14.74C13.49 14.89 13.66 14.86 13.84 14.66C14.02 14.46 14.61 13.76 14.82 13.46C15.03 13.16 15.24 13.21 15.53 13.31C15.82 13.41 17.37 14.18 17.68 14.33C17.99 14.48 18.2 14.56 18.27 14.68C18.35 14.81 18.35 15.42 17.85 16.02Z" />
    </svg>
  );
}

export function YouTubeIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M23.5 6.19A3.02 3.02 0 0 0 21.38 4.05C19.5 3.54 12 3.54 12 3.54C12 3.54 4.5 3.54 2.62 4.05A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12C0 12 0 15.92.5 17.81A3.02 3.02 0 0 0 2.62 19.95C4.5 20.46 12 20.46 12 20.46C12 20.46 19.5 20.46 21.38 19.95A3.02 3.02 0 0 0 23.5 17.81C24 15.92 24 12 24 12C24 12 24 8.08 23.5 6.19ZM9.54 15.57V8.43L15.82 12L9.54 15.57Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
