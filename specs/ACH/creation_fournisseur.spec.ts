/**
 * 
 * @author JOSIAS SIE
 * @description Création d'un Fournisseur et transmission des données vers MAG / REP / PRE / STO / X3
 * 
 */
const xRefTest      = "ACH_FOU_ADD";
const xDescription  = "Création d'un Fournisseur";
const xIdTest       =  246;
const xVersion      = "3.0";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['user'],
    fileName    : __filename
};

import { test, type Page, expect}		from '@playwright/test';

import { Help }                         from '@helpers/helpers.js';
import { TestFunctions }                from '@helpers/functions.js';
import { EsbFunctions }                 from '@helpers/esb.js';
import { Log }                          from '@helpers/log';

import { MenuAchats }                   from '@pom/ACH/menu.page.js';
import { PageRefFou }                   from '@pom/ACH/referentiel_fournisseurs.page.js';

import { CartoucheInfo, TypeEsb } 		from '@commun/types';


//------------------------------------------------------------------------------------

let page                : Page;
 
var pageReferentielFour : PageRefFou;
var menu                : MenuAchats;
let esb                 : EsbFunctions;

const log               = new Log;
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------
var maDate:any          = new Date();

//------------------------------------------------------------------------------------

const sUser             = fonction.getInitParam('user', 'lunettes');  
const nomFourn          = 'TEST-AUTO_Fournisseur-' + maDate.getYear() + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate());
const adresseFourn      = 'TA-ADRESSE ' + maDate.getYear() + ' ' + fonction.addZero(maDate.getMonth() + 1) + ' ' + fonction.addZero(maDate.getDate());
const cpFourn           = '12345';
const emailFourn        = 'test.auto@fournisseur.com';
const telFourn          = '0' + maDate.getYear() + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate()) + '00';
const faxFourn          = '0' + maDate.getYear() + fonction.addZero(maDate.getMonth() + 1) + fonction.addZero(maDate.getDate()) + '99';
//const codeFourn     = maDate.getFullYear() + Test.addZero(maDate.getMonth() + 1) + Test.addZero(maDate.getDate()) + Test.addZero(maDate.getSeconds());
const villeFourn        = 'Brive la Gaillarde';
const paysFourn         = 'France';
const comFourn          = 'TEST-AUTO_commentaire % < é \' #';
const compFourn         = 'Rue de l\'Industrie';
const regimeFourn       = 'France';
const langueFourn       = 'Français';
//const ediFourn        = 'EDI123456';    
const tvaIntFourn       = 'FR 5824 220 188 53';
const sirenFourn        = '422018853';    
const centraleAchat     = 'Prosol Gestion';  //Prosol SAS -> Fruits et légumes  
const introMarchandse   = 'France';
const collectif         = 'HorsGroupe';

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);    
    pageReferentielFour = new PageRefFou(page);
    esb                 = new EsbFunctions(fonction);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async() => {
    await fonction.close();
})
 
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [REFERENTIEL]', () => {

       var pageName    = 'referentiel';

       test("Menu [REFERENTIEL] - Click ", async () => {
           await menu.click(pageName, page);
       })

       test.describe ('Onglet [FOURNISSEURS]', () => {

            test ('Onglet [FOURNISSEURS] - Click', async () => {
                //if (fonction.getLogin() == "lunettes") {
                   await menu.clickOnglet(pageName, 'fournisseurs',page);
                //}
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page); // Par défaut, aucune erreur remontée au chargement de l'onglet
            })

            test ('Button [CREER] - Click', async () => {
                await fonction.clickElement(pageReferentielFour.buttonCreer);
            })

            test.describe ('Popin [CREATION D\'UN FOURNISSEUR]', () => {
                
                //-- Une popover intitulé Création d'un fournisseur  
                test('Popin [CREATION D\'UN FOURNISSEUR][0] - Check', async () =>  {
                    await fonction.popinVisible(page, 'CREATION D\'UN FOURNISSEUR', true);
                })

                //-- Je ne peux pas enregistrer (car les informations obligatoires ne sont pas saisies)
                test('Button [ENREGISTRER] - Is NOT Enabled', async () =>  {
                    await expect(pageReferentielFour.pButtonEnregistrerFourn).toBeDisabled();
                })

                //-- Le bouton Actif est sélectionné par défaut
                test('Toggle Button [ACTIF] - Is Checked', async () =>  {
                    await expect(pageReferentielFour.pToggleActif).toHaveClass('.p-inputswitch-checked');
                })


                /*
                test.describe ('Div [INFORMATIONS GENERALES]', async () => {
                    test('Input [NOM DE LA SOCIETE] = ' + nomFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputNomSocieteFourn, nomFourn);
                    })

                    test('Input [ADRESSE FOURNISSEUR] = ' + adresseFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputAdresseFourn, adresseFourn);
                    })

                    test('Input [COMPLEMENT D\'ADRESSE] = ' + compFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputComplementFourn, compFourn);
                    })

                    test('Input [CODE POSTAL FOURNISSEUR] = ' + cpFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputCodePostalFourn, cpFourn);
                    })

                    test('Input [COMMUNE] = ' + villeFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputVilleFourn, villeFourn);
                    })

                    test ('ListBox [PAYS] = "' + paysFourn + '"', async () => {        
                        await fonction.clickAndWait(pageReferentielFour.plistBoxPaysFourn, page); 
                        await pageReferentielFour.plistBoxItem.filter({hasText: paysFourn}).nth(0).click();              
                    });

                     test ('TextArea [COMMENTAIRE] = "' + comFourn + '"', async () => {
                        await fonction.sendKeys(pageReferentielFour.pTextAreaComFourn, comFourn);
                    })

                    test('Input [EMAIL] = ' + emailFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputEmailFourn, emailFourn);
                    })

                    test('Input [TELEPHONE FOURNISSEUR] = ' + telFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputTelFourn, telFourn);
                    })

                    test('Input [FAX] = ' + faxFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputFaxFourn, faxFourn);
                    })

                    test ('ListBox [LANGUE] = "' + langueFourn + '"', async () => {          
                        await fonction.clickAndWait(pageReferentielFour.pListBoxLangueFourn, page); 
                        await pageReferentielFour.plistBoxItem.filter({hasText: langueFourn}).nth(0).click();                
                    });
                })

                test.describe ('Div [CARACTERISTIQUES COMPTABLES]', async () => {

                    test ('ListBox [CENTRALE D\'ACHAT] = "' + centraleAchat + '"', async () => {          
                        await fonction.clickAndWait(pageReferentielFour.pListBoxCentraleAchat, page); 
                        await pageReferentielFour.plistBoxItem.filter({hasText: centraleAchat}).nth(0).click();                  
                    }); 

                    test('ListBox[INTRODUCTION MARCHANDISE] = ' + introMarchandse, async () =>  {
                        await fonction.clickAndWait(pageReferentielFour.pListBoxMarchandiseFourn, page);
                        await pageReferentielFour.plistBoxItem.filter({hasText: introMarchandse}).nth(0).click(); 
                    })

                    test('ListBox [COLLECTIF] = ' + collectif, async () =>  {//HorsGroupe
                        await fonction.clickAndWait(pageReferentielFour.pListBoxCollectifFourn, page);
                        await pageReferentielFour.plistBoxItem.filter({hasText: collectif}).nth(0).click();
                    })

                    test('Input [TVA INTRACOMMUNAUTAIRE] = ' + tvaIntFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputTvaIntraFourn, tvaIntFourn); 
                    })

                    test ('ListBox [REGIME TVA] = "' + regimeFourn + '"', async () => {        
                        await fonction.clickAndWait(pageReferentielFour.pListBoxRegimeTvaFourn, page); 
                        await pageReferentielFour.plistBoxItem.filter({hasText: regimeFourn}).nth(0).click();               
                    });

                    test('ListBox [DEVISE DE PAIEMENT] = ' + sirenFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputSirenFourn, sirenFourn);
                    })

                    test('Input [SIREN] = ' + sirenFourn, async () =>  {
                        await fonction.sendKeys(pageReferentielFour.pInputSirenFourn, sirenFourn);
                    })
                })

                test.describe ('Div [CARACTERISTIQUES COMMERCIALES]', async () => {
                    test ('ListBox [TYPOLOGIE] = "' + centraleAchat + '"', async () => {          
                        await pageReferentielFour.plistBoxTypologieFourn.selectOption({label: centraleAchat});                
                    }); 
                })

                test ('Button [CREER] - Click', async () => {
                   await fonction.clickElement(pageReferentielFour.pButtonCreerFourn);
                })

                test('Popin [CREATION D\'UN FOURNISSEUR][1] - Check', async () =>  {
                  await fonction.popinVisible(page, 'CREATION D\'UN FOURNISSEUR', false);
                })
                */

            })

       })  // End Describe Onglet

    })  // End describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test('** CHECK FLUX **', async () => {

        if (sUser) {
            var oFlux:TypeEsb = { 
               "FLUX" : [
                   {
                       "NOM_FLUX" : "EnvoyerFournisseur_Prepa",
                   },
                   {
                       "NOM_FLUX" : "EnvoyerFournisseur_Stock",
                   },
                   {
                       "NOM_FLUX" : "EnvoyerFournisseur_Repart",
                   },
                   {
                       "NOM_FLUX" : "EnvoyerFournisseur_X3",
                   },
                   {
                       "NOM_FLUX" : "EnvoyerFournisseur_Mag",
                   }   
                ],
               "WAIT_BEFORE"      : 5000,               
            };

            await esb.checkFlux(oFlux, page);
        } else {
            test.skip();
        }
        
    })

})  // End describe