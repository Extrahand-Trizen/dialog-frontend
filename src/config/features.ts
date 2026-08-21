export const features = {
  campaigns: true,
  analyticsV2: false,
  multiOrg: false,
} as const;

export type FeatureKey = keyof typeof features;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return features[key];
}
