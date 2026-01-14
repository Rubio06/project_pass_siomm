select * from trb_cierre_periodo
select * from mae_factor
select * from mae_val_operativo_detalle
select * from mae_val_canchas
select * from mae_factor_sobredilucion
select * from mae_factor_recuperacion
select * from mae_val_operativo_detalle
select * from mae_factor_recuperacion
select * from mae_val_operativo


drop proc SP_GUARDAR_CIERRE_PERIODO
/**GUARDAR mae_semana_periodo**/
sp_helptext 'SP_GUARDAR_CIERRE_PERIODO'


delete from trb_cierre_periodo WHERE cie_ano = '2026' 
delete from mae_factor WHERE cie_ano = '2026' 

delete from trb_cierre_periodo WHERE cie_ano = '2026' 

delete from mae_val_operativo_detalle where  val_ano = '2026' 

delete from mae_val_canchas where cie_ano = '2026' 

delete from mae_factor_sobredilucion where cie_ano = '2026' 

delete from mae_val_canchas WHERE fec_creo = '2026-01-12 17:48:26.740'

delete from mae_factor_recuperacion where cie_ano = '2026' 

delete from mae_factor_recuperacion WHERE cie_ano = '2026' 

delete from mae_val_operativo_detalle WHERE val_ano = '2026' 

delete from mae_val_operativo WHERE val_ano = '2026'

select * from mae_val_operativo_detalle


SELECT 
    c.name  AS Columna,
    t.name  AS Tabla,
    s.name  AS Esquema
FROM sys.columns c
INNER JOIN sys.tables t ON c.object_id = t.object_id
INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
WHERE c.name = 'val_pre_ag';

SELECT 
    c.name  AS Columna,
    t.name  AS Tabla,
    s.name  AS Esquema
FROM sys.columns c
INNER JOIN sys.tables t ON c.object_id = t.object_id
INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
WHERE c.name = 'val_des_tipo_fac';

select * from mae_val_operativo_detalle

select * from mae_factor_recuperacion