export interface IProduct {
    id:          number;
    nombre:       string;
    precio:       number;
    descripcion: string;
    categoria:    string;
    imagen:       string;
    stock:     number  | null;  
    componentes: IProduct[] | null;
}