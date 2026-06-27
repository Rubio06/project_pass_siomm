import { Routes } from "@angular/router";
import { ServicioTransporteComponent } from "./servicio-transporte.component";
import { ParametrosGeneralesComponent } from "./components/tabs/parametros-generales/parametros-generales.component";
import { EsptecBaseMedicionComponent } from "./components/tabs/esptec-base-medicion/esptec-base-medicion.component";



export const servicioTransporteRoutes: Routes = [
    {
        path: '',
        component: ServicioTransporteComponent,
        children: [


            {
                path: 'parametros-generales',
                component: ParametrosGeneralesComponent
            },
            {
                path: 'base-medicion',
                component: EsptecBaseMedicionComponent
            }




        ]
    }
];

export default servicioTransporteRoutes;
