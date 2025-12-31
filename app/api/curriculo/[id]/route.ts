
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const id = params.id;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('curriculos')
            .select('*')
            .eq('id', id)
            .eq('token', token)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Not found or invalid token' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Error fetching curriculo:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await req.json();
        const { token, dados, customizacao, template_id } = body;
        const id = params.id;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
        }

        // Prepare update object
        const updates: any = { updated_at: new Date().toISOString() };
        if (dados) updates.dados = dados;
        if (customizacao) updates.customizacao = customizacao;
        if (template_id) updates.template_id = template_id;

        const { data, error } = await supabase
            .from('curriculos')
            .update(updates)
            .eq('id', id)
            .eq('token', token)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);

    } catch (err: any) {
        console.error('Error updating curriculo:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
