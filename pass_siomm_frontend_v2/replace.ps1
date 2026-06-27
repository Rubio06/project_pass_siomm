$file = "c:\Users\pract_ir.sist.cmc\Desktop\proyecto_pass_siomm\pass_siomm_frontend_v2\src\app\module\planing\opciones-componentes\programa-mensual-labores\pages\edicion-programa-mensual-labores\components\tablas-programa-rendimiento\tablas-explotacion\programa\programa-explotacion.component.html"
$content = Get-Content $file -Raw
$content = $content -replace 'openModal\(\$index\)', 'openModalBlockReser($index)'
Set-Content $file $content
