-- =====================================================================
-- Limpa o que os testes deixaram. Rode no SQL Editor.
--
-- CUIDADO: nao apaga o SEU pedido real, aquele que voce pagou no PIX.
-- O filtro pega so os e-mails que eu usei nos testes.
-- =====================================================================

-- ---------- 1. Veja ANTES o que vai sumir ----------
select order_nsu, customer_name, customer_email, status,
       (amount / 100.0) as total_reais, created_at
  from public.orders
 where customer_email in ('teste@resenhafc.com', 'teste@example.com')
   and status = 'pendente'
 order by created_at;

-- Confira a lista acima. Se estiver certa, rode o resto.

-- ---------- 2. Apaga os pedidos de teste pendentes ----------
delete from public.order_items
 where order_id in (
   select id from public.orders
    where customer_email in ('teste@resenhafc.com', 'teste@example.com')
      and status = 'pendente'
 );

delete from public.orders
 where customer_email in ('teste@resenhafc.com', 'teste@example.com')
   and status = 'pendente';

-- ---------- 3. Apaga os avisos forjados do teste de webhook ----------
delete from public.payment_events
 where order_id is null
    or event_key like '%TESTE-FORJADO%'
    or event_key like '%POS-LIMPEZA%';

-- ---------- 4. Confira o que sobrou ----------
select order_nsu, customer_name, customer_email, status,
       (amount / 100.0) as total_reais
  from public.orders
 order by created_at desc;

-- =====================================================================
-- O pedido de R$ 1,00 APROVADO (RFC-261111-A44150FD99) foi mantido de
-- proposito: e o registro do pagamento real que validou a integracao,
-- com a transacao confirmada na InfinitePay. Se quiser apagar tambem,
-- rode as tres linhas abaixo.
-- =====================================================================
-- delete from public.payment_events where order_id in (select id from public.orders where order_nsu = 'RFC-261111-A44150FD99');
-- delete from public.payments      where order_id in (select id from public.orders where order_nsu = 'RFC-261111-A44150FD99');
-- delete from public.order_items   where order_id in (select id from public.orders where order_nsu = 'RFC-261111-A44150FD99');
-- delete from public.orders        where order_nsu = 'RFC-261111-A44150FD99';
