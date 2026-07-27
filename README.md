# SeniorEase

Aplicação desenvolvida para o **Hackathon da Pós-Tech FIAP — Front-End Engineering**, com foco em acessibilidade, autonomia e facilidade de uso para pessoas idosas.

O SeniorEase permite organizar atividades do dia a dia em uma interface simples, legível e adaptável. O projeto possui versões para **dispositivos móveis** e **Web**, utilizando React Native com Expo.

---

## Objetivo

O objetivo do SeniorEase é reduzir dificuldades comuns encontradas por pessoas idosas ao utilizar aplicações digitais, como:

- excesso de informações na tela;
- textos pequenos;
- baixo contraste;
- navegação confusa;
- receio de executar ações incorretas;
- dificuldade para localizar tarefas importantes.

A aplicação oferece diferentes configurações de acessibilidade e dois modos de interface:

- **Modo Básico:** apresenta apenas informações e ações essenciais;
- **Modo Avançado:** disponibiliza todos os recursos da aplicação.

---

## Funcionalidades

### Atividades

- criação de atividades;
- listagem de atividades pendentes;
- visualização de detalhes;
- edição de atividades;
- conclusão de atividades;
- exclusão com confirmação;
- histórico de atividades concluídas;
- ordenação das atividades por data e horário;
- persistência local dos dados.

### Personalização e acessibilidade

- Modo Básico e Modo Avançado;
- ajuste do tamanho das fontes;
- suporte a diferentes temas;
- contraste aprimorado;
- botões grandes e legíveis;
- mensagens claras de carregamento, sucesso e erro;
- rótulos e descrições para leitores de tela;
- navegação simplificada;
- redução de informações secundárias no Modo Básico.

### Perfil e acesso

- tela de login;
- cadastro de usuário;
- tela de perfil;
- preferências persistidas localmente.

> A autenticação atual é local e foi implementada para fins acadêmicos, sem integração com um serviço de autenticação externo.

---

## Modo Básico

O Modo Básico foi criado para reduzir a carga cognitiva e facilitar a navegação.

Nesse modo, a aplicação prioriza:

- títulos claros;
- ações principais;
- botões maiores;
- menos informações por tela;
- textos objetivos;
- caminhos de navegação mais simples.

Recursos secundários, como histórico, perfil, categoria e descrição, podem ser ocultados em determinadas telas.

O usuário pode retornar ao Modo Avançado pela tela de configurações de acessibilidade.

---

## Tecnologias

- React Native;
- Expo;
- Expo Router;
- TypeScript;
- React Hooks;
- AsyncStorage;
- Expo Vector Icons;
- Google Fonts — Montserrat;
- React Native Web.

---

## Arquitetura

O projeto foi organizado buscando separação de responsabilidades entre interface, domínio, persistência e configurações globais.

```text
seniorease/
├── src/
│   ├── app/                  # Telas e rotas do Expo Router
│   │   ├── atividades/       # Lista, cadastro, detalhes e edição
│   │   ├── configuracoes/    # Preferências de acessibilidade
│   │   ├── historico/        # Atividades concluídas
│   │   ├── login/            # Acesso à aplicação
│   │   └── perfil/           # Dados do usuário
│   ├── constants/            # Tema, cores, espaçamentos e estilos
│   ├── contexts/             # Contextos globais da aplicação
│   ├── data/                 # Implementações relacionadas aos dados
│   ├── domain/
│   │   ├── entities/         # Entidades de domínio
│   │   └── repositories/     # Contratos de repositórios
│   └── services/             # Persistência e operações das atividades
├── assets/                   # Imagens, ícones e recursos estáticos
├── package.json
└── README.md
```

### Entidade de atividade

Uma atividade possui informações como:

```ts
interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: ActivityCategory;
  status: "pendente" | "concluida";
}
```

### Persistência

As atividades e preferências de acessibilidade são armazenadas localmente no dispositivo.

Essa abordagem permite:

- uso sem servidor;
- funcionamento offline;
- carregamento rápido;
- simplicidade para demonstração acadêmica.

---

## Pré-requisitos

Antes de executar o projeto, instale:

- Node.js;
- npm;
- Git;
- Expo Go, para testes em dispositivo físico;
- Android Studio, para emulador Android;
- Xcode, para simulador iOS em macOS.

---

## Como executar

Clone o repositório:

```bash
git clone https://github.com/PaulaFS/tech-challenge-fase-05.git
```

Acesse a pasta da aplicação:

