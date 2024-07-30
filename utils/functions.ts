/**
 * @author JOSIAS SIE, JC CALVIERA, Vazoumana & SIAKA KONE
 * @version 3.44
 *  
 */

import { test, expect, Page, Locator, TestInfo } from '@playwright/test';

import { MenuMagasin }      from '@pom/MAG/menu.page';
import { MenuNomenclature } from '@pom/NOM/menu.page';
import { MenuAchats }       from '@pom/ACH/menu.page';
import { MenuSociete }      from '@pom/SOC/menu.page';
import { MenuFacturation }  from '@pom/FAC/menu.page';
import { MenuPricing }      from '@pom/PRI/menu.page';
import { MenuRepartition }  from '@pom/REP/menu.page';
import { MenuPreparation }  from '@pom/PRE/menu.page';
import { MenuStock }        from '@pom/STO/menu.page';

import { Credential }       from '@conf/environnements/credential.conf.js';
import { GlobalConfigFile}  from '@conf/commun.conf';

import { Log }              from '@helpers/log.js';
import { ElkFunctions }     from '@helpers/elk';

import { AutoComplete, TypeListBox, TypeListOfElements, TypeSearchFile }   from '@commun/types';

import * as crypto          from 'crypto';
import * as fs              from 'fs';
import * as path            from 'path';

let oJdd : {}= {};
const pathTmp     = path.join(__dirname + '/../_data/_tmp/');
const lineLength  = 80;
const separateur  = '-'.repeat(lineLength);

export class TestFunctions {

    public profil               : any;
    public application          : string;
    public url                  : string;
    public appliFullName        : string;
    public environnement        : string;

    private userCredential      : Credential;
    private verboseMode         : boolean;
    private iLengthDeco         : number;
    private iNumAppel           : number;
    private dStartTime          : Date;
    private log                 : Log | any;
    private sData               : any;
    private localConfig         : any;
    private localConfigFile     : string;
    private globalConfigFile    : string;
    private oData               : any;
    private oDataGlobal         : GlobalConfigFile;
    private sUrlEsb             : string;
    private bCheckTrad          : boolean=false;
    private aErrorTrad          : any=[];
    private sEnvPrefixe         :string;
    
    constructor(log?:Log) {

        // On mémorise l'heure de lancement du TA
        this.dStartTime     = new Date();

        // Utilisateur par défaut
        const login         = process.env.USER || 'lunettes';

        // Environnement par défaut si non précisé au lancement du test
        const environnement = process.env.ENVIRONNEMENT || 'integration';
        this.environnement = environnement;
        
        // Pour récupérer des Numéros de Versions Testées
        var configUrl       = require(`../conf/environnements/${environnement}.conf.json`);

        // Le nom de l'environnement sous forme de préfixe
        this.sEnvPrefixe    = configUrl.PREFIXE;

        // Récuperer les noms des application à partir des trigrammes 
        var communConf      = require('../conf/commun.conf.json');

        // 
        this.globalConfigFile = path.join(__dirname, `../conf/commun.conf.ts`);
        this.oDataGlobal    = new GlobalConfigFile();

        // Récupération des informations liées au profil
        this.userCredential = new Credential(login);
        this.application    = process.env.PROJET!       
        this.appliFullName  = communConf.trigramme[this.application];
        this.profil         = this.userCredential.getData();

        // En cas de lancement d'une application le bloc à l'interieur de la condition ci-dessous sera concerné
        if(this.appliFullName != '' && this.appliFullName != undefined){
            var applNameLower = this.appliFullName.toLowerCase();
            this.localConfigFile = path.join(__dirname, `../conf/${applNameLower}.conf.ts`);
            if(fs.existsSync(this.localConfigFile)){
                this.localConfig = require(`../conf/${applNameLower}.conf.ts`).default;
                if(this.isVerbose()){
                    console.log('Configuration Locale: ' + this.localConfigFile);
                }
                // Instanciation du localConfig et on récupère les données
                var instanceLocalConfig = new this.localConfig(this);
                this.sData              = JSON.stringify(instanceLocalConfig.getData(), null, 2);
                this.oData              = JSON.parse(this.sData);
            }else{
                console.log('Pas de fichier de configuration locale trouvé : ' + this.localConfigFile);
            }
        }
        
        // L'URL appelée par le test
        this.url            = configUrl.URL[this.application];
        
        // L'URL appelée pour vérifier les flux Esb
        this.sUrlEsb        = configUrl.ESB;

        // On regarde si on passe en argument VERBOSE_MOD (true/false)
        this.verboseMode    = process.env.VERBOSE_MOD === 'true';

        // Compteur d'appel des promesses
        this.iNumAppel      = 0;

        // Nombre de caractères "-" à afficher pour former une ligne de séparation dans les logs
        this.iLengthDeco    = 120;

        if(log != undefined){
            this.log = log;
        }
    }

    /**
     *
     * @desc On se connecte à l'url de l'application à tester
     *
    */
    public async openUrl(page: Page){
        var url = this.getApplicationUrl();      
        if (this.isVerbose()) {             
            this.cartouche('-- URL : ' , url, false);
        }
        await page.goto(url, {timeout:60000, waitUntil: 'domcontentloaded'});
    }


    /**
     *
     * @desc Teste si on peut se connecter à l'application avec les paramètres définit par défaut dans le fichier de configuration
     *
    */
    public async connexion(page: Page){

        var login           = this.getLogin();
        var password        = this.getPassword();
        var application     = this.getApplicationName();

        var buttonConnexion = page.getByRole('button', { name: 'Connexion' });

        if (application == 'NOM' || application == 'SOC' || application == 'QUA' || application == 'TRA') {

            var inputUsername   = page.locator('input[name="login"]');
            var inputPassword   = page.locator('input[name="password"]');
            var sHomePageUrl    = '**/home';

        } else if (application == 'DON') {

            var inputUsername   = page.locator('#login-input-login');
            var inputPassword   = page.locator('#login-input-password');
            var sHomePageUrl    = '**/home';

        } else { 

            var inputUsername   = page.locator('#input-login');  
            var inputPassword   = page.locator('#input-password');
            var sHomePageUrl    = '**/#/';  
            await this.wait(page, 500);    
            page.waitForSelector('#input-login');
        }

        await this.wait(page, 500);

        //-- Essai fiabilisation
        await expect(async () => {

            //-- Remplissage formulaire d'authentification

            await this.sendKeys(inputUsername, login);
            await this.sendKeys(inputPassword, password);

            //-- Soumission formulaire
            await this.clickElement(buttonConnexion);

          }).toPass({
            // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe
            // ... Defaults to [100, 250, 500, 1000].
            //intervals: [1_000, 2_000, 10_000],
            timeout: 60_000
          });

          await page.waitForURL(sHomePageUrl, {waitUntil: 'domcontentloaded'});
          await this.waitTillHTMLRendered(page, 30000);          

    };


    /**
     *  @desc Vérifie si la déconnexion est effective
     */
    public async deconnexion(page: Page) {

        var application             = this.getApplicationName();

        if ( application == 'ACH') {
            var menuAchats          = new MenuAchats(page);
            var listBoxUser         = menuAchats.listBoxUser;
            var linkDeconnexion     = menuAchats.linkDeconnexion;
            var deconnexionOk       = '**/#/connexion';
        } else if ( application == 'STO') {
            var menuStock           = new MenuStock(page);
            var listBoxUser         = menuStock.listBoxUser;
            var linkDeconnexion     = menuStock.linkDeconnexion;  
            var deconnexionOk       = '**/#/connexion';           
        } else if ( application == 'MAG') {
            var menuMagasin         = new MenuMagasin(page);
            var listBoxUser         = menuMagasin.listBoxUser;
            var linkDeconnexion     = menuMagasin.linkDeconnexion; 
            var deconnexionOk       = '**/#/connexion';             
        }else if ( application  == 'SOC'){
            var menuSocietes        = new MenuSociete(page);
            var listBoxUser         = menuSocietes.listBoxUser;
            var linkDeconnexion     = menuSocietes.linkDeconnexion; 
            var deconnexionOk       = '**/login';            
        }else if ( application  == 'FAC'){
            var menuFacturation     = new MenuFacturation(page);
            var listBoxUser         = menuFacturation.listBoxUser;
            var linkDeconnexion     = menuFacturation.linkDeconnexion;
            var deconnexionOk       = '**/#/connexion';            
        }else if ( application  == 'NOM'){
            var menuNomenclature    = new MenuNomenclature(page);
            var listBoxUser         = menuNomenclature.listBoxUser; 
            var linkDeconnexion     = menuNomenclature.linkDeconnexion;
            var deconnexionOk       = '**/login';
        }else if ( application  == 'PRI'){
            var menuPricing         = new MenuPricing(page);
            var listBoxUser         = menuPricing.listBoxUser;
            var linkDeconnexion     = menuPricing.linkDeconnexion;
            var deconnexionOk       = '**/#/connexion'; 
        }else if (application   == 'REP'){           
            var menuRepartition     = new MenuRepartition(page)
            var listBoxUser         = menuRepartition.listBoxUser;
            var linkDeconnexion     = menuRepartition.linkDeconnexion;
            var deconnexionOk       = '**/#/connexion'
        }else if (application   == 'PRE'){
            var menuPreparation     = new MenuPreparation(page)
            var listBoxUser         = menuPreparation.listBoxUser
            var linkDeconnexion     = menuPreparation.linkDeconnexion
            var deconnexionOk       = '**/#/connexion'
        } 

        await test.step('ListBox [USER] - Click', async () => {
            if ( application == 'MAG') {
                await menuMagasin.removeArlerteMessage();                 //-- On supprime le message d'avertissement si celui-ci est affiché.
            }
            await expect(listBoxUser).toBeEnabled();
            await this.clickElement(listBoxUser);
        });

        await test.step('Link [DECONNEXION] - Click', async () => {
            await expect(linkDeconnexion).toBeEnabled();
            await this.clickElement(linkDeconnexion);
            await this.waitTillHTMLRendered(page, 30000, this.isVerbose());
        });

        await test.step('Check URL', async () => {
            await page.waitForURL(deconnexionOk);
        });
    }

