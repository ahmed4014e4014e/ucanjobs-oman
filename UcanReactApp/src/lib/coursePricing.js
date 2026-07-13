export const COURSE_PRICE_MIN_OMR = 8;
export const COURSE_PRICE_MAX_OMR = 15;

export function normalizeCoursePriceOmr(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return COURSE_PRICE_MIN_OMR;
  }

  return Math.min(COURSE_PRICE_MAX_OMR, Math.max(COURSE_PRICE_MIN_OMR, price));
}

export function formatCoursePriceOmr(value) {
  const price = normalizeCoursePriceOmr(value);

  return `${price.toFixed(3).replace(/\.?0+$/, "")} OMR`;
}
