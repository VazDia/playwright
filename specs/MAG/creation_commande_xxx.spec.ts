/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 18 - 12 - 2023
 */

const xRefTest      = "MAG_CMD_SAP";
const xDescription  = "Effectuer une commande magasin pour le Rayon xxx pour la Commande yyy";
const xIdTest       =  2752;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Sensible à l\'heure du lancement - Check heures definie assortiments',],
    params      : ['ville', 'groupeArticle', 'nomCommande', 'tauxSaisieCmde'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}       from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { EsbFunctions }                 from "@helpers/esb";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { CommandesCommande }            from '@pom/MAG/commandes-commande.page';

import { CartoucheInfo, TypeEsb }       from '@commun/types';

//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageCmdsCmd   : CommandesCommande;

let esb           : EsbFunctions;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------  

const sVilleCible        = process.env.VILLE || 'Agde (F718)';
const sGroupeArticle     = process.env.GROUPEARTICLE || 'Tous';
const sTauxRemplissage  = process.env.TAUXSAISIECMDE || '0.5';
const sNomCmmande       = process.env.NOMCOMMANDE || 'Volaille';

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    esb             = new EsbFunctions(fonction);
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageCmdsCmd     = new CommandesCommande(page);
    
});
 
test.afterAll(async () => {
    fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });
