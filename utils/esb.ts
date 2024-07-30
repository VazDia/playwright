
/**
 * 
 * Classe dédiée à la manipulation des données avec l'ESB (Tibco)
 * 
 * @author Vazoumana DIARRASSOUBA
 * @version 2.6
 * @description Examine les flux passés en arguments {oFlux}. Cf. Exemple ci dessous
 *  
 */

// EXEMPLE : 
//
// test.skip('** CHECK FLUX **', async () =>  {
//     const oFlux:TypeEsb   =  { 
//         FLUX : [
//             {
//                 NOM_FLUX         : "EnvoyerArticle_Stock",
//                 DESCRIPTION      : /Pop*/                         // Optionnel - Examen du titre du Flux (expression régulière)
//                 NB_FLUX          : 5                              // Optionnel - Determine le nombre de flux à vérifier
//                 STOP_ON_FAILURE  : true                          // Optionnel - Indique que le TA doit échouer si ce flux échoue
//             }, 
//             {
//                 NOM_FLUX  : "EnvoyerClient_Stock",
//                 TITRE     : /Client TA Désign.*/                 // Optionnel
//             }, 
//             {
//                 NOM_FLUX  : "Diffuser_Lieu",
//                 TITRE     : ""                                   // Optionnel
//             }, 
//         ],
//         WAIT_BEFORE   : 3000,                                    // Optionnel - Délai d'attente avant examen des flux
//         START_TIME    : new Date('1970-01-01').getTime(),        // Optionnel - Date de démarrage de l'examen du flux (par défaut la date de démarrage du test)
//         VERBOSE_MOD   : false                                    // Optionnel - Affiche les info de debuggage - Ecrasé par la variable d'environnement VERBOSE_MOD si valeur indéfinie
//         STOP_ON_FAILURE : false                                  // Optionnel - Indique que le TA doit échouer si AU MOINS 1 flux échoue
//     };
// await esb.checkFlux(oFlux, page)
    
import { type Page, test }      from '@playwright/test';
import { TypeEsb }              from '@commun/types';

export class EsbFunctions {

    public URL          : string;

    private flux        : string;
    private search      : string;
    private maxRow      : number;
    private debugMode   : boolean;
    private dateStart   : number;
    private fonction    : any;
    private aErreurs    : any;
    private aNotes      : any;
    private bBreakOnFail: boolean;
    private requestResult: any;

    constructor(fonction:any){
        this.flux           = '';
        this.search         = '';
        this.maxRow         = 4;
        this.debugMode      = false;
        this.fonction       = fonction;
        this.URL            = this.fonction.getUrlEsb();
        this.aErreurs       = [];
        this.aNotes         = [];
        this.bBreakOnFail   =  false;
        this.requestResult  = '';
    }

    // -------------------------------------------------------------------------------------------------

    public setFlux (sFlux:string) {
        this.flux = sFlux;
    }

    public setSearch (sSearch:string) {
        this.search = sSearch;
    }

    public setMaxRow (iMaxRow:number) {
        this.maxRow = iMaxRow;
    } 

    private setDateStart(dDate:number) {
        this.dateStart = dDate;
    }

    private setErreur(sErreur:string) {
        if (this.getBreakOnFailure()) {         // Une erreur bloquante est détectée
            this.aErreurs.push(sErreur);
        } else {                                // Une Note est signalée
            this.aNotes.push(sErreur);
        }
    }

    private setBreakOnFailure (bBreak:boolean) {
        if (this.bBreakOnFail !== bBreak) {
            this.fonction.log.set('Examen des flux : ' + bBreak);
        }
        this.bBreakOnFail = bBreak;
    }

    // -------------------------------------------------------------------------------------------------

    private getBreakOnFailure ():boolean {
        return this.bBreakOnFail;
    }

    public getUrl ():string {
        var url = this.URL + '?nom_flux=' + this.getFlux() + '&max_row=' + this.getMaxRox();
        return url;
    }

    public getMaxRox ():number {
        return this.maxRow;
    }

    public getSearch ():string {
        return this.search;
    }

    public getFlux ():string {
        return this.flux;
    }

    public getDebugMode():boolean {
        this.debugMode = this.fonction.isVerbose();
        return this.debugMode;
    }  

    private getDateStart():number {
        return this.dateStart;
    }
    
