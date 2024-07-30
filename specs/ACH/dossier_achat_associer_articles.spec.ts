/**
 * @author JC CALVIERA
 * @description Associer des articles à un dossier d'achat et contrôle du flux envoyé vers FACTURATION et REPARTITION
 * @since   2024-03-07
 * 
 */
const xRefTest      = "ACH_DOS_ASS";
const xDescription  = "Associer des articles à un dossier d'achat";
const xIdTest       =  255;
const xVersion      = '3.1';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';
import { EsbFunctions }     from '@helpers/esb';

import { MenuAchats }       from '@pom/ACH/menu.page.js'; 
import { PageRefDosAch }    from '@pom/ACH/referentiel_dossiers-achats.page';

import { CartoucheInfo, TypeEsb } from '@commun/types';

//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuAchats;
let pageRefDosAch         	: PageRefDosAch;

const log                 	= new Log();
const fonction            	= new TestFunctions(log);
const esb                   = new EsbFunctions(fonction);

//------------------------------------------------------------------------------------

var  sNomDossierCap = fonction.getLocalConfig('dossierAchat');                                          // En majuscule par défaut
sNomDossierCap      = sNomDossierCap.charAt(0).toUpperCase() + sNomDossierCap.slice(1).toLowerCase();   // Minuscule sauf initiale
const iNbArticles   = 10;   // nombre d'articles à associer

const sNomDossier   = fonction.getInitParam('dossierAchat', sNomDossierCap);
const sRayon        = fonction.getInitParam('rayon', 'Fruits et légumes');

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuAchats(page, fonction);
    pageRefDosAch       = new PageRefDosAch(page); 
	const helper 		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}) => {
    await fonction.close();
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {  
    
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

        test.describe('Onglet [DOSIERS D\'ACHAT]', async () => {

            var sNomOnglet = 'dossiersAchat';
            test('Onglet [DOSIERS D\'ACHAT]', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            })

            test('CheckBox [ARTICLES][0-10] - Click', async() => {
                // On sélectionne iNbArticles articles à associer
                for (let cpt = 0; cpt < iNbArticles; cpt++) {  
                    await fonction.clickElement(pageRefDosAch.checkBoxListeArticles.nth(cpt));
                }
                expect(await pageRefDosAch.dataGridDossierAchat.first().textContent()).toEqual(iNbArticles.toString());
            })

            test('Button [REAFFECTER ARTICLE] - Click', async () => {
                await fonction.clickElement(pageRefDosAch.buttonReaffecterArticle);
            })

            var sNomPopin = 'Changement de dossier d\'achat';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test('ListBox [NOM DOSSIER ACHAT] = "' + sNomDossier + '"', async () => {
                    await pageRefDosAch.pListBoxNomDossierAchat.selectOption(sNomDossier);
                })

                test('Button [ENREGISTRER] - Click', async () => {
                    await fonction.clickAndWait(pageRefDosAch.pButtonEnregistrerChangement, page);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })

            test('td [ARTICLES][0-10] = "' + sNomDossier + '"', async() => {
                
                for (let cpt = 0; cpt < iNbArticles; cpt++) {  
                    
                    test.step('td [ARTICLES][#' + cpt.toString() + '] = "' + sNomDossier + '"', async () => {
                        expect(await pageRefDosAch.dataGridNomDossier.nth(cpt).textContent()).toBe(sNomDossier);
                    })
                             
                }

            })

        })
		
    })
 

	test('** CHECK FLUX **', async () =>  {

		const oFlux:TypeEsb = { 
			FLUX : [
				{
					NOM_FLUX    : 'EnvoyerDossierAchat_Prefac',
					TITRE       : 'Dossier :%'
				},
				{
					NOM_FLUX    : 'EnvoyerDossierAchat_Qualite',
					TITRE       : 'Dossier :%'
				},
				{
					NOM_FLUX    : 'EnvoyerDossierAchat_Mag',
					TITRE       : 'Dossier :%'
				},
				{
					NOM_FLUX    : 'EnvoyerDossierAchat_Repart',
					TITRE       : 'Dossier :%'
				}
			],
			WAIT_BEFORE     : 10000,                 	// Optionnel
			VERBOSE_MOD     : false,                  	// Optionnel car écrasé globalement
		};

		await esb.checkFlux(oFlux, page);

	})


    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})