# Configuracao recomendada para cadastro no Supabase

No app, o usuario e criado com Supabase Auth. Para garantir que a tabela `usuarios` seja preenchida mesmo quando a confirmacao de e-mail estiver ligada, use um trigger no Supabase.

Abra **SQL Editor** no Supabase e rode:

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, nome, email, tipo_usuario)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', 'Novo usuario'),
    new.email,
    coalesce(new.raw_user_meta_data->>'tipo_usuario', 'aluno')
  )
  on conflict (id) do update
  set
    nome = excluded.nome,
    email = excluded.email,
    tipo_usuario = excluded.tipo_usuario;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

## RLS minima para desenvolvimento

Se Row Level Security estiver ativa em `usuarios`, crie politicas para o usuario ler e editar apenas o proprio perfil:

```sql
alter table public.usuarios enable row level security;

drop policy if exists "usuarios_select_proprio" on public.usuarios;
create policy "usuarios_select_proprio"
on public.usuarios
for select
using (auth.uid() = id);

drop policy if exists "usuarios_update_proprio" on public.usuarios;
create policy "usuarios_update_proprio"
on public.usuarios
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "usuarios_insert_proprio" on public.usuarios;
create policy "usuarios_insert_proprio"
on public.usuarios
for insert
with check (auth.uid() = id);
```

Para validar codigo da paroquia, o app precisa ler a tabela `paroquias`:

```sql
alter table public.paroquias enable row level security;

drop policy if exists "paroquias_select_autenticado" on public.paroquias;
create policy "paroquias_select_autenticado"
on public.paroquias
for select
to authenticated
using (status = 'ativa');
```

## Paroquia inicial para teste

Para testar o fluxo do app, cadastre pelo menos uma paroquia ativa. Exemplo:

```sql
insert into public.paroquias (nome, cidade, codigo_acesso, status)
values ('Paroquia Demo', 'Sao Paulo', 'FE2026', 'ativa')
on conflict (codigo_acesso) do update
set
  nome = excluded.nome,
  cidade = excluded.cidade,
  status = excluded.status;
```

Depois disso, o aluno pode criar conta, fazer login e informar o codigo `FE2026`.

## Confirmacao de e-mail em app mobile

Se a confirmacao de e-mail estiver ligada no Supabase, o aluno recebe um e-mail com um link de confirmacao. Depois de confirmar, o Supabase redireciona para a URL configurada em **Authentication > URL Configuration**.

Se essa URL estiver como `http://localhost:3000`, o celular vai mostrar erro de conexao recusada. Isso nao e erro do app mobile; e apenas o navegador tentando abrir um endereco local que nao existe no aparelho.

Para desenvolvimento, ha duas opcoes:

1. Desligar temporariamente a confirmacao de e-mail em **Authentication > Providers > Email > Confirm email**. Assim o cadastro ja cria sessao no app e o aluno segue para o codigo da paroquia.
2. Manter confirmacao ligada e configurar uma URL real em **Site URL** e **Redirect URLs**. Em app publicado, use deep link/universal link do app. No prototipo, depois que o aluno clicar no e-mail e confirmar, ele pode voltar manualmente ao app e fazer login.

Para apresentacao do projeto integrador, a opcao mais simples costuma ser desligar a confirmacao de e-mail durante os testes.
