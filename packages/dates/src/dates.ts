import { round } from "@caiquecamargo/number";

export function dates(): string {
  return "dates";
}

export const millisInDay = 86400000;

export const nowPlusHours = (plusHours: number) => {
  return addHours(new Date(), plusHours);
};

export const addHours = (date: Date, plusHours: number) => {
  date.setHours(date.getHours() + plusHours);
  return date;
};

export const dateISO = (plusHours?: number) => {
  const date = new Date();
  if (plusHours) date.setHours(date.getHours() + plusHours);
  return date.toISOString();
};

export const weekISO = (ref?: Date) => {
  const date = ref ? new Date(ref.getTime()) : new Date();

  date.setHours(0, 0, 0, 0);
  // https://en.wikipedia.org/wiki/ISO_week_date#First_week
  // Thursday decides the week
  // January 4 is always in week 1
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));

  const fullYear = date.getFullYear();
  const firstWeekOfTheYear = new Date(fullYear, 0, 4);

  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  const daysSoFar =
    (date.getTime() - firstWeekOfTheYear.getTime()) / millisInDay;
  const weekNumber =
    Math.round((daysSoFar - 3 + ((firstWeekOfTheYear.getDay() + 6) % 7)) / 7) +
    1;
  const weekString = ("0" + weekNumber).slice(-2);

  return [fullYear, weekString].join("-W");
};

export const getDate = (date?: Date) => {
  if (!date) return new Date().getUTCDate();
  return date.getUTCDate();
};

export const getMonth = (date?: Date) => {
  if (!date) return new Date().getMonth() + 1;
  return date.getMonth() + 1;
};

export const getYear = (date?: Date) => {
  if (!date) return new Date().getFullYear();
  return date.getFullYear();
};

export function epochToDate(epoch: number) {
  return new Date(epoch * 1000);
}

export function dateToEpoch(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

export function milisencondsToDates(miliseconds: number) {
  const seconds = round(miliseconds / 1000, 2);
  const minutes = round(seconds / 60, 2);
  const hours = round(minutes / 60, 2);
  const days = round(hours / 24, 2);
  const weeks = round(days / 7, 2);
  const months = round(days / 30, 2);
  const years = round(days / 365, 2);

  return {
    seconds,
    minutes,
    hours,
    days,
    weeks,
    months,
    years,
  };
}
