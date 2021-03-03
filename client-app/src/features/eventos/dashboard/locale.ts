export const es = {
    // months list by order
    months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
    ],
  
    // week days by order
    weekDays: [
      
      {
        name: 'Lunes',
        short: 'L',
      },
      {
        name: 'Martes',
        short: 'M',
      },
      {
        name: 'Miércoles',
        short: 'X',
      },
      {
        name: 'Jueves',
        short: 'J',
      },
      {
        name: 'Viernes',
        short: 'V',
      },
      {
        name: 'Sábado',
        short: 'S',
        isWeekend: true,
      },
      {
        name: 'Domingo', // used for accessibility 
        short: 'D', // displayed at the top of days' rows
        isWeekend: true, // is it a formal weekend or not?
      }
    ],
  
    // just play around with this number between 0 and 6
    weekStartingIndex: 0,
  
    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject: any) {
      return gregorainTodayObject;
    },
  
    // return a native JavaScript date here
    toNativeDate(date: any) {
      return new Date(date.year, date.month - 1, date.day);
    },
  
    // return a number for date's month length
    getMonthLength(date: any) {
      return new Date(date.year, date.month, 0).getDate();
    },
  
    // return a transformed digit to your locale
    transformDigit(digit: any) {
      return digit;
    },
  
    // texts in the date picker
    nextMonth: 'Sig. Mes',
    previousMonth: 'Ant. Mes',
    openMonthSelector: 'Seleccionar MES',
    openYearSelector: 'Seleccionar AÑO',
    closeMonthSelector: 'Cerrar selección',
    closeYearSelector: 'Cerrar selección',
    defaultPlaceholder: 'Seleccciona...',
  
    // for input range value
    from: 'de',
    to: 'a',
  
  
    // used for input value when multi dates are selected
    digitSeparator: ',',
  
    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,
  
    // is your language rtl or ltr?
    isRtl: false,
  }