export interface TSchedule {
  id: string;
  title: string;
  content?: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
}

export interface TScheduleList {
  [key: string]: TSchedule[];
}
