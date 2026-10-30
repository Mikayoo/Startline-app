import { Step } from './steps';

// Photos from the v3.1 Figma file. One per topic so cards stay recognizable.
export const PHOTO = {
  housing: require('../../assets/images/photo-housing.jpg'),
  family: require('../../assets/images/photo-family.jpg'),
  library: require('../../assets/images/photo-library.jpg'),
  dropin: require('../../assets/images/photo-dropin.jpg'),
  street: require('../../assets/images/photo-street.jpg'),
  circle: require('../../assets/images/photo-circle.jpg'),
} satisfies Record<string, number>;

const BY_CATEGORY: Record<Step['category'], number> = {
  housing: PHOTO.housing,
  legal: PHOTO.dropin,
  health: PHOTO.family,
  money: PHOTO.street,
  language: PHOTO.library,
  school: PHOTO.family,
  community: PHOTO.circle,
  documents: PHOTO.dropin,
};

export function stepPhoto(step: Step): number {
  return BY_CATEGORY[step.category];
}
