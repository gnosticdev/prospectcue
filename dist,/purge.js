// src/cloudflare/purge.ts
var handler = {
  async fetch(req, env, ctx) {
    const { CLOUDFLARE_API_KEY, CLOUDFLARE_BASE_URL, CLOUDFLARE_EMAIL } = env;
    async function getZones() {
      const apikey = CLOUDFLARE_API_KEY;
      const email = CLOUDFLARE_EMAIL;
      if (!apikey || !email) {
        throw new Error("No API key or email found");
      }
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Key": CLOUDFLARE_API_KEY,
          "X-Auth-Email": CLOUDFLARE_EMAIL
        }
      };
      const response2 = await fetch(
        CLOUDFLARE_BASE_URL + "/zones",
        options
      );
      const json = await response2.json();
      return json;
    }
    async function getZoneByName(name) {
      const zones = await getZones();
      const zone = zones.result.find((z) => z.name === name);
      return zone;
    }
    async function purgeCache() {
      const zoneId = (await getZoneByName("prospectcue.com"))?.id;
      if (!zoneId) {
        throw new Error("No zone id found");
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Email": CLOUDFLARE_EMAIL,
          "X-Auth-Key": CLOUDFLARE_API_KEY
        },
        body: JSON.stringify({
          purge_everything: true
        })
      };
      return await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
        options
      );
    }
    const response = await purgeCache();
    return new Response(response.statusText, {
      status: response.status
    });
  }
};
var purge_default = handler;
export {
  purge_default as default
};
//# sourceMappingURL=purge.js.map
