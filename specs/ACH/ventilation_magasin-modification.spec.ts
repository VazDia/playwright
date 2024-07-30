/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-07
 * 
 */
const xRefTest      = "ACH_VNM_MOD";
const xDescription  = "Modifier une ventilation magasin";
const xIdTest       =  1730;
const xVersion      = '3.0';

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
const sJddFile      = '../../_data/_tmp/ACH/ventilation_magasin.json';
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

            var sNomPopin = "Modification d'une ventilation magasin";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Button [MODIFIER UNE VENTILATION] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenMag.buttonModifierVentilationMag, page);        
                    await fonction.popinVisible(page, sNomPopin);    
                })

                test('Error Message - Is Hidden', async () =>  {
                    await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
                })

                test('InputField [DESIGNATION] = "' + LIBELLE + '-Updated"', async ({}, testInfo) =>  {
                    log.set('Désignation Initiale : ' + LIBELLE + '-Updated');
                    log.set('Nouvelle Désignation : ' + LIBELLE + '-Updated');
                    await fonction.sendKeys(pageVenMag.pPinputDesignation, LIBELLE + '-Updated');

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

                test('Button [ENREGISTRER] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenMag.pPbuttonEnregistrer, page);        
                    await fonction.popinVisible(page, sNomPopin, false);    
                })                

            })

        })  // End Describe Onglet

    })  // End Describe Page

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})