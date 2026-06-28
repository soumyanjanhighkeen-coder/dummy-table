export function generateCanvasDocument(): string {
  const chipPresets = [
    { bg: '#ede9fe', color: '#7c3aed', label: 'Aa' },
    { bg: '#dbeafe', color: '#1d4ed8', label: 'Aa' },
    { bg: '#dcfce7', color: '#15803d', label: 'Aa' },
    { bg: '#fef9c3', color: '#a16207', label: 'Aa' },
    { bg: '#fee2e2', color: '#dc2626', label: 'Aa' },
    { bg: '#1e293b', color: '#f8fafc', label: 'Aa' },
  ];

  // Build chip toolbar HTML buttons string
  const chipButtons = chipPresets
    .map(
      (c) =>
        `<button class="pb-chip-opt" style="background:${c.bg};color:${c.color};" ` +
        `data-bg="${c.bg}" data-fg="${c.color}" title="Wrap as chip">${c.label}</button>`,
    )
    .join('');

  const script = [
    '(function(){',
    'var canvas=document.getElementById("canvas");',
    'var empty=document.getElementById("empty-state");',
    'var tb=document.getElementById("pb-text-tb");',
    'var selected=null;',
    'var savedRange=null;',

    // ── Empty state ──────────────────────────────────────
    'function hideEmpty(){if(empty)empty.style.display="none";}',
    'function checkEmpty(){',
    '  var blocks=canvas.querySelectorAll("[data-block-id]");',
    '  if(empty)empty.style.display=blocks.length?"none":"";}',

    // ── Block selection ──────────────────────────────────
    'function selectBlock(el){',
    '  deselectAll();',
    '  selected=el;',
    '  el.classList.add("pb-selected");',
    '  var props={};',
    '  try{props=JSON.parse(el.getAttribute("data-props").replace(/&quot;/g,\'"\'));}catch(e){}',
    '  window.parent.postMessage({',
    '    type:"BLOCK_SELECTED",',
    '    payload:{id:el.getAttribute("data-block-id"),blockType:el.getAttribute("data-block-type"),props:props}',
    '  },"*");',
    '}',
    'function deselectAll(){',
    '  document.querySelectorAll(".pb-selected").forEach(function(el){el.classList.remove("pb-selected");});',
    '  if(selected){selected=null;window.parent.postMessage({type:"BLOCK_DESELECTED"},"*");}',
    '}',

    // ── Chip toolbar ─────────────────────────────────────
    'function showTb(rect){',
    '  tb.style.display="flex";',
    '  var top=rect.top+window.scrollY-tb.offsetHeight-8;',
    '  var left=rect.left+(rect.width/2)-(tb.offsetWidth/2);',
    '  if(top<4)top=rect.bottom+window.scrollY+8;',
    '  tb.style.top=Math.max(4,top)+"px";',
    '  tb.style.left=Math.max(4,left)+"px";',
    '}',
    'function hideTb(){tb.style.display="none";savedRange=null;}',

    'function wrapChip(bg,fg){',
    '  var sel=window.getSelection();',
    '  if(!sel||!sel.rangeCount)return;',
    '  var range=savedRange||sel.getRangeAt(0);',
    '  if(range.collapsed)return;',
    '  var span=document.createElement("span");',
    '  span.className="pb-chip";',
    '  span.style.cssText="background:"+bg+";color:"+fg+";padding:1px 10px;border-radius:999px;font-size:0.85em;font-weight:500;display:inline;white-space:nowrap;cursor:pointer;";',
    '  span.setAttribute("data-pb-chip","1");',
    '  try{',
    '    range.surroundContents(span);',
    '  }catch(e){',
    // fallback for multi-node selections: extract, wrap, reinsert
    '    var frag=range.extractContents();',
    '    span.appendChild(frag);',
    '    range.insertNode(span);',
    '  }',
    '  sel.removeAllRanges();',
    '  hideTb();',
    '}',

    'function clearChip(){',
    '  var sel=window.getSelection();',
    '  var range=savedRange||(sel&&sel.rangeCount?sel.getRangeAt(0):null);',
    '  if(!range)return;',
    // Walk up to find a chip span
    '  var node=range.commonAncestorContainer;',
    '  var chip=null;',
    '  while(node&&node!==document.body){',
    '    if(node.nodeType===1&&node.getAttribute&&node.getAttribute("data-pb-chip")){chip=node;break;}',
    '    node=node.parentNode;',
    '  }',
    '  if(!chip)return;',
    // Unwrap: replace chip with its children
    '  var parent=chip.parentNode;',
    '  while(chip.firstChild)parent.insertBefore(chip.firstChild,chip);',
    '  parent.removeChild(chip);',
    '  hideTb();',
    '}',

    // Show toolbar on mouseup if there is a non-empty selection in an editable area
    'document.addEventListener("mouseup",function(e){',
    '  if(e.target.closest("#pb-text-tb"))return;',
    '  setTimeout(function(){',
    '    var sel=window.getSelection();',
    '    if(!sel||sel.isCollapsed||!sel.toString().trim()){hideTb();return;}',
    '    var anchor=sel.anchorNode;',
    '    var editable=null;',
    '    var node=anchor;',
    '    while(node&&node!==document.body){',
    '      if(node.nodeType===1&&node.getAttribute("contenteditable")==="true"){editable=node;break;}',
    '      node=node.parentNode;',
    '    }',
    '    if(!editable){hideTb();return;}',
    '    savedRange=sel.getRangeAt(0).cloneRange();',
    '    var rect=sel.getRangeAt(0).getBoundingClientRect();',
    '    showTb(rect);',
    '  },10);',
    '});',

    // Hide toolbar when clicking elsewhere
    'document.addEventListener("mousedown",function(e){',
    '  if(!e.target.closest("#pb-text-tb"))hideTb();',
    '});',

    // Chip preset button clicks
    'tb.querySelectorAll(".pb-chip-opt").forEach(function(btn){',
    '  btn.addEventListener("mousedown",function(e){',
    '    e.preventDefault();',
    '    wrapChip(btn.getAttribute("data-bg"),btn.getAttribute("data-fg"));',
    '  });',
    '});',

    // Clear chip button
    'var clearBtn=document.getElementById("pb-chip-clear");',
    'if(clearBtn)clearBtn.addEventListener("mousedown",function(e){e.preventDefault();clearChip();});',

    // Double-click on an existing chip → remove it
    'document.addEventListener("dblclick",function(e){',
    '  if(e.target.getAttribute&&e.target.getAttribute("data-pb-chip")){',
    '    var chip=e.target;',
    '    var parent=chip.parentNode;',
    '    while(chip.firstChild)parent.insertBefore(chip.firstChild,chip);',
    '    parent.removeChild(chip);',
    '    hideTb();',
    '  }',
    '});',

    // ── Editable setup ───────────────────────────────────
    'function setupEditable(block){',
    '  block.querySelectorAll("[data-editable]").forEach(function(el){',
    '    el.setAttribute("contenteditable","true");',
    '    el.addEventListener("focus",function(e){e.stopPropagation();});',
    '    el.addEventListener("input",function(){',
    '      window.parent.postMessage({type:"CONTENT_CHANGED",payload:{',
    '        blockId:block.getAttribute("data-block-id"),',
    '        field:el.getAttribute("data-field"),',
    '        value:el.innerHTML',
    '      }},"*");',
    '    });',
    '    el.addEventListener("keydown",function(e){',
    '      if(e.key==="Enter"&&!e.shiftKey&&el.tagName!=="P"){e.preventDefault();el.blur();}',
    '    });',
    '  });',
    '}',

    // ── Action bar ───────────────────────────────────────
    'var dragSrcId=null;',
    'function addActions(block){',
    '  var bar=document.createElement("div");',
    '  bar.className="pb-actions";',
    '  bar.innerHTML=',
    '    \'<button class="pb-btn pb-drag" draggable="true" title="Drag to reorder">&#10269;</button>\'',
    '   +\'<button class="pb-btn" title="Move up" onclick="pbMoveUp(this)">&#8593;</button>\'',
    '   +\'<button class="pb-btn" title="Move down" onclick="pbMoveDown(this)">&#8595;</button>\'',
    '   +\'<span class="pb-type"></span>\'',
    '   +\'<button class="pb-btn pb-del" title="Delete" onclick="pbDelete(this)">&#10005;</button>\';',
    '  bar.querySelector(".pb-type").textContent=block.getAttribute("data-block-type");',
    '  block.insertBefore(bar,block.firstChild);',
    // Drag handle events
    '  var dragBtn=bar.querySelector(".pb-drag");',
    '  dragBtn.addEventListener("dragstart",function(e){',
    '    dragSrcId=block.getAttribute("data-block-id");',
    '    e.dataTransfer.setData("text/plain",dragSrcId);',
    '    e.dataTransfer.effectAllowed="move";',
    '    setTimeout(function(){block.style.opacity="0.4";},0);',
    '  });',
    '  dragBtn.addEventListener("dragend",function(){',
    '    block.style.opacity="";',
    '    canvas.querySelectorAll("[data-block-id]").forEach(function(b){b.classList.remove("pb-drop-above","pb-drop-below");});',
    '  });',
    // Block drop zone events
    '  block.addEventListener("dragover",function(e){e.preventDefault();e.dataTransfer.dropEffect="move";});',
    '  block.addEventListener("dragenter",function(e){',
    '    e.preventDefault();',
    '    if(block.getAttribute("data-block-id")===dragSrcId)return;',
    '    var rect=block.getBoundingClientRect();',
    '    var mid=rect.top+rect.height/2;',
    '    block.classList.remove("pb-drop-above","pb-drop-below");',
    '    if(e.clientY<mid){block.classList.add("pb-drop-above");}else{block.classList.add("pb-drop-below");}',
    '  });',
    '  block.addEventListener("dragleave",function(e){',
    '    if(!block.contains(e.relatedTarget)){block.classList.remove("pb-drop-above","pb-drop-below");}',
    '  });',
    '  block.addEventListener("drop",function(e){',
    '    e.preventDefault();',
    '    var srcId=e.dataTransfer.getData("text/plain");',
    '    var src=canvas.querySelector("[data-block-id=\\""+srcId+"\\"]");',
    '    if(!src||src===block){block.classList.remove("pb-drop-above","pb-drop-below");return;}',
    '    var above=block.classList.contains("pb-drop-above");',
    '    block.classList.remove("pb-drop-above","pb-drop-below");',
    '    if(above){canvas.insertBefore(src,block);}else{canvas.insertBefore(src,block.nextSibling);}',
    '    var order=Array.from(canvas.querySelectorAll("[data-block-id]")).map(function(b){return b.getAttribute("data-block-id");});',
    '    window.parent.postMessage({type:"BLOCK_REORDERED",payload:{order:order}},"*");',
    '  });',
    '}',

    'window.pbMoveUp=function(btn){',
    '  var b=btn.closest("[data-block-id]");',
    '  var prev=b.previousElementSibling;',
    '  if(prev&&prev!==empty){canvas.insertBefore(b,prev);}',
    '  var order=Array.from(canvas.querySelectorAll("[data-block-id]")).map(function(b){return b.getAttribute("data-block-id");});',
    '  window.parent.postMessage({type:"BLOCK_REORDERED",payload:{order:order}},"*");',
    '};',
    'window.pbMoveDown=function(btn){',
    '  var b=btn.closest("[data-block-id]");',
    '  var next=b.nextElementSibling;',
    '  if(next){canvas.insertBefore(next,b);}',
    '  var order=Array.from(canvas.querySelectorAll("[data-block-id]")).map(function(b){return b.getAttribute("data-block-id");});',
    '  window.parent.postMessage({type:"BLOCK_REORDERED",payload:{order:order}},"*");',
    '};',
    'window.pbDelete=function(btn){',
    '  var b=btn.closest("[data-block-id]");',
    '  var id=b.getAttribute("data-block-id");',
    '  if(selected===b){selected=null;window.parent.postMessage({type:"BLOCK_DESELECTED"},"*");}',
    '  b.remove();',
    '  window.parent.postMessage({type:"BLOCK_DELETED",payload:{id:id}},"*");',
    '  checkEmpty();',
    '};',

    // ── Click handler ────────────────────────────────────
    'document.addEventListener("click",function(e){',
    '  if(e.target.closest(".pb-actions"))return;',
    '  if(e.target.closest("#pb-text-tb"))return;',
    '  var b=e.target.closest("[data-block-id]");',
    '  if(b){if(selected!==b)selectBlock(b);}else{deselectAll();}',
    '});',

    // ── Messages from Angular ────────────────────────────
    'window.addEventListener("message",function(e){',
    '  if(!e.data||!e.data.type)return;',
    '  var d=e.data;',

    '  if(d.type==="ADD_BLOCK"){',
    '    hideEmpty();',
    '    var w=document.createElement("div");',
    '    w.innerHTML=d.payload.html;',
    '    var b=w.firstElementChild;',
    '    canvas.appendChild(b);',
    '    setupEditable(b);',
    '    addActions(b);',
    '    selectBlock(b);',
    '  }',

    '  if(d.type==="UPDATE_BLOCK_STYLE"){',
    '    var el=document.querySelector("[data-block-id=\\""+d.payload.id+"\\"]");',
    '    if(el)Object.assign(el.style,d.payload.styles);',
    '  }',

    '  if(d.type==="UPDATE_FIELD_STYLE"){',
    '    var blk=document.querySelector("[data-block-id=\\""+d.payload.blockId+"\\"]");',
    '    if(blk){var fel=blk.querySelector("[data-field=\\""+d.payload.field+"\\"]");if(fel)Object.assign(fel.style,d.payload.styles);}',
    '  }',

    '  if(d.type==="UPDATE_IMAGE_SRC"){',
    '    var imgBlk=document.querySelector("[data-block-id=\\""+d.payload.id+"\\"]");',
    '    if(imgBlk){',
    '      var container=imgBlk.querySelector("[data-img-container]");',
    '      if(container){',
    '        container.innerHTML=d.payload.src',
    '          ?\'<img src="\'+d.payload.src+\'" alt="\'+d.payload.alt+\'" style="width:100%;height:auto;border-radius:\'+d.payload.borderRadius+\';display:block;">\'',
    '          :\'<span style="color:#94a3b8;font-size:0.9rem;font-family:-apple-system,sans-serif;">&#128247; Add an image URL in the properties panel</span>\';',
    '      }',
    '    }',
    '  }',

    '  if(d.type==="REBUILD_CANVAS"){',
    '    canvas.querySelectorAll("[data-block-id]").forEach(function(b){b.remove();});',
    '    d.payload.blocks.forEach(function(html){',
    '      var w=document.createElement("div");',
    '      w.innerHTML=html;',
    '      var b=w.firstElementChild;',
    '      if(b){canvas.appendChild(b);setupEditable(b);addActions(b);}',
    '    });',
    '    checkEmpty();',
    '  }',

    '  if(d.type==="UPDATE_GALLERY"){',
    '    var gblk=canvas.querySelector("[data-block-id=\\""+d.payload.id+"\\"]");',
    '    if(gblk){',
    '      for(var gi=1;gi<=6;gi++){',
    '        var gcell=gblk.querySelector("[data-gi=\\""+gi+"\\"]");',
    '        if(gcell){',
    '          var gsrc=d.payload["img"+gi];',
    '          gcell.innerHTML=gsrc',
    '            ?\'<img src="\'+gsrc+\'" style="width:100%;height:200px;object-fit:cover;border-radius:\'+d.payload.borderRadius+\'">\'',
    '            :\'<div style="background:#e2e8f0;height:200px;border-radius:\'+d.payload.borderRadius+\';display:flex;align-items:center;justify-content:center;font-size:1.5rem;">&#128444;</div>\';',
    '        }',
    '      }',
    '    }',
    '  }',

    '  if(d.type==="UPDATE_BRAND_COLOR"){',
    '    document.documentElement.style.setProperty("--pb-brand",d.payload.color);',
    '    document.documentElement.style.setProperty("--pb-brand-dark",d.payload.colorDark||d.payload.color);',
    '  }',

    '  if(d.type==="EXPORT_HTML"){',
    '    var clone=canvas.cloneNode(true);',
    '    clone.querySelectorAll(".pb-actions").forEach(function(n){n.remove();});',
    '    clone.querySelectorAll("[contenteditable]").forEach(function(n){n.removeAttribute("contenteditable");});',
    '    clone.querySelectorAll("[data-block-id]").forEach(function(n){',
    '      n.removeAttribute("data-block-id");n.removeAttribute("data-block-type");n.removeAttribute("data-props");',
    '    });',
    '    clone.querySelectorAll("[data-editable]").forEach(function(n){n.removeAttribute("data-editable");n.removeAttribute("data-field");});',
    '    clone.querySelectorAll("[data-pb-chip]").forEach(function(n){n.removeAttribute("data-pb-chip");});',
    '    var html="<!doctype html>\\n<html>\\n<head>\\n<meta charset=\\"utf-8\\">\\n"',
    '      +"<meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\">\\n"',
    '      +"<style>\\n:root{--pb-brand:#6366f1}\\n*,*::before,*::after{box-sizing:border-box}\\n"',
    '      +"body{margin:0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif}\\n"',
    '      +".pb-chip{display:inline;padding:1px 10px;border-radius:999px;font-size:0.85em;font-weight:500;}\\n"',
    '      +"</style>\\n</head>\\n<body>\\n"+clone.innerHTML+"\\n</body>\\n</html>";',
    '    window.parent.postMessage({type:"EXPORT_RESULT",payload:{html:html}},"*");',
    '  }',

    '});',

    // ── Slash block menu ─────────────────────────────────
    'var SLASH_P=[',
    '  {type:"hero",label:"Hero",icon:"⭐",desc:"Full-width hero section",pro:false},',
    '  {type:"features",label:"Features",icon:"▨",desc:"3-column feature grid",pro:false},',
    '  {type:"testimonial",label:"Testimonial",icon:"❝",desc:"Quote & author",pro:false},',
    '  {type:"cta-banner",label:"CTA Banner",icon:"★",desc:"Call-to-action banner",pro:false},',
    '  {type:"newsletter",label:"Newsletter",icon:"✉",desc:"Email signup form",pro:false},',
    '  {type:"faq",label:"FAQ",icon:"❓",desc:"Accordion FAQ section",pro:true},',
    '  {type:"pricing",label:"Pricing",icon:"💰",desc:"3-column pricing table",pro:true},',
    '  {type:"form",label:"Contact Form",icon:"📝",desc:"Contact form block",pro:true},',
    '  {type:"heading",label:"Heading",icon:"H",desc:"Section heading",pro:false},',
    '  {type:"paragraph",label:"Text",icon:"T",desc:"Text paragraph",pro:false},',
    '  {type:"button",label:"Button",icon:"⬡",desc:"Clickable button",pro:false},',
    '  {type:"image",label:"Image",icon:"🖼",desc:"Image block",pro:false},',
    '  {type:"video",label:"Video",icon:"▶",desc:"Embed video (YouTube etc.)",pro:false},',
    '  {type:"gallery",label:"Gallery",icon:"🖼",desc:"6-image photo grid",pro:true},',
    '  {type:"code",label:"Custom HTML",icon:"</>",desc:"Raw HTML block",pro:true},',
    '  {type:"divider",label:"Divider",icon:"—",desc:"Horizontal rule",pro:false},',
    '];',
    'var smenu=document.getElementById("pb-slash-menu");',
    'var slist=document.getElementById("pb-slash-list");',
    'var sVis=false,sAct=0,sPal=[],sNode=null,sSoff=0;',

    'function sRender(f){',
    '  sPal=SLASH_P.filter(function(p){return !f||p.label.toLowerCase().indexOf(f)===0||p.type.indexOf(f)===0;});',
    '  slist.innerHTML=sPal.map(function(p,i){',
    '    var proBadge=p.pro?\'<span style="background:#f59e0b;color:#fff;font-size:0.6rem;padding:1px 5px;border-radius:4px;margin-left:auto;font-weight:700;">PRO</span>\':\'\'',
    '    return \'<div class="pb-si\'+(i===sAct?\' pb-sia\':\'\')+\'" data-i="\'+i+\'"><div class="pb-si-icon">\'+p.icon+\'</div>\'',
    '      +\'<div style="flex:1"><div class="pb-si-label">\'+p.label+\'</div><div class="pb-si-desc">\'+p.desc+\'</div></div>\'+proBadge+\'</div>\';',
    '  }).join("");',
    '  slist.querySelectorAll(".pb-si").forEach(function(el){',
    '    el.addEventListener("mousedown",function(e){e.preventDefault();sSel(sPal[+el.getAttribute("data-i")]);});',
    '  });',
    '}',

    'function sShow(rect,f){',
    '  sAct=0;sRender(f);',
    '  if(!sPal.length){sHide();return;}',
    '  smenu.style.display="block";sVis=true;',
    '  smenu.style.top=(rect.bottom+window.scrollY+6)+"px";',
    '  smenu.style.left=Math.max(4,rect.left)+"px";',
    '}',

    'function sHide(){sVis=false;smenu.style.display="none";sNode=null;}',

    'function sMove(d){',
    '  if(!sPal.length)return;',
    '  sAct=(sAct+d+sPal.length)%sPal.length;',
    '  slist.querySelectorAll(".pb-si").forEach(function(el,i){el.classList.toggle("pb-sia",i===sAct);});',
    '  var a=slist.querySelector(".pb-sia");if(a)a.scrollIntoView({block:"nearest"});',
    '}',

    'function sSel(item){',
    '  if(item.pro){',
    '    sHide();',
    '    window.parent.postMessage({type:"SHOW_UPGRADE",payload:{blockType:item.type}},"*");',
    '    return;',
    '  }',
    '  var sel=window.getSelection();',
    '  if(sel&&sel.rangeCount&&sNode){',
    '    try{',
    '      var cur=sel.getRangeAt(0);',
    '      var dr=document.createRange();',
    '      dr.setStart(sNode,sSoff);',
    '      dr.setEnd(cur.startContainer,cur.startOffset);',
    '      dr.deleteContents();',
    '    }catch(ex){}',
    '  }',
    '  sHide();',
    '  window.parent.postMessage({type:"ADD_BLOCK_TYPE",payload:{blockType:item.type}},"*");',
    '}',

    'document.addEventListener("input",function(e){',
    '  var el=e.target;',
    '  if(!el||!el.getAttribute||el.getAttribute("contenteditable")!=="true")return;',
    '  var sel=window.getSelection();',
    '  if(!sel||!sel.rangeCount){sHide();return;}',
    '  var r=sel.getRangeAt(0);',
    '  var n=r.startContainer;',
    '  if(n.nodeType!==3){sHide();return;}',
    '  var off=r.startOffset;',
    '  var before=n.textContent.slice(0,off);',
    '  var m=before.match(/\\/(\\S*)$/);',
    '  if(m){',
    '    sNode=n;sSoff=off-m[0].length;',
    '    var sr=document.createRange();',
    '    sr.setStart(n,sSoff);sr.setEnd(n,sSoff+1);',
    '    sShow(sr.getBoundingClientRect(),m[1].toLowerCase());',
    '  }else{sHide();}',
    '});',

    'document.addEventListener("keydown",function(e){',
    '  if(!sVis)return;',
    '  if(e.key==="ArrowDown"){e.preventDefault();sMove(1);}',
    '  else if(e.key==="ArrowUp"){e.preventDefault();sMove(-1);}',
    '  else if(e.key==="Enter"){e.preventDefault();if(sPal[sAct])sSel(sPal[sAct]);}',
    '  else if(e.key==="Escape"){e.preventDefault();sHide();}',
    '},true);',

    'document.addEventListener("mousedown",function(e){',
    '  if(smenu&&!smenu.contains(e.target))sHide();',
    '});',

    '})();',
  ].join('\n');

  const styles = `
:root{--pb-brand:#6366f1;}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;min-height:100vh;}
#canvas{min-height:100vh;}

.block{position:relative;cursor:pointer;transition:box-shadow 0.15s;}
.block:hover{outline:2px dashed rgba(99,102,241,0.5);outline-offset:-2px;z-index:1;}
.block.pb-selected{outline:2px solid #6366f1 !important;outline-offset:-2px;z-index:2;}

.pb-actions{
  display:none;position:absolute;top:-38px;right:0;
  background:#6366f1;border-radius:6px 6px 0 0;
  padding:4px 6px;gap:2px;align-items:center;
  font-family:-apple-system,sans-serif;z-index:100;
}
.pb-selected .pb-actions{display:flex;}
.pb-btn{
  background:none;border:none;color:rgba(255,255,255,0.9);cursor:pointer;
  padding:3px 8px;font-size:12px;border-radius:4px;line-height:1;
}
.pb-btn:hover{background:rgba(255,255,255,0.2);}
.pb-del{color:#fca5a5;}
.pb-del:hover{color:#fff;background:rgba(239,68,68,0.5);}
.pb-type{font-size:10px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.08em;padding:0 6px;}
.pb-drag{cursor:grab;font-size:14px;}
.pb-drag:active{cursor:grabbing;}
.pb-drop-above{border-top:2px solid #6366f1 !important;}
.pb-drop-below{border-bottom:2px solid #6366f1 !important;}

[contenteditable]:focus{outline:none;}
[contenteditable]:hover{cursor:text;}

/* Chip inline spans */
.pb-chip{display:inline;padding:1px 10px;border-radius:999px;font-size:0.85em;font-weight:500;cursor:pointer;}
.pb-chip:hover{opacity:0.85;}

/* Text selection floating toolbar */
#pb-text-tb{
  display:none;position:absolute;
  background:#1e293b;border-radius:10px;
  padding:6px 8px;gap:4px;align-items:center;
  box-shadow:0 8px 24px rgba(0,0,0,0.3),0 2px 6px rgba(0,0,0,0.2);
  z-index:9999;user-select:none;
  pointer-events:auto;
  transition:opacity 0.1s;
}
#pb-text-tb::after{
  content:'';position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
  border:6px solid transparent;border-bottom:none;border-top-color:#1e293b;
}
.pb-chip-opt{
  border:none;cursor:pointer;
  width:26px;height:26px;border-radius:6px;
  font-size:0.7rem;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  transition:transform 0.1s,box-shadow 0.1s;
  flex-shrink:0;
}
.pb-chip-opt:hover{transform:scale(1.15);box-shadow:0 2px 6px rgba(0,0,0,0.25);}
.pb-tb-sep{width:1px;height:18px;background:rgba(255,255,255,0.12);margin:0 2px;}
.pb-chip-clear{
  background:none;border:none;color:rgba(255,255,255,0.5);
  cursor:pointer;font-size:11px;padding:3px 7px;border-radius:5px;
  white-space:nowrap;
}
.pb-chip-clear:hover{background:rgba(255,255,255,0.1);color:#fff;}

#pb-intro{
  padding:100px 40px 24px;
  font-size:1.125rem;
  color:#1e293b;
  line-height:1.7;
  outline:none;
  caret-color:#6366f1;
  min-height:180px;
}
#pb-intro:empty::before{
  content:attr(data-placeholder);
  color:#c0c9d6;
  pointer-events:none;
  display:block;
  font-size:1.125rem;
}

/* Slash block menu */
#pb-slash-menu{
  display:none;position:absolute;
  background:#1e293b;border-radius:12px;
  box-shadow:0 8px 32px rgba(0,0,0,0.4),0 2px 8px rgba(0,0,0,0.2);
  z-index:9999;width:248px;overflow-y:auto;max-height:320px;padding:4px;
}
.pb-si{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;color:#e2e8f0;}
.pb-si:hover,.pb-sia{background:#6366f1;}
.pb-si-icon{width:30px;height:30px;border-radius:6px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;}
.pb-si:hover .pb-si-icon,.pb-sia .pb-si-icon{background:rgba(255,255,255,0.2);}
.pb-si-label{font-weight:500;font-size:0.875rem;font-family:-apple-system,sans-serif;}
.pb-si-desc{font-size:0.72rem;color:rgba(255,255,255,0.5);margin-top:1px;font-family:-apple-system,sans-serif;}
.pb-sia .pb-si-desc{color:rgba(255,255,255,0.75);}
`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${styles}</style>
</head>
<body>

<!-- Slash block menu -->
<div id="pb-slash-menu"><div id="pb-slash-list"></div></div>

<!-- Floating text-selection chip toolbar -->
<div id="pb-text-tb">
  ${chipButtons}
  <div class="pb-tb-sep"></div>
  <button class="pb-chip-clear" id="pb-chip-clear">clear</button>
</div>

<div id="canvas">
  <div id="pb-intro" contenteditable="true" data-placeholder="Start typing, or press / to insert a block…"></div>
</div>
<script>${script}</script>
</body>
</html>`;
}
