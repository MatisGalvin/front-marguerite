export type SocketPayload = {
    
        event: string;
        createdAt: string;
        model: string;
        entry: {
          id: number;
          geolocation: Record<string, unknown>;
          city: string | null;
          postal_code: string | null;
          category: string | null;
          full_name: string;
          createdAt: string;
          updatedAt: string;
          cover: string | null;
          images: string[];
        }
};

