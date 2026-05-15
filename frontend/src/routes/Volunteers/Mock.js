/** 
 * @typedef {Object} Volunteer
 * @property {number} id
 * @property {string} name
 * @property {string} gender
 * @property {string} nationalId
 * @property {string} phone
 * @property {string} phoneSecondary
 * @property {boolean} hasWhatsApp
 * @property {boolean} hasWhatsAppSecondary
 * @property {string} street
 * @property {string} number
 * @property {string} complement
 * @property {string} neighborhood
 * @property {string} city
 * @property {string} state
 */

/** @type {Volunteer[]} */
export const VOLUNTEERS_MOCK = [
  {
    id: 1,
    name: "Lucas Almeida",
    gender: "m",
    nationalId: "847.392.155-21",
    phone: "(18) 99745-1123",
    phoneSecondary: "(18) 99122-7788",
    hasWhatsApp: true,
    hasWhatsAppSecondary: true,
    street: "Rua das Palmeiras",
    number: "128",
    complement: "Casa",
    neighborhood: "Jardim Europa",
    city: "Presidente Prudente",
    state: "SP",
  },
  {
    id: 2,
    name: "Mariana Costa",
    gender: "f",
    nationalId: "193.552.880-04",
    phone: "(18) 99812-4432",
    phoneSecondary: "(18) 99654-7781",
    hasWhatsApp: true,
    hasWhatsAppSecondary: false,
    street: "Avenida Washington Luiz",
    number: "450",
    complement: "Apartamento 21",
    neighborhood: "Centro",
    city: "Presidente Prudente",
    state: "SP",
  },
  {
    id: 3,
    name: "Gabriel Ferreira",
    gender: "m",
    nationalId: "552.918.330-90",
    phone: "(18) 99771-5544",
    phoneSecondary: "(18) 98882-1122",
    hasWhatsApp: false,
    hasWhatsAppSecondary: true,
    street: "Rua do Comércio",
    number: "89",
    complement: "",
    neighborhood: "Vila Marcondes",
    city: "Presidente Prudente",
    state: "SP",
  },
  {
    id: 4,
    name: "Beatriz Santos",
    gender: "f",
    nationalId: "601.442.119-77",
    phone: "(18) 99123-6677",
    phoneSecondary: "(18) 98877-2233",
    hasWhatsApp: true,
    hasWhatsAppSecondary: true,
    street: "Rua Minas Gerais",
    number: "742",
    complement: "Bloco B",
    neighborhood: "Jardim Bongiovani",
    city: "Presidente Prudente",
    state: "SP",
  },
  {
    id: 5,
    name: "Thiago Oliveira",
    gender: "m",
    nationalId: "411.829.550-10",
    phone: "(18) 99955-4411",
    phoneSecondary: "(18) 98811-9090",
    hasWhatsApp: false,
    hasWhatsAppSecondary: false,
    street: "Travessa Central",
    number: "15",
    complement: "Fundos",
    neighborhood: "Ana Jacinta",
    city: "Presidente Prudente",
    state: "SP",
  },
  {
    id: 6,
    name: "Camila Rocha",
    gender: "f",
    nationalId: "920.774.660-55",
    phone: "(18) 99844-5522",
    phoneSecondary: "(18) 98771-3399",
    hasWhatsApp: true,
    hasWhatsAppSecondary: true,
    street: "Rua das Acácias",
    number: "301",
    complement: "Casa 2",
    neighborhood: "Jardim Paulista",
    city: "Presidente Prudente",
    state: "SP",
  },
];
