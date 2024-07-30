/**
 * 
 * @author Siaka KONE
 * @since 2024-01-12
 * 
 */

const xRefTest      = "PRE_ECL_FLS";
const xDescription  = "Préparer une feuille FL manuellement";
const xIdTest       =  60;
const xVersion      = '3.1';

var info = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }                    from '@playwright/test';
import { Help }                               from '@helpers/helpers.js';
import { TestFunctions }                      from '@helpers/functions.js';
import { Log }                                from '@helpers/log.js';

import { MenuPreparation }                    from '@pom/PRE/menu.page.js';
import { SuiviEclatfeuilleAPreparerPage }     from '@pom/PRE/eclatement-feuilles_a_preparer.page.js';
import { SuiviEclatfeuilleEnCoursPage }       from '@pom/PRE/eclatement-feuilles_en_cours.page.js';
import { SuiviEclatfeuillesPrepareesExpPage } from '@pom/PRE/eclatement-feuilles_preparees.page.js';
//------------------------------------------------------------------------------------
let page                                : Page;
let menu                                : MenuPreparation;
let pageSuiviEclatfeuilleAPreparer      : SuiviEclatfeuilleAPreparerPage;
let pageSuiviEclatfeuilleEnCours        : SuiviEclatfeuilleEnCoursPage;
let pageSuiviEclatfeuillesPrepareesExp  : SuiviEclatfeuillesPrepareesExpPage;

const log               = new Log();
const fonction          = new TestFunctions(log);
// Dates de début et de fin initiales
const dateDebut         = new Date(); // Heure courante
const dateFin           = new Date(); // Heure courante


// Soustraire une minute à la date de fin
const dateFinAjustee = new Date(dateFin.getTime() - 60000);

// Soustraire deux minutes à la date de fin
const dateDebutAjustee = new Date(dateDebut.getTime() - 120000);

//------------------------------------------------------------------------------------
var oData:any           = fonction.importJdd(); //Import du JDD pour le bout en bout
//------------------------------------------------------------------------------------
var sPlateforme       =  fonction.getInitParam('plateformeReception','Chaponnay');
 //------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page                               = await browser.newPage();
    menu                               = new MenuPreparation(page, fonction);
    pageSuiviEclatfeuilleAPreparer     = new SuiviEclatfeuilleAPreparerPage(page);
    pageSuiviEclatfeuilleEnCours       = new SuiviEclatfeuilleEnCoursPage(page);
    pageSuiviEclatfeuillesPrepareesExp = new SuiviEclatfeuillesPrepareesExpPage(page);
});

test.afterAll(async () => {
    await fonction.close();
});

