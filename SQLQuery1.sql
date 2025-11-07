select * from mae_ruta_primer
select * from mae_ruta_secun
select * from mae_ruta_terc
select * from mae_ruta_cuar
select * from mae_ruta_opc



SELECT *
FROM mae_ruta_primer RP
LEFT JOIN mae_ruta_secun RS ON RP.cod_ruta_primer = RS.Pk_cod_ruta_primer
LEFT JOIN mae_ruta_terc RT ON RS.cod_ruta_secun = RT.Pk_cod_ruta_secun
LEFT JOIN mae_ruta_cuar RC ON RT.cod_ruta_terc = RC.Pk_cod_ruta_terc

LEFT JOIN mae_ruta_opc RPC1 ON RPC1.Pk_cod_ruta_primer = RP.cod_ruta_primer
LEFT JOIN mae_ruta_opc RPC2 ON RPC2.Pk_cod_ruta_secun = RS.cod_ruta_secun
LEFT JOIN mae_ruta_opc RPC3 ON RPC3.Pk_cod_ruta_terc = RT.cod_ruta_terc
LEFT JOIN mae_ruta_opc RPC4 ON RPC4.Pk_cod_ruta_cuar = RC.cod_ruta_cuar

WHERE RPC4.nom_ruta_opc = 'Leyes-Geologia'

        
EXEC sp_rename 'mae_ruta_opc.cod_ruta_cuar', 'Pk_cod_ruta_cuar', 'COLUMN';

CREATE PROCEDURE sp_IR_obtener_rutas
AS
BEGIN
    SELECT 
        RP.cod_ruta_primer, RP.nom_ruta_primer,
        RS.cod_ruta_secun, RS.nom_ruta_secun,
        RT.cod_ruta_terc, RT.nom_ruta_terc,
        RC.cod_ruta_cuar, RC.nom_ruta_cuar,
        RPC1.cod_ruta_opc AS opc_primer, RPC1.nom_ruta_opc AS nom_opc_primer,
        RPC2.cod_ruta_opc AS opc_secun, RPC2.nom_ruta_opc AS nom_opc_secun,
        RPC3.cod_ruta_opc AS opc_terc, RPC3.nom_ruta_opc AS nom_opc_terc,
        RPC4.cod_ruta_opc AS opc_cuar, RPC4.nom_ruta_opc AS nom_opc_cuar
    FROM mae_ruta_primer RP
    LEFT JOIN mae_ruta_secun RS ON RP.cod_ruta_primer = RS.Pk_cod_ruta_primer
    LEFT JOIN mae_ruta_terc RT ON RS.cod_ruta_secun = RT.Pk_cod_ruta_secun
    LEFT JOIN mae_ruta_cuar RC ON RT.cod_ruta_terc = RC.Pk_cod_ruta_terc
    LEFT JOIN mae_ruta_opc RPC1 ON RPC1.Pk_cod_ruta_primer = RP.cod_ruta_primer
    LEFT JOIN mae_ruta_opc RPC2 ON RPC2.Pk_cod_ruta_secun = RS.cod_ruta_secun
    LEFT JOIN mae_ruta_opc RPC3 ON RPC3.Pk_cod_ruta_terc = RT.cod_ruta_terc
    LEFT JOIN mae_ruta_opc RPC4 ON RPC4.Pk_cod_ruta_cuar = RC.cod_ruta_cuar
END

