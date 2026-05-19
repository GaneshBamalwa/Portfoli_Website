export const mobileVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const desktopVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const entryVariants = (isMobile: boolean) =>
  isMobile ? mobileVariants : desktopVariants;
