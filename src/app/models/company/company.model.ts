
export interface Company {
    cnpj: string;
    name?: string;
    tradeName?: string;
    address?: CompanyAddress;
    stateRegistration?: string;
    publicId: string;
}

export interface CompanyAddress {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    cityCode: number;
    state: number;
    postalCode: string;
    phone: string;
}