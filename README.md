# SGDC

O SGDC é um sistema de gerenciamento de doações de alimento com estabelecimento metas e registro de doações.

## Como rodar o projeto localmente

**Versão do Node**: 24.16.0  
**Versão MySQL**: 8.0

### Front-end

```
npm i
npm run dev
```

### Back-end

O front-end espera que o back-end rode sempre na porta `3004`.  
Copiar e configurar o arquivo `.env` dentro da pasta `backend` com todas as variáveis exemplificadas no `.env.example`.

```
npm i
npm run start
```

#### Banco de dados

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
