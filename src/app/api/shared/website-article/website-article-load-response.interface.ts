export interface WebsiteArticleLoadResponseInterface {
  id: string;
  agency_website_id: string;
  author: string;
  creation_datetime: string;
  published: string; // '0' OR '1'
  content: Array<{
    content: string;
    language: string;
    seo_description: string;
    seo_keywords: string;
    title: string;
  }>;
}
