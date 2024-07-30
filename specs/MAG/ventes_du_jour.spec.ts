/**
 * 
 * @author JC CALVIERA
 *  Since 2024-04-10
 */

const xRefTest      = "MAG_VTE_JRN";
const xDescription  = "Lister les ventes d'une journée";
const xIdTest       =  100;
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

import { test, type Page, expect }  from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { VentesJournee }            from '@pom/MAG/ventes-journee.page';

import { CartoucheInfo }            from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageVentes      : VentesJournee;

const log           = new Log();
const fonction      = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

const sNomVille     = fonction.getInitParam('ville', 'Tours (G182)');

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage(); 
    menu        = new MenuMagasin(page, fonction);
    pageVentes = new VentesJournee(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
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

        var sNomPage = 'ventes';

        test ('Page [VENTES] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test ('ListBox [LIEU DE VENTE] = "' + sNomVille + '"', async () => {
            await menu.selectVille(sNomVille, page);
        })

        test ('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        test ('RadioButton [PROMOTION] - Click', async() => {
            await fonction.clickElement(pageVentes.radioButtonPromotion);
        })

        test ('ListBox  [GROUPE ARTICLE] - Click', async() => {
            await fonction.clickElement(pageVentes.listBoxGrpArticle);
        })

        test ('CheckBox [GROUPE ARTICLE][first] - Click', async() => {
            await fonction.clickElement(pageVentes.checkBoxChoix.first());
            await fonction.clickElement(pageVentes.pictoCloseSelect);
        })

        test ('RadioButton [RECHERCHER] - Click', async() => {
            await fonction.clickAndWait(pageVentes.buttonRechecher, page);
        })

        test ('Label [Montant TTC total des ventes] > 0 €', async() =>{

            await pageVentes.labelTotalDesVentes.waitFor({state:'visible'});

            let now = new Date();
            let firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            let iNumOfDay = firstDayPrevMonth.getDay();     // The getDay() method returns the day of the week (from 0 to 6) of a date.

            if (iNumOfDay > 0) {
                
                const sTexte = await pageVentes.labelTotalDesVentes.textContent();
                log.set(fonction.cleanTexte(sTexte));
                log.set('Depuis le  : ' + firstDayPrevMonth);
                const aBouts = sTexte.split(' : ');
                const iMontant = Number(aBouts[1].replace(/[^0-9.-]+/g,""))
                expect(iMontant).toBeGreaterThan(0);
                
            } else {
                log.set('Date choisie tombant un dimanche... Risque d\'absence de valeurs');
            }

        })

    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})