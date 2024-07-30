/**
 * 
 * @author JC CALVIERA
 *  Since 2024-02-21
 */

const xRefTest      = "MAG_ECH_ADD";
const xDescription  = "Création d'une Autorisation de demande d'échange";
const xIdTest       =  2704;
const xVersion      = '3.0';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['Précurseur de [MAG_ECH_DEL]'],
    params      : [],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

import { MenuMagasin }              from '@pom/MAG/menu.page';
import { AutorisationsEchanges }    from '@pom/MAG/autorisations-echanges.page';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageEchange     : AutorisationsEchanges;

const log           = new Log();
const fonction      = new TestFunctions(log);

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage(); 
    menu        = new MenuMagasin(page, fonction);
    pageEchange = new AutorisationsEchanges(page);
});

test.afterAll(async () => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [AUTORISATIONS]', async () => {

        test('Link [BROWSER SECURITY WARNING] - Click', async () => {
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

        var sNomPage = 'autorisations';

        test('Page [AUTORISATIONS] - Click', async () => {
            await menu.click(sNomPage, page);
        }) 

        test.describe('Onglet [ECHANGES]', async () => {

            test ('Onglet [ECHANGES] - Click', async () =>  {
                await menu.clickOnglet(sNomPage, 'echanges', page);
            }) 

            test('Label [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            const aCouplesMagasins = fonction.getLocalConfig('aAutoriEchanges');
            var iIndex  = 0;

            aCouplesMagasins.forEach(function(aCouple:any){

                var sMagCedant  = aCouple[0];
                var sMagCible   = aCouple[1];
                iIndex++;

                test.describe('Itération [#' + iIndex + ']', async () => {

                    test('InputField [MAGASIN CEDANT #' + iIndex + ']  - Clear', async () => {
                        await pageEchange.inputMagasinCedant.clear();
                    })

                    test('InputField [MAGASIN CEDANT #' + iIndex + '] = "' + sMagCedant + '"', async () => {
                        
                        log.set('Traitement association : '+ sMagCedant + ' --> ' + sMagCible);

                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageEchange.inputMagasinCedant,
                            inputValue      : sMagCedant,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                        await fonction.wait(page, 1000);        // On attend le raffraîchissement de la page
                    })


                    test('InputField [MAGASIN CIBLE #' + iIndex + '] = "' + sMagCible + '"', async () => {
                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageEchange.inputMagasinCible,
                            inputValue      : sMagCible,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                    })

                    test('Button [ + ] - Click #' + iIndex + '', async () => {
                        await fonction.clickElement(pageEchange.buttonPlus);
                    })

                    test('td [CODE]["'+sMagCible+'"] - Is Visible', async () => {
                        await expect(pageEchange.tdListeCodeMagCible.getByText(sMagCible, { exact: true })).toBeVisible();                        
                    })

                })

            })

        })

    })

    test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	});

})