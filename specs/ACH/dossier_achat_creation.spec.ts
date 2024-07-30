/**
 * @author Vazoumana DIARRASSOUBA
 * @since   2024-02-20
 * 
 */
const xRefTest      = "ACH_DOS_ADD";
const xDescription  = "Créer un dossier d'achat";
const xIdTest       =  254;
const xVersion      = '3.5';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : ['dossierAchat', 'responsable', 'rayon', 'E2E'],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageRefDosAch }    from '@pom/ACH/referentiel_dossiers-achats.page';

import { CartoucheInfo } 	from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuAchats;
let pageRefDosAch       : PageRefDosAch;

const log               = new Log();
const fonction          = new TestFunctions(log);

//------------------------------------------------------------------------------------

fonction.importJdd();
var  sNomDossierCap     = fonction.getLocalConfig('dossierAchat');                                          // En majuscule par défaut
sNomDossierCap          = sNomDossierCap.charAt(0).toUpperCase() + sNomDossierCap.slice(1).toLowerCase();   // Minuscule sauf initiale

const sNomDossier       = fonction.getInitParam('dossierAchat', sNomDossierCap);         
const sNomResponsable   = fonction.getInitParam('responsable', 'lunettes');
const sRayon          	= fonction.getInitParam('rayon', 'Fruits et légumes');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageRefDosAch       = new PageRefDosAch(page);
	const helper		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close();
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {

    var oData = {
        sDossierAchat   : ''
    };

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe('Page [REFERENTIEL]', async () => {

        test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        });

        var sPageName = 'referentiel';
        test('Page [REFERENTIEL] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe('Onglet [DOSSIERS D\'ACHAT]', async () => {

            var sNomOnglet = 'dossiersAchat';
            test('Onglet [DOSSIERS D\'ACHAT]', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            var sNomPopin = 'Création d\'un dossier d\'achat';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test('Button [CREER DOSSIER] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.buttonCreerDossier, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test('InputField [NOM DOSSIER D\'ACHAT] = "' + sNomDossier + '"', async () => { 
                    await fonction.sendKeys(pageRefDosAch.pInputNomDossier, sNomDossier);
                    log.set('Nom du dossier d\'achat : ' + sNomDossier);
                })

                test('ListBox [RESPONSABLE] = "' + sNomResponsable + '"', async () => { 
                    await fonction.clickElement(pageRefDosAch.pListBoxResponsable);
                    await pageRefDosAch.pListBoxResoonsableItem.filter({ hasText: sNomResponsable}).nth(0).click();
                })

                test ('Button [ENREGISTRER Dossier] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.pButtonEnregistrerDossier, page);
                    var alertIsVisible = await pageRefDosAch.pFeedBackErrorDossier.isVisible();
                    expect(alertIsVisible).toEqual(false)
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })
            
            test('ListBox [DOSSIER D\'ACHAT] = "' + sNomDossier + '"', async () => { 
                await fonction.clickElement(pageRefDosAch.listBoxDossierAchat);
                await fonction.listBoxByLabel(pageRefDosAch.listBoxDossierAchat, sNomDossier.charAt(0).toUpperCase() + sNomDossier.slice(1).toLowerCase(), page);
            })

            test ('DataGrid [VALUES] - Check Is Empty', async () => {
                const rowCount = await pageRefDosAch.dataGridDossierAchatElements.count();
                expect(rowCount).toEqual(0);
            })

            //Enregistrement des données pour le E2E
            oData.sDossierAchat = sNomDossier;
            fonction.writeData(oData);
        })

    })

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})
