const actionsToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
const actionsUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;

if (!actionsToken || !actionsUrl) {
    console.log(`::error::Missing required environment variables; have you set 'id-token: write' in your workflow permissions?`);
    process.exit(1);
}

const scope = process.env.INPUT_SCOPE;
const identity = process.env.INPUT_IDENTITY;

if (!scope || !identity) {
    console.log(`::error::Missing required inputs 'scope' and 'identity'`);
    process.exit(1);
}

(async function main() {
    // You can use await inside this function block
    try {
        console.log(`::notice::Requesting token for scope '${scope}' and identity '${identity}'`);
        const res = await fetch(`${actionsUrl}&audience=octo-sts.dev`, { headers: { 'Authorization': `Bearer ${actionsToken}` } });
        const json = await res.json();
        console.log(`::notice::Received ID token for audience 'octo-sts.dev'`);

        console.log(`::notice::Exchanging ID token for scope '${scope}' and identity '${identity}'`);
        const res2 = await fetch(`https://octo-sts.dev/sts/exchange?scope=${scope}&identity=${identity}`, { headers: { 'Authorization': `Bearer ${json.value}` } });
        const json2 = await res2.json();
        console.log(`::notice::Received token for scope '${scope}' and identity '${identity}'`);

        if (!json2.token) { console.log(`::error::${json2.message}`); process.exit(1); }
        const tok = json2.token;
        // Mask the token in the GitHub Actions logs
        // console.log(`::add-mask::${tok}`);
        // Print the token to stdout so it can be captured in bash
        console.log(tok);
    } catch (err) {
        console.log(`::error::${err.stack}`); process.exit(1);
    }
})();
