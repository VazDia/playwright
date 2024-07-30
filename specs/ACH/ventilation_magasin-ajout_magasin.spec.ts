/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-06
 * 
 */
const xRefTest      = "ACH_VNM_ATT";
const xDescription  = "Attribuer un (ou plusieurs) magasins d'une ventilation magasin";
const xIdTest       =  1731;
const xVersion      = '3.1';

var info = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : ['Successeur de ACH_VNM_ADD'],
    params  : ['rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }  from '@playwright/test';

//-- Helpers
import { Help }             from '../../utils/helpers';
import { TestFunctions }    from '../../utils/functions';
import { Log }              from '../../utils/log'

import { MenuAchats }       from '../../pages/ACH/menu.page';

//-- Pages Objects
import { PageBesVenMag }    from '../../pages/ACH/besoins_ventilation-magasins.page';

//-- JDD
import { LIBELLE }          from '../../_data/_tmp/ACH/ventilation_magasin.json';           // Récupération du nom de la ventilation créée à l'étape précédente
//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenMag      : PageBesVenMag;

var fonction        = new TestFunctions();
var log             = new Log();

//------------------------------------------------------------------------------------
const sRayon        = process.env.RAYON ||'Fruits et légumes';
const iNbSelect     = 5;
//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageVenMag      = new PageBesVenMag(page);
});

test.afterAll(async() =>{
    log.get();
})

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
        log.set('Libellé ventilation magasin cible : ' + LIBELLE);
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [BESOINS]', () => {

        var sPageName = 'besoins';

        test('ListBox [RAYON] = "' + sRayon + '"', async () => {
            await menu.selectRayonByName(sRayon, page);
        })

        test('Page [BESOINS] - Click', async () => {
            await menu.click(sPageName, page); 
        })
       
        test ('Error Message - Is Hidden', async () =>  {
            await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
        })

        test.describe('Onglet [VENTILATIONS DES MAGASINS]', async () =>  {

            test ('Onglet [VENTILATIONS DES MAGASINS] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'ventilationsMagasins', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            test ('Label ["' + LIBELLE + '"] - Click', async () =>  {
                await page.locator('span:text("' + LIBELLE + '")').click();
            })             

            for (var cpt=0; cpt < iNbSelect; cpt++){
                test ('CheckBox #' + cpt + ' [MAGASIN][rnd] - Click', async () =>  {

                    await pageVenMag.dataGridTdListeMagasins.first().waitFor();         // 
                    const iNbMagasins = await pageVenMag.dataGridTdListeMagasins.count();
                    var rnd = Math.floor(fonction.random() * iNbMagasins);
                    var sLibelleMagasin = await pageVenMag.dataGridTdListeMagasins.nth(rnd).textContent();
                    log.set('Rnd : ' + rnd + '/' + iNbMagasins);
                    //log.set('Magasin #'+cpt+'/'+iNbMagasins+' séléctionné : ' + sLibelleMagasin);
                    log.set('Magasin séléctionné : ' + sLibelleMagasin);
                    await pageVenMag.dataGridTdListeMagasins.nth(rnd).click();

                })
            }

            test ('Button [ATTRIBUER (' + iNbSelect + ') MAGASINS] - Click', async () =>  {
                await pageVenMag.buttonAttribuerMagasin.click();
            })

        })  // End Describe Onglet


    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})