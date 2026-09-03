// Paste into the `theme.extend` block of your tailwind.config.js
// Rationale for each token lives in SKILL.md.

module.exports = {
  theme: {
    extend: {
      colors: {
        fabric: "#10141F",
        paper: "#F5F6F8",
        wire: "#5B6478",
        quorum: {
          DEFAULT: "#D6A93B",
          ink: "#8A661F", // use for text/icons on light backgrounds
        },
        link: {
          DEFAULT: "#2FA6A6",
          ink: "#1C7A75", // use for text/icons on light backgrounds
        },
        fault: "#C0533E",
      },
      fontFamily: {
        sans: ["Vazirmatn", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        control: "2px", // buttons, inputs, status tags — structural blocks stay sharp (rounded-none)
      },
    },
  },
};
