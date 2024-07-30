/**
 * 
 * @author JOSIAS SIE
 * @since 2023-11-23
 *  
 */
const xRefTest      = "SOC_SCT_LIE";
const xDescription  = "Créer une société en lien avec un lieu de vente";
const xIdTest       = 5000;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'SOCIETES',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['raisonSociale','formeJuridique','designation'],
    fileName    : __filename
}

//------------------------------------------------------------------------------------

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log.js';

import { MenuSociete }                      from '@pom/SOC/menu.page.js';
import { PageSocietes }                     from '@pom/SOC/societes.page.js';

import { AutoComplete, CartoucheInfo }      from '@commun/types/index';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuSociete;

let pageSociete         : PageSocietes;

const log               = new Log();
const fonction          = new TestFunctions(log);
//------------------------------------------------------------------------------------ 

fonction.importJdd();
var data:any        = fonction.importJdd();

var sRaisonSociale  =  fonction.getInitParam('raisonSociale', '');
var sFormeJuridique =  fonction.getInitParam('formeJuridique', 'Société En Nom Collectif'); 
var sLieuDeVente    =  fonction.getInitParam('designation', 'TA_lieuDeVente'); 
sRaisonSociale      =  sRaisonSociale ? sRaisonSociale : 'TA_societe. ' + fonction.getToday('FR')+' '+fonction.getHMS(':');

var oData = {
    sRaisonSociale  : '',
    sDesignation    : ''
}

//------------------------------------------------------------------------------------    

if (data !== undefined) {                      // On est dans le cadre d'un E2E. Récupération des données temporaires
    var sDesignationE2E  = data.sDesignation;  // L'élément recherché est la désignation du lieu de vente préalablement créé dans le E2E
    sLieuDeVente         = sDesignationE2E;    // Récupération de la désignation du lieu de vente 
    log.set('E2E - Désignation : ' + sDesignationE2E);             
}

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuSociete(page, fonction);    
    pageSociete         = new PageSocietes(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async({}) => {
	await fonction.close();
})

//------------------------------------------------------------------------------------
test.describe.serial ('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async() => {
        await fonction.connexion(page);
    })

    test('P-dialog [ALERT][ERREUR][PAGE] - Check', async () => {
        await fonction.isErrorDisplayed(false, page);                     // Pas d'erreur affichée à priori au chargement de la page 
    })

    test.describe('Page [ORGANISATION]', async () => {    

        var pageName = 'societes';

        test("Menu [LIEUX] - Click ", async() => {
            await menu.click(pageName, page);
        })

        test('P-dialog [ALER ERREUR][PAGE SOCIETES] - Check', async () => {
            await fonction.isErrorDisplayed(false, page);                 // Pas d'erreur affichée à priori au chargement de la page
        }) 

        test ('Button [CREER UNE SOCIETE] - Click', async () => {
            await fonction.clickAndWait(pageSociete.buttonCreerSociete, page);
        })

        var sNomPopin = "Création d'une société";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

            test ('Input [RAISON SOCIALE]', async () => {
                await fonction.sendKeys(pageSociete.pPcreateInputRaisonSoc, sRaisonSociale);
                oData.sRaisonSociale = sRaisonSociale;
            })

            test('InputField [DESIGNATION LIEU DE VENTE] ['+ sLieuDeVente +']', async () => {
                var oDataLV:AutoComplete = {
                    libelle         :'LIEU DE VENTE',
                    inputLocator    : pageSociete.pPcreateAutoCompDesiLDV.locator('input').first(),
                    inputValue      : sLieuDeVente,
                    choiceSelector  : 'ngb-typeahead-window button',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page
                }

                await fonction.autoComplete(oDataLV);
                oData.sDesignation = sLieuDeVente;
            })

            test ('ListBox [FORME JURIDIQUE] - Click', async () => {
                await fonction.clickAndWait(pageSociete.pPcreateListBoxFormJuri, page);
            })

            test ('ListBoxItem [FORME JURIDIQUE] - Select', async () => {
                await fonction.clickElement(pageSociete.pPcreateListBoxItem.locator('li[aria-label="'+sFormeJuridique+'"]'));
            })

            test('Button [ENREGISTRER] - Click', async () => {
                await fonction.clickElement(pageSociete.pPcreateBtnEnregistrer);
            })

            test ('Button [ALERT] [BUTTON][0] - Click', async () => {
                await fonction.clickElement(pageSociete.pPcreateButtonAlert.nth(0));
            })
        
            test.describe ('Datagrid [SOCIETE]', async () => {

                test ('Input [FILTRE][LIEU DE VENTE] ['+ sLieuDeVente +']', async () => {
                    await fonction.wait(page, 350);
                    await fonction.sendKeys(pageSociete.tableInputFiltre.nth(2), sLieuDeVente);
                })

                test ('Input [FILTRE][RAISON SOCIALE]', async () => {
                    await fonction.wait(page, 350);
                    await fonction.sendKeys(pageSociete.tableInputFiltre.nth(3), sRaisonSociale); 
                })

                test ('Td [LIEU DE VENTE][RAISON SOCIALE] - Check', async () => {
                    await fonction.wait(page, 450);
                    var designation   = await pageSociete.dataTdLieuVenteRaisonSociale.nth(0).textContent();
                    expect(designation).toEqual(sLieuDeVente);

                    var raisonSociale = await pageSociete.dataTdLieuVenteRaisonSociale.nth(1).textContent();
                    expect(raisonSociale).toEqual(sRaisonSociale);
                })
            })
        })
        await fonction.writeData(oData);
    })   //-- End test.describe Page

    test('Déconnexion', async() => {
        // Si on est dans le cadre d'un E2E, sauvegarde des données pour le scénario suivant
        await fonction.deconnexion(page);
    })

})  //-- End test.describe