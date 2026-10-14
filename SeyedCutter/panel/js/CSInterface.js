/* Minimal CSInterface for SeyedCutter - evalScript bridge */
function CSInterface(){}
CSInterface.prototype.evalScript = function(script, callback){
  if(window.__adobe_cep__){
    window.__adobe_cep__.evalScript(script, callback);
  } else {
    if(callback) callback("ERR: Not in Premiere (no CEP bridge).");
  }
};
