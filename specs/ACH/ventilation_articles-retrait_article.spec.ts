/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-06
 * 
 */
const xRefTest      = "ACH_VNA_RET";
const xDescription  = "Retirer un (ou plusieurs) articles dans une ventilation article";
const xIdTest       =  1764;
const xVersion      = '3.1';

var info = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : ['Successeur de ACH_VNA_ATT'],
    params  : ['rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }  from '@playwright/test';

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

        test.describe('Onglet [VENTILATIONS DES ARTICLES]', async () =>  {

            var iNbArticles = 0;

            test ('Onglet [VENTILATIONS DES ARTICLES] - Click', async () =>  {
                await menu.clickOnglet(sPageName, 'ventilationsArticles', page);
            })   

            test ('Error Message - Is Hidden', async () =>  {
                await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
            })

            test ('Label ["' + LIBELLE + '"] - Click', async () =>  {
                await page.locator('span:text("' + LIBELLE + '")').click();
            })             

            test ('CheckBox [ARTICLE SELECTED][rnd] - Click', async () =>  {
                await pageVenArt.dataGridTdListeCodesSelected.first().waitFor();
                iNbArticles = await pageVenArt.dataGridTdListeCodesSelected.count();
                var rnd = Math.floor(fonction.random() * iNbArticles);
                var sLibelleArticle = await pageVenArt.dataGridTdListeCodesSelected.nth(rnd).textContent();
                log.set('Rnd : ' + rnd + '/' + iNbArticles);
                log.set('Article séléctionné : ' + sLibelleArticle);
                await pageVenArt.dataGridTdListeCodesSelected.nth(rnd).click();
                log.set('Nb articles avant suppression : ' + iNbArticles);  
            })

            test ('Button [RETIRER (1) ARTICLES] - Click', async () =>  {
                await pageVenArt.buttonRetirerArticle.click();
            })

            test ('Nb articles = Nb articles - 1', async () =>  {              
                await pageVenArt.dataGridTdListeCodesSelected.first().waitFor();
                const iNbArticlesRestants = await pageVenArt.dataGridTdListeCodesSelected.count();
                log.set('Nb articles après suppression : ' + iNbArticlesRestants);
                expect(iNbArticlesRestants).toBe(iNbArticles - 1);
            })

        })  // End Describe Onglet


    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})