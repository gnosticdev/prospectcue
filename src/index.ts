import { startAddButtons } from './add-buttons';
import { startAddTagDiv, checkAddNewTag } from './tag_alert';

(async function () {
    await startProspectCueCustomizations();
})();

async function startProspectCueCustomizations() {
    console.group('%c Zillow & Google Buttons', 'font-size:20px; color:lime;');
    if (window.location.pathname.includes('/contacts/detail/')) {
        window.prospectCue = {
            addressDivs: {},
            tagsAdded: [],
        };
        console.log(
            '%c window reloaded on contact page',
            window.location.pathname,
            'font-size:15px; color:lime;'
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
            console.log(`window click recorded`, e);
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
