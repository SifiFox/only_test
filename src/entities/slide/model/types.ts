export interface SlideDate {
  year: string;
  title: string;
}

export interface SlideCategory {
  id: number;
  title: string;
  dates: SlideDate[];
}
