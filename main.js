
function focusAnatomyStructure(name){
 localStorage.setItem('ak18_focus_structure',name);
 const tab=document.querySelector('[data-tab="anatomy"]');
 if(tab) tab.click();
}


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ATLAS='https://raw.githubusercontent.com/Liyucheng1997/242_lab-human-anatomy/main/';
const systems={
  muscles:{label:'Muscles',icon:'💪',url:ATLAS+'public/models/muscular.glb'},
  skeleton:{label:'Squelette',icon:'🦴',url:ATLAS+'public/models/skeleton.glb'},
  nervous:{label:'Nerfs',icon:'🧠',url:ATLAS+'public/models/nervous.glb'},
  visceral:{label:'Viscères',icon:'🫀',url:ATLAS+'public/models/visceral.glb'},
  cardiovascular:{label:'Cardio-vasculaire',icon:'🩸',url:ATLAS+'public/models/cardiovascular.glb'}
};
const app=document.querySelector('#app');
app.innerHTML=`
<div class="shell">
<header><div><div class="brand">ANATOMY <span>KINÉ</span></div><div class="sub">Atlas 3D · Révision première année</div></div>
<div class="status" id="status">Initialisation…</div></header>
<div class="toolbar">
<input id="search" placeholder="Rechercher une structure, un muscle, un terme latin…" />
<button id="clear">×</button>
</div>
<nav id="systems"></nav>
<main>
<section class="viewer"><div id="scene"></div><div class="hint">🖱️ Tourner · molette zoom · clic = sélectionner</div>
<div class="floating"><button id="front">Vue face</button><button id="back">Vue dos</button><button id="reset">Réinitialiser</button><button id="isolate">Isoler</button><button id="ghost">Transparence</button><button id="all">Tout afficher</button></div></section>
<aside>
<div class="tabs"><button class="tab active" data-tab="anatomy">ANATOMIE</button><button class="tab" data-tab="kine">KINÉ</button><button class="tab" data-tab="courses">MES COURS</button><button class="tab" data-tab="revision">RÉVISION</button></div>
<div id="panel"></div>
</aside>
</main>
</div>`;
const style=document.createElement('style');
style.textContent=`
*{box-sizing:border-box}body{margin:0;background:#09111b;color:#eaf2f8;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif}button,input{font:inherit}.shell{height:100vh;display:flex;flex-direction:column}header{height:72px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;background:#0c1723;border-bottom:1px solid #1e3041}.brand{font-weight:900;letter-spacing:.12em;font-size:20px}.brand span{color:#63d7ff}.sub{font-size:12px;color:#8ea3b6;margin-top:2px}.status{font-size:12px;color:#8ea3b6}.toolbar{display:flex;gap:8px;padding:10px 14px;background:#0b1520}.toolbar input{flex:1;background:#111f2c;border:1px solid #294052;color:white;padding:12px 14px;border-radius:12px;outline:none}.toolbar button,.floating button,.tabs button,.sys{border:1px solid #294052;background:#111f2c;color:#dce8ef;border-radius:10px;padding:9px 12px;cursor:pointer}.toolbar button{width:42px}.toolbar button:hover,.floating button:hover,.tabs button:hover,.sys:hover{border-color:#63d7ff}.sys.active{background:#163449;border-color:#63d7ff;color:#fff}.sys{white-space:nowrap}.sysnav{display:flex;gap:7px;overflow:auto;padding:0 14px 10px;background:#0b1520}main{min-height:0;flex:1;display:grid;grid-template-columns:minmax(0,1fr) 390px}.viewer{position:relative;min-width:0;background:radial-gradient(circle at 50% 35%,#172c3c 0,#09111b 62%)}#scene{position:absolute;inset:0}.hint{position:absolute;left:14px;bottom:12px;color:#8198aa;font-size:11px}.floating{position:absolute;top:12px;left:12px;display:flex;gap:6px;flex-wrap:wrap}.floating button{background:#0d1b28cc;font-size:12px;padding:7px 9px}aside{background:#0d1824;border-left:1px solid #1e3041;overflow:auto}.tabs{display:flex;gap:5px;padding:10px;border-bottom:1px solid #1e3041;position:sticky;top:0;background:#0d1824;z-index:3}.tabs button{flex:1;font-size:11px}.tabs .active{background:#163449;border-color:#63d7ff}.card{padding:16px}.eyebrow{color:#63d7ff;text-transform:uppercase;font-size:10px;font-weight:800;letter-spacing:.12em}.title{font-size:25px;font-weight:900;margin:5px 0}.latin{font-style:italic;color:#8ea3b6}.field{margin-top:15px}.field b{display:block;color:#a9c1d0;font-size:11px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}.field p{margin:0;line-height:1.5;color:#e4edf3;font-size:13px}.empty{padding:24px;color:#8ea3b6;line-height:1.6}.result{padding:9px 12px;border-bottom:1px solid #1a2b39;cursor:pointer}.result:hover{background:#132534}.result b{font-size:13px}.result small{display:block;color:#7890a2}.metric{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.metric div{background:#111f2c;border:1px solid #223849;border-radius:10px;padding:10px}.metric strong{font-size:18px}.quizq{font-size:16px;font-weight:800;line-height:1.4;margin:10px 0 15px}.choice{display:block;width:100%;text-align:left;margin:7px 0;background:#111f2c;border:1px solid #294052;color:white;border-radius:10px;padding:10px;cursor:pointer}.choice.ok{border-color:#55d18a;background:#123323}.choice.no{border-color:#ff6e7d;background:#351a20}.progress{height:7px;background:#182938;border-radius:9px;overflow:hidden;margin:12px 0}.progress i{display:block;height:100%;background:#63d7ff;width:0}.courseSearch{width:100%;background:#111f2c;border:1px solid #294052;color:white;padding:10px 12px;border-radius:10px;outline:none;margin:8px 0 4px}.review{padding:10px 12px;border:1px solid #263d4d;border-radius:12px;margin:8px 0;background:#101f2b}.pill{display:inline-block;padding:3px 7px;border-radius:99px;background:#173144;color:#8fdfff;font-size:10px;margin:2px}
@media(max-width:850px){main{grid-template-columns:1fr}aside{height:42vh;border-left:0;border-top:1px solid #1e3041}.viewer{height:58vh}.floating{right:10px}.hint{display:none}}
`;
document.head.appendChild(style);

const sceneEl=document.querySelector('#scene');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(sceneEl.clientWidth,sceneEl.clientHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; sceneEl.appendChild(renderer.domElement);
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x09111b);
const camera=new THREE.PerspectiveCamera(45,sceneEl.clientWidth/sceneEl.clientHeight,.01,1000); camera.position.set(0,1.1,4.2);
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.target.set(0,1,0);
scene.add(new THREE.HemisphereLight(0xdceeff,0x24313b,2.2));
const key=new THREE.DirectionalLight(0xffffff,2.4); key.position.set(3,5,4); scene.add(key);
const loader=new GLTFLoader(); const root=new THREE.Group(); scene.add(root);
let activeSystem='muscles', current=null, imported=null, transparent=false, db={}, localMuscles=[], localStructures={joints:[],ligaments:[]}, courses=[], courseText=[], tab='anatomy';
fetch('./course_text.json').then(r=>r.json()).then(x=>courseText=x);
fetch('./courses.json').then(r=>r.json()).then(x=>courses=x);
fetch('./structures.json').then(r=>r.json()).then(x=>localStructures=x);
fetch('./muscles.json').then(r=>r.json()).then(x=>localMuscles=x);
fetch(ATLAS+'src/anatomy.json').then(r=>r.json()).then(x=>{db=x; status('1347 structures indexées');}).catch(()=>status('Index atlas distant indisponible'));
function status(t){document.querySelector('#status').textContent=t}
function makeDemo(){while(root.children.length)root.remove(root.children[0]); const g=new THREE.Group(); 
const mats={bone:new THREE.MeshStandardMaterial({color:0xd8c9a8,roughness:.75}),muscle:new THREE.MeshStandardMaterial({color:0xb94e59,roughness:.65}),nerve:new THREE.MeshStandardMaterial({color:0xf0cf55,roughness:.55})};
const body=new THREE.Mesh(new THREE.CapsuleGeometry(.35,2.1,8,16),mats.muscle); body.position.y=1.1; g.add(body);
for(let y of [2.3,1.55,.8,.05]){const s=new THREE.Mesh(new SphereGeometry(.48,.24),mats.bone);s.position.set(0,y,0);s.scale.set(1,.25,1);g.add(s)}
root.add(g)}
function SphereGeometry(r,w,h){return new THREE.SphereGeometry(r,w,h)}
async function loadSystem(sys){
while(root.children.length)root.remove(root.children[0]); current=null; renderPanel();
status('Chargement '+systems[sys].label+'…');
try{imported=await loader.loadAsync(systems[sys].url); root.add(imported.scene); 
let n=0; imported.scene.traverse(o=>{if(o.isMesh){o.userData.baseMaterial=o.material;o.material=o.material.clone();o.userData.atlasName=o.name;n++;}});
status(`${systems[sys].label} · ${n.toLocaleString('fr-FR')} objets`); frame(imported.scene);
}catch(e){makeDemo();status('Modèle distant indisponible — mode démo');}
}
function frame(obj){const box=new THREE.Box3().setFromObject(obj);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());const max=Math.max(size.x,size.y,size.z);camera.position.set(center.x,center.y,center.z+max*2.2);controls.target.copy(center);controls.update()}
function selectMesh(o){
current=o; renderPanel();
if(o?.isMesh){o.material.emissive=new THREE.Color(0x3aa7c7);o.material.emissiveIntensity=.35}
}
renderer.domElement.addEventListener('pointerdown',e=>{const rect=renderer.domElement.getBoundingClientRect();const p=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);const ray=new THREE.Raycaster();ray.setFromCamera(p,camera);const hits=ray.intersectObjects(root,true);if(hits[0])selectMesh(hits[0].object)});
function renderPanel(){
const p=document.querySelector('#panel');
if(tab==='revision'){renderQuiz(p);return}
if(tab==='courses'){renderCourses(p);return}
if(tab==='courses'){renderCourses(p);return}
if(tab==='kine'){p.innerHTML=`<div class="card"><div class="eyebrow">Mode kiné</div><div class="title">Anatomie → mouvement → rééducation</div>
<div class="metric"><div><strong>${localMuscles.length}</strong><small> muscles clés</small></div><div><strong>${localStructures.joints.length}</strong><small> articulations</small></div><div><strong>${localStructures.ligaments.length}</strong><small> ligaments</small></div><div><strong>${Object.keys(db).length||1347}</strong><small> structures atlas</small></div></div>
<div class="field"><b>Bibliothèque kiné</b><p>Muscles, articulations et ligaments sont regroupés pour relier l'anatomie descriptive à la fonction et aux objectifs de rééducation.</p></div>
<div class="field"><b>Chaîne d'analyse</b><p>Structure → mouvement → stabilisation → déficience possible → objectif de rééducation → progression fonctionnelle.</p></div>
<div class="field"><b>Révision</b><p>Pour chaque muscle : origine → insertion → innervation → action. Pour chaque articulation : surfaces → type → mouvements. Pour chaque ligament : attaches → rôle mécanique → implications fonctionnelles.</p></div></div>`;return}
if(!current){p.innerHTML=`<div class="empty"><b>Sélectionne une structure dans le modèle 3D.</b><br><br>Ou ouvre une fiche de la bibliothèque pédagogique :
<div style="margin-top:12px"><button class="choice" id="showMuscles">💪 Muscles clés</button><button class="choice" id="showJoints">🔗 Articulations</button><button class="choice" id="showLigaments">🧷 Ligaments</button></div>
<span class="pill">💪 Muscles</span><span class="pill">🦴 Squelette</span><span class="pill">🧠 Nerfs</span><span class="pill">🫀 Viscères</span><span class="pill">🩸 Vaisseaux</span></div>`;return}
const name=current.userData?.atlasName||current.name||'Structure sélectionnée';
const local=localMuscles.find(m=>[m.fr,m.la,m.id].some(v=>v?.toLowerCase()===name.toLowerCase())||name.toLowerCase().includes(m.fr.toLowerCase())||name.toLowerCase().includes(m.la.toLowerCase()));
p.innerHTML=`<div class="card"><div class="eyebrow">${local?.region||systems[activeSystem].label}</div><div class="title">${local?.fr||name}</div><div class="latin">${local?.la||name}</div>
${local?`<div class="field"><b>Origine</b><p>${local.origin}</p></div><div class="field"><b>Insertion</b><p>${local.insertion}</p></div><div class="field"><b>Innervation</b><p>${local.innervation}</p></div><div class="field"><b>Action</b><p>${local.action}</p></div>`:`<div class="field"><b>Atlas</b><p>Cette structure est chargée depuis le modèle 3D. Recherche un nom exact ou proche pour afficher la fiche pédagogique locale lorsqu’elle existe.</p></div>`}
<div class="field"><b>Actions</b><p><button class="choice" id="focus">🎯 Centrer la structure</button><button class="choice" id="iso2">◉ Isoler</button></p></div></div>`;
document.querySelector('#focus')?.addEventListener('click',()=>frame(current));
document.querySelector('#iso2')?.addEventListener('click',()=>isolateCurrent());
document.querySelector('#showMuscles')?.addEventListener('click',()=>renderLibrary(localMuscles,'muscle'));
document.querySelector('#showJoints')?.addEventListener('click',()=>renderLibrary(localStructures.joints,'joint'));
document.querySelector('#showLigaments')?.addEventListener('click',()=>renderLibrary(localStructures.ligaments,'ligament'));
}
function isolateCurrent(){if(!current)return;root.traverse(o=>{if(o.isMesh)o.visible=(o===current||o.parent===current)});status('Structure isolée')}

function renderLibrary(items,type){
const p=document.querySelector('#panel');
const labels={muscle:'Muscles clés',joint:'Articulations',ligament:'Ligaments'};
p.innerHTML=`<div class="card"><div class="eyebrow">Bibliothèque</div><div class="title">${labels[type]}</div><p style="color:#8ea3b6;font-size:12px">${items.length} fiches pédagogiques</p></div>`+
items.map((x,i)=>`<div class="result" data-lib="${i}"><b>${x.fr}</b><small>${x.la} · ${x.region}</small></div>`).join('');
p.querySelectorAll('[data-lib]').forEach((el,i)=>el.onclick=()=>{
 const x=items[i]; current={name:x.fr,userData:{atlasName:x.fr},__local:x,__type:type}; renderLibraryCard(x,type);
});
}
function renderLibraryCard(x,type){
const p=document.querySelector('#panel');
let body='';
if(type==='muscle') body=`<div class="field"><b>Origine</b><p>${x.origin}</p></div><div class="field"><b>Insertion</b><p>${x.insertion}</p></div><div class="field"><b>Innervation</b><p>${x.innervation}</p></div><div class="field"><b>Action</b><p>${x.action}</p></div>`;
if(type==='joint') body=`<div class="field"><b>Type</b><p>${x.type}</p></div><div class="field"><b>Surfaces</b><p>${x.surfaces}</p></div><div class="field"><b>Mouvements</b><p>${x.movements}</p></div><div class="field"><b>Application kiné</b><p>${x.kine}</p></div>`;
if(type==='ligament') body=`<div class="field"><b>Attaches</b><p>${x.attachments}</p></div><div class="field"><b>Rôle mécanique</b><p>${x.role}</p></div><div class="field"><b>Application kiné</b><p>${x.kine}</p></div>`;
p.innerHTML=`<div class="card"><div class="eyebrow">${x.region}</div><div class="title">${x.fr}</div><div class="latin">${x.la}</div>${body}<button class="choice" id="backLib">← Retour à la bibliothèque</button></div>`;
document.querySelector('#backLib').onclick=()=>renderLibrary(type==='muscle'?localMuscles:localStructures[type==='joint'?'joints':'ligaments'],type);
}


function renderCourses(p){
 const selectedCourse=localStorage.getItem('ak10_selected_course')||'';

 const cats=[...new Set(courses.map(c=>c.category))];
 p.innerHTML=`<div class="card"><div class="eyebrow">Supports intégrés</div><div class="title">Mes cours</div>
 <input id="courseSearch" class="courseSearch" placeholder="Rechercher dans le contenu de mes cours…">
 <div id="courseResults"></div><p style="color:#8ea3b6; const studyBtn=document.createElement('button');studyBtn.id='launchChapterStudy';studyBtn.className='choice';studyBtn.textContent='▶ Étudier ce chapitre';studyBtn.onclick=()=>renderStudySession(p);p.prepend(studyBtn);font-size:12px">Recherche locale dans le texte indexé. Les PDF originaux restent disponibles.</p></div>`+
 cats.map(cat=>`<div class="card" style="padding-bottom:5px"><div class="eyebrow">${cat}</div></div>`+
 courses.filter(c=>c.category===cat).map(c=>`<div class="result"><b>${c.title}</b><small>${c.description}</small><button class="choice" data-course="${c.id}" style="margin-top:7px">📖 Ouvrir le PDF</button></div>`).join('')).join('');
 p.querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>{const c=courses.find(x=>x.id===b.dataset.course);window.open('./courses/'+encodeURIComponent(c.file),'_blank')});
 p.querySelector('#courseSearch').oninput=e=>searchCourses(e.target.value);
}
function searchCourses(q){
 const box=document.querySelector('#courseResults'); if(!box)return;
 q=q.trim().toLowerCase(); if(!q){box.innerHTML='';return}
 const hits=[];
 for(const c of courses){const item=courseText.find(x=>x.file===c.file);const t=(item?.text||'').toLowerCase();const pos=t.indexOf(q);
  if(pos>=0){const orig=item.text;hits.push({course:c,excerpt:orig.slice(Math.max(0,pos-180),Math.min(orig.length,pos+360))})}}
 box.innerHTML=hits.length?`<div class="eyebrow" style="margin-top:12px">Résultats</div>`+hits.slice(0,12).map(h=>`<div class="review"><b>${h.course.title}</b><p style="font-size:12px;line-height:1.5;color:#c9d7df">${htmlEscape(h.excerpt)}</p></div>`).join(''):`<div class="review">Aucun résultat trouvé dans les textes indexés.</div>`;
}
function htmlEscape(x){return x.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}



