/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 20 - 11 - 2023
 * 
 */

const xRefTest      = "STO_REC_LIV";
const xDescription  = "Réceptionner une livraison pour un rayon/gpe article";
const xIdTest       =  4472;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateformeReception', 'search', 'groupeArticle', 'controlPoids'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}        from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from '@pom/STO/menu.page';
import { ReceptionAttendue }             from '@pom/STO/reception-attendue.page';
import { ReceptionTermine }              from '@pom/STO/reception-terminee.page';
import { CartoucheInfo } 	             from '@commun/types/index.js';
//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageRecepAttdu   : ReceptionAttendue;
let pageReceptermner : ReceptionTermine;

const log            = new Log();
const fonction       = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var oData:any        = fonction.importJdd();             // Récupération du JDD et des données du E2E en cours si ils existent

// Exploitation des paramètres passés dans le JDD E2E -OU- passés en argument -OU- ceux présents dans le fichier de configuration Local
var sInputSearch        = process.env.SEARCH || '';

const sPlateformeRecep  = process.env.PLATEFORMERECEPTION || 'Chaponnay'  
const sGpeArticle       = process.env.GROUPEARTICLE || 'Fruits et légumes';
const sCtrlpoids        = process.env.CONTROLPOIDS || 'non';      

//----------------------------------------------------------------------------------------

 // Relevé de température camion
 const iTempArr = 3;
 const iTempMil = 2;
 const iTempFon = 1;

 // Relevé de température produit
 const iTempPro = 4;


const sHeureDechargement  = fonction.getHeure();

// Création d'une référence de BL fictif pour faciliter sa tracibilité
var oMaDate     = new Date();
var sRefBL      = 'TA_BL- ' + fonction.getToday();
var sRefBL2     = 'TA_BL2- ' + fonction.getToday();
var aTraca2     = ['Coupe / Corner', 'IT - Coupe / Corner', 'Frais LS', 'Négoce', 'Traiteur de la mer', 'Boucherie', 'Charcuterie', 'Traiteur BC'];
//------------------------------------------------------------------------------------    

if (oData !== undefined) {                          // On est dans le cadre d'un E2E. Récupération des données temporaires
    sInputSearch = oData.sBonLivraison;              // L'élément recherché est le numéro de BL préalablement créé dans le E2E
    log.set('Numéro de BL : ' + sInputSearch);
    sRefBL = sInputSearch;                            // On connait le numéro de BL qui doit être suivi
}

// Initialisation de la tracabilité des articles = attribution d'un niveau de tracabilité par groupe article :
// * Pas de tracabilité     : IT - Frais LS, IT - Fraîche découpe, Fraîche découpe, Fruits et légumes, Consommable, Matériel informatique, Sac
// * 01                     : IT - Traiteur DM
// * 02                     : Coupe / Corner, IT - Coupe / Corner, Frais LS, Négoce, Traiteur de la mer, Boucherie, Charcuterie, Traiteur BC
// * 03                     : Marée
// * 04                     : IT - Négoce

log.set('Réception sans transit sur '+ sPlateformeRecep);
log.set('Groupe article = ' + sGpeArticle);

var iTraca = 0;
if(aTraca2.indexOf(sGpeArticle) != -1){
    iTraca = 2;
}else if (sGpeArticle ==  'Marée') {
    iTraca = 3;
} else if (sGpeArticle ==  'IT - Négoce') { 
    iTraca = 4;
}else if (sGpeArticle ==  'IT - Traiteur DM') { 
    iTraca = 1;
}else {
    log.set('Pas de tracabilité sur les articles');
}

var dtUnAn       = new Date(oMaDate.setDate(oMaDate.getDate() + 365));
var dtUnAnUnJour = new Date(oMaDate.setDate(oMaDate.getDate() + 366));
const dateDLC1   = fonction.addZero(dtUnAn.getDate()).toString() + fonction.addZero(dtUnAn.getMonth() + 1).toString() + dtUnAn.getFullYear().toString().slice(-2);
const dateDLC2   = fonction.addZero(dtUnAnUnJour.getDate()).toString() + fonction.addZero(dtUnAnUnJour.getMonth() + 1).toString() + dtUnAnUnJour.getFullYear().toString().slice(-2);
const iPoidsInit = 1;
var iPds         = 0;

