

select * from trb_cierre_periodo
select * from mae_factor 
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
  AND trb_cier.fec_ini >= '20190601' 
  AND trb_cier.fec_fin < '20190630';


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
    trb_cier.cie_ano = '2019'
  AND 
	trb_cier.cie_per = '06'
  AND 
	trb_cier.fec_ini >= '20190601'
  AND 
	trb_cier.fec_fin < '20190630';


select * from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'trb_cierre_periodo'
