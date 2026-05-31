import sql from "./core/sql.js";

export default class VolunteerModel {
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE deleted_at IS NULL AND name LIKE ${likeQuery}`
        : sql`WHERE deleted_at IS NULL`;
      const orderByColumn = sortKey === "name" ? sql`name` : sortKey === "city" ? sql`city` : sql.empty;
      const orderBySorting = sortKey ? sql([sortType.toUpperCase()]) : sql`DESC`;
      const orderByClause = sortKey ? sql`ORDER BY ${orderByColumn} ${orderBySorting}` : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[any[], any[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
              SELECT 
                id, name, gender, nationalId, phone, phoneSecondary, 
                hasWhatsApp, hasWhatsAppSecondary, street, number, 
                complement, neighborhood, city, state
              FROM volunteers
              ${whereClause}
              ${orderByClause}
              ${limitClause}`.run(),
        sql.query`
              SELECT COUNT(*) AS TOTAL 
              FROM volunteers 
              ${whereClause}`.run(),
      ]);

      const volunteers = data.map((v) => ({
        id: v.id,
        name: v.name,
        gender: v.gender,
        nationalId: v.nationalId,
        phone: v.phone,
        phoneSecondary: v.phoneSecondary,
        hasWhatsApp: Boolean(v.hasWhatsApp),
        hasWhatsAppSecondary: Boolean(v.hasWhatsAppSecondary),
        street: v.street,
        number: v.number,
        complement: v.complement,
        neighborhood: v.neighborhood,
        city: v.city,
        state: v.state,
      }));

      return [
        {
          items: volunteers,
          totalRecords: total,
          page,
          totalPages: Math.ceil(total / perPage),
          query,
          sortKey,
          sortType,
        },
        null,
      ];
    } catch (error) {
      return [null, error];
    }
  }

  static async findById(id) {
    try {
      const data = await sql.query`
            SELECT 
              id, name, gender, nationalId, phone, phoneSecondary, 
              hasWhatsApp, hasWhatsAppSecondary, street, number, 
              complement, neighborhood, city, state
            FROM volunteers
            WHERE id = ${id} AND deleted_at IS NULL`.run();

      if (data.length === 0) return [null, null];
      const [v] = data;

      return [{
        id: v.id,
        name: v.name,
        gender: v.gender,
        nationalId: v.nationalId,
        phone: v.phone,
        phoneSecondary: v.phoneSecondary,
        hasWhatsApp: Boolean(v.hasWhatsApp),
        hasWhatsAppSecondary: Boolean(v.hasWhatsAppSecondary),
        street: v.street,
        number: v.number,
        complement: v.complement,
        neighborhood: v.neighborhood,
        city: v.city,
        state: v.state,
      }, null];
    } catch (error) {
      return [null, error];
    }
  }

  static async delete(id) {
    try {
      const deleted = await sql.exec`
            UPDATE volunteers 
            SET deleted_at = CURRENT_TIMESTAMP() 
            WHERE id = ${id} AND deleted_at IS NULL
          `.run();
      return [deleted && deleted.affectedRows > 0, null];
    } catch (error) {
      return [false, error];
    }
  }

  static async create(v) {
    try {
      const existing = await sql.query`
        SELECT id FROM volunteers 
        WHERE nationalId = ${v.nationalId} AND deleted_at IS NULL
      `.run();

      if (existing.length > 0) {
        return [false, { isDuplicate: true, message: "Este CPF já está cadastrado!" }];
      }

      const whats1 = v.hasWhatsApp ? 1 : 0;
      const whats2 = v.hasWhatsAppSecondary ? 1 : 0;

      const gender = v.gender && v.gender !== "Selecione" ? v.gender : "o";
      const street = v.street || null;
      const number = v.number || null;
      const complement = v.complement || null;
      const neighborhood = v.neighborhood || null;
      const city = v.city || null;
      const state = v.state || null;

      await sql.exec`
        INSERT INTO volunteers (
          name, gender, nationalId, phone, phoneSecondary, 
          hasWhatsApp, hasWhatsAppSecondary, street, number, 
          complement, neighborhood, city, state
        ) VALUES (
          ${v.name}, ${gender}, ${v.nationalId}, ${v.phone}, ${v.phoneSecondary}, 
          ${whats1}, ${whats2}, ${street}, ${number}, 
          ${complement}, ${neighborhood}, ${city}, ${state}
        )
      `.run();
      
      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  static async edit(v) {
    try {
      const updateStatements = sql.join(
        ", ",
        v.name ? sql`name = ${v.name}` : sql.empty,
        v.gender ? sql`gender = ${v.gender}` : sql.empty,
        v.nationalId ? sql`nationalId = ${v.nationalId}` : sql.empty,
        v.phone ? sql`phone = ${v.phone}` : sql.empty,
        v.phoneSecondary ? sql`phoneSecondary = ${v.phoneSecondary}` : sql.empty,
        v.hasWhatsApp !== undefined ? sql`hasWhatsApp = ${v.hasWhatsApp ? 1 : 0}` : sql.empty,
        v.hasWhatsAppSecondary !== undefined ? sql`hasWhatsAppSecondary = ${v.hasWhatsAppSecondary ? 1 : 0}` : sql.empty,
        v.street ? sql`street = ${v.street}` : sql.empty,
        v.number ? sql`number = ${v.number}` : sql.empty,
        v.complement !== undefined ? sql`complement = ${v.complement}` : sql.empty,
        v.neighborhood ? sql`neighborhood = ${v.neighborhood}` : sql.empty,
        v.city ? sql`city = ${v.city}` : sql.empty,
        v.state ? sql`state = ${v.state}` : sql.empty,
        sql`updated_at = CURRENT_TIMESTAMP()`
      );
      
      const updated = await sql.exec`
            UPDATE volunteers 
            SET ${updateStatements} 
            WHERE id = ${v.id} AND deleted_at IS NULL
          `.run();
      
      return [updated && updated.affectedRows > 0, null];
    } catch (error) {
      return [false, error];
    }
  }

}