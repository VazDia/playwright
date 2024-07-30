/**
 * @author  SIAKA KONE
 * @since   2023-12-14
 * 
 */
const xRefTest      = "STO_REC_FLF";  
const xDescription  = "Réceptionner une livraison fournisseur FL";
const xIdTest       =  1716;
const xVersion      = '3.1'; 
  
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],        
    params      : ['plateFormeReception','referenceBl','quantite', 'emplacement','numAchatCourt'],
    fileName    : __filename
}; 
   
//------------------------------------------------------------------------------------

import { test, type Page, expect }      from '@playwright/test';

import { Help }                         from '@helpers/helpers.js';
import { TestFunctions }                from '@helpers/functions.js';
import { Log }                          from '@helpers/log.js';
import { EsbFunctions }                 from '@helpers/esb.js';

import { MenuStock }                    from '@pom/STO/menu.page.js'; 
import { ReceptionLivraisonPartielle }  from '@pom/STO/reception-livraison_partielle.page.js';
import { ReceptionAttendue }            from '@pom/STO/reception-attendue.page.js';

import { CartoucheInfo, TypeEsb }       from '@commun/types';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuStock;
let pageReception         : ReceptionLivraisonPartielle;
let pageReceptionAttendue : ReceptionAttendue;
let esb                   : EsbFunctions;

const log                 = new Log();
const fonction            = new TestFunctions(log);

// Varibles ---------------------------------------------------------------------------

var oData:any             = fonction.importJdd();        // Récupération du JDD et des données du E2E en cours si ils existent

const sQuantite           = process.env.QUANTITE || '0';
const sEmplacement        = process.env.EMPLACEMENT || '0';
var   sNumeroAchatCourt   = process.env.NUMACHATCOURT || '7631';
var   sReferenceBl        = process.env.REFERENCEBL || 'TA_BL ' + fonction.getToday() + ' ' + fonction.getBadChars(); //'TA_BL ' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate()) + fonction.addZero(maDate.getSeconds());

var sPlateforme           = fonction.getInitParam('plateformeReception', 'Chaponnay');
//------------------------------------------------------------------------------------

const sDateDlc            = fonction.getDLC();
const sTemperatureArriere = '10';
const sTemperatureMilieu  = '9';
const sTemperatureFond    = '8';
const sStatut             = 'Complète';
const sLotFournisseur     = '10';

//------------------------------------------------------------------------------------    

if (oData !== undefined) {                              // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sNumAchatE2E      = oData.sNumAchatLong;           // L'élément recherché est le numéro d'achat préalablement créé dans le E2E
    sNumeroAchatCourt     = sNumAchatE2E.substr(11);    // Supprimer Les 11 premiers caractères pour n'avoir que le numero court de l'achat     
    sReferenceBl          = 'TA_BL_' +  sNumAchatE2E;  
    oData.sBonLivraison   = sReferenceBl;         
    log.set('E2E - Numéro achat : ' + sNumAchatE2E);  
}

//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
     page                   = await browser.newPage();
     menu                   = new MenuStock(page, fonction);
     pageReception          = new ReceptionLivraisonPartielle(page); 
     pageReceptionAttendue  = new ReceptionAttendue(page);
     esb                    = new EsbFunctions(fonction);
});

test.afterAll(async () => {
     await fonction.close();
});
  
