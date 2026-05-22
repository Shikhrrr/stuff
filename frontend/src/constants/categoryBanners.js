/**
 * Category page hero banners — lifestyle imagery tuned for conversion & retention.
 * Women: aspirational style · Men: confidence & performance · Kids: joy & trust (parents)
 */
const unsplash = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const CATEGORY_BANNERS = {
  women: {
    src: unsplash('photo-1543163521-1bf539c55dd2'),
    alt: "Women's fashion and footwear lifestyle",
    objectPosition: 'center 30%',
  },
  men: {
    src: unsplash('photo-1542291026-7eec264c27ff'),
    alt: "Men's sneakers and active lifestyle",
    objectPosition: '55% 70%',
  },
  kids: {
    src: unsplash('photo-1503454537195-1dcabb73ffb9'),
    alt: 'Kids playing outdoors in active footwear',
    objectPosition: 'center 40%',
  },
};

export function getCategoryBanner(categoryId) {
  return CATEGORY_BANNERS[categoryId] ?? CATEGORY_BANNERS.women;
}
