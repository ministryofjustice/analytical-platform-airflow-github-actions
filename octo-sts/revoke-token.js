const tok = process.env.TOKEN;

(async function main() {
    try {
        const res = await fetch('https://api.github.com/installation/token', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tok}` },
        });

        if (res.status == 204) {
            console.log('Token was revoked!');
        } else {
            console.log(`::error::${res.status} ${res.statusText}`);
        }
    } catch (err) {
        console.log(`::error::${err.stack}`);
    }

})();
