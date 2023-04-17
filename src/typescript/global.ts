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
