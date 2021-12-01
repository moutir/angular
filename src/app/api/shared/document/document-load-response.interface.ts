export interface DocumentLoadResponseInterface extends Array<{
  id: string;
  name: string;
  size: number;
  type: string;
  title: string;
  tag: string;
  fileUrl: string;
  thumbnailUrl: string;
  photoLargeUrl: string;
  mimeType: string;
  isVisibleOnBrochure: boolean;
  isVisibleOnGateways: boolean;
  isVisibleOnWebsite: boolean;
  isFloorPlan: boolean;
  isVisibleOnBrochureHalf: boolean;
  isVisibleOnBrochureFull: boolean;
  isVisibleOnBrochureThird: boolean;
  isVisibleOnBrochureQuarter: boolean;
  isVisibleOn360vt: boolean;
  use_as_watermark: string;
  use_as_logo: string;
  use_as_default_property_picture: string;
  use_as_avatar: string;
  use_as_signature: string;
  use_as_prestige_brochure_cover: string;
  isPlan: string;
  isPromotionLogo: string;
  use_as_email_banner: string;
  email_banner_url: string;
  upload_date: string;
}> {

}
