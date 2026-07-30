/**
 * Computes years of professional experience based on career start date.
 * Updates automatically as time passes — no manual edits needed.
 */

const CAREER_START = new Date(2018, 6, 1); // July 2018

export function getYearsOfExperience(): number {
  const now = new Date();
  const years = now.getFullYear() - CAREER_START.getFullYear();
  const monthDiff = now.getMonth() - CAREER_START.getMonth();
  // If we haven't reached the anniversary month yet, subtract 1
  return monthDiff < 0 ? years - 1 : years;
}

export function getExperienceLabel(): string {
  return `${getYearsOfExperience()}+`;
}
