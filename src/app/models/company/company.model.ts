
export interface Company {
    cnpj: string;
    name?: string;
    tradeName?: string;
    address?: CompanyAddress;
    stateRegistration?: string;
    publicId?: string;
    crt?: number;
}

export interface CompanyAddress {
    street: string;
    number: number;
    complement?: string;
    neighborhood: string;
    city: string;
    cityCode: number;
    stateCode: number;
    postalCode: string;
    phone: string;
    email: string;
}