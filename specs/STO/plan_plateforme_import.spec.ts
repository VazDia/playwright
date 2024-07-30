/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 20 - 11 - 2023
 * 
 */

const xRefTest      = "STO_PLA_IMP";
const xDescription  = "Importer un plan plateforme";
const xIdTest       =  2172;
const xVersion      = '3.2';

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

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                     from "@pom/STO/menu.page";
import { ReferentielPlanPlateForme }     from '@pom/STO/referentiel-plan_plateforme.page';

import * as path from 'path';

//----------------------------------------------------------------------------------------

let page             : Page;

let menu             : MenuStock;
let pageRefPlanPltf  : ReferentielPlanPlateForme

const log            = new Log();
const fonction       = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sFileToUpload = '../../_data/STO/Plans_plateformes/Plan_plateforme_CLO.xlsx';
const sCommentaire  = 'TEST-AUTO_Import Plan Commentaire - ' + fonction.getToday('US');
const sNomPopin     = "Importer un plan de la plateforme";

//----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage(); 
    menu                = new MenuStock(page, fonction);
    pageRefPlanPltf     = new ReferentielPlanPlateForme(page);
    const helper        = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async () => {
    await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    let sMessageErreur  = '';

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('ListBox [PLATEFORME] = "Cremlog"', async() => {            
        await menu.selectPlateforrme(page, 'Cremlog');                     
    })

    test.describe('Page [REFERENTIEL]', () => {    
        
        test('Page [REFERENTIEL] - Click', async () => {
            await menu.click('referentiel', page);
        })
       
        test.describe('Onglet [PLAN PLATEFORME]', async () => {        
            
            test('Onglet [PLAN PLATEFORME] - Click', async () => {
                await menu.clickOnglet('referentiel', 'planPlateforme', page);
            })               

            test.describe ('Popin [' + sNomPopin + ']', async () => {

                test('Button [IMPORTER UN PLAN DE LA PLATEFORME] - Click', async () => {
                    await fonction.clickElement(pageRefPlanPltf.buttonImporterUnPlan);
                })
                
                test('Upload [FILE] = "' + sFileToUpload + '\'"', async () => {
                    var fileToUpload = sFileToUpload;
                    var absolutePath = path.join(__dirname, fileToUpload);      
                    await fonction.sendKeys(pageRefPlanPltf.pPtextAreaCommentaire, sCommentaire);
                    await pageRefPlanPltf.pPInputFile.setInputFiles(absolutePath);                        
                    await fonction.wait(page, 3000);
                    await fonction.clickAndWait(pageRefPlanPltf.pPbuttonEnregistrer, page);
                });

                //-- Aucune erreur 9999 doit être affichée. D'autres erreurs "légitimes" peuvent êtres affichées !
                test('Label [ERREUR] - ??? (optionnel)', async () => {
                    if (await pageRefPlanPltf.pPMessageErreur.isVisible()) {
                        sMessageErreur = await pageRefPlanPltf.pPMessageErreur.textContent();
                        log.set('Message Erreur Affiché : ' + sMessageErreur);
                    } else {
                        log.set('Aucun Message d\'Erreur Affiché');
                    }
                })

                test('Link [ANNULER] - click (optionnel)', async () => {
                    if (sMessageErreur !== '') {
                        await fonction.clickElement(pageRefPlanPltf.pPlinkAnnuler);
                    } else {
                        test.skip();
                    }
                })                

            })

            //-------------------------------------------------------------------------------------------------------------------------- 

        })  //-- End Describe Onglet              

    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})