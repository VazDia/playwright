/**
 * 
 * @author SIAKA KONE
 * @since 2023-12-11
 * 
 */
const xRefTest      = "ACH_FLS_FR1";
const xDescription  = "Effectuer un achat vue fournisseur";
const xIdTest       =  25;
const xVersion      = '3.8';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['fournisseur','plateformeReception','plateformeDistribution','listeArticles','nbColisEstimes','rayon','listeMagasins'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { EsbFunctions }     from '@helpers/esb.js';
import { Log }              from '@helpers/log.js';

import { PageAchAchFour }   from '@pom/ACH/achats_achats-fournisseurs.page';
import { MenuAchats }       from '@pom/ACH/menu.page.js';
import * as fs              from 'fs';

import { AutoComplete, CartoucheInfo, TypeEsb }    from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let pageAchAchFour  : PageAchAchFour;
let menu            : MenuAchats;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);
//------------------------------------------------------------------------------------
fonction.importJdd();
//------------------------------------------------------------------------------------
var iNbColis            = fonction.getInitParam('nbColisEstimes', '10');

var sFournisseur        = fonction.getInitParam('fournisseur', 'FRUIDOR LYON'); 
const sPtfDistribut     = fonction.getInitParam('plateformeDistribution', 'Chaponnay');
var sPtfReception       = fonction.getInitParam('plateformeReception', 'Chaponnay');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sCodeArticles     = fonction.getInitParam('listeArticles', '5600,6400,7600');//5700,5800,5900,6000,6100,6300,6400,6600,7100,7300,7400  || 5700,5800,5900,6000,6100,6300,6400,6600,7100,7300,7400
var aListeMagasins:any  = fonction.getInitParam('listeMagasins', 'Bergerac,Bron');

const dtToday           = new Date(); 
const dtYesterday       = new Date(dtToday.setDate(dtToday.getDate() - 1));
const dateVeille        = dtYesterday.getFullYear().toString().slice(-2) + fonction.addZero(dtYesterday.getMonth() + 1) + fonction.addZero(dtYesterday.getDate());
const nomFichier        = process.env.E2E || 'E2E_FL10_CHA';
const fichierVeille     = '_data/_tmp/' + fonction.getPrefixeEnvironnement() + '_' + nomFichier + '-' + dateVeille + '.json';

const rPrixAchat        = 1.000;
const rPrixTransport    = 1.000;
const sUniteAchat       = 'Colis';
var sIncoterm           = ''; 

if (fs.existsSync(fichierVeille)) {
    var dataVeille  = require(fichierVeille);
}

if(typeof(aListeMagasins) == 'string'){
    aListeMagasins = aListeMagasins.split(',');
}
var iNbMagasin = aListeMagasins.length;
if(iNbMagasin > 0){
    iNbColis = (parseInt(iNbColis)*iNbMagasin).toString();
}
sPtfReception = sPtfReception.charAt(0).toUpperCase() + sPtfReception.slice(1).toLowerCase();

if(sPtfReception == sPtfDistribut){
    sIncoterm = 'D - Départ exp.';
} else {
    sIncoterm = 'P - Départ PF';
}

// Prioriser la valeur du fournisseur passée en paramètre sur la donnée contenue dans le JDD...
if (process.env.E2E !== undefined && process.env.E2E != '') {  // JDD de référence communiqué
    if(process.env.fournisseur !== undefined && process.env.fournisseur != ''){
        sFournisseur = process.env.fournisseur; 
    }
} 

const sCategorie    = 'Extra';
var aCodesArticles  = sCodeArticles.split(',');