    /**
     * @desc retourne le "Login" du profil utilisé
     */
    public getLogin():string {
        return this.profil.login;
    };

    /**
     * @desc modifier le "Login" du profil utilisé
     */
    public setLogin(login:string) {
        this.profil.login = login;
    };

    /**
     * @desc retourne le "Mot de Passe" du profil utilisé
     */
    private getPassword():string {
        return this.profil.password;
    };

    /**
     * @desc retourne le "Mot de Passe" du profil utilisé
     */
    public setPassword(passerword:string) {
        this.profil.password = passerword;
    };


    /**
     * @desc retourne le nom de l'application en cours de test
     */
    private getApplicationName():string {
        return this.application;
    }

    
    /**
     * @desc retourne l'url de l'application utilisée
     */
    public getApplicationUrl():string {
        return this.url;
    };


    /**
     * @desc Spécifie l'url de l'application utilisée
     */
    public setApplicationUrl(sUrl:string) {
        this.url = sUrl;
    };


    /**
     * 
     * @desc vérifie si un élément est affiché
     * 
     * @param {Locator} selector 
     * 
     */
    public async isDisplayed(selector: Locator){        
        if(selector != undefined){
            await expect(selector).toBeVisible({ timeout: 30000 });      
        }else {
            throw new Error('TypeError : First argument is expected to be a Locator')
        }  
    }


    /**
     * 
     * @desc Fonction générique vérifiant si un bouton (présent) est cliquable et change son style pour afficher sa position
     * 
     * @param {Locator} selector 
     * @param {any} random (Optionnel) Clique aléatoirement sur l'élément si la randomisation est active. 
     *  
     */
    public async clickElement(selector:Locator, random:any = 1) {
        await selector.waitFor({state:'visible'}); // Attendez que l'élément soit visible
        if (selector != undefined) {
            
            var bClick:boolean = true;

            //-- Si la randomisation est active, 
            if (random !== 1){
                if(this.random() < random) {
                    bClick = false;
                }
            }

            if (bClick) {
                this.checkTraductions(await selector.textContent());
                await selector.evaluate((elem) => {
                    elem.style.background = 'yellow';
                    elem.style.border = '2px solid red';
                    elem.style.color = 'black';
                });                
                await selector.click();                
            }

        }else {
            throw new Error('TypeError : First argument is expected to be an Locator');
        }  
    }