//--------------------------------------------------------------------------------------------------------------

var setPoids = async (index:number, iPoids:number) => {       
        
    var enabled = await pageRecepAttdu.inputPoidsTotal.nth(index).isEnabled();
    if (enabled) {

        await fonction.sendKeys(pageRecepAttdu.inputPoidsTotal.nth(index), iPoids.toString());
        iPds = iPoids;
                                        
        for(let x = 0; x < 500; x++) {
            var alerte = await pageRecepAttdu.inputAlertPoids.isVisible();
            if (alerte === true) {
                iPoids = iPoids +10;
                await fonction.sendKeys(pageRecepAttdu.inputPoidsTotal.nth(index), iPoids.toString());                         
            }else {
                iPds = iPoids;
                break;
            }    
        }
        var description = await pageRecepAttdu.dataLibArticle.nth(index).textContent();
        log.set('Pour article ' + description + ' le poids saisi est : '+iPds +' kg');
    }
}

//-----------------------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage(); 

    menu                = new MenuStock(page, fonction);
    pageRecepAttdu      = new ReceptionAttendue(page);
    pageReceptermner    = new ReceptionTermine(page);
})

test.afterAll(async () => {
    await fonction.close();
})

//------------------------------------------------------------------------------------  

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [RECEPTION]', async () => {

        test('Page [RECEPTION] -Click', async () => {
            await menu.click('reception', page);
        })
        
        test.describe ('Onglet [LIVRAISONS ATTENDUES]', async () => {

            test('ListBox [PLATEFORME] = "' + sPlateformeRecep + '"', async () => {                    
                await menu.selectPlateforrme(page, sPlateformeRecep);
            })

            test('ListBox [ROUTAGE] = "Direct fournisseur"', async () =>{                                         // Cas sans transit, réception direct frn sur ptf distrib
                await fonction.listBoxByLabel(pageRecepAttdu.listBoxRoutage, 'Direct fournisseur', page);
            })

            test('CheckBox [AFFICHER TTES LES LIVRAISONS] - Click', async () =>{                
                await fonction.clickElement(pageRecepAttdu .checkBoxAffToutesLivr);
            })

            test('Sort [CONFIRMEE] - Click X 2', async () => {
                await fonction.clickElement(pageRecepAttdu.thConfirmee);
                await fonction.clickElement(pageRecepAttdu.thConfirmee);
            })

            if (sInputSearch != null) {                                                                          // Cas filtre sur un numero de BL (paramètre ou E2E), transporteur, N° achat ou fournisseur
                test('Input [SEARCH] = "'+  sInputSearch + '"', async () => {
                    await pageRecepAttdu.setSearch(sInputSearch);
                })
            }else{
                test('Input [SEARCH] = "'+  sInputSearch + '"', async () => {
                    await pageRecepAttdu.setSearch(sInputSearch);
                    log.set('Aucun indice de recherche de livraison fourni');
                    test.skip();
                })
            }

            test('CheckBox [LIVRAISONS ATTENDUES][0] - Click', async () => {
                await fonction.clickElement(pageRecepAttdu.listLivAttendues.first());
            })

            test('Button [RECEPTIONNER] - Visible', async () => {
                await fonction.isDisplayed(pageRecepAttdu.buttonReceptionner);
            })

            test('Button [RECEPTIONNER] - Click', async () => {
                await fonction.clickAndWait(pageRecepAttdu.buttonReceptionner, page);
            })

            test.describe('Popin [RECEPTION (ATTENDUE)]', async () => {

                test('Popin [RECEPTION (ATTENDUE)] - Is Visible', async () => {
                    await fonction.popinVisible(page, 'RECEPTION (ATTENDUE)', true);
                })

                test('Label[ERREUR] - Is NOT Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                })

                test('Button [TERMINER] - Click 1', async () => {                                                   // Check on ne peut pas terminer, il reste des champs obligatoires
                    await fonction.clickElement(pageRecepAttdu.buttonTerminer);
                })
                
                if (oData !== undefined) {                                                                          // On est dans le cadre d'un E2E. Le numéro de BL est celui du JDD
                    log.set('Numéro de BL : ' + sInputSearch);                                                      // Check le numéro de BL est déjà renseigné
                } else {                                                                          
                    test('InputField [REFERENCE BL] = "' + sRefBL + '"', async () => {                              // Numero de BL obligatoire
                        await pageRecepAttdu.setRefBL(sRefBL);
                        log.set('Numéro de BL : ' + sRefBL);
                    })
                }

                test('ListBox [QUAI AFFECTE][Rnd] - Select', async () => {
                    await pageRecepAttdu.selectQuaiAffecte();                                                       // Quai obligatoire
                }) 

                test('ListBox [RECEPTIONNAIRE 1][Rnd] - Select', async () => {
                    await pageRecepAttdu.selectReceptionnaire(pageRecepAttdu.pListBoxRecepReceptionnaire1, pageRecepAttdu.pListBoxItemReceptionnaire1);                                                           // Receptionnaire obligatoire
                })
                
                /** 
                 * 
                 * **************  PARTIE: Relevé de température ***************************
                 * 
                 * Nous avons pu remarquer que la popin "Reception attendu" contient les champs températures qui varient en fonction de la plaforme
                 * Alors nous allons adapter les tests à cette situation
                 * 
                */

                test('InputField [TEMPERATURE ARRIERE] = "' + iTempArr + '"', async () => {
                    if (await pageRecepAttdu.inputTempArriere.isVisible()){
                        await fonction.sendKeys(pageRecepAttdu.inputTempArriere, iTempArr);
                    }else{
                       log.set('InputField [TEMPERATURE ARRIERE] : INEXISTANT'); 
                       test.skip();
                    }                                                        
                })
                
                test('InputField [TEMPERATURE MILIEU] = "'+ iTempMil + '"', async () => {
                    if(await pageRecepAttdu.inputTempMilieu.isVisible()){
                        await fonction.sendKeys(pageRecepAttdu.inputTempMilieu, iTempMil);
                    }else{
                        log.set('InputField [TEMPERATURE MILIEU] : INEXISTANT'); 
                        test.skip();
                    }                                                           
                })

                test('InputField [TEMPERATURE FOND] = "' + iTempFon + '"', async () => {
                    if(await pageRecepAttdu.inputTempFond.isVisible()){
                        await fonction.sendKeys(pageRecepAttdu.inputTempFond, iTempMil);
                    }else{
                        log.set('InputField [TEMPERATURE FOND] : INEXISTANT'); 
                        test.skip();
                    }                                                           
                })

                test('Inpufield [TEMPERATURE PRODUIT] = "' + iTempPro + '"', async () => {
                    if(await pageRecepAttdu.inputTempProduit.isVisible()){
                        await fonction.sendKeys(pageRecepAttdu.inputTempProduit, iTempPro);
                    }else{
                        log.set('InputField [TEMPERATURE PRODUIT] : INEXISTANT'); 
                        test.skip();
                    }
                })
                // -------------------------------------------------------------------------------------------------------------

                test('Input [HEURE DE DECHARGEMENT]', async () => {
                    await fonction.sendKeys(pageRecepAttdu.pInputHeureDebutDechargement, sHeureDechargement); 
                }) 

                test.describe ('Partie [COMPTAGE PALETTES]', async () => {

                    test('Pictogramme [ + ] - Click', async () =>{
                        await fonction.clickElement(pageRecepAttdu.PictoPlusComptage);
                    })

                    test('InputFied [QUANTITE EMBALLAGE] = "1"', async () => {
                        await fonction.sendKeys(pageRecepAttdu.InputQuantiteEmballage.nth(0), '1');
                    })

                })

                test('Onglet [PALETTES FOURNISSEURS] - click', async () => {
                    await fonction.clickElement(pageRecepAttdu.ongletPalettesFourn);
                })

                test.describe ('Partie [SAISIE EN MASSE] ', async () => {

                    test('CheckBox [TOUTES LES LIV] - Click', async () => {
                        await fonction.clickElement(pageRecepAttdu.checkBoxAllRecep);
                    })
                    
                    test('InputField [EMPLACEMENT] - Set', async () => {                                            // Emplacements obligatoires
                        await pageRecepAttdu.setEmplacements();
                    })

                    test.describe ('Check [TRACABILITE][SET1] = 0'+ iTraca, async () => {

                        if (iTraca == 0) {                                                                          // Pas de tracabilité
                            test('Check [DLC] - non saisissable ', async () => {
                                expect(await pageRecepAttdu.inputDlcPasOblig.nth(0).isEnabled()).toBe(false);       // Check la DLC n'est pas obligatoire et non saisissable      
                            })

                            test('Check [LOT] - non saisissable ', async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(false);       // Check le lot n'est pas obligatoire et non saisissable     
                            })
                        } else if (iTraca == 1) {                                                                          // Niveau tracabilité = 01
                            test('Check [DLC] - non saisissable ', async () => {
                                expect(await pageRecepAttdu.inputDlcPasOblig.nth(0).isEnabled()).toBe(false);       // Check la DLC n'est pas obligatoire et non saisissable      
                            })

                            test('Check [LOT] - non saisissable ', async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(false);       // Check le lot n'est pas obligatoire et non saisissable     
                            })
                        } else if (iTraca == 2) {                                                                          // Niveau tracabilité = 02
                            test('InputField [DLC1] - obligatoire - Set = '+ dateDLC1, async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(true);           // Check la DLC est obligatoire et saisissable
                                await fonction.sendKeys(pageRecepAttdu.inputDlc, dateDLC1);
                            })

                            test('InputField [LOT1] - facultatif - Set = '+ sRefBL, async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(true);        // Check le lot n'est pas obligatoire mais saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotPasOblig, sRefBL);
                            })
                        } else  if (iTraca == 3) {                                                                          // Niveau tracabilité = 03
                            test('InputField [DLC1] - obligatoire - Set = '+ dateDLC1, async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(true);           // Check la DLC est obligatoire et saisissable
                                await fonction.sendKeys(pageRecepAttdu.inputDlc, dateDLC1);
                            })

                            test('InputField [LOT1] - facultatif - Set = '+ sRefBL, async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(true);        // Check le lot n'est pas obligatoire mais saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotPasOblig, sRefBL);
                            })
                        } else if (iTraca == 4) {                                                                          // Niveau tracabilité = 04
                            test('InputField [DLC1] - obligatoire - Set = '+ dateDLC1, async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(true);           // Check la DLC est obligatoire et saisissable
                                await fonction.sendKeys(pageRecepAttdu.inputDlc, dateDLC1);
                            })

                            test('InputField [LOT1] - obligatoire - Set = '+ sRefBL, async () => { 
                                expect(await pageRecepAttdu.inputLotOblig.nth(0).isEnabled()).toBe(true);           // Check le lot est obligatoire et saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotOblig, sRefBL);
                            })
                        }

                    })
                    
                    test('Button [AUTRE] - Click', async () => {
                        if (await pageRecepAttdu.buttonMasseAUTRE.isVisible()){
                            await fonction.clickElement(pageRecepAttdu.buttonMasseAUTRE);
                        } else {
                            test.skip();
                        }
                    })

                    test('Button [APPLIQUER A TOUS][SET1] - Click', async () => {
                        await fonction.clickElement(pageRecepAttdu.buttonAppliquerMasse);
                    })


                    test.describe ('Check [TRACABILITE][SET2] = 0'+ iTraca, async () => {
                        
                        if (iTraca == 2) {                                                                          // Niveau tracabilité = 02   
                            test('InputField [DLC2] - Set = '+ dateDLC2, async () => {                              // Check saisie possible d'une 2eme DLC
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(true);           // Check la 2eme DLC est saisissable
                                await fonction.sendKeys(pageRecepAttdu.inputDlc, dateDLC2);
                            }) 

                            test('InputField [LOT2] - facultatif - Set = '+ sRefBL2, async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(true);        // Check le 2eme lot n'est pas obligatoire mais saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotPasOblig, sRefBL2);
                            })
                        }

                        if (iTraca == 3) {                                                                          // Niveau tracabilité = 03
                            test('Check [DLC2] - non saisissable ', async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(false);          // Check la 2eme DLC est non saisissable
                            })

                            test('InputField [LOT2] - facultatif - Set = '+ sRefBL2, async () => { 
                                expect(await pageRecepAttdu.inputLotPasOblig.nth(0).isEnabled()).toBe(true);        // Check le 2eme lot n'est pas obligatoire mais saisissable 
                                await fonction.sendKeys(pageRecepAttdu.inputLotPasOblig, sRefBL2);
                            })
                        }

                        if (iTraca == 4) {                                                                          // Niveau tracabilité = 04
                            test('Check [DLC2] - non saisissable ', async () => {
                                expect(await pageRecepAttdu.inputDlcOblig.nth(0).isEnabled()).toBe(false);          // Check la 2eme DLC est non saisissable
                            })

                            test('Check [LOT2] - non saisissable ', async () => { 
                                expect(await pageRecepAttdu.inputLotOblig.nth(0).isEnabled()).toBe(false);          // Check le 2eme lot n'est pas saisissable 
                            })
                        } 
                    })
                    
                    if ((iTraca == 2) || (iTraca == 3)) { 
                        test('Button [APPLIQUER A TOUS][SET2] - Click', async () => {
                            await fonction.clickElement(pageRecepAttdu.buttonAppliquerMasse);
                        })
                    }

                    if ((sPlateformeRecep == 'Cremlog') ||  (sPlateformeRecep == 'Cremcentre')) {                   // Sur ces plateformes la saisie du poids est obligatoire (pour tous les groupes articles gérés par la plateforme)
                        log.set('Controle de la saisie des poids = ' + sCtrlpoids);
                        test.describe ('Check [POIDS][PLATEFORME] = '+ sPlateformeRecep, async () => {
                            if (sCtrlpoids == 'oui') {                                                              // Tous les articles à réceptionner sont gérés au poids

                                test('Check [POIDS][ALL] - obligatoire - Set pds mini ', async () => {              // Le poids est obligatoire pour tous les articles

                                    var elements = await pageRecepAttdu.inputPoidsTotal.count();
                                    for(let elt = 0; elt <elements; elt++){
                                        expect(await pageRecepAttdu.inputPoidsOblig.nth(elt).isVisible()).toBe(true);
                                        setPoids(elt, iPoidsInit);   
                                    }
                                })
                            }
                            else {                                                                                  // On ne sait pas quels articles sont gérés au poids
                                          
                                test('InputField [POIDS] - Set pds mini si obligatoire ', async () => {             // On saisit un poids dans les champs saisissables sans controle
                                    
                                    var elements = await pageRecepAttdu.inputPoidsTotal.count();
                                    for(let elt = 0; elt <elements; elt++){
                                        setPoids(elt, iPoidsInit);   
                                    }
                                })  
                            } 
                        })  
                    }
                })
               
                test('Button [TERMINER] - Click 2', async () => {
                    await fonction.clickAndWait(pageRecepAttdu.buttonTerminer, page);
                })

                test('Button [CONFIRMER TERMINER SANS ETIQUETTE] - Click', async () => {
                    await fonction.clickAndWait(pageRecepAttdu.buttonConfTerminer, page);
                })

                test('Popin [RECEPTION (ATTENDUE)] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, 'RECEPTION (ATTENDUE)', false);
                })

            }) // end describe Popin      

        }) // end describe Onglet


        test.describe ('Onglet [RECEPTIONS TERMINEES]', async () => {
            
            test('Onglet [RECEPTIONS TERMINEES] - Click', async () => {
                await pageRecepAttdu.clickOngletRecepTerminee();
            })
            
            test('InputField [REFERENCE BL] = "' + sRefBL + '"', async () => {
                await pageReceptermner.setRefBL(sRefBL);
            })

            test('DataGrid [NUMERO BL] = "' + sRefBL + '"', async () => {
                expect(await pageReceptermner.listBLResults.last().textContent()).toBe(sRefBL);
            }) 
            
        }) // end describe Onglet          

    }) // end describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})