//------------------------------------------------------------------------------------
test.describe ('[' + xRefTest + ']', async () => {  
    
    test('- Start -', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo);
        await helper.init();
    });

    test('Ouverture URL', async () => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [RECEPTION]', async () => {

        var sNomPage = 'reception';
        test ('Page [RECEPTION] - Click', async () => {
            await menu.click(sNomPage, page);
        });

        test.describe('Onglet [LIVRAISONS ATTENDUES]', async () => {

            sPlateforme = sPlateforme.charAt(0).toUpperCase() + sPlateforme.slice(1).toLowerCase();
            test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {                    
                await menu.selectPlateforrme(page, sPlateforme);
            });
            
            test('Input [NUMERO D\'ACHAT] [RECHERCHER] = "' + sNumeroAchatCourt + '"', async () => {
                if(sNumeroAchatCourt){
                    await fonction.sendKeys(pageReception.inputNumeroAchat, sNumeroAchatCourt);
                    await fonction.wait(page, 500);
                }
            });

            test('Tr [LIVRAISON ATTENDUE] - Select', async () => {
                var colonneNumAchat = pageReception.dataGridReception.locator('td.datagrid-numerosAchat').filter({hasText:sNumeroAchatCourt});
                await fonction.clickElement(colonneNumAchat);
            });

            test('Button [RECEPTIONNER] - Click', async () => {
                await fonction.clickAndWait(pageReception.buttonReceptionner, page);
            });


            test.describe('Popin [RECEPTION ATTENDUE]', () => {

                test('Button [TERMINER] - Click', async () => {
                    await fonction.clickAndWait(pageReception.pButtonTerminer, page);
                });
                
                test.describe('Onglet [INFORMATIONS GENERALES]', async () => {
                    
                    test('ListBox [QUAI AFFECTE] - click', async () => { 
                        await fonction.clickElement(pageReception.pListBoxQuaiAffecte);
                        await pageReception.pListBoxItemQuaiAffecte.first().click();
                    });

                    test('ListBox [RECEPTIONNAIRE 1] - click', async () => {  
                        await fonction.clickElement(pageReception.pListBoxReceptionnaire1);
                        await pageReception.pListBoxItemReceptionnaire1.click();                       
                    });

                    test('Input [REFERENCE BL] = "' + sReferenceBl + '"', async () => {
                        await fonction.sendKeys(pageReception.pInputReferenceBl, sReferenceBl); 
                        log.set('Reference BL : ' + sReferenceBl);  
                    });
                
                    test('Input [RELEVE DE TEMPERATURE ARRIERE] = "' + sTemperatureArriere + '"', async () => {
                       await fonction.sendKeys(pageReceptionAttendue.inputTempArriere,sTemperatureArriere);
                    });

                    test('Input [RELEVE DE TEMPERATURE MILIEU] = "' + sTemperatureMilieu + '"', async () => {
                        await fonction.sendKeys(pageReceptionAttendue.inputTempMilieu,sTemperatureMilieu);
                    });

                    test('Input [RELEVE DE TEMPERATURE FOND] = "' + sTemperatureFond + '"', async () => {
                        await fonction.sendKeys(pageReceptionAttendue.inputTempFond,sTemperatureFond);
                    });

                    test('Input [COMPTAGE PALETTES] [QUANTITE] = "'+ sQuantite + '"', async () => { 
                        await fonction.sendKeys(pageReception.pInputQuantite.first(), sQuantite); 
                    });
                })
    
                test.describe ('Onglet [PALETTES FOURNISSEURS]', async () => { 
                                            
                    test('TabView [PALETTES FOURNISSEURS] - Click', async () => {  
                        await fonction.clickAndWait(pageReception.pOngletPaletteFournisseur.nth(1), page);
                    });
    
                    test('CheckBox [TOUT][SAISIE EN MAX] - Click', async () => {                                 
                        await fonction.clickElement(pageReception.pCheckBoxSaisieEnMax);
                    });
    
                    test('Input [DLC] = "' + sDateDlc + '"' , async () => {
                        const isActive = await pageReception.pInputDLC.isEnabled();
                        if(isActive){
                            await fonction.sendKeys(pageReception.pInputDLC, sDateDlc);
                        } else {
                            log.set('Pas de DLC à saisir');
                            test.skip();
                        }
                    });

                    test('Input [LOT FOURNISSEUR] = "' + sLotFournisseur + '"' , async () => {
                        const isActive = await pageReception.pInputLotFournisseur.isEnabled();
                        if(isActive){
                            await fonction.sendKeys(pageReception.pInputLotFournisseur, sLotFournisseur);
                        } else {
                            log.set('Pas de Lot fournisseur à saisir');
                            test.skip();
                        }
                    });

                    test('Input [EMPLACEMENT] = "' + sEmplacement + '"' , async () => { 
                        await fonction.sendKeys(pageReception.pInputEmplacementGlobal, sEmplacement);
                        await fonction.clickElement(pageReception.pInputItemEmplacementGlobal); 
                    });

                    test('Button [APPLIQUER] - Click', async () => {  
                        await fonction.clickElement(pageReception.pButtonAppliquer); 
                    });
                });
    
                test.describe('TERMINER', () => {

                    test('Button [TERMINER] - Click', async () => {
                        await fonction.clickElement(pageReception.pButtonTerminer);
                    });

                    test('Button [TERMINER LA RECEPTION] - Click', async () => {
                        await pageReception.pPopupTerminerReception.waitFor({state:'visible'}); // Attendez que l'élément soit visible
                        if(pageReception.pPopupTerminerReception != undefined){
                            await fonction.clickAndWait(pageReceptionAttendue.pButtonTerminer, page);
                        }
                    });
                });
            });
        })
 
        test.describe('Onglet [RECEPTIONS TERMINEES]', async () => {

            test('TabView [RECEPTIONS TERMINEES] - Click ', async () => { 
                await fonction.clickAndWait(pageReception.ongletReceptionTerminer, page);
            });

            test('Input [NUMERO D\'ACHAT] [RECHERCHER] = "'+ sNumeroAchatCourt + '"', async () => {
                if(sNumeroAchatCourt){
                    await fonction.sendKeys(pageReception.inputNumeroAchatReceptionTerminees, sNumeroAchatCourt);
                    await fonction.wait(page, 500);
                }
            });

            test('Tr [LIVRAISON] - Select', async () => {
                await fonction.clickElement(pageReception.dataGridReception);
            });

            test('Td [STATUT][RECEPTION ACHAT] [TERMINE] - Check', async () => {
                const statut = await pageReception.spanStatutReceptionAchat.textContent();
                expect(statut).toContain(sStatut);
            });
        });

        //Enregistrement des données pour le E2E
        fonction.writeData(oData);
    });

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
    
    test('Check Flux :',async ()=>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerLot_Repart",
                    STOP_ON_FAILURE  : true
                }
            ],
            "WAIT_BEFORE"   : 3000,                 // Optionnel
        };
        
        await esb.checkFlux(oFlux,page);
    });
}) 