export interface EmailTemplateListResponseInterface {
  data: Array<{
    id: string;
    DT_RowId: string;
    index: number;
    check: string;
    label: string;
    subject: string;
    shared: string;
    is_shared: boolean;
    creator: {
      id: string;
      name: string;
    };
    canUpdate: number;
    canDelete: number;
  }>;
  draw: string;
  recordsTotal: string;
  recordsFiltered: string;
}
