# Painel de Manutenção da Frota — versão para a internet (GitHub + Vercel)

Site com login, sem precisar deixar computador ligado. Já vem com os dados atuais do painel.
Perfis: **controlador** (edita tudo) e **cliente** (só visualiza e exporta; não recebe observações, telefones nem a base de frota).

## Passo a passo (cerca de 15 minutos)

### 1) GitHub — guardar o código
1. Crie uma conta em https://github.com e clique em **New repository**.
2. Nome: `painel-frota`. Marque **Private** (obrigatório: a pasta `data/` tem os dados da sua operação).
3. Na página do repositório vazio, clique em **uploading an existing file** e arraste **o conteúdo desta pasta já extraída** (não o .zip). Clique em **Commit changes**.

### 2) Vercel — colocar no ar
1. Entre em https://vercel.com com a conta do GitHub.
2. **Add New → Project →** escolha `painel-frota` → **Import**. Em *Framework Preset*, deixe **Other**.
3. Abra **Environment Variables** e crie:
   - `SESSION_SECRET` = um texto longo e aleatório (30+ letras e números)
   - `ADMIN_USER` = seu usuário (ex.: rodrigo)
   - `ADMIN_PASS` = sua senha (6+ caracteres)
4. Clique em **Deploy**.

### 3) Banco de dados (gratuito)
1. No projeto da Vercel, abra a aba **Storage → Create Database →** **Upstash (Redis)** → plano **Free** → **Connect** ao projeto.
2. Vá em **Deployments → ⋯ → Redeploy** para o site passar a usar o banco.

### 4) Primeiro acesso
1. Abra o endereço do projeto (algo como `painel-frota.vercel.app`) e entre com `ADMIN_USER` e `ADMIN_PASS`.
2. No menu lateral, abra **Usuários** e crie um usuário **controlador** para cada controlador e um **cliente** para o cliente.
3. Depois disso você pode apagar `ADMIN_PASS` das variáveis da Vercel.

## Dia a dia
- **Atualizar dados**: envie a planilha de controle (.xlsm/.xlsx) ou edite direto na aba **Manutenção** (cole linhas do Excel com Ctrl+Shift+V).
- As mudanças aparecem para os outros usuários em até 15 segundos.
- Para trocar a senha de alguém: **Usuários** → salve o mesmo nome com a senha nova.

## Cuidados
- **Plano Hobby da Vercel é para uso pessoal e não comercial.** Para uso da empresa, os termos pedem o plano Pro (ou outra hospedagem, veja abaixo).
- Os dados ficam em serviços na nuvem (GitHub, Vercel, Upstash). Confirme com a TI/jurídico da empresa (LGPD).
- Se a empresa bloquear `*.vercel.app`, é possível ligar um domínio próprio ao projeto (Vercel → Settings → Domains).
- Plano gratuito do banco tem limite diário de comandos; o painel usa poucos (cerca de 4 por minuto por pessoa com a aba aberta).
- Depois do primeiro acesso, a pasta `data/` do repositório só serve de ponto de partida: os dados vivos ficam no banco.
- Backup: use a exportação em Excel das abas e guarde o repositório.

## Outras formas de rodar
- **Servidor próprio** (um computador ou VPS ligado): instale o Node.js 18+, rode `iniciar.bat` (Windows) ou `./iniciar.sh`. Usuários: `node server.js user add NOME SENHA controlador|cliente`. Acesse `http://localhost:3000`.
- **Hospedagem com disco** (Render, Railway, Fly.io): comando `node server.js`, variável `DATA_DIR` apontando para um disco persistente e `COOKIE_SECURE=1`. Há `Dockerfile` pronto.
- **Sem servidor, um arquivo**: abra `app/index.html` no navegador. Sem login, dados só naquele navegador.
