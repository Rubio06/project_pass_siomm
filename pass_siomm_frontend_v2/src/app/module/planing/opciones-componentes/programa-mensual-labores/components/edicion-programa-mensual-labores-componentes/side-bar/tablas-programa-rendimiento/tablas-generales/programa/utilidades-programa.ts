import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Ala, CodCta, CodCto, Sostenimiento, TaladrosLargos, valOperativo } from "src/app/module/planing/opciones-componentes/programa-mensual-labores/interface";


import { EdicionProgrmaMensualService } from "src/app/module/planing/opciones-componentes/programa-mensual-labores/services";

@Injectable({
    providedIn: 'root'
})
export class UtilidadesPrograma {
    private programaState = inject(EdicionProgrmaMensualService);
    // ================================
    // LISTAS
    // ================================
    listTipoSostenimiento = signal<Sostenimiento[]>([
        { cod_sos: 'M', tipo_sosten: 'Mecanizado' },
        { cod_sos: 'C', tipo_sosten: 'Convencional' }
    ]);

    listTaladroLargo = signal<TaladrosLargos[]>([
        { cod_taladroLargo: 'N', des_taladroLargo: 'No' },
        { cod_taladroLargo: 'S', des_taladroLargo: 'Si' }
    ]);

    listValOperativo = signal<valOperativo[]>([]);

    listaCto = signal<CodCto[]>([]);
    listaCta = signal<CodCta[]>([]);
    listaAla = signal<Ala[]>([]);


    // ================================
    // PREFIJO
    // ================================
    async construirPrefijoBusqueda(config: any): Promise<string> {

        const prefijoMap: Record<string, string> = {
            '01': 'E',
            '02': 'D',
            '03': 'P',
            '04': 'T',
            '05': 'O',
            '06': 'R',
            '07': 'O'
        };

        const prefFase = prefijoMap[config.codFase];

        const [prefParametro, prefZona] = await Promise.all([
            firstValueFrom(this.programaState.obtenerPrefCtoMina()),
            firstValueFrom(this.programaState.obtenerPrefZona(config.codZona))
        ]);

        if (config.codFase === '07') {
            return prefFase;
        }

        return `${prefParametro.pref_cto_mina}-${prefZona.cod_costo_equivalente}${prefFase}`;
    }

    // ================================
    // CARGAR LISTAS
    // ================================
    async cargarListas(config: any, prefijoBusqueda: string): Promise<void> {

        const [cto, cta, ala, valOp] = await Promise.all([
            firstValueFrom(this.programaState.selectCodCto(config.cie_ano, prefijoBusqueda)),
            firstValueFrom(this.programaState.selectCodCta(config.cie_ano)),
            firstValueFrom(this.programaState.selectAla()),
            firstValueFrom(this.programaState.selectValOperativo(config.cie_ano, config.cie_per))
        ]);

        this.listaCto.set(cto ?? []);
        this.listaCta.set(cta ?? []);
        this.listaAla.set(ala ?? []);
        this.listValOperativo.set(valOp ?? []);
    }

    //VARIABLES

    //FORMULARS










}