    public async sendRequest():Promise<any> {
        var url = this.getUrl()
        var response = await fetch(url, {method: 'GET'});
        if (response.ok) {
            var responseBody = await response.text();
            return responseBody; // Renvoie le corps de la réponse
        } else {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    }

    public async getResult (page:Page) {

        var retour = await this.sendRequest();

        // Si le flux retourne au moins un résultat
        if(retour.match(/<result>/gi)){

            var dateTir = new Date(this.getDateStart());

            // Récupération de la date de lancement contenue dans le Flux
            const aDate:any = retour.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/);
    
            // Exctraction de la date
            const dDate = Date.parse(aDate[0]);

            // Mise au format Timestamp
            var dateFlux = new Date(dDate);

            // Le flux récupéré a t'il été généré APRES la date de début du tir ?
            if (dDate - this.getDateStart() < 0 ) {

                if(this.getDebugMode()){
                    console.log('| Debug Mode : ON --------------------------------------------------------------');
                    console.log('| URL : ' + this.getUrl());
                    console.log('| FLUX : Ignoré');
                    console.log('| DATE FLUX : ', dateFlux.toUTCString());
                    console.log('| DATE TEST : ', dateTir.toUTCString());
                    console.log('|-------------------------------------------------------------------------------');

                    this.fonction.log.set(this.getFlux() + ' : Flux Absent (dernier généré : ' + dateFlux.toUTCString() + ')');
                } 

                this.setErreur(this.getFlux() + ' : Flux Absent (dernier généré : ' + dateFlux.toUTCString() + ')');

                // La donnée récupérée n'est pas en lien avec le test
                return false;
            }

            // Statuts possibles :
            // - END      => OK
            // - END_ERR  => Erreur
            // - END_WARN => Warning

            // Statut en Erreur OU en Warning
            if (!retour.match(/<statut>END<\/statut>/gi)) {

                var retourDecode = await this.htmlDecode(page, retour, 'result');

                var sStatut = 'Erreur';
                if (retour.match(/<statut>END_WARN<\/statut>/gi)) {
                    sStatut = 'Warning';
                }

                if(this.getDebugMode()){
                    console.log('| Debug Mode : ON --------------------------------------------------------------');
                    console.log('| URL : ' + this.getUrl());
                    console.log('| STATUT : ' + sStatut);
                    console.log('| RETOUR : ' + retourDecode);
                    console.log('|-------------------------------------------------------------------------------');

                    this.fonction.log.set(this.getFlux() + ' - Statut : ' + sStatut);

                } 

                if (sStatut == 'Erreur') {                                              // Flux en ERREUR
                    this.setErreur(this.getFlux() + ' - Statut : ' + sStatut);
                    return false ; 
                } else {                                                                // Flux en WARNING
                    return true;                                                        // On ne lève pas d'erreur pour un Warning
                }

            } else {                                                                    // Flux OK

                if (this.getDebugMode()) {
                    console.log('| Debug Mode : ON --------------------------------------------------------------');
                    console.log('| URL : ' + this.getUrl());
                    console.log('| STATUT : Succès');
                    console.log('| RETOUR : ');
                    console.log(await this.htmlDecode(page, retour,'statut'));
                    console.log('|-------------------------------------------------------------------------------');

                    this.fonction.log.set(this.getFlux() + ' - Statut : OK');
                }

                return true;

            }

        } else {                                                                        // aucune donnée retournée

            this.setErreur(this.getFlux() + ' - Ce Flux n\'existe pas !');
            return false;                                                               // On lève une Erreur

        }
        
    }

    /**
     * 
     * @param page 
     * @param input 
     * @param message 
     * @returns Texte décodé au format html
     */
    public async htmlDecode(page:Page, input:string, message:string):Promise<any> {
        await page.setContent(input);
        return await page.textContent(message);
    } 

    /**
     * 
     * @param page 
     * @param input 
     * @param balise 
     * @returns Renvoie les contenus des occurrences de la balise sous forme de liste.
     * 
     */

    public async fetchContentByResponseTag (page:Page, input:string, balise:string):Promise<any>{
        await page.setContent(input);
        const texts = await page.evaluate((message) => {

            // Sélectionner tous les éléments correspondants à 'message' et extraire leur texte
            const elements = Array.from(document.querySelectorAll(message));
            const texts = elements.map(element => element.textContent?.trim() || '');
            return texts;
        }, balise);

        return texts;   
    }

    /**
     * 
     * @param page 
     * @param response 
     * @param indexInArray 
     * @description Vérifie le statut d'un flux lancé
     * 
     */

