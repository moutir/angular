export interface DeviceListResponseInterface {
  data: Array<{
    id: string;
    device_id: string;
    user: string;
    last_login_datetime: string;
    blacklist_datetime?: string
    reset_datetime?: string
    blacklister?: string
    status?: string
  }>;
  recordsTotal: string; // total number of records matching search query
}
