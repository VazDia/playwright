/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-29
 * 
 */

const xRefTest      = "PRE_REF_CHE";
const xDescription  = "Création d'un Chemin de Picking";
const xIdTest       =  1982;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { Help }                     from '@helpers/helpers.js';
import { TestFunctions }            from '@helpers/functions.js';
import { Log }                      from '@helpers/log.js';
import { EsbFunctions }             from '@helpers/esb.js';

import { MenuPreparation }          from '@pom/PRE/menu.page.js';
import { RefCheminPickingPage }     from '@pom/PRE/referentiel-chemin_picking.page';

import { CartoucheInfo, TypeEsb } 	from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageChemin          : RefCheminPickingPage;
let esb                 : EsbFunctions;

//------------------------------------------------------------------------------------

const log               = new Log();
const fonction          = new TestFunctions(log);

const sNomChemin        = 'TEST-AUTO_nomCheminPicking-' + fonction.getToday();
var iOrdre              = Math.floor(fonction.random() * 998) + 1;

//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);
    pageChemin  = new RefCheminPickingPage(page);
    esb         = new EsbFunctions(fonction);
});

test.afterAll(async () => {
    await fonction.close();
});

//------------------------------------------------------------------------------------

test.describe('[' + xRefTest + ']' , () => {
    
    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        fonction.setTartTime(testInfo);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [REFERENTIEL]', async () => {   

        var sNomPage = 'referentiel';
        test ('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 
        
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        var sNomOnglet = "CHEMIN DE PICKING";
        test.describe ('Onglet [' + sNomOnglet.toUpperCase() + ']', () => {

            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage, 'cheminPicking', page);
            });

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            });

            var sNomPopin = 'CREER UN CHEMIN';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                    
                test('Button [CREER UN CHEMIN]- Click', async () => {
                    await fonction.clickElement(pageChemin.buttonCreerChemin);
                }); 
                
                test('Message [ERREUR] - Is Not Visible', async () => {
                    await fonction.isErrorDisplayed(false, page);
                });

                test('Input [DESIGNATION] = rnd', async () => {
                    await fonction.sendKeys(pageChemin.pPinputNomChemDesignation, sNomChemin + iOrdre.toString());
                    log.set('Nom Chemin : ' + sNomChemin);
                });

                test('Input [ORDRE] = rnd', async () => {
                    await fonction.sendKeys(pageChemin.pPinputNomChemOrdre, iOrdre.toString());
                    log.set('Ordre : ' + iOrdre.toString());
                });

                test('Toggle Button [FUSION DES CLIENT] - Select', async () => {
                    await fonction.clickElement(pageChemin.pCheckBoxFusionClient);
                });

                test('Button [CREER]- Click', async () => {
                    await fonction.clickAndWait(pageChemin.pPbuttonNomChemCreer, page);
                }); 

            }); //-- End Popin

        }); //-- End Onglet

    }); //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

    test('Check Flux : ',async ()=>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerNomCheminPicking_Stock"
                }
            ],
            "WAIT_BEFORE"   : 3000,                 // Optionnel
        };
        await esb.checkFlux(oFlux,page);
    })

});   