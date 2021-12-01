export interface PropertyPublicationInterface {
  propertyIds: string[];
  websites: {
    changes: {[id: string]: string; };
    dates: {
      from: Date|null;
      to: Date|null;
    };
  };
  portals: {
    changes: {[id: string]: string; };
    dates: {
      from: Date|null;
      to: Date|null;
    };
  };
}
