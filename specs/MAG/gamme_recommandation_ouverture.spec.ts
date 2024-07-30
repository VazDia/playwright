/**
 * @author Mathis NGUYEN
 * @description "Ajouter des recommandations d'ouverture à une gamme";
 * @since 2024-07-15
 * 
 */
const xRefTest      = "MAG_GPE_REC";
const xDescription  = "Ajouter des recommandations d'ouverture à une gamme";
const xIdTest       =  9999;
const xVersion      = '3.0';
 
var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,  
    help        : [],         
    params      : [],
    fileName    : __filename
};   

//------------------------------------------------------------------------------------

import { expect, test, type Page}   from '@playwright/test';

import { Help }                     from '@helpers/helpers';
import { TestFunctions }            from '@helpers/functions';
import { Log }                      from '@helpers/log';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { AutorisationsRecomOuverture }      from '@pom/MAG/autorisations-recommandations_ouverture.page';

import { CartoucheInfo } from '@commun/types';
//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuMagasin;
let pageRecomOuverture      : AutorisationsRecomOuverture;

const log                 	= new Log();
const fonction            	= new TestFunctions(log);

//------------------------------------------------------------------------------------

const [sDesignationMod1, sGroupeArticle1]  = fonction.getLocalConfig('gammeToRecomm')[0].split('/');
const [sDesignationMod2, sGroupeArticle2]  = fonction.getLocalConfig('gammeToRecomm')[1].split('/');

const gammesDetails = [
    { 
        sDesignation: sDesignationMod1,
        sGroupeArticle: sGroupeArticle1
    },
    { 
        sDesignation: sDesignationMod2,
        sGroupeArticle: sGroupeArticle2
    }
];

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();
    menu                = new MenuMagasin(page, fonction);
    pageRecomOuverture  = new AutorisationsRecomOuverture(page); 
	const helper 		= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close();
});

//------------------------------------------------------------------------------------  

test.describe.serial('[' + xRefTest + ']', async () => {
    
    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
		await context.clearCookies();
        await fonction.openUrl(page);
    })

    test ('Connexion', async () => {
        await fonction.connexion(page);
    })

    test.describe ('Page [AUTORISATIONS]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            await menu.pPopinAlerteSanitaire.isVisible().then(async (isVisible) => {
                if(isVisible){
                    await menu.removeArlerteMessage();
                }else{
                    log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                    test.skip();
                }
            })
        })

        var sPageName = 'autorisations';

        test ('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sPageName, page);
        })

        test.describe ('Onglet [RECOMMANDATIONS D\'OUVERTURE]', async () => {

            var sNomOnglet = 'recomOuverture';
            test ('Onglet [RECOMMANDATIONS D\'OUVERTURE] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            gammesDetails.forEach((gamme, index) => {

                test ('ListBox [GROUPE ARTICLE] = "' + gamme.sGroupeArticle + '"', async () => {
                    await fonction.ngClickListBox(pageRecomOuverture.listBoxGroupeArticle, gamme.sGroupeArticle, pageRecomOuverture.listBoxChoixGroupeArticle);
                    await fonction.waitTillHTMLRendered(page);

                });

                test.describe ('CheckBox [Articles] for GAMME = "' + gamme.sDesignation + '"', async () => {

                    test ('** Wait Until Spinner Off ** #' + index + ' ', async () => {
                        var iDelaiTest = 120000;
                        test.setTimeout(iDelaiTest);
                        expect(page.locator('i.app-spinner')).not.toBeVisible({timeout:iDelaiTest});
                    })
         
                    test ('** Click on 3 randoms articles ** #' + index + ' ', async() => {
                        //Count number of th sub-headers before the one having our gamme designation
                        const thSubHeaders = pageRecomOuverture.dataGridListeRecomSub;
                        const thSubHeadersCount = await thSubHeaders.count();
                        let bFound = false;

                        let countBeforeGamme = 0;
                        for (let iCpt = 0; iCpt < thSubHeadersCount; iCpt++) {
                            const sTextContent = await thSubHeaders.nth(iCpt).textContent();
                            if (sTextContent?.trim() === gamme.sDesignation.trim()) {
                                bFound = true;
                                break;
                            }
                            countBeforeGamme++;
                        }

                        //Expect to have found it 
                        expect(bFound).toBe(true)


                        //Generate 3 unique indices between 0 and countElements -1
                        const countElements = await pageRecomOuverture.dataGridListeRecomElements.count()
                        const uniqueIndices = new Set<number>();
                        while (uniqueIndices.size < 3) {
                            uniqueIndices.add(Math.floor(Math.random() * countElements));
                        }
                        const randomIndices = Array.from(uniqueIndices);

                        //Perform the check on these 3 randoms articles for our gamme
                        for (const randomIndex of randomIndices) {
                            const randomElementChecked = pageRecomOuverture.dataGridListeRecomElements.nth(randomIndex).locator('td p-checkbox').nth(countBeforeGamme);
                            await randomElementChecked.click();
                        }
                    })

                    

                });

                test ('Button [ENREGISTRER GAMME] = "' + gamme.sDesignation + '"', async () => {
                    await fonction.clickAndWait(pageRecomOuverture.buttonEnregistrer, page);
                })

            })
    

        })
		
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})