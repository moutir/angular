export interface WebsiteListResponseInterface {
  data: Array<{
    DT_RowId: string;
    main_url: string;
    is_internal: string;
    active: string;
    enable_fisher: string;
    preview_url: string;
    website_layout: string;
    server_ip_address: string;
    api_key: string;
    api_key_public: string;
  }>;
  recordsTotal: string;
}
