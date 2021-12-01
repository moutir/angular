export interface HelpLoadResponseInterface {
  categories: Array<{
    [id: string]: string;
  }>;
  data: Array<{
    id: string;
    category: string;
    content: string;
    dependency: string;
    content_format: string;
    help_category_id: string;
    help_format_id: string;
    keyword: string;
    order: string;
    title: string;
    url: string;
  }>;
}
