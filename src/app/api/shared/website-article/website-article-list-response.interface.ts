export interface WebsiteArticleListResponseInterface {
  data: Array<{
    DT_RowId: string;
    title: string;
    author: string;
    creation_datetime: string;
    main_url: string;
    is_published: boolean;
  }>;
  recordsTotal: string;
}
