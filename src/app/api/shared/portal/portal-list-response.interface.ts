export interface PortalListResponseInterface {
    data: Array<{
        DT_RowId: string;
        gateway: string;
        index: number;
        is_active_gateway: string; // Human i18n string like Yes/No
        is_active_gateway_flag: boolean; // Boolean status
        label: string;
        language: string;
        language_code: string;
        last_execution_start_datetime: string;
        last_execution_end_datetime: string;
        last_message?: string;
        last_status?: string;
        max_pictures: string;
        transfer_inactive: boolean;
    }>;
    draw: string;
    recordsTotal: string;
    recordsFiltered: string;
}
