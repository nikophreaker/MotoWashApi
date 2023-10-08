import{_ as Q}from"./ErrorMessage.vue.a1110a72.js";import{f as W,r as T,D as X,O as Y,v as s,i as $,s as Z,o as y,c as g,M as U,N as B,u as o,a as l,b as n,w as f,d as c,F as C,t as m,m as h,n as ee}from"./entry.1da6d735.js";const te=l("h2",{class:"text-2xl font-bold"},"Datatable Product",-1),ae=l("hr",{class:"my-2 border dark:border-gray-700"},null,-1),re={class:"col-span-12 flex justify-start gap-1"},oe={key:5,class:"flex gap-2 justify-center"},le=l("div",{class:"p-2 rounded"},"Sorry, No Data Available",-1),ie=l("hr",{class:"my-2 dark:border-gray-700"},null,-1),ne={class:"flex gap-2"},se=l("div",{class:"w-32"},"Selected Data",-1),de={class:"flex gap-2"},ue=l("div",{class:"w-32"},"Order By",-1),ce={class:"flex gap-2"},pe=l("div",{class:"w-32"},"Order Type",-1),me={class:"flex gap-2"},ve=l("div",{class:"w-32"},"Search",-1),fe={class:"font-bold"},ye={class:"col-span-12"},ge={class:"col-span-12"},he={class:"col-span-12"},be={class:"col-span-12"},we={class:"col-span-12"},ke={class:"col-span-12 flex justify-end gap-1"},I="formProduct",Ce=W({__name:"product",setup(xe){const i=T({column:[{label:"Name",field:"name",width:"400px",sortable:!0},{label:"Description",field:"description",width:"400px",sortable:!0},{label:"Category",field:"categoryName",width:"400px",sortable:!0},{label:"Stock",field:"stock",width:"400px",sortable:!0},{label:"Price",field:"price",width:"400px",sortable:!0},{label:"Action",field:"action",width:"400px",sortable:!1}],data:[],limit:5,offset:0,search:"",selected:[],sortBy:"name",sortType:"asc",setting:{checkbox:!0,limitOption:[{label:"5",value:5},{label:"10",value:10},{label:"50",value:50},{label:"100",value:100},{label:"200",value:200}]}});var b=T(!1),N=T([]),w=new URLSearchParams;w.append("limit",i.value.limit.toString()),w.append("skip",i.value.offset.toString()),w.append("query",i.value.search.toString());const L=e=>{e()};async function M(){await fetch("/api/category",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:w,redirect:"follow"}).then(e=>{e!=null&&e.json().then(t=>{N.value=[],t.error==null&&t.data.forEach(d=>{N.value.push({label:d.name,value:d.id})})})}).catch(e=>{})}async function P(){await fetch("/api/product",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:w,redirect:"follow"}).then(e=>{e!=null&&e.json().then(t=>{t.error==null&&(i.value.data=t.data)})}).catch(e=>{})}async function R(){if(p.value.clearErrors(),await p.value.validate(),p.value.fail()){k.error({message:p.value.getErrorMessage()}),x.value=!0,setTimeout(()=>{x.value=!1},1e3);return}var e=new URLSearchParams;e.append("name",r.inputName),e.append("description",r.textAreaDescription),e.append("category_id",r.selectCategory),e.append("stock",r.inputStock),e.append("price",r.inputPrice),$fetch("/api/product/product",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e,redirect:"follow"}).then(t=>{t!=null&&S(t)}).catch(t=>{S(t)})}async function F(){if(p.value.clearErrors(),await p.value.validate(),p.value.fail()){k.error({message:p.value.getErrorMessage()}),x.value=!0,setTimeout(()=>{x.value=!1},1e3);return}var e=new URLSearchParams;e.append("id",_.value.id),e.append("name",r.inputName),e.append("description",r.textAreaDescription),e.append("category_id",r.selectCategory),e.append("stock",r.inputStock),e.append("price",r.inputPrice),$fetch("/api/product/product",{method:"PATCH",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e,redirect:"follow"}).then(t=>{t!=null&&S(t)}).catch(t=>{S(t)})}function q(e){var t=new URLSearchParams;return t.append("id",e),$fetch("/api/product/product",{method:"DELETE",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t,redirect:"follow"}).then(a=>a!=null?(P(),!0):!1).catch(a=>!1)}X(async()=>P()),Y(async()=>{b.value&&M()});const O=s.useForm(),H=s.useDialog(),k=s.useToast();async function j(e){if(e!=null){if(!await H.fire({title:`Delete ${e.name}`,description:`Are you sure to delete ${e.name} ?`,icon:"alert-triangle"}))return;q(e.id).then(d=>{d?k.success({message:`Success Delete ${e.name}`}):k.error({message:`Failed Delete ${e.name}`})})}}const x=T(!1),G=$(()=>O.getForm(I)),p=$(()=>G.value.validator);async function S(e){e.error!=null?k.error({message:e.message}):(E(void 0),D(),P(),V())}const r=Z({inputName:null,selectCategory:null,inputStock:null,inputPrice:null,textAreaDescription:null}),z={inputName:["required","string"],selectCategory:["required"],inputStock:["required","numeric"],inputPrice:["required","string"],textAreaDescription:["required","string",e=>{if(!e||e.length<15)return`Min length is 15, current length is ${e.length}`}]};function V(){r.inputName=null,r.selectCategory=null,r.inputStock=null,r.inputPrice=null,r.textAreaDescription=null,p.value.clearErrors()}var _=T();function E(e){_.value=e,e!=null&&(r.inputName=e.name,r.selectCategory=e.categoryId,r.textAreaDescription=e.description,r.inputStock=e.stock,r.inputPrice=e.price)}function D(){p.value.clearErrors(),b.value=!b.value}function J(e,t){var d=e.replace(/[^,\d]/g,"").toString(),a=d.split(","),u=a[0].length%3,v=a[0].substr(0,u),A=a[0].substr(u).match(/\d{3}/gi);if(A){var K=u?".":"";v+=K+A.join(".")}return v=a[1]!=null?v+","+a[1]:v,t==null?v:v?"Rp. "+v:""}return(e,t)=>{const d=Q;return y(),g("div",null,[te,ae,U(l("div",null,[l("div",re,[n(o(s.TwButton),{variant:"primary",icon:"plus-square",class:"border border-gray-900 my-2",onClick:t[0]||(t[0]=a=>D())},{default:f(()=>[c(" Add Data ")]),_:1})]),n(o(s.TwDatatableClient),{class:"!dark:text-gray-200",search:i.value.search,"onUpdate:search":t[1]||(t[1]=a=>i.value.search=a),limit:i.value.limit,"onUpdate:limit":t[2]||(t[2]=a=>i.value.limit=a),selected:i.value.selected,"onUpdate:selected":t[3]||(t[3]=a=>i.value.selected=a),"sort-by":i.value.sortBy,"onUpdate:sortBy":t[4]||(t[4]=a=>i.value.sortBy=a),"sort-type":i.value.sortType,"onUpdate:sortType":t[5]||(t[5]=a=>i.value.sortType=a),column:i.value.column,data:i.value.data,setting:i.value.setting,"onDatatable:columnHook":L},{row:f(({column:a,data:u})=>[a.field==="name"?(y(),g(C,{key:0},[c(m(u.name),1)],64)):h("",!0),a.field==="description"?(y(),g(C,{key:1},[c(m(u.description),1)],64)):h("",!0),a.field==="category"?(y(),g(C,{key:2},[c(m(u.categoryName),1)],64)):h("",!0),a.field==="stock"?(y(),g(C,{key:3},[c(m(Number(u.stock)),1)],64)):h("",!0),a.field==="price"?(y(),g(C,{key:4},[c(m(J(u.price.toString(),"Rp. ")),1)],64)):h("",!0),a.field==="action"?(y(),g("div",oe,[n(o(s.TwButton),{variant:"primary",class:"border border-gray-900",onClick:v=>{D(),E(u)}},{default:f(()=>[c(" Edit ")]),_:2},1032,["onClick"]),n(o(s.TwButton),{variant:"danger",onClick:v=>j(u)},{default:f(()=>[c(" Delete ")]),_:2},1032,["onClick"])])):h("",!0)]),empty:f(()=>[le]),_:1},8,["search","limit","selected","sort-by","sort-type","column","data","setting"]),ie,l("div",null,[l("div",ne,[se,l("div",null,": "+m(i.value.selected),1)]),l("div",de,[ue,l("div",null,": "+m(i.value.sortBy),1)]),l("div",ce,[pe,l("div",null,": "+m(i.value.sortType),1)]),l("div",me,[ve,l("div",null,": "+m(i.value.search),1)])])],512),[[B,!o(b)]]),U(l("div",null,[l("h1",fe,m(o(_)!=null?`Update Data ${o(_).name}`:"Tambah Data"),1),n(o(s.TwForm),{name:I,class:ee(["grid grid-cols-12 gap-2 bg-white dark:bg-gray-900 dark:border dark:border-gray-700 rounded-lg p-2 shadow",{"tw-shake":x.value}]),rules:z,onSubmit:t[13]||(t[13]=a=>o(_)!=null?F():R()),"custom-field-name":{inputName:"Input",textAreaExample:"Text Area",inputStock:"Input",inputPrice:"Input"}},{default:f(()=>[l("div",ye,[n(o(s.TwInput),{label:"Name",name:"inputName",modelValue:o(r).inputName,"onUpdate:modelValue":t[6]||(t[6]=a=>o(r).inputName=a),placeholder:"Input Name",type:"text"},null,8,["modelValue"]),n(d,{name:"inputName"})]),l("div",ge,[n(o(s.TwTextarea),{label:"Description",name:"textAreaDescription",modelValue:o(r).textAreaDescription,"onUpdate:modelValue":t[7]||(t[7]=a=>o(r).textAreaDescription=a),placeholder:"Description",type:"text"},null,8,["modelValue"]),n(d,{name:"textAreaDescription"})]),l("div",he,[n(o(s.TwSelect),{label:"Category",name:"selectCategory",modelValue:o(r).selectCategory,"onUpdate:modelValue":t[8]||(t[8]=a=>o(r).selectCategory=a),items:o(N),placeholder:"Choose Category"},null,8,["modelValue","items"]),n(d,{name:"selectCategory"})]),l("div",be,[n(o(s.TwInput),{label:"Stock",name:"inputStock",modelValue:o(r).inputStock,"onUpdate:modelValue":t[9]||(t[9]=a=>o(r).inputStock=a),placeholder:"Input Stock",type:"number"},null,8,["modelValue"]),n(d,{name:"inputStock"})]),l("div",we,[n(o(s.TwInput),{label:"Price",name:"inputPrice",modelValue:o(r).inputPrice,"onUpdate:modelValue":t[10]||(t[10]=a=>o(r).inputPrice=a),placeholder:"Input Price",type:"text"},null,8,["modelValue"]),n(d,{name:"inputPrice"})]),l("div",ke,[n(o(s.TwButton),{variant:"primary",type:"button",class:"border border-gray-900",onClick:t[11]||(t[11]=a=>{V(),D(),E(void 0)})},{default:f(()=>[c(" Close ")]),_:1}),n(o(s.TwButton),{ripple:"",variant:"secondary",type:"button",class:"dark:text-gray-200 dark:!border-gray-800 dark:border",onClick:t[12]||(t[12]=a=>V())},{default:f(()=>[c(" Reset ")]),_:1}),n(o(s.TwButton),{variant:"primary"},{default:f(()=>[c(" Submit ")]),_:1})])]),_:1},8,["class"])],512),[[B,o(b)]])])}}});export{Ce as default};
