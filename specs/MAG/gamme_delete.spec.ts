/**
 * @author Mathis NGUYEN
 * @description Supprimer une gamme
 * @since 2024-05-21
 * 
 */
const xRefTest      = "MAG_GPE_DEL";
const xDescription  = "Supprimer une gamme";
const xIdTest       =  9220;
const xVersion      = '3.1';
 
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
import { AutorisationsGammes }      from '@pom/MAG/autorisations-gammes.page';
import { AutorisationsRecomOuverture }      from '@pom/MAG/autorisations-recommandations_ouverture.page';

import { CartoucheInfo } from '@commun/types';
//------------------------------------------------------------------------------------

let page                  	: Page;
let menu                  	: MenuMagasin;
let pageGammes              : AutorisationsGammes;
let pageRecomOuverture      : AutorisationsRecomOuverture;

const log                 	= new Log();
const fonction            	= new TestFunctions(log);

//------------------------------------------------------------------------------------

const sDesignationDel1 = fonction.getLocalConfig('gammesToDelete')[0];
const sDesignationDel2 = fonction.getLocalConfig('gammesToDelete')[1];
const sDesignationDel3 = fonction.getLocalConfig('gammesToDelete')[2];
const sDesignationDel4 = fonction.getLocalConfig('gammesToDelete')[3];

const [sDesignationMod1, sGroupeArticle1]  = fonction.getLocalConfig('gammeToRecomm')[0].split('/');
const [sDesignationMod2, sGroupeArticle2]  = fonction.getLocalConfig('gammeToRecomm')[1].split('/');

const gammesDetailsRecommended = [
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
    pageGammes          = new AutorisationsGammes(page); 
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

        test.describe ('Onglet [GAMMES]', async () => {

            var sNomOnglet = 'gammes';
            test ('Onglet [GAMMES] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            var sNomPopin = 'Suppression d\'une gamme';
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                
                test ('CheckBox [GAMMES][' + sDesignationDel1 + '] - Select', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel1 }));                    
                });

                test ('Button [SUPPRIMER UNE GAMME] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.buttonSupprimer, page);
                })

                var sNomPopin2 = 'Confirmer la suppression d\'une gamme'
                test ('Popin [' + sNomPopin2.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomOnglet, true);
                })

                test ('Button [CONFIRMER SUPPRIMER GAMME] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.pPConfirmSuppressYes, page);
                })

                test ('Popin [' + sNomPopin2.toUpperCase() + '] - Is Hidden', async () => {
                    await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gamme is deleted
                })
                
                test ('td [' + sDesignationDel1 + '] - Is NOT Visible', async () => {                    
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel1 });
                    expect(await filteredRows.count()).toEqual(0); //expect it doesnt exist anymore
                })

                test ('CheckBox [GAMMES]['+sDesignationDel2+'] - Click', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel2 }));
                });

                test ('CheckBox [GAMMES]['+sDesignationDel3+'] - Click', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel3 }));
                });

                test ('Button [SUPPRIMER PLUSIEURES GAMMES] - Click', async () => {
                    await fonction.clickAndWait(pageGammes.buttonSupprimer, page);
                })

                var sNomPopin3 = 'Confirmer la suppression de plusieurs gammes'
                test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                    test ('Popin [' + sNomPopin3.toUpperCase() + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomOnglet, true);
                    })

                    test ('Button [CONFIRMER SUPPRIMER PLUSIEURS GAMMES] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPConfirmSuppressYes, page);
                    })

                    test ('Button [RE-CONFIRMER SUPPRIMER PLUSIEURS GAMMES (RECOMM. OUV)] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPReConfirmSuppress.nth(1), page);
                    })

                    test ('Popin [' + sNomPopin2.toUpperCase() + '] - Is Hidden', async () => {
                        await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gammes are deleted
                    })

                })
                  
                test ('td [' + sDesignationDel2 + '] - Is NOT Visible', async () => {
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel2 });
                    expect(await filteredRows.count()).toEqual(0);
                })

                test ('td [' + sDesignationDel3 + '] - Is NOT Visible', async () => {
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel3 });
                    expect(await filteredRows.count()).toEqual(0);
                })

                test ('CheckBox [GAMMES][' + sDesignationDel4 + '] - Click', async () => {
                    await fonction.clickElement(pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel4 }));
                });

                test ('Button [SUPPRIMER GAMME COLONNE ACTION] - Click', async () => {
                    const rows = pageGammes.gammeRowsDesignation;
                    const rowCount = await rows.count();

                    for (let i = 0; i < rowCount; i++) {
                        const currentDesignation = await rows.nth(i).textContent();
                        if (currentDesignation.trim() === sDesignationDel4) { //if designation match, then we have found the gamme to delete
                            await fonction.clickAndWait(pageGammes.buttonSupprimerAction.nth(i), page);
                            break;
                        }
                    }
                })

                var sNomPopin4 = 'Confirmer la suppression d\'une gamme COLONNE ACTION'
                test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                    test ('Popin [' + sNomPopin4.toUpperCase() + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomOnglet, true);
                    })

                    test ('Button [CONFIRMER SUPPRIMER GAMME COLONNE ACTION] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPConfirmSuppressYes, page);
                    })

                    test ('Button [RE-CONFIRMER SUPPRIMER GAMME COLONNE ACTION (RECOMM. OUV)] - Click', async () => {
                        await fonction.clickAndWait(pageGammes.pPReConfirmSuppress.nth(1), page);
                    })

                    test ('Popin [' + sNomPopin4.toUpperCase() + '] - Is Hidden', async () => {
                        await fonction.popinVisible(page, sNomOnglet, false); //expect no error : gamme is deleted
                    })
                        
                })

                test ('td [' + sDesignationDel4 + '] - Is NOT Visible', async () => {
                    const filteredRows = pageGammes.gammeRowsDesignation.filter({ hasText: sDesignationDel4 });
                    expect(await filteredRows.count()).toEqual(0); //expect it doesnt exist anymore
                })

            })

        })

        test.describe ('Onglet [RECOMMANDATION D\'OUVERTURE]', async () => {

            var sNomOnglet = 'recomOuverture';
            test ('Onglet [RECOMMANDATIONS D\'OUVERTURE] - Click', async () => {
                await menu.clickOnglet(sPageName, sNomOnglet, page);
            })

            gammesDetailsRecommended.forEach((gamme, index) => {

                test ('ListBox [GROUPE ARTICLE] = "' + gamme.sGroupeArticle + '"', async () => {
                    await fonction.ngClickListBox(pageRecomOuverture.listBoxGroupeArticle, gamme.sGroupeArticle, pageRecomOuverture.listBoxChoixGroupeArticle);
                    await fonction.waitTillHTMLRendered(page);
                });

                test ('Datagrid [VALUES] - Check Not Visible  #' + index + ' ', async () => {
                    const thSubHeaders = pageRecomOuverture.dataGridListeRecomSub;
                    const thSubHeadersCount = await thSubHeaders.count();
                    let bFound = false;

                    for (let iCpt = 0; iCpt < thSubHeadersCount; iCpt++) {
                        const sTextContent = await thSubHeaders.nth(iCpt).textContent();
                        if (sTextContent?.trim() === gamme.sDesignation.trim()) {
                            bFound = true;
                            break;
                        }
                    }

                    //Expect to have found it 
                    expect(bFound).toBe(false)
                });

            })

        })
		
    })

    test ('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})