test.describe ('[' + xRefTest + ']', () => {

    var bWorkToDo           = false;
    var dTauxRemplissage    = parseFloat(sTauxRemplissage);

    test('-- Start --', async ({ page, context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo);
        await helper.init();
    })

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [ACCUEIL]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){

                await menu.removeArlerteMessage();
            }else{

                log.set('Link [BROWSER SECURITY WARNING] - Click: ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe('Page [COMMANDES]', async () => {
 
        test('Page [COMMANDES] - Click', async () => {
            await menu.click('commandes', page);
        });  

        test('ListBox [VILLE] = "' + sVilleCible + '"', async () => {
            await menu.selectVille(sVilleCible, page);
        })

        test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
            if (sGroupeArticle != 'Tous') {
    
                await fonction.listBoxByLabel(pageCmdsCmd.elistBoxGrpArticle, sGroupeArticle, page);    
            }        
        })
    
        test ('Button [A FAIRE] - Click', async () => {
            //-- Prise en compte du cas ou une alerte sanitaire s'afficherait en mode Modal !
            var isVisible = await menu.pPlabelAlerteSanitaire.isVisible();                  
            if (isVisible) { 

                await menu.removeArlerteMessage();                       
            }                  
        
            expect(await pageCmdsCmd.clickButtonAFaire(page)).toBe(true);
        })

        test('CheckBox [COMMANDE] = "' + sNomCmmande + '"', async () => {    

            await fonction.selectorToBeCharged(pageCmdsCmd.dataGridLibelleCmd.last());
    
            var iNbCommandes               = await pageCmdsCmd.dataGridLibelleCmd.count();
            var aIndexCmdeCorespd:number[] = [];
    
            log.set('Nombre de commandes : ' + iNbCommandes);
            for(let iIndexCommande = 0; iIndexCommande < iNbCommandes; iIndexCommande++){
    
                var sNomCommande = await pageCmdsCmd.dataGridLibelleCmd.nth(iIndexCommande).textContent();
                sNomCmmande.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');              // Nettoyage de chaîne par sécurité
                var regex = new RegExp("^" + sNomCmmande + "", "gi");
                if (sNomCommande?.match(regex)) {
    
                    log.set('Commande à Faire : ' + sNomCommande + ' <-------');
                    bWorkToDo = true;
                    aIndexCmdeCorespd.push(iIndexCommande);
                } else {
    
                    log.set('Ignorée : ' + sNomCommande);
                }
    
                
                if(iIndexCommande == iNbCommandes - 1 ){
                    if(bWorkToDo){
                
                        await fonction.clickAndWait(pageCmdsCmd.dataGridLibelleCmd.nth(aIndexCmdeCorespd[0]), page);
                    }else{
        
                        log.set('*** Aucune Commande réalisable avec ces critères ***');
                    }
                }
            }
        })
    
        test('Input Fields [COMMANDE] + [PREVISION] - Remplissage', async () => {
            if (bWorkToDo){
    
                var ligneArticleIsVisible = await fonction.selectorToBeCharged(pageCmdsCmd.lignesArticles.last());
                if(ligneArticleIsVisible){
    
                    var iNbArticles = await pageCmdsCmd.lignesArticles.count();
                    log.set('Nombre d\'articles : ' + iNbArticles);
                    for(let iIndexArticle = 0; iIndexArticle < iNbArticles; iIndexArticle++){
    
                        var nbColis:any;
                        var articleIsVisible = await  pageCmdsCmd.inputQteCmdee.nth(iIndexArticle).isVisible();
                        if(articleIsVisible){
    
                            var defaultValue = await pageCmdsCmd.inputQteCmdee.nth(iIndexArticle).inputValue();
                            if (defaultValue == '') {
    
                                var sConditionnement =  await pageCmdsCmd.labelConditionnementD.nth(iIndexArticle).innerText();
                                await pageCmdsCmd.inputQteCmdee.nth(iIndexArticle).clear();
                                var cmdMinisVisible = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).isVisible();        // Récupération info Multiple
                                if ( fonction.random() <  dTauxRemplissage) {
    
                                    if(cmdMinisVisible){
    
                                        var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).textContent();                                    
                                        nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);              //  Multiple de commande : 8 Unité(s) => 8
                                        await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(iIndexArticle), nbColis[0]);
                                    }else {                                                               // On la cherche ailleurs...
    
                                        var tabs = sConditionnement.split(' ');                            // 3ème élément splité par un espace
                                        nbColis = parseFloat(tabs[2]);                                     // BO x 8 Unité(s) (1.25 Kg) => 8
                                        if ( typeof(nbColis) != 'number') {                                // BO x 12.8 Kg => 1
    
                                            nbColis = 1;
                                        }                                 
                                        await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(iIndexArticle), nbColis);     
                                    }
                                } else {                                                                  // Pas de commande pour cet article
    
                                    await fonction.sendKeys(pageCmdsCmd.inputQteCmdee.nth(iIndexArticle), '0'); 
                                }
                            }else{
    
                                continue;
                            }
                        }else{
    
                            continue;
                        }
    
                        //-- Quantités prévisionelles --
                        var qtePrevIsVisible = await pageCmdsCmd.inputQtiePrev.nth(iIndexArticle).isVisible();
                        if (qtePrevIsVisible) {                                                                // Un champ Input est il présent ?
    
                            defaultValue = await pageCmdsCmd.inputQtiePrev.nth(iIndexArticle).inputValue();
                            if (defaultValue == '') {                                                         // Une valeur est elle déjà en place ?   
    
                                var sConditionnement =  await pageCmdsCmd.labelConditionnementD.nth(iIndexArticle).innerText();
                                await pageCmdsCmd.inputQtiePrev.nth(iIndexArticle).clear();
                                var cmdMinisVisible = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).isVisible();     // Récupération info Multiple
                                if ( fonction.random() > 0.5 ) {                                                  // une ligne sur deux pour alléger le volume de données
    
                                    if (cmdMinisVisible) {                                                     // Si l'info est présente, on l'intègre
    
                                        var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).textContent();                                            
                                        nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);                  //  Multiple de commande : 8 Unité(s) => 8
                                        await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(iIndexArticle), nbColis[0]);
                                    } else {                                                                    // On la cherche ailleurs...
    
                                        var tabs = sConditionnement.split(' ');                                 // 3ème élément splité par un espace
                                        nbColis = parseFloat(tabs[2]);                                                     // BO x 8 Unité(s) (1.25 Kg) => 8
    
                                        if (typeof(nbColis) != 'number') {                                     // BO x 12.8 Kg => 1         
    
                                            nbColis = 1;
                                        }  
                                        await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(iIndexArticle), nbColis);                                    
                                    }
                                } else {                                                                         // Pas de prévision de commande pour cet article
    
                                    await fonction.sendKeys(pageCmdsCmd.inputQtiePrev.nth(iIndexArticle), '0');
                                }
                            }else{
    
                                continue;
                            }                              
                        }else{
    
                            continue;
                        }
    
                        //-- Quantités prévisionelles suivantes --
                        var qtePrevSuivIsVisible = await pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle).isVisible();
                        if (qtePrevSuivIsVisible) {                                                                // Un champ Input est il présent ?
    
                            defaultValue = await pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle).inputValue();
                            if (defaultValue == '') {                                                         // Une valeur est elle déjà en place ?   
    
                                var sConditionnement =  await pageCmdsCmd.labelConditionnementD.nth(iIndexArticle).innerText();
                                await pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle).clear();
                                var cmdMinisVisible = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).isVisible();     // Récupération info Multiple
                                if ( fonction.random() > 0.5 ) {                                                  // une ligne sur deux pour alléger le volume de données
    
                                    if (cmdMinisVisible) {                                                     // Si l'info est présente, on l'intègre
    
                                        var infoMultiple = await pageCmdsCmd.labelCommandeMinimum.nth(iIndexArticle).textContent();                                            
                                        nbColis = infoMultiple?.match(/[-]{0,1}[\d.]*[\d]+/g);                  //  Multiple de commande : 8 Unité(s) => 8
                                        await fonction.sendKeys(pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle), nbColis[0]);
                                    } else {                                                                    // On la cherche ailleurs...
    
                                        var tabs = sConditionnement.split(' ');                                 // 3ème élément splité par un espace
                                        nbColis = parseFloat(tabs[2]);                                                     // BO x 8 Unité(s) (1.25 Kg) => 8
    
                                        if (typeof(nbColis) != 'number') {                                     // BO x 12.8 Kg => 1         
    
                                            nbColis = 1;
                                        }  
                                        await fonction.sendKeys(pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle), nbColis);                                    
                                    }
                                } else {                                                                         // Pas de prévision de commande pour cet article
    
                                    await fonction.sendKeys(pageCmdsCmd.inputQtePrevSuiv.nth(iIndexArticle), '0');
                                }
                            }else{
    
                                continue;
                            }                              
                        }else{
    
                            continue;
                        }
                    }
                }else{
    
                    log.set('AUCUN REMPLISSAGE POSSIBLE');
                    bWorkToDo = false;
                } 
            }else{
    
                log.set('Input Fields [COMMANDE + PREVISION] - Remplissage: ACTION ANNULEE');
                test.skip();
            }
        })
    
        test('Button [ENVOYER COMMANDE] - Click', async () => {
            if(bWorkToDo){
    
                await fonction.clickAndWait(pageCmdsCmd.buttonEnvoyer, page);
            }else{
    
                log.set('Button [ENVOYER COMMANDE] - Click: ACTION ANNULEE');
                test.skip();
            }
        })
    
        test('Button [ CONFIRMER ] - Click Optionnel', async () => { 
            if(bWorkToDo){
    
                var isVisible = await pageCmdsCmd.pPconfArtNonComButConf.isVisible();
                if(isVisible){  
    
                    await pageCmdsCmd.pPconfArtNonComButConf.click();                                   
                }else{
    
                    log.set('Pas de message d\'avertissement "ARTICLES NON COMMANDES" affiché');
                    test.skip();
                }
            }else{
    
                log.set('Button [ CONFIRMER ] - Click Optionnel: ACTION ANNULEE');
                test.skip();
            }               
        })
    
        test('Button [ CONFIRMER L\'ENVOI ] - Click Optionnel', async () => { 
            if(bWorkToDo){
    
                var isVisible = await pageCmdsCmd.pPerrProbaQteButConf.isVisible();  
                if(isVisible){         
                        
                    await pageCmdsCmd.pPerrProbaQteButConf.click();                                   
                }else{
    
                    log.set('Pas de message d\'avertissement "ERREUR PROBABLE" affiché');
                    test.skip();
                }
            }else{
    
                log.set('Button [ CONFIRMER L\'ENVOI ] - Click Optionnel : ACTION ANNULEE');
                test.skip();
            }              
        })
    
        test('Label [ERREUR] - Is Not Visible', async () => {  // Pas d'erreur [6116] affichée à la fin de l'action
            if(bWorkToDo){
                
                await fonction.isErrorDisplayed(false, page);
            }else{
    
                log.set('Label [ERREUR] - Is Not Visible: VERIFICATION ANNULEE');
            }
        }) 
    })

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

    test('** CHECK FLUX **', async () =>  {

        if (bWorkToDo) {
            const oFlux:TypeEsb = { 
                FLUX : [
                    {
                        NOM_FLUX    : "EnvoyerCommandeMagasin",
                    }, 
                    {
                        NOM_FLUX    : "EnvoyerCommande_Achat",
                    }
                ],
                WAIT_BEFORE     : 3000,                // Optionnel
            };
            await esb.checkFlux(oFlux, page);
        } else {
            log.set('Check Flux : ACTION ANNULEE');
            test.skip();
        }

    })
})