var doubleCheck = async (iPos:number) => {
   
    //-- Click sur le Calibre cible
    await fonction.clickElement(pageAchAchFour.listBoxVarie.nth(iPos));
    await fonction.wait(page, 1000);

     //-- Récupération Nom Conditionnement affiché
    var sNomConditionnement = await pageAchAchFour.fAcheterListBoxCondition.textContent();
    log.set('Conditionnement : ' + sNomConditionnement);
    if(sNomConditionnement !='' && sNomConditionnement != 'Aucun résultat trouvé'){
        await fonction.clickElement(pageAchAchFour.fAcheterListBoxCondition);
        const iNbeEltm:number = await pageAchAchFour.listBoxVarie.count();
        if(iNbeEltm > 0) {
            await fonction.clickElement(pageAchAchFour.listBoxVarie.last());
        } else {
            await fonction.clickElement(pageAchAchFour.fAcheterListBoxCalibre);
            iPos++;
            await doubleCheck(iPos);
        }
    } 
}

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageAchAchFour  = new PageAchAchFour(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async () => {
    await fonction.close();
});

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', ()=>{

    var oData = {
        aLots           : {},
        sNumAchatLong   : '',
        sBonLivraison   : '',
        aFeuille        : {},
        aCalibre        : {},
        aConditionnement: {},
    };

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
        console.log('Nobmre colis : ' + iNbColis);
    });

    test.describe ('Page [ACHATS]', async () => {

        test ('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

        var pageName = 'achats';

        test ('Page [ACHATS] - Click', async () => {
            await menu.click(pageName, page);
        });

        var sNomOnglet = "ACHATS AUX FOURNISSEURS";
        test.describe ('Onglet [ACHATS AUX FOURNISSEURS]', async() => {

            test ('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(pageName, 'achatsAuxFournisseurs', page);
            });

            test ('Button [CREER ACHAT] - Click', async () => {
                await fonction.clickAndWait(pageAchAchFour.buttonCreerAchat,page);
            });

            test ('InputField [FOURNISSEUR] = "' + sFournisseur + '"', async ()=> {
                await fonction.sendKeys(pageAchAchFour.fAcheterInputFournisseur , sFournisseur);
                await fonction.wait(page, 500);
                await fonction.clickElement(pageAchAchFour.selectFirstAutoComp.nth(0));
                log.set('Fournisseur : ' + sFournisseur);
            });

            test ('Date Picker [DATE RECEPTION PLATEFORME] - Click', async () => {
               await fonction.clickElement(pageAchAchFour.fAcheterPictoDateRecepPtf);
            });

            test ('Day [AUJOUR D\'HUI] - Click', async  () => {
                await fonction.clickElement(pageAchAchFour.fAcheterDateToday);
            });

            test ('ListBox [PLATEFORME DE RECEPTION] = "' + sPtfReception + '"', async () => {
                await fonction.ngClickListBox(pageAchAchFour.fAcheterListBoxPtfRecep.first(), sPtfReception);
            });

            aCodesArticles.forEach(async (sCodeArticle:string)=>{

                test ('InputField [AJOUTETR UN ARTICLE] = "' + sCodeArticle + '"', async ()=> {
                    var oData:AutoComplete = {
                        libelle         :'ARTICLE',
                        inputLocator    : pageAchAchFour.fAcheterInputAjoutArticle,
                        inputValue      : sCodeArticle,
                        choiceSelector  :'app-autocomplete button.dropdown-item',
                        choicePosition  : 0,
                        typingDelay     : 100,
                        waitBefore      : 750,
                        page            : page,
                    };
                    await fonction.autoComplete(oData);
                    log.set('Article : ' + sCodeArticle);
                });
    
                test ('Button [+] "'+ sCodeArticle + '" - Click', async () => {
                    await fonction.clickAndWait(pageAchAchFour.fAcheterButtonPlus,page);
                });
    
                test ('Input [CODE ARTICLE] = "' + sCodeArticle + '"', async () => {
                    await fonction.sendKeys(pageAchAchFour.pPinputFiltreCodeArticle,sCodeArticle);
                    await fonction.wait(page, 500);
                });

                if(dataVeille !== undefined) { //Si le fichier contenant les calibres et conditionnements existent à la date de la veille
                    test('ListBox [CALIBRE]['+ sCodeArticle + '] - Select', async () => {
                        var sDataVeilleCalibre            = dataVeille.aCalibre[sCodeArticle].trim();
                        var sDataVeilleCalibreToUpperCase = sDataVeilleCalibre.toUpperCase();
                        await fonction.clickElement(pageAchAchFour.fAcheterListBoxCalibre); 
                        await pageAchAchFour.listBoxVarie.last().waitFor({state:'visible'});            
                        var aNomCalibre            = await pageAchAchFour.listBoxVarie.allTextContents();
                        log.set('Liste Calibre : [' + aNomCalibre + ']');
                        var aNomCalibreToupperCase = aNomCalibre.map(function(x){ return x.toLocaleUpperCase();});
                        aNomCalibreToupperCase.forEach(async (sNomCalibreToupperCase:string, index:number) => {
    
                            sNomCalibreToupperCase = sNomCalibreToupperCase.trim();
                            if(sNomCalibreToupperCase === sDataVeilleCalibreToUpperCase){
                                oData.aCalibre[sCodeArticle] = aNomCalibre[index]; // On va pointer sur la nouvelle données pour s'assurer qu'elle est identique à la données de la veille
                                log.set(' Calibre [' + sCodeArticle + '] : ' + aNomCalibre[index]);
                                await fonction.clickElement(pageAchAchFour.listBoxVarie.nth(index));
                                if(aNomCalibreToupperCase.length === 1){ // Si la listBox contient un seul element, après la selection de l'element, le listBox reste Ouvert.
                                    await fonction.clickElement(pageAchAchFour.fAcheterListBoxCalibre); // Ce click va fermer cette listbox avant d'aller à l'étape suivante
                                }
                            }
                        })
                        await fonction.wait(page, 2000);
                    })
    
                    test('ListBox [CONDITIONNEMENT]['+ sCodeArticle + '] - Select', async () => {
                        var sDataVeilleConditionnement              = dataVeille.aConditionnement[sCodeArticle].trim();
                        var sDataVeilleConditionnementToUpperCase   = sDataVeilleConditionnement.toUpperCase();
                        await fonction.clickElement(pageAchAchFour.fAcheterListBoxCondition);
                        await pageAchAchFour.listBoxVarie.last().waitFor({state:'visible'});
                        var aNomConditionnement             = await pageAchAchFour.listBoxVarie.allTextContents();
                        var aNomConditionnementToUpperCase  = aNomConditionnement.map(function(x){ return x.toLocaleUpperCase();});
                        log.set('Liste Conditionnement : [' + aNomConditionnement + ']');
                        aNomConditionnementToUpperCase.forEach(async (sNomConditionnementToUpperCase:string, index:number) => {
        
                            sNomConditionnementToUpperCase = sNomConditionnementToUpperCase.trim();
                            if(sNomConditionnementToUpperCase === sDataVeilleConditionnementToUpperCase){
      
                                oData.aConditionnement[sCodeArticle] = aNomConditionnement[index];// On va pointer sur la nouvelle données pour s'assurer qu'elle est identique à la données de la veille
                                log.set(' Conditionnement [' + sCodeArticle + '] : ' + aNomConditionnement[index]);
                                await fonction.clickElement(pageAchAchFour.listBoxVarie.nth(index));
                            }
                        })
                        log.separateur();
                        await fonction.wait(page, 2000);
                    })
                } else { //Nous sommes dans le cas où les conditionnements et calibres n'existent pas dans un fichier, il faut donc les selectionner directement.
                    test('ListBox [CALIBRE][CONDITIONNEMENT]['+ sCodeArticle + '] - Select', async () => {

                        log.set('Le fichier de veille n\'existe pas : ' + fichierVeille);
                        await fonction.clickElement(pageAchAchFour.fAcheterListBoxCalibre);
                        await doubleCheck(0);
                        const sNomCalibre = await pageAchAchFour.fAcheterListBoxCalibre.textContent();
                        const sNomConditionnement = await pageAchAchFour.fAcheterListBoxCondition.textContent();
                        oData.aCalibre[sCodeArticle] = sNomCalibre;
                        oData.aConditionnement[sCodeArticle] = sNomConditionnement;
                    });
                }
            
                test ('ListBox [CATEGORIE]['+ sCodeArticle + '] = "' + sCategorie + '"', async () => {
                    await fonction.clickElement(pageAchAchFour.fAcheterListBoxCategorie);
                    await pageAchAchFour.listBoxVarie.last().waitFor({state:'visible'});
                    const bCategorieVisible = await pageAchAchFour.listBoxVarie.filter({hasText:sCategorie}).nth(0).isVisible();

                    if(bCategorieVisible){

                        await pageAchAchFour.listBoxVarie.filter({hasText:sCategorie}).nth(0).click();
                        await fonction.wait(page, 1000);
                    }
                });

                test ('ListBox [VARIETE][1]['+ sCodeArticle + '] - Select', async () => {
                    const bIsVisible = await pageAchAchFour.fAcheterListBoxVarDisabled.isVisible();
                    if(bIsVisible){
                        log.set('ListBox [VARIETE][1]['+ sCodeArticle + '] - Select : ACTION ANNULEE');
                        test.skip(); 
                    }else{
                        await fonction.clickElement(pageAchAchFour.fAcheterListBoxVariete);
                        await pageAchAchFour.listBoxVarie.last().waitFor({state:'visible'});
                        const iNbreElmt = await pageAchAchFour.listBoxVarie.count();
                        if(iNbreElmt > 1){
                            await pageAchAchFour.listBoxVarie.nth(1).click();
                            await fonction.wait(page, 1000);
                        }else{
                            log.set('ListBox [VARIETE][1]['+ sCodeArticle + '] - Select : ACTION ANNULEE');
                            test.skip();
                        }
                    }
                });

                test ('ListBox [ORIGINEE][0]['+ sCodeArticle + ']', async () => {
                    await fonction.clickElement(pageAchAchFour.fAcheterListBoxOrigine.nth(0));
                    const iNbreElmt = await pageAchAchFour.listBoxVarie.count();
                    if(iNbreElmt > 0){
                        await pageAchAchFour.listBoxVarie.nth(0).click();
                        await fonction.wait(page, 1000);
                        if(iNbreElmt === 1){ // Si la listBox contient un seul element, après la selection de l'element, le listBox reste Ouvert.
                            await fonction.clickElement(pageAchAchFour.fAcheterListBoxCalibre); // Ce click va fermer cette listbox avant d'aller à l'étape suivante
                        }
                    } else {
                        log.set("Origne déjà utilisé et grisé " + iNbreElmt);
                        test.skip();
                    }
                });

                test ('ListBox [PLATEFORME DISTRIBUTION]['+ sCodeArticle + '] = "' + sPtfDistribut + '"', async () => {
                    await fonction.clickElement(pageAchAchFour.listBoxPtfDistribution.nth(0));
                    await pageAchAchFour.listBoxVarie.filter({hasText:sPtfDistribut}).nth(0).click();
                    await fonction.wait(page, 1000);
                });

                test ('ListBox [INCOTERM]['+ sCodeArticle + '] = "' + sIncoterm + '"', async () => {
                    await fonction.clickElement(pageAchAchFour.fAcheterListBoxIncoterm.nth(0));
                    await pageAchAchFour.listBoxVarie.filter({hasText:sIncoterm}).nth(0).click();
                    await fonction.wait(page, 1000);
                });
                
                test ('ListBox [PRIX ACHAT EN]['+ sCodeArticle + '] = "'+ sUniteAchat +'"', async () =>{
                    await fonction.clickElement(pageAchAchFour.fAcheterListBoxUniteAchat.nth(0));
                    await pageAchAchFour.listBoxVarie.filter({hasText:sUniteAchat}).nth(0).click();
                    await fonction.wait(page, 1000);
                });

                test ('InputField [PRIX ACHAT]['+ sCodeArticle + '] = "' + rPrixAchat + '"', async () => {
                    const sDernierPrix = await pageAchAchFour.tdDernierPrixAchat.nth(0).textContent();
                    if(sDernierPrix != ''){

                        await fonction.clickElement(pageAchAchFour.trBasculeDernierPrixAch.nth(0));//Utiliser le dernier prix d'achat s'il en existe
                        await fonction.wait(page, 500);
                    } else {

                        await fonction.sendKeys(pageAchAchFour.inputPrixAchat.nth(0), rPrixAchat);//Saisir un nouveau prix d'achat
                        await fonction.wait(page, 500);
                    }
                });

                test ('InputField [COLIS ESTIME]['+ sCodeArticle + '] = "' + iNbColis + '"', async () => {
                    await fonction.sendKeys(pageAchAchFour.fAcheterInputColisEst.nth(0), iNbColis.toString());
                    await fonction.clickElement(pageAchAchFour.trBasculerColisEstime);  //Bacler le nombre de colis estimé dans coli acheté
                    await fonction.wait(page, 500);
                });

                test('Filtre [CODE ARTICLE]['+ sCodeArticle + '] - Reset', async () => {
                    // On efface le filtre de façon à afficher toutes les lignes
                    await pageAchAchFour.fAcheterInputFiltreArticle.clear();
                });
            });

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonEnregistrer, page);
            });

            test ('Button [ACHETER] - Click', async () => {
                await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonAcheter,page);
            });

            test('Confirmation [ACHETER] - Click if present', async () => {
                var isElementVisible = await pageAchAchFour.pPconfirmButtonAcheter.isVisible();
                if(isElementVisible){

                    await fonction.clickAndWait(pageAchAchFour.pPconfirmButtonAcheter, page);
                    log.separateur();
                    log.set('Confirmation d\'achat malgré alerte');
                }else{

                    // NOP - Pas d'alerte, on ne clique pas sur le lien... qui est absent
                }
                await pageAchAchFour.fAcheterLabelNumAchat.waitFor({state:'visible'}); // Peut être long...
                var sNumAchat = await pageAchAchFour.fAcheterLabelNumAchat.textContent()
                log.separateur();
                log.set('Numéro d\'achat : ' + sNumAchat);
                oData.sNumAchatLong = sNumAchat;                     // Mémorisation du numéro d'achat pour plus tard...
                log.separateur();
            });

            test('DataGrid [NUMEROS LOTS] - Get', async () => {
                var iNBLigne          = await pageAchAchFour.fAcheterDataGridLignes.count();
                for (let iIndexLigne  = 0; iIndexLigne < iNBLigne; iIndexLigne++){

                    var sColonneArticle   = pageAchAchFour.fAcheterDataGridLignes.nth(iIndexLigne).locator('td.text-center').nth(1);
                    var sColonneNumeroLot = pageAchAchFour.fAcheterDataGridLignes.nth(iIndexLigne).locator('td.text-center').nth(4);
                    var sCodeArticle  = await sColonneArticle.textContent();
                    var sNumerolot    = await sColonneNumeroLot.textContent();
                    log.set('Article : ' +  sCodeArticle + ' / Numéro Lot : ' + sNumerolot);
                    oData.aLots[sCodeArticle] = sNumerolot;
                }
            });

            aCodesArticles.forEach(async (sCodeArticle) => {

                test.describe ('Popin [DETAIL LOTS][' + sCodeArticle + ']', async ()=> {

                    test ('Input [CODE ARTICLE] = "' + sCodeArticle + '"',async () => {
                        await fonction.sendKeys(pageAchAchFour.pPinputFiltreCodeArticle,sCodeArticle);
                        await fonction.wait(page, 1000);
                    });

                    test ('CheckBox [ALL]['+ sCodeArticle + ']', async () => {
                        await pageAchAchFour.pPcheckBoxAllLot.click();
                    });
    
                    test ('Button [VOIR DETAIL]['+ sCodeArticle + '] - Click',async () => {
                        await fonction.clickAndWait(pageAchAchFour.pPbuttonDetailLot,page);
                    });
    
                    test ('Icon [CONFIRMER COLIS]['+ sCodeArticle + '] -Click', async () => {
                        var iconIsVisible = await pageAchAchFour.pPiconConfirmerColis.isVisible();
                        if(iconIsVisible){

                            await fonction.clickAndWait(pageAchAchFour.pPiconConfirmerColis,page);
                        }else{

                            log.set('Icon [CONFIRMER COLIS]['+ sCodeArticle + '] -Click : ACTION ANNULEE');
                            test.skip();
                        }
                    });
    
                    test ('InputField [POIDS CONFIRME LOT]['+ sCodeArticle + '] - Type' , async () => {
                        const poidsTheoriqueValue = await pageAchAchFour.pPinputPoidsTheorique.inputValue();
                        const poidsTotal = await pageAchAchFour.pPinputPoidsTotal.isEnabled();
                        if (poidsTotal){

                            await fonction.sendKeys(pageAchAchFour.pPinputPoidsTotal,poidsTheoriqueValue);
                        } else {

                            log.set('Le poids du lot n\'est pas saisissable pour l\'article : ' +sCodeArticle);
                        }
                    });

                    test ('InputField [PRIX TRANSPORT]['+ sCodeArticle + '] = "'+ rPrixTransport +'"' , async () => {
                        const bPrixTransport = await pageAchAchFour.pPsaisieInputPrixTransport.isEnabled();
                        if (bPrixTransport){

                            await fonction.sendKeys(pageAchAchFour.pPsaisieInputPrixTransport, rPrixTransport);
                        } else {

                            log.set('Le prix du transport n\'est pas saisissable pour l`\'article : ' +sCodeArticle);
                        }
                    });

                    test ('Button [ENREGISTRER]['+ sCodeArticle + '] - Click', async () => {
                        await fonction.clickAndWait(pageAchAchFour.pPbuttonEnregistrerDeLot,page, 4000);
                        const isPresent = await pageAchAchFour.alertErreur.isVisible();
                        if(isPresent){

                            await fonction.clickAndWait(pageAchAchFour.pPbuttonAlertOuiNon.nth(0), page);
                        } else {

                            log.set('Conformité de prix de revient pour l\'article : ' +sCodeArticle);
                            log.separateur();
                        }
                    });
                });
            });

            test ('Button [CONFIRMER] - Click', async () => {
                await fonction.clickAndWait(pageAchAchFour.buttonConfirmerAchat,page);
            });

            test('Button [RETOUR A LA LISTE] - Click', async () => {
                await fonction.clickAndWait(pageAchAchFour.fAcheterbuttonRetourListe, page);
            });

            //Enregistrement des données pour le E2E
            await fonction.writeData(oData);
        })
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

    test ('Check Flux :',async ()=>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerLot_Stock",
                    STOP_ON_FAILURE  : true
                },
                
                {
                    "NOM_FLUX"  : "EnvoyerLot_Repart",
                    STOP_ON_FAILURE  : true
                }
            ],
            "WAIT_BEFORE"   : 3000,                 // Optionnel
        };
        await esb.checkFlux(oFlux,page);
    })
});