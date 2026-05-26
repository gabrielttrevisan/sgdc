/**
 * @typedef {Object} Volunteer
 * @prop {number} [id]
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {string} [phoneSecondary]
 * @prop {"m"|"f"|"o"} gender
 * @prop {boolean} hasWhatsApp
 * @prop {boolean} hasWhatsAppSecondary
 * @prop {string} street
 * @prop {string} number
 * @prop {string} [complement]
 * @prop {string} neighborhood
 * @prop {string} city
 * @prop {string} state
 */

const BASE_URL = "http://localhost:3004";

export const VolunteerService = {
/**
   * @param {string} query 
   * @param {string} sortKey 
   * @param {string} sortType 
   * @returns {Promise<Volunteer[]>}
   */
  async getAll(query = "", sortKey = "name", sortType = "asc") {
    const params = new URLSearchParams();
    
    if (query.trim()) params.append("q", query.trim());
    if (sortKey) params.append("sortKey", sortKey);
    if (sortType) params.append("sortType", sortType);

    const url = `${BASE_URL}/volunteers?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("Erro ao buscar voluntários");
    
    const json = await response.json();
    return json.data.items; 
  },

  /**
   * @param {Volunteer} volunteer 
   * @returns {Promise<any>}
   */
  async save(volunteer) {
    const cleanedData = {
      ...volunteer,
      nationalId: volunteer.nationalId ? volunteer.nationalId.replace(/\D/g, "") : "",
      phone: volunteer.phone ? volunteer.phone.replace(/\D/g, "") : "",
      phoneSecondary: volunteer.phoneSecondary ? volunteer.phoneSecondary.replace(/\D/g, "") : "",
      gender: (!volunteer.gender || volunteer.gender === "Selecione") ? "o" : volunteer.gender
    };

    const isEdit = !!cleanedData.id;
    const url = isEdit ? `${BASE_URL}/volunteers/${cleanedData.id}` : `${BASE_URL}/volunteers`;
    const method = isEdit ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData),
    });
    const json = await response.json();

    if (!response.ok) {
      throw { isBackendError: true, payload: json };
    }
    return json;
  },

  /**
   * @param {number|string} id 
   * @returns {Promise<any>}
   */
    async delete(id) {
    const response = await fetch(`${BASE_URL}/volunteers/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar voluntário");

    return await response.json();
  }
};