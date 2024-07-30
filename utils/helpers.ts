/**
 * 
 * Helper dédié à l'affichage du cartouche d'informations et préparation du test
 * 
 * @author JC CALVIERA
 * @version 3.3
 *  
 */

import { CartoucheInfo }    from '@commun/types';
import { Page, TestInfo}    from '@playwright/test';
import { JddFile }          from "./file";
import * as dotenv          from "dotenv"

var fs  = require('fs');

//-------------------------------------------------------------------------------------

export class Help {

    readonly oData          : CartoucheInfo;
    readonly testinfo       : TestInfo;
    readonly page           : Page;
    private jddFile         : JddFile;


    public config           : any;
    public profil           : any;

    private dateTest        : Date;
    private sSeparateur     : string;
    private iSeparateurLength:number;

    constructor(oData: CartoucheInfo, testinfo: TestInfo, page: Page) {
        this.oData = oData;    
        this.testinfo = testinfo;    
        this.config = {}; 
        this.page = page;   
        this.iSeparateurLength = 80;
        this.sSeparateur = "-".repeat(this.iSeparateurLength);
        this.dateTest = new Date(testinfo["_startWallTime"]);
        this.jddFile  = new JddFile(testinfo);
    }

    public async init() {

        // Environnement par défaut si non précisé au lancement du test
        const environnement = process.env.ENVIRONNEMENT || 'integration';

        // Utilisateur par défaut
        const login = process.env.USER || 'lunettes';      

        this.config.environnement = environnement;
        this.config.login = login;
        this.config.datas = require(`../conf/environnements/${environnement}.conf.json`);
        this.config.commun= require(`../conf/commun.conf.json`);

        const versionFilePath = `_data/_tmp/versions/${environnement}.versions.json`;
        const currentTime = Date.now();
        let lastModifiedTime = new Date(0).getTime();
        const versionFileExist = this.jddFile.fileExists(versionFilePath);
        if (versionFileExist) {
            lastModifiedTime = this.jddFile.getLastModifiedTime(versionFilePath).getTime(); // retrieve last time version file has been updated
        }

        const delay = 10; //update the versions file if last modification occurred more than 10 minutes ago

        console.log(this.sSeparateur); 
        console.log('| Application  : ' + this.oData.appli);
        console.log('| Reference    : [' + this.oData.refTest + '] - ' + this.oData.desc);
        
        //console.log('| Description  : ' + this.oData.desc);
        if (this.oData.idTest != undefined) {

        console.log('| ID Squash    : ' + this.oData.idTest);  
        console.log('| Cas de Test  : ' + 'http://squash.prosol.pri:8080/squash/test-case-workspace/test-case/' + this.oData.idTest + '/content');  

            // Sauvegarde de la référence Squash (ID_SQUASH) dans un fichier en vu de sa transmission à la fin du TA
            // const sFichierIdSquash:string = '_data/_tmp/pid_' + process.pid + '.txt'
            // fs.writeFile(sFichierIdSquash, this.oData.idTest.toString(), function(err:any) {
            //     if(err) {
            //         console.log('Ooops : Erreur lors de l\'écriture du fichier : ' + sFichierIdSquash, err);
            //     }
            // });

        }

        const aSplitScript = this.testinfo.file.split("\\");
        console.log('| Script       : ' + aSplitScript[aSplitScript.length - 2] + '/' + aSplitScript[aSplitScript.length - 1]); 
        console.log('| Version      : ' + this.oData.version);  

        var stats = fs.statSync(this.oData.fileName);                                   // Date de modification du fichier de tests
        var mtime = new Date(stats.mtime);
        var aRev  = mtime.toString().split(' ');
        console.log('| Crée le      : ' + aRev[2] + ' ' + aRev[1] + ' ' + aRev[3] + ' à ' + aRev[4]); 

        console.log(this.sSeparateur);
        console.log('| Date Tir     : ' + this.addZero(this.dateTest.getDate()) + '-' + this.addZero(this.dateTest.getMonth() + 1) + '-' + this.dateTest.getFullYear() + ' à ' + this.addZero(this.dateTest.getHours()) + ':' + this.addZero(this.dateTest.getMinutes()) + ':' + this.addZero(this.dateTest.getSeconds()));
        console.log('| Profil       : ' + login);
        console.log('| Browser      : ' + this.page.context().browser()?.browserType().name() +'/' + this.page.context().browser()?.version());      
    
		//-- Lien cliquable si appel depuis jenkins
		if (process.env.JOB_NAME != undefined && process.env.BUILD_NUMBER != undefined) {
		var sUrl =  'http://testauto.prosol.pri/' + process.env.JOB_NAME + '/builds/' + process.env.BUILD_NUMBER + '/html/index.html'
		console.log("| Rapport HTML : " + encodeURI(sUrl));
		}

        console.log('| Environnement: ' + environnement); 

        //-- Liste des paramètres admis par le test
        if (this.oData.params.length > 0) {
        console.log('| Input Admis  : ' + this.oData['params'].join(' - '));             
        }

        //-- Affichage du fichier d'aide si il existe
        if (this.oData.help.length > 0) {
            for (let iCpt:number = 0; iCpt < this.oData.help.length; iCpt++) {
                //-- Première ligne
                if (iCpt === 0) {
        console.log('| Aide         : ' + this.oData.help[iCpt]); 
                //-- Lignes suivantes
                } else {
        console.log('|              : ' + this.oData.help[iCpt]);                    
                }
            }            
        }

        //-- liste des paramètres effectivement transmis
        console.log("--Paramètres" + "-".repeat(this.iSeparateurLength - "--Paramètres".length));

        const output = dotenv.config();    

		// Penser à indiquer dans le fichier .env les variables susceptibles d'être intérprétées
        for(var key in output.parsed) {
            if (process.env[key] != '') {
                //-- Données non affichées car déjà publiées
                if (key != 'ENVIRONNEMENT' && key != 'PROJET') {
        console.log('| ' + key.substring(0,12) + " ".repeat(12 - key.substring(0,12).length) + ' : ' + process.env[key]);
                }
            }
        }

        //-- Liste des version des autres applications sigale installées
        console.log("--Versions" + "-".repeat(this.iSeparateurLength - "--Versions".length));

        if (!versionFileExist || (currentTime - lastModifiedTime) > delay * 60 * 1000) { //si > 10 minutes, on récupère de nouveau les versions et on réecrit le fichier
            var jsonResponseUpdate = await this.getVersions(this.getVersionsUrls());
            this.jddFile.writeJsonVersions(environnement, jsonResponseUpdate)
        }
        
        var jsonResponse = this.jddFile.readJsonVersions(environnement)

        if(jsonResponse){
             // Output the updatedJsonResponse
            var jsonVersions = JSON.parse(JSON.stringify(jsonResponse));

            //-- Remplacer le trigramme (appName) par sa désignation complète
            var trigrammeMap = this.config.commun.trigramme
            var fJsonVersions = jsonVersions
            .map(app => {
                const fullText = trigrammeMap[app.appName];
                if (fullText) {
                    return { ...app, appName: fullText };
                }
                return null;
            })
            .filter(app => app !== null); //supprimer si le trigramme n'est pas dans commun.conf.json

         
            //-- Tri par ordre alphébétique des applications
            var aJsonVersions:any = [];
            fJsonVersions.forEach(jsonVersion => {
                aJsonVersions.push({"app" : jsonVersion.appName, "value" : jsonVersion});
            })
            aJsonVersions.sort((a,b) => {
                return a.app.localeCompare(b.app);
            });

            //-- Affichage du tableau
            aJsonVersions.forEach(jsonVersion => {
            
                var jsonDomaine     = jsonVersion.value.appName;

                var selected = '';
                var jsonSha1;

                if (jsonDomaine.toUpperCase() == this.oData.appli || jsonDomaine == this.config.commun.trigramme[this.oData.appli]) {
                    selected = ' <-----';
                }

                if (jsonVersion.value !== null) {
                    var testedVersion   = jsonVersion.value.version;
                    if (jsonVersion.value.sha1 != "Unknown") {
                        jsonSha1            = jsonVersion.value.sha1.substring(0,4) + '...' + jsonVersion.value.sha1.substring(36) + ' |'; 
                    } else {
                        jsonSha1            = jsonVersion.value.sha1 + " ".repeat(4) + ' |'; 
                    }                  
                    var totalLenght     = testedVersion.length + selected.length + 30;
                }

                console.log('| ' + jsonDomaine + " ".repeat(12 - jsonDomaine.length) + ' : ' + testedVersion + selected + " ".repeat(80 - totalLenght) + jsonSha1);
            });
        }
        
        console.log(this.sSeparateur); 
    }