    /**
     * 
     * @desc vérifie (ou affiche) le contenu des entêtes de colonne d'un tableau (dataGrid). La valeur '** skip **' permet d'ignorer la valeur transmise.
     * 
     * @param {object} tab 
     * 
     */
    public async dataGridHeaders(tab:TypeListOfElements): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            if (typeof tab === 'object') {

                const dataGrid      = tab['element'];   // Sous forme "d'element"
                const description   = tab['desc'];      // Desciption pour afficher en mode debug (optionnel)
                var aItems          = tab['column'];
                const bHelper       = tab['verbose'];

                const sIgnore       = '** skip **';     // Balise servant de "jocker" est évitant que la données tansmise fasse partie des éléments à examiner (donnée trop fluctuente généralement)
            
                if (bHelper) {

                    // Affiche les données présentes
                    test.step(`*** HEADER HELPER MODE ***`, async () => {
                        const nbElements = await dataGrid.count();
                        var aHeaders = await dataGrid.allTextContents();
                        console.log(`------------------ Ligne : ${description} = ${nbElements} élément(s) -------------------------`);                        
                        //console.log(aHeaders);
                        aHeaders = aHeaders.map(function(e) { 
                            e = e.replace(/\n/, ' ').trim();                    // Suppression des espaces et sauts de lignes parasites
                            return e;
                        });

                        aHeaders.forEach((sElement) => {
                            console.log(`'${sElement.replace(/'/g, "\\'")}',`);
                        }) 

                        resolve();

                    });



                } else {

                    if (this.bCheckTrad) {

                        test.step('Trad', async() => {
                            var aTextes = await dataGrid.allTextContents()
                            this.checkTraductions(aTextes.toString());
                            //console.log('H>>>>>>>>>>>>>>>' + aTextes.toString());
                        })
                        

                    } else {

                        // Vérification par rapport aux données attendues
                        test.step(`${description} - ${aItems.length} Items Checked`, async () => {

                            var aExistant = await dataGrid.allTextContents();
                            var iIndex = 0;

                            aExistant.forEach( (sData: string) => {
                                if (aItems[iIndex] !== sIgnore){
                                    aExistant[iIndex] = sData.trim();	            // Suppression des espaces
                                } else {
                                    aExistant[iIndex] = sIgnore;                    // Substitution de la valeur corrompue par un joker
                                }
                                iIndex = iIndex + 1;
                            });

                            aItems = aItems.filter(val => val !== sIgnore);         // Suppression du "joker"
                            aExistant = aExistant.filter(val => val !== sIgnore);   // Suppression du "joker"

                            /*
                            console.log('--------- Ini -------------');
                            console.log(tab['column']);
                            console.log('--------- Purgé -----------');
                            console.log(aItems);
                            console.log('--------- Réel -----------');
                            console.log(aExistant);
                            /**/

                            expect(aExistant).toStrictEqual(aItems);

                            resolve();
                            
                        });

                    }

                }

            } else {
                reject('Ooops: first argument is expected to be an Object');
            }

        })

    }
     

    /**
     * 
     * @desc vérifie le contenu des boutons de type Toogle
     * 
     * @param {object} tab 
     * 
     * Object->element  : Element sous la forme element.all(by.x())
     * Object->desc     : Description de la dataGrid
     * Object->column   : Les données contenues dans le header de la dataGrid
     * 
     */    
    public async toggleContent(tab:object): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            if(typeof tab === 'object') {
                
                var dataGrid    = tab['element'];      // Sous forme "d'element"
                var description = tab['desc'];            
                var aItems      = tab['column'];      

                if (this.bCheckTrad) {

                    test.step('Trad', async() => {
                        var aTextes = await dataGrid.allTextContents()
                        this.checkTraductions(aTextes.toString());
                        //console.log('H>>>>>>>>>>>>>>>' + aTextes.toString());
                    })
                    

                } else {

                    test.step( description + ' - ' + aItems.length + ' Items Checked', async () => {      
                        const aExistant = await dataGrid.allTextContents();
                        var iIndex = 0;
                        aExistant.forEach( (sData: string) => {
                            aExistant[iIndex] = sData.trim();	// Suppression des espaces
                            iIndex = iIndex + 1;
                        });
                        expect(aExistant).toStrictEqual(aItems);
                    });

                }

                resolve();

            } else {
                reject('Ooops : first argument is expected to be an array');
            }

        })

    } 


    /**
     * @desc Fonction générique cliquant sur un Toggle Button (Random possible)
     *    
     * @param {string}  selector - Elément à tester
     * @param {any}     expected - Etat attendu (true / false / [0..1] = random)
     * @param {boolean} check - Vérification du résultat
     */
    public async clickToggleButton (selector:Locator, expected:any = true, check:any = false) {

        var statut = 'Click';
        var action = 'Ignore';

        if (expected === false) {
            statut = 'Unclick';
        } else if (expected > 0 && expected < 1 ) {
            statut = 'Random(' + expected + ') - ';
            if (this.random() < expected){
                action = 'Click';
            }
            statut = statut + action;
        } else if (expected === true ) {
            action = 'Click';
        }

        test.step('Toggle Button [' + '] - ' + statut, async() => {
            if (action != 'Ignore') {

                //-- On clique sur lélément
                this.clickElement(selector.locator('span.p-inputswitch-slider'));

                //-- On vérifie si cela est effectif ?
                if (check === true) {       // JCC : ToDo - Pb aléatoire sur ce point. A revoir !
                    if (expected) {
                        await expect(selector.locator('div.p-inputswitch-checked')).toBeVisible();
                    } else {
                        await expect(selector.locator('div.p-inputswitch-checked')).not.toBeVisible();    
                    }
                }

            }
        })

    }


    /**
     * 
     * @param page La page
     * @param timeout Temps maxi avant abandon de l'attente
     * @param debugg Affichage des infos de debuggage
     * 
     * @description Attend que la page soit intégralement chargée en se basant sur l'évolution de sa taille
     */
    public async waitTillHTMLRendered(page:Page, timeout:number = 30000, debugg:boolean = this.isVerbose()) {

        const checkDurationMsecs    = 1000;
        var maxChecks               = timeout / checkDurationMsecs;
        let lastHTMLSize            = 0;
        let checkCounts             = 0;
        let countStableSizeIterations = 0;
        const minStableSizeIterations = 3;
        const startTime             = new Date().getTime();
        const iInstance             = this.getNumAppel();

        
        if(timeout > 30000){
            maxChecks = timeout / checkDurationMsecs;
        }
        
        if (debugg === true || this.isVerbose()) {
            //this.sepatateur();
            console.log("[",iInstance ,"] - Max Check :", maxChecks);
        }

        while(checkCounts++ <= maxChecks){
            let html = await page.content();
            let currentHTMLSize = html.length; 
            let bodyHTMLSize:number = 0

            try{
                bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
            }catch(error) {
                console.log('Ooops : Page probably already closed...');                
            }
            

            if (debugg === true || this.isVerbose()) {
                var currentTime = new Date().getTime();
                var dif = (currentTime - startTime) / 1000;
                console.log('[',iInstance,'] - Last: ', lastHTMLSize, ' <> Current: ', currentHTMLSize, " body html size: ", bodyHTMLSize, " Duration: ", dif);
            }

            if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) {
                countStableSizeIterations++;
            } else {
                countStableSizeIterations = 0; //reset the counter
                checkCounts = 0;
            }

            if(countStableSizeIterations >= minStableSizeIterations) {
                if (debugg === true || this.isVerbose()) {
                    console.log("[",iInstance,"] - Page rendered fully...");
                }
                break;
            }

            lastHTMLSize = currentHTMLSize;
            await page.waitForTimeout(checkDurationMsecs);
        }  

        if (debugg === true || this.isVerbose()) {
            this.sepatateur();
        } 

    };


    /**
     * 
     * @param selector Le sélecteur sur lequel on doit cliquer
     * @param page La page
     * @param timeout Temps maxi avant abandon de l'attente
     * @param debugg Affichage des infos de debuggage
     * 
     * @description Click sur un sélecteur est attends que l apage soit complètement chargée
     */
    public async clickAndWait(selector:Locator, page:Page, timeout: number = 30000, debugg: boolean = this.isVerbose()) {
        await this.clickElement(selector);
        await this.waitTillHTMLRendered(page, timeout, debugg);
    }

    
    /**
     * 
     * @desc vérifie le contenu d'une colonne d'un tableau
     * 
     * @param {object} tab 
     * 
     * Object->element  : Element sous la forme element.all(by.x())
     * Object->desc     : Description de l'item checké
     * Object->column   : Tableau contenant les données
     * Object->verbose  : Choix entre l'affichageou le contrôle des données
     * 
     */
    public async elementInList(tab:TypeListOfElements): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            if(typeof tab === 'object') {

                var dataGrid    = tab['element'];                           // Sous forme "d'element"
                var description = tab['desc'];            
                var aItems      = tab['column'];      
                var helperMode  = tab['verbose'];          

                if (helperMode) {                                           // Affiche les données présentes
                    test.step('*** HEADER HELPER MODE ***', async() => {
                        try {
                            const nbElements = await dataGrid.count();
                            console.log(`------------------ ${description} + ' = ' + ${nbElements} -------------------------`);
                            for (let x = 0; x < nbElements; x++) {
                            const header = await dataGrid.nth(x).textContent(); // Utilisation de nth pour obtenir un élément spécifique
                            console.log(`'${header.replace(/'/g, "\\'")}',`);
                            }
                        } 
                        catch(error) {
                            throw new Error('Ooops : Something went wrong...');
                        }           
                    });
                } 
                else {
                    
                    test.step('Area #' + description.toUpperCase() + ' check '+aItems.length.toString()+' Items', async() => { 
                        expect(await dataGrid.allTextContents()).toStrictEqual(aItems);
                    });
                    
                }

                resolve();
            } 
            else {
                reject('JS : first argument is expected to be an array');
            }        
        })
    }


    /**
     * @description Vérifie qu'un liste déroulante est bien présente, contient des valeurs et vérifie qu'elles sont triées (option)
     * @param selector 
     * @param ignoreOrder 
     */
    public async checkListBox(selector:Locator, ignoreOrder:boolean = true) {

        if (typeof selector === 'object') {

            const iNbChoix = await selector.getByRole('option').count();

            //-- Visible ?
            this.isDisplayed(selector);

            //-- Empty ?                       
            expect(iNbChoix).toBeGreaterThan(0);

            //-- 1 seul élément vide et égal à '?' ou ''
            selector.getByRole('option').count().then(function(iNbChoix){
                if ( iNbChoix == 1 ) {
                    expect(selector.getByRole('option').first().textContent()).not.toBe('?');
                    expect(selector.getByRole('option').first().textContent()).not.toBe('');
                }
            })

            //-- Sorted ?
            if (ignoreOrder === false) {

                var unSorted = await selector.getByRole('option').allTextContents();
                    
                if ( unSorted.length > 3) {                             // La liste contient elle assez d'éléments pour être filtrée ?

                    var sorted = unSorted.slice();
                    
                    sorted = sorted.sort(function (a, b) {
                        return a.localeCompare(b);
                    });                                                 //sort the array

                    expect(unSorted).toEqual(sorted);                   //check if both sorted and unsorted arrays are same

                }

            }

        } else {
            throw new Error('Ooops : First argument is expected to be an Object')
        }  
    }


    /**
     * 
     * @param selector Sélecteur lié à la liste déroulante
     * @param label La valeur cible à sélectionner
     * @param page 
     */
    public async listBoxByLabel(selector:Locator, label:string, page:Page) {
        await selector.selectOption({label: label });
        await this.waitTillHTMLRendered(page, 30000, false);
    }


    /**
     * @description Vérifie la présence ou l'absence d'une erreur à l'écran
     * @param attendu 
     * @param page 
     * @param verbose
     */
    public async isErrorDisplayed(attendu:boolean, page:Page, verbose:boolean = this.isVerbose()) {

        // Sélecteurs employés pour afficher les messages d'erreur
        const selectors = [
            { 
                name    : 'feedback', 
                selector: '.feedback-error:NOT(.ng-hide)' 
            },
            { 
                name    : 'alerte', 
                selector: 'div.alert:NOT(.alert-info)' 
            },
        ];
       
        // Compteur de messages d'erreur à ignorer
        var iNbMessIgnore:number = 0;

        // Compteur de messages d'erreur affichés
        var iNbErreurs  = 0;

        var aMessagesErreur = {};

        for (const { selector, name } of selectors) {

            const elements = await page.$$(selector);

            if (elements.length > 0) {
                
                if (verbose) {
                    console.log(`Nombre d'éléments trouvés pour le sélecteur de type "${name}" : ${elements.length}`);
                }

                for (let i = 0; i < elements.length; i++) {

                    const element   = elements[i];                        
                    var sMessage    = await element.innerText();
                    sMessage        = sMessage.toString().replace(/(\r\n|\n|\r)/gm,"");
                    const isVisible = await element.isVisible();
                    const styleColor = await element.evaluate((bgColor) => {
                        return window.getComputedStyle(bgColor).backgroundColor;
                    });

                    if (verbose) {
                        console.log(``);
                        console.log(`Élément #${i + 1}:`);
                        console.log(`  - Valeur: ${sMessage}`);
                        console.log(`  - Est visible: ${isVisible}`);
                    }

                    if (isVisible) {
                        iNbErreurs++;
                        aMessagesErreur[iNbErreurs] = sMessage;
                        if(styleColor != 'rgb(242, 222, 222)') { // Le style n'est pas à ignorer;
                            iNbMessIgnore++;
                        }
                    }

                }

            } else {

                if (verbose) {
                    console.log(`Aucun élément trouvé pour le sélecteur de type "${name}"`);
                }

            }               

        }

        if (attendu && iNbErreurs === 0) {
            throw new Error(`Un message d'erreur était attendu. Celui-ci N'est PAS visible !`);         // Ce n'est PAS bon !
        }

        if (attendu === false && iNbErreurs > 0) {
            for (let i = 1; i <= iNbErreurs; i++) {
                console.log('Erreur #',i,' : ' + aMessagesErreur[i]);
                console.log('Nombre de message à ignorer : ' + iNbMessIgnore);
            }

            if(iNbMessIgnore === 0) { // Le test ne doit pas échouer pour ces type de messages d'alerte ayant ce style;
                throw new Error(`Message(s) d'erreur innattendu(s).`);         // Ce n'est PAS bon !
            }
        }            
        
    }


    /**
     * 
     * @param page 
     * @param description Le nom de la popin
     * @param popinVisible Sa visibilité attendue
     * @param delai Délai avant de vérifier son état
     */
    public async popinVisible(page: Page, description: string, popinVisible:boolean = true, delai:number = 3000) {

        // Si la popin s'ouvre, il y a des chances pour qu'il y ait également un délai suite au chatgement des données. 
        // Moins probable à la fermeture...
        if (popinVisible) {
            if (this.isVerbose()) {
                console.log('');
                this.cartouche("-- Popin Start : ", description.toUpperCase());
            }
            await this.waitTillHTMLRendered(page, delai, this.isVerbose());
        } else {
            await page.waitForTimeout(250);     // pour l'animation de fermeture de la popin
        }

        var sVisibility = ' Is Visible';
        if (!popinVisible){
            sVisibility = ' Is Hidden';
            //-- Dans le cas de la dispoarition de la popin, un effet de disparition (css) peut être présent. On met une petite temporisation dans ce cas.
            page.waitForTimeout(250);
        }

        await test.step('Popin [' + description.toUpperCase() + '] - ' + sVisibility, async () => {

            // Liste des sélecteurs potentiellement utilisés 
            const aSelectorsToCheck = [
                '.modal-backdrop', 
                '.ui-widget-overlay', 
                'div.p-dialog-header',
                'p-dialog'
            ];

            let bIsSelecteurVisible = false;

            // Loop through the selectors and check if at least one is visible
            for (const selector of aSelectorsToCheck) {

                const element = await page.$(selector);
                if (element) {
                    const isElementVisible = await element.isVisible();
                    if (isElementVisible) {
                        bIsSelecteurVisible = true;
                        break; // If one element is visible, no need to check the rest
                    }
                }

            }

            if (popinVisible) {
                expect(bIsSelecteurVisible).toBeTruthy();
            } else {
                expect(bIsSelecteurVisible).toBeFalsy();
                if (this.isVerbose()) {
                    this.cartouche("-- Popin End : ", description.toUpperCase());
                    console.log('');
                }
            }

        });

    }


    /**
     * 
     * @param selector Le sélecteur contenant la liste d"éléments
     * @param nbElements Le nombre d'éléments minimal
     */
    public async nbElementsGreaterThan(selector:Locator, nbElements:number){
        if (typeof selector === 'object') {             
            if (typeof nbElements === 'number') {
                expect(await selector.count()).toBeGreaterThan(nbElements); // await selector.count() à ajouter
            } else {
                throw new Error('Ooops : Second argument is expected to be an Integer')
            }
        } else {
            throw new Error('Ooops : First argument is expected to be an Object')
        }    
    }


    /**
     * @description Saisi la chaîne de caractères {inputValue} en attendant {typingDelai} entre chaques lettres puis attent {waitBefore} ms avant de sélectionner le {choicePosition} choix dans la liste des choix proposés.
     * @param oData {AutoComplete} 
     * @returns La valeur effectivement sélectionnée
     * 
     * var oData:AutoComplete = {
     *  libelle         :'ARTICLE',
     *  inputLocator    : pageVArticle.inputArticle,
     *  inputValue      : sCodeArticle,
     *  choiceSelector  :'li.gfit-autocomplete-result',
     *  choicePosition  : 0,
     *  typingDelay     : 100,
     *  waitBefore      : 500,
     *  page            : page,
     * };
     * await fonction.autoComplete(oData);
     *  
     */
    public async autoComplete(oData:AutoComplete):Promise<string> {

        if (typeof oData === 'object') {

            const sLibelle      = oData.libelle || '';
            const lInput        = oData.inputLocator;       // Sous forme de page.Locator
            const sValue        = oData.inputValue;         // Desciption pour afficher en mode debug (optionnel)
            const bClear        = oData.clear || false;     // MAJ champ input avant saisie (optionnel)
            const selectorChoice= oData.choiceSelector || 'li.gfit-autocomplete-result';
            var iPosition       = oData.choicePosition || 0;
            const bRandomChoice = oData.selectRandom || false;
            const bVerbose      = oData.verbose || this.isVerbose();
            const iDelay        = oData.typingDelay || 100;
            const iWaitFor      = oData.waitBefore || 500;
            const page          = oData.page;

            var sRandomInfo:string  = '';
        
            // On efface les anciens caractères potentiellement présents dans le champ input
            if (bClear) {
                await lInput.clear();
            }

            //console.log('>>>>>>>>>>' + sValue);
            // On saisi la chaîne de carctère lettre par lettre
            await lInput.pressSequentially(sValue, {delay:iDelay});

            // temporisation le temps de charge la liste (sans avoir recours à la consultation du DOM) 
            await page.waitForTimeout(iWaitFor);

            const options = page.locator(selectorChoice);

            // Calcul du nombre de choix affichés
            const iNbChoix = await options.count();

            // Si on souhaite sélectionner un choix proposé au hasard
            if (bRandomChoice) {
                iPosition = Math.floor(this.random() * iNbChoix);
                sRandomInfo = ' aléatoire ';
            }

            // Selon le type de balise Input, la valeur sélectionnée peut être enregistrée dans l'attribut "text"
            var sTexteSelectionne = await options.nth(iPosition).textContent();
            // ou "value"...
            if (sTexteSelectionne ==='') {
                sTexteSelectionne = await options.nth(iPosition).inputValue();
            }

            if (bVerbose) {
                this.cartouche('-- AUTO COMPLETE : ', sLibelle, true);
                if (iNbChoix === 0){
                    if(bVerbose){
                        console.log('Aucun choix proposé avec la valeur : ' + sValue);
                    }
                    this.log.set(sLibelle + ' : Aucun choix proposé avec la valeur : ' + sValue);
                } else {
                    
                    if(bVerbose){
                        console.log('Sélection ' + sRandomInfo + 'du choix #' + (iPosition + 1) + '/' + iNbChoix + ' = "' + sTexteSelectionne +'"');
                    }
                    this.log.set(sLibelle + ' : Sélection ' + sRandomInfo + 'du choix #' + (iPosition + 1) + '/' + iNbChoix + ' = "' + sTexteSelectionne +'"');
                }
            }
   
            // Validation du choix
            await this.clickElement(options.nth(iPosition));

            if (sLibelle !== '') {
                this.log.set(sLibelle + ' : ' + sTexteSelectionne);
            }

            // On retourne le choix effectif du champ autocomplété
            return sTexteSelectionne;

        } else {
            throw new Error('Ooops: first argument is expected to be an Object of AutoComplete');
        }

    }


    /**
     * 
     * @desc envoie une chaîne de carctères à un champ Input et vérifie si la valeur est intégrée
     * 
     * @param {object} selector     : Le champ cible de type 'input'
     * @param {string|number} value : La chaîne de carcatères envoyée
     * @param {boolean} bCheck      : LE contenu doit il être vérifié aprés saisie ?
     */
    public async sendKeys(selector: Locator, value: string|number, bCheck: boolean = true) {
        await selector.clear();
        await selector.fill(value.toString());

        if (bCheck) {
            await expect(selector).toHaveValue(value.toString());
        }
    }


    /**
     * 
     * @param page 
     * @returns 
     */
    public connexionErrorMessage(page:Page){
        return page.locator('[ng-show="erreur"]');
    }
    
    
    /**
     * @description Modifier le flag verboseMode qui permet de déterminer si il faut afficher les informations de débuggage
     * @param {boolean} debugMod 
     */
    public verbose(debugMod: boolean) {
        this.verboseMode = debugMod;
    }
    

    /**
     * @description Méthode appelée systématiquement à la fin de chaque test pour examiner les logs serveur.
     */
    public async close() {
        
        if (this.bCheckTrad && this.aErrorTrad.length > 0) {
            this.log.set('-- Erreurs Traduction --------------------------------------------------------');
            this.aErrorTrad.forEach((sTraduction:string) => {
                this.log.set('[TRAD] : ' + sTraduction);
            })
        }

        if(this.log != undefined){
            await this.log.get();
        }

        console.log('-- Logs Serveur -------------------------------------------------------------')
        if (['integration', 'integration2'].includes(this.environnement)) {

            const elk = new ElkFunctions();

            const index = this.environnement === 'integration' ? 'int-sigale*' : 'int2-sigale*';
            const startDate = this.formatDateToISO(this.dStartTime);
            const endDate   = this.formatDateToISO(new Date());
           
            let allExceptions: { type: string, result: any }[] = [];

            //Check for code exception errors
            for (const { value, type } of ElkFunctions.codeExceptions) {
                const result = await elk.searchCodeExceptions(index, this.appliFullName.toLowerCase(), startDate, endDate, value);
                if (result) {
                    allExceptions.push({ type, result });
                }
            }

            //Check for other exceptions
            for (const { value, type } of ElkFunctions.otherExceptions) {
                const result = await elk.searchOtherExceptions(index, this.appliFullName.toLowerCase(), startDate, endDate, value);
                if (result) {
                    allExceptions.push({ type, result });
                }
            }
            
            //Display results
            if (allExceptions.length > 0) {
                allExceptions.forEach(({ type, result }) => {
                    if (result.length > 0) {
                        console.log(`Found ${result.length} error${result.length === 1 ? '' : 's'} of type: ${type}`);
                        let messageCounter = 1;
                        result.forEach((hit: any) => {
                            if (hit._source.message) {
                                const message = hit._source.message;
                                const maxCharacters = 1000;
                                const limitedMessage = message.length > maxCharacters ? message.slice(0, maxCharacters) + "..." : message; //displaying only the first 1000 characters
                                if (messageCounter > 1) {
                                    console.log(`| Error Message #${messageCounter}: `, limitedMessage);
                                } else {
                                    console.log("| Error Message: ", limitedMessage);
                                }
                            } else {
                                console.log(`| Error Message #${messageCounter}: No message Exception Found`);
                            }
                            messageCounter++;
                        });
                        console.log();
                    }
                });
                throw new Error("| Unexpected Server Errors");
            } else {
                console.log("| No Error");
            }
        } else {
            console.log("| Environment " + this.environnement + " Ignored!");
        }
        console.log("-".repeat(80));
             
    }


    /**
     * @description Permet de savoir dans quel mode (verbose) on se trouve.
     * @returns {boolean}
     */
    public isVerbose():boolean {
        return this.verboseMode;
    }


    /**
     * @description Vérifie si une donnée ne contient pas des "warnings" à destination des utilisateurs (Ex : "Ne pas utiliser")
     * @param sData La chaîne à analyser
     * @returns true / false
     */
    public isProhibitedData(sData:string):boolean {
        return sData.includes("Ne pas utiliser");
    }


    /**
     * @description Mets en forme les données avant leur affichage à l'écran
     * @param sClef 
     * @param sValeur 
     * @param bUppercase 
     */
    public cartouche(sClef:string, sValeur:string, bUppercase:boolean = true) {
        if (bUppercase) {
            sValeur = sValeur.toUpperCase();
        }
        console.log(sClef, sValeur, "-".repeat(this.iLengthDeco - sClef.length - sValeur.length - 2));
    }


    /**
     * @description Affiche un saut de ligne
     */
    private sepatateur():void {
        console.log("-".repeat(this.iLengthDeco));
    }


    /**
     * @description Compteur d'appel de la méthode waitTilHtmlRendered()
     * @returns {number}
     */
    private getNumAppel():number {
        return this.iNumAppel++;
    }


    /**
     * @description Permet d'attendre {duration} millseconde avant de continuer le traitement
     * @param page 
     * @param duration Durée en millisecondes
     * @param verbose 
     */
    public async wait(page:Page, duration:number, verbose:boolean = this.isVerbose()) {
        if (verbose){
            this.cartouche('-- /!\\ WAITING: ', duration.toString() + ' ms /!\\', false)
        }
        await page.waitForTimeout(duration);
    }


    /**
     * 
     * @returns string
     * @description Retourne la date du jour mise en forme
     */
    public getDLC() {
        const today         = new Date();
        let dateMiseEnForme : any;
        let annee:any       = today.getFullYear() + 1 ;
            annee           = annee.toString();
            dateMiseEnForme = this.addZero(today.getDate()).toString() + this.addZero(today.getMonth() + 1).toString() +  annee.substring(2);
           
        return dateMiseEnForme;
    }


    /**
     * 
     * @returns string
     * @description Retourne l'heure actuelle mise en forme.
     */
    public getHeure():string {
        const today = new Date();
        return this.addZero(today.getHours()) + ':'+ this.addZero(today.getMinutes());
    }


    /**
     * 
     * @returns string
     * @description Retourne la date du jour mise en forme
     * @param sFormat (FR / US) => (ddmmYYYY / YYYYmmdd)
     * @param iDelai Nombre de jours de décalage à prendre en compte par rapport à la date du jour (calcul de la date dans le passé ou le futur de n jours).
     * @param sSeparateur Le séparateur de date (Ex : / ou - => YYYY-mm-dd)
     */
    public getToday(sFormat:string = 'FR', iDelai:number=0, sSeparateur:string=""): string {
        const today:Date = new Date();
        var day:Date = today;

        if (iDelai !== 0) {
            day = new Date();
            day.setDate(day.getDate() + iDelai);
        }

        if (sFormat === 'FR' ){
            //-- 18032024
            return  this.addZero(day.getDate()) + sSeparateur + this.addZero(day.getMonth()+1) + sSeparateur + day.getFullYear();
        } else if (sFormat === 'fr' ) {
            //-- 240318
            return  day.getFullYear().toString().slice(-2)+ sSeparateur + this.addZero(day.getMonth()+1)+ sSeparateur + this.addZero(day.getDate());
        } else if (sFormat === 'US' ) {
            //-- 20240318
            return  day.getFullYear()+ sSeparateur + this.addZero(day.getMonth()+1)+ sSeparateur + this.addZero(day.getDate());
        } else if (sFormat === 'us' ) {     
            //-- 240318
            return  day.getFullYear().toString().slice(-2)+ sSeparateur + this.addZero(day.getMonth() + 1)+ sSeparateur + this.addZero(day.getDate());
        }
    }


    /**
     * 
     * @param {string} sSeparateur Exemple ":" => 12:12:12 
     * @returns 
     * @description retourne la chaine concaténée Heure / Minute  / Seconde avec le séparateur de son choix passé en argument
     */
    public getHMS(sSeparateur:string = ''): string {
        const today = new Date();
        return this.addZero(today.getHours()) + sSeparateur + this.addZero(today.getMinutes()) + sSeparateur + today.getSeconds();
    }


     /**
     * 
     * @param {date}
     * @returns 
     * @description retourne la date sous la norme ISO (Exemple :  2024-05-28T11:27:59.353+02:00)
     */
    public formatDateToISO(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        const milliseconds = ('00' + date.getMilliseconds()).slice(-3);


        const offset = -date.getTimezoneOffset();
        const offsetSign = offset >= 0 ? '+' : '-';

        const offsetHours = ('0' + Math.abs(offset / 60)).slice(-2);
        const offsetMinutes = '00'
        
        const isoDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
    
        return isoDate;
    }


    /**
     * 
     * @param {integer} valeur 
     * @desc 1 -> 01 ; 12 -> 12
     * 
     */
    private addzero(valeur:any) {
        if (parseInt(valeur) < 10) {
            return '0' + valeur;
        } else{
            return valeur;
        }
    } 


    /**
     * 
     * @param valeur Entier devant potentiellement être préfixé par un "0"
     * @returns Entier sur 2 digits
     */
    public addZero(valeur: any) {
        return this.addzero(valeur);
    }
    
    
    /**
     * 
     * @returns string
     * @description Retourne des caractère posant généralement des problèmes lors de leur affichage ou des transferts de flux
     */
    public getBadChars(): string {
        return ' <--/!\\ #1 % \';';
    }

    
    /**
     * @desc Si le paramètre 'E2E' est passé en argument, le JDD du même nom est chargé. les données présentes écrasent toutes les autres données déclarées par ailleurs 
     */
    public importJdd (): void {
        
        if (process.env.E2E !== undefined && process.env.E2E != '') {

            var sFileJdd    = path.join(__dirname + '/../_data/E2E/' + process.env.E2E + '.jdd.ts');

            try {
                // Chargement JDD
                
                var DataFile    = require(sFileJdd);
                
                var LocalJdd    = new DataFile(this);
                oJdd            = LocalJdd.getData();
                
                // Récupération des données externes stockées en base si elles existent
                
                try {
                    // Le nom du fichiers de données sauvegardées deouis la base correspond au nom du paramaètre E2E stocké dans le répertoire dédié
                    var sFileName = __dirname + '/../_data/E2E/json/' + this.getPrefixeEnvironnement() + '_' + process.env.E2E + '.json';
                    var oJddJson = require(sFileName);

                    if (this.isVerbose()) {
                        console.log('E2E : ' + sFileName);
                    }

                    oJddJson.forEach(oData => {
                        if (oJdd[oData.CHAMP_nom] !== undefined){
                            if (typeof oJdd[oData.CHAMP_nom] === 'object'){
                                oJdd[oData.CHAMP_nom] = [oData.CHAMP_data];
                            } else if (typeof oJdd[oData.CHAMP_nom] === 'number'){
                                oJdd[oData.CHAMP_nom] = Number(oData.CHAMP_data);
                            } else {
                                oJdd[oData.CHAMP_nom] = oData.CHAMP_data;
                            }
                            
                            if (this.isVerbose()) {
                                console.log('Donnée Externe Importée :  ' + oData.CHAMP_nom + ' = ' + oData.CHAMP_data);
                            }                            
                        }
                    })
                } catch (ex) {
                   console.log('Donnée Externe Importée : - Aucune -');
                }

                //Chargement des données temporaire si elles existent
                try {
                    var oData2 = require(pathTmp + oJdd['tmpFilename']);
                    console.log("Import Tmp Data File  : " + pathTmp + oJdd['tmpFilename']);
                    return oData2;
                } catch(error) {
                    //throw new Error('Ooops : Impossible de charger le JDD "' + sFileJdd + '"');
                } 
                
            } catch(error) {
                throw new Error('Ooops : Impossible de charger le JDD "' + sFileJdd + '"');
            } 
            
        }
    }

    /**
     * @desc vérifie si un le contenu d'un nouvel onglet ouvert NE contient PAS de code HTML
     * @param {object}  selector - Bouton qui déclenche l'action    
     */
    public async noHtmlInNewTab(page:Page, selector:Locator) {

        // Handle the new tab
        const [newPage] = await Promise.all([
            page.waitForEvent('popup'),
            page.waitForLoadState('domcontentloaded'),
            this.clickElement(selector),
            this.waitTillHTMLRendered(page)
        ]);

        // Verify absence of <pre> element in the new tab
        const preElement = await newPage.$('pre');
        expect(preElement).toBeFalsy();

        // Close the new tab and switch back to the original page
        await newPage.close();
        await page.bringToFront();
    }
    

    /**
     * 
     * @description Sauvegarde les données transmises afin de pour être réutilisé par ailleurs
     * @param {object} oData  Données à sauvegarder sous forme de json
     */
    public async writeData(oData:object) {
        test('** Save Data **', () => {
            if (oJdd['tmpFilename'] !== undefined) {                    // Si le nom du fichier de données temporaire est connu, c'est que l'on est dans le cadre d'un E2E
                if(typeof oData === 'object') {
                    fs.writeFile(pathTmp + oJdd['tmpFilename'], JSON.stringify(oData, null, 3), function(err) {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            console.log(separateur);
                            console.log("File Writed  : " + pathTmp + oJdd['tmpFilename']);
                        }
                    }); 
                } else {
                    throw new Error('Ooops : Les données à enregistrer ne sont pas au bon format (Object attendu)');
                }
            } else {
                console.log('Ooops : oJdd[\'tmpFilename\'] n\'est pas défini. Contexte hors E2E probablement.');
            }
        });
    }


    /**
     * 
     * @param testinfo 
     * @deprecated
     */
    public setTartTime(testinfo:TestInfo) {
        this.dStartTime = new Date(testinfo["_startWallTime"]);
    }


    /**
     * 
     * @returns Date de démarrage du test au format TimeStamp
     */
    public getStartTime(): number {
        return this.dStartTime.getTime();
    }


    /**
     * @desc Fonction générique sélectionnant un élément aléatoire d'une liste déroulante dont les éléments sont dans des balises <li>
     *      
     * @param {string}  selector - Elément à tester
     * @param {boolean} ignoreFirstLine - Le premier élément de la liste doit il être ignoré ?
     */
    public async selectRandomListBoxLi(selector: Locator, ignoreFirstLine:boolean = true, page: Page, selectorChoice:string = 'li.p-dropdown-item:NOT(.ng-star-inserted)') {

        var isActive = await selector.isEnabled();

        if(isActive){
            await this.clickElement(selector);
            var isClickable  = await page.locator(selectorChoice).first().isEnabled();
            if(isClickable){
                var iNbChoix = await page.locator(selectorChoice).count();
                var iCible   = 0; // Par défaut, pas de choix, on sélectionne le seul élément affiché

                if (iNbChoix > 1) {
                    if (ignoreFirstLine) {
                        iCible = Math.abs(Math.floor(this.random() * (iNbChoix - 2) ) + 1);
                    } else {
                        iCible = Math.floor(this.random() * iNbChoix );                    
                    }
                }

                await this.clickElement(page.locator(selectorChoice).nth(iCible));
            }
        } 
    };


    /**
     * 
     * @desc Fonction générique sélectionnant un élément aléatoire d'une liste déroulante
     * @param {TypeListBox} oData 
     * @returns {string} Le choix sélectionné si et seulement si le libelle est défini. Sinon affiche directement le choix dans les logs.
     * 
     *  const oData:TypeListBox = {
     *      sLibelle        : 'Acheteur',
     *      sInput          : pageFrais.pPcreachaListBoxAcheteur,
     *      sSelectorChoice : 'p-dropdownitem',
     *      bVerbose        : false,
     *      bIgnoreFirstline: false,
     *      iWaitFor        : 0,
     *      page            : page
     *  }
     *  await fonction.selectRandomListBox(oData);
     * 
     */
    public async selectRandomListBox(oData:TypeListBox):Promise<string> {
        
        if (typeof oData === 'object') {

            const sLibelle:string           = oData.sLibelle || '';
            const sInput:Locator            = oData.sInput;         // Sous forme de page.Locator
            const selectorChoice:string     = oData.sSelectorChoice || 'li.gfit-autocomplete-result';
            const bVerbose:boolean          = oData.bVerbose || this.isVerbose();
            const bIgnoreFirstline:boolean  = oData.bIgnoreFirstline || true;
            const iWaitFor:number           = oData.iWaitFor || 500;
            const page:Page                 = oData.page;

            //-- La liste déroulante est elle opérationnelle ?
            const bIsActive:boolean = await sInput.isEnabled();

            if(bIsActive){

                //-- On clique sur la liste déroulante afin de la déplier
                await this.clickElement(sInput);

                //-- Une animation css peut être liée au déroulement de la liste. On attend donc que les choix de la liste apparaissent
                if (iWaitFor > 0) {
                    await page.waitForTimeout(iWaitFor);
                }

                //-- Ons'assure que le premier élément de la liste est là
                const bIsEnabled:boolean  = await sInput.locator(selectorChoice).first().isEnabled();

                if(bIsEnabled){

                    //-- On détermine le nombre de choix disponibles
                    const iNbChoix = await sInput.locator(selectorChoice).count();

                    //-- Par défaut, pas de choix, on sélectionne le seul / premier élément affiché
                    var iRnd:number   = 0; 

                    if (iNbChoix > 1) {
                        if (bIgnoreFirstline) {
                            iRnd = Math.abs(Math.floor(this.random() * (iNbChoix - 2) ) + 1);
                        } else {
                            iRnd = Math.floor(this.random() * iNbChoix );                    
                        }
                    }

                    //-- On sélectionne le choix
                    await this.clickElement(sInput.locator(selectorChoice).nth(iRnd));

                    //-- On affiche les détails dtechniques si besoin pour débuggage
                    if (bVerbose) {
                        this.log.set('Liste Déroulante "' + sLibelle + '" - Sélection du choix ' + iRnd + '/' + iNbChoix);
                    }

                    const sChoixSelectionne:string = await sInput.locator(selectorChoice).nth(iRnd).textContent();

                    //-- On affiche le log
                    if (sLibelle !== '') {
                        this.log.set(sLibelle + ' :  '  + sChoixSelectionne);
                    }                    

                    return sChoixSelectionne;

                } else {
                    throw new Error('Ooops: Le premier choix de la Liste déroulante n\'est pas accessible');    
                }
            } else {
                throw new Error('Ooops: La Liste déroulante n\'est pas accessible');    
            }
        } else {
            throw new Error('Ooops: first argument is expected to be an Object');
        }

    };


    /**
     * 
     * @param selector Le locator de la liste déroulante
     * @param bIgnoreFirstline Doit on ignorer la première ligne si elle est vide ?
     * @returns retourne le choix sélectionné
     */
    public async selectRandomListBoxOption(selector:Locator, bIgnoreFirstline:boolean = true):Promise<string> {

        var isActive = await selector.isEnabled();

        if(isActive){

            const iNbChoix:number = await selector.locator('option').count();

            var iRnd:number = Math.floor(this.random() * iNbChoix );
            if (bIgnoreFirstline) {
                iRnd = Math.abs(Math.floor(this.random() * (iNbChoix - 2) ) + 1);                                    
            }

            const sLibelle:string = await selector.locator('option').nth(iRnd).textContent();

            await selector.selectOption({index:iRnd});

            this.log.set('Sélection du choix : "' + sLibelle + '" (' + iRnd + '/' + iNbChoix + ')');

            return sLibelle;

        } else{

            throw new Error('Ooops: La Liste déroulante n\'est pas accessible');

        }

    }

    /**
     * 
     * @desc : Sélectionnne un groupe article de la liste déroulante des groupes articles.
     * @param {string} labelCible - Nom du label cible (Exemple : 'Marée').
     * @param {Page} page
     * 
     */
    public async selectListBoxByLabel(selector:Locator, labelCible: string, page:Page) {      

        const bActive  = await selector.isEnabled();

        if (bActive) {
            await selector.selectOption({label: labelCible});
            await this.waitTillHTMLRendered(page, 30000, false);
        }else {
            throw new Error('Ooops: ListBox avec label ' +labelCible+ ' non sélectionnable');
        }
    }

    /**
     * @desc Fonction générique cliquant sur une case à cocher (Random possible)
     *  
     * @param {string}  selector - Elément à tester
     * @param {*}       expected - Etat attendu (true / false / [0..1] = random)
     * @param {boolean} check - Vérification du résultat
     */
    public async clickCheckBox(selector:Locator, expected:number = 0.5, etat:boolean = true, check:boolean = true) {
            var statut = 'Click';
            var action = 'Ignore';
            if (etat === false) {
                statut = 'Unclick';
            } else if (expected > 0 && expected < 1 ) {
                statut = 'Random(' + expected + ') - ';
                if (this.random() < expected){ 
                    action = 'Click';
                }
                statut = statut + action;
            } else if (etat === true ) {
                action = 'Click';
            }

            if (action != 'Ignore') {
                await this.clickElement(selector);
                if (check === true) {
                    if (expected) {
                        expect(selector.isChecked()).toBeTruthy();
                    } else {
                        expect(selector.isChecked()).toBeFalsy();    
                    }
                }
            }
    }

    
    /**
     * @desc Fonction générique cliquant sur une liste déroulante (Random possible)
     *     
     * @param {string}  selector - Elément à tester
     * @param {boolean} ignoreFirstLine - Vérification du résultat
     */
    public async ngClickRndListChoice(selector:Locator, ignoreFirstLine:boolean = false) {

        var iNbChoix = await selector.count();
        var iCible   = 0;                                                // Par défaut, pas de choix, on sélectionne le seul élément affiché

        if (iNbChoix > 1) {                
            if (ignoreFirstLine) {                                       // La première ligne doit être ignorée. L'élément 0 ne peut pas exister
                iCible = Math.abs(Math.floor(this.random() * (iNbChoix - 2) ) + 1);
            } else {
                iCible = Math.floor(this.random() * iNbChoix ) + 1;                    
            }
        }

        await this.clickElement(selector.nth(iCible));  

    };


    /**
     * @desc Fonction générique cliquant sur une liste déroulante nouvelle version d'Angular
     *    
     * @param {Locator} selector - Elément à tester
     * @param {string} cible - élément de la liste déroulante devant être sélectionnée
     * @param {Locator} selector2 - liste de choix (facultatif : si SELECTEUR et LISTE DE CHOIX  ne sont pas chainés)
     */
    public async ngClickListBox (selector: Locator, cible: string, selector2?: Locator) {

        var isActive       = await selector.isEnabled();
        if (isActive) {
            await this.clickElement(selector);

            let dropdownElements = selector.locator('p-dropdownitem li span')

            if (selector2) { //si le sélecteur et la liste de choix ne sont pas chainés
                dropdownElements = selector2;  // identifier la liste de choix
            }

            var isVisible  = await dropdownElements.first().isVisible();

            if(isVisible){
                await this.clickElement(dropdownElements.filter({hasText: cible}).first());
            } else {
                console.log('Ooops : Choix "'+cible+'" non trouvé dans la liste');
            }
        } 
    };


    /**
     * 
     * @desc Vérifie si un fichier vient d'être téléchargé, si il possède la bonne extesion et une taille minimale
     * 
     * @param {any} downloadProcess     : resultat obtenu après le téléchargement
     * @param {string} fileExtension    : Extension du fichier attendue
     * @param {number} fileSizeMin      : Taille minimale du fichier attendue
     * @param {boolean} verbose         : Affichage du mode "Verbose"
     */
    public async downloadedFile (downloadProcess:any, fileExtension: string, fileSizeMin: number = 1024, verbose:boolean = this.isVerbose()) {
        
        if(downloadProcess){

            const filePath = await downloadProcess.path();
            const fileName = downloadProcess.suggestedFilename(); // On va récuperer le résultat du process de téléchargemt du fichier
            if(verbose){

                console.log('Chemin :' + filePath);
                console.log('Fichier :' + fileName);
             }else{

                this.log.set('Chemin :' + filePath);
                this.log.set('Fichier:' + fileName);
            }

            var extension = fileName.split('.').pop(); // extension du fichier
            expect(extension).toBe(fileExtension);   // comparaison avec l'attendue

            var fileSizeInBytes = (await fs.promises.stat(filePath as string)).size;  
            expect(fileSizeInBytes).toBeGreaterThan(fileSizeMin) ;   // Taille du fichier correcte ?

            if(verbose){
                console.log('Taille du fichier téléchargé : ' + fileSizeInBytes + ' bytes');
            }else{
                this.log.set('Taille du fichier téléchargé : ' + fileSizeInBytes + ' bytes');
            }

            try {

                // Lecture du nouveau du nouveau fichier téléchargé depuis son repertoire parent
                var fileContent = await fs.promises.readFile(filePath, 'utf-8') 
                this.log.separateur()
                this.log.set('Contenu du fichier\n' + fileContent)  
            }
            catch(e){

                console.log(e);
            }

            downloadProcess.delete(); // Suppression du fichier
            this.log.set('Fichier supprimé à présent')

        }else{

            throw new Error('DownloadError: Aucun fichier téléchargé');
        }
    }


   /**
    * 
    * @param selector Le sélecteur sur lequel l'attente doit être réalisée
    * @description Permet d'esquiver une erreur en cas de selecteur non retrouvé et va retourner un boulean qui sera manipulable
    * @returns boolean
    */
    public async selectorToBeCharged(selector:Locator): Promise<Boolean>{ 
        try{

            await selector.waitFor({state:'visible'});
            return true;

        }catch (e) {

            this.log.set('Ooops : Le selecteur ' + selector + ' n\'est pas présent dans la page !')
            return false;
        }
    }                   


    /**
     * 
     * @returns {number} Nombre réel aléatoire compris entre 0 et 1
     */
    public random(): number {
        return crypto.getRandomValues(new Uint32Array(1))[0]/2**32;
    }


    /**
     * @description Examine le paramètre devant être intégré et détermine si sa valeur est celle : par défaut, celle définie dans le fichier de conf de l'appli ou celle transmis dans le JDD (cas d'un E2E)
     * @param paramTransmis Le nom de paramètre recherché
     * @param defaut valeur par défautr définie en dur dans le code du test
     * @returns la valeur choisie parmis les 3 cas de figure
     */
    public getInitParam (paramTransmis:string, defaut:any=null):any|null{

        if (paramTransmis === undefined) {                              // Si aucun argument et founit à la fonction
            throw new Error('Ooops : Paramètre Recherché Manquant');    // On ne va pas plus loin, le code est corrompu... 
        } else {                                                        // Un argument a été transmis

            var sReturn = null;                                         // La valeur qui sera retrournée par défaut
        
            if (process.env.paramTransmis === undefined && process.env[paramTransmis] === '') { // Si on NE COMMUNIQUE PAS le paramètre au navigateur
                if (defaut === null) {                                  // Si aucune valeur par défaut définie (en dur) 
                
                    if (this.oData[paramTransmis] === undefined) {      // une valeur par défaut existe t'elle dans le fichier de configuration local ?
                        throw new Error('Ooops : Paramètre par défaut [data.' + paramTransmis + '] manquant dans le fichier local (' + this.localConfigFile + ')');  
                    } else {
                        if (this.isVerbose()) {
                            console.log('Récupération via le fichier local  : ' + this.oData[paramTransmis]);   
                        }
                        sReturn = this.oData[paramTransmis];            // On retourne la valeur par défaut enregistrée dans le fichier de conf local                   
                    } 
                } else { 
                    if (this.isVerbose()) {
                        console.log('Récupération de la valeur transmise par défaut  : ' + defaut);   
                    }                                                   // valeur en dur attendue OU JDD                                          
                    sReturn = defaut;                                   // On retourne la valeur définie par défaut en dur dans le code
                }           
            } else {                                                    // Paramètre TRANSMIS directement via le navigateur
                if (this.isVerbose()) {
                    console.log('Récupération de la valeur transmise au Navigateur  : ' + process.env[paramTransmis]);   
                } 
                sReturn = process.env[paramTransmis];                   // On retourne la valeur effectivement transmise au navigateur
            }  
           
            // Le dernier mot pour les données contenues dans le JDD...
            if (process.env.E2E !== undefined && process.env.E2E != '') {  // JDD de référence communiqué
                if (oJdd[paramTransmis] !== undefined) {                // La valeur existe t'elle dans le JDD ?                 
                    sReturn =  oJdd[paramTransmis];                     // On retour la valeur contenur dans le JDD              
                }      
            } 

            if (this.isVerbose()) {
                console.log('Param Recherché : "' + paramTransmis +  '" | Valeur Defaut : "' + defaut + '" | Argument : "' + process.env[paramTransmis] +'" | Retourné : "' + sReturn + '"');   
            }

            return sReturn;                                             // On retourne la valeur effectivement sélectionnée
        }
    }


    /**
     * 
     * @param sParam Attribut de l'object json localConfig à retourner
     * @returns La valeur de l'attribut de l'objet désiré
     */
    public getLocalConfig(sParam:string = null):any|null {
        if (Object.keys(this.oData).length > 0) {
            if (sParam === null) {
                return this.oData;
            } else {
                if (this.oData[sParam] !== undefined) {
                    return this.oData[sParam];
                } else {
                    console.log('Paramètre Local "'+sParam+'" non trouvé dans le fichier de configuration ' + this.localConfigFile);   
                    return null;     
                }
            }
        } else {
            console.log('Pas de données locales trouvées');
            return null; 
        }
    }


    /**
     * 
     * @param sParam Attribut de l'object json GlobalConfig à retourner
     * @returns La valeur de l'attribut de l'objet désiré
     */
    public getGlobalConfig(sParam:string = null):any|null {
        if (Object.keys(this.oDataGlobal).length > 0) {
            if (sParam === null) {
                return this.oDataGlobal.data;
            } else {
                if (this.oDataGlobal.data[sParam] !== undefined) {
                    return this.oDataGlobal.data[sParam];
                } else {                
                    console.log('Paramètre Global "'+sParam+'" non trouvé dans le fichier de configuration ' + this.globalConfigFile);   
                    return null;     
                }
            }
        } else {
            console.log('Pas de données locales trouvées');
            return null; 
        }
    }


    /**
     * 
     * @param dir Répertoire cible
     * @param excludeDirs tableau contenant la liste des répertoires à ignorer
     * @param extension Extion des fichiers cible
     * @returns Tableau des fichiers trouvés
     */
    private fileList(dir:string, excludeDirs?:any, extension?:string): any {
        var self = this;
        return fs.readdirSync(dir).reduce(function (list, file) {

            const name = path.join(dir, file);
           
            if (fs.statSync(name).isDirectory()) {
                if (excludeDirs && excludeDirs.length) {
                    excludeDirs = excludeDirs.map(d => path.normalize(d));
                    const idx = name.indexOf(path.sep);
                    const directory = name.slice(0, idx === -1 ? name.length : idx);
                    if (excludeDirs.indexOf(directory) !== -1) {
                        return list;
                    }
                }

                return list.concat(self.fileList(name, excludeDirs, extension));
            }
            
            if (path.extname(name) == extension) {
                return list.concat([name]);
            }

        }, []);
    }


    /**
     * 
     * @param tab 
     * @returns 
     */
    public readDirectoryContent(tab:TypeSearchFile):any {

        if (typeof tab === 'object') {

            var aFiles = [];
            var files = fs.readdirSync(tab['sPath']);

            if (tab['bVerbose']) {
                this.log.set("\Répertoire : '" + tab['sPath'] + '\'');
                this.log.set("\Extension : '" + tab['sExtension'] + '\'');
            }
            
            if (tab['bRecursive']) {                                           // Affichage récursif des répertoires

                aFiles = this.fileList(tab['sPath'], tab['aExcludeDirs'], tab['sExtension']);

            } else {                                                    // Affichage NON récursif des répertoires


                if (tab['sExtension'] !== null) {                              // Limitation sur l'extension du fichier
    
                    files.forEach(file => { 
                        if (path.extname(file) == tab['sExtension']) {
                            aFiles.push(file);
                        }                
                    })

                    if (tab['bVerbose']) {
                        this.log.set("\Nombre de fichiers : " + aFiles.length + '/' + files.length);
                    }

                } else {                                                // On récupère tous les fichiers
                    aFiles = files;
                }

            }

            if (tab['bVerbose']) {
                this.log.separateur();
                aFiles.forEach(sFile => {
                    this.log.set("\Fichier : " + sFile);
                })
            }

            return aFiles;

        } else {
            throw new Error('Ooops : first argument is expected to be an Object')
        }

    }


    /**
     * 
     * @returns {string} L'URL du WS de l'ESB
     */
    public getUrlEsb(): string {
        return this.sUrlEsb;
    }


    /**
     * @description Sélectionne le premier choix d'une liste multichoix en se basant sur un texte cible
     * @param page 
     * @param sTexte Le texte cible
     */
    public async multiselect(page: Page, sTexte: string): Promise<void>{

        //-- On déplie la liste déroulante
        await this.clickElement(page.locator('p-multiselect'));

        //-- On saisi la chaîne d ecarcatères
        await page.locator('input.p-multiselect-filter').pressSequentially(sTexte);

        //-- On sélectionne le premier choix
        await this.clickElement(page.locator('p-multiselectitem div.p-checkbox-box').nth(0));

        //-- On valide le choix
        await this.clickElement(page.locator('span.p-multiselect-close-icon'));
    }


    /**
     * 
     * @description Recherche un texte dans un sélecteur multiple (tableau). rettourne la position du texte trouvé si il existe, sinon retourne -1
     * @param selector Le sélecteur contenant les textes à évaluer
     * @param sTexte Le texte recherché
     * @param bDebug  Mode Débug ou non
     * @returns La position dans la liste si elle est trouvée. Sinon retourne -1
     */
    public async getPositionByText(selector:Locator, sTexte:string|null = null, bDebug:boolean = false):Promise<number>{

        const aResponses:any = await selector.allTextContents();

        if (aResponses.length > 0) {

            if (sTexte !== null) {                

                if (bDebug) {
                    console.log('Nombre d\'éléments trouvés : ', aResponses.length);
                    if (aResponses.length > 0) {
                        console.log(aResponses);
                    }
                }

                if (aResponses.includes(sTexte)) {

                    const iPos:number = aResponses.indexOf(sTexte);                         // retourne -1 si absent du tableau sinon retourne sa position en partant de 0
                    if (bDebug) {
                        console.log('Elément trouvé à la position : ', iPos);
                    }
                    return iPos;
                } else {
                    return -1;                                                              // Tableau vide, on retourne -1 comme signal
                }

            } else{
                throw new Error('Ooops : Le TEXTE à rechercher est absent');                // On ne va pas plus loin
            }

        } else{
            throw new Error('Ooops : Le SELECTEUR est absent ou ne retourne rien');         // On ne va pas plus loin
        }

    }


    /**
     * 
     * @param sChaine 
     * @returns string
     * @description Extrait une lettre aléatoire d'un chaine de caractère donnée
     */
    public getRandomLetter(sChaine:string = this.getGlobalConfig('sAbecedaire')):string {
        const iPos = Math.floor(this.random() * sChaine.length);
        return sChaine.substring(iPos, iPos + 1);
    }


    /**
     * 
     * @param aTab Le tableau dans lequel un élément doit être extrait
     * @param bVerbose Affiche des infos de debuggage ou non
     * @returns Un élément du tableau
     */
    public getRandomArray(aTab:any, bVerbose:boolean = false):string {
        if (aTab[0] !== undefined){
            const iNbElements = aTab.length;
            const iPos = Math.floor(this.random() * iNbElements);
            const sReturn = aTab[iPos];
            if (bVerbose) {
                console.log('[getRandomArray()] - Sélection de l\'élément ' + iPos.toString() + '/' + iNbElements.toString() + ' : ' + sReturn);
            }
            return sReturn;
        } else {
            throw new Error('Ooops : Array of strings expected');
        }
    }


    /**
     * 
     * @param bCheck Active ou nom la vérification des textes (Recherche présence de clef de traduction non traduite)
     */
    public setCheckTraductions(bCheck:boolean){
        this.bCheckTrad = bCheck;
    }


    /**
     * 
     * @description Vérifie si le texte passé en argument est une clef de traduction ou sa valeur. Si Clef => Stockage dans un tableau d'erreurs
     * @param sTexte Texte à vérifier
     */
    public checkTraductions(sTexte:string){

        if (this.bCheckTrad) {
            if (sTexte.includes('IT:')) {
//console.log('############################################################ : ' + sTexte);
                this.aErrorTrad.push(sTexte);
            }
        }

    }

    /**
     * 
     * @returns Le nom de l'environnement courrant sous forme de préxie (Ex : INT, INT2, DEMO, FAB,etc.)
     */
    public getPrefixeEnvironnement():string {
        return this.sEnvPrefixe;
    }


    /**
     * 
     * @param sTexte Le texte contenena t soit des retour chariots, soit de pultiples espaces
     * @returns Le texte débarrasé des retours chariots et multiples espaces
     */
    public cleanTexte(sTexte:string):string {
        return sTexte.replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g,' ');
    }


    /**
     * 
     * @param page Page sur laquelle sont extraites les données
     * @param table {optionnel} DataGrid cible (Sous forme d'index ou de locator). Index 1 par défaut
     * @param iLigne {optionnel} Ligne Cible. Ligne 1 par défaut
     * @param colonne {optionnel} La ou les colonnes à récupérer (par défaut récupéation de l aligne complète)
     * @param bVerbose Verbose mode
     * @returns 
     */
    public async getDataGridValues(page:Page, table:string|number=1, iLigne:number=1, colonne:any|null = null, bVerbose:boolean = this.isVerbose()):Promise<any> {

        let iTable:number;
        let aHeaders:Locator;
        let aDatas:Locator;
        let aReturn:any = [];

        //-- La table cible peut être passée sous forme de sélecteur ou sous forme d'index
        if (typeof(table) === 'number'){
            
            iTable = table - 1;

            aHeaders  = page.locator('table').nth(iTable).locator('thead tr:nth-child(1) th');
            aDatas    = page.locator('table').nth(iTable).locator('tbody tr:nth-child(' + iLigne + ') td');

        } else {

            aHeaders  = page.locator(table).locator('thead tr:nth-child(1) th');
            aDatas    = page.locator(table).locator('tbody tr:nth-child(' + iLigne + ') td');

        }
        
        //-- On attend que les entêtes soient visibles
        if (await aHeaders.first().isVisible()) {

            const iNbColonnes = await aHeaders.count();

            if (bVerbose) {
                const iNbDonnees = await aDatas.count();
                console.log('DataGrid', iTable);
                console.log('Ligne', iLigne);
                console.log('Nb Colonnes', iNbColonnes);
                console.log('Nb Donnees', iNbDonnees);
            }

            //this.log.info('DataGrid ' + table + ' | Ligne ' +  iLigne + ' | Colonne ' + colonne);

            if ( iNbColonnes > 0) {

                for (let iColonne = 1; iColonne <= iNbColonnes; iColonne++) {

                    //-- Par défaut on ne sait pas encore si on souhaite récupérer la donnée
                    let bGetDonnee:boolean = false;

                    //-- Si on ne précise pas de colonne en particulier, on affiche l'intégratlité de la ligne
                    if (colonne === null) {

                        bGetDonnee = true;

                    } else {
                        
                        //-- Si on affiche une seule valeur située à une position précise
                        if (typeof(colonne) === 'number') {

                            if (iColonne === colonne) {
                                bGetDonnee = true;                            
                            }

                        } else {

                            //-- La colonne fait elle partie de la liste des colonnes à récupérer ?
                            if (colonne.indexOf(iColonne) !== -1) {
                                bGetDonnee = true;
                            } else {
                                bGetDonnee = false;
                            }

                        }

                    }

                    if (bGetDonnee) {
                        
                        var sHeader = await aHeaders.nth(iColonne -1).textContent();
                        var locator = aDatas.nth(iColonne - 1);
                        var sContenu = await locator.textContent();

                        if (bVerbose) {
                            console.log(sHeader.toUpperCase() + ' : ' + sContenu);
                        }

                        this.log.set(sHeader.toUpperCase() + ' : ' + sContenu);
        
                        //-- On met en surbrillance la donnée retournée
                        await locator.evaluate((elem) => {
                            elem.style.background = '#0000CD';
                            elem.style.color = 'white';
                        });

                        aReturn.push({iColonne, sHeader, sContenu});

                    }

                }
                
            } else {
                console.log('Aucune information retournée pour la DataGrid "' + table + '" et pour la ligne "' + iLigne + '"');
            }

        } else {
            console.log('Ooops : Aucune DataGrid trouvée avec le sélecteur "' + aHeaders + '"');
        }

        return aReturn;

    }


     /**
     * 
     * @param page Page sur laquelle sont extraites les données
     * @param table {optionnel} DataGrid cible (Sous forme d'index ou de locator). Index 1 par défaut
     * @param iLigne {optionnel} Ligne Cible. Ligne 1 par défaut
     * @param colonne {optionnel} La ou les colonnes à récupérer (par défaut récupéation de l aligne complète)
     * @param bVerbose Verbose mode
     * @returns 
     */
     public async getDataGridValues2(page:Page, table:string|number=1, iLigne:number=1, colonne:any|null = null, bVerbose:boolean = this.isVerbose()):Promise<any> {

        let iTable:number;
        let aHeaders:Locator;
        let aDatas:Locator;
        let aReturn:any = [];

        //-- La table cible peut être passée sous forme de sélecteur ou sous forme d'index
        if (typeof(table) === 'number'){
            
            iTable = table - 1;

            aHeaders  = page.locator('table').nth(iTable).locator('thead th');
            aDatas    = page.locator('table').nth(iTable).locator('tbody tr:nth-child(' + iLigne + ') td');

        } else {

            aHeaders  = page.locator(table).locator('thead tr:nth-child(1) th');
            aDatas    = page.locator(table).locator('tbody tr:nth-child(' + iLigne + ') td');

        }
        
        //-- On attend que les entêtes soient visibles
        if (await aHeaders.first().isVisible()) {

            const iNbColonnes = await aHeaders.count();

            if (bVerbose) {
                const iNbDonnees = await aDatas.count();
                console.log('DataGrid', iTable);
                console.log('Ligne', iLigne);
                console.log('Nb Colonnes', iNbColonnes);
                console.log('Nb Donnees', iNbDonnees);
            }

            //this.log.info('DataGrid ' + table + ' | Ligne ' +  iLigne + ' | Colonne ' + colonne);

            if ( iNbColonnes > 0) {

                for (let iColonne = 1; iColonne <= iNbColonnes; iColonne++) {

                    //-- Par défaut on ne sait pas encore si on souhaite récupérer la donnée
                    let bGetDonnee:boolean = false;

                    //-- Si on ne précise pas de colonne en particulier, on affiche l'intégratlité de la ligne
                    if (colonne === null) {

                        bGetDonnee = true;

                    } else {
                        
                        //-- Si on affiche une seule valeur située à une position précise
                        if (typeof(colonne) === 'number') {

                            if (iColonne === colonne) {
                                bGetDonnee = true;                            
                            }

                        } else {

                            //-- La colonne fait elle partie de la liste des colonnes à récupérer ?
                            if (colonne.indexOf(iColonne) !== -1) {
                                bGetDonnee = true;
                            } else {
                                bGetDonnee = false;
                            }

                        }

                    }

                    if (bGetDonnee) {
                        
                        var sHeader = await aHeaders.nth(iColonne -1).textContent();
                        var locator = aDatas.nth(iColonne - 1);
                        var sContenu = await locator.textContent();

                        if (bVerbose) {
                            console.log(sHeader.toUpperCase() + ' : ' + sContenu);
                        }

                        this.log.set(sHeader.toUpperCase() + ' : ' + sContenu);
        
                        //-- On met en surbrillance la donnée retournée
                        await locator.evaluate((elem) => {
                            elem.style.background = '#0000CD';
                            elem.style.color = 'white';
                        });

                        aReturn.push({iColonne, sHeader, sContenu});

                    }

                }
                
            } else {
                console.log('Aucune information retournée pour la DataGrid "' + table + '" et pour la ligne "' + iLigne + '"');
            }

        } else {
            console.log('Ooops : Aucune DataGrid trouvée avec le sélecteur "' + aHeaders + '"');
        }

        return aReturn;

    }


    /**
     * 
     * @param page Page sur laquelle est affichée le calendrier
     * @param sYear Année choisie (exemple : "2024")
     * @param sMonth Mois choisi (exemple : "Avr")
     * @param sDay Jour choisi (exemple : "4")
     * @returns 
     */
    public async selectDateCalendar(page: Page, sYear: string, sMonth: string, sDay: string): Promise<any> {
        const monthSwitch = await page.locator('.datepicker-switch').evaluateAll(elements => {
            const visibleElement = elements.find(el => {
                const parentDiv = el.closest('div');
                return getComputedStyle(parentDiv).display === 'block';
            });
            return visibleElement.textContent.trim();
        });
        await this.clickElement(page.locator('.datepicker-switch').filter({ hasText: new RegExp(`^${monthSwitch}$`) }));
    
        const yearSwitch = await page.locator('.datepicker-switch').evaluateAll(elements => {
            const visibleElement = elements.find(element => {
                const parentDiv = element.closest('div');
                return getComputedStyle(parentDiv).display === 'block';
            });
            return visibleElement.textContent.trim();
        });
        await this.clickElement(page.locator('.datepicker-switch').filter({ hasText: new RegExp(`^${yearSwitch}$`) }));

        await this.clickElement(page.locator('.datepicker-years span:not(.disabled)').filter({ hasText: new RegExp(`^${sYear}$`) }));
        await this.clickElement(page.locator('.datepicker-months span:not(.disabled)').filter({ hasText: new RegExp(`^${sMonth}$`) }));
        await this.clickElement(page.locator('.datepicker-days td:not(.old):not(.new):not(.disabled)').filter({ hasText: new RegExp(`^${sDay}$`) }));
    }


    /**
     * 
     * @param application 
     * @param role 
     */
    public async changeProfil(application:string, role:string, page:Page) {
        const userCredential    = new Credential(role);
        var infoProfil          = userCredential.getProfil(application, role);
        this.deconnexion(page);
        this.setLogin(infoProfil.login);        
        this.setPassword(infoProfil.password);
        await this.connexion(page);
    } 


}