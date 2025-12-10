

select * from trb_cierre_periodo



select fac_denmin, fac_dendes, fac_vptmin, fac_dialab,fac_tarhor, fac_porcum, fac_porhum, fac_tms_dif from mae_factor WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 11;

select * from mae_factor WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 11;


select * from mae_val_operativo
select * from mae_val_canchas

SELECT T_C_P.cie_ano, T_C_P.cie_per, T_C_P.fec_ini, T_C_P.fec_ini  FROM trb_cierre_periodo T_C_P
INNER JOIN mae_factor M_F ON T_C_P.cod_empresa_unidad = M_F.cod_empresa_unidad
WHERE T_C_P.cie_ano = 2025 AND T_C_P.cie_per = 01

select distinct cie_ano, cie_per 
from trb_cierre_periodo 
where cie_ano = 2019 
order by cie_per ASC


/*FACTOR OPERATIVO*/
SELECT 
	fm.fac_denmin, 
	fm.fac_dendes,
	fm.fac_vptmin,
	fm.fac_dialab,
	fm.fac_tarhor,
	fm.fac_porcum,
	fm.fac_porhum,
	fm.fac_tms_dif
FROM trb_cierre_periodo AS trb_cier
INNER JOIN mae_factor AS fm
    ON trb_cier.cod_empresa_unidad = fm.cod_empresa_unidad
WHERE trb_cier.cie_ano = '2019'
  AND trb_cier.cie_per = '06'



/*VALORES*/
SELECT 
	/*FACTOR OPERATIVO*/
    fm.fac_denmin, 
	fm.fac_dendes,
	fm.fac_vptmin,
	fm.fac_dialab,
	fm.fac_tarhor,
	fm.fac_porcum,
	fm.fac_porhum,
	fm.fac_tms_dif,
	
	/*VALORES*/
	mvo.val_pre_ag, 
	mvo.val_pre_cu,
	mvo.val_pre_pb,
	mvo.val_pre_ag,
	
	/*CANCHAS*/
	mvc.val_ag,
	mvc.val_cu,
	mvc.val_pb,
	mvc.val_zn,
	mvc.val_tms,
	mvc.val_vpt
	
	/*FACTOR OPERATIVO*/
FROM trb_cierre_periodo AS trb_cier
INNER JOIN mae_factor AS fm
    ON trb_cier.cod_empresa_unidad = fm.cod_empresa_unidad
INNER JOIN mae_val_operativo AS mvo 
	ON fm.cod_empresa_unidad = mvo.cod_empresa_unidad
INNER JOIN mae_val_canchas AS mvc 
	ON mvo.cod_empresa_unidad = mvc.cod_empresa_unidad
WHERE 
    trb_cier.cie_ano = '2024'
  AND 
	trb_cier.cie_per = '02'
	

  AND 
	trb_cier.fec_ini >= '20251101'
  AND 
	trb_cier.fec_fin < '20251130';


select * from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME LIKE '%conversion%'


select * from mae_factor where 




select * from mae_factor_conversion

SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME = 'nro_lab_ancho';


/**/

select cod_tiplab,
       nro_lab_ancho,
       nro_lab_pieper,
       nro_lab_broca,
       nro_lab_barcon, 
       nro_lab_facpot, 
       nro_lab_fulmin, 
       nro_lab_conect, 
       nro_lab_punmar, 
       nro_lab_tabla 
from mae_tip_lab_estandar WHERE
cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = 2006
  AND cie_per = 09

SELECT * FROM mae_tip_lab_estandar

-- trb_cierre_periodo / mae_factor / mae_val_operativo / mae_val_canchas 

select * from trb_cierre_periodo
select * from mae_factor
select * from mae_val_operativo
select * from mae_val_canchas

select * from trb_cierre_periodo
select * from trb_cierre_periodo


select val_fac_rec_ag, val_fac_rec_cu, val_fac_rec_pb,val_fac_rec_zn, val_fac_rec_au, val_des_tipo_fac  from mae_val_operativo_detalle
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND val_ano = 2025
  AND val_per = 11
  AND val_des_tipo_fac = 'GENERAL';
select *  from mae_val_operativo_detalle

SELECT *
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'mae_val_operativo_detalle';

/*FACTOR OPERATIVO - VALORES*/
SELECT
    val_fac_ag,
    val_pre_ag,
    val_fac_cu,
    val_pre_cu,
    val_fac_pb,
    val_pre_pb,
    val_fac_zn,
    val_pre_zn,
    val_fac_au,
    val_pre_au,
    cod_empresa,
    val_ano,
    val_per,
    val_vig,
    usu_creo,
    fec_creo,
    usu_modi,
    fec_modi,
    cod_empresa_unidad
