DROP PROC sp_IR_cargar_datos
CREATE PROCEDURE sp_IR_cargar_datos
        @cod_empresa VARCHAR(4),
            @cod_empresa_unidad VARCHAR(4),
    @month VARCHAR(2),
    @anio VARCHAR(4)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1 Cierre de periodo
    SELECT CP.cie_per, CP.fec_ini, CP.fec_fin, CP.cie_ano
    FROM trb_cierre_periodo AS CP
    WHERE CP.cie_ano = @anio AND CP.cie_per = @month
    ORDER BY CAST(CP.cie_per AS INT);

    -- 2 Factor operativo
    SELECT VALOP.val_fac_ag, VALOP.val_pre_ag, VALOP.val_fac_cu, VALOP.val_pre_cu, 
           VALOP.val_fac_pb, VALOP.val_pre_pb, VALOP.val_fac_zn, VALOP.val_pre_zn, 
           VALOP.val_fac_au, VALOP.val_pre_au
    FROM mae_val_operativo VALOP
    WHERE VALOP.cod_empresa = 3 AND VALOP.cod_empresa_unidad = 1 
      AND VALOP.val_ano = @anio AND VALOP.val_per = @month;

    -- 3 Canchas
    SELECT VLCAN.val_tms, VLCAN.val_ag, VLCAN.val_cu, VLCAN.val_pb, VLCAN.val_zn, VLCAN.val_vpt
    FROM mae_val_canchas AS VLCAN
    WHERE VLCAN.cod_empresa = 3 AND VLCAN.cod_empresa_unidad = 1 
      AND VLCAN.cie_ano = @anio AND VLCAN.cie_per = @month;

    -- 4 Factor sobredilución
    SELECT FS.val_fac_ag, FS.val_fac_cu, FS.val_fac_pb, FS.val_fac_zn, FS.val_fac_au
    FROM mae_factor_sobredilucion AS FS
    WHERE FS.cod_empresa = 3 AND FS.cod_empresa_unidad = 1 
      AND FS.cie_ano = @anio AND FS.cie_per = @month;

    -- 5 Recuperación budget
    SELECT R.val_fac_bud_ag, R.val_fac_bud_cu, R.val_fac_bud_pb, R.val_fac_bud_zn, R.val_fac_bud_au,
           R.val_con_ag, R.val_con_cu, R.val_con_pb, R.val_con_zn, R.val_con_au
    FROM mae_factor_recuperacion AS R
    WHERE R.cod_empresa = 3 AND R.cod_empresa_unidad = 1 
      AND R.cie_ano = @anio AND R.cie_per = @month;

    -- 6 Factor general
    SELECT F.fac_denmin, F.fac_dendes, F.fac_vptmin, F.fac_dialab, F.fac_tarhor,
           F.fac_porcum, F.fac_porhum, F.fac_tms_dif
    FROM mae_factor AS F
    WHERE F.cod_empresa = 3 AND F.cod_empresa_unidad = 1 
      AND F.cie_ano = @anio AND F.cie_per = @month;

    -- 7 Detalle operativo
    SELECT O.val_fac_rec_ag, O.val_fac_rec_cu, O.val_fac_rec_pb, O.val_fac_rec_zn, O.val_fac_rec_au,
           O.val_des_tipo_fac
    FROM mae_val_operativo_detalle AS O
    WHERE O.cod_empresa = 3 AND O.cod_empresa_unidad = 1 
      AND O.val_ano = @anio AND O.val_per = @month 
      AND O.val_des_tipo_fac = 'GENERAL';

    -- 8 Tabs Labor Estándar
    SELECT L.cod_tiplab, L.nro_lab_ancho, L.nro_lab_altura, L.nro_lab_pieper, L.nro_lab_broca,
           L.nro_lab_barcon, L.nro_lab_barren, L.nro_lab_facpot, L.nro_lab_fulmin, L.nro_lab_conect,
           L.nro_lab_punmar, L.nro_lab_tabla
    FROM mae_tip_lab_estandar AS L
    WHERE L.cod_empresa = 3 AND L.cod_empresa_unidad = 1 
      AND L.cie_ano = @anio AND L.cie_per = @month;

    -- 9 Método Minado
    SELECT mpe.cod_metexp AS cod_metexp, mpe.nom_metexp AS nom_metexp,
           mpe.ind_calculo_dilucion AS ind_calculo_dilucion,
           mpe.ind_calculo_leyes_min AS ind_calculo_leyes_min,
           mpe.ind_act AS ind_act
    FROM mae_per_met_explotacion AS mpe
    WHERE mpe.cod_empresa = 3 AND mpe.cod_empresa_unidad = 1
      AND mpe.cie_ano = @anio AND mpe.cie_per = @month;
      
    -- 10 SEMANAS CICLO
	SELECT 
		msp.num_semana AS num_semana,
		msp.fec_ini AS fec_ini,
		msp.fec_fin AS fec_fin,
		msp.desc_semana AS desc_semana
	FROM mae_semana_periodo as msp
	WHERE msp.cod_empresa = 03
	  AND msp.cod_empresa_unidad = 01
	  AND msp.cie_ano = @anio
	  AND msp.cie_per = @month;
	  
	  
	--11 SEMANAS AVANCE 
	SELECT msp.num_semana AS num_semana,
		msp.fec_ini AS fec_ini,
		msp.fec_fin AS fec_fin,
		msp.desc_semana AS desc_semana from mae_semana_avance msp WHERE 
		msp.cod_empresa = 03
		  AND msp.cod_empresa_unidad = 01
		  AND msp.cie_ano = @anio
		  AND msp.cie_per = @month;
		  
