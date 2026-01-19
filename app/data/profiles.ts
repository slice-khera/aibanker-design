import type { MockProfile } from "./mockProfiles";
import { weekendBallerProfile } from "./mockProfiles";

export const profiles: MockProfile[] = [weekendBallerProfile];

export const defaultProfileId = weekendBallerProfile.id;

export const getProfileById = (id: string): MockProfile => {
  return profiles.find((profile) => profile.id === id) ?? profiles[0];
};
