var cs = new CSInterface();
var csvText = "";
var csvRows = [];

function setStatus(t){ document.getElementById("status").textContent = t; }

function parseCSV(text){
  var lines = text.replace(/\r/g,"").split("\n");
  var rows = [];
  for(var i=0;i<lines.length;i++){
    var line = lines[i].trim();
    if(!line) continue;
    if(i===0 && line.toLowerCase().indexOf("start_seconds")>=0) continue;
    // split by comma, label may contain commas -> join rest
    var parts = line.split(",");
    if(parts.length<2) continue;
    var s = parseFloat(parts[0]), e = parseFloat(parts[1]);
    if(isNaN(s)||isNaN(e)||e<=s) continue;
    var label = parts.length>=5 ? parts.slice(4).join(",") : ("Cut "+(rows.length+1));
    rows.push({start:s, end:e, label:label.trim()});
  }
  return rows;
}

document.getElementById("csvFile").addEventListener("change", function(ev){
  var f = ev.target.files[0];
  if(!f){ return; }
  var r = new FileReader();
  r.onload = function(){
    csvText = r.result;
    csvRows = parseCSV(csvText);
    setStatus("Loaded "+f.name+" : "+csvRows.length+" ranges.");
    renderList();
  };
  r.readAsText(f);
});

document.getElementById("btnPreview").addEventListener("click", function(){
  csvRows = parseCSV(csvText);
  setStatus(csvRows.length ? ("Preview: "+csvRows.length+" ranges. First: "+JSON.stringify(csvRows.slice(0,3))) : "No CSV loaded.");
  renderList();
});

function renderList(){
  var el = document.getElementById("list");
  el.innerHTML = csvRows.map(function(r,i){ return (i+1)+". "+r.start+"s -> "+r.end+"s : "+r.label; }).join("<br>");
}

function esc(s){ return s.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n"); }

document.getElementById("btnCut").addEventListener("click", function(){
  if(!csvRows.length){ setStatus("Load a CSV first."); return; }
  var withMarkers = "0"; // markers removed per request - cut only (Ctrl+Shift+K) + red
  // NOTE: ExtendScript in Premiere has NO JSON object -> send plain pipe-delimited text, no JSON.
  var lines = csvRows.map(function(r){
    var safeLabel = String(r.label).replace(/[|;'\r\n]+/g, " ").replace(/\\/g, " ").substring(0, 120);
    return r.start + "|" + r.end + "|" + safeLabel;
  });
  var payload = lines.join("\n").replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n");
  setStatus("Cutting "+csvRows.length+" ranges... (check Premiere)");
  cs.evalScript("seyedCutFromCSVText('"+payload+"',"+withMarkers+")", function(res){
    setStatus(res);
  });
});