    public async checkResponseState(page:Page, response:string, indexInArray:number = 0){

        var aResultat = await this.fetchContentByResponseTag(page, response, 'resultat');
        var aStatut    = await this.fetchContentByResponseTag(page, response, 'statut');

        // Statut en Erreur OU en Warning
        if (aStatut[indexInArray] != 'END') {

            var retourDecode = aResultat[indexInArray];
            var sStatut = 'Erreur';
            if ((aStatut[indexInArray] === 'END_WARN')) {
                sStatut = 'Warning';
            }

            if(this.getDebugMode()){  
                
                console.log('| STATUT : ' + sStatut);
                console.log('| RETOUR : ' + retourDecode);
                console.log('|-------------------------------------------------------------------------------');

                this.fonction.log.set(this.getFlux() + ' - Statut : ' + sStatut);
            } 

            if (sStatut == 'Erreur') {                                              // Flux en ERREUR
                
                this.setErreur(this.getFlux() + ' - Statut : ' + sStatut);
                return false ; 
            } else {                                                                // Flux en WARNING

                return true;                                                        // On ne lève pas d'erreur pour un Warning
            }
        } else {                                                                    // Flux OK

            if (this.getDebugMode()) {

                console.log('| STATUT : Succès');
                console.log('| RETOUR : ');
                console.log((aStatut[indexInArray]));
                console.log('|-------------------------------------------------------------------------------');
                this.fonction.log.set(this.getFlux() + ' - Statut : OK');
            }
            return true;
        }
    }

    /**
     * 
     * @param page 
     * @param oFlux 
     * @param nbFlux 
     * @description Rechercher la reponse d'un flux déjà envoyé
     */

    public async seachByDescription(page:Page, oFlux:TypeEsb){

        if(typeof(oFlux) ==='object'){

            var aFlux          = oFlux['FLUX']; 
            var bTrouver       = false;
            var sHtmlFluxDate  = '';
            var currentDate    = new Date();
            var iIndexCommun   :number; // Index qui sera utilisé pour récuperer toutes sortes de données au niveau du résultat recherché

            if (typeof(oFlux['VERBOSE_MOD']) === 'boolean') {

                this.fonction.verbose(oFlux['VERBOSE_MOD']);
            }

            for (const flux of aFlux) { 

                await test.step(flux['NOM_FLUX'] + ' - Search', async () => {

                    this.setFlux(flux['NOM_FLUX']);

                    if((flux['DESCRIPTION'] != undefined) && flux['DESCRIPTION'] != ''){

                        var sLibelle = flux['DESCRIPTION'];
                    }

                    if((flux['NB_FLUX'] != undefined) && (typeof(flux['NB_FLUX']) === 'number')){

                        var nbFlux = flux['NB_FLUX'];
                        this.setMaxRow(nbFlux);
                    }

                    // Le flux est il marqué comme important ?
                    // Tous les flux sont il marqués comme importants ?
                    // Un paramètre externe est il passé en argument ?
                    if (flux['STOP_ON_FAILURE'] === true || oFlux['STOP_ON_FAILURE'] === true || process.env.STOP_ON_FAILURE === 'true') {

                        this.setBreakOnFailure(true);
                    } else if (process.env.STOP_ON_FAILURE === 'false') {      // A contrario, on peut décider de nNE PAS exécuter de contrôle du flux même si il est défini en dur dans le code

                        this.setBreakOnFailure(false);
                    }

                    this.requestResult = await this.sendRequest();

                    // Si le flux retourne au moins un résultat
                    if(this.requestResult.match(/<result>/gi)){
                        
                        // Récupération des différentes dates de lancement du Flux dans un tableau
                        const aDate = await this.fetchContentByResponseTag(page, this.requestResult, 'date_start');

                        // On va également recuperer tous les contenus des occurences de la balise description dans un tableau
                        var aDescriptions = await this.fetchContentByResponseTag(page, this.requestResult, 'description');

                        // S'il le faut on peut aussi récuperer les contenus des occurences de la balise interface

                        for(const sDescription of aDescriptions){

                            if(sDescription === sLibelle){ // On va comparer le libellé à toutes les données de description recueillies pour garder celle qu'on cherche.

                                iIndexCommun = aDescriptions.indexOf(sDescription);
                                sHtmlFluxDate         = aDate[iIndexCommun]; // Si on a la donnée recherchée, on récuperer la date de cette donnée rétrouvé
                                bTrouver              = true;
                                break;
                            }
                        }

                        if(bTrouver){  // Alors le flux existe dans le lot 
                    
                            // Exctraction de la date
                            const dDate = Date.parse(sHtmlFluxDate);

                            // Mise au format Timestamp
                            var dateFlux = new Date(dDate);

                            if(this.getDebugMode()){
                                
                                console.log('| Debug Mode : ON --------------------------------------------------------------');
                                console.log('| URL : ' + this.getUrl());
                                console.log('| Date FLUX: ' + dateFlux.toUTCString());
                                console.log('| Date TEST: ' + currentDate.toUTCString());
                                this.fonction.log.set('Flux retrouvé avec la description : ' + sLibelle);
                            }

                            //On vérifie à présent si le statut du flux est ok
                            await this.checkResponseState(page, this.requestResult, iIndexCommun);
                        }else{ // Le flux n'existe pas dans le lot 

                            if(this.getDebugMode()){
                                console.log('| Debug Mode : ON --------------------------------------------------------------');
                                console.log('| URL : ' + this.getUrl());
                                this.setErreur(this.getFlux() + ' : Flux absent ( Aucun flux dans la liste correspond à la description: ' + sLibelle + ')');
                            }
                        }
                    }else {                                                                        // aucune donnée retournée

                        this.setErreur(this.getFlux() + ' - Ce Flux n\'existe pas !');
                        return false;                                                               // On lève une Erreur
                    }  
                })
            }

            // On affiche pour information toutes les notes
            if(this.aNotes.length > 0){  
                console.log(`PI : ${this.aNotes.length} flux en echec : `);
                this.fonction.log.set(`PI : ${this.aNotes.length} flux en echec : `);
                var iCpt = 0;
                this.aNotes.forEach( (sNote: string) => {
                    iCpt++;
                    console.error('[' + iCpt + '] ' + sNote);
                })
            }

            // On va récuperer les messages d'erreurs de tous les flux qui échouent s'il en existe et les afficher par ordre de génération
            if(this.aErreurs.length > 0){  
                console.log(` ${this.aErreurs.length} flux en echec : `);
                this.fonction.log.set(` ${this.aErreurs.length} flux en echec : `);
                var iCpt = 0;
                this.aErreurs.forEach( (sErreur: string) => {
                    iCpt++;
                    console.error('[' + iCpt + '] ' + sErreur);
                })

                throw new Error(` ${this.aErreurs.length} flux en echec`);             // Après l'affichage de la dernière erreur dans la boucle on lève une exception
            }
        }
    }

