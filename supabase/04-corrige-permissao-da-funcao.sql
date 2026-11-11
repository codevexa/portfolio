-- =====================================================================
-- Correção pontual do arquivo 03.
--
-- No 03 a função confirmar_pagamento() foi revogada de "public", que é o
-- papel que engloba todos os outros — inclusive o service_role, que é
-- justamente quem o webhook usa. Sem esta concessão, o primeiro pagamento
-- real falharia com "permission denied for function confirmar_pagamento".
--
-- Rode este arquivo uma vez. Ele não mexe em mais nada.
-- (O arquivo 03 já foi corrigido também, para quem rodar do zero.)
-- =====================================================================

grant execute on function public.confirmar_pagamento(
  text, text, text, text, integer, integer, integer, text) to service_role;

-- Conferência: deve listar service_role com EXECUTE.
-- select grantee, privilege_type
--   from information_schema.routine_privileges
--  where routine_name = 'confirmar_pagamento';
