
export interface Company {
    cnpj: string;
    name?: string;
    tradeName?: string;
    address?: CompanyAddress;
    stateRegistration?: string;
    publicId?: string;
    crt?: number;
    hasCertificate?: boolean;
    //duas casas decimais para o valor do IBPT
    ibpt?: number;
}

export interface CompanyAddress {
    street: string;
    number: number;
    complement?: string;
    neighborhood: string;
    cityName: string;
    cityCode: number;
    state: number;
    postalCode: string;
    phone: string;
    email: string;
}