/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-10
 */

const xRefTest      = "MAG_IMP_DEZ";
const xDescription  = "Suppression d'une zone d'implantation";
const xIdTest       =  3996;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { Stockimplantation }        from '@pom/MAG/stock-implantation.page';

import { CartoucheInfo }            from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageImplant     : Stockimplantation;

const log           = new Log();
const fonction      = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const sNomVille     = fonction.getInitParam('ville', 'Tours (G182)');
const sNomZone      = 'TA_Zone-' + fonction.getToday('US');

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    menu        = new MenuMagasin(page, fonction);
    pageImplant = new Stockimplantation(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test ('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [STOCK]', async () => {

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

        var sNomPage = 'stock';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })

        test.describe('Onglet [IMPLANTATION]', async () => {

            test ('Onglet [IMPLANTATION] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, 'implantation', page);
            }) 

            test ('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('ListBox [ZONE] select "' + sNomZone + '"', async () => {
                await pageImplant.listBoxRayon.selectOption(sNomZone);
            })

            test ('Button [SUPPRIMER ZONE] - Click', async () => {
                await fonction.clickElement(pageImplant.buttonZoneSupprimer);
            })

            var sNomPopin = "Confirmation de la suppression d'une zone d'implantation";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + '] >', async() => {

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('Button [CONFIRMER] - Click', async () => {
                    await fonction.clickElement(pageImplant.pPbuttonSupprConfirmer);
                })
                
                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Hidden - Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })

            })

        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})