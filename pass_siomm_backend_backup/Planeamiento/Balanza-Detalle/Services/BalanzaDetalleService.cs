using Microsoft.Data.SqlClient;
using pass_siomm_backend.Planeamiento.Balanza_Detalle.Data;
using System.Data;

namespace pass_siomm_backend.Planeamiento.Balanza_Detalle.Services
{
    public class BalanzaDetalleService : ICatalogosService
    {
        private readonly string _connectionString;


        public BalanzaDetalleService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<RespuestaTicketBalanzaDto> ObtenerTicketsBalanzaAsync(EntradaTicketBalanzaDto dto)
        {
            var resultado = new RespuestaTicketBalanzaDto();

            await using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_OBTENER_TICKET_BALANZA", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
            cmd.Parameters.AddWithValue("@cie_ano", string.IsNullOrEmpty(dto.cie_ano) ? DBNull.Value : dto.cie_ano);
            cmd.Parameters.AddWithValue("@cie_per", string.IsNullOrEmpty(dto.cie_per) ? DBNull.Value : dto.cie_per);
            cmd.Parameters.AddWithValue("@cie_dia", string.IsNullOrEmpty(dto.cie_dia) ? DBNull.Value : dto.cie_dia);
            cmd.Parameters.AddWithValue("@pagina", dto.pagina);
            cmd.Parameters.AddWithValue("@registros_por_pagina", dto.registros_por_pagina);

            await conn.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();

            // Primer result set: total de registros
            if (await reader.ReadAsync())
            {
                resultado.total_registros = reader.GetInt32(reader.GetOrdinal("total_registros"));
            }

            // Segundo result set: datos paginados
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                resultado.data.Add(new TicketBalanzaDto
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                    cod_ticket_balanza = reader["cod_ticket_balanza"]?.ToString(),
                    fec_pesaje = reader["fec_pesaje"] == DBNull.Value ? null : Convert.ToDateTime(reader["fec_pesaje"]),
                    cod_turno = reader["cod_turno"]?.ToString(),
                    contrata = reader["contrata"]?.ToString(),
                    des_placa = reader["des_placa"]?.ToString(),
                    des_cod_equipo = reader["des_cod_equipo"]?.ToString(),
                    cod_tipo_material = reader["cod_tipo_material"]?.ToString(),
                    num_cantidad_carros = reader["num_cantidad_carros"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_cantidad_carros"]),
                    num_peso_neto_tmh = reader["num_peso_neto_tmh"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_peso_neto_tmh"]),
                    est_ticket_balanza = reader["est_ticket_balanza"]?.ToString(),
                    des_guia_remitente = reader["des_guia_remitente"]?.ToString(),
                    cod_tipo_material_detalle = reader["cod_tipo_material_detalle"]?.ToString(),
                    cod_zona = reader["cod_zona"]?.ToString(),
                    ruta_origen = reader["ruta_origen"]?.ToString(),
                    ruta_destino = reader["ruta_destino"]?.ToString(),
                    fec_peso_entrada = reader["fec_peso_entrada"] == DBNull.Value ? null : Convert.ToDateTime(reader["fec_peso_entrada"]),
                    num_peso_entrada_tmh = reader["num_peso_entrada_tmh"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_peso_entrada_tmh"]),
                    fec_peso_salida = reader["fec_peso_salida"] == DBNull.Value ? null : Convert.ToDateTime(reader["fec_peso_salida"]),
                    num_peso_salida_tmh = reader["num_peso_salida_tmh"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_peso_salida_tmh"]),
                    cod_item_ruta = reader["cod_item_ruta"]?.ToString(),
                    cod_ruta_origen = reader["cod_ruta_origen"]?.ToString(),
                    cod_ruta_destino = reader["cod_ruta_destino"]?.ToString(),
                    cod_proveedor = reader["cod_proveedor"]?.ToString(),
                    cod_personal = reader["cod_personal"]?.ToString(),
                    cod_tipo_car = reader["cod_tipo_car"]?.ToString(),
                    cod_contrato = reader["cod_contrato"]?.ToString(),
                    cod_tipo_car_equipo = reader["cod_tipo_car_equipo"]?.ToString(),
                    cod_proced_blza = reader["cod_proced_blza"]?.ToString(),
                    cod_labor = reader["cod_labor"]?.ToString(),
                    nom_labor = reader["nom_labor"]?.ToString(),
                    cod_tipo_labor = reader["cod_tipo_labor"]?.ToString(),
                    cod_ala = reader["cod_ala"]?.ToString(),
                    des_chofer = reader["des_chofer"]?.ToString(),
                    des_tipo_transporte = reader["des_tipo_transporte"]?.ToString(),
                    des_proced_blza = reader["des_proced_blza"]?.ToString(),
                    as_check = reader["as_check"]?.ToString(),
                });
            }

            return resultado;
        }

        public async Task<DetalleTicketBalanzaDto?> ObtenerDetalleAsync(EntradaDetTicketBlanzaDto entrada)
        {
            const string sp_name = "SP_OBTENER_DETALLE_TICKET_BALANZA";

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand(sp_name, connection)
            {
                CommandType = CommandType.StoredProcedure,
                CommandTimeout = 30
            };

            command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
            command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empresa_unidad;
            command.Parameters.Add("@cod_ticket_balanza", SqlDbType.VarChar, 20).Value = entrada.cod_ticket_balanza;

            await connection.OpenAsync();

            await using var reader = await command.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return null; 
            }

            return MapReaderToDto(reader);
        }

        private static DetalleTicketBalanzaDto MapReaderToDto(SqlDataReader reader)
        {
            return new DetalleTicketBalanzaDto
            {
                cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad"),
                cod_ticket_balanza = reader.GetStringOrDefault("cod_ticket_balanza"),
                fec_emision = reader.GetDateTimeOrDefault("fec_emision"),
                cod_turno = reader.GetStringOrDefault("cod_turno"),
                des_comentario = reader.GetStringOrDefault("des_comentario"),
                cod_proveedor = reader.GetStringOrDefault("cod_proveedor"),
                cod_tipo_material = reader.GetStringOrDefault("cod_tipo_material"),
                cod_tipo_material_detalle = reader.GetStringOrDefault("cod_tipo_material_detalle"),
                cod_personal = reader.GetStringOrDefault("cod_personal"),
                cod_contrato = reader.GetStringOrDefault("cod_contrato"),
                des_guia_remitente = reader.GetStringOrDefault("des_guia_remitente"),
                cod_tipo_car = reader.GetStringOrDefault("cod_tipo_car"),
                cod_tipo_car_equipo = reader.GetStringOrDefault("cod_tipo_car_equipo"),
                cod_proced_blza = reader.GetStringOrDefault("cod_proced_blza"),
                cod_item_ruta = reader.GetStringOrDefault("cod_item_ruta"),
                cod_zona = reader.GetStringOrDefault("cod_zona"),
                num_cantidad_carros = reader.GetDecimalOrDefault("num_cantidad_carros"),
                fec_peso_entrada = reader.GetDateTimeOrDefault("fec_peso_entrada"),
                num_peso_entrada_tmh = reader.GetDecimalOrDefault("num_peso_entrada_tmh"),
                fec_peso_salida = reader.GetDateTimeOrDefault("fec_peso_salida"),
                num_peso_salida_tmh = reader.GetDecimalOrDefault("num_peso_salida_tmh"),
                num_peso_neto_tmh = reader.GetDecimalOrDefault("num_peso_neto_tmh"),
                est_ticket_balanza = reader.GetStringOrDefault("est_ticket_balanza"),
                cod_usuario_creo = reader.GetStringOrDefault("cod_usuario_creo"),
                fec_usuario_creo = reader.GetDateTimeOrDefault("fec_usuario_creo"),
                cod_usuario_modi = reader.GetStringOrDefault("cod_usuario_modi"),
                fec_usuario_modi = reader.GetDateTimeOrDefault("fec_usuario_modi"),
                cod_placa = reader.GetStringOrDefault("cod_placa"),
                ruta_origen = reader.GetStringOrDefault("ruta_origen"),
                ruta_destino = reader.GetStringOrDefault("ruta_destino"),
                cod_usuario_apr = reader.GetStringOrDefault("cod_usuario_apr"),
                fec_usuario_apr = reader.GetDateTimeOrDefault("fec_usuario_apr"),
                cod_ruta_origen = reader.GetStringOrDefault("cod_ruta_origen"),
                cod_ruta_destino = reader.GetStringOrDefault("cod_ruta_destino"),
                cod_labor = reader.GetStringOrDefault("cod_labor"),
                cod_tipo_labor = reader.GetStringOrDefault("cod_tipo_labor"),
                cod_ala = reader.GetStringOrDefault("cod_ala"),
                des_tipo_car = reader.GetStringOrDefault("des_tipo_car"),
                fec_pesaje = reader.GetDateTimeOrDefault("fec_pesaje"),
                ind_automatico = reader.GetBoolOrDefault("ind_automatico"),
                cod_ticket_balanza_copia = reader.GetStringOrDefault("cod_ticket_balanza_copia"),
                cod_nivel = reader.GetStringOrDefault("cod_nivel"),
                cod_und_econom = reader.GetStringOrDefault("cod_und_econom"),
                cod_veta = reader.GetStringOrDefault("cod_veta"),
                cod_fase = reader.GetStringOrDefault("cod_fase"),
                ind_tipo_cancha = reader.GetStringOrDefault("ind_tipo_cancha"),
                cod_grupo_control = reader.GetStringOrDefault("cod_grupo_control"),
                nom_labor = reader.GetStringOrDefault("nom_labor"),
                cod_maquinaria = reader.GetStringOrDefault("cod_maquinaria"),
                des_maquinaria = reader.GetStringOrDefault("des_maquinaria")
            };
        }



        // ---------- 1. Turnos activos ----------
        public async Task<List<TurnoDto>> ObtenerTurnosActivosAsync(EntradaDto entrada)
        {
            var lista = new List<TurnoDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_TURNOS_ACTIVOS", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
            command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empresa_unidad;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new TurnoDto
                {
                    cod_turno = reader.GetStringOrDefault("cod_turno"),
                    des_turno = reader.GetStringOrDefault("des_turno"),
                    hor_inicio_operacion = reader.GetTimeSpanOrDefault("hor_inicio_operacion"),
                    hor_fin_operacion = reader.GetTimeSpanOrDefault("hor_fin_operacion")
                });
            }

