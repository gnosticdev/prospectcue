interface ProspectCue {
    addressDivs: AddressDivs | {}
    tagsAdded: string[]
    contactDivs: HTMLElement[]
    contactDivTriggers: HTMLElement[]
    searchBox: HTMLInputElement | null
}

type AddressDivs = {
    streetLabel: HTMLElement
    streetDiv: HTMLElement
    cityDiv: HTMLElement
    stateDiv: HTMLElement
    zipDiv: HTMLElement
}

type DialogSettings = {
    target?: HTMLElement
    accept?: string
    bodyClass?: string
    cancel?: string
    dialogClass?: string
    message?: string
    soundAccept?: string
    soundOpen?: string
    template?: string
}

type FormDataObject = { [key: string]: string | string[] }
