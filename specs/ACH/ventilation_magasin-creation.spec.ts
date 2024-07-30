/**
 * 
 * 
 * @author JC CALVIERA
 * @since 2023-11-03
 * 
 */
const xRefTest      = "ACH_VNM_ADD";
const xDescription  = "Créer une ventilation magasin";
const xIdTest       =  1729;
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
import { PageBesVenMag }    from '../../pages/ACH/besoins_ventilation-magasins.page';

//------------------------------------------------------------------------------------

let page            : Page;
let menu            : MenuAchats;

let pageVenMag      : PageBesVenMag;

var fonction        = new TestFunctions();
var log             = new Log();

//------------------------------------------------------------------------------------
const sRayon        = process.env.RAYON ||'Fruits et légumes';
const sJddFile      = '../../_data/_tmp/ACH/ventilation_magasin.json';

const today         = new Date();
var sDesignation    = 'Test_auto - ventil mag - ' + sRayon + '-' + today.getFullYear().toString() + fonction.addZero(today.getMonth() + 1).toString() + fonction.addZero(today.getDate().toString());
//console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + sDesignation);
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

            var sNomPopin = "Création d'une ventilation magasins";
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Button [CREER UNE VENTILATION] - Click', async () =>  {
                    await fonction.clickAndWait(pageVenMag.buttonCreerVentilationMag, page);        
                    await fonction.popinVisible(page, sNomPopin);    
                })

                test('Error Message - Is Hidden', async () =>  {
                    await fonction.isErrorDisplayed(false, page);                              // Pas d'erreur affichée à priori au chargement de la popin
                })

                test('InputField [DESIGNATION] = "'+sDesignation+'-xxx"', async ({}, testInfo) =>  {
                    sDesignation = sDesignation + '-' + fonction.addZero(today.getMilliseconds().toString());
                    log.set('Désignation : ' + sDesignation);
                    await fonction.sendKeys(pageVenMag.pPinputDesignation, sDesignation);

                    //-- Ecriture du libellé dans un fichier de JDD au format JSON pour récupératiuon des tests suivants
                    const sJsonData = { LIBELLE: sDesignation };
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