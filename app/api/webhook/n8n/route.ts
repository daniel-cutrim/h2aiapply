import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { aluno_id, dados } = body;

        // N8N might send a slightly different structure, adapt as needed.
        // For now assuming it matches the CurriculoData structure or we treat it as loose JSON.

        if (!aluno_id || !dados) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if one already exists? Or always create new?
        // User scope says "Múltiplos currículos por aluno" is a future feature. 
        // But currently table allows multiple.
        // Let's create new for now as per MVP flow "Sistema cria registro no banco".

        const token = randomUUID();

        const { data, error } = await supabase
            .from('curriculos')
            .insert({
                aluno_id,
                token,
                dados: dados, // Ensure this matches JSONB structure
                template_id: 'template_1', // Default
            })
            .select()
            .single();

        if (error) throw error;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const url = `${baseUrl}/curriculo?token=${token}&id=${data.id}`;

        return NextResponse.json({
            success: true,
            curriculo_id: data.id,
            token,
            url
        });

    } catch (err: any) {
        console.error('Error in N8N webhook:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
