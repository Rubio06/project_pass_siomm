INSERT INTO trb_cierre_periodo
(
    cod_empresa,
    cod_empresa_unidad,
    cie_ano,
    cie_per,
    fec_ini,
    fec_fin,
    usu_creo,
    fec_creo
)
VALUES
(
    '03',
    '01',
    '2019',
    '12',
    {ts '2019-12-01 00:00:00.000'},
    {ts '2019-12-31 00:00:00.000'},
    'prac_ir.sist.cmc',
    {ts '1900-01-01 00:00:00.000'}
);

select * from trb_cierre_periodo

select * from mae_met_explotacion

select * from mae_per_met_explotacion where cod_metexp = 'LM'

delete from mae_per_met_explotacion where cod_metexp = 'LM'


select * from mae_factor