export type Service = {
  index: string;
  title: string;
  summary: string;
  detail: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    index: "01",
    title: "Sites institucionais",
    summary: "A presença oficial da marca, construída para durar.",
    detail:
      "Estrutura, narrativa e design de um site que apresenta a empresa com a seriedade que ela tem. Conteúdo organizado para ser lido, encontrado no Google e atualizado sem depender de ninguém.",
    deliverables: ["Arquitetura de conteúdo", "Design sob medida", "SEO técnico", "Publicação e domínio"],
  },
  {
    index: "02",
    title: "Landing pages",
    summary: "Uma página, um objetivo, nenhuma distração.",
    detail:
      "Página de campanha desenhada em torno de uma única ação. Argumento construído em ordem, prova social no lugar certo e carregamento rápido para não perder quem chegou pelo anúncio.",
    deliverables: ["Copy estruturada", "Design de conversão", "Performance", "Medição de resultado"],
  },
  {
    index: "03",
    title: "Aplicações web",
    summary: "Software que roda no navegador e resolve de verdade.",
    detail:
      "Aplicações completas com autenticação, dados e regras de negócio. Pensadas para o uso diário de quem opera, não só para a demonstração.",
    deliverables: ["Modelagem de dados", "Interface de uso contínuo", "Autenticação", "Infraestrutura"],
  },
  {
    index: "04",
    title: "Sistemas personalizados",
    summary: "Quando nenhuma ferramenta pronta serve.",
    detail:
      "Desenvolvimento de sistemas construídos a partir do processo real da sua operação. Em vez de adaptar a empresa ao software, o software é escrito em cima do que já funciona.",
    deliverables: ["Levantamento de processo", "Regras de negócio", "Módulos sob medida", "Evolução contínua"],
  },
  {
    index: "05",
    title: "Plataformas SaaS",
    summary: "Produto digital com múltiplos clientes e assinatura.",
    detail:
      "Da arquitetura multiusuário ao fluxo de cadastro e cobrança. Estrutura preparada para crescer em número de contas sem reescrever a base.",
    deliverables: ["Arquitetura multiusuário", "Planos e assinatura", "Painel do cliente", "Escalabilidade"],
  },
  {
    index: "06",
    title: "Painéis administrativos",
    summary: "O centro de controle de quem toca a operação.",
    detail:
      "Dashboards e áreas internas que mostram o que importa na hierarquia certa. Dados legíveis, ações rápidas e permissões por perfil de acesso.",
    deliverables: ["Visualização de dados", "Controle de permissões", "Gestão de registros", "Relatórios"],
  },
  {
    index: "07",
    title: "Automação de processos",
    summary: "Tirar o trabalho repetitivo das mãos de alguém.",
    detail:
      "Mapeamento das rotinas manuais que consomem tempo e construção de fluxos automáticos no lugar delas. Integração entre as ferramentas que a empresa já usa.",
    deliverables: ["Mapa de rotinas", "Fluxos automáticos", "Integração entre sistemas", "Monitoramento"],
  },
  {
    index: "08",
    title: "Integrações com inteligência artificial",
    summary: "IA aplicada onde ela resolve, não onde ela aparece.",
    detail:
      "Recursos de IA integrados a produtos existentes: atendimento, geração e organização de conteúdo, classificação e apoio à decisão. Sempre a serviço do fluxo, nunca como enfeite.",
    deliverables: ["Definição de caso de uso", "Integração via API", "Ajuste de comportamento", "Controle de custo"],
  },
  {
    index: "09",
    title: "Experiências digitais personalizadas",
    summary: "Projetos que não cabem em nenhuma categoria acima.",
    detail:
      "Lançamentos, eventos, instalações, configuradores, portfólios autorais. Quando a ideia exige um formato próprio, o formato é construído junto com ela.",
    deliverables: ["Conceito criativo", "Direção de arte", "Prototipagem", "Desenvolvimento"],
  },
];

export const processSteps = [
  {
    index: "01",
    title: "Entender",
    text: "Antes de desenhar qualquer tela, o problema precisa estar claro. Conversa, contexto, restrições e o que define sucesso para você.",
  },
  {
    index: "02",
    title: "Desenhar",
    text: "Arquitetura da informação, fluxo e direção visual. É aqui que a ideia ganha forma e as decisões difíceis são tomadas no papel, não no código.",
  },
  {
    index: "03",
    title: "Construir",
    text: "Desenvolvimento com código limpo, componentes reutilizáveis e performance desde a primeira linha. Nada de gambiarra que você vai pagar depois.",
  },
  {
    index: "04",
    title: "Publicar",
    text: "Testes, correções, publicação e entrega com tudo funcionando. Você recebe o projeto no ar, não um arquivo para resolver sozinho.",
  },
];
