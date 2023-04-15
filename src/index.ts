import { startAddButtons } from './add-buttons';
import { startAddTagDiv, checkAddNewTag } from './tag_alert';
import { colorConsole } from './utils';

(async function () {
    await startProspectCueCustomizations();
})();

async function startProspectCueCustomizations() {
    colorConsole('starting prospect cue customizations', 'rgb(109, 236, 185)');
    window.addEventListener('popstate', () => {
        colorConsole(
            'popstate event detected, reloading prospect cue customizations',
            'rgb(109, 236, 185)'
        );
    });
    if (window.location.pathname.includes('/contacts/detail/')) {
        window.prospectCue = {
            addressDivs: {},
            tagsAdded: [],
        };
        colorConsole(
            'reloaded to contacts detail page, starting add buttons',
            'rgb(109, 236, 185)'
        );
        await startAddButtons();
        await startAddTagDiv();
    }
    if (window.location.pathname.includes('conversations')) {
        console.log('reloaded to conversations page, checking for add new tag');
        await checkAddNewTag();
    }
    if (window.location.pathname.includes('/opportunities/list')) {
        console.log(
            'reloaded to opportunities list page, checking for add new tag'
        );
        await checkAddNewTag();
    }
    window.addEventListener(
        'click',
        function watchWindowClicks(e: MouseEvent) {
            const currentUrl = window.location.pathname;
            // console.log(`window click recorded`, e);
            setTimeout(async () => {
                console.log(
                    `current URL -> pathname 500ms later... = ${currentUrl} -> ${window.location.pathname}`
                );
                const target = e.target as HTMLAnchorElement;
                if (target.href && target.href.includes('/contacts/detail/')) {
                    await startAddButtons();
                    await startAddTagDiv();
                } else if (
                    !currentUrl.includes('/contacts/detail/') &&
                    window.location.pathname.includes('/contacts/detail/')
                ) {
                    await startAddButtons();
                    await startAddTagDiv();
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
