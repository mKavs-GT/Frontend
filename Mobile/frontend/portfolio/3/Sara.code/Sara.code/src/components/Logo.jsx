const Logo = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ width: '1.5em', height: '1.5em' }}
    >
        {/* Steam */}
        <path d="M8 2c0 .5.5 1 1 1s1 .5 1 1" />
        <path d="M11 1c0 .5.5 1 1 1s1 .5 1 1" />

        {/* Mug Body */}
        <path d="M5 8h11a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1z" />

        {/* Handle */}
        <path d="M17 11c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5" />

        {/* Code Symbols */}
        <path d="M8 13l-1.5 1.5L8 16" />
        <path d="M13 13l1.5 1.5L13 16" />
        <path d="M11 12l-1 4" />
    </svg>
);

export default Logo;
