# Guia de Implantação: Churrascaria Amore no Vercel

Para colocar o seu site online agora, siga estes passos:

### 1. Preparar o Código
Certifique-se de que o seu código está no GitHub. Como eu não tenho acesso ao seu GitHub pessoal, você deve:
1. Criar um repositório no GitHub.
2. Enviar os arquivos deste projeto para lá.

### 2. No Site do Vercel
1. Aceda ao [Vercel](https://vercel.com).
2. Clique em **"Add New..."** e depois em **"Project"**.
3. Selecione o seu repositório do GitHub.

### 3. Configurações Importantes
O Vercel vai detetar o **Vite** automaticamente. A única coisa que você **PRECISA** fazer é adicionar as variáveis de ambiente:

No campo **Environment Variables**, adicione estas duas:
- `VITE_SUPABASE_URL`: `https://obqcfybxtjyzvofvltfj.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWNmeWJ4dGp5enZvZnZsdGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Mjk5NDYsImV4cCI6MjA4ODMwNTk0Nn0.aoQrawiB-JddkeJIRpk4tDh_k_c5BTzD4iXXbxPdxNU`

### 4. Deploy!
Clique em **Deploy**. O site ficará online e todas as rotas (Menu, Página do Prato) vão funcionar perfeitamente graças ao arquivo `vercel.json` que já configurei para você.
