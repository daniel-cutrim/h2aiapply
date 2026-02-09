
const https = require('https');

const url = "https://alfkafxhvqelbhuvghjj.supabase.co/rest/v1/curriculos?id=eq.29bd47e8-d2bf-42e9-a592-4b6ac2b25e81&select=*";
const options = {
    headers: {
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    }
};

// We need to load env vars or hardcode them since we are running a standalone script
// I'll hardcode them for this temp script based on .env.local content I read earlier
options.headers.apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZmthZnhodnFlbGJodXZnaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMjczMTAsImV4cCI6MjA4MjcwMzMxMH0.bNYN0sqCpiM_LD2NfYQKI2acDbdH8p1Qhqk_Kgr4PO0";
options.headers.Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZmthZnhodnFlbGJodXZnaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMjczMTAsImV4cCI6MjA4MjcwMzMxMH0.bNYN0sqCpiM_LD2NfYQKI2acDbdH8p1Qhqk_Kgr4PO0";

const req = https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(data);
    });
});

req.on('error', (e) => {
    console.error(e);
});
