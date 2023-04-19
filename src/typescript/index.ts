import { startAddButtons } from './add-buttons';
import { addTagElements, checkAddNewTag } from './tag-alert';
import { colorConsole } from './utils';

colorConsole('Starting prospectcue customizations', 'green');
startProspectCueCustomizations();

export async function startProspectCueCustomizations() {
    colorConsole('Starting prospect cue customizations', 'green');

    if (window.location.pathname.includes('/contacts/detail/')) {
        window.prospectCue = {
            addressDivs: {},
            tagsAdded: [],
            contactLabels: [],
            searchBox: null,
        };
        colorConsole(
            'reloaded to contacts detail page, starting to add zillow/google buttons',
            'yellow'
        );
        await startAddButtons();
        await addTagElements();
    }
    if (window.location.pathname.includes('conversations')) {
        colorConsole(
            'reloaded to conversations page, checking for add new tag',
            'yellow'
        );
        await checkAddNewTag();
    }
    if (window.location.pathname.includes('/opportunities/list')) {
        colorConsole(
            'reloaded to opportunities list page, checking for add new tag',
            'yellow'
        );
        await checkAddNewTag();
    }
    window.addEventListener(
        'click',
        function watchWindowClicks(e: MouseEvent) {
            const currentUrl = window.location.pathname;

            setTimeout(async () => {
                colorConsole(
                    `current URL -> pathname 500ms later... = ${currentUrl} -> ${window.location.pathname}`,
                    'yellow'
                );
                const target = e.target as HTMLAnchorElement;
                if (target.href && target.href.includes('/contacts/detail/')) {
                    await startAddButtons();
                    await addTagElements();
                } else if (
                    !currentUrl.includes('/contacts/detail/') &&
                    window.location.pathname.includes('/contacts/detail/')
                ) {
                    await startAddButtons();
                    await addTagElements();
                } else if (
                    window.location.pathname.includes(
                        '/conversations/conversations'
                    )
                ) {
                    await checkAddNewTag();
                } else if (
                    currentUrl.includes('/opportunities/list') &&
                    window.location.pathname.includes('/opportunities/list')
                ) {
                    await checkAddNewTag();
                }
            }, 500);
        },
        true
    );
}
