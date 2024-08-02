export interface Producto {
    sku?: number| null ;
    articulo?: string;
    marca?: string;
    modelo?: string;
    departamento?: string;
    clase?: string;
    familia?: string;
    stock?: number;
    cantidad?: number;
    fechaAlta?: string;
    fechaBaja?: string;
    descontinuado?: number;
}
