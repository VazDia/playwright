/**
 * 
 * @desc Modification d'un bon de restitution des emballages
 * 
 * @author JC CALVIERA
 *  Since 2024-01-16
 */

const xRefTest      = "STO_EMB_MBR";
const xDescription  = "Modification d'un bon de restitution des emballages";
const xIdTest       =  1563;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from "../../utils/functions";
import { Log }                      from "../../utils/log";
import { Help }                     from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "../../pages/STO/menu.page";
import { EmballageRestitution }     from '../../pages/STO/emballage-restitution.page';

//----------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuStock;
let pageEmballage   : EmballageRestitution;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate          = new Date();

const sCommentaire  = 'TEST-AUTO_Observation-' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) +  fonction.addZero(maDate.getDate()) + '_' +  fonction.addZero(maDate.getHours()) +  fonction.addZero(maDate.getMinutes())  + ' Modifié';
const sChauffeur    = 'TEST-AUTO_Nom Chauffeur Modifié';
const sTransporteur = 'TEST-AUTO_Nom Transporteur Modifié';
const sChargeur     = 'TEST-AUTO_Nom Chargeur Modifié';
const sHeureStart   = '00:08';
const sHeureEnd     = fonction.addZero(maDate.getHours()) + ":" + fonction.addZero(maDate.getMinutes());    
const sNumCommande  = 'TA-Num Cmde ' + maDate.getFullYear() + fonction.addZero(maDate.getMonth() + 1) +  fonction.addZero(maDate.getDate());
const iNbEmballage  = 9;

const sPlateforme   = process.env.PLATEFORME || 'Chaponnay';

//------------------------------------------------------------------------------------   

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 

    menu            = new MenuStock(page, fonction);
    pageEmballage   = new EmballageRestitution(page);
})

test.afterAll(async () => {
    await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {            
        await menu.selectPlateforrme(page, sPlateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [EMBALLAGE]', async () =>  {  

        var currentPage = 'emballage';

        test('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe('Onglet [LIVRAISON]', async () =>  {        
            
            test('Onglet [LIVRAISON] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'livraison', page);                                         
            })   
      
            test('Toggle Button [ANNULE] - Click', async () =>  {
                await fonction.clickAndWait(pageEmballage.toggleAnnule, page, 40000);
                await fonction.wait(page, 500);         // Attente mise à jour contenu page coté client
            })

            test('Row [NUMERO DE COMMANDE][' + sNumCommande + '] - Click', async () =>  {
                await pageEmballage.tdNumCommande.filter({hasText:sNumCommande}).nth(0).click();
            })

            test('Button [MODIFIER UN BL] - Click', async () =>  {
                await fonction.clickAndWait(pageEmballage.buttonModifierUnBL, page);
            })

            var sNomPopin   = "Modification d'un bon de restitution";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })   

                test('InputField [CHAUFFEUR] = "' + sChauffeur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputChauffeurRestitut, sChauffeur);
                })

                test('InputField [TRANSPORTEUR] = "' + sTransporteur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputTransporteurRestitut, sTransporteur);
                })

                test('InputField [CHARGEUR] = "' + sChargeur + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputChargeurRestitut, sChargeur);
                })

                test('InputField [HEURE ARRIVEE] = "' + sHeureStart + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputHeureStartRestitut, sHeureStart, false);
                })

                test('InputField [HEURE DEPART] = "' + sHeureEnd + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPinputHeureEndRestitut, sHeureEnd, false);
                })

                test('InputField [OBSERVATIONS] = "' + sCommentaire + '"', async () => {
                    await fonction.sendKeys(pageEmballage.pPtextAreaObsRestitut, sCommentaire);
                })

                test('InputField [QUANTITE EMBALLAGE] = "' + iNbEmballage + '"', async () => {
                    var iNbTypesEmballages = await pageEmballage.pPinputQantitesRestitut.count(); 
                    var rnd = Math.floor(fonction.random() * iNbTypesEmballages - 1);
                    var sTypeEmballage = await pageEmballage.pPlabelTypeEmbRestitut.nth(rnd).textContent();
                    log.set('Emballage : ' + sTypeEmballage + ' | Quantité : ' + iNbEmballage);
                    await fonction.sendKeys(pageEmballage.pPinputQantitesRestitut.nth(rnd), iNbEmballage);
                })

                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.noHtmlInNewTab(page, pageEmballage.pPbuttonEnregistrerRestitut);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is NOT Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                }) 

            })

        })  //-- End Describe Onglet  

    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})