```bash
cd tech-challenge-fase-05/seniorease
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

---

## Executar no Android

Com o emulador aberto ou um dispositivo conectado:

```bash
npm run android
```

Também é possível iniciar o Expo e pressionar:

```text
a
```

---

## Executar no iOS

> O simulador iOS requer macOS com Xcode instalado.

```bash
npm run ios
```

Também é possível iniciar o Expo e pressionar:

```text
i
```

---

## Executar na Web

```bash
npm run web
```

Ou, após iniciar o Expo:

```text
w
```

---

## Principais fluxos

### Criar uma atividade

1. Acesse **Adicionar atividade**.
2. Informe o título e a data.
3. No Modo Avançado, preencha opcionalmente horário, descrição e categoria.
4. Salve a atividade.

### Editar uma atividade

1. Abra uma atividade pendente.
2. Selecione **Editar atividade**.
3. Altere as informações desejadas.
4. Salve as mudanças.

### Concluir uma atividade

1. Abra uma atividade pendente.
2. Selecione **Concluir atividade**.
3. A atividade será removida da lista de pendências e adicionada ao histórico.

### Excluir uma atividade

1. Abra os detalhes da atividade.
2. Selecione **Excluir atividade**.
3. Confirme a exclusão.

### Alterar a acessibilidade

1. Abra **Configurar acessibilidade**.
2. Escolha o tamanho da fonte, tema e modo de interface.
3. As preferências serão aplicadas e armazenadas localmente.

---

## Decisões de acessibilidade

As principais decisões adotadas foram:

### Legibilidade

- uso da fonte Montserrat;
- títulos em destaque;
- tamanho de fonte configurável;
- espaçamento consistente;
- textos curtos e objetivos.

### Interação

- botões com altura mínima entre 56 e 64 pixels;
- grandes áreas de toque;
- ícones acompanhados por textos;
- ações principais visualmente destacadas;
- confirmação antes da exclusão.

### Leitores de tela

Os principais componentes interativos utilizam propriedades como:

```tsx
accessibilityRole="button"
accessibilityLabel="Editar atividade"
accessibilityHint="Abre o formulário para alterar esta atividade"
```

### Feedback

A aplicação apresenta estados visuais para:

- carregamento;
- lista vazia;
- erro;
- sucesso;
- processamento;
- atividade pendente;
- atividade concluída.

### Redução da carga cognitiva

O Modo Básico remove informações secundárias e mantém apenas os elementos necessários para concluir a tarefa atual.

---

## Compatibilidade

O projeto foi desenvolvido para funcionar em:

- Android;
- iOS;
- navegadores Web modernos.

Na Web, recomenda-se também validar:

- navegação utilizando Tab;
- acionamento por Enter ou Espaço;
- foco visível;
- responsividade;
- contraste dos temas.

---

## Testes manuais recomendados

Antes da entrega, execute os seguintes cenários:

### Atividades

- criar uma atividade somente com campos obrigatórios;
- criar uma atividade com todos os campos;
- editar uma atividade;
- concluir uma atividade;
- excluir uma atividade;
- verificar a ordem cronológica;
- verificar a lista vazia;
- verificar mensagens de erro.

### Acessibilidade

- alternar entre Modo Básico e Avançado;
- aumentar e reduzir o tamanho da fonte;
- trocar o tema;
- fechar e abrir novamente a aplicação;
- confirmar se as preferências permaneceram salvas;
- navegar utilizando leitor de tela;
- testar botões e cards com fontes maiores.

### Plataformas

- testar no Android;
- testar no navegador;
- testar no iOS, quando houver ambiente macOS disponível.

---

## Melhorias futuras

- lembretes de próximas atividades;
- notificações locais;
- configuração de espaçamento;
- feedback visual reforçado configurável;
- confirmações adicionais configuráveis;
- opção para reduzir animações;
- busca e filtros;
- sincronização em nuvem;
- autenticação com serviço externo;
- testes automatizados;
- pipeline de integração contínua.

---

## Limitações atuais

- os dados são armazenados apenas localmente;
- não existe sincronização entre dispositivos;
- a autenticação não possui backend;
- notificações locais ainda não fazem parte da versão atual;
- a remoção dos dados do aplicativo pode apagar atividades e preferências salvas.

---


## Contexto acadêmico

Projeto desenvolvido como parte do Hackathon da Pós-Tech FIAP em Front-End Engineering.

O SeniorEase foi concebido para demonstrar a aplicação de conceitos de:

- React Native;
- desenvolvimento multiplataforma;
- arquitetura de software;
- persistência local;
- experiência do usuário;
- acessibilidade digital;
- interfaces adaptáveis;
- boas práticas com TypeScript.