/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-07
 * 
 */
const xRefTest      = "ACH_VNA_ATT";
const xDescription  = "Attribuer un article (ou plusieurs) dans une ventilation article";
const xIdTest       =  1763;
const xVersion      = '3.1';

var info = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : ['Successeur de ACH_VNA_ADD'],
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
import { PageBesVenArt }    from '../../pages/ACH/besoins_ventilation-articles.page';

//-- JDD
import { LIBELLE }          from '../../_data/_tmp/ACH/ventilation_article.json';           // Récupération du nom de la ventilation créée à l'étape précédente
//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenArt      : PageBesVenArt;

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
    pageVenArt      = new PageBesVenArt(page);
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
        log.set('Libellé ventilation article cible : ' + LIBELLE);
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

        test.describe('Onglet [VENTILATIONS DES ARTICLES]', async () =>  {

            test ('Onglet [VENTILATIONS DES ARTICLES] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'ventilationsArticles', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            test ('Label ["' + LIBELLE + '"] - Click', async () =>  {
                await page.locator('span:text("' + LIBELLE + '")').click();
            })             

            for (var cpt=0; cpt < iNbSelect; cpt++){
                test ('CheckBox [ARTICLE][rnd #' + cpt + '] - Click', async () =>  {

                    await pageVenArt.dataGridTdListeCodes.first().waitFor();         // 
                    const iNbArticles = await pageVenArt.dataGridTdListeCodes.count();
                    var rnd = Math.floor(fonction.random() * iNbArticles);
                    var sLibelleArticle = await pageVenArt.dataGridTdListeCodes.nth(rnd).textContent();
                    log.set('Rnd : ' + rnd + '/' + iNbArticles);
                    //log.set('Magasin #'+cpt+'/'+iNbArticles+' séléctionné : ' + sLibelleArticle);
                    log.set('Article séléctionné : ' + sLibelleArticle);
                    await pageVenArt.dataGridTdListeCodes.nth(rnd).click();

                })
            }

            test ('Button [ATTRIBUER (' + iNbSelect + ') MAGASINS] - Click', async () =>  {
                await pageVenArt.buttonAttribuerArticle.click();
            })

        })  // End Describe Onglet


    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})