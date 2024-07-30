/**
 * 
 * @author JC CALVIERA
 * @since 2024-02-28
 * 
 */
const xRefTest      = "ACH_TSP_SPR";
const xDescription  = "Supprimer un paramétrage (unité de transport)";
const xIdTest       =  1761;
const xVersion      = "3.1";

var info = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Précurseur et successeur de [ACH_TSP_APR].', 'Dans un cas essaye de supprimer un paramètre aléatoire, ', 'et dans le second cas supprime les paramètres préalablement créés.'],
    params      : [],
    fileName    : __filename
};

import { test, type Page}   from '@playwright/test';

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

const sImportDatas          = fonction.getInitParam('E2E', '');     // Si on passe une valeur pour ce paramètre, alors on chargera les données mémorisées à l'étape précédente.

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

            if (sImportDatas === '') {

                //-- On sélectione un paramètre au hasard
                test ('CheckBox [UNITE TRANSPORT][rnd] - Click', async () => {
                    oData.iNbElem = await pageUnites.dataGridListeParamGroupe.count();
                    log.set('Nombre de lignes : ' + oData.iNbElem.toString());

                    oData.iPos = Math.floor(fonction.random() * oData.iNbElem);
                    log.set('Ligne cible : ' + oData.iPos.toString());

                    oData.bActif = await pageUnites.dataGridListeActif.nth(oData.iPos).isVisible();
                    log.set('Paramètre actif : ' + oData.bActif);

                    oData.sGroupe = await pageUnites.dataGridListeParamGroupe.nth(oData.iPos).textContent();
                    log.set('Nom Groupe : ' + oData.sGroupe);

                    oData.sPlateforme  = await pageUnites.dataGridListeParamPlateforme.nth(oData.iPos).textContent();
                    log.set('Plateforme : ' + oData.sPlateforme);

                    oData.sUniteTransport = await pageUnites.dataGridListeParamUniteTransp.nth(oData.iPos).textContent();
                    log.set('Unité de transport : ' + oData.sUniteTransport);

                    oData.rCoef = await pageUnites.dataGridListeParamCoef.nth(oData.iPos).textContent();
                    log.set('Coefficient de foisonnement : ' + oData.rCoef);

                    oData.sNature    = await pageUnites.dataGridListeParamMarchandise.nth(oData.iPos).textContent();
                    log.set('Nature de la marchandise : ' + oData.sNature);

                    await fonction.clickElement(pageUnites.dataGridListeParamCoef.nth(oData.iPos));

                    //-- On mémorise les données
                    jddFile.debug(true);
                    jddFile.writeJson(sJddFile, oData);
                })

            } else {

                //-- On sélectionne le paramètre préalablement sauvegardé dans le fichier JSON
                test ('CheckBox [UNITE TRANSPORT][*] - Click', async () => {

                    //-- Chargement des données cible
                    jddFile.debug(true);
                    oData = jddFile.readJson(sJddFile);

                    //-- On recherche toutes les lignes potentielles ayant les bonnes données
                    await fonction.clickElement(pageUnites.trUniteTransportParam
                                    .filter({has: page.locator('td >> text="'+oData.sGroupe+'"')})
                                    .filter({has: page.locator('td >> text="'+oData.sPlateforme+'"')})
                                    .filter({has: page.locator('td >> text="'+oData.sUniteTransport+'"')})
                                    .filter({has: page.locator('td >> text="'+oData.rCoef+'"')}));

                })
            }

            //-- On tente de supprimer une unité de transport déjà associée à un paramètre (doit échouer)
            test ('CheckBox [UNITE TRANSPORT][Mère] - Click', async () => {
                await fonction.clickElement(pageUnites.dataGridListeNomsUnites.filter({hasText: oData.sUniteTransport}));
            })

            test ('Button [SUPPRIMER UNE UNITE DE TRANSPORT] - Click', async () => {
                await fonction.clickElement(pageUnites.buttonSupprimerUniteTransport);
            })

            const sNomPopin:string = "Suppression d'une unité de transport";
            test.describe ('Popin ' + sNomPopin.toUpperCase() + ']', async() => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () =>  {
                  await fonction.popinVisible(page, sNomPopin.toUpperCase(), true);
                })

                test('Button [OK] - Click', async () => {
                    await fonction.clickAndWait(pageUnites.pPbuttonDelOk, page);
                })

                if (sImportDatas === '') {

                    //-- Une erreur est levée car l'unité de transport est déjà associée au paramètre 
                    test('Message [ERREUR] - Is Not Visible', async () => {
                        await fonction.isErrorDisplayed(true, page);                           // Par défaut, une erreur doit être affichée !
                    })

                    test ('Pictogram [CLOSE] - Click', async () => {
                        await fonction.clickElement(pageUnites.pictogramErrorMessageClose.nth(0));
                    })

                } else{
                    
                    //-- Pas d'erreur levée car l'unité de transport N'est PAS associée au paramètre 
                    test('Message [ERREUR] - Is Not Visible', async () => {
                        await fonction.isErrorDisplayed(false, page);                           // Par défaut, une erreur doit être affichée !
                    })

                }

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden', async () =>  {
                    await fonction.popinVisible(page, sNomPopin.toUpperCase(), false, 3000);
                })

            })  // End Popin

       })  // End  Onglet

    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})  // End describe