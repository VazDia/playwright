/**
 * @author Vazoumana DIARRASSOUBA
 * @desc Acheter & Confirmer un achat BCT / Saprimex (CrossDock)
 * @since 2024-07-24
 * 
 */
const xRefTest      = "ACH_CRD_AEC";
const xDescription  = "Acheter & Confirmer un achat BCT / Saprimex (CrossDock)";
const xIdTest       =  5165;
const xVersion      = '3.0';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACH',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat','centraleAchat', 'plateforme','rayon','fournisseur'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { EsbFunctions }     from '@helpers/esb.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageAchCalApp }    from '@pom/ACH/achats_calendrier-approvisionnement.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;
let pageAchCalApp   : PageAchCalApp;
let esb             : EsbFunctions;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageAchCalApp   = new PageAchCalApp(page); 
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async () => {
    await fonction.close();
});

//------------------------------------------------------------------------------------  

const sDossierAchat  = fonction.getInitParam('dossierAchat', 'Bcv - joubard julien');  //Anais chavanerin
const sCentraleAchat = fonction.getInitParam('centraleAchat', 'BCT 500');
const sPlateforme    = fonction.getInitParam('plateforme', 'Cremlog');      
const sRayon         = fonction.getInitParam('rayon', 'BCT');  
const sFournisseur   = fonction.getInitParam('fournisseur', 'Sas Les Ateliers Ⓔ');
//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', async () => {  
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ACHATS]', async () => {

        var sNomPage:string = 'achats'; 

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })
        
        test('Page [ACHATS] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async() => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxDossierAchat, sDossierAchat, page);
        })

        test('ListBox [CENTRALE D\'ACHAT', async () => {
            await fonction.listBoxByLabel(pageAchCalApp.listBoxCentraleAchat, sCentraleAchat, page);
        })

        test('DataGrid [PLATEFORME] = "' + sPlateforme + '"', async() => {            
            await fonction.clickAndWait(pageAchCalApp.tdListPlateformes.locator('span:text-is("' + sPlateforme + '")'), page);
            log.set('Plateforme sélectionnée : ' + sPlateforme);
        })

        test('Pictogram [BASCULER CROSSDOCKING] - Click', async() => {            
            await pageAchCalApp.tdListActionsSelected.hover({timeout:250});
            await fonction.clickAndWait(pageAchCalApp.pictoBasculerCrossDock, page);
        })

        test('DataGrid [FOURNISSEUR] = "' + sFournisseur + '"', async() => {
            await fonction.clickAndWait(pageAchCalApp.tdListFournisseurs.locator('span:text-is("' + sFournisseur + '")'), page);
            log.set('Plateforme sélectionnée : ' + sFournisseur);
        })
    })
})
