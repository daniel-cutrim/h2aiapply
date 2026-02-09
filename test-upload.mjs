import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value.trim();
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = value.trim();
        }
    });
} catch (e) {
    console.error('Error reading .env.local:', e.message);
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
    console.log('Testing upload to bucket: photo_curriculos');

    // Create a dummy file
    const dummyContent = 'Hello Supabase';
    const fileName = `test-${Date.now()}.txt`;
    const filePath = `public/${fileName}`;

    // Try upload
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photo_curriculos')
        .upload(filePath, dummyContent, {
            contentType: 'text/plain',
            upsert: false
        });

    if (uploadError) {
        console.error('UPLOAD ERROR:', JSON.stringify(uploadError, null, 2));

        // Check if bucket exists
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
            console.error('LIST BUCKETS ERROR:', JSON.stringify(bucketError, null, 2));
        } else {
            const bucketExists = buckets.find(b => b.name === 'photo_curriculos');
            console.log('Bucket "photo_curriculos" exists?', !!bucketExists);
            if (bucketExists) {
                console.log('Bucket public:', bucketExists.public);
            }
        }
    } else {
        console.log('Upload successful!', uploadData);
        // Try get public url
        const { data: urlData } = supabase.storage
            .from('photo_curriculos')
            .getPublicUrl(filePath);
        console.log('Public URL:', urlData.publicUrl);
    }
}

testUpload();