async function renderExamCoursUFV(p){
 let bank=[]; try{bank=await fetch('./src/exam_course_bank.json').then(r=>r.json())}catch(e){}
 if(!bank.length){p.innerHTML='<div class="card"><div class="title">Banque indisponible</div></div>';return}
 const st=JSON.parse(localStorage.getItem('ak14_course_exam')||'{"i":0,"score":0,"answered":0,"errors":[]}');
 let pool=bank;
 const mode=localStorage.getItem('ak15_mode')||'full';
 if(mode==='adaptive' && st.errors?.length){
   const weak=st.errors[st.errors.length-1];
   const focused=bank.filter(x=>x.course===weak);
   if(focused.length) pool=focused;
 }
 const item=pool[st.i%pool.length];
 const same=bank.filter((x,j)=>j!==st.i%bank.length && x.course===item.course);
 const other=bank.filter((x,j)=>j!==st.i%bank.length && x.course!==item.course);
 const pool=[...same,...other].slice(0,3);
 const opts=[item.answer,...pool.map(x=>x.answer)].slice(0,4).sort(()=>Math.random()-.5);
 p.innerHTML=`<div class="card"><div class="eyebrow">EXAMEN UFV · TES COURS</div><div style="display:flex;justify-content:space-between"><span>${item.course}</span><span>${st.score}/${st.answered}</span></div><div class="quizq">${item.question}</div><div id="courseExamOpts"></div><div id="courseExamFeedback"></div></div><div class="card"><div class="eyebrow">ERREURS</div><p style="color:#a9bdc9">${st.errors.slice(-5).join(' · ')||'Aucune erreur enregistrée.'}</p><button class="choice" id="resetCourseExam">↻ Réinitialiser</button></div>`;
 const box=document.querySelector('#courseExamOpts');
 box.innerHTML=opts.map(o=>`<button class="choice course-exam-option">${o}</button>`).join('');
 box.querySelectorAll('.course-exam-option').forEach(b=>b.onclick=()=>{
   box.querySelectorAll('button').forEach(x=>x.disabled=true);
   const ok=b.textContent===item.answer; st.answered++; if(ok)st.score++; else st.errors.push(item.course); st.i++;
   localStorage.setItem('ak14_course_exam',JSON.stringify(st));
   document.querySelector('#courseExamFeedback').innerHTML=`<div class="review"><b>${ok?'✓ Correct':'✗ À revoir'}</b><p><b>Réponse issue du support :</b> ${item.answer}</p><button class="choice" id="nextCourseExam">Continuer</button></div>`;
   document.querySelector('#nextCourseExam').onclick=()=>renderExamCoursUFV(p);
 });
 document.querySelector('#resetCourseExam').onclick=()=>{localStorage.removeItem('ak14_course_exam');renderExamCoursUFV(p)};
}

function renderExamUFV(p){
 const bank=[
  {cat:'Anatomie',q:'Quelle structure relie principalement un muscle à l’os ?',a:'Le tendon',opts:['Le tendon','Le ménisque','Le cartilage','La bourse synoviale']},
  {cat:'Anatomie',q:'Quelle est la fonction principale d’une articulation ?',a:'Permettre et guider le mouvement entre les pièces osseuses',opts:['Produire les globules rouges','Permettre et guider le mouvement entre les pièces osseuses','Produire les hormones','Stocker le calcium uniquement']},
  {cat:'Biomécanique',q:'Quelle grandeur décrit l’effet de rotation d’une force autour d’un axe ?',a:'Le moment de force',opts:['La masse','Le moment de force','La température','La densité']},
  {cat:'Kinésithérapie',q:'Quel est un objectif classique de rééducation ?',a:'Récupérer mobilité, force et contrôle moteur',opts:['Immobiliser systématiquement','Récupérer mobilité, force et contrôle moteur','Éviter tout mouvement','Supprimer toute charge définitivement']},
  {cat:'Physiologie',q:'Quel est le rôle général de l’homéostasie ?',a:'Maintenir l’équilibre interne de l’organisme',opts:['Créer uniquement du mouvement','Maintenir l’équilibre interne de l’organisme','Détruire les tissus','Augmenter systématiquement la température']},
  {cat:'Cellule',q:'Quel processus produit une protéine à partir de l’information portée par l’ARNm ?',a:'La traduction',opts:['La réplication','La traduction','La mitose','La diffusion']},
  {cat:'Anatomie',q:'L’origine et l’insertion d’un muscle permettent notamment de comprendre :',a:'Sa ligne d’action et son rôle dans le mouvement',opts:['Sa couleur','Sa ligne d’action et son rôle dans le mouvement','Son groupe sanguin','Sa température']},
  {cat:'Biomécanique',q:'Une force est une grandeur :',a:'Vectorielle',opts:['Scalaire uniquement','Vectorielle','Sans unité','Toujours constante']}
 ];
 const state=JSON.parse(localStorage.getItem('ak13_exam')||'{"q":0,"score":0,"answered":0,"errors":[],"history":[]}');
 const idx=state.q%bank.length, item=bank[idx];
 p.innerHTML=`<div class="card"><div class="eyebrow">EXAMEN UFV · MODE ADAPTATIF</div>
 <div style="display:flex;justify-content:space-between;gap:8px"><span>Question ${idx+1}/${bank.length}</span><span>Score ${state.score}/${state.answered}</span></div>
 <div class="latin">${item.cat}</div><div class="quizq">${item.q}</div><div id="examOpts"></div><div id="examFeedback"></div></div>
 <div class="card"><div class="eyebrow">TES FAIBLESSES</div><p style="color:#a9bdc9">${state.errors.length?state.errors.slice(-3).join(' · '):'Aucune erreur enregistrée pour le moment.'}</p>
 <button class="choice" id="resetExam">↻ Réinitialiser l’examen</button></div>`;
 const opts=[...item.opts].sort(()=>Math.random()-.5);
 document.querySelector('#examOpts').innerHTML=opts.map(o=>`<button class="choice exam-option">${o}</button>`).join('');
 document.querySelectorAll('.exam-option').forEach(b=>b.onclick=()=>{
   document.querySelectorAll('.exam-option').forEach(x=>x.disabled=true);
   const ok=b.textContent===item.a;
   state.answered++; if(ok)state.score++; else state.errors.push(item.cat);
   state.history.push({category:item.cat,correct:ok});
   state.q++;
   localStorage.setItem('ak13_exam',JSON.stringify(state));
   document.querySelector('#examFeedback').innerHTML=`<div class="review"><b>${ok?'✓ Bonne réponse':'✗ À revoir'}</b><p>Réponse : ${item.a}</p><button class="choice" id="nextExam">Question suivante</button></div>`;
   document.querySelector('#nextExam').onclick=()=>renderExamUFV(p);
 });
 document.querySelector('#resetExam').onclick=()=>{localStorage.removeItem('ak13_exam');renderExamUFV(p)};
}
function renderQuiz(p){
 const mode=localStorage.getItem('ak9_quiz_mode')||'anatomy';
 p.innerHTML=`<div class="card"><div class="eyebrow">Révision active</div><div style="display:flex;gap:6px;margin:8px 0"><button class="choice" id="qAnat">Anatomie</button><button class="choice" id="qCours">Mes cours</button></div><div id="quizBody"></div></div>`;
 document.querySelector('#qAnat').onclick=()=>{localStorage.setItem('ak9_quiz_mode','anatomy');renderQuiz(p)};
 document.querySelector('#qCours').onclick=()=>{localStorage.setItem('ak9_quiz_mode','cours');renderQuiz(p)};
 const body=document.querySelector('#quizBody');
 if(mode==='cours'){
  const qs=[
   {q:"Selon le support de Fondements de la kinésithérapie, que signifie « kinesis » ?",a:["Mouvement","Douleur","Force"],ok:0},
   {q:"Quel exemple appartient aux agents mécaniques dans le support de Fondements ?",a:["Traction","TENS","Hot pack"],ok:0},
   {q:"Quel objectif thérapeutique est cité dans le support de Fondements ?",a:["Récupération maximale de la force, mobilité et coordination","Augmentation de la taille osseuse","Suppression de l'activité musculaire"],ok:0},
   {q:"Quel sujet correspond au cours de physiologie cellulaire intégré ?",a:["Synthèse des protéines et division cellulaire","Anatomie du membre inférieur","Agents physiques"],ok:0},
   {q:"Quel sujet correspond au cours de biomécanique Analyse du mouvement et magnitudes ?",a:["Analyse du mouvement et grandeurs biomécaniques","Synthèse des protéines","Système nerveux autonome"],ok:0}
  ];
  const st=JSON.parse(localStorage.getItem('ak9_course_quiz')||'{"i":0,"score":0}');const item=qs[st.i%qs.length];
  body.innerHTML=`<div class="progress"><i style="width:${((st.i%qs.length)/qs.length)*100}%"></i></div><div class="quizq">${item.q}</div>${item.a.map((x,i)=>`<button class="choice" data-q="${i}">${x}</button>`).join('')}<div class="field"><b>Score</b><p>${st.score} bonne(s) réponse(s)</p></div>`;
  body.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const ok=Number(b.dataset.q)===item.ok;b.classList.add(ok?'ok':'no');if(ok)st.score++;st.i++;localStorage.setItem('ak9_course_quiz',JSON.stringify(st));setTimeout(()=>renderQuiz(p),500)});
  return;
 }
 const pool=localMuscles;const st=JSON.parse(localStorage.getItem('ak6_quiz')||'{"i":0,"score":0}');const m=pool[st.i%pool.length];
 const opts=[m.action,pool[(st.i+3)%pool.length].action,pool[(st.i+7)%pool.length].action].sort(()=>Math.random()-.5);
 body.innerHTML=`<div class="progress"><i style="width:${((st.i%pool.length)/pool.length)*100}%"></i></div><div class="title">${m.fr}</div><div class="quizq">Quelle proposition correspond à l’action principale de ce muscle ?</div>${opts.map(x=>`<button class="choice" data-v="${encodeURIComponent(x)}">${x}</button>`).join('')}<div class="field"><b>Score</b><p>${st.score} bonne(s) réponse(s)</p></div>`;
 body.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{const ok=decodeURIComponent(b.dataset.v)===m.action;b.classList.add(ok?'ok':'no');if(ok)st.score++;st.i++;localStorage.setItem('ak6_quiz',JSON.stringify(st));setTimeout(()=>renderQuiz(p),450)});
}
document.querySelector('#systems').className='sysnav';
for(const [k,s] of Object.entries(systems)){const b=document.createElement('button');b.className='sys '+(k===activeSystem?'active':'');b.textContent=s.icon+' '+s.label;b.onclick=()=>{activeSystem=k;document.querySelectorAll('.sys').forEach(x=>x.classList.remove('active'));b.classList.add('active');loadSystem(k)};document.querySelector('#systems').appendChild(b)}
document.querySelector('#search').addEventListener('input',e=>search(e.target.value));
document.querySelector('#clear').onclick=()=>{document.querySelector('#search').value='';renderPanel()};
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');tab=b.dataset.tab;renderPanel()});
document.querySelector('#front').onclick=()=>{camera.position.set(0,1.1,4.2);controls.target.set(0,1,0);controls.update()};
document.querySelector('#back').onclick=()=>{camera.position.set(0,1.1,-4.2);controls.target.set(0,1,0);controls.update()};
document.querySelector('#reset').onclick=()=>{if(imported?.scene)frame(imported.scene);else document.querySelector('#front').click()};
document.querySelector('#isolate').onclick=isolateCurrent;
document.querySelector('#all').onclick=()=>{root.traverse(o=>o.visible=true);status('Toutes les structures affichées')};
document.querySelector('#ghost').onclick=()=>{transparent=!transparent;root.traverse(o=>{if(o.isMesh){o.material.transparent=transparent;o.material.opacity=transparent?.22:1}});status(transparent?'Mode transparence':'Mode opaque')};
loadSystem('muscles');renderPanel();
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}animate();
addEventListener('resize',()=>{renderer.setSize(sceneEl.clientWidth,sceneEl.clientHeight);camera.aspect=sceneEl.clientWidth/sceneEl.clientHeight;camera.updateProjectionMatrix()});

let courseMap=[];
fetch('./src/course_map.json').then(r=>r.json()).then(x=>{courseMap=x;}).catch(()=>{});


function applyPending3DFocus(){
 const wanted=localStorage.getItem('ak18_focus_structure');
 if(!wanted) return;
 const needle=wanted.toLowerCase();
 try{
   const candidates=(typeof scene!=='undefined' && scene.children)?scene.children:[];
   let found=null;
   candidates.forEach(o=>{if(found)return;const n=(o.name||'').toLowerCase();if(n===needle||n.includes(needle)||needle.includes(n))found=o});
   if(found){
     if(typeof selectedObject!=='undefined') selectedObject=found;
     if(typeof isolateObject==='function') isolateObject(found);
     if(typeof centerOn==='function') centerOn(found);
   }
 }catch(e){}
 localStorage.removeItem('ak18_focus_structure');
}

document.addEventListener('click',e=>{
 if(e.target.closest('[data-tab="anatomy"]')) setTimeout(()=>applyPending3DFocus(),250);
});


/* ===== V22 — Mouvement ↔ muscles ↔ articulation ↔ clinique ===== */
(function(){
  const V22 = {
    movements: {
      {"flexion_coude": {"label": "Flexion du coude", "joint": "Coude", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Biceps brachial", "Brachial", "Brachio-radial"], "antagonists": ["Triceps brachial", "Anconé"], "structures": ["elbow"], "clinical": "Rapprocher l'avant-bras du bras ; utile pour l'analyse des activités fonctionnelles et le renforcement des fléchisseurs."}, "extension_coude": {"label": "Extension du coude", "joint": "Coude", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Triceps brachial", "Anconé"], "antagonists": ["Biceps brachial", "Brachial"], "structures": ["elbow"], "clinical": "Retour vers l'alignement du coude ; importante pour les transferts, appuis et gestes de poussée."}, "flexion_epaule": {"label": "Flexion de l'épaule", "joint": "Glenohumérale", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Deltoïde antérieur", "Grand pectoral (faisceau claviculaire)", "Coraco-brachial"], "antagonists": ["Deltoïde postérieur", "Grand dorsal"], "structures": ["glenohumeral"], "clinical": "Élever le bras vers l'avant ; analyser l'amplitude, le rythme scapulo-huméral et la douleur."}, "abduction_epaule": {"label": "Abduction de l'épaule", "joint": "Glenohumérale", "plane": "Frontal", "axis": "Sagittal", "prime_movers": ["Deltoïde moyen", "Supra-épineux"], "antagonists": ["Grand pectoral", "Grand dorsal"], "structures": ["glenohumeral"], "clinical": "Éloigner le bras du tronc ; utile pour l'évaluation de l'épaule et du rythme scapulo-huméral."}, "extension_hanche": {"label": "Extension de la hanche", "joint": "Coxo-fémorale", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Grand fessier", "Ischio-jambiers"], "antagonists": ["Ilio-psoas", "Droit fémoral"], "structures": ["hip"], "clinical": "Propulsion, montée d'escaliers et passage assis-debout ; surveiller le contrôle du bassin."}, "flexion_hanche": {"label": "Flexion de la hanche", "joint": "Coxo-fémorale", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Ilio-psoas", "Droit fémoral", "Sartorius"], "antagonists": ["Grand fessier", "Ischio-jambiers"], "structures": ["hip"], "clinical": "Ramener la cuisse vers le tronc ; importante pour la marche, les escaliers et les transferts."}, "extension_genou": {"label": "Extension du genou", "joint": "Genou", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Quadriceps fémoral"], "antagonists": ["Ischio-jambiers"], "structures": ["knee", "ACL", "PCL"], "clinical": "Phase d'appui, montée d'escaliers et lever de chaise ; le quadriceps est central dans la rééducation fonctionnelle."}, "flexion_genou": {"label": "Flexion du genou", "joint": "Genou", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Ischio-jambiers", "Gastrocnémien", "Sartorius"], "antagonists": ["Quadriceps fémoral"], "structures": ["knee", "ACL", "PCL"], "clinical": "Raccourcir le membre inférieur en phase oscillante et lors des transferts ; contrôler la mobilité et la force."}, "dorsiflexion_cheville": {"label": "Dorsiflexion de la cheville", "joint": "Talo-crurale", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Tibial antérieur", "Extenseur long des orteils", "Extenseur long de l'hallux"], "antagonists": ["Triceps sural"], "structures": ["ankle", "ATFL"], "clinical": "Essentielle pour le passage du pied en phase oscillante et pour la progression du tibia au-dessus du pied."}, "flexion_plantaire_cheville": {"label": "Flexion plantaire de la cheville", "joint": "Talo-crurale", "plane": "Sagittal", "axis": "Transversal", "prime_movers": ["Gastrocnémien", "Soléaire"], "antagonists": ["Tibial antérieur"], "structures": ["ankle", "ATFL"], "clinical": "Propulsion et montée sur la pointe ; évaluer force, endurance et contrôle unipodal."}}
    }
  };
  const storeKey="ak22_movement_mastery";
  function getMastery(){ try{return JSON.parse(localStorage.getItem(storeKey)||"{}")}catch(e){return {}} }
  function setMastery(x){localStorage.setItem(storeKey,JSON.stringify(x))}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function card(p){
    const d=p.data, m=getMastery(), done=!!m[p.id];
    return `<div class="study-card" style="padding:18px;border-radius:16px;border:1px solid rgba(127,127,127,.25);margin:12px 0">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
        <h3 style="margin:0">${esc(d.label)}</h3>
        <span style="opacity:.75">${done?"✓ Maîtrisé":"À étudier"}</span>
      </div>
      <p><b>Articulation :</b> ${esc(d.joint)} · <b>Plan :</b> ${esc(d.plane)} · <b>Axe :</b> ${esc(d.axis)}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">
        <div><b>Moteurs principaux</b><ul>${d.prime_movers.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
        <div><b>Antagonistes</b><ul>${d.antagonists.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
      </div>
      <p><b>Application kiné :</b> ${esc(d.clinical)}</p>
      <button class="primary" data-ak22-master="${esc(p.id)}">${done?"Réviser à nouveau":"Marquer comme maîtrisé"}</button>
    </div>`
  }
  function render(p){
    const root=p?.root || document.querySelector("#app") || document.body;
    const arr=Object.entries(V22.movements);
    root.innerHTML=`<div class="page">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">
        <div><h2>Laboratoire du mouvement — V22</h2>
        <p style="opacity:.8">Relie le mouvement à l’articulation, au plan, à l’axe, aux muscles moteurs et aux antagonistes.</p></div>
        <button class="secondary" data-ak22-back>Retour</button>
      </div>
      <div id="ak22-list">${arr.map(([id,data])=>card({id,data})).join("")}</div>
      <div style="margin-top:18px;padding:16px;border-radius:16px;background:rgba(127,127,127,.08)">
        <b>Objectif de révision</b>
        <div id="ak22-count"></div>
      </div>
    </div>`;
    const refresh=()=>{
      const m=getMastery();
      root.querySelector("#ak22-count").textContent=`${Object.keys(m).filter(k=>V22.movements[k]).length}/${arr.length} mouvements maîtrisés`;
      root.querySelectorAll("[data-ak22-master]").forEach(b=>b.onclick=()=>{
        const x=getMastery(); x[b.dataset.ak22Master]=true; setMastery(x); render(p);
      });
    };
    refresh();
    root.querySelector("[data-ak22-back]")?.addEventListener("click",()=>{ if(typeof window.renderDashboard==="function") window.renderDashboard(); else location.reload(); });
  }
  function addButton(){
    // Adds a dedicated entry if a dashboard button container exists.
    const candidates=[...document.querySelectorAll("button,a")];
    const exists=candidates.some(x=>/Laboratoire des mouvements/i.test(x.textContent||""));
    if(exists) return;
    const btn=document.createElement("button");
    btn.className="secondary";
    btn.textContent="Laboratoire du mouvement V22";
    btn.onclick=()=>render({root:document.querySelector("#app")||document.body});
    const host=document.querySelector("main")||document.querySelector("#app")||document.body;
    host.appendChild(btn);
  }
  window.renderMovementLabV22=render;
  window.ak22MovementMap=V22.movements;
  window.ak22AddEntry=addButton;
  window.addEventListener("DOMContentLoaded",()=>setTimeout(addButton,500));
})();


