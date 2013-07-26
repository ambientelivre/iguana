if(document.location.href.indexOf("debug=true") > 0){
	requireCfg['paths']['analyzer'] = CONTEXT_PATH+'content/analyzer/scripts';
} else {
	requireCfg['paths']['analyzer'] = CONTEXT_PATH+'content/analyzer/scripts/compressed';
}