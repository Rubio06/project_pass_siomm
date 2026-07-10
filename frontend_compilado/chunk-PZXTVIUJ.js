import{a as Ae}from"./chunk-XMODREQK.js";import{a as De}from"./chunk-5N3PFXQ7.js";import{a as Le}from"./chunk-Z42AMIGG.js";import"./chunk-ZCCOQAGF.js";import{d as j,e as R}from"./chunk-PAU5VROV.js";import"./chunk-3JFW3XDG.js";import{b as V}from"./chunk-ZVS7UMPK.js";import{b as be,c as Z,d as fe,e as ve,f as he,g as xe,i as ye,l as Ce,m as Me,n as Pe,o as Se,s as Ee,u as Fe}from"./chunk-LFXRGZ7U.js";import"./chunk-RU7CWZTC.js";import{b as te,f as ne,r as de,s as pe,u as ue,v as ge,w as _e}from"./chunk-DEX52Z4I.js";import{$ as N,Bb as A,Db as se,Eb as le,Fb as me,Ia as b,Mb as v,Nb as T,Ob as ee,T as F,Ub as U,Xa as B,Y as K,Z as X,_ as L,fb as ce,fc as re,ga as S,gb as $,hb as k,ib as I,kb as w,lb as O,mb as E,nb as m,ob as s,pb as y,vb as W,zb as z}from"./chunk-JCITW7CP.js";import{a as q,b as J}from"./chunk-55GY6K5S.js";var H=i=>({"opacity-60 cursor-not-allowed":i});function Be(i,e){i&1&&(m(0,"option",5),v(1,"== Elija una Und. Econ\xF3mica =="),s())}function Ue(i,e){if(i&1&&(m(0,"option",6),v(1),s()),i&2){let o=e.$implicit;E("value",o.cod_und_econom),b(),T(o.nom_und_econom)}}function Ve(i,e){if(i&1&&(m(0,"div",7)(1,"b"),v(2),s()()),i&2){let o,n=A();b(2),T(n.formUtil.getFieldError((o=n.programaForm.get("cod_und_econom"))==null?null:o.errors))}}function je(i,e){i&1&&(m(0,"option",5),v(1,"== Elija una Contrata =="),s())}function Ge(i,e){if(i&1&&(m(0,"option",6),v(1),s()),i&2){let o=e.$implicit;E("value",o.cod_contrata),b(),T(o.des_contrata)}}function qe(i,e){if(i&1&&(m(0,"div",7)(1,"b"),v(2),s()()),i&2){let o,n=A();b(2),T(n.formUtil.getFieldError((o=n.programaForm.get("cod_contrata"))==null?null:o.errors))}}function Ze(i,e){i&1&&(m(0,"option",5),v(1,"== Elija una Zona =="),s())}function He(i,e){if(i&1&&(m(0,"option",6),v(1),s()),i&2){let o=e.$implicit;E("value",o.cod_zona),b(),T(o.des_zona)}}function Qe(i,e){if(i&1&&(m(0,"div",7)(1,"b"),v(2),s()()),i&2){let o,n=A();b(2),T(n.formUtil.getFieldError((o=n.programaForm.get("cod_zona"))==null?null:o.errors))}}function Ye(i,e){if(i&1&&(m(0,"div",7)(1,"b"),v(2),s()()),i&2){let o,n=A();b(2),T(n.formUtil.getFieldError((o=n.programaForm.get("prg_cutoff"))==null?null:o.errors))}}var Q=class i{programaState=F(R);fb=F(Ee);botonAccionService=F(j);formUtil=V;programaForm;unidadesEcon=S([]);zonas=S([]);contrata=S([]);datosFormulario=re();detallePrg=S([]);modoActual=S("");ultimoNroProg=S("");modo=S(null);ngOnInit(){this.initForm(),this.modo.set(this.programaState.getModo()),this.obtenerInfoMaestro(),this.modo()!=="nuevo"&&this.programaState.programa().nro_prog&&this.infoProgMensual(),this.aplicarModo(),this.programaForm.valueChanges.subscribe(()=>{if(this.botonAccionService.formularioCabValido.set(this.programaForm.valid),this.programaForm.invalid)return;let e=this.onSudmit();this.programaState.setCabecera(e)}),this.programaForm.get("prg_cutoff")?.valueChanges.subscribe(e=>{this.programaState.setCutoff(e)})}initForm(){this.programaForm=this.fb.group({cod_und_econom:["",Z.required],cod_contrata:["",Z.required],cod_zona:["",Z.required],prg_cutoff:["",Z.required],nro_prog:[""],cie_ano:[""],cie_per:[""],fec_emi:[""],prg_est:[""],ind_calc_dil:[null]})}aplicarModo(){if(this.modo()==="nuevo"){let e=this.programaState.programa().cie_ano,o=this.programaState.programa().cie_per;this.programaForm.enable(),this.programaForm.get("nro_prog")?.disable(),this.programaForm.get("cie_ano")?.disable(),this.programaForm.get("cie_per")?.disable(),this.programaForm.get("fec_emi")?.disable(),this.programaForm.get("prg_est")?.disable(),this.programaForm.patchValue({cie_ano:e,cie_per:o,fec_emi:this.formUtil.formatDate(new Date),prg_est:this.transformarEstado("G")}),this.crearNorProg()}else this.modo()==="ver"&&(this.programaForm.disable(),this.programaForm.get("prg_cutoff")?.enable())}crearNorProg(){this.programaState.crearNorProg().subscribe({next:e=>{this.ultimoNroProg.set(e),this.programaForm.patchValue({nro_prog:e})},error:e=>console.log(e)})}cargarFormulario(e){let o=this.cutoffFormateado(e.prg_cutoff?.toString()??null),n=e.ind_calc_dil;this.programaForm.patchValue({cod_und_econom:e.cod_und_econom,cod_contrata:e.cod_contrata,cod_zona:e.cod_zona,prg_cutoff:o,nro_prog:e.nro_prog,cie_ano:e.cie_ano,cie_per:e.cie_per,fec_emi:this.formUtil.formatDate(e.fec_emi),prg_est:this.transformarEstado(e.prg_est),ind_calc_dil:"C"}),this.actualizarPrgCutoff(Number(o)),this.actualizarIndCalcDil(!!n)}infoProgMensual(){let e=this.programaState.programa().nro_prog;this.programaState.infoProgMensual(e).subscribe({next:o=>{o.length>0&&(this.detallePrg.set(o),this.cargarFormulario(o[0]))},error:o=>console.log(o)})}transformarEstado(e){return{G:"Generado",A:"Anulado",B:"Aprobado"}[e??""]??""}cutoffFormateado(e){return e!=null?Number(e).toFixed(2):""}obtenerInfoMaestro(){this.programaState.obtenerInfoMaestro().subscribe({next:e=>{this.unidadesEcon.set(e.listaUndEcon),this.zonas.set(e.listaZona),this.contrata.set(e.listContrata)},error:e=>console.log(e)})}actualizarPrgCutoff(e){this.detallePrg.set(this.detallePrg().map(o=>J(q({},o),{prg_cutoff:e})))}actualizarIndCalcDil(e){this.detallePrg().forEach((o,n)=>{o.ind_calc_dil=e,this.calculoFila(o,n)})}calculoFila(e,o){let n=e.facAg??0,l=e.facCu??0,d=e.facPb??0,p=e.facZn??0,g=e.facAu??0,_=e.densidadMineral??2.7,M=e.densidadDesmonte??2,P=e.vptMin??100,Y=this.calcularAnchoMinado(e.tipoCalculoDilucion,e.metodoCalculoDilucion,e.prgAncvet??0,e.numBuzamiento??0,e.variableOhara??0);e.prgAncmin=Y.anchoMinado,e.prgPorDilucion=Y.porDilucion,e.prgAncDil=Y.anchoDil;let G=e.prgLeyAg*n+e.prgLeyCu*l+e.prgLeyPb*d+e.prgLeyZn*p+e.prgLeyAu*g;if(e.prgVptMin=G,G>=P?(e.prgTmsRotVet=Math.round((e.prgAltcor??0)*(e.prgNumTraminProg??0)*(e.prgAncvet??0)*_),e.prgTmsRotDil=Math.round((e.prgAltcor??0)*(e.prgNumTraminProg??0)*((e.prgAncmin??0)-(e.prgAncvet??0))*M)):(e.prgTmsRotVet=0,e.prgTmsRotDil=0),e.prgTmsExtraid=e.prgTmsRotVet+e.prgTmsRotDil,e.ind_calc_dil){let x=e.prgAncmin??1,C=e.prgAncvet??1;x>0?(e.prgLeyAgDil=+(C*e.prgLeyAg/x).toFixed(2),e.prgLeyCuDil=+(C*e.prgLeyCu/x).toFixed(2),e.prgLeyPbDil=+(C*e.prgLeyPb/x).toFixed(2),e.prgLeyZnDil=+(C*e.prgLeyZn/x).toFixed(2),e.prgLeyAuDil=+(C*e.prgLeyAu/x).toFixed(2),e.prgVptDil=e.prgLeyAgDil*n+e.prgLeyCuDil*l+e.prgLeyPbDil*d+e.prgLeyZnDil*p+e.prgLeyAuDil*g):(e.prgLeyAgDil=e.prgLeyAg,e.prgLeyCuDil=e.prgLeyCu,e.prgLeyPbDil=e.prgLeyPb,e.prgLeyZnDil=e.prgLeyZn,e.prgLeyAuDil=e.prgLeyAu,e.prgVptDil=G)}else e.prgLeyAgDil=e.prgLeyAg,e.prgLeyCuDil=e.prgLeyCu,e.prgLeyPbDil=e.prgLeyPb,e.prgLeyZnDil=e.prgLeyZn,e.prgLeyAuDil=e.prgLeyAu,e.prgVptDil=G;let D=[...this.detallePrg()];D[o]=q({},e),this.detallePrg.set(D)}calcularAnchoMinado(e,o,n,l,d){let p=0,g=0,_=0;switch(e){case"A":case"M":o==="O"?(l<45?p=d/(Math.sqrt(n)*Math.sin((90-l)*Math.PI/180)):p=d/(Math.sqrt(n)*Math.cos((90-l)*Math.PI/180)),p=p/100,g=+(n*p/(1-p)).toFixed(2),n>1.5?_=+(n+g).toFixed(2):_=1.5):o==="C"&&e==="A"&&(n<=.5?_=.8:n<=.8?_=n+.3:n<=1?_=n*1.15:n<=1.2?_=n*1.1:_=n);break}return console.log("los tres datos "+_,p,g),{anchoMinado:_,porDilucion:p,anchoDil:g}}transformarEstadoInvertido(e){return{Generado:"G",Anulado:"A",Aprobado:"B"}[e??""]??""}onSudmit(){let e=sessionStorage.getItem("username"),o=this.programaForm.getRawValue();return o.nro_prog=o.nro_prog.toString(),o.ind_calc_dil=o.ind_calc_dil??"C",o.prg_est=this.transformarEstadoInvertido(o.prg_est),o.cod_usuario_creo=e??"desconocido",o.fec_emi=new Date().toISOString(),o}static \u0275fac=function(o){return new(o||i)};static \u0275cmp=B({type:i,selectors:[["app-formulario-programa-mensual"]],outputs:{datosFormulario:"datosFormulario"},decls:61,vars:25,consts:[[3,"ngSubmit","formGroup"],[1,"flex","flex-wrap","gap-4","mb-4","mt-4","px-5"],[1,"flex","flex-col","flex-1","min-w-[200px]"],[2,"font-size","13px"],["formControlName","cod_und_econom",1,"select-base_dos","w-full"],["value","","disabled","","selected",""],[3,"value"],[1,"text-[#A6200A]","text-xs"],[1,"flex","flex-col","flex-1","min-w-[300px]"],["formControlName","cod_contrata",1,"select-base_dos","w-full"],[1,"flex","flex-col","flex-1","min-w-[180px]"],["formControlName","cod_zona",1,"select-base_dos","w-full"],[1,"flex","flex-col","flex-1","min-w-[100px]"],["type","number","formControlName","prg_cutoff",1,"input-base","w-full"],[1,"flex","flex-wrap","gap-4","px-5"],["type","text","formControlName","nro_prog",1,"input-base","w-full",3,"ngClass"],[1,"flex","flex-col","flex-1","min-w-[120px]"],["type","text","formControlName","cie_ano",1,"input-base","w-full",3,"ngClass"],["type","text","formControlName","cie_per",1,"input-base","w-full",3,"ngClass"],[1,"flex","flex-col","flex-1","min-w-40"],["type","text","formControlName","fec_emi",1,"input-base","w-full",3,"disabled","ngClass"],["type","text","formControlName","prg_est",1,"input-base","w-full",3,"disabled","ngClass"]],template:function(o,n){if(o&1&&(m(0,"form",0),z("ngSubmit",function(){return n.onSudmit()}),m(1,"div",1)(2,"div",2)(3,"label",3)(4,"b"),v(5,"Unidad Econ\xF3mica:"),s()(),m(6,"select",4),$(7,Be,2,0,"option",5),w(8,Ue,2,2,"option",6,I),s(),$(10,Ve,3,1,"div",7),s(),m(11,"div",8)(12,"label",3)(13,"b"),v(14,"Contrata:"),s()(),m(15,"select",9),$(16,je,2,0,"option",5),w(17,Ge,2,2,"option",6,I),s(),$(19,qe,3,1,"div",7),s(),m(20,"div",10)(21,"label",3)(22,"b"),v(23,"Zona:"),s()(),m(24,"select",11),$(25,Ze,2,0,"option",5),w(26,He,2,2,"option",6,I),s(),$(28,Qe,3,1,"div",7),s(),m(29,"div",12)(30,"label",3)(31,"b"),v(32,"Cut Off:"),s()(),y(33,"input",13),$(34,Ye,3,1,"div",7),s()(),m(35,"div",14)(36,"div",10)(37,"label",3)(38,"b"),v(39,"Nro. Programa:"),s()(),y(40,"input",15),s(),m(41,"div",16)(42,"label",3)(43,"b"),v(44,"A\xF1o:"),s()(),y(45,"input",17),s(),m(46,"div",16)(47,"label",3)(48,"b"),v(49,"Mes:"),s()(),y(50,"input",18),s(),m(51,"div",19)(52,"label",3)(53,"b"),v(54,"Fecha Emisi\xF3n:"),s()(),y(55,"input",20),s(),m(56,"div",16)(57,"label",3)(58,"b"),v(59,"Estado:"),s()(),y(60,"input",21),s()()()),o&2){let l,d,p,g;E("formGroup",n.programaForm),b(7),k(n.modo()==="nuevo"?7:-1),b(),O(n.unidadesEcon()),b(2),k((l=n.programaForm.get("cod_und_econom"))!=null&&l.errors&&((l=n.programaForm.get("cod_und_econom"))!=null&&l.touched)?10:-1),b(6),k(n.modo()==="nuevo"?16:-1),b(),O(n.contrata()),b(2),k((d=n.programaForm.get("cod_contrata"))!=null&&d.errors&&((d=n.programaForm.get("cod_contrata"))!=null&&d.touched)?19:-1),b(6),k(n.modo()==="nuevo"?25:-1),b(),O(n.zonas()),b(2),k((p=n.programaForm.get("cod_zona"))!=null&&p.errors&&((p=n.programaForm.get("cod_zona"))!=null&&p.touched)?28:-1),b(6),k((g=n.programaForm.get("cod_zona"))!=null&&g.errors&&((g=n.programaForm.get("prg_cutoff"))!=null&&g.touched)?34:-1),b(6),E("ngClass",U(15,H,n.modo()==="ver"||n.modo()==="nuevo")),b(5),E("ngClass",U(17,H,n.modo()==="ver"||n.modo()==="nuevo")),b(5),E("ngClass",U(19,H,n.modo()==="ver"||n.modo()==="nuevo")),b(5),E("disabled",n.modo()==="nuevo")("ngClass",U(21,H,n.modo()==="ver"||n.modo()==="nuevo")),b(5),E("disabled",n.modo()==="nuevo")("ngClass",U(23,H,n.modo()==="ver"||n.modo()==="nuevo"))}},dependencies:[Fe,he,Pe,Se,be,xe,Me,fe,ve,ye,Ce,ne,te],encapsulation:2})};var $e={exploracion:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",desarrollo:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",preparacion:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",explotacion:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"};function Je(i,e){if(i&1){let o=W();m(0,"li",17),z("click",function(){let l=K(o).$implicit,d=A();return X(d.onFaseClick(l.cod_fase))}),L(),m(1,"svg",18),y(2,"path"),s(),v(3),s()}if(i&2){let o=e.$implicit,n=A();E("routerLink",o.path),b(2),ce("d",n.iconos[o.icono]),b(),ee(" ",o.title," ")}}var oe=class i{iconos=$e;listaFases=S([]);edicionProgrmaMensualService=F(R);codFaseSelected=re();ngOnInit(){this.mostrarMaeFase()}mostrarMaeFase(){this.edicionProgrmaMensualService.mostrarMaeFase().subscribe({next:e=>{let o=e.map(n=>{let l=n.cod_fase?.trim()??"",d=n.nom_fase?.trim().toLowerCase()??"";return{path:`edicion-${d}`,title:`${l} - ${d.toUpperCase()}`,icono:d,cod_fase:l}});this.listaFases.set(o)},error:e=>console.error("Error cargando fases:",e)})}programaState=F(R);onFaseClick(e){this.codFaseSelected.emit(e),this.programaState.setCodFase(e)}static \u0275fac=function(o){return new(o||i)};static \u0275cmp=B({type:i,selectors:[["app-slider-programa-mensual"]],outputs:{codFaseSelected:"codFaseSelected"},decls:27,vars:0,consts:[[1,"p-4","text-sm"],["open","",1,"group"],[1,"flex","items-center","justify-between","cursor-pointer","list-none","font-bold","text-[#013B5C]","hover:bg-blue-50","p-2","rounded-lg","transition-colors","duration-300"],[1,"flex","items-center","gap-2","select-none"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke","currentColor",1,"w-5","h-5","text-[#013B5C]"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"],[1,"select-none"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke","currentColor",1,"w-4","h-4","transition-transform","duration-300","group-open:rotate-180"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","3","d","M19 9l-7 7-7-7"],[1,"overflow-hidden","transform"],[1,"ml-4","mt-0.5","space-y-2","border-l-2","border-blue-200","pl-4","py-1","select-none"],["routerLinkActive","tab-active",1,"flex","items-center","gap-2","text-gray-600","hover:text-[#013B5C]","cursor-pointer","transition-colors","font-medium","p-0.5","rounded",3,"routerLink"],[1,"group","mt-3"],[1,"flex","items-center","justify-between","cursor-pointer","list-none","text-[#013B5C]","hover:bg-blue-50","p-2","rounded-lg","transition-colors","duration-300"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"],[1,"overflow-hidden","transition-all","duration-500","max-h-0","group-open:max-h-40"],[1,"p-4","text-gray-500","italic"],["routerLinkActive","tab-active",1,"flex","items-center","gap-2","text-gray-600","hover:text-[#013B5C]","cursor-pointer","transition-colors","font-medium","p-0.5","rounded",3,"click","routerLink"],["xmlns","http://www.w3.org/2000/svg","fill","none","stroke-width","2","viewBox","0 0 24 24","stroke","currentColor",1,"w-4","h-4"]],template:function(o,n){o&1&&(m(0,"div",0)(1,"details",1)(2,"summary",2)(3,"div",3),L(),m(4,"svg",4),y(5,"path",5),s(),N(),m(6,"span",6),v(7,"FASE MINADO"),s()(),L(),m(8,"svg",7),y(9,"path",8),s()(),N(),m(10,"div",9)(11,"ul",10),w(12,Je,4,3,"li",11,I),s()()(),m(14,"details",12)(15,"summary",13)(16,"div",3),L(),m(17,"svg",4),y(18,"path",14),s(),N(),m(19,"span",6)(20,"b"),v(21,"INVERSION"),s()()(),L(),m(22,"svg",7),y(23,"path",8),s()(),N(),m(24,"div",15)(25,"div",16),v(26," Contenido de inversi\xF3n... "),s()()()()),o&2&&(b(12),O(n.listaFases()))},dependencies:[_e,ge],styles:['.tab-style[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;font-size:.875rem;font-weight:500;color:theme("colors.gray.600");border-radius:.5rem;border:1px solid theme("colors.gray.200");background-color:theme("colors.white");transition:all .2s ease;text-align:center;text-wrap:nowrap}.tab-style[_ngcontent-%COMP%]:hover{background-color:theme("colors.blue.50");color:theme("colors.gray.800");border-color:theme("colors.gray.300")}.tab-active[_ngcontent-%COMP%]{color:theme("colors.white");background-color:#013b5c;border-color:#013b5c;box-shadow:theme("boxShadow.md");transform:translateY(-2px);color:#fff}.tab-active[_ngcontent-%COMP%]:hover{background-color:#002b48;color:theme("colors.white");border-color:#002b48}']})};function Ke(i,e){if(i&1){let o=W();m(0,"app-botones",22),z("accion",function(){let l=K(o).$implicit,d=A();return X(d.onAccion(l.accion))}),s()}if(i&2){let o=e.$implicit;E("texto",o.texto)("color",o.color)("icono",o.icono)("bloqueo",o.bloqueo??!1)}}var ae=class i{botonAccionService=F(j);botones=this.botonAccionService.botones;botoPresionado=S("");botoColor=S("");showModalLabores=S(!1);arregloaDatos=S([]);formUtils=V;router=F(ue);route=F(de);programaState=F(R);codFase=null;formCabProgam;formProgDetalle;ultimoNroProg=S("");ngOnDestroy(){this.programaState.limpiarTodosDatosFases(),this.botonAccionService.getFormulario()?.get("labores")?.clear()}ngOnInit(){this.botonAccionService.resetBotones(),this.route.paramMap.subscribe(e=>{let o=e.get("nro_prog"),n={nro_prog:o==="nuevo"?null:o,cie_ano:e.get("cie_ano"),cie_per:e.get("cie_per")};this.programaState.setPrograma(n),o==="nuevo"?this.botonAccionService.setBloqueos({guardar:!0,labores:!0,cerrar:!1}):this.botonAccionService.setBloqueos({guardar:!0,copiar:!0,resumen:!1,exportar:!1,cerrar:!1,labores:!0})})}onFaseClick(e){this.codFase=e,this.programaState.setPrograma({nro_prog:this.programaState.programa().nro_prog||null,cie_ano:this.programaState.programa().cie_ano,cie_per:this.programaState.programa().cie_per})}crearNorProg(){this.programaState.crearNorProg().subscribe({next:e=>{this.ultimoNroProg.set(e)},error:e=>console.log(e)})}onAccion(e){switch(e){case"nuevo":this.onNuevo();break;case"guardar":this.onGuardar();break;case"eliminar":this.onEliminar();break;case"copiar":this.onCopiarLabor();break;case"resumen":this.onResumen();break;case"importar":this.onImportar();break;case"exportar":this.onExportar();break;case"labores":this.onLabores();break;case"cerrar":this.onCerrar();break;default:console.warn("Acci\xF3n no reconocida:",e)}}infoProgMensual(){let e=this.programaState.programa().nro_prog;this.programaState.infoProgMensual(e).subscribe({next:o=>{if(!o.length)return;if(o[0].prg_est==="B"){alert("La labor seleccionada es una labor programada y el programa se encuentra aprobado.");return}},error:o=>console.log(o)})}setBoton(e,o){this.botoPresionado.set(`Usted se encuentra en el modo ${e}`),this.botoColor.set(o)}onNuevo(){this.programaState.setModo("nuevo"),this.setBoton("Nuevo","bg-[#047857]")}onGuardar(){if(this.setBoton("Guardar","bg-[#033351]"),this.formCabProgam.programaForm.invalid){this.formCabProgam.programaForm.markAllAsTouched(),this.formUtils.alertaNoPermitido("Datos de Cabecera","Por favor, complete los campos obligatorios de la cabecera.");return}let e=this.botonAccionService.getFormulario();if(!e)return;if(this.validarFilasIncompletas(e)){this.formUtils.alertaNoPermitido("Filas Incompletas","Existen campos vac\xEDos en la tabla de labores.");return}let o=this.formCabProgam.onSudmit(),n=this.programaState.codFase()||"01",l=e.getRawValue();l.labores?.length>0&&this.programaState.guardarDatosFase(n,l.labores);let d=this.procesarLaboresGlobales();if(d.length===0){this.formUtils.alertaNoPermitido("Sin Datos","No hay nuevas labores para guardar.");return}let p={cabecera:o,detalle:d};this.confirmarYGuardar(p)}validarFilasIncompletas(e){let n=e.get("labores").controls.map((d,p)=>d.invalid?(d.markAllAsTouched(),p):-1).filter(d=>d!==-1),l=this.programaState.codFase();return l&&this.programaState.guardarErroresFase(l,n),n.length>0}procesarLaboresGlobales(){let e=[];return this.programaState.obtenerTodasLasFases().forEach((o,n)=>{o.filter(l=>l.isNew===!0).forEach(l=>{e.push(J(q({},l),{cod_fase:n,prg_progra:"N",ind_taladro_largo:l.ind_taladro_largo??"N",ind_verificacion:l.ind_verificacion?null:"S",cod_veta:this.limpiarCodigoVeta(l.cod_veta)}))})}),e}limpiarCodigoVeta(e){return e?.includes(" - ")?e.split(" - ").pop():e}confirmarYGuardar(e){this.formUtils.confirmarAnulacion("Ingresar Programa","<b>\xBFDesea agregar un programa nuevo?</b> <br>Los registros se almacenar\xE1n en la base de datos.","Si, Insertar Datos","No Insertar").then(n=>{n.isConfirmed&&this.programaState.insertarCabDeta(e).subscribe({next:l=>{l.estado===1&&(this.finalizarGuardado(l.mensaje),this.botonAccionService.setBloqueos({guardar:!0,copiar:!0,resumen:!1,exportar:!1,cerrar:!1,labores:!0}))},error:l=>console.error("Error al guardar programa:",l)})})}finalizarGuardado(e){this.formUtils.alertaExitoAnulacion("Creaci\xF3n de Programa",e),this.programaState.setModo("ver"),this.setBoton("Ver","bg-[#475569]"),this.programaState.limpiarTodosDatosFases(),this.programaState.triggerRecargar(),this.crearNorProg(),this.botonAccionService.setBloqueos({guardar:!0,copiar:!0,resumen:!1,exportar:!1,cerrar:!1,labores:!0})}onEliminar(){this.setBoton("Eliminar","bg-[#9f1239]")}onCopiarLabor(){this.setBoton("Copiar Labor","bg-[#5b21b6]");let e=this.botonAccionService.laborCopiada();this.botonAccionService.setBloqueos({guardar:!0,copiar:!1,resumen:!0,exportar:!0,cerrar:!1,labores:!0}),this.formUtils.confirmarAnulacion("Copiar Labores","<b>\xBFDesea Copiar La labor?</b> <br>Se procedera almacenar en la BD.","Si, copiar datos","No Copiar").then(o=>{o.isConfirmed&&this.programaState.copiarLabor(e).subscribe({next:n=>{n.estado===1&&(this.formUtils.alertaExitoAnulacion("Creacion de Programa Mensual",n.mensaje),this.crearNorProg(),this.botonAccionService.laborCopiada.set({cod_ala:""}),this.botonAccionService.setBloqueos({guardar:!0,copiar:!0,resumen:!1,exportar:!1,cerrar:!1,labores:!0}),this.programaState.triggerRecargar())},error:n=>console.log(n)})})}onResumen(){this.setBoton("Resumen","bg-[#92400e]");let e=this.formCabProgam.onSudmit(),o=this.programaState.codFase()||"01",n={cod_empresa:"03",cod_empresa_unidad:"01",nro_prog:e.nro_prog,cod_fase:o};this.programaState.getResumenPrograma(n).subscribe({next:l=>{this.abrirVentanaImpresion(l)},error:()=>{}})}abrirVentanaImpresion(e){let o=e.cabecera,n=e.detalle,l=new Date().toLocaleString("es-PE"),d={"01":"ENERO","02":"FEBRERO","03":"MARZO","04":"ABRIL","05":"MAYO","06":"JUNIO","07":"JULIO","08":"AGOSTO","09":"SETIEMBRE",10:"OCTUBRE",11:"NOVIEMBRE",12:"DICIEMBRE"},p=n.reduce((r,t)=>({prg_avamts:r.prg_avamts+(t.prg_avamts??0),prg_ancmin:r.prg_ancmin+(t.prg_ancmin??0),prg_ancvet:r.prg_ancvet+(t.prg_ancvet??0),prg_ancdil:r.prg_ancdil+(t.prg_ancdil??0),prg_tmsmin:r.prg_tmsmin+(t.prg_tmsmin??0),prg_leyau:r.prg_leyau+(t.prg_leyau??0),prg_leyaudil:r.prg_leyaudil+(t.prg_leyaudil??0),prg_vptmin:r.prg_vptmin+(t.prg_vptmin??0),prg_vptdil:r.prg_vptdil+(t.prg_vptdil??0),dif_cutoff:r.dif_cutoff+(t.dif_cutoff??0),prg_homlab:r.prg_homlab+(t.prg_homlab??0),prg_tareas:r.prg_tareas+(t.prg_tareas??0),prg_nroper:r.prg_nroper+(t.prg_nroper??0)}),{prg_avamts:0,prg_ancmin:0,prg_ancvet:0,prg_ancdil:0,prg_tmsmin:0,prg_leyau:0,prg_leyaudil:0,prg_vptmin:0,prg_vptdil:0,dif_cutoff:0,prg_homlab:0,prg_tareas:0,prg_nroper:0}),g=r=>(r.prg_vptmin??0)>=(r.fac_vptmin??0)?(r.prg_loncor??0)*(r.prg_altcor??0):0,_=r=>(r.prg_tmsextraid??0)>0?1:0,M=r=>(r.prg_vptmin??0)>=(r.val_vpt??0)?1:0,P=r=>(r.prg_vptmin??0)>=(r.fac_vptmin??0)&&(r.prg_vptmin??0)<(r.val_vpt??0)?1:0,Y=r=>(r.prg_vptdil??0)>=(r.val_vpt??0)?1:0,G=r=>(r.prg_vptdil??0)>=(r.fac_vptmin??0)&&(r.prg_vptdil??0)<(r.val_vpt??0)?1:0,D={count:n.filter(r=>r.prg_progra==="S").length,prg_avamts:n.reduce((r,t)=>r+(t.prg_avamts??0),0),anchoMinado:(()=>{let r=n.reduce((a,c)=>a+g(c),0);return r===0?0:n.reduce((a,c)=>{let f=g(c),Te=_(c);return a+((c.prg_ancvet??0)+(c.prg_ancdil??0))*f*Te},0)/r})(),prg_ancvet:(()=>{let r=n.reduce((t,a)=>t+g(a),0);return r===0?0:n.reduce((t,a)=>t+(a.prg_ancvet??0)*g(a)*_(a),0)/r})(),prg_ancdil:(()=>{let r=n.reduce((t,a)=>t+g(a),0);return r===0?0:n.reduce((t,a)=>t+(a.prg_ancdil??0)*g(a)*_(a),0)/r})(),prg_loncor:n.reduce((r,t)=>r+(t.prg_loncor??0)*_(t),0),prg_altcor:(()=>{let r=n.reduce((t,a)=>t+g(a),0);return r===0?0:n.reduce((t,a)=>t+(a.prg_altcor??0)*g(a),0)/r})(),prg_tmsrotvet:n.reduce((r,t)=>r+(t.prg_tmsrotvet??0)*_(t),0),prg_tmsrotdil:n.reduce((r,t)=>r+(t.prg_tmsrotdil??0)*_(t),0),prg_tmsextraid:n.reduce((r,t)=>r+(t.prg_tmsextraid??0),0),prg_leyau:(()=>{let r=n.reduce((t,a)=>t+(a.prg_tmsextraid??0),0);return r>0?n.reduce((t,a)=>t+(a.prg_leyau??0)*(a.prg_tmsextraid??0),0)/r:0})(),prg_leycu:(()=>{let r=n.reduce((t,a)=>t+(a.prg_tmsextraid??0),0);return r>0?n.reduce((t,a)=>t+(a.prg_leycu??0)*(a.prg_tmsextraid??0),0)/r:0})(),prg_leypb:(()=>{let r=n.reduce((t,a)=>t+(a.prg_tmsextraid??0),0);return r>0?n.reduce((t,a)=>t+(a.prg_leypb??0)*(a.prg_tmsextraid??0),0)/r:0})(),prg_leyzn:(()=>{let r=n.reduce((t,a)=>t+(a.prg_tmsextraid??0),0);return r>0?n.reduce((t,a)=>t+(a.prg_leyzn??0)*(a.prg_tmsextraid??0),0)/r:0})(),prg_vptmin:(()=>{let r=n.reduce((a,c)=>a+(c.prg_tmsextraid??0),0);return n.reduce((a,c)=>a+g(c),0)>0&&r>0?n.reduce((a,c)=>a+(c.prg_vptmin??0)*(c.prg_tmsextraid??0),0)/r:0})(),dif_cutoff:n.reduce((r,t)=>r+(t.dif_cutoff??0),0),prg_homlab:n.reduce((r,t)=>r+(t.prg_homlab??0),0)},x={count:n.filter(r=>M(r)>0).length,prg_avamts:n.reduce((r,t)=>r+(t.prg_avamts??0)*M(t),0),prg_loncor:n.reduce((r,t)=>r+(t.prg_loncor??0)*_(t)*M(t),0),prg_altcor:(()=>{let r=n.reduce((t,a)=>t+g(a),0);return r===0?0:n.reduce((t,a)=>t+(a.prg_altcor??0)*g(a)*M(a),0)/r})(),prg_tmsrotvet:n.reduce((r,t)=>r+(t.prg_tmsrotvet??0)*_(t)*M(t),0),prg_tmsrotdil:n.reduce((r,t)=>r+(t.prg_tmsrotdil??0)*_(t)*M(t),0),prg_tmsextraid:n.reduce((r,t)=>r+(t.prg_tmsextraid??0)*M(t),0),anchoMinado:(()=>{let r=0,t=0;for(let a of n){let c=g(a)*_(a)*M(a);t+=c,r+=((a.prg_ancvet??0)+(a.prg_ancdil??0))*c}return t>0?r/t:0})(),prg_leyau:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*M(a)*c;t+=f,r+=(a.prg_leyau??0)*f}return t>0?r/t:0})(),prg_leycu:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*M(a)*c;t+=f,r+=(a.prg_leycu??0)*f}return t>0?r/t:0})(),prg_leypb:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*M(a)*c;t+=f,r+=(a.prg_leypb??0)*f}return t>0?r/t:0})(),prg_leyzn:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*M(a)*c;t+=f,r+=(a.prg_leyzn??0)*f}return t>0?r/t:0})(),prg_vptmin:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*M(a)*c;t+=f,r+=(a.prg_vptmin??0)*f}return t>0?r/t:0})(),dif_cutoff:n.reduce((r,t)=>r+(t.dif_cutoff??0)*M(t),0),prg_homlab:n.reduce((r,t)=>r+(t.prg_homlab??0)*M(t),0)},C={count:n.filter(r=>P(r)>0).length,prg_avamts:n.reduce((r,t)=>r+(t.prg_avamts??0)*P(t),0),prg_loncor:n.reduce((r,t)=>r+(t.prg_loncor??0)*_(t)*P(t),0),prg_altcor:(()=>{let r=n.reduce((t,a)=>t+g(a),0);return r===0?0:n.reduce((t,a)=>t+(a.prg_altcor??0)*g(a)*P(a),0)/r})(),prg_tmsrotvet:n.reduce((r,t)=>r+(t.prg_tmsrotvet??0)*_(t)*P(t),0),prg_tmsrotdil:n.reduce((r,t)=>r+(t.prg_tmsrotdil??0)*_(t)*P(t),0),prg_tmsextraid:n.reduce((r,t)=>r+(t.prg_tmsextraid??0)*P(t),0),anchoMinado:(()=>{let r=0,t=0;for(let a of n){let c=g(a)*_(a)*P(a);t+=c,r+=((a.prg_ancvet??0)+(a.prg_ancdil??0))*c}return t>0?r/t:0})(),prg_leyau:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*P(a)*c;t+=f,r+=(a.prg_leyau??0)*f}return t>0?r/t:0})(),prg_leycu:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*P(a)*c;t+=f,r+=(a.prg_leycu??0)*f}return t>0?r/t:0})(),prg_leypb:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*P(a)*c;t+=f,r+=(a.prg_leypb??0)*f}return t>0?r/t:0})(),prg_leyzn:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*P(a)*c;t+=f,r+=(a.prg_leyzn??0)*f}return t>0?r/t:0})(),prg_vptmin:(()=>{let r=0,t=0;for(let a of n){let c=(a.prg_tmsextraid??0)>0?1:0,f=(a.prg_tmsextraid??0)*P(a)*c;t+=f,r+=(a.prg_vptmin??0)*f}return t>0?r/t:0})(),dif_cutoff:n.reduce((r,t)=>r+(t.dif_cutoff??0)*P(t),0),prg_homlab:n.reduce((r,t)=>r+(t.prg_homlab??0)*P(t),0)},Ie=`${d[o.cie_per]??o.cie_per} ${o.cie_ano}`,u=(r,t=2)=>{let a=parseFloat(r);return isNaN(a)?"-":a.toFixed(t)},h=r=>r!=null?r.toLocaleString("es-PE"):"-",we=n.map(r=>`
                <tr class="${(r.prg_progra??"").trim().toUpperCase()==="N"?"text-red-500":""}">
                    <td>${r.cod_veta??""}</td>
                    <td>${r.cod_nivel??""}</td>
                    <td>${r.cod_tipo_labor??""}</td>

                    <td>${r.cod_labor??""}</td>
                    <td>${r.cod_ala??""}</td>
                    <td>${r.cod_cto??""}</td>
                    <td>${r.prg_blocks??""}</td>

                    <td class="num">${r.ind_tip_roca_piso??""}</td>
                    <td class="num">${u(r.ind_tip_roca)}</td>
                    <td class="num">${u(r.ind_tip_roca_techo)}</td>
                    <td class="num">${u(r.prg_avamts)}</td>

                    <td class="num">${u(r.prg_secancho)}</td>

                    <td class="num">${u(r.prg_tmsdes)}</td>
                    <td class="num">${u(r.prg_tmsmin)}</td>
                    <td class="num">${u(r.prg_tmsmin)}</td>
                    <td class="num">${u(r.prg_ancvet)}</td>
                    <td class="num">${h(r.prg_ancdil)}</td>
                    <td class="num">${u(r.prg_tramin)}</td>
                    <td class="num">${u(r.prg_num_tramin)}</td>
                    <td class="num">${u(r.prg_loncor)}</td>
                    <td class="num">${u(r.prg_altcor)}</td>
                    <td class="num">${u(r.prg_tmsrotvet)}</td>
                    <td class="num">${h(r.prg_tmsrotdil)}</td>
                    <td class="num">${r.prg_fecmuestreo??""}</td>
                    <td class="num">${h(r.prg_leyag)}</td>
                    <td class="num">${h(r.prg_leycu)}</td>
                    <td class="num">${h(r.prg_leypb)}</td>
                    <td class="num">${h(r.prg_leyzn)}</td>
                    <td class="num">${h(r.prg_vptmin)}</td>
                    <td class="num">${h(r.dif_cutoff)}</td>
                    <td class="num">${r.metexp_cod??""}</td>
                    <td class="num">${h(r.prg_homlab)}</td>
                    <td class="num">${r.des_proyecto??""}</td>
                    <td class="num">${r.nom_proyecto??""}</td>
                </tr>
            `).join(""),Oe=`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Resumen del Programa</title>
            <style>
                * { margin:0; padding:0; box-sizing:border-box; }
                body { font-family:Arial,sans-serif; font-size:11px; color:#000; background:#888; }


                .tabla-wrapper {
                    width: 100%;
                    overflow: visible;
                }
                .tabla-wrapper table {
                    transform-origin: top left;
                    transform: scale(0.75);   /* ajusta este valor */
                    width: 133%;              /* compensa el scale: 100/0.75 */
                }
                .acciones {
                    display:flex; justify-content:center;
                    gap:12px; padding:14px 0;
                }
                .acciones button {
                    padding:5px 28px; border:1px solid #aaa;
                    border-radius:3px; cursor:pointer;
                    font-size:13px; background:#f0f0f0;
                }
                .acciones button:hover { background:#ddd; }

                .page {
                    background:white; width:297mm;
                    min-height:210mm; margin:0 auto;
                    padding:12mm 10mm; border:1px solid #ccc;
                }

                /* cabecera */
                .rep-cab {
                    display:flex; justify-content:space-between;
                    font-size:10px; padding-bottom:6px;
                    border-bottom:1px solid #000; margin-bottom:6px;
                }
                .rep-cab-right { text-align:right; }

                /* info empresa */
                .rep-info {
                    display:grid; grid-template-columns:repeat(3,1fr);
                    gap:3px 12px; font-size:9px;
                    border-bottom:1px solid #ccc;
                    padding:5px 0; margin-bottom:8px;
                }
                .rep-info span  { color:#555; }
                .rep-info strong{ color:#000; }

                /* t\xEDtulo */
                .titulo { text-align:center; margin:8px 0 10px; }
                .titulo h1 { font-size:13px; font-weight:bold; }
                .titulo h2 { font-size:11px; font-weight:normal; margin-top:4px; }

                /* tabla */
                table { width:100%; border-collapse:collapse; font-size:8.5px; }
                thead tr { background:#c0c0c0; }
                th {
                    border:1px solid #666; padding:3px 4px;
                    text-align:center; font-weight:bold;
                }
                td  { border:1px solid #bbb; padding:2px 4px; white-space:nowrap; }
                td.num { text-align:right; }
                tr:nth-child(even) td { background:#f5f5f5; }

                /* footer */
                .rep-footer {
                    margin-top:10px; font-size:9px; color:#555;
                    border-top:1px solid #ccc; padding-top:5px;
                    display:flex; justify-content:space-between;
                }

                @media print {
                    body  { background:white; }
                    .page { margin:0; border:none; width:100%; }
                    .acciones { display:none; }
                    @page { size:A4 landscape; margin:8mm; }
                }
            </style>
        </head>
        <body>

            <div class="acciones">
                <button onclick="window.print()">Print</button>
                <button onclick="window.close()">Cancelar</button>
            </div>

            <div class="page">

                <div class="rep-cab">
                    <div>
                        <div>Sistema Integrado de Operaciones Minero Metal\xFArgicas (SIOMM)</div>
                        <div>${o.nom_empresa}</div>
                        <div>${o.nom_empresa_unidad}</div>
                    </div>
                    <div class="rep-cab-right">
                        <div>${l}</div>
                        <div>P\xE1gina 1 de 1</div>
                        <div>d_sq_co_rept_programa_resumen</div>
                    </div>
                </div>

                <div class="rep-info">
                    <div><span>Unidad Econ\xF3mica: </span><strong>${o.des_und_econom}</strong></div>
                    <div><span>Zona: </span><strong>${o.des_zona}</strong></div>
                    <div><span>Contrata: </span><strong>${o.des_contrata}</strong></div>
                    <div><span>Nro. Programa: </span><strong>${o.nro_prog}</strong></div>
                    <div><span>Cutoff: </span><strong>${o.prg_cutoff}</strong></div>
                    <div><span>Estado: </span><strong>${o.prg_est}</strong></div>
                </div>

                <div class="titulo">
                    <h1>RESUMEN GENERAL : PROGRAMA GENERAL DE MINA</h1>
                    <h2>${Ie}</h2>
                </div>

                <div class="tabla-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Veta</th>
                                <th>Nivel</th>
                                <th>Tipo Labor</th>
                                <th>Labor</th>
                                <th>Ala</th>
                                <th>Cod.Cto</th>
                                <th>Blocks</th>
                                <th>RMR Piso</th>
                                <th>RMR Veta</th>
                                <th>RMR Techo</th>
                                <th>Avance MTS</th>
                                <th>Secci\xF3n Altura</th>
                                <th>TMS Desmonte</th>
                                <th>TMS Total</th>
                                <th>Ancho Veta</th>
                                <th>Ancho Diluci\xF3n</th>
                                <th>Tramo Minable <br> (Ej. 00@10;20@30..)</th>
                                <th>Nro. Tram Min</th>
                                <th>Longitud <br> de Corte</th>
                                <th>Altura de Corte</th>
                                <th>TMS <BR> Rotas <br> Veta</th>
                                <th>TMS Rotas Diluci\xF3n</th>
                                <th>TMS Extraido</th>
                                <th>Fecha <br> Muestreo</th>
                                <th>Ag (gr)</th>
                                <th>Cu (%)</th>
                                <th>Pb (%)</th>
                                <th>Zn (%)</th>
                                <th>VTP U$$</th>
                                <th>Rentabilidad</th>
                                <th>M\xE9todo <br> Minado</th>
                                <th>Hombres <br> Labor</th>
                                <th>Descripci\xF3n del Proyecto</th>
                                <th>Nombre del Proyecto</th>

                            </tr>
                        </thead>
                        <tbody>
                            ${n.length?we:'<tr><td colspan="18" style="text-align:center;padding:10px">Sin datos</td></tr>'}
                        </tbody>

                        <tfoot>
                            <tr style="background:#d0d0d0; font-weight:bold;">
                                <td colspan="7">TOTALES</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(p.prg_avamts)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(p.prg_tmsmin)}</td>
                                <td class="num">${u(p.prg_ancvet)}</td>
                                <td class="num">${h(p.prg_ancdil)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(p.prg_leyau)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(p.prg_vptmin)}</td>
                                <td class="num">${h(p.dif_cutoff)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(p.prg_homlab)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                            </tr>

                                                        <!-- TOTAL PRODUCCI\xD3N -->
                            <tr style="background:#c8dae8; font-weight:bold;">
                                <td colspan="7">Total Producci\xF3n (${D.count})</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(D.prg_avamts)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(D.prg_tmsextraid)}</td>
                                <td class="num">${u(D.prg_ancvet)}</td>
                                <td class="num">${h(D.prg_ancdil)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(D.prg_leyau)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(D.prg_vptmin)}</td>
                                <td class="num">${h(D.dif_cutoff)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(D.prg_homlab)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                            </tr>

                            <!-- BLOCKS ECON\xD3MICOS -->
                            <tr style="background:#d4edda; font-weight:bold;">
                                <td colspan="7">Blocks Econ\xF3micos (${x.count})</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(x.prg_avamts)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(x.prg_tmsextraid)}</td>
                                <td class="num">${u(x.anchoMinado)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(x.prg_loncor)}</td>
                                <td class="num">${u(x.prg_altcor)}</td>
                                <td class="num">${u(x.prg_tmsrotvet)}</td>
                                <td class="num">${u(x.prg_tmsrotdil)}</td>
                                <td class="num">${h(x.prg_leyau)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(x.prg_vptmin)}</td>
                                <td class="num">${h(x.dif_cutoff)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(x.prg_homlab)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                            </tr>

                            <!-- BLOCKS NO ECON\xD3MICOS -->
                            <tr style="background:#f8d7da; font-weight:bold;">
                                <td colspan="7">Blocks No Econ\xF3micos (${C.count})</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(C.prg_avamts)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(C.prg_tmsextraid)}</td>
                                <td class="num">${u(C.anchoMinado)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${u(C.prg_loncor)}</td>
                                <td class="num">${u(C.prg_altcor)}</td>
                                <td class="num">${u(C.prg_tmsrotvet)}</td>
                                <td class="num">${u(C.prg_tmsrotdil)}</td>
                                <td class="num">${h(C.prg_leyau)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(C.prg_vptmin)}</td>
                                <td class="num">${h(C.dif_cutoff)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">${h(C.prg_homlab)}</td>
                                <td class="num">\u2014</td>
                                <td class="num">\u2014</td>
                            </tr>
                        </tfoot>

                        

                    </table>
                
                </div>

                <div class="rep-footer">
                    <span>Nro.Prog: ${o.nro_prog} | Fase: ${n[0]?.nom_fase??""}</span>
                    <span>Cutoff: ${o.prg_cutoff} | C\xE1lc.Dil: ${o.ind_calc_dil}</span>
                </div>

            </div>
        </body>
        </html>
    `,ie=window.open("","_blank","width=1200,height=800,scrollbars=yes");if(!ie){this.formUtils.mensajeError("El navegador bloque\xF3 la ventana emergente. Permite popups para este sitio.");return}ie.document.write(Oe),ie.document.close()}onImportar(){this.setBoton("Importar","bg-[#155e75]")}onExportar(){this.setBoton("Exportar","bg-[#3730a3]");let e=this.formCabProgam.onSudmit(),o=this.programaState.codFase()||"01",n={cod_empresa:"03",cod_empresa_unidad:"01",nro_prog:e.nro_prog,cod_fase:o};this.formUtils.confirmarAnulacion("Exportar Datos",`<b>\xBFDesea exportar el Nro. Programa ${e.nro_prog} con fase ${o}?</b> <br>Se guardara la informaci\xF3n en un archivo excel.`,"Si, exportar datos","No exportar").then(l=>{l.isConfirmed&&this.programaState.exportarProgramaMensual(n).subscribe({next:d=>{if(d instanceof Blob){let p=new Blob([d],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),g=window.URL.createObjectURL(p),_=document.createElement("a");_.href=g,_.download="ReporteProgramaMensual.xlsx",_.click(),window.URL.revokeObjectURL(g)}else this.formUtils.mensajeError(d?.mensaje||"Error al exportar")},error:d=>{let p=new FileReader;p.onload=()=>{try{let _=JSON.parse(p.result)?.mensaje||"Error inesperado al exportar";this.formUtils.mensajeEliminarLabor("Datos Vacios",_)}catch{this.formUtils.mensajeError("Error inesperado al exportar")}},d.error instanceof Blob?p.readAsText(d.error):this.formUtils.mensajeError(d?.error?.mensaje||"Error inesperado al exportar")}})})}onLabores(){this.setBoton("Labores","bg-[#115e59]"),this.abrirModal()}onCerrar(){this.setBoton("Cerrar","bg-[#475569]"),this.router.navigate(["/menu-principal/planeamiento/programa_mensual_de_labores/lista-detalle"])}abrirModal(){this.botonAccionService.abrir()}static \u0275fac=function(o){return new(o||i)};static \u0275cmp=B({type:i,selectors:[["app-edicion-programa-mensual-labores"]],viewQuery:function(o,n){if(o&1&&(se(Q,5),se(Le,5)),o&2){let l;le(l=me())&&(n.formCabProgam=l.first),le(l=me())&&(n.formProgDetalle=l.first)}},decls:27,vars:3,consts:[[1,"container","mx-auto"],[1,"flex","flex-col","md:flex-row","lg:flex-row","xl:flex-row","mt-6","lg:mt-4","gap-6"],[1,"w-full","md:w-[35%]","lg:w-[40%]","xl:w-[26%]","2xl:w-[20%]","shadow-lg","border","border-gray-200","rounded-xl","bg-white","overflow-hidden","font-sans"],[3,"codFaseSelected"],[1,"w-full","md:w-[65%]","lg:w-[60%]","xl:w-[74%]","2xl:w-[78%]"],[1,"w-full"],[1,"p-5","rounded-xl","border","border-gray-200","shadow-sm","mb-3","w-full"],[3,"titulo"],[1,"rounded-xl","ml-3","mr-3"],[1,"text-lg","font-bold","mb-5","pb-2","border-b","border-gray-300","flex","items-center","gap-2","text-[#013B5C]"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke-width","2","stroke","currentColor",1,"w-6","h-6","text-[#013B5C]"],["stroke-linecap","round","stroke-linejoin","round","d","M12 3c2.757 0 5.23 1.107 7.071 2.949A10.437 10.437 0 0 1 21 12c0 2.757-1.107 5.23-2.949 7.071A10.437 10.437 0 0 1 12 21c-2.757 0-5.23-1.107-7.071-2.949A10.437 10.437 0 0 1 3 12c0-2.757 1.107-5.23 2.949-7.071A10.437 10.437 0 0 1 12 3Z"],[1,"flex","flex-col","md:flex-row","md:justify-between","md:items-center","gap-4"],[1,"flex","flex-wrap","items-center","gap-4"],[3,"texto","color","icono","bloqueo"],[1,"inline-flex","items-center","gap-3","px-4","py-2","rounded-xl","bg-gray-50","transition-all","duration-200"],[1,"flex","items-center","justify-center","w-7","h-7","rounded-full","text-white","text-xs","animate-pulse",3,"ngClass"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke","currentColor","stroke-width","3",1,"w-3","h-3"],["stroke-linecap","round","stroke-linejoin","round","d","M5 13l4 4L19 7"],[1,"text-sm","font-bold"],[1,"border-gray-200","my-4"],[1,"w-full","overflow-x-auto"],[3,"accion","texto","color","icono","bloqueo"]],template:function(o,n){o&1&&(m(0,"div",0)(1,"div",1)(2,"div",2)(3,"app-slider-programa-mensual",3),z("codFaseSelected",function(d){return n.onFaseClick(d)}),s()(),m(4,"div",4)(5,"form",5)(6,"div",6),y(7,"app-titulo-modulo",7)(8,"app-formulario-programa-mensual"),s(),m(9,"div",8)(10,"h3",9),L(),m(11,"svg",10),y(12,"path",11),s(),v(13," Acciones \u2013 Programa Mensual "),s(),N(),m(14,"div",12)(15,"div",13),w(16,Ke,1,4,"app-botones",14,I),s(),m(18,"div",15)(19,"span",16),L(),m(20,"svg",17),y(21,"path",18),s()(),N(),m(22,"span",19),v(23),s()()()(),y(24,"hr",20),m(25,"div",21),y(26,"router-outlet"),s()()()()()),o&2&&(b(7),E("titulo","Informaci\xF3n Programa Mensual de Labores"),b(9),O(n.botones()),b(3),E("ngClass",n.botoColor()),b(4),ee(" ",n.botoPresionado()," "))},dependencies:[De,Q,pe,oe,Ae,ne,te],styles:[".tree[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{margin-left:20px;border-left:1px dotted #999;padding-left:10px}.tree[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin:4px 0}.folder[_ngcontent-%COMP%]{font-weight:700;color:#1e3a8a;cursor:pointer}details[_ngcontent-%COMP%] > summary[_ngcontent-%COMP%]::-webkit-details-marker{display:none}"]})};var ke=async()=>{let i=F(R),e=F(j);return i.hayDatosPendientes()?(await V.confirmarAnulacion("Salir de la interfaz","<b>\xBFTiene cambios sin guardar, desea salir?</b><br>Si contin\xFAa, perder\xE1 los datos no guardados.","S\xED, deseo salir","No deseo salir")).isConfirmed?(i.limpiarTodosDatosFases(),e.getFormulario()?.get("labores")?.clear(),!0):!1:!0};var Xe=[{path:"",component:ae,canDeactivate:[ke],children:[{path:"",redirectTo:"edicion-exploracion",pathMatch:"full"},{path:"edicion-exploracion",title:"01 - EXPLORACION",loadChildren:()=>import("./chunk-373CZZY2.js").then(i=>i.default)},{path:"edicion-desarrollo",title:"02 - DESARROLLO",loadChildren:()=>import("./chunk-QTXYIX4A.js").then(i=>i.default)},{path:"edicion-preparacion",title:"03 - PREPARACION",loadChildren:()=>import("./chunk-LYEOCI4M.js").then(i=>i.default)},{path:"edicion-explotacion",title:"04 - EXPLOTACION",loadChildren:()=>import("./chunk-C2ST3CL4.js").then(i=>i.default)}]}],Jr=Xe;export{Xe as EdicionProgramaMensualLaboresRoutes,Jr as default};
