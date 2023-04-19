export interface Env {
    CLOUDFLARE_API_KEY: string;
    CLOUDFLARE_EMAIL: string;
    CLOUDFLARE_BASE_URL: string;
}

const handler: ExportedHandler = {
    async fetch(
        req: Request,
        env: unknown,
        ctx: ExecutionContext
    ): Promise<Response> {
        const { CLOUDFLARE_API_KEY, CLOUDFLARE_BASE_URL, CLOUDFLARE_EMAIL } =
            env as Env;
        console.log('env', env);
        async function getZones() {
            const apikey = CLOUDFLARE_API_KEY;
            const email = CLOUDFLARE_EMAIL;
            if (!apikey || !email) {
                throw new Error('No API key or email found');
            }
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Key': CLOUDFLARE_API_KEY,
                    'X-Auth-Email': CLOUDFLARE_EMAIL,
                },
            };
            const response = await fetch(
                CLOUDFLARE_BASE_URL + '/zones',
                options
            );
            const json: ZoneResponse = await response.json();
            console.log('zone json', json);
            return json;
        }

        async function getZoneByName(name: string) {
            const zones = await getZones();
            const zone = zones.result.find((z) => z.name === name);
            return zone;
        }

        async function purgeCache() {
            const zoneId = (await getZoneByName('prospectcue.com'))?.id;
            if (!zoneId) {
                throw new Error('No zone id found');
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Email': CLOUDFLARE_EMAIL,
                    'X-Auth-Key': CLOUDFLARE_API_KEY,
                },
                body: JSON.stringify({
                    purge_everything: true,
                }),
            };

            return await fetch(
                `${CLOUDFLARE_BASE_URL}/zones/${zoneId}/purge_cache`,
                options
            );
        }

        const response = await purgeCache();
        const json: PurgeResponse = await response.json();
        const displayText = json.success ? 'Cache Purged' : 'Cache Not Purged';
        console.log('purge response', json);
        return new Response(displayText, {
            status: response.status,
        });
    },
};

export default handler;
