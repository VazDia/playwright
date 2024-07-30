/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 20 - 11 - 2023
 * 
 */

const xRefTest      = "STO_REF_ZAE";
const xDescription  = "Gestion des Emplacements";
const xIdTest       =  1681;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "../../utils/functions";
import { Log }                           from "../../utils/log";
import { Help }                          from '../../utils/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from "../../pages/STO/menu.page";
import { ReferentielEmplacements }       from '../../pages/STO/referentiel-emplacements.page';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageRefEmpl      : ReferentielEmplacements

const fonction       = new TestFunctions();
const log            = new Log();

//----------------------------------------------------------------------------------------

const sNomZone       = 'TEST-AUTO_ZONE-'  + fonction.getToday('FR') + fonction.getHMS();

const plateforme     = fonction.getInitParam('plateforme', 'Chaponnay');

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage(); 

    menu                = new MenuStock(page, fonction);
    pageRefEmpl         = new ReferentielEmplacements(page)
})

test.afterAll(async () => {
    await log.get();
})

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    
    test('ListBox [PLATEFORME] = "' + plateforme + '"', async() => {            
        await menu.selectPlateforrme(page, plateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [REFERENTIEL]', function() {    

        var currentPage = 'referentiel';
        test('Page [REFERENTIEL] - Click', async () => {
            await menu.click(currentPage, page);
        })
       
        test.describe('Onglet [EMPLACEMENTS]', () => {        
            
            test('Onglet [EMPLACEMENTS] - Click', async () => {
                await menu.clickOnglet(currentPage, 'emplacements', page);
            })   

            test('Button [ZONES] - Click', async () => {
                await pageRefEmpl.buttonZones.hover({timeout:1000});        
                await pageRefEmpl.buttonCreerZone.click();             
            })

            test.describe ('Popin [CREATION D\'UNE ZONE] ', () => {

                test('Popin [CREATION D\'UNE ZONE - Is Visible] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, 'CREATION D\'UNE ZONE - Is Visible', true);
                })

                test('InputField [DESIGNATION] = "Cf. Log"', async () => {
                    await fonction.sendKeys(pageRefEmpl.pInputDesignation, sNomZone);
                    log.set('Nom de la zone : ' + sNomZone);
                })

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageRefEmpl.pButtonEnregistrer, page)
                })

                test('Popin [CREATION D\'UNE ZONE - Is Visible] - Is Not Visible - Check', async () => {
                    await fonction.popinVisible(page, 'CREATION D\'UNE ZONE - Is Visible', false);
                })                
            })    

        })  //-- End Describe Onglet

    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})