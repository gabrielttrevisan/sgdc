# SGDC

O SGDC é um sistema de gerenciamento de doações de alimento com estabelecimento metas e registro de doações.

## Como rodar o projeto localmente

### Dependências

**Versão do Node**: 24.16.0  
**Versão MySQL**: 8.0

### Front-end

Instalação de dependências e rodar aplicação no modo desenvolvimento.

```
npm i
npm run dev
```

### Back-end

O front-end espera que o back-end rode sempre na porta `3004`.  
Copiar e configurar o arquivo `.env` dentro da pasta `backend` com todas as variáveis exemplificadas no `.env.example`.
Instalar dependências e rodar aplicação.

```
npm i
npm run start
```

#### Exemplo Variáveis de Ambiente

```
PORT=0000                           # Porta que o Back-end vai rodar. Use 3004
FRONTEND_URL=http://frontend.url    # URL do front-end. Utilizado para configurar CORs. URL padrão do Vite é: http://localhost:5173

# O banco usado deve ser o MySQL na versão 8.0
DB_HOST=XXXX                        # host do banco de dados
DB_PORT=XXXX                        # porta do banco de dados
DB_NAME=XXXX                        # nome do banco de dados criado
DB_USER=XXXX                        # usuário do banco de dados
DB_PASSWORD=XXXX                    # senha do usuário de banco de dados
```

#### Guia de Migração do Banco de Dados

Antes de executar os arquivos SQLs, deve-se criar um banco de dados com o nome configurado no `.env`.

1. Rode `allocation_types.sql`
2. Rode `cities.sql`
3. Rode `beneficiaries.sql`
4. Rode `donors.sql`
5. Rode `migration_add_email_age_to_donors.sql`
6. Rode `families.sql`
7. Rode `measuring_units.sql`
8. Rode `products.sql`
9. Rode `sala.sql`
10. Rode `volunteers.sql`
