export interface ICreateUserProps {
    "email"?: string,
    "password"?: string,
    "is_active"?: boolean,
    "is_superuser"?: boolean,
    "is_verified"?: boolean,
    "full_name"?: string,
    "cpf"?: string,
    "birth_date"?: string,
    "phone"?: string,
    "frequency": string,
    "role": string,
}

export interface ILoginProps {
    "grant_type": string;
    "username": string;
    "password": string;
    "scope": string;
    "client_id": string;
    "client_secret": string;
}
