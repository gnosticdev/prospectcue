interface Window {
    prospectCue: {
        addressDivs: AddressDivs | {};
        tagsAdded: string[];
        contactLabels: HTMLElement[];
        searchBox: HTMLInputElement | null;
    };
    arcBoost: {
        contactLabels: HTMLElement[];
        searchBox: HTMLInputElement | null;
    };
    waitForElem: (
        selector: string,
        numChildren?: number,
        rChildren?: boolean
    ) => Promise<HTMLElement>;
    waitForManyElem: (
        pSelector: string,
        numChildren?: number,
        rChildren?: boolean
    ) => Promise<HTMLElement>;
}
type DialogSettings = {
    target: string;
    accept: string;
    bodyClass: string;
    cancel: string;
    dialogClass: string;
    message: string;
    soundAccept: string;
    soundOpen: string;
    template: string;
};

type AddressDivs = {
    streetLabel: HTMLElement;
    streetDiv: HTMLElement;
    cityDiv: HTMLElement;
    stateDiv: HTMLElement;
    zipDiv: HTMLElement;
    addressDivChildren: HTMLCollection;
};

type ZoneResponse = {
    errors: [];
    messages: [];
    success: boolean;
    result_info: {
        count: 1;
        page: 1;
        per_page: 20;
        total_count: 2000;
    };
    result: [
        {
            activated_on: '2014-01-02T00:01:00.12345Z';
            created_on: '2014-01-01T05:20:00.12345Z';
            development_mode: 7200;
            id: '023e105f4ecef8ad9ca31a8372d0c353';
            modified_on: '2014-01-01T05:20:00.12345Z';
            name: 'example.com';
            original_dnshost: 'NameCheap';
            original_name_servers: [
                'ns1.originaldnshost.com',
                'ns2.originaldnshost.com'
            ];
            original_registrar: 'GoDaddy';
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
