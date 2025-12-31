import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CurriculoData } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { aluno_id, dados, template_id } = body;

        if (!aluno_id || !dados) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const token = randomUUID();

        const { data, error } = await supabase
            .from('curriculos')
            .insert({
                aluno_id,
                token,
                dados,
                template_id: template_id || 'template_1',
            })
            .select()
            .single();

        if (error) throw error;

        // Construct the URL (assuming deployed domain or localhost)
        // In production, use an ENV var for base URL.
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const url = `${baseUrl}/curriculo?token=${token}&id=${data.id}`;

        return NextResponse.json({
            id: data.id,
            token,
            url
        });

    } catch (err: any) {
        console.error('Error creating curriculo:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