/* ===== V23 — Parcours articulation → mouvement → muscles → ligaments → rééducation ===== */
(function(){
  const AK23 = { pathways: {"shoulder": {"label": "Épaule — articulation gléno-humérale", "joint": "glenohumeral", "movements": ["flexion_epaule", "abduction_epaule", "rotation_mediale_epaule", "rotation_laterale_epaule"], "ligaments": ["ligament gléno-huméral supérieur", "ligament gléno-huméral moyen", "ligament gléno-huméral inférieur", "ligament coraco-huméral"], "muscles": ["Deltoïde antérieur", "Deltoïde moyen", "Supra-épineux", "Infra-épineux", "Subscapulaire", "Petit rond", "Grand pectoral", "Grand dorsal"], "clinical": ["douleur d'épaule", "raideur gléno-humérale", "déficit de contrôle scapulo-huméral"], "exercises": ["élévation active assistée", "rotation externe avec résistance légère", "travail de contrôle scapulaire", "renforcement progressif du deltoïde et de la coiffe"], "questions": [["Quel muscle initie principalement l'abduction de l'épaule ?", "Supra-épineux"], ["Quel muscle est un rotateur latéral de l'épaule ?", "Infra-épineux"], ["Dans quel plan se fait principalement l'abduction ?", "Frontal"]]}, "elbow": {"label": "Coude", "joint": "elbow", "movements": ["flexion_coude", "extension_coude"], "ligaments": ["ligament collatéral ulnaire", "ligament collatéral radial", "ligament annulaire du radius"], "muscles": ["Biceps brachial", "Brachial", "Brachio-radial", "Triceps brachial", "Anconé"], "clinical": ["raideur post-traumatique", "déficit de force en flexion/extension", "instabilité ligamentaire"], "exercises": ["mobilité active progressive", "flexion du coude avec résistance graduée", "extension du coude avec résistance graduée", "travail fonctionnel de poussée et de tirage"], "questions": [["Quel est le principal extenseur du coude ?", "Triceps brachial"], ["Quel muscle participe fortement à la flexion du coude ?", "Brachial"], ["Le coude réalise principalement flexion-extension dans quel plan ?", "Sagittal"]]}, "hip": {"label": "Hanche — articulation coxo-fémorale", "joint": "hip", "movements": ["flexion_hanche", "extension_hanche"], "ligaments": ["ligament ilio-fémoral", "ligament pubo-fémoral", "ligament ischio-fémoral"], "muscles": ["Ilio-psoas", "Droit fémoral", "Grand fessier", "Ischio-jambiers", "Moyen fessier"], "clinical": ["déficit de force des extenseurs", "trouble du contrôle frontal du bassin", "récupération fonctionnelle après chirurgie ou traumatisme"], "exercises": ["pont fessier", "extension de hanche en chaîne ouverte", "abduction de hanche avec résistance", "assis-debout"], "questions": [["Quel muscle est un puissant extenseur de hanche ?", "Grand fessier"], ["Quel groupe musculaire contribue à l'extension de hanche ?", "Ischio-jambiers"], ["Quel plan correspond principalement à la flexion-extension de hanche ?", "Sagittal"]]}, "knee": {"label": "Genou", "joint": "knee", "movements": ["flexion_genou", "extension_genou"], "ligaments": ["ACL", "PCL", "MCL", "LCL"], "muscles": ["Quadriceps fémoral", "Ischio-jambiers", "Gastrocnémien", "Poplité"], "clinical": ["rééducation après entorse", "déficit du quadriceps", "instabilité ligamentaire", "récupération fonctionnelle après chirurgie"], "exercises": ["contractions isométriques du quadriceps", "élévation de jambe tendue", "chaîne fermée progressive", "travail d'équilibre et contrôle du genou"], "questions": [["Quel groupe musculaire réalise principalement l'extension du genou ?", "Quadriceps fémoral"], ["Quel ligament est classiquement appelé LCA ?", "ACL"], ["Dans quel plan se fait principalement la flexion-extension du genou ?", "Sagittal"]]}, "ankle": {"label": "Cheville — articulation talo-crurale", "joint": "ankle", "movements": ["dorsiflexion_cheville", "flexion_plantaire_cheville"], "ligaments": ["ATFL", "ligament calcanéo-fibulaire", "ligament deltoïde"], "muscles": ["Tibial antérieur", "Gastrocnémien", "Soléaire", "Tibial postérieur", "Fibulaires"], "clinical": ["entorse latérale", "déficit de dorsiflexion", "déficit de contrôle unipodal"], "exercises": ["mobilité en dorsiflexion", "élévations sur pointes", "renforcement des fibulaires", "équilibre unipodal progressif"], "questions": [["Quel muscle est un dorsiflexeur majeur ?", "Tibial antérieur"], ["Quels muscles participent fortement à la flexion plantaire ?", "Gastrocnémien et soléaire"], ["Quel ligament est fréquemment concerné dans l'entorse latérale ?", "ATFL"]]}} };
  const KEY="ak23_clinical_mastery";
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}};
  const save=x=>localStorage.setItem(KEY,JSON.stringify(x));

  function renderPathway(id, root){
    const p=AK23.pathways[id], m=load();
    root.innerHTML=`<div class="page">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">
        <div><h2>${esc(p.label)}</h2><p style="opacity:.8">Parcours clinique : articulation → mouvement → muscles → ligaments → rééducation.</p></div>
        <button class="secondary" id="ak23-back">Retour</button>
      </div>

      <section class="study-card" style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:14px 0">
        <h3>1 · Mouvements</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">${p.movements.map(x=>`<span style="padding:7px 10px;border-radius:10px;background:rgba(127,127,127,.1)">${esc(x.replaceAll("_"," "))}</span>`).join("")}</div>
      </section>

      <section class="study-card" style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:14px 0">
        <h3>2 · Muscles clés</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px">${p.muscles.map(x=>`<div style="padding:10px;border-radius:10px;background:rgba(127,127,127,.07)">${esc(x)}</div>`).join("")}</div>
      </section>

      <section class="study-card" style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:14px 0">
        <h3>3 · Ligaments / stabilisateurs</h3>
        <ul>${p.ligaments.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      </section>

      <section class="study-card" style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:14px 0">
        <h3>4 · Situations de rééducation</h3>
        <ul>${p.clinical.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      </section>

      <section class="study-card" style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:14px 0">
        <h3>5 · Exercices / axes de travail</h3>
        <ul>${p.exercises.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        <p style="opacity:.75">Les exercices sont des exemples pédagogiques : leur choix réel dépend du bilan, de la douleur, de la phase de récupération et des contre-indications.</p>
      </section>

      <section class="study-card" style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:14px 0">
        <h3>6 · Mini-quiz clinique</h3>
        ${p.questions.map((q,i)=>`<div style="margin:14px 0;padding:12px;border-radius:12px;background:rgba(127,127,127,.06)">
          <b>${i+1}. ${esc(q[0])}</b>
          <details style="margin-top:8px"><summary>Afficher la réponse</summary><p><b>${esc(q[1])}</b></p></details>
        </div>`).join("")}
      </section>

      <button class="primary" id="ak23-master">${m[id]?"✓ Parcours maîtrisé — réviser":"Marquer ce parcours comme maîtrisé"}</button>
    </div>`;
    root.querySelector("#ak23-back")?.addEventListener("click",()=>window.renderDashboardV22?window.renderDashboardV22():location.reload());
    root.querySelector("#ak23-master")?.addEventListener("click",()=>{
      const x=load(); x[id]=true; save(x); renderPathway(id,root);
    });
  }

  function renderHub(root){
    const m=load(), ids=Object.keys(AK23.pathways);
    root.innerHTML=`<div class="page">
      <h2>Parcours clinique V23</h2>
      <p style="opacity:.8">Étudie une articulation comme en raisonnement kiné : structure → mouvement → muscles → stabilisation → rééducation → quiz.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px">
      ${ids.map(id=>{const p=AK23.pathways[id];return `<button class="secondary" data-ak23-open="${id}" style="text-align:left;padding:18px;border-radius:16px">
        <b>${esc(p.label)}</b><br><small>${m[id]?"✓ Maîtrisé":"À étudier"} · ${p.movements.length} mouvements · ${p.muscles.length} muscles</small>
      </button>`}).join("")}</div>
      <div style="margin-top:18px;padding:16px;border-radius:16px;background:rgba(127,127,127,.08)">
        <b>Progression</b><p>${ids.filter(x=>m[x]).length}/${ids.length} parcours maîtrisés.</p>
      </div>
    </div>`;
    root.querySelectorAll("[data-ak23-open]").forEach(b=>b.onclick=()=>renderPathway(b.dataset.ak23Open,root));
  }

  window.renderClinicalPathwaysV23=()=>renderHub(document.querySelector("#app")||document.body);

  // Add an entry to the dashboard if the current app doesn't already expose V23.
  function addEntry(){
    const all=[...document.querySelectorAll("button,a")];
    if(all.some(x=>/Parcours clinique V23/i.test(x.textContent||""))) return;
    const btn=document.createElement("button");
    btn.className="secondary"; btn.textContent="Parcours clinique V23";
    btn.onclick=window.renderClinicalPathwaysV23;
    (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(btn);
  }
  window.addEventListener("DOMContentLoaded",()=>setTimeout(addEntry,700));
})();


/* ===== V24 — Évaluation clinique interactive + répétition espacée locale ===== */
(function(){
 const Q=[{"q": "Un patient présente une limitation de dorsiflexion de cheville. Quel mouvement doit être évalué en priorité ?", "a": "Dorsiflexion", "topic": "Cheville"}, {"q": "Lors de l'extension du genou, quel groupe musculaire est moteur principal ?", "a": "Quadriceps fémoral", "topic": "Genou"}, {"q": "L'abduction de l'épaule se déroule principalement dans quel plan ?", "a": "Frontal", "topic": "Épaule"}, {"q": "Quel muscle est un extenseur majeur de la hanche ?", "a": "Grand fessier", "topic": "Hanche"}, {"q": "Quel muscle est le principal extenseur du coude ?", "a": "Triceps brachial", "topic": "Coude"}, {"q": "Quel ligament est classiquement associé à l'entorse latérale de cheville ?", "a": "ATFL", "topic": "Cheville"}, {"q": "Quel groupe musculaire s'oppose principalement à l'extension du genou ?", "a": "Ischio-jambiers", "topic": "Genou"}, {"q": "La flexion-extension du coude se fait principalement autour de quel axe ?", "a": "Transversal", "topic": "Coude"}, {"q": "Quel muscle participe à la rotation latérale de l'épaule ?", "a": "Infra-épineux", "topic": "Épaule"}, {"q": "Quel ligament est appelé LCA en français ?", "a": "ACL", "topic": "Genou"}, {"q": "Quel muscle est un dorsiflexeur majeur de la cheville ?", "a": "Tibial antérieur", "topic": "Cheville"}, {"q": "Quel mouvement rapproche un membre du plan médian ?", "a": "Adduction", "topic": "Mouvement"}], KEY="ak24_quiz";
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"seen":0,"correct":0,"wrong":0,"weak":{}}')}catch(e){return {seen:0,correct:0,wrong:0,weak:{}}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 function render(root){
   let s=load(), i=Math.floor(Math.random()*Q.length), q=Q[i], answered=false;
   root.innerHTML=`<div class="page">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
      <div><h2>Évaluation clinique V24</h2><p style="opacity:.8">Questions courtes, correction immédiate et suivi des points faibles.</p></div>
      <button class="secondary" id="ak24-home">Retour</button>
    </div>
    <div style="margin:12px 0;padding:14px;border-radius:14px;background:rgba(127,127,127,.08)">
      <b>Progression</b> · ${s.correct}/${s.seen} correctes · ${s.wrong} erreurs
    </div>
    <section style="padding:20px;border-radius:18px;border:1px solid rgba(127,127,127,.25)">
      <small>${esc(q.topic)}</small><h3>${esc(q.q)}</h3>
      <input id="ak24-answer" autocomplete="off" placeholder="Ta réponse…" style="width:100%;box-sizing:border-box;padding:13px;border-radius:12px;border:1px solid rgba(127,127,127,.3)">
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
        <button class="primary" id="ak24-check">Corriger</button>
        <button class="secondary" id="ak24-skip">Voir la réponse</button>
      </div>
      <div id="ak24-feedback" style="margin-top:14px"></div>
    </section>
    <section style="margin-top:16px;padding:16px;border-radius:16px;background:rgba(127,127,127,.06)">
      <h3>Points à revoir</h3>
      <div>${Object.entries(s.weak).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>`<span style="display:inline-block;margin:4px;padding:7px 10px;border-radius:10px;background:rgba(220,80,80,.12)">${esc(k)} · ${v}</span>`).join("") || "Aucun point faible enregistré."}</div>
    </section>
   </div>`;
   const feedback=root.querySelector("#ak24-feedback");
   function answer(ok){
     if(answered)return; answered=true;
     s.seen++;
     if(ok)s.correct++; else {s.wrong++;s.weak[q.topic]=(s.weak[q.topic]||0)+1;}
     save(s);
     feedback.innerHTML=ok?`<div style="padding:12px;border-radius:12px;background:rgba(50,180,100,.12)"><b>✓ Correct.</b> Continue.</div>`:
       `<div style="padding:12px;border-radius:12px;background:rgba(220,80,80,.12)"><b>À revoir.</b><br>Réponse attendue : <b>${esc(q.a)}</b></div>`;
     setTimeout(()=>render(root),900);
   }
   root.querySelector("#ak24-check").onclick=()=>{
     const val=(root.querySelector("#ak24-answer").value||"").trim().toLowerCase();
     const expected=q.a.toLowerCase();
     answer(val===expected || expected.includes(val) && val.length>3);
   };
   root.querySelector("#ak24-skip").onclick=()=>answer(false);
   root.querySelector("#ak24-home").onclick=()=>{if(window.renderDashboard)window.renderDashboard();else location.reload()};
 }
 window.renderClinicalQuizV24=()=>render(document.querySelector("#app")||document.body);
 function addEntry(){
   const els=[...document.querySelectorAll("button,a")];
   if(els.some(x=>/Évaluation clinique V24/i.test(x.textContent||"")))return;
   const b=document.createElement("button"); b.className="secondary"; b.textContent="Évaluation clinique V24"; b.onclick=window.renderClinicalQuizV24;
   (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(b);
 }
 window.addEventListener("DOMContentLoaded",()=>setTimeout(addEntry,850));
})();


