export const getDaysOfMonth = (type: string, year: number, month: number) => {
  switch (type) {
    case 'firstDay': // 월의 시작 요일
      return new Date(year, month, 1).getDay();
    case 'lastDate': // 월의 마지막 날짜
      return new Date(year, month + 1, 0).getDate();
    case 'lastDay': // 월 마지막 날짜의 요일
      return new Date(year, month + 1, 0).getDay(); // 0: 일요일, 1: 월요일, 2: 화요일, ...
  }
};

export const getCalendarDays = (year: number, month: number) => {
  const firstDay = getDaysOfMonth('firstDay', year, month);
  const lastDate = getDaysOfMonth('lastDate', year, month);
  const lastDay = getDaysOfMonth('lastDay', year, month);

  let daysArray: {
    day: number;
    isCurrentMonth: boolean;
    isPrevMonth: boolean;
    isNextMonth: boolean;
  }[] = [];

  if (firstDay === undefined || lastDate === undefined || lastDay === undefined) {
    return;
  }

  if (firstDay !== 0) {
    const prevLastDay = new Date(year, month - 2, 0).getDate();
    const lastDays = prevLastDay - firstDay + 1;
    for (let day = lastDays; day < prevLastDay + 1; day++) {
      daysArray.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
      });
    }
  }

  for (let day = 1; day < lastDate + 1; day++) {
    daysArray.push({
      day,
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false,
    });
  }

  if (lastDay !== 6) {
    const nextDays = 6 - lastDay;
    for (let day = 1; day < nextDays + 1; day++) {
      daysArray.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
      });
    }
  }
  return daysArray;
};
