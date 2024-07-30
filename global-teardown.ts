async function globalTeardown() {

    try {

        // Si on est sur l'environnement de PROD et que l'appel vient de Jenkins
        if (process.env.JOB_NAME != undefined && process.env.BUILD_NUMBER != undefined) {
            console.log("-".repeat(80));
            var sUrl =  'http://testauto.prosol.pri/' + process.env.JOB_NAME + '/builds/' + process.env.BUILD_NUMBER + '/html/index.html';
            var sUrlAllure =  'http://testauto.prosol.pri/allure/index.html';
            console.log("Rapport HTML : " + encodeURI(sUrl));
            //console.log("Rapport Allure : " + encodeURI(sUrlAllure));
            //console.log("ID Build Jenkins : " + process.env.BUILD_NUMBER);
            console.log("-".repeat(80));
        }

    } catch (e) {
        console.log(`Error in globalTeardown: ${e}`);
    } finally {
        // NOP
    }
  }
  
  export default globalTeardown;