FROM mae_val_operativo
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND val_ano = 2025
  AND val_per = 01;
  
  
/*FACTOR CIERRE PERIODO*/
SELECT * FROM mae_factor_sobredilucion WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 11;

SELECT
    cod_empresa,
    cod_empresa_unidad,
    cie_ano,
    cie_per,
    fec_ini,
    fec_fin,
    usu_creo,
    fec_creo,
    usu_modi,
    fec_modi
FROM trb_cierre_periodo
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 11;


/*FACTOR RECUPERACION*/
SELECT
    cod_empresa,
    cie_ano,
    cie_per,
    val_fac_ag,
    val_fac_cu,
    val_fac_pb,
    val_fac_zn,
    usu_creo,
    fec_creo,
    usu_modi,
    fec_modi,
    val_fac_bud_ag,
    val_fac_bud_cu,
    val_fac_bud_pb,
    val_fac_bud_zn,
    val_con_ag,
    val_con_cu,
    val_con_pb,
    val_con_zn,
    cod_empresa_unidad,
    val_fac_au,
    val_fac_bud_au,
    val_con_au
FROM mae_factor_recuperacion
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 01;
  
  
  

SELECT
val_fac_bud_ag,
val_fac_bud_cu,
val_fac_bud_pb,
val_fac_bud_zn,
val_fac_bud_au
FROM mae_factor_recuperacion
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 11;
  
 SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME = 'nro_lab_ancho';

  
  SELECT
*
FROM mae_factor_recuperacion
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 11;



/*canchas*/

SELECT 
    cod_empresa,
    cie_ano,
    cie_per,
    val_tms,
    val_ag,
    val_cu,
    val_pb,
    val_zn,
    usu_creo,
    fec_creo,
    usu_modi,
    fec_modi,
    val_vpt
FROM mae_val_canchas
WHERE cod_empresa = 3
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 01;
  
  
    SELECT 
        ValTms,
        ValAg,
        ValCu,
        ValPb,
        ValZn,
        ValVpt
    FROM mae_val_canchas
    WHERE cod_empresa = 3
      AND cod_empresa_unidad = 01
      AND cie_ano = 2025
      AND cie_per = 01
  
select * from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'mae_val_canchas'

 
SELECT 
    ValTms,
    ValAg,
    ValCu,
    ValPb,
    ValZn,
    UsuCreo,
    UsuModi,
    ValVpt
FROM mae_val_canchas
WHERE cod_empresa = 3
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 01;


SELECT
    val_fac_ag,
    val_pre_ag,
    val_fac_cu,
    val_pre_cu,
    val_fac_pb,
    val_pre_pb,
    val_fac_zn,
    val_pre_zn,
    val_fac_au,
    val_pre_au,
FROM mae_val_operativo
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND val_ano = 2025
  AND val_per = 11;

  

select * from mae_val_canchas 
INNER JOIN 

select * from trb_cierre_periodo



/*FACTOR RECUPERACION*/
select * from mae_factor_recuperacion WHERE  cod_empresa = 3
  AND cod_empresa_unidad = 01
  AND cie_ano = 2025
  AND cie_per = 11;
  

select * from mae_val_canchas WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND val_ano = 2025
  AND val_per = 01;


SELECT 
    cod_empresa,
    cie_ano,
    cie_per,
    val_tms,
    val_ag,
    val_cu,
    val_pb,
    val_zn,
    usu_creo,
    fec_creo,
    usu_modi,
    fec_modi,
    val_vpt,
    cod_empresa_unidad
FROM mae_val_canchas
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND val_ano = 2025
  AND val_per = 01;

SELECT * FROM mae_factor



/* ESTANDAR AVANCE */
SELECT * FROM mae_tip_lab_estandar
cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND val_ano = 2025
  AND val_per = 01;

EXEC sp_IR_obtener_meses 10,2006


sp_IR_obtener_meses 2025

CREATE PROCEDURE sp_IR_obtener_meses
@anio VARCHAR(4)
AS
BEGIN
    SET NOCOUNT ON;
	select distinct cie_ano, cie_per from trb_cierre_periodo where cie_ano = @anio order by cie_per ASC
END


select distinct cie_ano from trb_cierre_periodo


CREATE PROCEDURE sp_IR_obtener_meses
@anio VARCHAR(4)
AS
BEGIN
    SET NOCOUNT ON;
	select distinct cie_ano, cie_per from trb_cierre_periodo where cie_ano = @anio order by cie_per ASC
END


CREATE PROCEDURE sp_IR_obtener_anio
AS
BEGIN
    SET NOCOUNT ON;
	select distinct cie_ano from trb_cierre_periodo
END


DROP PROC sp_IR_cargar_datos

sp_IR_cargar_datos 10, 2006
 



















