export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="h-9 w-9"
      >
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="12"
          fill="url(#cd-gradient)"
        />
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="12"
          stroke="white"
          strokeOpacity="0.25"
        />
        <path
          d="M13 13h5.5a4.5 4.5 0 0 1 0 9H13v5a4.5 4.5 0 0 0 4.5 4.5H27v-5h-9.5a4.5 4.5 0 0 1 0-9H27v-4.5a4.5 4.5 0 0 0-4.5-4.5H13v4.5Z"
          fill="white"
        />
        <circle cx="27" cy="20" r="3.25" fill="#fbbf24" />
        <defs>
          <linearGradient
            id="cd-gradient"
            x1="4"
            y1="2"
            x2="36"
            y2="38"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
      </svg>
      <span className="hidden text-xl font-bold tracking-tight text-foreground sm:inline">
        creator
        <span className="font-cursive font-semibold text-primary">-devance</span>
      </span>
    </span>
  );
}