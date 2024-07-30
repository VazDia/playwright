/**
 * @author JC CALVIERA
 * @since   2021-01-22
 * 
 */
const xRefTest      = "ACH_CAM_VIS";
const xDescription  = "Visualisation d'une campagne";
const xIdTest       =  2655;
const xVersion      = '3.0';
 
var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['rayon'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page}   from '@playwright/test';
import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';
//-- PageObject ----------------------------------------------------------------------

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageAnaCmp }       from '@pom/ACH/analyse_campagne.page';

//------------------------------------------------------------------------------------

let page                  : Page;
let menu                  : MenuAchats;
let pageCpgne             : PageAnaCmp;

const log                 = new Log();
log.verbose(true);
const fonction            = new TestFunctions(log);

//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page                 = await browser.newPage();
    menu                 = new MenuAchats(page, fonction);
    pageCpgne            = new PageAnaCmp(page); 
});

test.afterAll(async () => {
    await fonction.close();
});

//------------------------------------------------------------------------------------  

const sRayon        = process.env.RAYON ||'Fruits et légumes';

const sCaracteres   = 'abcdefghijlmnoprstuv0123456789';

//------------------------------------------------------------------------------------

var getRandomLettre = function() {
    return sCaracteres.substr(Math.floor(Math.random() * sCaracteres.length), 1);
}

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', async () => {  
    
    test('- Start -', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async () => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [ANALYSE]', async () => {

        var sNomPage = 'analyse'; 

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {                    
            await menu.selectRayonByName(sRayon, page);
        })

        test ('Page [ANALYSE] - Click', async() => {
            await menu.click(sNomPage, page, 60000);                
        })

        test ('Message [ERREUR] - Is NOT Visible', async() => {
            await fonction.isErrorDisplayed(false, page);                
        })

        test ('CheckBox [CAMPAGNE][0] - Click', async() => {
            await fonction.clickElement(pageCpgne.checkBoxListeCampagnes.first());                
        })

        test ('Button [VISUALISER] - Click', async() => {
            await fonction.clickElement(pageCpgne.buttonVisualiser);                
        })

        var sNomPopin = "Détails d'une campagne";
        test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async() => {

            test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async() => {       
                await fonction.popinVisible(page, sNomPopin);
            })

            test ('Message [ERREUR] - Is NOT Visible', async() => {
                await fonction.isErrorDisplayed(false, page);                
            })  
            
            test ('Link [ANNULER] - Click', async() => {
                await fonction.clickElement(pageCpgne.pPdetailCpgneLinkAnnuler);                
            })

        })

    }) // end test.describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })
}) 