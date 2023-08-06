'use client';

/**
 * This file imports framer motion in a client file so it doesent crash, and then exports in a way that server components can use
 */

import { m } from 'framer-motion';

export const MotionDiv = m.div;
