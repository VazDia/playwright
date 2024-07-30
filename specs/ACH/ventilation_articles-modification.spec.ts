/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-07
 * 
 */
const xRefTest      = "ACH_VNM_MOD";
const xDescription  = "Modifier une ventilation article";
const xIdTest       =  1728;
const xVersion      = '3.1';

var info = {
    desc    : xDescription,
    appli   : 'ACH',
    version : xVersion,
    refTest : [xRefTest],
    idTest  : xIdTest,
    help    : [],
    params  : ['rayon'],
    fileName: __filename
};

//------------------------------------------------------------------------------------
const { writeFile } = require('fs');

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
const sJddFile      = '../../_data/_tmp/ACH/ventilation_article.json';
const rCoef         = Math.floor(fonction.random() * 10) + 1;
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

            var sNomPopin = "Modification d'une ventilation article";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Button [MODIFIER UNE VENTILATION] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenArt.buttonModifierUneVentilation, page);        
                    await fonction.popinVisible(page, sNomPopin);    
                })

                test('Error Message - Is Hidden', async () =>  {
                    await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
                })

                test('InputField [DESIGNATION] = "' + LIBELLE + '-Updated"', async ({}, testInfo) =>  {
                    log.set('Désignation Initiale : ' + LIBELLE);
                    log.set('Nouvelle Désignation : ' + LIBELLE + '-Updated');
                    await fonction.sendKeys(pageVenArt.pPinputDesignation, LIBELLE + '-Updated');

                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    const sJsonData = { LIBELLE: LIBELLE + '-Updated' };
                    writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(sJsonData, null, 2), (error) => {
                        if (error) {
                          console.log('An error has occurred ', error);
                          return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
                    });
                })

                test('InputField [COEFFICIENT DE SECURITE] = "x"', async ({}, testInfo) =>  {
                    log.set('Coef : ' + rCoef.toString());
                    await fonction.sendKeys(pageVenArt.pPinputCoefficient, rCoef.toString());

                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    const sJsonData = { LIBELLE: LIBELLE + '-Updated', COEF: rCoef.toString() };
                    writeFile(testInfo.config.rootDir + sJddFile, JSON.stringify(sJsonData, null, 2), (error) => {
                        if (error) {
                          console.log('An error has occurred ', error);
                          return;
                        }
                        log.set('Enregistrement de la donnée dans le fichier : ' + sJddFile);
                    });
                })

                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenArt.pPbuttonEnregistrer, page);        
                    await fonction.popinVisible(page, sNomPopin, false);    
                })                

            })

        })  // End Describe Onglet

    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})