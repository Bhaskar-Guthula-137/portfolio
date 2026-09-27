import { motionValue } from "framer-motion"

/** Font size (px) of the name when it sits in the navbar as a logo. */
export const LOGO_FONT_PX = 15

/**
 * Opacity of the navbar logo. The home hero drives it so its big name can
 * shrink into the navbar and hand over to the logo; everywhere else it stays 1.
 */
export const navLogoOpacity = motionValue(1)
