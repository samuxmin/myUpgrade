import { IProduct } from "./IProduct";

export interface IProductCarrito {
    id:          number;
    nombre:       string| undefined;
    precio:       number;
    imagen:       string | undefined;
    cantidad:     number;
    stock: number ;
}