    /**
     * 
     * @param oFlux 
     * @param page 
     * @description Vérifie la liste des flux passé en argument {oFlux} et lève une erreur si au moins un Flux est KO
     */
    public async checkFlux(oFlux: TypeEsb, page: Page) {

        if (typeof (oFlux) === 'object') {
            
            // Liste des Flux / Titres
            var aFlux           = oFlux['FLUX'];

            // Délai attente avant lancement
            var iTime           = oFlux['WAIT_BEFORE']||30000;
            test.setTimeout((iTime + 42000));                           // Augmentation du délai de TimeOut de base de la valeur d'attente définie (WAIT_BEFORE) avant le lancement du test 

            // Date démarrage du flux (si transmis, sinon date de démarrage du test par défaut)
            var iTirStart       = oFlux['START_TIME'] || this.fonction.getStartTime();

            // Debug Mod local
            if (typeof(oFlux['VERBOSE_MOD']) === 'boolean') {
                this.fonction.verbose(oFlux['VERBOSE_MOD']);
            }

            this.setDateStart(iTirStart);

            // Temporisation le temps que les flux se lancent
            await this.fonction.wait(page, iTime);

            for (const flux of aFlux) {

                await test.step(flux['NOM_FLUX'] + ' - Check', async () => {

                    this.setFlux(flux['NOM_FLUX']);
                    // this.setMaxRow(1);

                    // Le flux est il marqué comme important ?
                    // Tous les flux sont il marqués comme importants ?
                    // Un paramètre externe est il passé en argument ?
                    if (flux['STOP_ON_FAILURE'] === true || oFlux['STOP_ON_FAILURE'] === true || process.env.STOP_ON_FAILURE === 'true') {
                        this.setBreakOnFailure(true);
                    } else if (process.env.STOP_ON_FAILURE === 'false') {      // A contrario, on peut décider de nNE PAS exécuter de contrôle du flux même si il est défini en dur dans le code
                        this.setBreakOnFailure(false);
                    }

                    try {
                        await this.getResult(page);
                    } catch (e) {
                        this.setErreur(this.getFlux() + ' - Ce Flux n\'existe pas : ' + e);
                    }

                });

            }

            // On affiche pour information toutes les notes
            if(this.aNotes.length > 0){  
                console.log(`PI : ${this.aNotes.length} flux en échec : `);
                this.fonction.log.set(`PI : ${this.aNotes.length} flux en échec : `);
                var iCpt = 0;
                this.aNotes.forEach( (sNote: string) => {
                    iCpt++;
                    console.error('[' + iCpt + '] ' + sNote);
                })
            }

            // On va récuperer les messages d'erreurs de tous les flux qui échouent s'il en existe et les afficher par ordre de génération
            if(this.aErreurs.length > 0){  
                console.log(` ${this.aErreurs.length} flux en échec : `);
                this.fonction.log.set(` ${this.aErreurs.length} flux en échec : `);
                var iCpt = 0;
                this.aErreurs.forEach( (sErreur: string) => {
                    iCpt++;
                    console.error('[' + iCpt + '] ' + sErreur);
                })

                throw new Error(` ${this.aErreurs.length} flux en échec`);             // Après l'affichage de la dernière erreur dans la boucle on lève une exception
            }

        }
    }
}