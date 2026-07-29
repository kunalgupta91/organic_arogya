type IconProps = { size?: number; className?: string };

export function FacebookIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-8.5h2.85l.43-3.31H13.5V7.05c0-.96.27-1.61 1.64-1.61h1.75V2.48C16.57 2.42 15.54 2.34 14.34 2.34c-2.5 0-4.21 1.53-4.21 4.33v2.52H7.27v3.31h2.86V21h3.37z" />
    </svg>
  );
}

export function InstagramIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 3H21l-6.3 7.2L22 21h-6.3l-4.9-6.4L4.9 21H3l6.7-7.7L2 3h6.4l4.4 5.9L18.9 3zm-1.1 16.2h1.2L7.3 4.7H6l11.8 14.5z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.5c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.7.1 6.5.2 6.5.2s3.9 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.5v-1.5c0-1.8-.2-3.5-.2-3.5zM9.9 14.6V8.9l5.4 2.9-5.4 2.8z" />
    </svg>
  );
}