-- mae_met_explotacion
SELECT 
    met.cod_metexp,
    per.nom_metexp,
    per.ind_calculo_dilucion,
    per.ind_calculo_leyes_min,
    per.ind_act
    
FROM mae_met_explotacion met 
INNER JOIN 
mae_per_met_explotacion per ON
met.cod_metexp = per.cod_metexp
WHERE 
    mpe.cod_empresa = 3
    AND mpe.cod_empresa_unidad = 1
    AND mpe.cie_ano = 2025
    AND mpe.cie_per = 11

select * from mae_per_met_explotacion
   
select  from mae_semana_periodo
    





    SELECT val_fac_rec_ag, val_fac_rec_cu, val_fac_rec_pb, val_fac_rec_zn, val_fac_rec_au, val_des_tipo_fac
    FROM mae_val_operativo_detalle
    WHERE cod_empresa = 3 AND cod_empresa_unidad = 1 AND val_ano = 2025 AND val_per = 11 AND val_des_tipo_fac = 'GENERAL';

    SELECT cod_tiplab, nro_lab_ancho, nro_lab_pieper, nro_lab_broca, nro_lab_barcon,  nro_lab_facpot,  nro_lab_fulmin,  nro_lab_conect,  nro_lab_punmar,  nro_lab_tabla, 
    cie_ano, cie_per
    FROM mae_tip_lab_estandar 
    WHERE cod_empresa = 03 AND cod_empresa_unidad = 01 AND cie_ano = 2006 AND cie_per = 10
    
    
    
    SELECT * FROM dbo

  /* cod_metexp, fac_metexp, ind_calculo_dilucion, ind_calculo_leyes_min, ind_act**/
select * from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'mae_per_met_explotacion'

 SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME = 'cod_metexp';

SELECT 
    fk.name AS FK_Name,
    tp.name AS ParentTable,
    cp.name AS ParentColumn,
    tr.name AS ReferencedTable,
    cr.name AS ReferencedColumn
FROM sys.foreign_keys AS fk
INNER JOIN sys.foreign_key_columns AS fkc 
    ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.tables AS tp 
    ON fkc.parent_object_id = tp.object_id
INNER JOIN sys.columns AS cp 
    ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
INNER JOIN sys.tables AS tr 
    ON fkc.referenced_object_id = tr.object_id
INNER JOIN sys.columns AS cr 
    ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
WHERE cp.name = 'cod_metexp';


select * from mae_met_explotacion
select * from mae_per_met_explotacion
select * from mae_per_met_explotacion

select * from mae_per_met_explotacion
SELECT  
cod_tiplab,
nro_lab_ancho,
nro_lab_altura,
nro_lab_pieper,
nro_lab_broca,
nro_lab_barcon,
nro_lab_barren,
nro_lab_facpot,
nro_lab_fulmin,
nro_lab_conect,
nro_lab_punmar,
nro_lab_tabla
FROM mae_tip_lab_estandar
WHERE mae_tip_lab_estandar.cod_empresa = 03
  AND mae_tip_lab_estandar.cod_empresa_unidad = 01
  AND mae_tip_lab_estandar.cie_ano = 2006
  AND mae_tip_lab_estandar.cie_per = 10;

SELECT 
    mpe.cie_ano,
    mpe.cie_per,
    mpe.cod_metexp,
    mpe.nom_metexp,
    mpe.fac_metexp,
    mpe.ind_act,
    mpe.usu_creo,
    mpe.fec_creo,
    mpe.usu_modi,
    mpe.fec_modi,
    mpe.cod_empresa,
    mpe.cod_empresa_unidad,
    mpe.ind_calculo_dilucion,
    mpe.ind_calculo_leyes_min
FROM mae_per_met_explotacion AS mpe
WHERE 
    mpe.cod_empresa = 03
    AND mpe.cod_empresa_unidad = 01
    AND mpe.cie_ano = 2025
    AND mpe.cie_per = 12;
    
    
    SELECT COLUMN_NAME, TABLE_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME LIKE '%metexp%';

SELECT 
    fk.name AS FK_Name,
    tp.name AS ParentTable,
    cp.name AS ParentColumn,
    tr.name AS ReferencedTable,
    cr.name AS ReferencedColumn
FROM sys.foreign_keys AS fk
INNER JOIN sys.foreign_key_columns AS fkc 
    ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.tables AS tp 
    ON fkc.parent_object_id = tp.object_id
INNER JOIN sys.columns AS cp 
    ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
INNER JOIN sys.tables AS tr 
    ON fkc.referenced_object_id = tr.object_id
INNER JOIN sys.columns AS cr 
    ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
WHERE tp.name = 'mae_met_explotacion';  -- reemplaza con tu tabla

select * from mae_met_explotacion

where 