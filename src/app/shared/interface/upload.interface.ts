import { UploadStrategyInterface } from './upload-strategy.interface';

export interface UploadInterface {
  uid: string;
  file: File;
  strategy: UploadStrategyInterface;
}
