/**
 * @author Vazoumana DIARRASSOUBA
 * @since   2024-05-06
 * 
 */
const xRefTest      = "ACH_CRD_ENG";
const xDescription  = "Enregistrer un achat BCT / Saprimex (CrossDock)";
const xIdTest       =  5164;
const xVersion      = '3.0';
 
var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : ['dossierAchat', 'plateforme'],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';
import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';
import { EsbFunctions }     from '@helpers/esb';
//-- PageObject ----------------------------------------------------------------------

import { MenuAchats }      from '@pom/ACH/menu.page'; 
import { PageAchat }       from '@pom/ACH/achats.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuAchats;
let pageAchat             : PageAchat;

const log                 = new Log();
const fonction            = new TestFunctions(log);
const esb                 = new EsbFunctions(fonction);
//------------------------------------------------------------------------------------

const sDossierAchat       = fonction.getInitParam('dossierAchat', 'Bcv - joubard julien'); 
const sPlateforme         = fonction.getInitParam('plateforme', 'Cremlog'); 
const sFournisseur        = 'Sas Les Ateliers Ⓔ';

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                 = await browser.newPage();
    menu                 = new MenuAchats(page, fonction);
    pageAchat            = new PageAchat(page); 
});

test.afterAll(async () => {
    await fonction.close();
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {  
    
    test('- Start -', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async () => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })
   
    test.describe('Page [ACHATS]', function() {

        test ('ListBox [RAYON] = "BCT"', async() => {
            await menu.selectRayonByName('BCT', page);
        })
 
        test('Page [ACHATS] - Click', async () => {
            await menu.click('achats', page);
        })

        test('Label [ERREUR 1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })        

        test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async () => {
            await fonction.listBoxByLabel(pageAchat.listBoxDossierAchatCal,   sDossierAchat, page);
        })

        test('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async () => {
            await fonction.clickElement(pageAchat.tdListPlateformes.filter({hasText: sPlateforme}), page);
        })

        test('Pictogram [BASCULER CROSSDOCKING] - Click', async () => {
            test.setTimeout(90000);
            await pageAchat.tdListPlateformes.filter({hasText: sPlateforme}).hover({timeout:3000});
            await fonction.clickElement(pageAchat.pictoBasculerCrossDock, page);
        })

        test('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async () => {
            test.setTimeout(90000);
            var spinner = page.locator('.progressRingCentre img');
            await pageAchat.tdListFournisseurs.last().waitFor({state:'visible'})
            await fonction.clickAndWait(pageAchat.tdListFournisseurs.filter({hasText: sFournisseur}), page);
            expect(spinner).not.toBeVisible({timeout:90000});
        })

        test('Button [ENREGISTRER] - Click', async () => {
            var iNbChamps = await pageAchat.inputAAcheter.count();
            log.set('Nombre d\'articles : ' + iNbChamps);

            await fonction.clickAndWait(pageAchat.buttonEnregistrer, page);
        })

        test('Label [ERREUR 2] - Is Not Visible', async () => {   // Pas d'erreur affichée à la fin de l'action
            await fonction.isErrorDisplayed(false, page);
        })                            
    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})