test.describe('[' + xRefTest + ']' , () => {
    
    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    if(oData !== undefined) {                                  // On est dans le cadre d'un E2E. Récupération des données temporaires
       
        var aCodesArticles      = Object.keys(oData.aLots);  
        var aFeuilleE2E         = oData.aFeuille;       
        log.set('E2E - Liste des articles : ' + aCodesArticles);         
    }

    //------------------------------------------------------------------------------------
    test.describe('Page [SUIVI ECLATEMENT]', async () => {   
        
        var sNomPage = 'eclatement';
        test ('Page [SUIVI ECLATEMENT] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 
        
        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {    
            sPlateforme = sPlateforme.charAt(0).toUpperCase() + sPlateforme.slice(1).toLowerCase();
            if(sPlateforme === 'St-cyr-en-val'){// L'ecriture au niveau de la plateforme "St-cyr-en-val" a changé en "St cyr en val" donc on va adapter le script au changement.
                
                sPlateforme = sPlateforme.split('-');
                sPlateforme = sPlateforme.join(' ');
            }
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateforme);
        });

        aCodesArticles.forEach((sCodeArticle:string) => {

            test.describe('Onglet [FEUILLES A PREPARER][' + sCodeArticle + ']', async () => {   
        
                var sNomOnglet = 'feuilles à préparer'
                test('Onglet [' + sNomOnglet.toUpperCase() + '][' + sCodeArticle + '] - Click', async () => {
                    await menu.clickOnglet(sNomPage,'feuillesAPreparer', page);         
                });
    
                test('Input [NUMERO FEUILLE][' + sCodeArticle + '] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                    await fonction.sendKeys(pageSuiviEclatfeuilleAPreparer.inputSearchAll, aFeuilleE2E[sCodeArticle]);
                    await fonction.wait(page, 500);
                });

                test('Icon [PENCIL][' + sCodeArticle + '] - Modifier',  async () => {
                    await pageSuiviEclatfeuilleAPreparer.dataTableFeuillesAPrepareer.first().hover();
                    await fonction.clickAndWait(pageSuiviEclatfeuilleAPreparer.iconPencil.first(), page);
                });
    
                test.describe('Popup [MODIFICATION DE LA FEUILLE][' + sCodeArticle + ']', async () => {   
                
                    var sStatut = 'En cours';
                    test('ListBox [STATUT][' + sCodeArticle + '] = "' + sStatut + '"', async () => { 
                        await pageSuiviEclatfeuilleAPreparer.pListBoxStatut.selectOption({label:sStatut});
                    });

                    test('Input [DEBUT][HEURE][' + sCodeArticle + '] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                        await fonction.sendKeys(pageSuiviEclatfeuilleAPreparer.pInputHoraireDebHeure, fonction.addZero(dateDebutAjustee.getHours()));
                    });

                    test('Input [DEBUT][MINUTE][' + sCodeArticle + '] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                        await fonction.sendKeys(pageSuiviEclatfeuilleAPreparer.pInputHoraireDebMin, fonction.addZero(dateDebutAjustee.getMinutes()));
                    });

                    test('ListBox [PREPARATEUR][' + sCodeArticle + '][0] - Select', async () => { 
                        await pageSuiviEclatfeuilleAPreparer.pListBoxPreparateur.selectOption({index:1});
                    });

                    test('Button [VALIDER][' + sCodeArticle +']- Click', async () => {
                        await fonction.clickAndWait(pageSuiviEclatfeuilleAPreparer.pButtonValiderModif, page);
                    });
                });
            });

            test.describe('Onglet [FEUILLES EN COURS][' + sCodeArticle + ']', async () => {   
        
                var sNomOnglet = 'feuilles en cours'
                test('Onglet [' + sNomOnglet.toUpperCase() + '][' + sCodeArticle + '] - Click', async () => {
                    await fonction.wait(page, 500);
                    await menu.clickOnglet(sNomPage,'feuillesEnCours', page);         
                });
    
                test('Input [NUMERO FEUILLE][' + sCodeArticle + '] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                    await fonction.sendKeys(pageSuiviEclatfeuilleEnCours.inputSearchAll, aFeuilleE2E[sCodeArticle]);
                    await fonction.wait(page, 500);
                });

                test('Icon [PENCIL][' + sCodeArticle + '] - Modifier',  async () => {
                    await pageSuiviEclatfeuilleEnCours.dataTableFeuillesEnCours.first().hover();
                    await fonction.clickAndWait(pageSuiviEclatfeuilleEnCours.iconPencil, page);
                });
    
                test.describe('Pop Up [MODIFICATION DE LA FEUILLE][' + sCodeArticle + ']', async () => {   
                
                    var sStatut2 = 'Préparé';
                    test('ListBox [STATUT][' + sCodeArticle + '] = "' + sStatut2 + '"', async () => { 
                        await pageSuiviEclatfeuilleEnCours.pListBoxStatut.selectOption({label:sStatut2});
                    });

                    test('Input [FIN][HEURE][' + sCodeArticle + '] = "'+  fonction.addZero(dateFinAjustee.getHours()) + '"', async () => {
                        await fonction.sendKeys(pageSuiviEclatfeuilleEnCours.pInputHoraireFinHeure, fonction.addZero(dateFinAjustee.getHours()));
                    });

                    test('Input [FIN][MINUTE][' + sCodeArticle + '] = "'+ fonction.addZero(dateFinAjustee.getMinutes()) + '"', async () => {
                        await fonction.sendKeys(pageSuiviEclatfeuilleEnCours.pInputHoraireFinMin, fonction.addZero(dateFinAjustee.getMinutes()));
                    });

                    test('Input [EMPLACEMENT STOCK RESIDUEL][' + sCodeArticle + ']  = 1', async () => {
                        var bEnabled = await pageSuiviEclatfeuilleEnCours.pInputEmplaceStockResiduel.isEnabled();
                        if(bEnabled){
                        
                            await pageSuiviEclatfeuilleEnCours.pInputEmplaceStockResiduel.clear();
                            var oData = {
                                libelle         :'EMPLACEMENT STOCK RESIDUEL',
                                inputLocator    : pageSuiviEclatfeuilleEnCours.pInputEmplaceStockResiduel,
                                inputValue      : '10',
                                choiceSelector  :'li.gfit-autocomplete-result',
                                choicePosition  : 0,
                                typingDelay     : 100,
                                waitBefore      : 500,
                                page            : page,
                            };
                            await fonction.autoComplete(oData);
                    
                        }
                    });

                    test('Button [VALIDER][' + sCodeArticle +']- Click', async () => {
                        await fonction.clickAndWait(pageSuiviEclatfeuilleEnCours.pButtonValiderModif, page);
                    });
                });
            });

            test.describe('Onglet [FEUILLES PREPAREES][' + sCodeArticle + ']', async () => {   
        
                var sNomOnglet = 'feuilles préparées';
                test('Onglet [' + sNomOnglet.toUpperCase() + '][' + sCodeArticle + '] - Click', async () => {
                    await fonction.wait(page, 500);
                    await menu.clickOnglet(sNomPage,'feuillesPreparees', page);         
                });
    
                test('Input [NUMERO FEUILLE][' + sCodeArticle + '] = "'+  aFeuilleE2E[sCodeArticle] + '"', async () => {
                    await fonction.sendKeys(pageSuiviEclatfeuillesPrepareesExp.inputSearchAll, aFeuilleE2E[sCodeArticle]);
                    await fonction.wait(page, 500);
                });

                test('Icon [PENCIL][' + sCodeArticle + '] - Modifier',  async () => {
                    pageSuiviEclatfeuillesPrepareesExp.dataTableFeuillesPreparees.first().hover();
                    await fonction.clickAndWait(pageSuiviEclatfeuillesPrepareesExp.iconPencil.first(), page);
                });
    
                test.describe('Popup [MODIFICATION DE LA FEUILLE][' + sCodeArticle + ']', async () => {   

                    test('Button [VALIDER][' + sCodeArticle +']- Click', async () => {
                        var bEnabled = await pageSuiviEclatfeuilleEnCours.pInputEmplaceStockResiduel.isEnabled();
                        if(bEnabled){

                            await pageSuiviEclatfeuilleEnCours.pInputEmplaceStockResiduel.clear();
                            var oData = {
                                libelle         :'EMPLACEMENT STOCK RESIDUEL',
                                inputLocator    : pageSuiviEclatfeuilleEnCours.pInputEmplaceStockResiduel,
                                inputValue      : '10',
                                choiceSelector  :'li.gfit-autocomplete-result',
                                choicePosition  : 0,
                                typingDelay     : 100,
                                waitBefore      : 500,
                                page            : page,
                            };
                            await fonction.autoComplete(oData);
                        }
                        await fonction.clickAndWait(pageSuiviEclatfeuillesPrepareesExp.pButtonValiderModif, page);
                    });
                });
            });
        }); //-- End Describe Onglet  
    }); //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
});   