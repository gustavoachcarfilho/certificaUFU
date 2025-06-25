# 🎓 Certifica UFU

**Um sistema para modernizar e automatizar a gestão de certificados e horas complementares na Universidade Federal de Uberlândia (UFU).**

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Linguagem](https://img.shields.io/badge/backend-Java%20%26%20Spring-green)
![Linguagem](https://img.shields.io/badge/frontend-Angular-red)

---

## 📖 Índice

- 1. Visão Geral do Projeto
- 2. O Problema
- 3. A Solução
- 4. Funcionalidades Principais
  - 4.1. Fluxo do Aluno
  - 4.2. Fluxo da Administração
- 5. Arquitetura e Tecnologias
- 6. Desafios e Restrições
- 7. Contribuidores

---

## 1. Visão Geral do Projeto

O **Certifica UFU** é uma plataforma web desenvolvida no âmbito da disciplina de "Projeto e Desenvolvimento de Sistemas 1" do curso de Sistemas de Informação da UFU. O objetivo é substituir o processo manual, burocrático e ineficiente de submissão e validação de certificados de atividades complementares por uma solução digital, centralizada e ágil.

## 2. O Problema

Atualmente, o processo de gestão de certificados na UFU é inteiramente manual. Alunos acumulam documentos e os submetem de uma única vez, fisicamente ou por e-mail. Este modelo centralizado acarreta problemas graves:

-   **Atrasos na Validação:** Filas de espera se formam para conferência individual, gerando um longo tempo de resposta.
-   **Retrabalho Constante:** Documentos incompletos, ilegíveis ou inválidos exigem novas submissões, reiniciando o processo.
-   **Falta de Padronização:** A ausência de um padrão para arquivos e metadados dificulta a organização, o controle de versões e a rastreabilidade.
-   **Riscos de Segurança e Perda:** O manuseio de documentos físicos ou o envio por canais não seguros aumenta o risco de extravio e violações de privacidade (LGPD).
-   **Ausência de Métricas:** É praticamente impossível gerar relatórios ou monitorar o progresso das solicitações de forma eficiente.

## 3. A Solução

O Certifica UFU ataca esses problemas ao introduzir um fluxo digital contínuo. Alunos podem submeter seus certificados ao longo do curso, assim que os obtêm. A administração, por sua vez, pode validar esses documentos de forma organizada e assíncrona, eliminando gargalos e distribuindo a carga de trabalho.

O sistema cria um ambiente centralizado onde todas as interações são registradas, garantindo segurança, transparência e eficiência para todos os envolvidos.

## 4. Funcionalidades Principais

### 4.1. Fluxo do Aluno 🧑‍🎓

-   **Autenticação Segura:** Login para acesso ao ecossistema do aluno.
-   **Dashboard Pessoal:** Uma visão geral do status das horas, documentos pendentes, aprovados e reprovados.
-   **Submissão de Documentos:** Upload de certificados (PDF, JPG, etc.) com preenchimento de metadados essenciais (título, data, horas, etc.).
-   **Acompanhamento em Tempo Real:** Consulta do status de cada documento enviado.
-   **Feed de Oportunidades:** Visualização de eventos, cursos, palestras e estágios cadastrados pela administração que geram horas complementares.
-   **Gerenciamento de Perfil:** Edição de informações pessoais.

### 4.2. Fluxo da Administração 👨‍💼

-   **Autenticação com Perfil de Acesso:** Login seguro para validadores e administradores.
-   **Dashboard Administrativo:** Painel com métricas chave e resumo de documentos pendentes de validação.
-   **Fila de Validação:** Interface para visualizar, analisar, aprovar ou rejeitar os documentos submetidos pelos alunos.
-   **Justificativa de Rejeição:** Em caso de rejeição, o administrador deve fornecer um feedback claro para o aluno.
-   **Cadastro de Oportunidades:** Ferramenta para divulgar atividades extracurriculares, que aparecerão no feed dos alunos.

## 5. Arquitetura e Tecnologias

O sistema foi projetado com uma arquitetura de serviços desacoplada, visando escalabilidade, manutenibilidade e segurança.

| Componente                | Tecnologia / Solução                               | Justificativa                                                                                                                              |
| ------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend** | `Angular`                                          | Framework robusto e componentizado, ideal para criar Single Page Applications (SPAs) complexas e ricas em interatividade.                    |
| **Backend (API)** | `Java 17+` com `Spring Boot 3`                     | Ecossistema maduro, seguro e de alta performance. O Spring Boot acelera o desenvolvimento, a gestão de dependências e a configuração.        |
| **Banco de Dados (Dados)**| `MongoDB` (ou outro NoSQL)                         | Ideal para armazenar dados semiestruturados como perfis de usuário e metadados de documentos, oferecendo flexibilidade e escalabilidade.     |
| **Banco de Dados (Arquivos)** | `MinIO` (ou Azure Blob Storage / AWS S3)           | Serviço de armazenamento de objetos otimizado para guardar arquivos binários (PDFs, imagens), separando-os dos metadados e melhorando a performance. |
| **Autenticação** | `JWT (JSON Web Tokens)`                            | Padrão de mercado para proteger APIs REST, garantindo que as requisições sejam autenticadas e autorizadas de forma stateless.                |
| **Notificações** | Serviço de E-mail (ex: `SendGrid`, `AWS SES`)      | Para notificar os usuários sobre o status de seus documentos (aprovado, rejeitado) e novas oportunidades.                                   |
| **Infraestrutura** | `Cloud` (Azure sugerido, via parceria UFU/Microsoft) | Proporciona escalabilidade, disponibilidade e segurança, abstraindo a complexidade da gestão de servidores físicos.                         |

## 6. Desafios e Restrições

-   **Segurança e LGPD:** O tratamento de dados pessoais dos alunos exige conformidade estrita com a Lei Geral de Proteção de Dados.
-   **Validação de Autenticidade:** A validação da veracidade dos certificados permanece como uma tarefa manual para a administração, visto a falta de um padrão digital unificado entre as instituições emissoras.
-   **Infraestrutura Limitada:** O projeto deve ser consciente dos recursos computacionais, caso seja hospedado em servidores institucionais.
-   **Gestão de Mudança:** Adoção da plataforma por alunos e, principalmente, pela administração, que precisará se adaptar a um fluxo de trabalho mais constante em vez de um único pico de atividade no final do curso.
-   **Burocracia Institucional:** Necessidade de alterar editais e regulamentos da universidade para oficializar o novo processo de submissão digital.

## 7. Contribuidores

| Nome Completo     | GitHub | Papel no Projeto       |
| ----------------- | ------ | ---------------------- |
| [Seu Nome Aqui]   | [link] | Desenvolvedor Backend  |
| [Nome Colega 1]   | [link] | Desenvolvedor Frontend |
| [Nome Colega 2]   | [link] | Analista de Requisitos |
| ...               | ...    | ...                    |

*Este projeto é resultado do esforço coletivo da equipe para a disciplina de Projeto e Desenvolvimento de Sistemas 1.*