/* ===== V25 — Simulateur de cas clinique kiné ===== */
(function(){
 const CASES=[{"id": "ankle_sprain", "title": "Entorse latérale de cheville", "region": "Cheville", "phase": "J10 — récupération précoce", "findings": ["douleur à la marche", "œdème", "mobilité diminuée"], "goals": ["récupérer la dorsiflexion", "restaurer la mobilité", "renforcer les stabilisateurs", "réentraîner l'équilibre"], "tests": ["amplitude de dorsiflexion", "appui unipodal selon tolérance", "force des fibulaires", "contrôle dynamique"], "progression": ["mobilité active", "renforcement progressif", "proprioception", "tâches fonctionnelles"], "warning": "La progression doit rester adaptée à la douleur, à la stabilité et aux consignes médicales."}, {"id": "knee_acl", "title": "Rééducation après lésion du LCA", "region": "Genou", "phase": "phase à individualiser", "findings": ["déficit d'extension ou flexion", "faiblesse du quadriceps", "déficit de contrôle du membre inférieur"], "goals": ["récupérer les amplitudes", "restaurer la force", "améliorer le contrôle neuromusculaire", "reprendre progressivement les tâches fonctionnelles"], "tests": ["amplitude", "force quadriceps", "contrôle unipodal", "qualité du mouvement"], "progression": ["mobilité", "isométriques puis renforcement", "chaîne fermée progressive", "proprioception et tâches fonctionnelles"], "warning": "Après chirurgie, respecter le protocole du chirurgien et du kinésithérapeute."}, {"id": "shoulder_stiffness", "title": "Raideur d'épaule", "region": "Épaule", "phase": "évaluation initiale", "findings": ["élévation limitée", "rotation limitée", "gêne fonctionnelle"], "goals": ["identifier les amplitudes limitées", "réduire la gêne", "récupérer progressivement la mobilité", "restaurer la fonction"], "tests": ["flexion", "abduction", "rotations", "observation du rythme scapulo-huméral"], "progression": ["mobilité active assistée", "mobilité active", "contrôle scapulaire", "renforcement progressif"], "warning": "La cause de la raideur doit guider la prise en charge ; éviter de forcer une articulation douloureuse sans indication."}], KEY="ak25_cases";
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 function render(root){
  const done=load();
  root.innerHTML=`<div class="page">
   <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
    <div><h2>Simulateur de cas clinique V25</h2><p style="opacity:.8">Travaille le raisonnement : bilan → objectifs → évaluation → progression.</p></div>
    <button class="secondary" id="ak25-back">Retour</button>
   </div>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-top:16px">
    ${CASES.map(c=>`<button class="secondary" data-case="${c.id}" style="text-align:left;padding:18px;border-radius:16px">
      <b>${esc(c.title)}</b><br><small>${esc(c.region)} · ${esc(c.phase)} ${done[c.id]?"· ✓ étudié":""}</small>
    </button>`).join("")}
   </div>
  </div>`;
  root.querySelectorAll("[data-case]").forEach(b=>b.onclick=()=>show(CASES.find(c=>c.id===b.dataset.case),root));
  root.querySelector("#ak25-back").onclick=()=>{if(window.renderDashboard)window.renderDashboard();else location.reload()};
 }
 function show(c,root){
  root.innerHTML=`<div class="page">
   <button class="secondary" id="ak25-list">← Cas</button>
   <h2>${esc(c.title)}</h2><p><b>Région :</b> ${esc(c.region)} · <b>Phase :</b> ${esc(c.phase)}</p>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:12px 0"><h3>Données du cas</h3><ul>${c.findings.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:12px 0">
    <h3>À toi de raisonner</h3>
    <p>Avant de regarder la correction, choisis les objectifs prioritaires.</p>
    <div id="ak25-goals">${c.goals.map((x,i)=>`<label style="display:block;margin:8px 0"><input type="checkbox" data-goal="${i}"> ${esc(x)}</label>`).join("")}</div>
    <button class="primary" id="ak25-correct">Afficher la correction</button>
    <div id="ak25-feedback" style="margin-top:14px"></div>
   </section>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:12px 0">
    <h3>Bilan à envisager</h3><ul>${c.tests.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
   </section>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:12px 0">
    <h3>Progression pédagogique</h3><ol>${c.progression.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
    <p style="opacity:.75"><b>Important :</b> ${esc(c.warning)}</p>
   </section>
  </div>`;
  root.querySelector("#ak25-list").onclick=()=>render(root);
  root.querySelector("#ak25-correct").onclick=()=>{
    const chosen=[...root.querySelectorAll("[data-goal]:checked")].map(x=>+x.dataset.goal);
    const missing=c.goals.map((_,i)=>i).filter(i=>!chosen.includes(i));
    const score=Math.round(((c.goals.length-missing.length)/c.goals.length)*100);
    const s=load();s[c.id]=true;save(s);
    root.querySelector("#ak25-feedback").innerHTML=`<div style="padding:14px;border-radius:12px;background:rgba(127,127,127,.09)">
      <b>Auto-évaluation : ${score}%</b><br>
      Objectifs clés : ${c.goals.map(esc).join(" · ")}
      ${missing.length?`<br><small>À revoir : ${missing.map(i=>esc(c.goals[i])).join(" · ")}</small>`:"<br>✓ Tous les objectifs ont été sélectionnés."}
    </div>`;
  };
 }
 window.renderClinicalCasesV25=()=>render(document.querySelector("#app")||document.body);
 function add(){if([...document.querySelectorAll("button,a")].some(x=>/Simulateur de cas clinique V25/i.test(x.textContent||"")))return;
  const b=document.createElement("button");b.className="secondary";b.textContent="Simulateur de cas clinique V25";b.onclick=window.renderClinicalCasesV25;
  (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(b)}
 window.addEventListener("DOMContentLoaded",()=>setTimeout(add,950));
})();


/* ===== V26 — Fiches cliniques de structure + mini-bilan ===== */
(function(){
 const DATA={"quadriceps": {"label": "Quadriceps fémoral", "type": "Muscle", "region": "Cuisse antérieure", "origin": "Droit fémoral : EIAI et région supra-acétabulaire ; vastes : fémur selon leurs insertions proximales.", "insertion": "Patella puis tubérosité tibiale via le ligament patellaire.", "innervation": "Nerf fémoral (L2-L4).", "action": "Extension du genou ; le droit fémoral participe aussi à la flexion de hanche.", "clinical": ["déficit de force après immobilisation ou chirurgie du genou", "contrôle du membre inférieur", "fonction assis-debout et escaliers"], "tests": ["extension active du genou", "force contre résistance", "qualité du contrôle en chaîne fermée"], "redflags": ["douleur importante ou inhabituelle", "gonflement aigu important", "blocage articulaire"]}, "biceps_brachii": {"label": "Biceps brachial", "type": "Muscle", "region": "Bras antérieur", "origin": "Chef long : tubercule supraglénoïdal ; chef court : processus coracoïde.", "insertion": "Tubérosité du radius et aponévrose bicipitale.", "innervation": "Nerf musculo-cutané (C5-C6).", "action": "Flexion du coude et supination de l'avant-bras ; participation à la flexion de l'épaule.", "clinical": ["déficit de flexion du coude", "travail fonctionnel de tirage", "contrôle de la supination"], "tests": ["flexion contre résistance", "supination contre résistance"], "redflags": ["douleur aiguë après effort avec perte brutale de force", "déformation inhabituelle"]}, "tibialis_anterior": {"label": "Tibial antérieur", "type": "Muscle", "region": "Jambe antérieure", "origin": "Condyle latéral et face latérale du tibia, membrane interosseuse.", "insertion": "Face médiale du pied, notamment base du premier métatarsien et cunéiforme médial.", "innervation": "Nerf fibulaire profond (L4-L5).", "action": "Dorsiflexion et inversion du pied.", "clinical": ["déficit de dorsiflexion", "contrôle du pied en phase oscillante", "rééducation après entorse"], "tests": ["dorsiflexion contre résistance", "observation du passage du pas"], "redflags": ["déficit neurologique nouveau", "faiblesse brutale"]}}, KEY="ak26_structures";
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));

 function render(root){
  const done=load();
  root.innerHTML=`<div class="page">
   <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
    <div><h2>Fiches cliniques — V26</h2><p style="opacity:.8">Passe de l'anatomie pure à l'analyse clinique d'une structure.</p></div>
    <button class="secondary" id="ak26-back">Retour</button>
   </div>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:16px">
    ${Object.entries(DATA).map(([id,d])=>`<button class="secondary" data-ak26="${id}" style="text-align:left;padding:18px;border-radius:16px">
      <b>${esc(d.label)}</b><br><small>${esc(d.region)} · ${done[id]?"✓ étudiée":"à étudier"}</small>
    </button>`).join("")}
   </div>
  </div>`;
  root.querySelectorAll("[data-ak26]").forEach(b=>b.onclick=()=>show(b.dataset.ak26,root));
  root.querySelector("#ak26-back").onclick=()=>{if(window.renderDashboard)window.renderDashboard();else location.reload()};
 }
 function show(id,root){
  const d=DATA[id], done=load()[id];
  root.innerHTML=`<div class="page">
   <button class="secondary" id="ak26-list">← Structures</button>
   <h2>${esc(d.label)}</h2><p><b>${esc(d.type)}</b> · ${esc(d.region)}</p>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">
    <section style="padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:16px"><h3>Origine</h3><p>${esc(d.origin)}</p></section>
    <section style="padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:16px"><h3>Insertion</h3><p>${esc(d.insertion)}</p></section>
    <section style="padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:16px"><h3>Innervation</h3><p>${esc(d.innervation)}</p></section>
    <section style="padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:16px"><h3>Action</h3><p>${esc(d.action)}</p></section>
   </div>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin-top:14px">
    <h3>Application kiné</h3><ul>${d.clinical.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
   </section>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin-top:14px">
    <h3>Mini-bilan</h3><ul>${d.tests.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
   </section>
   <section style="padding:18px;border:1px solid rgba(220,80,80,.25);border-radius:16px;margin-top:14px">
    <h3>Points de vigilance</h3><ul>${d.redflags.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    <p style="opacity:.7">Ces éléments sont pédagogiques et ne remplacent pas un bilan clinique complet.</p>
   </section>
   <button class="primary" id="ak26-master">${done?"✓ Structure étudiée — revoir":"Marquer comme étudiée"}</button>
  </div>`;
  root.querySelector("#ak26-list").onclick=()=>render(root);
  root.querySelector("#ak26-master").onclick=()=>{const x=load();x[id]=true;save(x);show(id,root)};
 }
 window.renderStructureClinicV26=()=>render(document.querySelector("#app")||document.body);
 function add(){
  if([...document.querySelectorAll("button,a")].some(x=>/Fiches cliniques — V26/i.test(x.textContent||"")))return;
  const b=document.createElement("button");b.className="secondary";b.textContent="Fiches cliniques — V26";b.onclick=window.renderStructureClinicV26;
  (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(b);
 }
 window.addEventListener("DOMContentLoaded",()=>setTimeout(add,1100));
})();


