interface ProspectCue {
    addressDivs: AddressDivs | {};
    tagsAdded: string[];
    contactDivs: HTMLElement[];
    contactDivTriggers: HTMLElement[];
    searchBox: HTMLInputElement | null;
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
