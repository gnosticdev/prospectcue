type ZoneResponse = {
    errors: [];
    messages: [];
    success: boolean;
    result_info: {
        count: number;
        page: number;
        per_page: number;
        total_count: number;
    };
    result: [
        {
            activated_on: string;
            created_on: string;
            development_mode: number;
            id: string;
            modified_on: string;
            name: string;
            original_dnshost: string;
            original_name_servers: string[];
            original_registrar: string;
        }
    ];
};

type PurgeResponse = {
    errors: [];
    messages: [];
    result: {
        id: string;
    };
    success: boolean;
};
