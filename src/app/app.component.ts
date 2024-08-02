import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Producto } from './Producto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProductoFrontend';

  showFields: boolean = false;
  showConsultButton: boolean = true;
  showActionButtons: boolean = true;
  showGuardarButtons: boolean = false;

  descontinuadoDisabled: boolean = true;
  fechaAltaDisabled: boolean = true;
  fechaBajaDisabled: boolean = true;

  departamentos: string[] = ['1', '2', '3'];
  clases: string[] = ['1', '2', '3'];
  familias: string[] = ['1', '2', '3'];


  producto: Producto = {
    sku: null,
    articulo: '',
    marca: '',
    modelo: '',
    departamento: '',
    clase: '',
    familia: '',
    stock: 0,
    cantidad: 0,
    fechaAlta: new Date().toISOString().split('T')[0],
    fechaBaja: '1900-01-01',
    descontinuado: 0
  };

  constructor(private httpClient: HttpClient) { }


  consultar() {

    if (this.producto.sku) {

      this.showFields = true;
      this.showConsultButton = false;

      this.httpClient.get("http://localhost:8080/api/productos/" + this.producto.sku).subscribe({
        next: (data) => {
          this.producto = data;
          console.log(this.producto);
          this.descontinuadoDisabled = false;
        },
        error: (error) => {
          if (error.status == 404) {
            this.showActionButtons = false;
            this.showGuardarButtons = true;
            this.descontinuadoDisabled = true;
          }
        },
        complete: () => {

        }
      })
    }

  }


  insertar() {
    if ((this.producto.cantidad ?? 0) > (this.producto.stock ?? 0)) {
      alert("La cantidad no puede ser mayor que el stock.");
      return;
    }
    const productoConNumero = {
      ...this.producto,
      descontinuado: this.producto.descontinuado ? 1 : 0
    };
    console.log(productoConNumero)
    this.httpClient.post(`http://localhost:8080/api/productos`, productoConNumero).subscribe({
      next: (data) => {
        alert("Producto guardado exitosamente")
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al guardar el producto:', error);
      }
    });
  }

  actualizar() {

    if ((this.producto.cantidad ?? 0) > (this.producto.stock ?? 0)) {
      alert("La cantidad no puede ser mayor que el stock.");
      return;
    }

    const { sku, ...productoSinSku } = this.producto;
    const productoConNumero = {
      ...productoSinSku,
      descontinuado: this.producto.descontinuado ? 1 : 0
    };
    console.log(productoSinSku)
    console.log(productoConNumero)
    this.httpClient.put(`http://localhost:8080/api/productos/${this.producto.sku}`, productoConNumero).subscribe({
      next: (data) => {
        alert("Producto actualizado exitosamente")
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    });
  }

  eliminar() {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este producto?');

    if (confirmDelete) {
      this.httpClient.delete(`http://localhost:8080/api/productos/${this.producto.sku}`).subscribe({
        next: () => {
          alert('Producto eliminado correctamente.');
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al eliminar el producto:', error);
        }
      });
    }
  }


  onDescontinuadoChange() {
    if (this.producto.descontinuado) {
      this.producto.fechaBaja = new Date().toISOString().split('T')[0];
    }
  }

}
