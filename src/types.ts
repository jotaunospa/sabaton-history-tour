export interface HistoricalEvent {
  id: number;
  title: string;
  song: string;
  album: string;
  year: number;
  dateStr: string;
  lat: number;
  lng: number;
  description: string;
  imageUrl: string;
  keyFigures: string[];
  casualties: string;
  wikipediaUrl: string;
}
