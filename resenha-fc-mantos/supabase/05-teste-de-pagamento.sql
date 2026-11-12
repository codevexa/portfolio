-- =====================================================================
-- 1) Limpeza dos registros de teste  2) Produto de R$ 1,00 para o teste
-- Rode no SQL Editor. Depois do teste, rode o bloco do fim para apagar.
-- =====================================================================

-- ---------- 1. Limpa o que os testes deixaram ----------
delete from public.payment_events
 where event_key like '%TESTE%' or event_key like '%POS-LIMPEZA%'
    or order_id is null;

delete from public.orders
 where order_nsu like 'RFC-%' and status = 'pendente'
   and customer_email in ('teste@resenhafc.com', 'teste@example.com');

-- ---------- 2. Produto temporário de R$ 1,00 ----------
insert into public.products
  (slug, nome, categoria, preco, pronta_entrega, tamanhos,
   descricao, ativo, ordem, controla_estoque, estoque)
values
  ('teste-de-pagamento-nao-comprar',
   'TESTE DE PAGAMENTO — NAO COMPRAR',
   'camisas', 1.00, false, array['U'],
   'Item temporario usado para validar o pagamento. Sera removido.',
   true, 9999, true, '{"U": 1}'::jsonb)
on conflict (slug) do update
  set ativo = true, preco = 1.00, estoque = '{"U": 1}'::jsonb;

-- Mostra o id, que é o que eu preciso:
select id, nome, preco from public.products
 where slug = 'teste-de-pagamento-nao-comprar';

-- =====================================================================
-- DEPOIS DO TESTE — rode só este bloco:
-- =====================================================================
-- delete from public.order_items where product_id in
--   (select id from public.products where slug = 'teste-de-pagamento-nao-comprar');
-- delete from public.products where slug = 'teste-de-pagamento-nao-comprar';
