/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-29
 * 
 */
const xRefTest      = "ACH_TSP_APR";
const xDescription  = "Créer un paramétrage (unité de transport)";
const xIdTest       =  1759;
const xVersion      = "3.0";

var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Précurseur de [ACH_TSP_SPR]'],
    params      : [],
    fileName    : __filename
};

import { test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers';
import { TestFunctions }    from '@helpers/functions';
import { Log }              from '@helpers/log';
import { JddFile }          from '@helpers/file';

import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageRefUniTrp }    from '@pom/ACH/referentiel_unites-transport.page';

//------------------------------------------------------------------------------------

let page                    : Page;
 
var pageUnites              : PageRefUniTrp;
var menu                    : MenuAchats;
var jddFile                 : JddFile;

const log                   = new Log();
const fonction              = new TestFunctions(log);

const sJddFile              = '../../_data/_tmp/ACH/parametres_unite_transport.json';
const rCoef                 = 8.88;

//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuAchats(page, fonction);    
    pageUnites  = new PageRefUniTrp(page);
    jddFile     = new JddFile(testInfo);
})
 
test.afterAll(async() => {
    await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    let oData = {
        iNbElem : null,
        iPos : null,
        bActif : null,
        sGroupe : null,
        sPlateforme : null,
        sUniteTransport : null,
        rCoef : null,
        sNature : null
    }

   test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
   });

   test('Ouverture URL : ' + fonction.getApplicationUrl(), async () => {
       await fonction.openUrl(page);
   });

   test('Connexion', async() => {
       await fonction.connexion(page);
   })
  
    test.describe('Page [REFERENTIEL]', async() => {

        var pageName:string = 'referentiel';

        test("Menu [REFERENTIEL] - Click ", async () => {
            await menu.click(pageName, page);
        })

        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
        })

       test.describe('Onglet [UNITES DE TRANSPORT]', async() => {

            test ('Onglet [UNITES DE TRANSPORT] - Click', async () => {
                await menu.clickOnglet(pageName, 'unitesTransport',page);                
            })   

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            test ('Button [CREER UN PARAMETRAGE] - Click', async () => {
                oData.iNbElem = await pageUnites.dataGridListeParamGroupe.count();
                log.set('Nb Paramètres AVANT ajout : ' + oData.iNbElem);
                await fonction.clickElement(pageUnites.buttonCreerParametrage);
            })

            const sNomPopin:string = "Création d'un paramétrage d'unité de transport";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test('** Traitement rnd **', async () => {         

                    var iNbEssai:number = 0;

                    do {

                        iNbEssai++;

                        log.separateur();
                        log.set('Essai #' + iNbEssai.toString());

                        //-- LB Groupe
                        await fonction.selectRandomListBoxOption(pageUnites.pPlistBoxAddParamGroupe);

                        //-- LB Plateforme
                        await fonction.selectRandomListBoxOption(pageUnites.pPlistBoxAddParamPlateforme);

                        //-- LB Unité de transport
                        await fonction.selectRandomListBoxOption(pageUnites.pPlistBoxAddParamUniteTransp);

                        //-- LB Nature Marchandise
                        await fonction.selectRandomListBoxOption(pageUnites.pPlistBoxAddParamNature);
                       
                        
                        oData.rCoef = rCoef;
                        log.set('Coefficient de foisonnement : ' + oData.rCoef); 
                        await fonction.sendKeys(pageUnites.pPinputAddParamCoef, rCoef.toString());

                        oData.bActif = (fonction.random() > 0.5);
                        
                        if (oData.bActif > 0.5) {
                            await fonction.clickCheckBox(pageUnites.pPcheckBoxAddParamActif);
                            log.set('Actif : OUI');
                        } else {
                            log.set('Actif : NON');
                        }

                        await fonction.clickElement(pageUnites.pPbuttonAddParamCreer);

                        //-- Une erreur est elle affichée ?
                        var bIsErrorVisible = await pageUnites.errorMessage.isVisible();

                    } while(bIsErrorVisible);

                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })

            })  // End Popin

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);

        //-- On mémorise les données crées afin de pouvoir les supprimer à l'étape suivante
        jddFile.debug(true);
        jddFile.writeJson(sJddFile, oData);

    });

})  // End describe