SELECT
expl.cod_zona as cod_zona,
expl.lab_pieper as lab_pieper,
expl.lab_broca as lab_broca,
expl.lab_barcon as lab_barcon,
expl.lab_barren as lab_barren,
expl.lab_facpot as  lab_facpot,
expl.lab_fulmin as lab_fulmin,
expl.lab_conect as lab_conect,
expl.lab_punmar as  lab_punmar,
expl.lab_tabla as  lab_tabla,
expl.lab_apr as lab_apr
FROM
    mae_exp_estandar as expl
WHERE
    (expl.cod_empresa = 03)
    AND (expl.cod_empresa_unidad = 01)
    AND (expl.cie_ano = @anio)
    AND (expl.cie_per = @month);

END;


	SELECT * from mae_semana_avance msp WHERE 
		msp.cod_empresa = 03
		  AND msp.cod_empresa_unidad = 01
		  AND msp.cie_ano = 2019
		  AND msp.cie_per = 12;
		  
		  
		  
		  	SELECT 
*
	FROM mae_semana_periodo as msp
	WHERE msp.cod_empresa = 03
	  AND msp.cod_empresa_unidad = 01
	  
	  
	      SELECT *
    FROM mae_per_met_explotacion AS mpe
    WHERE mpe.cod_empresa = 3 AND mpe.cod_empresa_unidad = 1
      AND mpe.cie_ano = 2019 AND mpe.cie_per = 12;
		  
		  
INSERT INTO mae_per_met_explotacion (cod_empresa, cod_empresa_unidad, cie_ano, cie_per, cod_metexp) VALUES('03', '01','2019','12', 'LM')

DELETE mae_per_met_explotacion WHERE cie_ano = '2019' AND cie_per = '12' AND cod_metexp = 'LM'


sp_IR_obtener_anio

sp_helptext 'sp_IR_obtener_anio'


  select distinct cie_ano from trb_cierre_periodo order by cie_ano desc   
  
  select * from  trb_cierre_periodo

SELECT
*
FROM
    mae_exp_estandar as expl
WHERE
    (expl.cod_empresa = 03)
    AND (expl.cod_empresa_unidad = 01)
    AND (expl.cie_ano = 2019)
    AND (expl.cie_per = 12)
    
    DELETE FROM mae_exp_estandar WHERE cod_empresa = '03' AND cod_empresa_unidad = '01' AND cie_ano = '2019' AND cie_per = '12' AND cod_zona = '08'


INSERT INTO mae_exp_estandar (cod_empresa, cod_empresa_unidad, cie_ano, cie_per, cod_zona, lab_pieper, lab_broca) VALUES('03', '01','2019','12', '08', '0.666', '0.67')




    SELECT *
    FROM mae_tip_lab_estandar AS L
    WHERE L.cod_empresa = 3 AND L.cod_empresa_unidad = 1 
      AND L.cie_ano = '2019' AND L.cie_per = '12';
      
      
      select * from mae_exp_estandar
      
      
INSERT INTO mae_tip_lab_estandar (cod_empresa, cod_empresa_unidad, cie_ano, cie_per, cod_tiplab, nro_lab_ancho, nro_lab_altura) VALUES('03', '01','2019','12', 'AFFFF', '0.666', '0.67')


INSERT INTO trb_cierre_periodo
(
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
)
VALUES
(
    '03',
    '01',
    '2019',
    '04',
    '2019-12-01 00:00:00.000',
    '2019-12-31 00:00:00.000',
    'pracl_ir.sist.cmc',
    '2025-12-18 00:00:00.000',
    NULL,
    NULL
);

	SELECT 
		msp.num_semana AS num_semana,
		msp.fec_ini AS fec_ini,
		msp.fec_fin AS fec_fin,
		msp.desc_semana AS desc_semana
	FROM mae_semana_periodo as msp
	WHERE msp.cod_empresa = 03
	  AND msp.cod_empresa_unidad = 01
	  AND msp.cie_ano = '2019'
	  AND msp.cie_per = '04';
	  

SELECT
expl.cod_zona as cod_zona,
expl.lab_pieper as lab_pieper,
expl.lab_broca as lab_broca,
expl.lab_barcon as lab_barcon,
expl.lab_barren as lab_barren,
expl.lab_facpot as  lab_facpot,
expl.lab_fulmin as lab_fulmin,
expl.lab_conect as lab_conect,
expl.lab_punmar as  lab_punmar,
expl.lab_tabla as  lab_tabla,
expl.lab_apr as lab_apr
FROM
    mae_exp_estandar as expl
WHERE
    (expl.cod_empresa = 03)
    AND (expl.cod_empresa_unidad = 01)
    AND (expl.cie_ano = '2019')
    AND (expl.cie_per = '04');




select * From trb_cierre_periodo

delete from trb_cierre_periodo 
where cod_empresa = '03' AND cod_empresa_unidad = '01' AND cie_per = '04' and usu_creo = 'pracl_ir.sist.cmc'