    public async close() {
        console.log('--- Consolidation des données  ---------------------');
        console.log('URL : ' + this.config.datas.URL[this.oData.appli.substring(0,3)]);
        console.log('--- Consolidation des données  ---------------------');
    }

    private async getVersions(urls: { appName: string, url: string }[]) {
        const results: any[] = [];
    
        for (const{ appName, url } of urls) {
            try {
                const response = await Promise.race([ //race between fetch and timeout promise
                    fetch(url, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Error! Timeout reached')), 7000)) //7 seconds timeout
                ]);
    
                if (response instanceof Response) { // We got an answer
                    if (!response.ok) {
                        throw new Error(`Error! status: ${response.status}`);
                    }
                    let result = await response.json();
                    result = { ...result, appName };
                    results.push(result);
                }
            } catch (error) {
                const errorResult = { version: 'Unknown', sha1: 'Unknown', appName };
                results.push(errorResult);
            }
        }
        return results;
    }
    
    private getVersionsUrls(): { appName: string, url: string }[] {
        const urls: { appName: string, url: string }[] = [];
    
        for (const key in this.config.datas.URL) {
            const appName = key;
            const url = this.config.datas.URL[key] + 'ws/version';
            urls.push({ appName, url });
        }
        return urls;
    }



    /**
     * 
     * @param {number} valeur 
     * @desc 1 -> 01 ; 12 -> 12
     * 
    */
    private addZero(valeur: number) {
        if (valeur < 10) {
            return '0' + valeur;
        } else{
            return valeur;
        }
    }

    /**
     * 
     * @returns 
     */
    public getStartTime () :number{
        //return this.addZero(this.dateTest.getDate()) + '-' + this.addZero(this.dateTest.getMonth() + 1) + '-' + this.dateTest.getFullYear() + ' à ' + this.addZero(this.dateTest.getHours()) + ':' + this.addZero(this.dateTest.getMinutes()) + ':' + this.addZero(this.dateTest.getSeconds());
        return this.dateTest.getTime();
    }
    
}