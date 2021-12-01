export interface EmailBrochureDownloadInterface {
  id: string;
  reference: string;
  name: string;
  photoURL: string;
  link: string;
  downloadCount: number;
  firstDownloadDate: Date|null;
  lastDownloadDate: Date|null;
}