/* ===== V27 — Bibliothèque d'exercices pédagogiques ===== */
(function(){
 const DATA=[{"id": "ankle_dorsiflexion", "title": "Dorsiflexion de cheville", "region": "Cheville", "goal": "Mobilité", "steps": ["Position confortable et stable", "Amener progressivement le genou vers l'avant en gardant le pied contrôlé", "Revenir lentement", "Comparer avec le côté opposé si pertinent"], "dose": "Progression individualisée selon tolérance et objectif", "muscles": ["Tibial antérieur"], "watch": ["douleur aiguë", "gonflement qui augmente", "perte de contrôle"]}, {"id": "quad_isometric", "title": "Contraction isométrique du quadriceps", "region": "Genou", "goal": "Activation / force", "steps": ["Installer le membre confortablement", "Contracter le quadriceps en cherchant à stabiliser le genou", "Maintenir brièvement puis relâcher", "Répéter selon le programme établi"], "dose": "Volume individualisé ; priorité à une exécution contrôlée", "muscles": ["Quadriceps fémoral"], "watch": ["douleur inhabituelle", "augmentation nette de l'épanchement", "perte de fonction"]}, {"id": "bridge", "title": "Pont fessier", "region": "Hanche", "goal": "Extension de hanche / chaîne postérieure", "steps": ["Allongé sur le dos, genoux fléchis", "Engager la sangle abdominale et les extenseurs de hanche", "Soulever le bassin sans compenser excessivement par le rachis", "Redescendre contrôlé"], "dose": "Progression selon qualité du mouvement et tolérance", "muscles": ["Grand fessier", "Ischio-jambiers"], "watch": ["douleur lombaire importante", "douleur aiguë de hanche"]}, {"id": "shoulder_external_rotation", "title": "Rotation externe de l'épaule avec résistance", "region": "Épaule", "goal": "Renforcement / contrôle", "steps": ["Coude proche du tronc si adapté", "Effectuer une rotation externe lente contre une résistance légère", "Maintenir un mouvement contrôlé", "Revenir sans à-coup"], "dose": "Résistance et volume progressifs selon bilan", "muscles": ["Infra-épineux", "Petit rond"], "watch": ["douleur aiguë", "compensation importante", "perte brutale de force"]}, {"id": "single_leg_balance", "title": "Équilibre unipodal", "region": "Membre inférieur", "goal": "Proprioception / contrôle", "steps": ["Se placer près d'un support stable", "Décoller progressivement un pied", "Maintenir l'alignement du membre inférieur", "Augmenter la difficulté seulement si le contrôle est suffisant"], "dose": "Progression par durée, perturbations ou tâche fonctionnelle", "muscles": ["Fibulaires", "Moyen fessier", "Quadriceps"], "watch": ["instabilité majeure", "vertiges", "douleur importante"]}, {"id": "sit_to_stand", "title": "Assis-debout", "region": "Membre inférieur", "goal": "Fonctionnel / force", "steps": ["Placer les pieds de façon stable", "Incliner légèrement le tronc", "Pousser dans le sol pour se relever", "Contrôler la descente"], "dose": "Adapter hauteur, assistance et charge au niveau fonctionnel", "muscles": ["Quadriceps fémoral", "Grand fessier"], "watch": ["douleur importante", "déviation incontrôlée du genou", "vertiges"]}], KEY="ak27_exercises";
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 function render(root){
  const done=load();
  root.innerHTML=`<div class="page">
   <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
    <div><h2>Bibliothèque d'exercices V27</h2><p style="opacity:.8">Exercices pédagogiques reliés aux objectifs, muscles et points de vigilance.</p></div>
    <button class="secondary" id="ak27-back">Retour</button>
   </div>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-top:16px">
    ${DATA.map(e=>`<button class="secondary" data-e="${e.id}" style="text-align:left;padding:18px;border-radius:16px">
      <b>${esc(e.title)}</b><br><small>${esc(e.region)} · ${esc(e.goal)} ${done[e.id]?"· ✓ étudié":""}</small>
    </button>`).join("")}
   </div>
  </div>`;
  root.querySelectorAll("[data-e]").forEach(b=>b.onclick=()=>show(DATA.find(e=>e.id===b.dataset.e),root));
  root.querySelector("#ak27-back").onclick=()=>{if(window.renderDashboard)window.renderDashboard();else location.reload()};
 }
 function show(e,root){
  const done=load()[e.id];
  root.innerHTML=`<div class="page">
   <button class="secondary" id="ak27-list">← Exercices</button>
   <h2>${esc(e.title)}</h2>
   <p><b>Région :</b> ${esc(e.region)} · <b>Objectif :</b> ${esc(e.goal)}</p>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:12px 0">
    <h3>Exécution</h3><ol>${e.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
   </section>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:12px 0">
    <h3>Muscles / structures principalement sollicités</h3><div>${e.muscles.map(s=>`<span style="display:inline-block;margin:4px;padding:7px 10px;border-radius:10px;background:rgba(127,127,127,.08)">${esc(s)}</span>`).join("")}</div>
   </section>
   <section style="padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:12px 0">
    <h3>Progression</h3><p>${esc(e.dose)}</p>
   </section>
   <section style="padding:18px;border:1px solid rgba(220,80,80,.25);border-radius:16px;margin:12px 0">
    <h3>Points de vigilance</h3><ul>${e.watch.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
    <p style="opacity:.7">Contenu pédagogique : le choix, la charge et la progression doivent être adaptés au bilan et aux consignes du professionnel encadrant.</p>
   </section>
   <button class="primary" id="ak27-done">${done?"✓ Exercice étudié — revoir":"Marquer comme étudié"}</button>
  </div>`;
  root.querySelector("#ak27-list").onclick=()=>render(root);
  root.querySelector("#ak27-done").onclick=()=>{const x=load();x[e.id]=true;save(x);show(e,root)};
 }
 window.renderExerciseLibraryV27=()=>render(document.querySelector("#app")||document.body);
 function add(){
  if([...document.querySelectorAll("button,a")].some(x=>/Bibliothèque d'exercices V27/i.test(x.textContent||"")))return;
  const b=document.createElement("button");b.className="secondary";b.textContent="Bibliothèque d'exercices V27";b.onclick=window.renderExerciseLibraryV27;
  (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(b);
 }
 window.addEventListener("DOMContentLoaded",()=>setTimeout(add,1250));
})();


/* ===== V28 — Plans de rééducation par phases ===== */
(function(){
 const DATA=[{"id": "ankle_10d", "title": "Entorse bénigne de cheville — J10", "region": "Cheville", "context": "Légère douleur à la marche, œdème et mobilité réduite après traumatisme.", "goals": ["récupérer la mobilité", "renforcer les stabilisateurs", "réentraîner l'équilibre", "reprendre progressivement la fonction"], "stages": [{"name": "1. Bilan", "items": ["douleur et tolérance à l'appui", "œdème", "dorsiflexion / flexion plantaire", "stabilité et contrôle"]}, {"name": "2. Mobilité", "items": ["mobilité active contrôlée", "travail progressif de dorsiflexion", "réévaluation de la tolérance"]}, {"name": "3. Force", "items": ["fibulaires", "triceps sural", "tibial antérieur", "progression de résistance"]}, {"name": "4. Proprioception", "items": ["appui bipodal", "appui unipodal", "perturbations progressives", "tâches fonctionnelles"]}, {"name": "5. Retour fonctionnel", "items": ["marche", "escaliers", "changements de direction selon niveau", "critères fonctionnels avant reprise sportive"]}]}, {"id": "knee_postop", "title": "Genou — récupération fonctionnelle progressive", "region": "Genou", "context": "Déficit de force et de contrôle du membre inférieur, protocole à individualiser.", "goals": ["récupérer les amplitudes", "restaurer la force", "améliorer le contrôle", "retrouver les activités fonctionnelles"], "stages": [{"name": "1. Bilan", "items": ["amplitudes", "douleur / gonflement", "activation du quadriceps", "qualité du mouvement"]}, {"name": "2. Activation", "items": ["contractions isométriques", "mobilité adaptée", "contrôle du membre inférieur"]}, {"name": "3. Renforcement", "items": ["quadriceps", "chaîne postérieure", "chaîne fermée progressive", "augmentation graduée de la charge"]}, {"name": "4. Contrôle", "items": ["équilibre", "contrôle frontal du genou", "proprioception", "tâches fonctionnelles"]}, {"name": "5. Retour fonctionnel", "items": ["assis-debout", "escaliers", "marche", "tests fonctionnels adaptés au protocole"]}]}], KEY="ak28_rehab";
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 function render(root){
  const d=load();
  root.innerHTML=`<div class="page">
   <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
    <div><h2>Plans de rééducation V28</h2><p style="opacity:.8">Visualise une progression pédagogique par étapes, du bilan au retour fonctionnel.</p></div>
    <button class="secondary" id="ak28-back">Retour</button>
   </div>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:16px">
    ${DATA.map(x=>`<button class="secondary" data-plan="${x.id}" style="text-align:left;padding:18px;border-radius:16px"><b>${esc(x.title)}</b><br><small>${esc(x.region)} ${d[x.id]?"· ✓ en cours":"· commencer"}</small></button>`).join("")}
   </div>
  </div>`;
  root.querySelectorAll("[data-plan]").forEach(b=>b.onclick=()=>show(DATA.find(x=>x.id===b.dataset.plan),root));
  root.querySelector("#ak28-back").onclick=()=>{if(window.renderDashboard)window.renderDashboard();else location.reload()};
 }
 function show(plan,root){
  let d=load(), progress=d[plan.id]||{};
  const pct=Math.round(Object.values(progress).filter(Boolean).length/plan.stages.length*100);
  root.innerHTML=`<div class="page">
   <button class="secondary" id="ak28-list">← Plans</button>
   <h2>${esc(plan.title)}</h2><p>${esc(plan.context)}</p>
   <section style="padding:16px;border-radius:16px;background:rgba(127,127,127,.07)"><b>Objectifs</b><ul>${plan.goals.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
   <div style="margin:14px 0"><b>Progression pédagogique : ${pct}%</b><div style="height:10px;border-radius:10px;background:rgba(127,127,127,.15);overflow:hidden;margin-top:7px"><div style="width:${pct}%;height:100%;background:currentColor"></div></div></div>
   ${plan.stages.map((s,i)=>`<section style="padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:16px;margin:12px 0">
     <label style="display:block"><input type="checkbox" data-stage="${i}" ${progress[i]?"checked":""}> <b>${esc(s.name)}</b></label>
     <ul>${s.items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
   </section>`).join("")}
   <p style="opacity:.7">Plan pédagogique : les critères, charges et délais réels doivent être individualisés selon le bilan et les prescriptions/protocoles applicables.</p>
  </div>`;
  root.querySelector("#ak28-list").onclick=()=>render(root);
  root.querySelectorAll("[data-stage]").forEach(c=>c.onchange=()=>{
    const x=load(); x[plan.id]=x[plan.id]||{}; x[plan.id][c.dataset.stage]=c.checked; save(x); show(plan,root);
  });
 }
 window.renderRehabPlansV28=()=>render(document.querySelector("#app")||document.body);
 function add(){
  if([...document.querySelectorAll("button,a")].some(x=>/Plans de rééducation V28/i.test(x.textContent||"")))return;
  const b=document.createElement("button");b.className="secondary";b.textContent="Plans de rééducation V28";b.onclick=window.renderRehabPlansV28;
  (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(b);
 }
 window.addEventListener("DOMContentLoaded",()=>setTimeout(add,1400));
})();


/* ===== V29 — Grande base anatomique + atlas de révision intégré ===== */
(function(){
 const M=[{"id": "deltoide", "label": "Deltoïde", "region": "Épaule", "innervation": "Nerf axillaire (C5-C6)", "action": "Abduction; faisceaux antérieur/postérieur participent aux flexion/extension", "origin": "Acromion, clavicule, épine de la scapula", "insertion": "Tubérosité deltoïdienne"}, {"id": "supraspinatus", "label": "Supra-épineux", "region": "Épaule", "innervation": "Nerf suprascapulaire (C5-C6)", "action": "Initiation de l'abduction; stabilisation gléno-humérale", "origin": "Fosse supra-épineuse", "insertion": "Facette supérieure du tubercule majeur"}, {"id": "infraspinatus", "label": "Infra-épineux", "region": "Épaule", "innervation": "Nerf suprascapulaire (C5-C6)", "action": "Rotation latérale; stabilisation", "origin": "Fosse infra-épineuse", "insertion": "Facette moyenne du tubercule majeur"}, {"id": "teres_minor", "label": "Petit rond", "region": "Épaule", "innervation": "Nerf axillaire (C5-C6)", "action": "Rotation latérale; adduction; stabilisation", "origin": "Bord latéral de la scapula", "insertion": "Facette inférieure du tubercule majeur"}, {"id": "subscapularis", "label": "Subscapulaire", "region": "Épaule", "innervation": "Nerfs subscapulaires (C5-C7)", "action": "Rotation médiale; stabilisation", "origin": "Fosse subscapulaire", "insertion": "Tubercule mineur"}, {"id": "pectoralis_major", "label": "Grand pectoral", "region": "Thorax", "innervation": "Nerfs pectoraux médial et latéral", "action": "Adduction et rotation médiale; flexion selon faisceau", "origin": "Clavicule, sternum, cartilages costaux", "insertion": "Lèvre latérale du sillon intertuberculaire"}, {"id": "latissimus_dorsi", "label": "Grand dorsal", "region": "Dos", "innervation": "Nerf thoraco-dorsal (C6-C8)", "action": "Extension, adduction, rotation médiale", "origin": "Processus spinaux, fascia thoracolombaire, côtes", "insertion": "Fond du sillon intertuberculaire"}, {"id": "biceps", "label": "Biceps brachial", "region": "Bras", "innervation": "Nerf musculo-cutané (C5-C6)", "action": "Flexion du coude; supination; flexion d'épaule", "origin": "Scapula", "insertion": "Tubérosité radiale"}, {"id": "brachialis", "label": "Brachial", "region": "Bras", "innervation": "Nerf musculo-cutané (C5-C6)", "action": "Principal fléchisseur du coude", "origin": "Humérus distal", "insertion": "Tubérosité ulnaire / processus coronoïde"}, {"id": "triceps", "label": "Triceps brachial", "region": "Bras", "innervation": "Nerf radial (C6-C8)", "action": "Extension du coude", "origin": "Scapula et humérus", "insertion": "Olécrâne"}, {"id": "brachioradialis", "label": "Brachio-radial", "region": "Avant-bras", "innervation": "Nerf radial (C5-C7)", "action": "Flexion du coude; ramène l'avant-bras vers la position neutre", "origin": "Crête supracondylaire latérale", "insertion": "Radius distal"}, {"id": "pronator_teres", "label": "Rond pronateur", "region": "Avant-bras", "innervation": "Nerf médian (C6-C7)", "action": "Pronation; flexion faible du coude", "origin": "Épicondyle médial et ulna", "insertion": "Radius latéral"}, {"id": "flexor_carpi_radialis", "label": "Fléchisseur radial du carpe", "region": "Avant-bras", "innervation": "Nerf médian (C6-C7)", "action": "Flexion et abduction du poignet", "origin": "Épicondyle médial", "insertion": "Bases des 2e-3e métacarpiens"}, {"id": "extensor_carpi_radialis", "label": "Extenseur radial du carpe", "region": "Avant-bras", "innervation": "Nerf radial (C6-C7)", "action": "Extension et abduction du poignet", "origin": "Humérus distal", "insertion": "Bases des 2e-3e métacarpiens"}, {"id": "iliopsoas", "label": "Ilio-psoas", "region": "Hanche", "innervation": "Nerf fémoral et branches plexus lombaire", "action": "Flexion de hanche; stabilisation lombopelvienne", "origin": "Vertèbres lombaires et fosse iliaque", "insertion": "Petit trochanter"}, {"id": "gluteus_maximus", "label": "Grand fessier", "region": "Fesse", "innervation": "Nerf glutéal inférieur (L5-S2)", "action": "Extension et rotation latérale de hanche", "origin": "Ilion, sacrum, coccyx", "insertion": "Tractus ilio-tibial et fémur"}, {"id": "gluteus_medius", "label": "Moyen fessier", "region": "Fesse", "innervation": "Nerf glutéal supérieur (L4-S1)", "action": "Abduction; stabilisation du bassin", "origin": "Face externe de l'ilion", "insertion": "Grand trochanter"}, {"id": "tensor_fasciae_latae", "label": "Tenseur du fascia lata", "region": "Hanche", "innervation": "Nerf glutéal supérieur (L4-S1)", "action": "Flexion, abduction, rotation médiale; tension tractus ilio-tibial", "origin": "EIAS et crête iliaque", "insertion": "Tractus ilio-tibial"}, {"id": "rectus_femoris", "label": "Droit fémoral", "region": "Cuisse", "innervation": "Nerf fémoral (L2-L4)", "action": "Extension du genou; flexion de hanche", "origin": "EIAI et rebord acétabulaire", "insertion": "Patella puis tubérosité tibiale"}, {"id": "vastus_lateralis", "label": "Vaste latéral", "region": "Cuisse", "innervation": "Nerf fémoral (L2-L4)", "action": "Extension du genou", "origin": "Fémur proximal", "insertion": "Patella / tendon quadricipital"}, {"id": "vastus_medialis", "label": "Vaste médial", "region": "Cuisse", "innervation": "Nerf fémoral (L2-L4)", "action": "Extension du genou; contrôle médial de la patella", "origin": "Fémur médial", "insertion": "Patella / tendon quadricipital"}, {"id": "sartorius", "label": "Sartorius", "region": "Cuisse", "innervation": "Nerf fémoral (L2-L3)", "action": "Flexion, abduction, rotation latérale de hanche; flexion genou", "origin": "EIAS", "insertion": "Patte d'oie"}, {"id": "adductor_longus", "label": "Long adducteur", "region": "Cuisse médiale", "innervation": "Nerf obturateur (L2-L4)", "action": "Adduction de hanche", "origin": "Pubis", "insertion": "Ligne âpre"}, {"id": "gracilis", "label": "Gracile", "region": "Cuisse médiale", "innervation": "Nerf obturateur (L2-L3)", "action": "Adduction de hanche; flexion genou", "origin": "Pubis", "insertion": "Patte d'oie"}, {"id": "biceps_femoris", "label": "Biceps fémoral", "region": "Cuisse postérieure", "innervation": "Nerf tibial; chef court via fibulaire commun", "action": "Flexion du genou; extension et rotation latérale de hanche selon chef", "origin": "Ischion / fémur", "insertion": "Tête de la fibula"}, {"id": "semitendinosus", "label": "Semi-tendineux", "region": "Cuisse postérieure", "innervation": "Nerf tibial (L5-S2)", "action": "Extension hanche; flexion et rotation médiale genou", "origin": "Tubérosité ischiatique", "insertion": "Patte d'oie"}, {"id": "semimembranosus", "label": "Semi-membraneux", "region": "Cuisse postérieure", "innervation": "Nerf tibial (L5-S2)", "action": "Extension hanche; flexion et rotation médiale genou", "origin": "Tubérosité ischiatique", "insertion": "Condyle médial du tibia"}, {"id": "tibialis_anterior", "label": "Tibial antérieur", "region": "Jambe", "innervation": "Nerf fibulaire profond (L4-L5)", "action": "Dorsiflexion et inversion", "origin": "Tibia latéral et membrane interosseuse", "insertion": "Cunéiforme médial et base du 1er métatarsien"}, {"id": "gastrocnemius", "label": "Gastrocnémien", "region": "Jambe postérieure", "innervation": "Nerf tibial (S1-S2)", "action": "Flexion plantaire; flexion du genou", "origin": "Condyles fémoraux", "insertion": "Calcanéus via tendon calcanéen"}, {"id": "soleus", "label": "Soléaire", "region": "Jambe postérieure", "innervation": "Nerf tibial (S1-S2)", "action": "Flexion plantaire", "origin": "Tibia et fibula proximaux", "insertion": "Calcanéus via tendon calcanéen"}, {"id": "fibularis_longus", "label": "Long fibulaire", "region": "Jambe latérale", "innervation": "Nerf fibulaire superficiel (L5-S1)", "action": "Éversion; flexion plantaire", "origin": "Fibula", "insertion": "Base du 1er métatarsien et cunéiforme médial"}, {"id": "fibularis_brevis", "label": "Court fibulaire", "region": "Jambe latérale", "innervation": "Nerf fibulaire superficiel (L5-S1)", "action": "Éversion; flexion plantaire", "origin": "Fibula distale", "insertion": "Base du 5e métatarsien"}, {"id": "tibialis_posterior", "label": "Tibial postérieur", "region": "Jambe profonde", "innervation": "Nerf tibial (L4-L5)", "action": "Inversion et flexion plantaire; soutien de la voûte", "origin": "Tibia, fibula, membrane interosseuse", "insertion": "Naviculaire et os du tarse"}, {"id": "extensor_hallucis_longus", "label": "Long extenseur de l'hallux", "region": "Jambe antérieure", "innervation": "Nerf fibulaire profond (L5-S1)", "action": "Extension de l'hallux; dorsiflexion", "origin": "Fibula et membrane interosseuse", "insertion": "Phalange distale de l'hallux"}, {"id": "extensor_digitorum_longus", "label": "Long extenseur des orteils", "region": "Jambe antérieure", "innervation": "Nerf fibulaire profond (L5-S1)", "action": "Extension des orteils; dorsiflexion", "origin": "Tibia/fibula", "insertion": "Phalanges des orteils 2-5"}], B=[{"id": "scapula", "label": "Scapula", "region": "Ceinture scapulaire", "description": "Os plat; glène; acromion; processus coracoïde"}, {"id": "clavicle", "label": "Clavicule", "region": "Ceinture scapulaire", "description": "Os long; relie sternum et scapula"}, {"id": "humerus", "label": "Humérus", "region": "Bras", "description": "Tête humérale; tubercules; trochlée; capitulum"}, {"id": "radius", "label": "Radius", "region": "Avant-bras", "description": "Tête radiale; col; tubérosité; extrémité distale"}, {"id": "ulna", "label": "Ulna", "region": "Avant-bras", "description": "Olécrâne; processus coronoïde; incisure trochléaire"}, {"id": "pelvis", "label": "Os coxal", "region": "Bassin", "description": "Ilion; ischion; pubis; acétabulum"}, {"id": "femur", "label": "Fémur", "region": "Cuisse", "description": "Tête; col; trochanters; condyles"}, {"id": "patella", "label": "Patella", "region": "Genou", "description": "Os sésamoïde du tendon quadricipital"}, {"id": "tibia", "label": "Tibia", "region": "Jambe", "description": "Plateau tibial; tubérosité; malléole médiale"}, {"id": "fibula", "label": "Fibula", "region": "Jambe", "description": "Tête; corps; malléole latérale"}, {"id": "talus", "label": "Talus", "region": "Pied", "description": "Participe à l'articulation talo-crurale"}, {"id": "calcaneus", "label": "Calcanéus", "region": "Pied", "description": "Plus grand os du tarse; insertion du tendon calcanéen"}, {"id": "vertebra", "label": "Vertèbre", "region": "Rachis", "description": "Corps, arc, processus; variations selon région"}, {"id": "sternum", "label": "Sternum", "region": "Thorax", "description": "Manubrium, corps, processus xiphoïde"}, {"id": "rib", "label": "Côte", "region": "Thorax", "description": "Os plat courbe participant à la cage thoracique"}], J=[{"id": "glenohumeral", "label": "Glenohumérale", "region": "Épaule", "type": "sphéroïde", "movements": "Flexion, extension, abduction, adduction, rotations, circumduction"}, {"id": "elbow", "label": "Coude", "region": "Coude", "type": "charnière principalement", "movements": "Flexion, extension; prono-supination via articulations radio-ulnaires"}, {"id": "wrist", "label": "Radio-carpienne", "region": "Poignet", "type": "ellipsoïde", "movements": "Flexion, extension, inclinaisons radiale et ulnaire"}, {"id": "hip", "label": "Coxo-fémorale", "region": "Hanche", "type": "sphéroïde", "movements": "Flexion, extension, abduction, adduction, rotations"}, {"id": "knee", "label": "Genou", "region": "Genou", "type": "bicondylaire complexe", "movements": "Flexion, extension; rotations accessoires en flexion"}, {"id": "ankle", "label": "Talo-crurale", "region": "Cheville", "type": "ginglyme", "movements": "Dorsiflexion et flexion plantaire"}, {"id": "subtalar", "label": "Sous-talienne", "region": "Pied", "type": "articulation synoviale", "movements": "Mouvements contribuant à l'inversion/éversion"}, {"id": "cervical", "label": "Rachis cervical", "region": "Rachis", "type": "complexe", "movements": "Flexion, extension, inclinaisons, rotations"}], P=[{"id": "lateral_ankle_sprain", "label": "Entorse latérale de cheville", "structures": ["ATFL", "fibulaires", "talo-crurale"], "mechanism": "Traumatisme en inversion, souvent avec flexion plantaire.", "assessment": ["douleur", "œdème", "amplitude", "appui", "stabilité", "contrôle unipodal"], "rehab": ["mobilité", "renforcement", "proprioception", "tâches fonctionnelles"], "criteria": ["douleur contrôlée", "amplitude fonctionnelle", "force et contrôle suffisants", "tolérance aux tâches"]}, {"id": "patellofemoral_pain", "label": "Douleur fémoro-patellaire", "structures": ["patella", "quadriceps", "hanche"], "mechanism": "Douleur antérieure du genou souvent liée à la charge et aux tâches fonctionnelles; mécanismes multifactoriels.", "assessment": ["douleur et irritabilité", "tolérance aux escaliers/squat", "force quadriceps", "contrôle hanche-genou"], "rehab": ["gestion de charge", "renforcement quadriceps", "renforcement hanche", "progression fonctionnelle"], "criteria": ["meilleure tolérance aux tâches", "contrôle du mouvement", "progression de la capacité de charge"]}, {"id": "shoulder_rotator_cuff", "label": "Douleur liée à la coiffe des rotateurs", "structures": ["supra-épineux", "infra-épineux", "subscapulaire", "deltoïde"], "mechanism": "Douleur d'épaule liée à la charge; diagnostic clinique à individualiser.", "assessment": ["amplitude", "force", "douleur à l'élévation", "fonction"], "rehab": ["gestion de charge", "mobilité selon déficit", "renforcement progressif", "réintégration fonctionnelle"], "criteria": ["amplitude fonctionnelle", "tolérance à la charge", "force progressive"]}, {"id": "low_back_pain", "label": "Lombalgie commune — approche fonctionnelle", "structures": ["rachis lombaire", "muscles du tronc", "hanche"], "mechanism": "Tableau fréquent et multifactoriel; rechercher les signes d'alerte avant une prise en charge fonctionnelle.", "assessment": ["douleur", "fonction", "mobilité", "tolérance aux activités", "drapeaux rouges"], "rehab": ["éducation", "activité graduée", "exercices adaptés", "retour progressif aux activités"], "criteria": ["fonction améliorée", "meilleure tolérance à l'activité", "autogestion"]}], E=[{"q": "Quelle est l'action principale du Deltoïde ?", "a": "Abduction; faisceaux antérieur/postérieur participent aux flexion/extension", "topic": "Épaule"}, {"q": "Quelle est l'action principale du Supra-épineux ?", "a": "Initiation de l'abduction; stabilisation gléno-humérale", "topic": "Épaule"}, {"q": "Quelle est l'action principale du Infra-épineux ?", "a": "Rotation latérale; stabilisation", "topic": "Épaule"}, {"q": "Quelle est l'action principale du Petit rond ?", "a": "Rotation latérale; adduction; stabilisation", "topic": "Épaule"}, {"q": "Quelle est l'action principale du Subscapulaire ?", "a": "Rotation médiale; stabilisation", "topic": "Épaule"}, {"q": "Quelle est l'action principale du Grand pectoral ?", "a": "Adduction et rotation médiale; flexion selon faisceau", "topic": "Thorax"}, {"q": "Quelle est l'action principale du Grand dorsal ?", "a": "Extension, adduction, rotation médiale", "topic": "Dos"}, {"q": "Quelle est l'action principale du Biceps brachial ?", "a": "Flexion du coude; supination; flexion d'épaule", "topic": "Bras"}, {"q": "Quelle est l'action principale du Brachial ?", "a": "Principal fléchisseur du coude", "topic": "Bras"}, {"q": "Quelle est l'action principale du Triceps brachial ?", "a": "Extension du coude", "topic": "Bras"}, {"q": "Quelle est l'action principale du Brachio-radial ?", "a": "Flexion du coude; ramène l'avant-bras vers la position neutre", "topic": "Avant-bras"}, {"q": "Quelle est l'action principale du Rond pronateur ?", "a": "Pronation; flexion faible du coude", "topic": "Avant-bras"}, {"q": "Quelle est l'action principale du Fléchisseur radial du carpe ?", "a": "Flexion et abduction du poignet", "topic": "Avant-bras"}, {"q": "Quelle est l'action principale du Extenseur radial du carpe ?", "a": "Extension et abduction du poignet", "topic": "Avant-bras"}, {"q": "Quelle est l'action principale du Ilio-psoas ?", "a": "Flexion de hanche; stabilisation lombopelvienne", "topic": "Hanche"}, {"q": "Quelle est l'action principale du Grand fessier ?", "a": "Extension et rotation latérale de hanche", "topic": "Fesse"}, {"q": "Quelle est l'action principale du Moyen fessier ?", "a": "Abduction; stabilisation du bassin", "topic": "Fesse"}, {"q": "Quelle est l'action principale du Tenseur du fascia lata ?", "a": "Flexion, abduction, rotation médiale; tension tractus ilio-tibial", "topic": "Hanche"}, {"q": "Quelle est l'action principale du Droit fémoral ?", "a": "Extension du genou; flexion de hanche", "topic": "Cuisse"}, {"q": "Quelle est l'action principale du Vaste latéral ?", "a": "Extension du genou", "topic": "Cuisse"}, {"q": "Quelle est l'action principale du Vaste médial ?", "a": "Extension du genou; contrôle médial de la patella", "topic": "Cuisse"}, {"q": "Quelle est l'action principale du Sartorius ?", "a": "Flexion, abduction, rotation latérale de hanche; flexion genou", "topic": "Cuisse"}, {"q": "Quelle est l'action principale du Long adducteur ?", "a": "Adduction de hanche", "topic": "Cuisse médiale"}, {"q": "Quelle est l'action principale du Gracile ?", "a": "Adduction de hanche; flexion genou", "topic": "Cuisse médiale"}, {"q": "Quels mouvements sont associés à l'articulation Glenohumérale ?", "a": "Flexion, extension, abduction, adduction, rotations, circumduction", "topic": "Épaule"}, {"q": "Quels mouvements sont associés à l'articulation Coude ?", "a": "Flexion, extension; prono-supination via articulations radio-ulnaires", "topic": "Coude"}, {"q": "Quels mouvements sont associés à l'articulation Radio-carpienne ?", "a": "Flexion, extension, inclinaisons radiale et ulnaire", "topic": "Poignet"}, {"q": "Quels mouvements sont associés à l'articulation Coxo-fémorale ?", "a": "Flexion, extension, abduction, adduction, rotations", "topic": "Hanche"}, {"q": "Quels mouvements sont associés à l'articulation Genou ?", "a": "Flexion, extension; rotations accessoires en flexion", "topic": "Genou"}, {"q": "Quels mouvements sont associés à l'articulation Talo-crurale ?", "a": "Dorsiflexion et flexion plantaire", "topic": "Cheville"}, {"q": "Quels mouvements sont associés à l'articulation Sous-talienne ?", "a": "Mouvements contribuant à l'inversion/éversion", "topic": "Pied"}, {"q": "Quels mouvements sont associés à l'articulation Rachis cervical ?", "a": "Flexion, extension, inclinaisons, rotations", "topic": "Rachis"}, {"q": "Quels axes de rééducation sont associés au cas « Entorse latérale de cheville » ?", "a": ["mobilité", "renforcement", "proprioception", "tâches fonctionnelles"], "topic": "Clinique"}, {"q": "Quels axes de rééducation sont associés au cas « Douleur fémoro-patellaire » ?", "a": ["gestion de charge", "renforcement quadriceps", "renforcement hanche", "progression fonctionnelle"], "topic": "Clinique"}, {"q": "Quels axes de rééducation sont associés au cas « Douleur liée à la coiffe des rotateurs » ?", "a": ["gestion de charge", "mobilité selon déficit", "renforcement progressif", "réintégration fonctionnelle"], "topic": "Clinique"}, {"q": "Quels axes de rééducation sont associés au cas « Lombalgie commune — approche fonctionnelle » ?", "a": ["éducation", "activité graduée", "exercices adaptés", "retour progressif aux activités"], "topic": "Clinique"}];
 const KEY="ak29_mastery";
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{muscles:{},bones:{},joints:{},pathologies:{}}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));

 function hub(root){
  root.innerHTML=`<div class="page">
   <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
    <div><h2>Atlas anatomique intégré V29</h2><p style="opacity:.8">Une base structurée pour réviser muscles, os, articulations et clinique.</p></div>
    <button class="secondary" id="v29-back">Retour</button>
   </div>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:16px">
    <button class="secondary" data-tab="muscles"><b>Muscles</b><br><small>${M.length} fiches</small></button>
    <button class="secondary" data-tab="bones"><b>Os</b><br><small>${B.length} fiches</small></button>
    <button class="secondary" data-tab="joints"><b>Articulations</b><br><small>${J.length} fiches</small></button>
    <button class="secondary" data-tab="path"><b>Pathologies</b><br><small>${P.length} parcours</small></button>
   </div>
   <div id="v29-content" style="margin-top:16px"></div>
  </div>`;
  root.querySelector("#v29-back").onclick=()=>{if(window.renderDashboard)window.renderDashboard();else location.reload()};
  root.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>list(b.dataset.tab,root));
  list("muscles",root);
 }
 function list(type,root){
  const arr=type==="muscles"?M:type==="bones"?B:type==="joints"?J:P;
  const html=arr.map((d,i)=>`<button class="secondary" data-item="${i}" style="text-align:left;padding:14px;border-radius:14px">
   <b>${esc(d.label)}</b><br><small>${esc(d.region||d.mechanism||d.type||"")}</small></button>`).join("");
  root.querySelector("#v29-content").innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
   <input id="v29-search" placeholder="Rechercher…" style="flex:1;min-width:220px;padding:12px;border-radius:12px;border:1px solid rgba(127,127,127,.3)">
  </div><div id="v29-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">${html}</div>`;
  const filter=()=>{
   const q=(root.querySelector("#v29-search").value||"").toLowerCase();
   root.querySelectorAll("[data-item]").forEach((b,i)=>{const d=arr[i];b.style.display=JSON.stringify(d).toLowerCase().includes(q)?"block":"none"});
  };
  root.querySelector("#v29-search").oninput=filter;
  root.querySelectorAll("[data-item]").forEach(b=>b.onclick=()=>detail(type,arr[+b.dataset.item],root));
 }
 function detail(type,d,root){
  const s=load(), id=d.id;
  let body="";
  if(type==="muscles") body=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">
   ${[["Région",d.region],["Origine",d.origin],["Insertion",d.insertion],["Innervation",d.innervation],["Action",d.action]].map(x=>`<section style="padding:14px;border:1px solid rgba(127,127,127,.25);border-radius:14px"><b>${x[0]}</b><p>${esc(x[1])}</p></section>`).join("")}</div>`;
  else if(type==="bones") body=`<section style="padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:14px"><p>${esc(d.description)}</p><b>Région :</b> ${esc(d.region)}</section>`;
  else if(type==="joints") body=`<section style="padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:14px"><p><b>Type :</b> ${esc(d.type)}</p><p><b>Mouvements :</b> ${esc(d.movements)}</p></section>`;
  else body=`<section style="padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:14px">
    <p><b>Mécanisme / contexte :</b> ${esc(d.mechanism)}</p>
    <h3>Structures</h3><p>${d.structures.map(esc).join(" · ")}</p>
    <h3>Bilan</h3><ul>${d.assessment.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    <h3>Axes de rééducation</h3><ul>${d.rehab.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    <h3>Critères de progression</h3><ul>${d.criteria.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
   </section>`;
  root.querySelector("#v29-content").innerHTML=`<button class="secondary" id="v29-list">← Liste</button>
   <h3 style="margin-top:14px">${esc(d.label)}</h3>${body}
   <button class="primary" id="v29-master" style="margin-top:14px">${s[type][id]?"✓ Maîtrisé — revoir":"Marquer comme maîtrisé"}</button>`;
  root.querySelector("#v29-list").onclick=()=>list(type,root);
  root.querySelector("#v29-master").onclick=()=>{const x=load();x[type][id]=true;save(x);detail(type,d,root)};
 }
 window.renderAtlasV29=()=>hub(document.querySelector("#app")||document.body);
 function add(){if([...document.querySelectorAll("button,a")].some(x=>/Atlas anatomique intégré V29/i.test(x.textContent||"")))return;
  const b=document.createElement("button");b.className="secondary";b.textContent="Atlas anatomique intégré V29";b.onclick=window.renderAtlasV29;
  (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(b)}
 window.addEventListener("DOMContentLoaded",()=>setTimeout(add,1600));
})();


/* ===== V30 — Mode examen complet adaptatif ===== */
(function(){
 const Q=[{"type": "mcq", "topic": "Anatomie", "q": "Quel muscle est principalement responsable de l'extension du coude ?", "choices": ["Biceps brachial", "Triceps brachial", "Brachial", "Rond pronateur"], "answer": 1, "explain": "Le triceps brachial est le principal extenseur du coude."}, {"type": "mcq", "topic": "Anatomie", "q": "Quel muscle est un dorsiflexeur majeur de la cheville ?", "choices": ["Soléaire", "Gastrocnémien", "Tibial antérieur", "Long fibulaire"], "answer": 2, "explain": "Le tibial antérieur réalise principalement la dorsiflexion et participe à l'inversion."}, {"type": "mcq", "topic": "Biomécanique", "q": "L'abduction de l'épaule se déroule principalement dans quel plan ?", "choices": ["Sagittal", "Frontal", "Transversal", "Oblique"], "answer": 1, "explain": "L'abduction/adduction se décrit principalement dans le plan frontal autour d'un axe sagittal."}, {"type": "mcq", "topic": "Kiné", "q": "Dans une entorse latérale de cheville en récupération, quel axe est classiquement travaillé progressivement ?", "choices": ["Proprioception et contrôle", "Immobilisation permanente", "Repos sans reprise de charge", "Uniquement mobilité passive"], "answer": 0, "explain": "Le contrôle proprioceptif et fonctionnel fait partie de la progression, selon le bilan et la tolérance."}, {"type": "truefalse", "topic": "Anatomie", "q": "Le grand fessier est un extenseur important de la hanche.", "choices": ["Vrai", "Faux"], "answer": 0, "explain": "Le grand fessier est un puissant extenseur de hanche."}, {"type": "truefalse", "topic": "Biomécanique", "q": "La flexion-extension du coude se fait principalement dans le plan frontal.", "choices": ["Vrai", "Faux"], "answer": 1, "explain": "Elle se fait principalement dans le plan sagittal autour d'un axe transversal."}, {"type": "short", "topic": "Anatomie", "q": "Quel nerf innerve principalement le quadriceps ?", "answer": "nerf fémoral", "keywords": ["fémoral"], "explain": "Le quadriceps reçoit son innervation du nerf fémoral, principalement L2-L4."}, {"type": "short", "topic": "Anatomie", "q": "Quel muscle est le principal extenseur du genou ?", "answer": "quadriceps fémoral", "keywords": ["quadriceps"], "explain": "Le quadriceps est le principal groupe extenseur du genou."}, {"type": "case", "topic": "Clinique", "q": "Un patient présente douleur, œdème et dorsiflexion réduite après une entorse latérale de cheville. Quel trio d'objectifs est cohérent ?", "choices": ["Mobilité + force + proprioception", "Immobilisation + absence totale d'appui + repos prolongé", "Uniquement massage", "Uniquement étirements"], "answer": 0, "explain": "La progression pédagogique associe récupération de mobilité, renforcement et contrôle/proprioception selon la tolérance."}, {"type": "case", "topic": "Clinique", "q": "Après une période d'immobilisation du genou, quel élément est particulièrement important à réévaluer ?", "choices": ["Force du quadriceps et qualité du mouvement", "Uniquement la taille du pied", "Uniquement la souplesse du poignet", "Uniquement la force des doigts"], "answer": 0, "explain": "Le quadriceps et le contrôle du membre inférieur sont essentiels dans la récupération fonctionnelle du genou."}], KEY="ak30_exam";
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"sessions":0,"best":0,"history":[],"weak":{}}')}catch(e){return{sessions:0,best:0,history:[],weak:{}}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));

 function start(root){
   const shuffled=Q.slice().sort(()=>Math.random()-.5);
   let index=0, score=0, answers=[];
   function question(){
     const q=shuffled[index];
     let input="";
     if(q.type==="mcq"||q.type==="truefalse"||q.type==="case"){
       input=`<div style="display:grid;gap:9px;margin-top:14px">${q.choices.map((c,i)=>`<button class="secondary" data-choice="${i}" style="text-align:left;padding:14px">${esc(c)}</button>`).join("")}</div>`;
     } else {
       input=`<input id="v30-answer" placeholder="Ta réponse…" autocomplete="off" style="width:100%;box-sizing:border-box;padding:14px;border-radius:12px;border:1px solid rgba(127,127,127,.3);margin-top:14px">
       <button class="primary" id="v30-submit" style="margin-top:10px">Valider</button>`;
     }
     root.innerHTML=`<div class="page">
       <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap">
        <div><h2>Examen complet V30</h2><small>Question ${index+1}/${shuffled.length} · ${esc(q.topic)}</small></div>
        <button class="secondary" id="v30-quit">Quitter</button>
       </div>
       <div style="margin:14px 0;height:9px;border-radius:9px;background:rgba(127,127,127,.15)"><div style="height:100%;width:${index/shuffled.length*100}%;background:currentColor"></div></div>
       <section style="padding:20px;border:1px solid rgba(127,127,127,.25);border-radius:18px">
        <h3>${esc(q.q)}</h3>${input}<div id="v30-feedback" style="margin-top:14px"></div>
       </section>
     </div>`;
     root.querySelector("#v30-quit").onclick=()=>hub(root);
     const choose=(i)=>{if(i==null)return; const ok=i===q.answer; finish(ok,q,i);};
     root.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>choose(+b.dataset.choice));
     root.querySelector("#v30-submit")?.addEventListener("click",()=>{
       const val=(root.querySelector("#v30-answer").value||"").trim().toLowerCase();
       const keys=q.keywords||[q.answer];
       const ok=keys.some(k=>val.includes(String(k).toLowerCase()));
       finish(ok,q,val);
     });
   }
   function finish(ok,q,user){
     answers.push(ok);
     const f=root.querySelector("#v30-feedback");
     f.innerHTML=ok?`<div style="padding:13px;border-radius:12px;background:rgba(60,180,100,.12)"><b>✓ Correct</b><br>${esc(q.explain)}</div>`:
       `<div style="padding:13px;border-radius:12px;background:rgba(220,80,80,.12)"><b>À revoir</b><br>${esc(q.explain)}</div>`;
     setTimeout(()=>{index++; if(index>=shuffled.length) result(); else question()},850);
   }
   function result(){
     const s=load(), pct=Math.round(answers.filter(Boolean).length/answers.length*100);
     s.sessions++; s.best=Math.max(s.best,pct); s.history.push({date:new Date().toISOString(),score:pct});
     answers.forEach((ok,i)=>{if(!ok){const t=shuffled[i].topic;s.weak[t]=(s.weak[t]||0)+1}});
     s.history=s.history.slice(-20); save(s);
     root.innerHTML=`<div class="page"><h2>Résultat</h2>
      <div style="padding:22px;border-radius:18px;background:rgba(127,127,127,.08);text-align:center">
       <div style="font-size:42px;font-weight:700">${pct}%</div><p>${answers.filter(Boolean).length}/${answers.length} réponses correctes</p>
       <p>Meilleur score enregistré : <b>${s.best}%</b></p>
      </div>
      <h3>Thèmes à revoir</h3><ul>${Object.entries(s.weak).sort((a,b)=>b[1]-a[1]).map(x=>`<li>${esc(x[0])} : ${x[1]} erreur(s)</li>`).join("")||"<li>Aucun thème faible enregistré.</li>"}</ul>
      <button class="primary" id="v30-again">Refaire un examen</button>
      <button class="secondary" id="v30-home" style="margin-left:8px">Retour</button>
     </div>`;
     root.querySelector("#v30-again").onclick=()=>start(root);
     root.querySelector("#v30-home").onclick=()=>hub(root);
   }
   question();
 }
 function hub(root){
  const s=load();
  root.innerHTML=`<div class="page">
   <h2>Examen complet V30</h2><p style="opacity:.8">Anatomie · biomécanique · kiné · clinique. Plusieurs types de questions avec historique des scores.</p>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">
    <div style="padding:16px;border-radius:14px;background:rgba(127,127,127,.07)"><b>Sessions</b><br>${s.sessions}</div>
    <div style="padding:16px;border-radius:14px;background:rgba(127,127,127,.07)"><b>Meilleur score</b><br>${s.best}%</div>
    <div style="padding:16px;border-radius:14px;background:rgba(127,127,127,.07)"><b>Questions</b><br>${Q.length}</div>
   </div>
   <button class="primary" id="v30-start" style="margin-top:16px">Commencer</button>
   <button class="secondary" id="v30-back" style="margin-top:16px;margin-left:8px">Retour</button>
  </div>`;
  root.querySelector("#v30-start").onclick=()=>start(root);
  root.querySelector("#v30-back").onclick=()=>{if(window.renderDashboard)window.renderDashboard();else location.reload()};
 }
 window.renderExamV30=()=>hub(document.querySelector("#app")||document.body);
 function add(){
   if([...document.querySelectorAll("button,a")].some(x=>/Examen complet V30/i.test(x.textContent||"")))return;
   const b=document.createElement("button");b.className="secondary";b.textContent="Examen complet V30";b.onclick=window.renderExamV30;
   (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(b);
 }
 window.addEventListener("DOMContentLoaded",()=>setTimeout(add,1750));
})();


/* ===== ULTIMATE V31 — HUB UNIFIÉ + BASE ANATOMIQUE + CLINIQUE + COURS + EXAMEN ===== */
(function(){
 const MUS=[{"id": "deltoide", "label": "Deltoïde", "region": "Épaule", "innervation": "Nerf axillaire (C5-C6)", "action": "Abduction; faisceaux antérieur/postérieur participent aux flexion/extension", "origin": "Acromion, clavicule, épine de la scapula", "insertion": "Tubérosité deltoïdienne"}, {"id": "supraspinatus", "label": "Supra-épineux", "region": "Épaule", "innervation": "Nerf suprascapulaire (C5-C6)", "action": "Initiation de l'abduction; stabilisation gléno-humérale", "origin": "Fosse supra-épineuse", "insertion": "Facette supérieure du tubercule majeur"}, {"id": "infraspinatus", "label": "Infra-épineux", "region": "Épaule", "innervation": "Nerf suprascapulaire (C5-C6)", "action": "Rotation latérale; stabilisation", "origin": "Fosse infra-épineuse", "insertion": "Facette moyenne du tubercule majeur"}, {"id": "teres_minor", "label": "Petit rond", "region": "Épaule", "innervation": "Nerf axillaire (C5-C6)", "action": "Rotation latérale; adduction; stabilisation", "origin": "Bord latéral de la scapula", "insertion": "Facette inférieure du tubercule majeur"}, {"id": "subscapularis", "label": "Subscapulaire", "region": "Épaule", "innervation": "Nerfs subscapulaires (C5-C7)", "action": "Rotation médiale; stabilisation", "origin": "Fosse subscapulaire", "insertion": "Tubercule mineur"}, {"id": "pectoralis_major", "label": "Grand pectoral", "region": "Thorax", "innervation": "Nerfs pectoraux médial et latéral", "action": "Adduction et rotation médiale; flexion selon faisceau", "origin": "Clavicule, sternum, cartilages costaux", "insertion": "Lèvre latérale du sillon intertuberculaire"}, {"id": "latissimus_dorsi", "label": "Grand dorsal", "region": "Dos", "innervation": "Nerf thoraco-dorsal (C6-C8)", "action": "Extension, adduction, rotation médiale", "origin": "Processus spinaux, fascia thoracolombaire, côtes", "insertion": "Fond du sillon intertuberculaire"}, {"id": "biceps", "label": "Biceps brachial", "region": "Bras", "innervation": "Nerf musculo-cutané (C5-C6)", "action": "Flexion du coude; supination; flexion d'épaule", "origin": "Scapula", "insertion": "Tubérosité radiale"}, {"id": "brachialis", "label": "Brachial", "region": "Bras", "innervation": "Nerf musculo-cutané (C5-C6)", "action": "Principal fléchisseur du coude", "origin": "Humérus distal", "insertion": "Tubérosité ulnaire / processus coronoïde"}, {"id": "triceps", "label": "Triceps brachial", "region": "Bras", "innervation": "Nerf radial (C6-C8)", "action": "Extension du coude", "origin": "Scapula et humérus", "insertion": "Olécrâne"}, {"id": "brachioradialis", "label": "Brachio-radial", "region": "Avant-bras", "innervation": "Nerf radial (C5-C7)", "action": "Flexion du coude; ramène l'avant-bras vers la position neutre", "origin": "Crête supracondylaire latérale", "insertion": "Radius distal"}, {"id": "pronator_teres", "label": "Rond pronateur", "region": "Avant-bras", "innervation": "Nerf médian (C6-C7)", "action": "Pronation; flexion faible du coude", "origin": "Épicondyle médial et ulna", "insertion": "Radius latéral"}, {"id": "flexor_carpi_radialis", "label": "Fléchisseur radial du carpe", "region": "Avant-bras", "innervation": "Nerf médian (C6-C7)", "action": "Flexion et abduction du poignet", "origin": "Épicondyle médial", "insertion": "Bases des 2e-3e métacarpiens"}, {"id": "extensor_carpi_radialis", "label": "Extenseur radial du carpe", "region": "Avant-bras", "innervation": "Nerf radial (C6-C7)", "action": "Extension et abduction du poignet", "origin": "Humérus distal", "insertion": "Bases des 2e-3e métacarpiens"}, {"id": "iliopsoas", "label": "Ilio-psoas", "region": "Hanche", "innervation": "Nerf fémoral et branches plexus lombaire", "action": "Flexion de hanche; stabilisation lombopelvienne", "origin": "Vertèbres lombaires et fosse iliaque", "insertion": "Petit trochanter"}, {"id": "gluteus_maximus", "label": "Grand fessier", "region": "Fesse", "innervation": "Nerf glutéal inférieur (L5-S2)", "action": "Extension et rotation latérale de hanche", "origin": "Ilion, sacrum, coccyx", "insertion": "Tractus ilio-tibial et fémur"}, {"id": "gluteus_medius", "label": "Moyen fessier", "region": "Fesse", "innervation": "Nerf glutéal supérieur (L4-S1)", "action": "Abduction; stabilisation du bassin", "origin": "Face externe de l'ilion", "insertion": "Grand trochanter"}, {"id": "tensor_fasciae_latae", "label": "Tenseur du fascia lata", "region": "Hanche", "innervation": "Nerf glutéal supérieur (L4-S1)", "action": "Flexion, abduction, rotation médiale; tension tractus ilio-tibial", "origin": "EIAS et crête iliaque", "insertion": "Tractus ilio-tibial"}, {"id": "rectus_femoris", "label": "Droit fémoral", "region": "Cuisse", "innervation": "Nerf fémoral (L2-L4)", "action": "Extension du genou; flexion de hanche", "origin": "EIAI et rebord acétabulaire", "insertion": "Patella puis tubérosité tibiale"}, {"id": "vastus_lateralis", "label": "Vaste latéral", "region": "Cuisse", "innervation": "Nerf fémoral (L2-L4)", "action": "Extension du genou", "origin": "Fémur proximal", "insertion": "Patella / tendon quadricipital"}, {"id": "vastus_medialis", "label": "Vaste médial", "region": "Cuisse", "innervation": "Nerf fémoral (L2-L4)", "action": "Extension du genou; contrôle médial de la patella", "origin": "Fémur médial", "insertion": "Patella / tendon quadricipital"}, {"id": "sartorius", "label": "Sartorius", "region": "Cuisse", "innervation": "Nerf fémoral (L2-L3)", "action": "Flexion, abduction, rotation latérale de hanche; flexion genou", "origin": "EIAS", "insertion": "Patte d'oie"}, {"id": "adductor_longus", "label": "Long adducteur", "region": "Cuisse médiale", "innervation": "Nerf obturateur (L2-L4)", "action": "Adduction de hanche", "origin": "Pubis", "insertion": "Ligne âpre"}, {"id": "gracilis", "label": "Gracile", "region": "Cuisse médiale", "innervation": "Nerf obturateur (L2-L3)", "action": "Adduction de hanche; flexion genou", "origin": "Pubis", "insertion": "Patte d'oie"}, {"id": "biceps_femoris", "label": "Biceps fémoral", "region": "Cuisse postérieure", "innervation": "Nerf tibial; chef court via fibulaire commun", "action": "Flexion du genou; extension et rotation latérale de hanche selon chef", "origin": "Ischion / fémur", "insertion": "Tête de la fibula"}, {"id": "semitendinosus", "label": "Semi-tendineux", "region": "Cuisse postérieure", "innervation": "Nerf tibial (L5-S2)", "action": "Extension hanche; flexion et rotation médiale genou", "origin": "Tubérosité ischiatique", "insertion": "Patte d'oie"}, {"id": "semimembranosus", "label": "Semi-membraneux", "region": "Cuisse postérieure", "innervation": "Nerf tibial (L5-S2)", "action": "Extension hanche; flexion et rotation médiale genou", "origin": "Tubérosité ischiatique", "insertion": "Condyle médial du tibia"}, {"id": "tibialis_anterior", "label": "Tibial antérieur", "region": "Jambe", "innervation": "Nerf fibulaire profond (L4-L5)", "action": "Dorsiflexion et inversion", "origin": "Tibia latéral et membrane interosseuse", "insertion": "Cunéiforme médial et base du 1er métatarsien"}, {"id": "gastrocnemius", "label": "Gastrocnémien", "region": "Jambe postérieure", "innervation": "Nerf tibial (S1-S2)", "action": "Flexion plantaire; flexion du genou", "origin": "Condyles fémoraux", "insertion": "Calcanéus via tendon calcanéen"}, {"id": "soleus", "label": "Soléaire", "region": "Jambe postérieure", "innervation": "Nerf tibial (S1-S2)", "action": "Flexion plantaire", "origin": "Tibia et fibula proximaux", "insertion": "Calcanéus via tendon calcanéen"}, {"id": "fibularis_longus", "label": "Long fibulaire", "region": "Jambe latérale", "innervation": "Nerf fibulaire superficiel (L5-S1)", "action": "Éversion; flexion plantaire", "origin": "Fibula", "insertion": "Base du 1er métatarsien et cunéiforme médial"}, {"id": "fibularis_brevis", "label": "Court fibulaire", "region": "Jambe latérale", "innervation": "Nerf fibulaire superficiel (L5-S1)", "action": "Éversion; flexion plantaire", "origin": "Fibula distale", "insertion": "Base du 5e métatarsien"}, {"id": "tibialis_posterior", "label": "Tibial postérieur", "region": "Jambe profonde", "innervation": "Nerf tibial (L4-L5)", "action": "Inversion et flexion plantaire; soutien de la voûte", "origin": "Tibia, fibula, membrane interosseuse", "insertion": "Naviculaire et os du tarse"}, {"id": "extensor_hallucis_longus", "label": "Long extenseur de l'hallux", "region": "Jambe antérieure", "innervation": "Nerf fibulaire profond (L5-S1)", "action": "Extension de l'hallux; dorsiflexion", "origin": "Fibula et membrane interosseuse", "insertion": "Phalange distale de l'hallux"}, {"id": "extensor_digitorum_longus", "label": "Long extenseur des orteils", "region": "Jambe antérieure", "innervation": "Nerf fibulaire profond (L5-S1)", "action": "Extension des orteils; dorsiflexion", "origin": "Tibia/fibula", "insertion": "Phalanges des orteils 2-5"}, {"id": "masseter", "label": "Masséter", "region": "Tête", "innervation": "Nerf mandibulaire (V3)", "action": "Élévation de la mandibule", "origin": "Arcade zygomatique", "insertion": "Angle et branche de la mandibule"}, {"id": "temporalis", "label": "Temporal", "region": "Tête", "innervation": "Nerf mandibulaire (V3)", "action": "Élévation et rétropulsion de la mandibule", "origin": "Fosse temporale", "insertion": "Processus coronoïde"}, {"id": "sternocleidomastoid", "label": "Sterno-cléido-mastoïdien", "region": "Cou", "innervation": "Nerf accessoire (XI) et branches cervicales", "action": "Flexion cervicale; inclinaison homolatérale et rotation controlatérale", "origin": "Manubrium et clavicule", "insertion": "Processus mastoïde"}, {"id": "trapezius", "label": "Trapèze", "region": "Dos", "innervation": "Nerf accessoire (XI) et branches cervicales", "action": "Élévation, rétraction, abaissement et rotation supérieure de la scapula", "origin": "Occiput, ligament nuchal et processus spinaux cervico-thoraciques", "insertion": "Clavicule, acromion et épine de la scapula"}, {"id": "rhomboid_major", "label": "Rhomboïde majeur", "region": "Dos", "innervation": "Nerf dorsal de la scapula (C4-C5)", "action": "Rétraction et rotation inférieure de la scapula", "origin": "Processus spinaux T2-T5", "insertion": "Bord médial de la scapula"}, {"id": "serratus_anterior", "label": "Dentelé antérieur", "region": "Thorax", "innervation": "Nerf thoracique long (C5-C7)", "action": "Protraction et rotation supérieure de la scapula; maintien contre le thorax", "origin": "Faces latérales des côtes 1-8/9", "insertion": "Bord médial et angle inférieur de la scapula"}, {"id": "rectus_abdominis", "label": "Droit de l'abdomen", "region": "Tronc", "innervation": "Nerfs thoraco-abdominaux", "action": "Flexion du tronc et stabilisation", "origin": "Crête pubienne", "insertion": "Processus xiphoïde et cartilages costaux"}, {"id": "erector_spinae", "label": "Érecteurs du rachis", "region": "Rachis", "innervation": "Branches postérieures des nerfs spinaux", "action": "Extension et contrôle postural du rachis", "origin": "Sacrum et régions lombaires", "insertion": "Côtes, vertèbres et crâne selon faisceau"}, {"id": "piriformis", "label": "Piriforme", "region": "Hanche profonde", "innervation": "Nerf du piriforme", "action": "Rotation latérale de hanche; abduction de hanche fléchie", "origin": "Face antérieure du sacrum", "insertion": "Grand trochanter"}, {"id": "popliteus", "label": "Poplité", "region": "Genou", "innervation": "Nerf tibial", "action": "Déverrouillage du genou; rotation médiale du tibia", "origin": "Condyle latéral du fémur", "insertion": "Face postérieure du tibia proximal"}, {"id": "plantaris", "label": "Plantaire", "region": "Jambe", "innervation": "Nerf tibial", "action": "Faible flexion plantaire et flexion du genou", "origin": "Fémur distal", "insertion": "Calcanéus via tendon calcanéen"}, {"id": "extensor_carpi_ulnaris", "label": "Extenseur ulnaire du carpe", "region": "Avant-bras", "innervation": "Nerf radial (branche profonde)", "action": "Extension et inclinaison ulnaire du poignet", "origin": "Épicondyle latéral et ulna", "insertion": "Base du 5e métacarpien"}], BON=[{"id": "scapula", "label": "Scapula", "region": "Ceinture scapulaire", "description": "Os plat; glène; acromion; processus coracoïde"}, {"id": "clavicle", "label": "Clavicule", "region": "Ceinture scapulaire", "description": "Os long; relie sternum et scapula"}, {"id": "humerus", "label": "Humérus", "region": "Bras", "description": "Tête humérale; tubercules; trochlée; capitulum"}, {"id": "radius", "label": "Radius", "region": "Avant-bras", "description": "Tête radiale; col; tubérosité; extrémité distale"}, {"id": "ulna", "label": "Ulna", "region": "Avant-bras", "description": "Olécrâne; processus coronoïde; incisure trochléaire"}, {"id": "pelvis", "label": "Os coxal", "region": "Bassin", "description": "Ilion; ischion; pubis; acétabulum"}, {"id": "femur", "label": "Fémur", "region": "Cuisse", "description": "Tête; col; trochanters; condyles"}, {"id": "patella", "label": "Patella", "region": "Genou", "description": "Os sésamoïde du tendon quadricipital"}, {"id": "tibia", "label": "Tibia", "region": "Jambe", "description": "Plateau tibial; tubérosité; malléole médiale"}, {"id": "fibula", "label": "Fibula", "region": "Jambe", "description": "Tête; corps; malléole latérale"}, {"id": "talus", "label": "Talus", "region": "Pied", "description": "Participe à l'articulation talo-crurale"}, {"id": "calcaneus", "label": "Calcanéus", "region": "Pied", "description": "Plus grand os du tarse; insertion du tendon calcanéen"}, {"id": "vertebra", "label": "Vertèbre", "region": "Rachis", "description": "Corps, arc, processus; variations selon région"}, {"id": "sternum", "label": "Sternum", "region": "Thorax", "description": "Manubrium, corps, processus xiphoïde"}, {"id": "rib", "label": "Côte", "region": "Thorax", "description": "Os plat courbe participant à la cage thoracique"}, {"id": "mandible", "label": "Mandibule", "region": "Tête", "description": "Os impair de la face; porte les dents mandibulaires et participe à l'articulation temporo-mandibulaire."}, {"id": "skull", "label": "Crâne", "region": "Tête", "description": "Ensemble osseux protégeant l'encéphale et constituant le squelette de la face."}, {"id": "sacrum", "label": "Sacrum", "region": "Rachis", "description": "Os résultant de la fusion des vertèbres sacrées; participe à l'anneau pelvien."}, {"id": "coccyx", "label": "Coccyx", "region": "Rachis", "description": "Segment terminal du rachis."}, {"id": "carpals", "label": "Os du carpe", "region": "Main", "description": "Huit petits os organisés en deux rangées entre radius/ulna et métacarpiens."}, {"id": "metacarpals", "label": "Métacarpiens", "region": "Main", "description": "Cinq os du squelette de la main entre carpe et phalanges."}, {"id": "phalanges_hand", "label": "Phalanges de la main", "region": "Main", "description": "Os des doigts organisés en phalanges proximales, moyennes et distales, sauf le pouce."}, {"id": "tarsals", "label": "Os du tarse", "region": "Pied", "description": "Ensemble de sept os du tarse, dont talus et calcanéus."}, {"id": "metatarsals", "label": "Métatarsiens", "region": "Pied", "description": "Cinq os du squelette du pied entre tarse et phalanges."}, {"id": "phalanges_foot", "label": "Phalanges du pied", "region": "Pied", "description": "Os des orteils."}], JOI=[{"id": "glenohumeral", "label": "Glenohumérale", "region": "Épaule", "type": "sphéroïde", "movements": "Flexion, extension, abduction, adduction, rotations, circumduction"}, {"id": "elbow", "label": "Coude", "region": "Coude", "type": "charnière principalement", "movements": "Flexion, extension; prono-supination via articulations radio-ulnaires"}, {"id": "wrist", "label": "Radio-carpienne", "region": "Poignet", "type": "ellipsoïde", "movements": "Flexion, extension, inclinaisons radiale et ulnaire"}, {"id": "hip", "label": "Coxo-fémorale", "region": "Hanche", "type": "sphéroïde", "movements": "Flexion, extension, abduction, adduction, rotations"}, {"id": "knee", "label": "Genou", "region": "Genou", "type": "bicondylaire complexe", "movements": "Flexion, extension; rotations accessoires en flexion"}, {"id": "ankle", "label": "Talo-crurale", "region": "Cheville", "type": "ginglyme", "movements": "Dorsiflexion et flexion plantaire"}, {"id": "subtalar", "label": "Sous-talienne", "region": "Pied", "type": "articulation synoviale", "movements": "Mouvements contribuant à l'inversion/éversion"}, {"id": "cervical", "label": "Rachis cervical", "region": "Rachis", "type": "complexe", "movements": "Flexion, extension, inclinaisons, rotations"}, {"id": "atm", "label": "Temporo-mandibulaire", "region": "Tête", "type": "synoviale complexe", "movements": "Ouverture, fermeture, propulsion, rétropulsion et diduction"}, {"id": "cervical_upper", "label": "Cervicales supérieures", "region": "Rachis", "type": "complexe", "movements": "Rotation et flexion-extension de la tête"}, {"id": "radioulnar", "label": "Radio-ulnaire", "region": "Avant-bras", "type": "trochoïde", "movements": "Pronation et supination"}, {"id": "thumb_cmc", "label": "Trapézo-métacarpienne", "region": "Main", "type": "selle", "movements": "Flexion, extension, abduction, adduction et opposition du pouce"}, {"id": "mtp", "label": "Métatarso-phalangiennes", "region": "Pied", "type": "ellipsoïde", "movements": "Flexion, extension, mouvements latéraux limités"}], PATH=[{"id": "lateral_ankle_sprain", "label": "Entorse latérale de cheville", "structures": ["ATFL", "fibulaires", "talo-crurale"], "mechanism": "Traumatisme en inversion, souvent avec flexion plantaire.", "assessment": ["douleur", "œdème", "amplitude", "appui", "stabilité", "contrôle unipodal"], "rehab": ["mobilité", "renforcement", "proprioception", "tâches fonctionnelles"], "criteria": ["douleur contrôlée", "amplitude fonctionnelle", "force et contrôle suffisants", "tolérance aux tâches"]}, {"id": "patellofemoral_pain", "label": "Douleur fémoro-patellaire", "structures": ["patella", "quadriceps", "hanche"], "mechanism": "Douleur antérieure du genou souvent liée à la charge et aux tâches fonctionnelles; mécanismes multifactoriels.", "assessment": ["douleur et irritabilité", "tolérance aux escaliers/squat", "force quadriceps", "contrôle hanche-genou"], "rehab": ["gestion de charge", "renforcement quadriceps", "renforcement hanche", "progression fonctionnelle"], "criteria": ["meilleure tolérance aux tâches", "contrôle du mouvement", "progression de la capacité de charge"]}, {"id": "shoulder_rotator_cuff", "label": "Douleur liée à la coiffe des rotateurs", "structures": ["supra-épineux", "infra-épineux", "subscapulaire", "deltoïde"], "mechanism": "Douleur d'épaule liée à la charge; diagnostic clinique à individualiser.", "assessment": ["amplitude", "force", "douleur à l'élévation", "fonction"], "rehab": ["gestion de charge", "mobilité selon déficit", "renforcement progressif", "réintégration fonctionnelle"], "criteria": ["amplitude fonctionnelle", "tolérance à la charge", "force progressive"]}, {"id": "low_back_pain", "label": "Lombalgie commune — approche fonctionnelle", "structures": ["rachis lombaire", "muscles du tronc", "hanche"], "mechanism": "Tableau fréquent et multifactoriel; rechercher les signes d'alerte avant une prise en charge fonctionnelle.", "assessment": ["douleur", "fonction", "mobilité", "tolérance aux activités", "drapeaux rouges"], "rehab": ["éducation", "activité graduée", "exercices adaptés", "retour progressif aux activités"], "criteria": ["fonction améliorée", "meilleure tolérance à l'activité", "autogestion"]}, {"id": "ankle_instability", "label": "Instabilité chronique de cheville", "structures": ["ligaments latéraux", "fibulaires", "proprioception"], "mechanism": "Récidives d'entorses et déficit de contrôle/stabilité à préciser au bilan.", "assessment": ["historique de récidives", "amplitude", "force", "équilibre unipodal", "contrôle dynamique"], "rehab": ["renforcement des fibulaires", "proprioception", "contrôle dynamique", "progression vers les tâches sportives"], "criteria": ["absence de sensation d'instabilité dans les tâches ciblées", "contrôle unipodal", "tolérance aux changements de direction"]}, {"id": "neck_pain", "label": "Cervicalgie mécanique", "structures": ["rachis cervical", "muscles cervicaux", "ceinture scapulaire"], "mechanism": "Tableau multifactoriel; évaluation clinique et recherche de signes d'alerte indispensables.", "assessment": ["douleur", "mobilité cervicale", "fonction", "neurologie si indiquée", "drapeaux rouges"], "rehab": ["éducation", "mobilité adaptée", "renforcement cervico-scapulaire", "progression fonctionnelle"], "criteria": ["fonction améliorée", "tolérance accrue aux activités", "autogestion"]}, {"id": "achilles_tendinopathy", "label": "Tendinopathie achilléenne", "structures": ["tendon calcanéen", "triceps sural", "cheville"], "mechanism": "Douleur liée à la charge et à la capacité du tendon à tolérer celle-ci.", "assessment": ["douleur et irritabilité", "capacité de charge", "force du triceps sural", "fonction"], "rehab": ["gestion de charge", "renforcement progressif du mollet", "travail fonctionnel", "retour progressif aux impacts"], "criteria": ["tolérance à la charge", "force/endurance du mollet", "progression fonctionnelle"]}, {"id": "lateral_epicondylalgia", "label": "Épicondylalgie latérale", "structures": ["extenseurs du poignet", "coude"], "mechanism": "Douleur du compartiment latéral du coude associée à la charge des extenseurs; diagnostic différentiel nécessaire.", "assessment": ["douleur à la charge", "force de préhension", "tolérance aux tâches", "mobilité"], "rehab": ["gestion de charge", "renforcement progressif des extenseurs", "travail fonctionnel"], "criteria": ["tolérance à la préhension", "augmentation progressive de capacité"]}], COURSES=[{"id": "anatomie-intro", "title": "Anatomie humaine — Introduction", "category": "Anatomie", "file": "Anatomie_Humaine_Introduction_COURS_PEDAGOGIQUE_VERIFIE.pdf", "description": "Support d'introduction à l'anatomie humaine utilisé pour la base de révision."}, {"id": "squelette-mmss", "title": "Système squelettique appendiculaire — MMSS", "category": "Anatomie", "file": "1. Système squelettique MMSS.pdf", "description": "Cours UFV sur le squelette du membre supérieur : rappels, clavicule, scapula et structures associées."}, {"id": "fondements-kine", "title": "Fondements de la kinésithérapie — Concepts généraux", "category": "Kinésithérapie", "file": "Fondements_de_la_Kinesitherapie_CONCEPTS_GENERAUX_COURS_COMPLET_SCHÉMAS_TABLEAUX.pdf", "description": "Concepts généraux de la kinésithérapie, domaines d'action et agents physiques."}, {"id": "biomeca-intro", "title": "Biomécanique — Introduction", "category": "Biomécanique", "file": "Biomecanique_Introduction_COURS_PEDAGOGIQUE_VERIFIE_FINAL.pdf", "description": "Support pédagogique d'introduction à la biomécanique."}, {"id": "biomeca-mouvement", "title": "Biomécanique — Analyse du mouvement et magnitudes", "category": "Biomécanique", "file": "Biomecanique_Analyse_Mouvement_MAGNITUDES_COURS_CORRIGE_TABLEAUX_SCHEMAS.pdf", "description": "Cours enrichi consacré à l'analyse du mouvement et aux grandeurs biomécaniques."}, {"id": "physio-bloc1", "title": "Physiologie humaine — Bloc I", "category": "Physiologie", "file": "Physiologie_Humaine_Bloc_I_COURS_VRAIMENT_ENRICHI_AVEC_LES_43_PAGES_ORIGINALES.pdf", "description": "Cours de physiologie humaine, bloc I."}, {"id": "physio-cellule", "title": "Physiologie cellulaire — Synthèse des protéines et division", "category": "Physiologie", "file": "Physiologie_Cellule_Synthese_Proteines_Division_COURS_COMPLET_ENRICHI.pdf", "description": "Cours consacré à la synthèse protéique et à la division cellulaire."}], CHAPS=[{"course_id": "anatomie-intro", "course": "Anatomie humaine — Introduction", "chapter_id": "anatomie-intro_1", "title": "Position anatomique"}, {"course_id": "anatomie-intro", "course": "Anatomie humaine — Introduction", "chapter_id": "anatomie-intro_2", "title": "Plans et axes"}, {"course_id": "anatomie-intro", "course": "Anatomie humaine — Introduction", "chapter_id": "anatomie-intro_3", "title": "Termes anatomiques"}, {"course_id": "anatomie-intro", "course": "Anatomie humaine — Introduction", "chapter_id": "anatomie-intro_4", "title": "Mouvements"}, {"course_id": "anatomie-intro", "course": "Anatomie humaine — Introduction", "chapter_id": "anatomie-intro_5", "title": "Articulations"}, {"course_id": "squelette-mmss", "course": "Système squelettique appendiculaire — MMSS", "chapter_id": "squelette-mmss_1", "title": "Ceinture scapulaire"}, {"course_id": "squelette-mmss", "course": "Système squelettique appendiculaire — MMSS", "chapter_id": "squelette-mmss_2", "title": "Bras"}, {"course_id": "squelette-mmss", "course": "Système squelettique appendiculaire — MMSS", "chapter_id": "squelette-mmss_3", "title": "Avant-bras"}, {"course_id": "squelette-mmss", "course": "Système squelettique appendiculaire — MMSS", "chapter_id": "squelette-mmss_4", "title": "Main"}, {"course_id": "squelette-mmss", "course": "Système squelettique appendiculaire — MMSS", "chapter_id": "squelette-mmss_5", "title": "Articulations du membre supérieur"}, {"course_id": "fondements-kine", "course": "Fondements de la kinésithérapie — Concepts généraux", "chapter_id": "fondements-kine_1", "title": "Définition de la kinésithérapie"}, {"course_id": "fondements-kine", "course": "Fondements de la kinésithérapie — Concepts généraux", "chapter_id": "fondements-kine_2", "title": "Mouvement et kinesis"}, {"course_id": "fondements-kine", "course": "Fondements de la kinésithérapie — Concepts généraux", "chapter_id": "fondements-kine_3", "title": "Agents thérapeutiques"}, {"course_id": "fondements-kine", "course": "Fondements de la kinésithérapie — Concepts généraux", "chapter_id": "fondements-kine_4", "title": "Objectifs de rééducation"}, {"course_id": "fondements-kine", "course": "Fondements de la kinésithérapie — Concepts généraux", "chapter_id": "fondements-kine_5", "title": "Relation thérapeutique"}, {"course_id": "biomeca-intro", "course": "Biomécanique — Introduction", "chapter_id": "biomeca-intro_1", "title": "Forces"}, {"course_id": "biomeca-intro", "course": "Biomécanique — Introduction", "chapter_id": "biomeca-intro_2", "title": "Équilibre"}, {"course_id": "biomeca-intro", "course": "Biomécanique — Introduction", "chapter_id": "biomeca-intro_3", "title": "Leviers"}, {"course_id": "biomeca-intro", "course": "Biomécanique — Introduction", "chapter_id": "biomeca-intro_4", "title": "Lois de Newton"}, {"course_id": "biomeca-intro", "course": "Biomécanique — Introduction", "chapter_id": "biomeca-intro_5", "title": "Analyse mécanique"}, {"course_id": "biomeca-mouvement", "course": "Biomécanique — Analyse du mouvement et magnitudes", "chapter_id": "biomeca-mouvement_1", "title": "Mouvement"}, {"course_id": "biomeca-mouvement", "course": "Biomécanique — Analyse du mouvement et magnitudes", "chapter_id": "biomeca-mouvement_2", "title": "Vecteurs"}, {"course_id": "biomeca-mouvement", "course": "Biomécanique — Analyse du mouvement et magnitudes", "chapter_id": "biomeca-mouvement_3", "title": "Magnitudes"}, {"course_id": "biomeca-mouvement", "course": "Biomécanique — Analyse du mouvement et magnitudes", "chapter_id": "biomeca-mouvement_4", "title": "Moments et couples"}, {"course_id": "biomeca-mouvement", "course": "Biomécanique — Analyse du mouvement et magnitudes", "chapter_id": "biomeca-mouvement_5", "title": "Cinématique"}, {"course_id": "physio-bloc1", "course": "Physiologie humaine — Bloc I", "chapter_id": "physio-bloc1_1", "title": "Homéostasie"}, {"course_id": "physio-bloc1", "course": "Physiologie humaine — Bloc I", "chapter_id": "physio-bloc1_2", "title": "Fonctions physiologiques"}, {"course_id": "physio-bloc1", "course": "Physiologie humaine — Bloc I", "chapter_id": "physio-bloc1_3", "title": "Systèmes"}, {"course_id": "physio-bloc1", "course": "Physiologie humaine — Bloc I", "chapter_id": "physio-bloc1_4", "title": "Muscle"}, {"course_id": "physio-bloc1", "course": "Physiologie humaine — Bloc I", "chapter_id": "physio-bloc1_5", "title": "Système nerveux"}, {"course_id": "physio-cellule", "course": "Physiologie cellulaire — Synthèse des protéines et division", "chapter_id": "physio-cellule_1", "title": "Organisation cellulaire"}, {"course_id": "physio-cellule", "course": "Physiologie cellulaire — Synthèse des protéines et division", "chapter_id": "physio-cellule_2", "title": "ADN et information génétique"}, {"course_id": "physio-cellule", "course": "Physiologie cellulaire — Synthèse des protéines et division", "chapter_id": "physio-cellule_3", "title": "Synthèse des protéines"}, {"course_id": "physio-cellule", "course": "Physiologie cellulaire — Synthèse des protéines et division", "chapter_id": "physio-cellule_4", "title": "Cycle cellulaire"}, {"course_id": "physio-cellule", "course": "Physiologie cellulaire — Synthèse des protéines et division", "chapter_id": "physio-cellule_5", "title": "Division cellulaire"}];
 const KEY="ak31_ultimate_progress";
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"seen":{},"mastered":{},"weak":{},"sessions":0}')}catch(e){return {seen:{},mastered:{},weak:{},sessions:0}}};
 const put=x=>localStorage.setItem(KEY,JSON.stringify(x));
 const all=[...MUS.map(x=>({...x,_type:"Muscle"})),...BON.map(x=>({...x,_type:"Os"})),...JOI.map(x=>({...x,_type:"Articulation"})),...PATH.map(x=>({...x,_type:"Clinique"}))];

 function app(){return document.querySelector("#app")||document.body}
 function hub(){
  const root=app(), p=get();
  root.innerHTML=`<div class="page">
   <div style="padding:20px;border-radius:20px;background:rgba(127,127,127,.08);margin-bottom:16px">
    <h1 style="margin:0 0 6px">Anatomy Kiné — ULTIMATE</h1>
    <p style="margin:0;opacity:.8">Ton espace de travail : cours → anatomie → biomécanique → clinique → rééducation → examen.</p>
   </div>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px">
    ${[
      ["anatomy","🦴 Atlas anatomique",`${MUS.length} muscles · ${BON.length} os · ${JOI.length} articulations`],
      ["clinical","🩺 Pathologies & cas",`${PATH.length} parcours cliniques`],
      ["movement","⚙️ Mouvements & biomécanique","Plans · axes · muscles · fonctions"],
      ["courses","📚 Mes cours UFV",`${COURSES.length||7} supports intégrés`],
      ["exam","📝 Examen global","QCM · cas · réponses courtes"],
      ["progress","📊 Mon suivi","Maîtrise · erreurs · sessions"]
    ].map(x=>`<button class="secondary" data-mode="${x[0]}" style="text-align:left;padding:18px;border-radius:16px"><b>${x[1]}</b><br><small>${x[2]}</small></button>`).join("")}
   </div>
   <section style="margin-top:16px;padding:18px;border-radius:18px;border:1px solid rgba(127,127,127,.25)">
    <h3>Boucle de travail</h3>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${["Apprendre","Comprendre","S'entraîner","Évaluer","Corriger","Revoir"].map(x=>`<span style="padding:8px 11px;border-radius:10px;background:rgba(127,127,127,.08)">${x}</span>`).join("")}</div>
   </section>
  </div>`;
  root.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>route(b.dataset.mode));
 }
 function route(mode){
  if(mode==="anatomy") atlas();
  else if(mode==="clinical") clinical();
  else if(mode==="movement") movement();
  else if(mode==="courses") coursesView();
  else if(mode==="exam") exam();
  else progress();
 }
 function shell(title,sub,body){
  const root=app();
  root.innerHTML=`<div class="page"><button class="secondary" id="ak31-home">← Accueil</button><h2>${title}</h2><p style="opacity:.8">${sub}</p><div id="ak31-body">${body}</div></div>`;
  root.querySelector("#ak31-home").onclick=hub;
  return root.querySelector("#ak31-body");
 }
 function atlas(){
  const body=shell("Atlas anatomique","Recherche un muscle, un os, une articulation ou une structure clinique.",`<input id="a-search" placeholder="Rechercher dans tout l'atlas…" style="width:100%;box-sizing:border-box;padding:13px;border-radius:12px;border:1px solid rgba(127,127,127,.3)"><div id="a-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-top:12px"></div>`);
  const draw=()=>{
   const q=(body.querySelector("#a-search").value||"").toLowerCase();
   const arr=all.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).slice(0,120);
   body.querySelector("#a-grid").innerHTML=arr.map((x,i)=>`<button class="secondary" data-i="${i}" style="text-align:left;padding:14px"><b>${esc(x.label)}</b><br><small>${esc(x._type)} · ${esc(x.region||"")}</small></button>`).join("")||"<p>Aucun résultat.</p>";
   body.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>detail(arr[+b.dataset.i],body));
  };
  body.querySelector("#a-search").oninput=draw; draw();
 }
 function detail(x,body){
  const p=get(), key=x._type+":"+x.id;
  let html="";
  if(x._type==="Muscle") html=`<div class="ak-grid">${[["Région",x.region],["Origine",x.origin],["Insertion",x.insertion],["Innervation",x.innervation],["Action",x.action]].map(a=>`<section><b>${a[0]}</b><p>${esc(a[1])}</p></section>`).join("")}</div>`;
  else if(x._type==="Os") html=`<section><b>Région :</b> ${esc(x.region)}<p>${esc(x.description)}</p></section>`;
  else if(x._type==="Articulation") html=`<section><b>Type :</b> ${esc(x.type)}<p><b>Mouvements :</b> ${esc(x.movements)}</p></section>`;
  else html=`<section><b>Mécanisme / contexte :</b><p>${esc(x.mechanism)}</p><h4>Bilan</h4><ul>${x.assessment.map(a=>`<li>${esc(a)}</li>`).join("")}</ul><h4>Rééducation</h4><ul>${x.rehab.map(a=>`<li>${esc(a)}</li>`).join("")}</ul><h4>Critères</h4><ul>${x.criteria.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></section>`;
  body.innerHTML=`<button class="secondary" id="d-back">← Atlas</button><h3>${esc(x.label)}</h3>${html}<button class="primary" id="d-master">${p.mastered[key]?"✓ Maîtrisé":"Marquer comme maîtrisé"}</button>`;
  body.querySelector("#d-back").onclick=atlas;
  body.querySelector("#d-master").onclick=()=>{const z=get();z.mastered[key]=true;put(z);detail(x,body)};
 }
 function clinical(){
  const body=shell("Pathologies & cas cliniques","Travaille le raisonnement : mécanisme → bilan → objectifs → rééducation → critères.",`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px">${PATH.map((x,i)=>`<button class="secondary" data-p="${i}" style="text-align:left;padding:16px"><b>${esc(x.label)}</b><br><small>${esc(x.structures.join(" · "))}</small></button>`).join("")}</div>`);
  body.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>caseView(PATH[+b.dataset.p],body));
 }
 function caseView(x,body){
  body.innerHTML=`<button class="secondary" id="c-back">← Cas</button><h3>${esc(x.label)}</h3>
   <p>${esc(x.mechanism)}</p>
   <div class="ak-grid">
    <section><h4>Structures</h4><p>${x.structures.map(esc).join(" · ")}</p></section>
    <section><h4>Bilan</h4><ul>${x.assessment.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></section>
    <section><h4>Axes de rééducation</h4><ul>${x.rehab.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></section>
    <section><h4>Critères de progression</h4><ul>${x.criteria.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></section>
   </div>
   <button class="primary" id="c-done">✓ Cas étudié</button>`;
  body.querySelector("#c-back").onclick=clinical;
  body.querySelector("#c-done").onclick=()=>{const z=get();z.mastered["path:"+x.id]=true;put(z);body.querySelector("#c-done").textContent="✓ Cas enregistré"};
 }
 function movement(){
  const entries=Object.entries(window.ak22MovementMap||{});
  const body=shell("Mouvements & biomécanique","Relie mouvement, articulation, plan, axe et muscles.",`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">${entries.map(([id,x])=>`<button class="secondary" data-m="${id}" style="text-align:left;padding:15px"><b>${esc(x.label)}</b><br><small>${esc(x.joint)} · ${esc(x.plane)} · ${esc(x.axis)}</small></button>`).join("")}</div>`);
  body.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{
    const x=window.ak22MovementMap[b.dataset.m];
    body.innerHTML=`<button class="secondary" id="m-back">← Mouvements</button><h3>${esc(x.label)}</h3>
    <div class="ak-grid"><section><b>Articulation</b><p>${esc(x.joint)}</p></section><section><b>Plan</b><p>${esc(x.plane)}</p></section><section><b>Axe</b><p>${esc(x.axis)}</p></section><section><b>Moteurs</b><ul>${x.prime_movers.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></section><section><b>Antagonistes</b><ul>${x.antagonists.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></section><section><b>Application</b><p>${esc(x.clinical)}</p></section></div>`;
    body.querySelector("#m-back").onclick=movement;
  });
 }
 function coursesView(){
  const body=shell("Mes cours UFV","Accès direct aux supports intégrés et à leurs chapitres.",`<div style="display:grid;gap:10px">${(COURSES.length?COURSES:[]).map((c,i)=>`<button class="secondary" data-c="${i}" style="text-align:left;padding:16px"><b>${esc(c.title||c.name||"Cours")}</b><br><small>${esc(c.file||c.path||"Support intégré")}</small></button>`).join("") || "<p>Les supports déjà intégrés dans la version précédente restent accessibles depuis l'onglet Mes cours.</p>"}</div>`);
  body.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{
    const c=COURSES[+b.dataset.c];
    body.innerHTML=`<button class="secondary" id="cr-back">← Cours</button><h3>${esc(c.title||c.name)}</h3><p>${esc(c.file||c.path||"")}</p><button class="primary" id="cr-open">Ouvrir le support</button>`;
    body.querySelector("#cr-back").onclick=coursesView;
    body.querySelector("#cr-open").onclick=()=>{if(c.file||c.path){const u=c.file||c.path;window.open(u,"_blank")}};
  });
 }
 function exam(){
  const body=shell("Examen global","Utilise le moteur d'examen V30 avec la base élargie.",`<p>La V30 contient le moteur complet. La base V31 ajoute davantage de structures et de clinique.</p><button class="primary" id="go-exam">Lancer l'examen</button>`);
  body.querySelector("#go-exam").onclick=()=>window.renderExamV30?window.renderExamV30():alert("Module examen indisponible");
 }
 function progress(){
  const p=get(), mastered=Object.keys(p.mastered).length, weak=Object.entries(p.weak).sort((a,b)=>b[1]-a[1]);
  const body=shell("Mon suivi","Une vue synthétique de ton apprentissage.",`<div class="ak-grid">
   <section><h3>Structures maîtrisées</h3><p style="font-size:28px">${mastered}</p></section>
   <section><h3>Sessions d'examen</h3><p style="font-size:28px">${p.sessions||0}</p></section>
   <section><h3>Points faibles</h3><p>${weak.slice(0,8).map(x=>`${esc(x[0])} (${x[1]})`).join(" · ")||"Pas encore de données."}</p></section>
   <section><h3>Base actuelle</h3><p>${MUS.length} muscles · ${BON.length} os · ${JOI.length} articulations · ${PATH.length} parcours cliniques</p></section>
  </div>`);
 }
 window.renderUltimateV31=hub;
 window.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{
   if(document.querySelector("#ak31-ultimate"))return;
   const b=document.createElement("button");b.id="ak31-ultimate";b.className="primary";b.textContent="Anatomy Kiné ULTIMATE V31";b.onclick=hub;
   (document.querySelector("main")||document.querySelector("#app")||document.body).appendChild(b);
 },1900));
})();