            return lista;
        }

        // ---------- 2. Tipo Material Detalle ----------
        public async Task<List<TipoMaterialDetalleDto>> ObtenerTipoMaterialDetalleAsync(EntradaTipoDetalleDto entrada)
        {
            var lista = new List<TipoMaterialDetalleDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_TIPO_MATERIAL_DETALLE", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
            command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empresa_unidad;
            command.Parameters.Add("@cod_tipo_material", SqlDbType.VarChar, 10).Value = entrada.cod_tipo_material;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new TipoMaterialDetalleDto
                {
                    cod_tipo_material_detalle = reader.GetStringOrDefault("cod_tipo_material_detalle"),
                    des_tipo_material_det = reader.GetStringOrDefault("des_tipo_material_det")
                });
            }

            return lista;
        }

        // ---------- 3. Contratas activas ----------
        public async Task<List<ContrataDto>> ObtenerContratasActivasAsync(EntradaDto entrada)
        {
            var lista = new List<ContrataDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_CONTRATA_ACTIVA", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
            command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empresa_unidad;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new ContrataDto
                {
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_contrata = reader.GetStringOrDefault("cod_contrata"),
                    des_contrata = reader.GetStringOrDefault("des_contrata")
                });
            }

            return lista;
        }

        // ---------- 4. Contrato por Contrata ----------
        public async Task<List<ContratoDto>> ObtenerContratoPorContrataAsync(string cod_contrada)
        {
            var lista = new List<ContratoDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_CONTRATO_X_CONTRATA", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_contrata", SqlDbType.VarChar, 10).Value = cod_contrada;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new ContratoDto
                {
                    cod_contrato = reader.GetStringOrDefault("cod_contrato"),
                    cod_contrata = reader.GetStringOrDefault("cod_contrata")
                });
            }

            return lista;
        }

        // ---------- 5. Personal de Contrata ----------
        public async Task<List<PersonalContrataDto>> ObtenerPersonalContrataAsync(string cod_contrata)
        {
            var lista = new List<PersonalContrataDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_PERSONAL_CONTRATO", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_contrata", SqlDbType.VarChar, 10).Value = cod_contrata;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new PersonalContrataDto
                {
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad"),
                    cod_contrata = reader.GetStringOrDefault("cod_contrata"),
                    cod_personal = reader.GetStringOrDefault("cod_personal"),
                    cod_cargo = reader.GetStringOrDefault("cod_cargo"),
                    des_apellido_pat = reader.GetStringOrDefault("des_apellido_pat"),
                    des_apellido_mat = reader.GetStringOrDefault("des_apellido_mat"),
                    des_nombre = reader.GetStringOrDefault("des_nombre"),
                    ind_chofer = reader.GetStringOrDefault("ind_chofer"),
                    nro_doc_dni = reader.GetStringOrDefault("nro_doc_dni"),
                    nro_doc_brevete = reader.GetStringOrDefault("nro_doc_brevete"),
                    flg_vigente = reader.GetStringOrDefault("flg_vigente"),
                    cod_usuario_creo = reader.GetStringOrDefault("cod_usuario_creo"),
                    fec_usuario_creo = reader.GetDateTimeOrDefault("fec_usuario_creo"),
                    cod_usuario_modi = reader.GetStringOrDefault("cod_usuario_modi"),
                    fec_usuario_modi = reader.GetDateTimeOrDefault("fec_usuario_modi"),
                    C_T_PERSONAL = reader.GetStringOrDefault("C_T_PERSONAL")
                });
            }

            return lista;
        }

        // ---------- 6. Tipo de Carro ----------
        public async Task<List<TipoCarroDto>> ObtenerTipoCarroAsync()
        {
            var lista = new List<TipoCarroDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_TIPO_CARRO", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new TipoCarroDto
                {
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad"),
                    cod_tipo_car = reader.GetStringOrDefault("cod_tipo_car"),
                    des_tipo_car = reader.GetStringOrDefault("des_tipo_car"),
                    nro_tipo_car_fac = reader.GetDecimalOrDefault("nro_tipo_car_fac")
                });
            }

            return lista;
        }

        // ---------- 7. Equipos de Contrata ----------
        public async Task<List<EquipoContrataDto>> ObtenerEquiposContrataAsync(EntradaEquiposContrataDto entrada)
        {
            var lista = new List<EquipoContrataDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_EQUIPOS_CONTRATA", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
            command.Parameters.Add("@cod_contrata", SqlDbType.VarChar, 10).Value = entrada.cod_contrata;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new EquipoContrataDto
                {
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad"),
                    equipo = reader.GetStringOrDefault("equipo"),
                    descripcion = reader.GetStringOrDefault("descripcion"),
                    placa = reader.GetStringOrDefault("placa")
                });
            }

            return lista;
        }

        // ---------- 8. Maquinaria ----------
        public async Task<List<MaquinariaDto>> ObtenerMaquinariaAsync(EntradaDto entrada)
        {
            var lista = new List<MaquinariaDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_MAQUINARIA", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
            command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empresa_unidad;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new MaquinariaDto
                {
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad"),
                    cod_maquinaria = reader.GetStringOrDefault("cod_maquinaria"),
                    des_maquinaria = reader.GetStringOrDefault("des_maquinaria"),
                    est_maquinaria = reader.GetStringOrDefault("est_maquinaria")
                });
            }

            return lista;
        }

        // ---------- 9. Tipo de Labor ----------
        public async Task<List<TipoLaborBlnzDto>> ObtenerTipoLaborActivoAsync()
        {
            var lista = new List<TipoLaborBlnzDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_TIPO_LABOR_ACTIVO", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new TipoLaborBlnzDto
                {
                    cod_tipo_labor = reader.GetStringOrDefault("cod_tipo_labor"),
                    nom_tipo_labor = reader.GetStringOrDefault("nom_tipo_labor"),
                    ind_orient = reader.GetStringOrDefault("ind_orient"),
                    ind_tipchm = reader.GetStringOrDefault("ind_tipchm"),
                    est_tipo_labor = reader.GetStringOrDefault("est_tipo_labor"),
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad")
                });
            }

            return lista;
        }

        // ---------- 10. Labores Programadas ----------
        public async Task<List<LaborProgramadaDto>> ObtenerLaboresProgramadasAsync(EntradaLaboresProgramadosDto entrada)
        {
            var lista = new List<LaborProgramadaDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_LABORES_PROGRAMAS", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
            command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empresa_unidad;
            command.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = entrada.cie_ano;
            command.Parameters.Add("@cie_mes", SqlDbType.VarChar, 2).Value = entrada.cie_mes;
            command.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 10).Value = entrada.cod_tipo_labor;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new LaborProgramadaDto
                {
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_und_econom = reader.GetStringOrDefault("cod_und_econom"),
                    cod_zona = reader.GetStringOrDefault("cod_zona"),
                    cod_veta = reader.GetStringOrDefault("cod_veta"),
                    cod_nivel_prg = reader.GetStringOrDefault("cod_nivel_prg"),
                    cod_tipo_labor = reader.GetStringOrDefault("cod_tipo_labor"),
                    cod_labor = reader.GetStringOrDefault("cod_labor"),
                    nom_labor = reader.GetStringOrDefault("nom_labor"),
                    des_labor = reader.GetStringOrDefault("des_labor"),
                    lab_blkgeo = reader.GetStringOrDefault("lab_blkgeo"),
                    met_cod = reader.GetStringOrDefault("met_cod"),
                    cod_nivel_labor = reader.GetStringOrDefault("cod_nivel_labor"),
                    est_labor = reader.GetStringOrDefault("est_labor"),
                    nom_und_econom = reader.GetStringOrDefault("nom_und_econom"),
                    des_zona = reader.GetStringOrDefault("des_zona"),
                    nom_veta = reader.GetStringOrDefault("nom_veta"),
                    cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad"),
                    cod_ala = reader.GetStringOrDefault("cod_ala"),
                    labor_con = reader.GetStringOrDefault("labor_con")
                });
            }

            return lista;
        }

        // ---------- 11. Alas ----------
        public async Task<List<AlaDto>> ObtenerAlasAsync()
        {
            var lista = new List<AlaDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_ALAS", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new AlaDto
                {
                    cod_ala = reader.GetStringOrDefault("cod_ala"),
                    nom_ala = reader.GetStringOrDefault("nom_ala"),
                    est_ala = reader.GetStringOrDefault("est_ala"),
                    cod_usuario_creo = reader.GetStringOrDefault("cod_usuario_creo"),
                    fec_usuario_creo = reader.GetDateTimeOrDefault("fec_usuario_creo"),
                    cod_usuario_modi = reader.GetStringOrDefault("cod_usuario_modi"),
                    fec_usuario_modi = reader.GetDateTimeOrDefault("fec_usuario_modi"),
                    nombre = reader.GetStringOrDefault("nombre"),
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad")
                });
            }

            return lista;
        }

        // ---------- 12. Tarifario de Transporte ----------
        public async Task<List<TarifarioTransporteDto>> ObtenerTarifarioTransporteAsync(EntradaTarifarioTransporteDto entrada)
        {
            var lista = new List<TarifarioTransporteDto>();

            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("SP_OBTENER_TARIFARIO_TRANSPORTE", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = entrada.cod_contrato;
            command.Parameters.Add("@ind_material", SqlDbType.VarChar, 10).Value = entrada.ind_material;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new TarifarioTransporteDto
                {
                    cod_empresa = reader.GetStringOrDefault("cod_empresa"),
                    cod_empresa_unidad = reader.GetStringOrDefault("cod_empresa_unidad"),
                    cod_contrato = reader.GetStringOrDefault("cod_contrato"),
                    cod_item_ruta = reader.GetStringOrDefault("cod_item_ruta"),
                    cod_ruta_origen = reader.GetStringOrDefault("cod_ruta_origen"),
                    cod_ruta_destino = reader.GetStringOrDefault("cod_ruta_destino"),
                    cod_ruta_intermedia = reader.GetStringOrDefault("cod_ruta_intermedia"),
                    imp_ruta_pu = reader.GetDecimalOrDefault("imp_ruta_pu"),
                    ind_material = reader.GetStringOrDefault("ind_material"),
                    imp_tmh_km_soles = reader.GetDecimalOrDefault("imp_tmh_km_soles"),
                    nro_distancia_km = reader.GetDecimalOrDefault("nro_distancia_km"),
                    nro_factor_viajepeso = reader.GetDecimalOrDefault("nro_factor_viajepeso"),
                    flg_vigencia = reader.GetStringOrDefault("flg_vigencia"),
                    cod_zona = reader.GetStringOrDefault("cod_zona"),
                    cta_cod = reader.GetStringOrDefault("cta_cod"),
                    cto_cod = reader.GetStringOrDefault("cto_cod"),
                    c_t_zona = reader.GetStringOrDefault("c_t_zona"),
                    c_t_origen = reader.GetStringOrDefault("c_t_origen"),
                    c_t_destino = reader.GetStringOrDefault("c_t_destino")
                });
            }

            return lista;
        }


    }
}
