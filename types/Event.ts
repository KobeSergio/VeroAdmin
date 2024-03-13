export interface Event {
    id?: string;
    name: string;
    date: {
      seconds: number; // Assuming Firebase returns timestamps with a 'seconds' property
    };
    description: string;
  }
  